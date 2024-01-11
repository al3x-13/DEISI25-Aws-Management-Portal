import { Request } from "express";
import jwt from 'jsonwebtoken';
import { JwtUserData } from "../lib/users";
import dotenv from 'dotenv';
import { logger } from "../logging/logging";

dotenv.config();

/**
* Extracts JWT from express request if it exists.
* @param req Express request
* @returns JWT or null
*/
function extractJwt(req: Request): string | null {
	const header = req.headers['authorization'];
	const token = header?.split(' ')[1];
	return token ? token : null;
}

/**
* Signs a JWT with user data.
* @param userData User data
* @returns JWT
*/
function signJwt(userData: JwtUserData): string {
	// TODO: make jwt expiration configurable
	logger.info(`JWT generated successfully for user '${userData.username}'`);

	return jwt.sign(
		userData,
		// @ts-ignore
		process.env.JWT_SECRET,
		{ expiresIn: '6h' }
	);
}

function getJwtData(token: string): JwtUserData | null {
	try {
		if (!process.env.JWT_SECRET) {
			return null;
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log(`Decoded token: ${decoded}`)

		return null;
	} catch (error) {
		return null;
	}
}

export { extractJwt, signJwt, getJwtData };
