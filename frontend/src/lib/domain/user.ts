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

