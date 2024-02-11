export enum Ec2State {
	PENDING = "pending",
	RUNNING = "running",
	STOPPING = "stopping",
	STOPPED = "stopped",
	SHUTTING_DOWN = "shutting-down",
	TERMINATED = "terminated",
	UNKNOWN = "unknown"
};

export interface BlockStorageDevice {
	Name: string;
	EbsVolumeId: string; 
};

export interface Ec2Instance {
	LocalInstanceId: number;
	AwsInstanceId: string;
	InstanceName: string;
	AMI: string;  // TODO: update this
	State: Ec2State;
	BlockStorageDevices: BlockStorageDevice[];
	LaunchTime: Date;
	Tags: string[];
};
