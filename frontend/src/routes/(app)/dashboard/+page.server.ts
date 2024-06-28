import { ec2Contract, sshContract, type Ec2Instance } from "@deisi25/types";
import { initClient } from "@ts-rest/core";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('token');

	const client = initClient(ec2Contract, {
		baseUrl: 'http://localhost:3000',
		baseHeaders: {
			'Content-Type': 'application/json',
			'Cookie': `token=${token}`
		},
	});


	const { status, body } = await client.listInstaces();
	const instances = status === 200 ? body.instances as Ec2Instance[] : [];

	const client2 = initClient(sshContract, {
		baseUrl: 'http://localhost:3000',
		baseHeaders: {
			'Content-Type': 'application/json',
			'Cookie': `token=${token}`
		},
	});
	const { status: status2, body: body2 } = await client2.listKeys();
	const keys = status2 === 200 ? body2.sshKeys : [];

	return {
		instances: instances,
		keys: keys
	}
}
