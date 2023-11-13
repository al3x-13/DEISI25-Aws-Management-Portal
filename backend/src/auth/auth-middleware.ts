import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { isBearerAuthScheme } from './auth-utils';
import { extractJwt } from './jwt';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/errors';

dotenv.config();

/**
* Validates user sessions.
* @param req Express request
* @param res Express response
* @param next Express next function
*/
function authMiddleware(req: Request, res: Response, next: NextFunction) {
	if (!req.headers['authorization']) {
		const error = new ApiError('Unauthorized', "Missing 'authorization' header");
		res.status(401).json(error.toJSON());
		return;
	}

	if (!isBearerAuthScheme(req)) {
		const error = new ApiError('Unauthorized', "Authorization header should use 'Bearer' scheme");
		res.status(401).json(error.toJSON());
		return;
	}

	const token = extractJwt(req);
	if (!token) {
		const error = new ApiError('Unauthorized', "Invalid 'authorization' header format");
		res.status(401).json(error.toJSON());
		return;
	}

	// @ts-ignore - TODO: review this later
	jwt.verify(token, jwt_secret, (err, user) => {
		if (err) {
			const error = new ApiError('Unauthorized', 'JWT is invalid');
			return res.status(401).json(error.toJSON());
		}
		next();
	});
}

export default authMiddleware;
