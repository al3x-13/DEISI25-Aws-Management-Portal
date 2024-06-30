import db from "../../db/db";


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
