import { BlockDeviceMapping } from "@aws-sdk/client-ec2";

// Defines AWS Block Storage Volume Types
export enum EbsVolumeType {
	GeneralPurposeSSD_GP2 = "gp2",
	GeneralPurposeSSD_GP3 = "gp3",
	ProvisionedIOPSSD_IO1 = "io1",
	ProvisionedIOPSSD_IO2 = "io2",
	ThroughputOptimizesHDD_ST1 = "st1",
	ColdHDD_SC1 = "sc1",
	Magnetic_STANDARD = "standard"
};


export type ElasticBlockStore = {
	Name: string;
	VolumeType: EbsVolumeType;
	VolumeSizeGiB: number;
};


/**
 * Converts ElasticBlockStore type array to BlockDeviceMapping type array.
 * @param input Array of block stores
 * @returns Array of BlockDeviceMapping
 */
export function elasticBlockStoresToBlockDeviceMappings(input: ElasticBlockStore[]): BlockDeviceMapping[] {
	const blockDeviceMappings: BlockDeviceMapping[] = [];
	for (let i = 0; i < input.length; i++) {
		blockDeviceMappings.push({
			DeviceName: input[i].Name,
			Ebs: {
				VolumeType: input[i].VolumeType,
				VolumeSize: input[i].VolumeSizeGiB,
			}
		});
	}
	return blockDeviceMappings;
}
