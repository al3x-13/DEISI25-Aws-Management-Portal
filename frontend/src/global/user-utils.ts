import { userContract } from "@deisi25/types";
import type { UserNoHash } from "@deisi25/types/lib/users/users";
import { initClient } from "@ts-rest/core";


const client = initClient(userContract, {
	baseUrl: 'http://localhost:3000',
	baseHeaders: {
		'Content-Type': 'application/json'
	},
	credentials: 'include'
});


export async function getAllUsers(): Promise<UserNoHash[]> {
	const { status, body } = await client.listAllUsers();
	if (status === 200) return body.users;
	return [];
}


export async function deleteUser(id: number): Promise<boolean> {
	const { status, body } = await client.delete({
		body: {
			id: id
		}
	});

	if (status === 200) return body.success;
	return false;
}
