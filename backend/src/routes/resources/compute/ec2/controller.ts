import { DescribeImagesCommand, DescribeImagesCommandInput, DescribeImagesCommandOutput, DescribeInstanceTypesCommand, DescribeInstanceTypesCommandOutput, EC2Client, Image, InstanceStateChange, RebootInstancesCommand, RebootInstancesCommandInput, StartInstancesCommand, StartInstancesCommandInput, StopInstancesCommand, StopInstancesCommandInput, TerminateInstancesCommand, TerminateInstancesCommandInput } from "@aws-sdk/client-ec2";
import { ApiError } from "../../../../utils/errors";
import { fromEnv } from "@aws-sdk/credential-providers";
import { logger } from "../../../../logging/logging";
import dotenv from "dotenv";
import { createEC2Instance, getEC2Instances } from "../../../../lib/resources/ec2/ec2-manager";
import { CreateInstanceInput } from "../../../../lib/resources/ec2/ec2-types";
import { initServer } from "@ts-rest/express";
import { Ec2Image, Ec2ImageBaseOs, Ec2InstanceType, Ec2State, ResourceActionTypes, ResourceType, ec2Contract } from "@deisi25/types";
import { EbsVolumeType } from "../../../../lib/resources/ebs/ebs-types";
import { createResourceMetadata, deactivateResource, ec2InstanceNameExists } from "../../../../lib/resources/metadata";
import { getUserIdFromRequestCookies } from "../../../../auth/auth-utils";
import { awsEc2InstanceStateToLocalState, fetchAwsQuickstartImages, localResourceIdsToAwsResourceIds, mapAwsEc2InstancesToLocal, parseDisksInfoFromEc2InstanceType, parseEc2InstanceTypes } from "../../../../lib/resources/ec2/ec2-utils";
import { createResourceActionFromARI, createResourceActionFromLRI } from "../../../../lib/actions/resource-actions";


dotenv.config();

const client = new EC2Client({
	credentials: fromEnv(),
	region: 'eu-west-2'
});

const server = initServer();

const ec2Controller = server.router(ec2Contract, {
	create: async ({ req }) => {
		const { 
			name, 
			instanceType, 
			ami, 
			storageType, 
			storageSizeGiB 
		} = req.body;

		if (!name) {
			const error = new ApiError('EC2 Request Failed', "Missing 'name' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		if (!instanceType) {
			const error = new ApiError('EC2 Request Failed', "Missing 'instanceType' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		if (!ami) {
			const error = new ApiError('EC2 Request Failed', "Missing 'ami' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		if (!storageType) {
			const error = new ApiError('EC2 Request Failed', "Missing 'storageType' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		if (!storageSizeGiB) {
			const error = new ApiError('EC2 Request Failed', "Missing 'storageSizeGiB' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		const instanceInput: CreateInstanceInput = {
			InstanceName: name,
			InstanceType: instanceType,
			AMI: ami,
			StorageDevices: [
				{
					Name: '/dev/sda1',
					VolumeType: storageType as EbsVolumeType,
					VolumeSizeGiB: storageSizeGiB,
				},
			]
		};

		const createdInstance = await createEC2Instance(instanceInput);
		const createdInstanceId = createdInstance?.InstanceId;

		if (!createdInstance || !createdInstanceId) {
			const error = new ApiError('EC2 Instance Creation Failed', 'Could not create instance');
			return {
				status: 500,
				body: error.toJSON()
			}
		}

		const userId = getUserIdFromRequestCookies(req);

		// application metadata
		await createResourceMetadata(ResourceType.EC2, name, createdInstanceId || '', undefined, userId);
		createResourceActionFromARI(ResourceActionTypes.Ec2CreateInstance, createdInstanceId, userId);

		const localInstance = (await mapAwsEc2InstancesToLocal([ createdInstance ]))[0];

		logger.info(`New EC2 instance created (${createdInstance.InstanceId})`);
		return {
			status: 201,
			body: {
				instance: localInstance
			}
		}
	},
	terminate: async ({ req }) => {
		const { instanceIds } = req.body;

		if (!instanceIds) {
			const error = new ApiError('EC2 Request Failed', "Missing 'instanceIds' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		// get aws resource id
		const awsResourceIds = await localResourceIdsToAwsResourceIds(instanceIds);
		if (!awsResourceIds) {
			const error = new ApiError('Failed to terminate EC2 instances', "The provided 'instanceIds' do not exist");
			return {
				status: 404,
				body: error.toJSON()
			}
		}

		const terminateInput: TerminateInstancesCommandInput = {
			InstanceIds: awsResourceIds,
		};

		const userId = getUserIdFromRequestCookies(req);
		const terminateCommand = new TerminateInstancesCommand(terminateInput);
		try {
			await client.send(terminateCommand);
			await deactivateResource(instanceIds);  // delete metadata
			for (let i = 0; i < instanceIds.length; i++) {
				createResourceActionFromLRI(ResourceActionTypes.Ec2TerminateInstance, instanceIds[i], userId);
			}
			logger.info(`Terminate EC2 instances (${instanceIds})`);

			return {
				status: 201,
				body: `Instances [${instanceIds}] successfully terminated.`
			}
		} catch (err) {
			logger.error(`Failed to terminate EC2 instances: ${err}`);
			const error = new ApiError('EC2 Instance Termination Failed', 'Could not terminate instances');
			return {
				status: 500,
				body: error.toJSON()
			}
		}
	},
	start: async ({ req }) => {
		const { instanceId } = req.body;

		if (!instanceId) {
			const error = new ApiError('Failed to start EC2 instance', "'instance_id' body parameter was not found");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		// get aws resource id
		const awsResourceId = (await localResourceIdsToAwsResourceIds([ instanceId ]))[0];
		if (!awsResourceId) {
			const error = new ApiError('Failed to start EC2 instance', "The proviced 'instance_id' does not exist");
			return {
				status: 404,
				body: error.toJSON()
			}
		}

		const startInstacesInput: StartInstancesCommandInput = {
			InstanceIds: [ awsResourceId ],
		};

		const startInstancesCommand = new StartInstancesCommand(startInstacesInput);
		let updatedInstances: InstanceStateChange[] | undefined;

		try {
			const output = await client.send(startInstancesCommand);
			updatedInstances = output.StartingInstances;
			const userId = getUserIdFromRequestCookies(req);
			createResourceActionFromLRI(ResourceActionTypes.Ec2StartInstance, instanceId, userId);
		} catch (err) {
			logger.error(`Failed to start EC2 instances: ${err}`);
			const error = new ApiError('EC2 Instance Start Failed', 'Could not start instance');
			return {
				status: 500,
				body: error.toJSON()
			}
		}

		if (!updatedInstances) {
			const error = new ApiError('EC2 Instance Start Failed', 'Could not start instance');
			return {
				status: 500,
				body: error.toJSON()
			}
		}

		// validate instance
		const instanceState = awsEc2InstanceStateToLocalState(updatedInstances.at(0)?.CurrentState);
		if (instanceState === undefined) {
			const error = new ApiError('EC2 Instance Start Failed', 'Could not start instance');
			return {
				status: 500,
				body: error.toJSON()
			}
		}

		logger.info(`EC2 instance state changed to 'running'`);
		return {
			status: 201,
			body: {
				instanceState: instanceState
			}
		}
	},
	stop: async ({ req }) => {
		const { instanceId } = req.body;

		if (!instanceId) {
			const error = new ApiError('Failed to stop EC2 instances', "'instance_id' body parameter was not found");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		// get aws resource id
		const awsResourceId = (await localResourceIdsToAwsResourceIds([ instanceId ]))[0];
		if (!awsResourceId) {
			const error = new ApiError('Failed to stop EC2 instance', "The proviced 'instance_id' does not exist");
			return {
				status: 404,
				body: error.toJSON()
			}
		}

		const stopInstacesInput: StopInstancesCommandInput = {
			InstanceIds: [ awsResourceId ],
		};

		const stopInstancesCommand = new StopInstancesCommand(stopInstacesInput);
		let updatedInstances: InstanceStateChange[] | undefined;

		try {
			const output = await client.send(stopInstancesCommand);
			updatedInstances = output.StoppingInstances;
		} catch (err) {
			logger.error(`Failed to stop EC2 instances: ${err}`);
			const error = new ApiError('EC2 Instance Stop Failed', 'Could not stop instance');
			return {
				status: 500,
				body: error.toJSON()
			}
		}

		if (!updatedInstances) {
			const error = new ApiError('EC2 Instance Stop Failed', 'Could not stop instance');
			return {
				status: 500,
				body: error.toJSON()
			}
		}

		// validate instance
		const instanceState = awsEc2InstanceStateToLocalState(updatedInstances.at(0)?.CurrentState);
		if (instanceState === undefined) {
			const error = new ApiError('EC2 Instance Start Failed', 'Could not start instance');
			return {
				status: 500,
				body: error.toJSON()
			}
		}

		const userId = getUserIdFromRequestCookies(req);
		createResourceActionFromLRI(ResourceActionTypes.Ec2StopInstance, instanceId, userId);

		logger.info(`EC2 instance state changed to 'stopped'`);
		return {
			status: 201,
			body: {
				instanceState: instanceState
			}
		}
	},
	reboot: async ({ req }) => {
		const { instanceId } = req.body;

		if (!instanceId) {
			const error = new ApiError('Failed to reboot EC2 instances', "'instance_id' body parameter was not found");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		// get aws resource id
		const awsResourceId = (await localResourceIdsToAwsResourceIds([ instanceId ]))[0];
		if (!awsResourceId) {
			const error = new ApiError('Failed to reboot EC2 instance', "The proviced 'instance_id' does not exist");
			return {
				status: 404,
				body: error.toJSON()
			}
		}

		const rebootInstacesInput: RebootInstancesCommandInput = {
			InstanceIds: [ awsResourceId ],
		};

		const rebootInstancesCommand = new RebootInstancesCommand(rebootInstacesInput);

		try {
			await client.send(rebootInstancesCommand);
		} catch (err) {
			logger.error(`Failed to reboot EC2 instances: ${err}`);
			const error = new ApiError('EC2 Instance Reboot Failed', 'Could not reboot instance');
			return {
				status: 500,
				body: error.toJSON()
			}
		}

		const userId = getUserIdFromRequestCookies(req);
		createResourceActionFromLRI(ResourceActionTypes.Ec2RebootInstance, instanceId, userId);

		logger.info(`EC2 instance state changed to 'pending'`);

		return {
			status: 201,
			body: {
				instanceState: Ec2State.PENDING
			}
		}
	},
	validateInstanceName: async ({ req }) => {
		const instanceName = req.body.instanceName;
		let validName = true;

		if (await ec2InstanceNameExists(instanceName)) {
			validName = false;
		}

		const validFmt = /[^a-zA-Z0-9-]/;
		if (validFmt.test(instanceName)) {
			validName = false;
		}

		return {
			status: 200,
			body: {
				valid: validName
			}
		}
	},
	listInstaces: async ({ req }) => {
		const maxResultsParam = Number(req.query.maxResults);
		const validMaxResults = Number.isInteger(maxResultsParam) && maxResultsParam >= 1 && maxResultsParam < 100;
		const maxResults = validMaxResults ? maxResultsParam : 30;

		// return error when 'maxResults' is set but its format is not valid
		if (req.query.maxResults && !validMaxResults) {
			const error = new ApiError(
				'Failed to get EC2 instances', 
				"Invalid 'maxResults' query parameter format"
			);
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		// get instances
		const instancesData = await getEC2Instances(maxResults);

		if (instancesData == null) {
			const error = new ApiError('EC2 Instance Listing Failed', 'Could not get instances');
			return {
				status: 500,
				body: error.toJSON()
			}
		}

		logger.info(`Listed EC2 instances (results: ${maxResults})`);

		return {
			status: 200,
			body: {
				instances: instancesData
			}
		}
	},
	listImages: async ({ req }) => {
		const baseOs = req.query.baseOs;

		if (!Object.values(Ec2ImageBaseOs).includes(baseOs as Ec2ImageBaseOs)) {
			const error = new ApiError(
				'Failed to get EC2 images',
				"Invalid 'baseOs' query parameter"
			);
			return {
				status: 400,
				body: error.toJSON()
			}
		}


		const suseLinuxInputValues = [ "*suse*", "*SLES*" ];

		let nextPaginationToken: string | undefined;
		const describeImagesInput: DescribeImagesCommandInput = {
			Filters: [
				{
					Name: 'name',
					Values: baseOs === Ec2ImageBaseOs.SuseLinux 
						? suseLinuxInputValues 
						: [ `*${baseOs}*` ]
				},
				{
					Name: 'state',
					Values: [
						'available'
					]
				},
			],
			IncludeDeprecated: false,
			MaxResults: 1000,
			NextToken: nextPaginationToken,
		};

		const describeImagesCommand = new DescribeImagesCommand(describeImagesInput);
		let outputImages: Image[] = [];

		try {
			while (outputImages.length < 30) {
				const response: DescribeImagesCommandOutput = await client.send(describeImagesCommand);

				if (response.NextToken === null) break;

				if (response.Images) {
					for (let i = 0; i < response.Images.length; i++) {
						if (outputImages.length >= 30) break;
						outputImages.push(response.Images[i]);
					}
				}
				nextPaginationToken = response.NextToken;
			}
		} catch (err) {
			logger.error(`Failed to get EC2 images: ${err}`);
			const error = new ApiError('EC2 Images fetch failed', 'Could not fetch images');
			return {
				status: 500,
				body: error.toJSON()
			}
		}

		const images: Ec2Image[] = [];
		outputImages.forEach((img) => {
			images.push({
				State: img.State!,
				Name: img.Name!,
				Description: img.Description!,
				ImageId: img.ImageId!,
				Architecture: img.Architecture!,
				ImageType: img.ImageType!,
				KernelId: img.KernelId!,
				VirtualizationType: img.VirtualizationType!,
				OwnerId: img.OwnerId!,
			});
		});

		return {
			status: 200,
			body: {
				images: images,
				nextPaginationToken: nextPaginationToken,
			}
		}
	},
	listQuickstartImages: async ({ req }) => {
		const baseOs = req.query.baseOs;

		if (!Object.values(Ec2ImageBaseOs).includes(baseOs as Ec2ImageBaseOs)) {
			const error = new ApiError(
				'Failed to get EC2 images',
				"Invalid 'baseOs' query parameter"
			);
			return {
				status: 400,
				body: error.toJSON()
			}
		}


		const amis: Ec2Image[] =  await fetchAwsQuickstartImages(baseOs as Ec2ImageBaseOs);
		
		return {
			status: 200,
			body: {
				amis: amis
			}
		}
	},
	listInstanceTypes: async ({ req }) => {
		let response: DescribeInstanceTypesCommandOutput;
		let nextPagToken: string | undefined;
		let instanceTypes: Ec2InstanceType[] = [];

		try {
			while (true) {
				const command: DescribeInstanceTypesCommand = new DescribeInstanceTypesCommand({ MaxResults: 100, NextToken: nextPagToken });
				response = await client.send(command);
				instanceTypes = [...instanceTypes, ...parseEc2InstanceTypes(response)];

				if (response.NextToken == null) break;
				nextPagToken = response.NextToken;
			}
		} catch (err) {
			logger.error(`Failed to get EC2 instance types: ${err}`);
			const error = new ApiError('EC2 instance types fetch failed', 'Could not fetch instance types');
			return {
				status: 500,
				body: error.toJSON()
			}
		}

		// sort by 'Free tier' first
		instanceTypes.sort((a, b) => Number(b.FreeTier) - Number(a.FreeTier));

		return {
			status: 200,
			body: {
				instanceTypes: instanceTypes
			}
		}
	}
});

export default ec2Controller;
