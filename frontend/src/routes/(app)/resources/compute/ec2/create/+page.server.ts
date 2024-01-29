import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { addInstance, getInstances } from "../../../../../../global/ec2-instances";
import type { EC2_DATA } from "../../../../../../global/ec2-instances";
import { initClient } from "@ts-rest/core";
import { ec2Contract } from "@deisi25/types";


export const actions = {
	createInstance: async ({ request, cookies }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const instanceName = data.get('name');
		const ami = data.get('ami');
		const instanceType = data.get('instanceType');
		const storageType = data.get('storageType');
		const storageSize = data.get('storageSize');

		// await fetch(
		// 	"http://localhost:3000/resources/compute/ec2/create",
		// 	{
		// 		method: "POST",
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 			"Cookie": `token=${token}`,
		// 		},
		// 		body: JSON.stringify({
		// 			name: instanceName,
		// 			ami: ami,
		// 			instance_type: instanceType,
		// 			storage_type: storageType,
		// 			storage_size_GiB: storageSize,
		// 		}),
		// 	},
		// ).then(async (res) => {
		// 	const data = await res.json();
		//
		// 	if (res.status != 200) {
		// 		return fail(400, { success: false });
		// 	}
		//
		// 	const instance: EC2_DATA = {
		// 		id: data.instance.InstanceId,
		// 		name: data.instance.Tags.at(0).Value,
		// 		ami: data.instance.ImageId,
		// 		instanceType: data.instance.InstanceType,
		// 		storageType: storageType ? storageType.toString() : '',
		// 		storageSizeGiB: storageSize ? Number(storageSize) : -1,
		// 	};
		// 	addInstance(instance);
		// });

		if (!data || !instanceName || !ami || !instanceType || !storageType || !storageSize) {
			return { success: false };
		}

		const client = initClient(ec2Contract, {
			baseUrl: 'http://localhost:3000',
			baseHeaders: {
				'Content-Type': 'application/json',
				'Cookie': `token=${token}`
			}
		});

		const { status, body } = await client.create({
			body: {
				name: instanceName.toString(),
				instanceType: instanceType.toString(),
				ami: ami.toString(),
				storageType: storageType.toString(),
				storageSizeGiB: Number(storageSize)
			}
		});

		if (status === 200) {
			return { success: true };
		}
		return { success: false };
		// throw redirect(303, '/resources/compute/ec2');
	}
} satisfies Actions;
