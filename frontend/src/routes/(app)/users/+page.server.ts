import { initClient } from "@ts-rest/core";
import type { PageServerLoad } from "./$types";
import { userContract } from "@deisi25/types";
import type { UserNoHash } from "@deisi25/types/lib/users/users";

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('token');
	
	const client = initClient(userContract, {
		baseUrl: 'http://localhost:3000',
		baseHeaders: {
			'Content-Type': 'application/json',
			'Cookie': `token=${token}`
		},
	});

	const { status, body } = await client.listAllUsers();
	const users = status === 200 ? body.users as UserNoHash[] : [];

	return {
		users: users,
	};
}
