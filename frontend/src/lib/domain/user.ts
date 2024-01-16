import jwt from 'jsonwebtoken';

export type User = {
	id: number;
	username: string;
	role: string;
}

export function getUserDataFromJwt(token: string): User | null {
	const userData = jwt.decode(token);

	if (typeof userData === 'string' || userData == null) {
		return null;
	}

	return { id: userData.id, username: userData.username, role: userData.role };
}

export function userIsAuthenticated(token: string | undefined): boolean {
	return token != undefined;
}


/**
 * Gets user dashboard route from role.
 * @param role user role
 * @returns User dashboard route
 */
export function getDashboardRoute(role: string): string {
	switch(role) {
		case 'root': {
			return '/root';
		}
		case 'admin': {
			// TODO: implement this
			return '/';
		}
		default: {
			return '/dashboard';
		}
	}
}
