import { inviteContractProtected, inviteContractUnprotected } from "@deisi25/types/lib/api/contracts/invites/invite-contract";
import type { UserInvite } from "@deisi25/types/lib/invites/invites";
import { initClient } from "@ts-rest/core";

const client = initClient(inviteContractProtected, {
	baseUrl: 'http://localhost:3000',
	baseHeaders: {
		'Content-Type': 'application/json'
	},
	credentials: 'include'
});


const clientUnprotected = initClient(inviteContractUnprotected, {
	baseUrl: 'http://localhost:3000',
	baseHeaders: {
		'Content-Type': 'application/json'
	},
	credentials: 'include'
});


export async function deativateUserInviteClientside(uuid: string): Promise<boolean> {
	const { status } = await client.deactivateInvite({
		body: {
			uuid: uuid
		}
	});
	return status === 201;
}


export async function getAllUserInvitesClientside(): Promise<UserInvite[]> {
	const { status, body } = await client.getAllInvites();
	return status === 200 ? body.invites : [];
}


export async function isValidUserInviteUUID(uuid: string): Promise<boolean> {
	const { status, body } = await clientUnprotected.checkValidity({
		body: {
			uuid: uuid
		}
	});
	return status === 200 ? body.valid : false;
}
