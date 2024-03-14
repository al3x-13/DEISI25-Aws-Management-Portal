import { userContract } from "@deisi25/types";
import { initClient } from "@ts-rest/core";

const client = initClient(userContract, {
	baseUrl: 'http://localhost:3000',
	baseHeaders: {
		'Content-Type': 'application/json'
	}
});

export async function listUsers(): Promise<[] | []> {
	const { status, body } = await client.info({
		// query: { }
	});

	if (status !== 200) {
		return [];
	}
	///return body.instances as Ec2Instance[];
}