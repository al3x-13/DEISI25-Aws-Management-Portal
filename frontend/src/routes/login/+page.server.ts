import { getDashboardRoute, getUserDataFromJwt, type User } from "$lib/domain/user";
import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { initClient } from "@ts-rest/core";
import { authContract } from "@deisi25/types";

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		// form data validation
		if (!username || !password) {
			return fail(
				400, 
				{ username, missingUsername: username ? false : true, missingPassword: password ? false : true}
			);
		}

		const client = initClient(authContract, {
			// TODO: make this not hardcoded
			baseUrl: 'http://localhost:3000',
			baseHeaders: {}
		});

		const { status, body } = await client.authenticate({
			body: {
				username: username.toString(),
				password: password.toString()
			}
		});

		console.log(`Status: ${status}, Body: ${JSON.stringify(body)}`);

		if (status !== 200) {
			return fail(400, { username, missingField: null });
		}

		cookies.set('token', body.token, {
			path: '/',
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
		});

		const userData: User | null = getUserDataFromJwt(body.token);
		const dashboardRoute = getDashboardRoute(userData ? userData.role : '/');

		return { success: true, redirectRoute: dashboardRoute };
	}
} satisfies Actions;
