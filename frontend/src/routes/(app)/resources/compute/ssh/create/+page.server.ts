import { initClient } from "@ts-rest/core";
import type { Actions } from "./$types";
import { sshContract } from "@deisi25/types";
import { SSHKeyAccessType, SSHKeyPairType, SSHPrivateKeyFileFormat } from "@deisi25/types/lib/resources/ssh/ssh";

export const actions = {
	createKey: async ({ request, cookies }) => {
		const token = cookies.get('token');

		const data = await request.formData();
		const keyName = data.get('keyName') as string;
		const keyPairType = data.get('keyPairType') as string;
		const keyFileFormat = data.get('keyFileFormat') as string;
		const keyAccessType = data.get('keyAccessType') as string;

		if (!data || !keyName || !keyPairType || !keyFileFormat || !keyAccessType) {
			return { success: false };
		}

		const client = initClient(sshContract, {
			baseUrl: 'http://localhost:3000',
			baseHeaders: {
				'Content-Type': 'application/json',
				'Cookie': `token=${token}`
			}
		});

		const { status } = await client.create({
			body: {
				name: keyName,
				keyPairType: keyPairType.toLowerCase() === 'rsa' ? SSHKeyPairType.RSA : SSHKeyPairType.ED25519,
				privateKeyFileFormat: keyFileFormat.toLowerCase() === '.pem' ? SSHPrivateKeyFileFormat.PEM : SSHPrivateKeyFileFormat.PPK,
				keyAccessType: keyAccessType.toLowerCase() === 'private' ? SSHKeyAccessType.Private : SSHKeyAccessType.Public
			}
		});

		if (status === 201) return { success: true };
		return { success: false };
	}
} satisfies Actions;
