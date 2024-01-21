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
	State: string | undefined;
}


const ec2Instances = writable<Array<EC2_DATA>>([]);

function addInstance(instance: EC2_DATA) {
	ec2Instances.update(data => [...data, instance]);
}

function getInstances(): EC2_DATA[] {
	return get(ec2Instances);
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
