import { UserInvite } from "@deisi25/types/lib/invites/invites";
import db from "../../db/db";
import { v4 as uuidv4 } from "uuid";
import exp from "constants";


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


/**
 * Returns all existing user invites (non expired first).
 * @returns User invites
 */
export async function getAllUserInvitesValidOnesFirst(maxResults: number | undefined): Promise<UserInvite[]> {
	const query = await db.query('SELECT * FROM user_invites');

	const invites: UserInvite[] = [];

	for (let i = 0; i < query.rows.length; i++) {
		const inv = query.rows[i];
		invites.push({
			uuid: inv.uuid,
			role: inv.role,
			createdAt: new Date(inv.created_at).toString(),
			expiresAt: new Date(inv.expires_at).toString(),
			used: inv.used
		});
	}

	invites.sort((i1, i2) => {
		const i1Valid = isInviteValid(i1);
		const i1Date = new Date(i1.expiresAt);
		const i2Valid = isInviteValid(i2);
		const i2Date = new Date(i2.expiresAt);

		if (i1Valid && i2Valid) {
			if (i1Date >= i2Date) {
				return 1;
			}
			return -1;
		}

		if (i1Valid) {
			return -1;
		}

		if (i2Valid) {
			return 1;
		}

		return i1Date < i2Date ? -1 : 1;
	});

	return maxResults ? invites.slice(0, maxResults) : invites;
}


/**
 * Check if an invite is valid, i.e. has not been used and has not expired.
 * @param invite User invite
 * @returns Whether the invite is valid
 */
export function isInviteValid(invite: UserInvite): boolean {
	if (invite.used) return false;
	const expDate = new Date(invite.expiresAt);
	const nowDate = new Date(Date.now());
	return expDate > nowDate;
}
