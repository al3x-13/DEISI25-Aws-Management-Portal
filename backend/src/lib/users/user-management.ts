import db from "../../db/db";
import { User } from "../users";

/**
 * Gets the users that exist.
 * @returns Users table
 */
export async function getUsers(): Promise<User[]> {
	const result = await db.query(
		'SELECT * FROM users'
	);

	let users = [];

	for(let i = 0; i < result.rows.length; i++) {
		const data = result.rows[i];

		const user:User = {
			id: data.id,
			username: data.username,
			passwordHash: data.password_hash,
			email: data.email, 
			role: data.role,
			created_at: data.created_at
		}

		users.push(user);

	}

	return users;
}