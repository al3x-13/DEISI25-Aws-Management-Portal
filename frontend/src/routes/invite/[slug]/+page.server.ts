import { inviteContractUnprotected } from "@deisi25/types/lib/api/contracts/invites/invite-contract";
import { initClient } from "@ts-rest/core";
import type { Actions } from "./$types";

export const actions = {
	createUser: async ({ request, cookies }) => {
		const token = cookies.get('token');

		const data = await request.formData();
		const uuid = data.get('uuid') as string;
		const username = data.get('username') as string;
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		if (!data || !username || !password) {
			return { success: false };
		}

		const client = initClient(inviteContractUnprotected, {
			baseUrl: 'http://localhost:3000',
			baseHeaders: {
				'Content-Type': 'application/json',
				'Cookie': `token=${token}`
			}
		});

		const { status, body } = await client.submitInvite({
			body: {
				uuid: uuid,
				username: username,
				email: email,
				password: password
			}
		});

		if (status === 201) return { success: body.success };
		return { success: false };
	}
} satisfies Actions;
