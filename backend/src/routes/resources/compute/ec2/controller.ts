import { DescribeInstancesCommand, DescribeInstancesCommandInput, DescribeInstancesCommandOutput, EC2Client, Instance, InstanceStateChange, RebootInstancesCommand, RebootInstancesCommandInput, Reservation, StartInstancesCommand, StartInstancesCommandInput, StopInstancesCommand, StopInstancesCommandInput, TerminateInstancesCommand, TerminateInstancesCommandInput } from "@aws-sdk/client-ec2";
import express, { Request, Response } from "express";
import { ApiError } from "../../../../utils/errors";
import { fromEnv } from "@aws-sdk/credential-providers";
import { logger } from "../../../../logging/logging";
import dotenv from "dotenv";
import { createEC2Instance } from "../../../../lib/resources/ec2/ec2-manager";
import { CreateInstanceInput } from "../../../../lib/resources/ec2/ec2-types";
import { initServer } from "@ts-rest/express";
import { ec2Contract } from "types/index";
import { EbsVolumeType } from "backend/src/lib/resources/ebs/ebs-types";


dotenv.config();

const ec2ControllerDeprecated = express.Router();

const client = new EC2Client({
	credentials: fromEnv(),
	region: 'eu-west-2'
});

ec2ControllerDeprecated.get('/', (_req: Request, res: Response) => {
	res.send('ec2 working');
});

ec2ControllerDeprecated.post('/create', async (req: Request, res: Response) => {
	const { name, instanceType, ami, storageType, storageSizeGiB } = req.body;

	if (!name) {
		const error = new ApiError('EC2 Request Failed', "Missing 'name' field");
		res.status(400).json(error.toJSON());
		return;
	}

	if (!instanceType) {
		const error = new ApiError('EC2 Request Failed', "Missing 'instanceType' field");
		res.status(400).json(error.toJSON());
		return;
	}

	if (!ami) {
		const error = new ApiError('EC2 Request Failed', "Missing 'ami' field");
		res.status(400).json(error.toJSON());
		return;
	}

	if (!storageType) {
		const error = new ApiError('EC2 Request Failed', "Missing 'storageType' field");
		res.status(400).json(error.toJSON());
		return;
	}

	if (!storageSizeGiB) {
		const error = new ApiError('EC2 Request Failed', "Missing 'storageSizeGiB' field");
		res.status(400).json(error.toJSON());
		return;
	}

	const instanceInput: CreateInstanceInput = {
		InstanceName: name,
		InstanceType: instanceType,
		AMI: ami,
		StorageDevices: [
			{
				Name: '/dev/sda1',
				VolumeType: storageType,
				VolumeSizeGiB: storageSizeGiB,
			},
		]
	};

	const createdInstance = await createEC2Instance(instanceInput);

	if (!createdInstance) {
		const error = new ApiError('EC2 Instance Creation Failed', 'Could not create instance');
		res.status(500).json(error.toJSON());
		return;
	}

	logger.info(`New EC2 instance created (${createdInstance.InstanceId})`);
	res.status(201).json({ instance: createdInstance });
	return;
});

ec2ControllerDeprecated.post('/terminate', async (req: Request, res: Response) => {
	const { instance_ids } = req.body;

	// TODO: validate body parameter

	const terminateInput: TerminateInstancesCommandInput = {
		InstanceIds: instance_ids,
	};

	const terminateCommand = new TerminateInstancesCommand(terminateInput);
	try {
		const data = await client.send(terminateCommand);
		logger.info(`Terminate EC2 instances (${instance_ids})`);
		res.status(201).send(`Instances [${instance_ids}] successfully terminated.`);
		return;
	} catch (err) {
		logger.error(`Failed to terminate EC2 instances: ${err}`);
		const error = new ApiError('EC2 Instance Termination Failed', 'Could not terminate instances');
		res.status(500).json(error.toJSON());
		return;
	}
});

ec2ControllerDeprecated.get('/listInstances', async (req, res) => {
	const maxResultsParam = Number(req.query.maxResults);
	const validMaxResults = Number.isInteger(maxResultsParam) && maxResultsParam >= 1 && maxResultsParam < 100;
	const maxResults = validMaxResults ? maxResultsParam : 30;

	// return error when 'maxResults' is set but its format is not valid
	if (req.query.maxResults && !validMaxResults) {
		const error = new ApiError('Failed to get EC2 instances', "Invalid 'maxResults' query parameter format");
		res.status(400).json(error.toJSON());
		return;
	}

	const describeInstancesInput: DescribeInstancesCommandInput = {
		MaxResults: maxResults,
	};

	const describeInstancesCommand = new DescribeInstancesCommand(describeInstancesInput);
	const listedInstances: Instance[] = [];

	try {
		const output: DescribeInstancesCommandOutput = await client.send(describeInstancesCommand);
		const reservations: Reservation[] = output.Reservations || [];
		
		for (let i = 0; i < reservations.length; i++) {
			const reservationInstances = reservations[i].Instances || [];

			for (let j = 0; j < reservationInstances.length; j++) {
				listedInstances.push(reservationInstances[j]);
			}
		}
	} catch (err) {
		logger.error(`Failed to get EC2 instances: ${err}`);
		const error = new ApiError('EC2 Instance Listing Failed', 'Could not get instances');
		res.status(500).json(error.toJSON());
		return;
	}

	// temp type
	type OutInstance = {
		Id: string | undefined;
		InstanceName: string | undefined;
		InstanceType: string | undefined;
		AMI: string | undefined;
		State: string | undefined;
	}

	const tempOut: OutInstance[] = [];
	for (let i = 0; i < listedInstances.length; i++) {
		const current = listedInstances[i];

		tempOut.push({
			Id: current.InstanceId,
			InstanceName: current.Tags ? current.Tags[0].Value : '',
			InstanceType: current.InstanceType,
			AMI: current.ImageId,
			State: current.State?.Name,
		});
	}

	logger.info(`Listed EC2 instances (results: ${maxResults})`);
	res.status(200).json({ instances: tempOut });
	return;
});


ec2ControllerDeprecated.post('/start', async (req: Request, res: Response) => {
	const { instanceId } = req.body;

	if (!instanceId) {
		const error = new ApiError('Failed to start EC2 instances', "'instance_id' body parameter was not found");
		res.status(400).json(error.toJSON());
		return;
	}

	const startInstacesInput: StartInstancesCommandInput = {
		InstanceIds: [instanceId],
	};

	const startInstancesCommand = new StartInstancesCommand(startInstacesInput);
	let updatedInstances: InstanceStateChange[] | undefined;

	try {
		const output = await client.send(startInstancesCommand);
		updatedInstances = output.StartingInstances;
	} catch (err) {
		logger.error(`Failed to start EC2 instances: ${err}`);
		const error = new ApiError('EC2 Instance Start Failed', 'Could not start instance');
		res.status(500).json(error.toJSON());
		return;
	}

	if (!updatedInstances) {
		const error = new ApiError('EC2 Instance Start Failed', 'Could not start instance');
		res.status(500).json(error.toJSON());
		return;
	}

	logger.info(`EC2 instance state changed to 'running'`);
	res.status(201).json({ instanceState: updatedInstances.at(0)?.CurrentState?.Name });
	return;
});

ec2ControllerDeprecated.post('/stop', async (req: Request, res: Response) => {
	const { instance_id } = req.body;

	if (!instance_id) {
		const error = new ApiError('Failed to stop EC2 instances', "'instance_id' body parameter was not found");
		res.status(400).json(error.toJSON());
		return;
	}

	const stopInstacesInput: StopInstancesCommandInput = {
		InstanceIds: [instance_id],
	};

	const stopInstancesCommand = new StopInstancesCommand(stopInstacesInput);
	let updatedInstances: InstanceStateChange[] | undefined;

	try {
		const output = await client.send(stopInstancesCommand);
		updatedInstances = output.StoppingInstances;
	} catch (err) {
		logger.error(`Failed to stop EC2 instances: ${err}`);
		const error = new ApiError('EC2 Instance Stop Failed', 'Could not stop instance');
		res.status(500).json(error.toJSON());
		return;
	}

	if (!updatedInstances) {
		const error = new ApiError('EC2 Instance Stop Failed', 'Could not stop instance');
		res.status(500).json(error.toJSON());
		return;
	}

	logger.info(`EC2 instance state changed to 'stopped'`);
	res.status(201).json({ instanceState: updatedInstances.at(0)?.CurrentState?.Name });
	return;
});

ec2ControllerDeprecated.post('/reboot', async (req: Request, res: Response) => {
	const { instanceId } = req.body;

	if (!instanceId) {
		const error = new ApiError('Failed to reboot EC2 instances', "'instance_id' body parameter was not found");
		res.status(400).json(error.toJSON());
		return;
	}

	const rebootInstacesInput: RebootInstancesCommandInput = {
		InstanceIds: [instanceId],
	};

	const rebootInstancesCommand = new RebootInstancesCommand(rebootInstacesInput);

	try {
		await client.send(rebootInstancesCommand);
	} catch (err) {
		logger.error(`Failed to reboot EC2 instances: ${err}`);
		const error = new ApiError('EC2 Instance Reboot Failed', 'Could not reboot instance');
		res.status(500).json(error.toJSON());
		return;
	}

	logger.info(`EC2 instance state changed to 'rebooting'`);
	res.status(201).json({ instanceState: 'running' });
	return;
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

		if (!createdInstance) {
			const error = new ApiError('EC2 Instance Creation Failed', 'Could not create instance');
			return {
				status: 500,
				body: error.toJSON()
			}
		}

		logger.info(`New EC2 instance created (${createdInstance.InstanceId})`);
		return {
			status: 200,
			body: {
				instance: createdInstance
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

		const terminateInput: TerminateInstancesCommandInput = {
			InstanceIds: instanceIds,
		};

		const terminateCommand = new TerminateInstancesCommand(terminateInput);
		try {
			const data = await client.send(terminateCommand);
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
			const error = new ApiError('Failed to start EC2 instances', "'instance_id' body parameter was not found");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		const startInstacesInput: StartInstancesCommandInput = {
			InstanceIds: [instanceId],
		};

		const startInstancesCommand = new StartInstancesCommand(startInstacesInput);
		let updatedInstances: InstanceStateChange[] | undefined;

		try {
			const output = await client.send(startInstancesCommand);
			updatedInstances = output.StartingInstances;
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

		logger.info(`EC2 instance state changed to 'running'`);
		return {
			status: 201,
			body: {
				instanceState: updatedInstances.at(0)?.CurrentState?.Name
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

		const stopInstacesInput: StopInstancesCommandInput = {
			InstanceIds: [instanceId],
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

		logger.info(`EC2 instance state changed to 'stopped'`);
	
		return {
			status: 201,
			body: {
				instanceState: updatedInstances.at(0)?.CurrentState?.Name
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

		const rebootInstacesInput: RebootInstancesCommandInput = {
			InstanceIds: [instanceId],
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

		logger.info(`EC2 instance state changed to 'rebooting'`);

		return {
			status: 201,
			body: {
				instanceState: 'running'
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

		const describeInstancesInput: DescribeInstancesCommandInput = {
			MaxResults: maxResults,
		};

		const describeInstancesCommand = new DescribeInstancesCommand(describeInstancesInput);
		const listedInstances: Instance[] = [];

		try {
			const output: DescribeInstancesCommandOutput = await client.send(describeInstancesCommand);
			const reservations: Reservation[] = output.Reservations || [];
			
			for (let i = 0; i < reservations.length; i++) {
				const reservationInstances = reservations[i].Instances || [];

				for (let j = 0; j < reservationInstances.length; j++) {
					listedInstances.push(reservationInstances[j]);
				}
			}
		} catch (err) {
			logger.error(`Failed to get EC2 instances: ${err}`);
			const error = new ApiError('EC2 Instance Listing Failed', 'Could not get instances');
			return {
				status: 500,
				body: error.toJSON()
			}
		}

		// temp type
		type OutInstance = {
			Id: string | undefined;
			InstanceName: string | undefined;
			InstanceType: string | undefined;
			AMI: string | undefined;
			State: string | undefined;
		}

		const tempOut: OutInstance[] = [];
		for (let i = 0; i < listedInstances.length; i++) {
			const current = listedInstances[i];

			tempOut.push({
				Id: current.InstanceId,
				InstanceName: current.Tags ? current.Tags[0].Value : '',
				InstanceType: current.InstanceType,
				AMI: current.ImageId,
				State: current.State?.Name,
			});
		}

		logger.info(`Listed EC2 instances (results: ${maxResults})`);

		return {
			status: 200,
			body: {
				instances: tempOut
			}
		}
	}
});

export default ec2Controller;
