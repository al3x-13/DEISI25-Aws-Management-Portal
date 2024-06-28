import { sshContract } from "@deisi25/types/lib/api/contracts/resources/ssh-contract";
import { initClient } from "@ts-rest/core";


const client = initClient(sshContract, {
	baseUrl: 'http://localhost:3000',
	baseHeaders: {
		'Content-Type': 'application/json'
	},
	credentials: 'include'
});


export async function checkKeyNameAvailability(keyName: string): Promise<boolean> {
	const { status, body } = await client.checkNameAvailability({
		body: {
			keyName: keyName
		}
	});

	if (status === 200) return body.available;
	return false;
}
