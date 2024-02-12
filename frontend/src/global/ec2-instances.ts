import { ec2Contract, Ec2State, type Ec2Instance } from "@deisi25/types";
import { initClient } from "@ts-rest/core";

const client = initClient(ec2Contract, {
	baseUrl: 'http://localhost:3000',
	baseHeaders: {
		'Content-Type': 'application/json'
	},
	credentials: 'include'
});


export async function listInstancesClientSide(): Promise<Ec2Instance[] | []> {
	const { status, body } = await client.listInstaces({
		query: {
			maxResults: 30
		}
	});

	if (status !== 200) {
		return [];
	}
	return body.instances as Ec2Instance[];
}

export async function startInstance(instanceId: number): Promise<Ec2State | undefined> {
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

export async function stopInstance(instanceId: number): Promise<Ec2State | undefined> {
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

export async function rebootInstance(instanceId: number): Promise<Ec2State | undefined> {
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


export async function terminateInstance(instanceId: number): Promise<boolean> {
	const { status } = await client.terminate({
		body: {
			instanceIds: [instanceId]
		}
	});

	return status === 201;
}
