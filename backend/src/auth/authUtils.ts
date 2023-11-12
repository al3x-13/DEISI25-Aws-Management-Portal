import { Request } from "express";
import db from "../db/db";

/**
* Checks if the request's 'authorization' header is of scheme type 'Bearer'.
* @param req Express request
* @returns Whether 'authorization' is of type 'Bearer'
*/
export function isBearerAuthScheme(req: Request) {
	const authScheme = req.headers['authorization']?.split(' ')[0];
	return authScheme?.toLowerCase() === 'bearer';
}

