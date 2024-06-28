import { sshContract } from "@deisi25/types/lib/api/contracts/resources/ssh-contract";
import type { SSHKey, SSHKeyAccessType } from "@deisi25/types/lib/resources/ssh/ssh";
import { initClient } from "@ts-rest/core";


const client = initClient(sshContract, {
	baseUrl: 'http://localhost:3000',
	baseHeaders: {
		'Content-Type': 'application/json'
	},
	credentials: 'include'
});


export async function getSSHKeysClientside(): Promise<SSHKey[]> {
	const { status, body } = await client.listKeys();

	if (status === 200) return body.sshKeys;
	return [];
}


export async function checkKeyNameAvailability(keyName: string): Promise<boolean> {
	const { status, body } = await client.checkNameAvailability({
		body: {
			keyName: keyName
		}
	});

	if (status === 200) return body.available;
	return false;
}


export async function updateKeyAccessType(keyName: string, newAccessType: SSHKeyAccessType): Promise<boolean> {
	const { status, body } = await client.updateAccessType({
		body: {
			keyName: keyName,
			keyAccessType: newAccessType
		}
	});

	if (status === 201) return body.success;
	return false;
}


export async function deleteKey(keyName: string): Promise<boolean> {
	const { status, body } = await client.delete({
		body: {
			keyName: keyName
		}
	});

	if (status === 200) return body.success;
	return false;
}
