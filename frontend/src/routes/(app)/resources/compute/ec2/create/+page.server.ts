import type { Actions } from "./$types";
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

		const { status } = await client.create({
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
	}
} satisfies Actions;
