import type { User } from "$lib/domain/user";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
	const userData: User | undefined = locals.user;

	return {
		props: {
			user: {
				id: userData?.id,
				username: userData?.username,
				role: userData?.role,
			},
		}
	};
};
