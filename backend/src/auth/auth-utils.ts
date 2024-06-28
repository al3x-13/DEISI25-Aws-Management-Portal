import { Request } from "express";
import { getJwtData } from "./jwt";
import { getUserPasswordHash, usernameExists } from "../lib/users/user-manager";
import bcrypt from "bcryptjs";

/**
* Checks if the request's 'authorization' header is of scheme type 'Bearer'.
* @param req Express request
* @returns Whether 'authorization' is of type 'Bearer'
*/
export function isBearerAuthScheme(req: Request) {
	const authScheme = req.headers['authorization']?.split(' ')[0];
	return authScheme?.toLowerCase() === 'bearer';
}

export function getUserIdFromRequestCookies(data: Request): number;
export function getUserIdFromRequestCookies(data: string): number;
/**
 * Extracts user id from request cookies.
 * @param req Request
 * @returns User ID
 */
export function getUserIdFromRequestCookies(data: Request | string): number {
	if (typeof data === 'string') {
		const jwtData = getJwtData(data);
		return jwtData ? jwtData.id : -1;
	}
	const { token } = data.cookies;
	const jwtData = getJwtData(token);
	return jwtData ? jwtData.id : -1;
}

/**
 * Validates user credentials.
 * @param username username
 * @param password password
 * @returns Whether the credential are valid
 */
export async function validateUserCredentials(username: string, password: string): Promise<boolean> {
	const validUsername = await usernameExists(username);
	if (!validUsername) {
		return false;
	}

	let userPasswordHash = await getUserPasswordHash(username);
	userPasswordHash = userPasswordHash ? userPasswordHash : '';

	const validPassword = await bcrypt.compare(password, userPasswordHash);
	if (!validPassword) {
		return false;
	}

	return true;
}
