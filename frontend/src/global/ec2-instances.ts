import { ec2Contract } from "@deisi25/types";
import { initClient } from "@ts-rest/core";
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

const client = initClient(ec2Contract, {
	baseUrl: 'http://localhost:3000',
	baseHeaders: {
		'Content-Type': 'application/json'
	},
	credentials: 'include'
});


export async function listInstancesClientSide(): Promise<OutInstance[] | []> {
	const { status, body } = await client.listInstaces({
		query: {
			maxResults: 30
		}
	});

	if (status !== 200) {
		return [];
	}
	return body.instances as OutInstance[];
}

export async function startInstance(instanceId: string): Promise<Ec2State | undefined> {
	const { status, body } = await client.start({
		body: {
			instanceId: instanceId
		}
	});

	if (status !== 201) {
		return undefined;
	}
	return body.instanceState as Ec2State;
}

export async function stopInstance(instanceId: string): Promise<Ec2State | undefined> {
	const { status, body } = await client.stop({
		body: {
			instanceId: instanceId
		}
	});

	if (status !== 201) {
		return undefined;
	}
	return body.instanceState as Ec2State;
}

export async function rebootInstance(instanceId: string): Promise<Ec2State | undefined> {
	const { status, body } = await client.reboot({
		body: {
			instanceId: instanceId
		}
	});

	if (status !== 201) {
		return undefined;
	}
	return body.instanceState as Ec2State;
}


async function terminateInstance(instanceId: string): Promise<boolean> {
	const { status } = await client.terminate({
		body: {
			instanceIds: [instanceId]
		}
	});

	return status === 201;
}

export { ec2Instances, addInstance, getInstances, terminateInstance };
