import { ElasticBlockStore } from "../ebs/ebs-types";

export type CreateInstanceInput = {
	InstanceName: string;
	InstanceType: string;
	AMI: string;
	StorageDevices: ElasticBlockStore[];
};
