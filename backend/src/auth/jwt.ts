import { Request } from "express";
import jwt from 'jsonwebtoken';
import { JwtUserData } from "../lib/users/user-manager";
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

/**
* Gets jason web token payload.
* @param token jwt
* @returns Token payload or null on fail
*/
function getJwtData(token: string): JwtUserData | null {
	if (!process.env.JWT_SECRET) {
		return null;
	}

	let decodedToken;

	try {
		decodedToken = jwt.verify(token, process.env.JWT_SECRET);
	} catch (error) {
		return null;
	}

	if (typeof decodedToken === 'string') {
		return null;
	}

	const userId = decodedToken.id;
	const userUsername = decodedToken.username;
	const userRole = decodedToken.role;

	return { id: userId, username: userUsername, role: userRole };
}

/**
* Validates jwt token.
* @param token jwt
* @returns Whether the jwt is valid or null if no jwt secret was found
*/
function validateJwt(token: string): boolean | null {
	if (!process.env.JWT_SECRET) {
		return null;
	}

	try {
		jwt.verify(token, process.env.JWT_SECRET);
		return true;
	} catch (err) {
		return false;
	}
}

export { extractJwt, signJwt, getJwtData, validateJwt };
