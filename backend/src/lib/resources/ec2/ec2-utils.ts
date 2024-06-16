import { Instance, InstanceBlockDeviceMapping, InstanceState, InstanceStateName } from "@aws-sdk/client-ec2";
import db from "../../../db/db";
import { BlockStorageDevice, BlockStorageDeviceSchema, Ec2Image, Ec2ImageBaseOs, Ec2Instance, Ec2InstanceSchema, Ec2State } from "@deisi25/types";

/**
 * Map AWS EC2 instances data to local EC2 instances data.
 * @param instances AWS EC2 instances
 * @returns Local EC2 instances
 */
export async function mapAwsEc2InstancesToLocal(instances: Instance[]): Promise<Ec2Instance[]> {
	if (instances.length === 0) return [];

	const queryPlaceholders = instances.map((_, idx) => `$${idx + 1}`).join(', ');
	const awsInstanceIds: string[] = instances.map((inst) => inst.InstanceId ? inst.InstanceId : '');

	// get additional local data from the database
	const query = await db.query(
		`SELECT aws_resource_id, id, name, tags FROM resources WHERE aws_resource_id IN (${queryPlaceholders})`,
		awsInstanceIds
	);

	// dict for easy of search
	const localInstancesData: Map<string, { id: number, name: string, tags: string[] }> = new Map();
	for (let i = 0; i < query.rows.length; i++) {
		const item = query.rows[i];
		localInstancesData.set(
			item.aws_resource_id, 
			{ id: item.id, name: item.name, tags: item.tags }
		);
	}

	// parse instances to local type
	const localInstances: Ec2Instance[] = [];

	for (let i = 0; i < instances.length; i++) {
		const inst = instances[i];
		const localInstData = localInstancesData.get(inst.InstanceId || '');

		localInstances.push(Ec2InstanceSchema.parse({
			LocalInstanceId: localInstData?.id || -1,
			AwsInstanceId: inst.InstanceId || '',
			InstanceName: localInstData?.name || '',
			AMI: inst.ImageId || '',
			State: awsEc2InstanceStateToLocalState(inst.State),
			BlockStorageDevices: awsEc2InstanceVolumesToLocalEc2Volumes(inst.BlockDeviceMappings),
			LaunchTime: inst.LaunchTime || new Date(Date.now()),
			Tags: localInstData?.tags || [],
		}));
	}
	return localInstances;
}


/**
* Parse AWS EC2 InstanceState to local EC2 states.
* @param instanceState AWS EC2 InstanceState
* @returns Local EC2 instance state
*/
export function awsEc2InstanceStateToLocalState(instanceState: InstanceState | undefined): Ec2State {
	switch (instanceState?.Name) {
		case InstanceStateName.pending || "pending":
			return Ec2State.PENDING;
		case InstanceStateName.running || "running":
			return Ec2State.RUNNING;
		case InstanceStateName.shutting_down || "shutting-down":
			return Ec2State.SHUTTING_DOWN;
		case InstanceStateName.stopped || "stopped":
			return Ec2State.STOPPED;
		case InstanceStateName.stopping || "stopping":
			return Ec2State.STOPPING;
		case InstanceStateName.terminated || "terminated":
			return Ec2State.TERMINATED;
		default:
			return Ec2State.UNKNOWN;
	}
}

/**
 * Parse AWS EC2 InstanceBlockDeviceMapping to local EC2 BlockStorage devices.
 * @param instanceVolumes AWS EC2 block devices
 * @returns Local EC2 block storage devices
 */
function awsEc2InstanceVolumesToLocalEc2Volumes(
	instanceVolumes: InstanceBlockDeviceMapping[] | undefined
): BlockStorageDevice[] {
	const storageDevices: BlockStorageDevice[] = [];

	if (!instanceVolumes) return [];

	for (let i = 0; i < instanceVolumes.length; i++) {
		const volume = instanceVolumes[i];

		storageDevices.push(BlockStorageDeviceSchema.parse({
			Name: volume.DeviceName || 'N/A',
			EbsVolumeId: volume.Ebs?.VolumeId || ''
		}));
	}

	return storageDevices;
}


/**
 * Get Local Resource ID (LRI) from AWS Resource ID (ARI).
 * @param awsResourceId AWS Resource ID
 * @returns Local Resource ID
 */
export async function awsResourceIdsToLocalResourceIds(awsResourceIds: string[]): Promise<number[]> {
	const queryPlaceholders = awsResourceIds.map((_, idx) => `$${idx + 1}`).join(', ');

	const query = await db.query(
		`SELECT id FROM resources WHERE aws_resource_id IN (${queryPlaceholders})`,
		[ awsResourceIds ]
	);

	return query.rows.map((row) => row.id as number);
}


/**
 * Get AWS Resource ID (ARI) from Local Resource ID (LRI).
 * @param awsResourceId Local Resource ID
 * @returns AWS Resource ID
 */
export async function localResourceIdsToAwsResourceIds(localResourceIds: number[]): Promise<string[]> {
	const queryPlaceholders = localResourceIds.map((_, idx) => `$${idx + 1}`).join(', ');
	const query = await db.query(
		`SELECT aws_resource_id FROM resources WHERE id IN (${queryPlaceholders})`,
		localResourceIds
	);

	return query.rows.map((row) => row.aws_resource_id as string);
}

export async function fetchAwsQuickstartImages(baseOs: Ec2ImageBaseOs): Promise<Ec2Image[]> {
	const quickstartAmisResource = 'https://prod.eu-west-1.qs.console.ec2.aws.dev/get_quickstart_list_en.json';

	const data = (await fetch(quickstartAmisResource).then((res) => res.json())).amiList;

	let platform = 'amazon';
	switch (baseOs) {
		case Ec2ImageBaseOs.Ubuntu:
			platform = 'ubuntu';
			break;
		case Ec2ImageBaseOs.Debian:
			platform = 'debian';
			break;
		case Ec2ImageBaseOs.Windows:
			platform = 'windows';
			break;
		case Ec2ImageBaseOs.RedHat:
			platform = 'rhel';
			break;
		case Ec2ImageBaseOs.SuseLinux:
			platform = 'suse';
			break;
		case Ec2ImageBaseOs.MacOS:
			platform = 'mac';
			break;
		default:
			platform = 'amazon'
	}

	const amis: Ec2Image[] = [];

	for (let i = 0; i < data.length; i++) {
		const ami = data[i];
		if (ami.platform.includes(platform)) {
			console.log(ami);

			if (ami.imageId64 !== undefined) {
				amis.push({
					Name: ami.title,
					Description: ami.description,
					ImageId: ami.imageId64,
					Architecture: 'x86_64',
					ImageType: 'N/A',
					KernelId: 'N/A',
					VirtualizationType: ami.virtualizationType,
					FreeTier: ami.freeTier,
					OwnerId: 'N/A',
					State: 'N/A',
				});
			}

			if (ami.imageIdArm64 !== undefined) {
				amis.push({
					Name: ami.title,
					Description: ami.description,
					ImageId: ami.imageIdArm64,
					Architecture: 'arm64',
					ImageType: 'N/A',
					KernelId: 'N/A',
					VirtualizationType: ami.virtualizationType,
					FreeTier: ami.freeTier,
					OwnerId: 'N/A',
					State: 'N/A',
				});
			}

			if (ami.architectures.length > 0) {
				for (var arch of ami.architectures) {
					amis.push({
						Name: ami.title,
						Description: ami.description,
						ImageId: arch.imageId,
						Architecture: arch.architectureType,
						ImageType: 'N/A',
						KernelId: 'N/A',
						VirtualizationType: ami.virtualizationType,
						FreeTier: ami.freeTier,
						OwnerId: 'N/A',
						State: 'N/A',
					});
				}
			}
		}
	}
	return amis;
}
