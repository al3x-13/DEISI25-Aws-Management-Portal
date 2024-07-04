import { initClient } from "@ts-rest/core";
import type { PageServerLoad } from "./$types";
import { ec2Contract, type Ec2Instance } from "@deisi25/types";

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('token');
	
	const client = initClient(ec2Contract, {
		baseUrl: 'http://localhost:3000',
		baseHeaders: {
			'Content-Type': 'application/json',
			'Cookie': `token=${token}`
		},
	});

	const { status, body } = await client.listInstaces({
		query: {
			maxResults: 30
		}
	});

	const instances = status === 200 ? body.instances as Ec2Instance[] : null;
	console.log('INST: ' + instances);

	return {
		instances: instances,
	};
}
