import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
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
	const JWT_SECRET = process.env.JWT_SECRET;

	if (!JWT_SECRET) {
		const error = new ApiError('Server error', 'Missing jwt secret');
		res.status(500).json(error.toJSON());
		return;
	}

	const authToken = req.cookies.token;
	if (!authToken) {
		const error = new ApiError('Unauthorized', "Missing authorization cookies");
		res.status(401).json(error.toJSON());
		return;
	}

	try {
		// validate jwt
		jwt.verify(authToken, JWT_SECRET);
	} catch (err) {
		const error = new ApiError('Unauthorized', 'Token is not valid');
		res.status(401).json(error.toJSON());
		return;
	}
	next();
}

export default authMiddleware;
