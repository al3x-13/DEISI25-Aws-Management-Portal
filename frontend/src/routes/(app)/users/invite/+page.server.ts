import { initClient } from "@ts-rest/core";
import type { PageServerLoad } from "./$types";
import { inviteContractProtected } from "@deisi25/types/lib/api/contracts/invites/invite-contract";
import type { UserInvite } from "@deisi25/types/lib/invites/invites";

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('token');
	
	const client = initClient(inviteContractProtected, {
		baseUrl: 'http://localhost:3000',
		baseHeaders: {
			'Content-Type': 'application/json',
			'Cookie': `token=${token}`
		},
	});

	const { status, body } = await client.getAllInvites();

	return {
		invites: status === 200 ? body.invites as UserInvite[] : [],
	};
}
