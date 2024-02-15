import { Request } from "express";
import { getJwtData } from "./jwt";

/**
* Checks if the request's 'authorization' header is of scheme type 'Bearer'.
* @param req Express request
* @returns Whether 'authorization' is of type 'Bearer'
*/
export function isBearerAuthScheme(req: Request) {
	const authScheme = req.headers['authorization']?.split(' ')[0];
	return authScheme?.toLowerCase() === 'bearer';
}

/**
 * Extracts user id from request cookies.
 * @param req Request
 * @returns User ID
 */
export function getUserIdFromRequestCookies(req: Request): number {
	const { token } = req.cookies;
	const jwtData = getJwtData(token);
	return jwtData ? jwtData.id : -1;
}
