import { get, writable } from "svelte/store";

export type EC2_DATA = {
	id: string;
	name: string;
	ami: string;
	instanceType: string;
	storageType: string;
	storageSizeGiB: number;
};


export type OutInstance = {
	Id: string | undefined;
	InstanceName: string | undefined;
	InstanceType: string | undefined;
	AMI: string | undefined;
	State: Ec2State | undefined;
}

export enum Ec2State {
	PENDING = "pending",
	RUNNING = "running",
	STOPPING = "stopping",
	STOPPED = "stopped",
	SHUTTING_DOWN = "shutting-down",
	TERMINATED = "terminated"
};


const ec2Instances = writable<Array<EC2_DATA>>([]);

function addInstance(instance: EC2_DATA) {
	ec2Instances.update(data => [...data, instance]);
}

function getInstances(): EC2_DATA[] {
	return get(ec2Instances);
}

export async function listInstancesClientSide(): Promise<OutInstance[] | []> {
	return await fetch(
		'http://localhost:3000/resources/compute/ec2/listInstances',
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: 'include',
		},
	).then(async (res) => {
		if (res.status !== 200) return [];

		const data: {instances: OutInstance[]} = await res.json();
		const instances: OutInstance[] = data.instances;
		return instances;
	});
}

export async function startInstance(instanceId: string): Promise<Ec2State | undefined> {
	return await fetch(
		'http://localhost:3000/resources/compute/ec2/start',
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ instance_id: instanceId }),
			credentials: 'include',
		},
	).then(async (res) => {
		if (res.status !== 201) return undefined;

		const data: { instance_state: Ec2State } = await res.json();
		return data.instance_state;
	});
}

export async function stopInstance(instanceId: string): Promise<Ec2State | undefined> {
	return await fetch(
		'http://localhost:3000/resources/compute/ec2/stop',
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ instance_id: instanceId }),
			credentials: 'include',
		},
	).then(async (res) => {
		if (res.status !== 201) return undefined;

		const data: { instance_state: Ec2State } = await res.json();
		return data.instance_state;
	});
}


async function terminateInstance(id: string): Promise<boolean> {
	return await fetch(
		"http://localhost:3000/resources/compute/ec2/terminate",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				instance_ids: [id],
			}),
			credentials: 'include',
		},
	).then(async (res) => {
		console.log('terminating');
		if (res.status === 200) {
			ec2Instances.update(data => data.filter(item => item.id !== id))
			console.log(getInstances());
			return true;
		}
		return false;
	});
}

export { ec2Instances, addInstance, getInstances, terminateInstance };
