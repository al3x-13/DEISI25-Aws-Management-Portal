import { z } from "zod";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";

extendZodWithOpenApi(z);

export enum Ec2State {
	PENDING = "pending",
	RUNNING = "running",
	STOPPING = "stopping",
	STOPPED = "stopped",
	SHUTTING_DOWN = "shutting-down",
	TERMINATED = "terminated",
	UNKNOWN = "unknown"
};

export const BlockStorageDeviceSchema = z.object({
	Name: z.string(),
	EbsVolumeId: z.string()
});

export type BlockStorageDevice = z.infer<typeof BlockStorageDeviceSchema>;

export const Ec2InstanceSchema = z.object({
	LocalInstanceId: z.number().openapi({
		example: 4123
	}),
	AwsInstanceId: z.string().openapi({
		example: 'i-00e671f3a983c4131'
	}),
	InstanceName: z.string().openapi({
		example: 'Web Server'
	}),
	AMI: z.string().openapi({  // TODO: update this
		example: 'ami-0c55b159cbfafe1f0'
	}),
	State: z.nativeEnum(Ec2State).openapi({
		example: Ec2State.RUNNING
	}),
	BlockStorageDevices: z.array(BlockStorageDeviceSchema).openapi({
		example: [ { Name: 'Storage1', EbsVolumeId: 'vol-1234567890abcdef0' }, { Name: 'Storage1', EbsVolumeId: 'vol-u4398201748fnaeou0' } ]
	}),
	LaunchTime: z.date().openapi({
		example: new Date(Date.now())
	}),
	Tags: z.array(z.string()).openapi({
		example: [ 'webapp', 'important' ]
	})
}).openapi({
	title: 'EC2 Instance',
	description: 'Represents a local EC2 instance.'
});

export type Ec2Instance = z.infer<typeof Ec2InstanceSchema>;

export enum Ec2ImageBaseOs {
	AmazonLinux = "amazon-linux",
	MacOS = "macos",
	Ubuntu = "ubuntu",
	Windows = "windows",
	RedHat = "redhat",
	SuseLinux = "suse-linux",
	Debian = "debian"
};
const Ec2ImageBaseOsEnum = z.nativeEnum(Ec2ImageBaseOs);
export type Ec2ImageBaseOsEnum = z.infer<typeof Ec2ImageBaseOsEnum>;

export const Ec2ImageSchema = z.object({
	ImageId: z.string().openapi({
		example: 'ami-5731123e'
	}),
	Architecture: z.string().openapi({
		example: 'x86_64'
	}),
	ImageType: z.string().openapi({
		example: 'machine'
	}),
	KernelId: z.string().openapi({
		example: 'aki-88aa75e1'
	}),
	Name: z.string().openapi({
		example: 'Amazon Linux Image'
	}),
	OwnerId: z.string().openapi({
		example: '123456789012'
	}),
	State: z.string().openapi({
		example: 'available'
	}),
});

export type Ec2Image = z.infer<typeof Ec2ImageSchema>;
