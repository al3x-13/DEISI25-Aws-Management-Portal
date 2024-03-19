import type { User } from "$lib/domain/user";
import { userContract, usersContracts } from "@deisi25/types";
import { initClient } from "@ts-rest/core";

const client = initClient(usersContracts, {
	baseUrl: 'http://localhost:3000',
	baseHeaders: {
		'Content-Type': 'application/json'
	},
	credentials:"include"
});

type UserInfo = {
	id: number,
	username: string,
	email: string,
	role: string,
	createdAt: string
}

export async function listUsers(): Promise<UserInfo[]> {

	const { status, body } = await client.default({});

	if (status !== 200) {
		return [];
	}

	return body.users;
}