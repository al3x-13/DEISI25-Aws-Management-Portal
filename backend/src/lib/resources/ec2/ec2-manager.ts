import { EC2Client, Instance, RunInstancesCommand, RunInstancesCommandInput } from "@aws-sdk/client-ec2";
import { fromEnv } from "@aws-sdk/credential-providers";
import { CreateInstanceInput } from "./ec2-types";
import { elasticBlockStoresToBlockDeviceMappings } from "../ebs/ebs-types";
import { logger } from "../../../logging/logging";

const client: EC2Client = new EC2Client({
	credentials: fromEnv(),
	region: 'eu-west-2',
});

async function createEC2Instance(input: CreateInstanceInput): Promise<Instance | null> {
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

export { createEC2Instance };
