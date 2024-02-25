import { DescribeInstancesCommand, DescribeInstancesCommandInput, DescribeInstancesCommandOutput, EC2Client, Instance, Reservation, RunInstancesCommand, RunInstancesCommandInput } from "@aws-sdk/client-ec2";
import { fromEnv } from "@aws-sdk/credential-providers";
import { CreateInstanceInput } from "./ec2-types";
import { elasticBlockStoresToBlockDeviceMappings } from "../ebs/ebs-types";
import { logger } from "../../../logging/logging";
import db from "../../../db/db";
import { Ec2Instance } from "@deisi25/types";
import { mapAwsEc2InstancesToLocal } from "./ec2-utils";

const client: EC2Client = new EC2Client({
	credentials: fromEnv(),
	region: 'eu-west-2',
});

/**
* Create instance of an EC2 resource.
* @param input Create instance data
* @returns Created instace details
*/
export async function createEC2Instance(input: CreateInstanceInput): Promise<Instance | null> {
	const runInstanceInput: RunInstancesCommandInput = {
		ImageId: input.AMI,
		InstanceType: input.InstanceType,
		TagSpecifications: [
			{
				ResourceType: 'instance',
				Tags: [
					{
						Key: 'name',
						Value: input.InstanceName,
					}
				]
			}
		],
		BlockDeviceMappings: elasticBlockStoresToBlockDeviceMappings(input.StorageDevices),
		MinCount: 1,
		MaxCount: 1
	};

	const runInstancesCommand = new RunInstancesCommand(runInstanceInput);

	try {
		const response = await client.send(runInstancesCommand);
		const createdInstanceData: Instance | undefined = response.Instances?.at(0);

		if (!createdInstanceData) return null;
		return createdInstanceData;
	} catch (err) {
		logger.error(`EC2 Instance Creation Failed: ${err}`);
		return null;
	}
}


/**
 * Get existing EC2 instances.
 * @param maxResults Max number of instances to return
 * @returns List of EC2 instances
 */
export async function getEC2Instances(maxResults: number | undefined): Promise<Ec2Instance[] | null> {
	// get instances AWS IDs from the database
	const query = await db.query(
		'SELECT aws_resource_id FROM resources WHERE active = TRUE LIMIT $1',
		[ maxResults ]
	);

	if (query.rows.length === 0) return [];

	const awsInstanceIds = query.rows.map((row) => row.aws_resource_id);
	const instancesOutput: Instance[] = [];

	// get instances data from AWS
	const describeInstancesInput: DescribeInstancesCommandInput = {
		InstanceIds: awsInstanceIds
	};
	const describeInstancesCommand = new DescribeInstancesCommand(describeInstancesInput);

	try {
		const res: DescribeInstancesCommandOutput = await client.send(describeInstancesCommand);
		const reservations: Reservation[] = res.Reservations || [];
		for (let i = 0; i < reservations.length; i++) {
			const reservationInstances = reservations[i].Instances || [];

			for (let j = 0; j < reservationInstances.length; j++) {
				instancesOutput.push(reservationInstances[j]);
			}
		}
	} catch (err) {
		logger.error(`Failed to get EC2 instances: ${err}`);
		return null;
	}

	// parse instances data
	return mapAwsEc2InstancesToLocal(instancesOutput);
}
