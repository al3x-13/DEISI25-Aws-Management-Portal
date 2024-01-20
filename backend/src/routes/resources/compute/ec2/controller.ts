import { EC2Client, Instance, RunInstancesCommand, RunInstancesCommandInput, TerminateInstancesCommand, TerminateInstancesCommandInput } from "@aws-sdk/client-ec2";
import express, { Request, Response } from "express";
import { ApiError } from "../../../../utils/errors";
import { fromEnv } from "@aws-sdk/credential-providers";
import { logger } from "../../../../logging/logging";
import dotenv from "dotenv";

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
	// TODO: body params validation

	const instanceInput: RunInstancesCommandInput = {
		ImageId: ami,
		InstanceType: instance_type,
		BlockDeviceMappings: [
			{
				DeviceName: '/dev/sda1',
				Ebs: {
					VolumeType: storage_type,
					VolumeSize: storage_size_GiB
				}
			}
		],
		TagSpecifications: [
			{
				ResourceType: 'instance',
				Tags: [
					{
						Key: 'name',
						Value: name,
					},
				],
			},
		],
		MinCount: 1,
		MaxCount: 1
	}

	const instanceCommand = new RunInstancesCommand(instanceInput);
	try {
		const response = await client.send(instanceCommand);
		const instances: Instance[] | undefined = response.Instances;
		res.status(200).json({ instance: instances?.at(0) });
		return;
	} catch (err) {
		console.log(err);
		const error = new ApiError('EC2 Instance Creation Failed', 'Could not create instance');
		res.status(500).json(error.toJSON());
		return;
	}
});

ec2Controller.post('/terminate', async (req: Request, res: Response) => {
	const { instance_ids } = req.body;
	const terminateInput: TerminateInstancesCommandInput = {
		InstanceIds: instance_ids,
	};

	const terminateCommand = new TerminateInstancesCommand(terminateInput);
	try {
		const response = await client.send(terminateCommand);
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
