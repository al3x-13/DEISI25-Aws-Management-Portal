import { EC2Client, Instance, RunInstancesCommand, RunInstancesCommandInput, TerminateInstancesCommand, TerminateInstancesCommandInput } from "@aws-sdk/client-ec2";
import express, { Request, Response } from "express";
import { ApiError } from "../../../../utils/errors";
import { fromEnv } from "@aws-sdk/credential-providers";
import { logger } from "../../../../logging/logging";
import dotenv from "dotenv";
import { createEC2Instance } from "../../../../lib/resources/ec2/ec2-manager";
import { CreateInstanceInput } from "../../../../lib/resources/ec2/ec2-types";

const ec2Controller = express.Router();


dotenv.config();

const client = new EC2Client({
	credentials: fromEnv(),
	region: 'eu-west-2'
});

ec2Controller.get('/', (_req: Request, res: Response) => {
	res.send('ec2 working');
});

ec2Controller.post('/create', async (req: Request, res: Response) => {
	const { name, ami, instance_type, storage_type, storage_size_GiB } = req.body;

	if (!name) {
		const error = new ApiError('EC2 Request Failed', "Missing 'name' field");
		res.status(400).json(error.toJSON());
		return;
	}

	if (!instance_type) {
		const error = new ApiError('EC2 Request Failed', "Missing 'instance_type' field");
		res.status(400).json(error.toJSON());
		return;
	}

	if (!ami) {
		const error = new ApiError('EC2 Request Failed', "Missing 'ami' field");
		res.status(400).json(error.toJSON());
		return;
	}

	if (!storage_type) {
		const error = new ApiError('EC2 Request Failed', "Missing 'storage_type' field");
		res.status(400).json(error.toJSON());
		return;
	}

	if (!storage_size_GiB) {
		const error = new ApiError('EC2 Request Failed', "Missing 'storage_size_GiB' field");
		res.status(400).json(error.toJSON());
		return;
	}

	const instanceInput: CreateInstanceInput = {
		InstanceName: name,
		InstanceType: instance_type,
		AMI: ami,
		StorageDevices: [
			{
				Name: '/dev/sda1',
				VolumeType: storage_type,
				VolumeSizeGiB: storage_size_GiB,
			},
		]
	};

	const createdInstance = await createEC2Instance(instanceInput);

	if (!createdInstance) {
		const error = new ApiError('EC2 Instance Creation Failed', 'Could not create instance');
		res.status(500).json(error.toJSON());
		return;
	}

	res.status(200).json({ instance: createdInstance });
	return;
});

ec2Controller.post('/terminate', async (req: Request, res: Response) => {
	const { instance_ids } = req.body;
	const terminateInput: TerminateInstancesCommandInput = {
		InstanceIds: instance_ids,
	};

	const terminateCommand = new TerminateInstancesCommand(terminateInput);
	try {
		await client.send(terminateCommand);
		res.send(`Instances [${instance_ids}] successfully terminated.`);
		return;
	} catch (err) {
		logger.error(`Failed to terminate EC2 instances: ${err}`);
		const error = new ApiError('EC2 Instance Termination Failed', 'Could not terminate instances');
		res.status(500).json(error.toJSON());
		return;
	}
});

export default ec2Controller;
