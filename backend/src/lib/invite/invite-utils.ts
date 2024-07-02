import db from "../../db/db";
import { v4 as uuidv4 } from "uuid";


/**
 * Check if an invite is still valid, i.e. the expiration date has not passed
 * and it has not yet been used.
 * @param uuid Invite uuid
 * @returns Whether the invite is still valid
 */
export async function checkInviteValidity(uuid: string): Promise<boolean> {
	const query = await db.query(
		'SELECT expires_at, used FROM user_invites WHERE uuid = $1',
		[ uuid ]
	);

	if (query.rowCount === 0) return false;

	const data = query.rows[0];

	const currentDate = new Date();
	const inviteDate = new Date(data.expires_at);
	const hasExpired = currentDate > inviteDate;
	const used = data.used;

	return !(hasExpired || used);
} 


/**
 * Get role id from an existing invite.
 * @param uuid Invite uuid
 * @returns Role id or null if given uuid does not exist
 */
export async function getInviteRoleId(uuid: string): Promise<number | null> {
	const query = await db.query(
		'SELECT role FROM user_invites WHERE uuid = $1',
		[ uuid ]
	);

	return query.rows.length === 1 ? query.rows[0].role : null;
}


/**
 * Create a new user invite.
 * @param role The user role
 * @returns UUID of the user invite on success and null otherwise
 */
export async function createUserInvite(role: string, expirationTimestamp: Date): Promise<string | null> {
	const roleId = await getInviteRoleId(role);

	if (roleId === null) return null;
	
	const inviteId= uuidv4();

	const query = await db.query(
		'INSERT INTO user_invites (uuid, role, expires_at) VALUES ($1, $2, $3)',
		[ inviteId, roleId, expirationTimestamp.toISOString() ]
	);

	return query.rowCount === 1 ? query.rows[0].uuid : null;
}


/**
 * Expire an existing user invite by updating the expiration timestamp.
 * @param User invite UUID
 * @returns Whether the user invite was successfully expired
 */
export async function expireUserInvite(uuid: string): Promise<boolean> {
	const query = await db.query(
		'UPDATE user_invites SET expirest_at = $1 WHERE uuid = $2',
		[ new Date(Date.now()), uuid ]
	);
	return query.rowCount === 1;
}
