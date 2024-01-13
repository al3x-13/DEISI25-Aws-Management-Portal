import db from "../db/db";

export type Role = {
	id: number;
	role: string;
}

export type User = {
	id: number;
	username: string;
	passwordHash: string;
	email: string | undefined;
	role: Role;
	created_at: number;
};

export interface JwtUserData {
	id: number;
	username: string;
	role: string;
};

/**
 * Checks if the given username exists in the database.
 * @param username Username
 * @returns Whether username exists
 */
export async function usernameExists(username: string): Promise<boolean> {
	const result = await db.query(
		'SELECT id FROM users WHERE username = $1',
		[username]
	);
	return result.rows.length == 1;
}

/**
 * Gets a user by its ID if it exists.
 * @param userID User id
 * @returns User or null
 */
export async function getUserByID(userID: number): Promise<User | null> {
	const result = await db.query(
		'SELECT * FROM users WHERE id = $1',
		[userID.toString()]
	);
	const user = result.rows[0];
	return user ? user : null;
}

/**
 * Gets a user by its username if it exists.
 * @param username Username
 * @returns User or null
 */
export async function getUserByUsername(username: string): Promise<User | null> {
	const result = await db.query(
		'SELECT * FROM users WHERE username = $1',
		[username]
	);
	const user = result.rows[0];
	return user ? user : null;
}

/**
 * Gets user ID from username if user is valid.
 * @param username Username
 * @returns ID or null
 */
export async function getUserId(username: string): Promise<number | null> {
	const result = await db.query(
		'SELECT id FROM users WHERE username = $1',
		[username]
	);
	const id = result.rows[0].id;
	return id ? id : null;
}

export async function getUserRole(username: string): Promise<string> {
	const result = await db.query(
		'SELECT roles.role FROM roles INNER JOIN users ON roles.id = users.role WHERE users.username = $1',
		[username]
	);
	return result.rows[0].role;
}

/**
 * Gets user password hash from username if user is valid.
 * @param username Username
 * @returns Password hash or null
 */
export async function getUserPasswordHash(username: string): Promise<string | null> {
	const result = await db.query(
		'SELECT password_hash FROM users WHERE username = $1',
		[username]
	);
	const passwordHash = result.rows[0].password_hash;
	return passwordHash ? passwordHash : null;
}
