import { initClient } from "@ts-rest/core";
import type { Actions } from "./$types";
import { inviteContractProtected } from "@deisi25/types/lib/api/contracts/invites/invite-contract";

export const actions = {
	createInvite: async ({ request, cookies }) => {
		const token = cookies.get('token');

		const data = await request.formData();
		const roleName = data.get('roleName') as string;
		const durationInHours = Number(data.get('duration'));

		if (!data || !roleName || !durationInHours) {
			return { success: false };
		}

		const expirationTimestamp = new Date(Date.now());
		expirationTimestamp.setHours(expirationTimestamp.getHours() + durationInHours);

		const client = initClient(inviteContractProtected, {
			baseUrl: 'http://localhost:3000',
			baseHeaders: {
				'Content-Type': 'application/json',
				'Cookie': `token=${token}`
			}
		});

		const { status } = await client.createInvite({
			body: {
				role: roleName,
				expirationTimestamp: expirationTimestamp.toISOString()
			}
		});

		if (status === 201) return { success: true };
		return { success: false };
	}
} satisfies Actions;
