import db from "../../db/db";

/**
 * Gets the users that exist.
 * @returns Users table
 */
export async function getUsers() {
	const result = await db.query(
		'SELECT * FROM users'
	);
	return result.rows;
}