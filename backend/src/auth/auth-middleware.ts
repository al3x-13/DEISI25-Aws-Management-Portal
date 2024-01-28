import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { ApiError, ApiErrorData } from '../utils/errors';

dotenv.config();

/**
* Validates user sessions.
* @param req Express request
* @param res Express response
* @param next Express next function
*/
function authMiddlewareValidation(req: Request): ApiErrorData | null {
	const JWT_SECRET = process.env.JWT_SECRET;

	if (!JWT_SECRET) {
		const error = new ApiError('Server error', 'Could not validate auth token');
		return {
			status: 500,
			error: error.toJSON()
		};
	}

	const authToken = req.cookies.token;
	if (!authToken) {
		const error = new ApiError('Unauthorized', "Missing authorization cookies");
		return {
			status: 401,
			error: error.toJSON()
		}
	}

	try {
		// validate jwt
		jwt.verify(authToken, JWT_SECRET);
	} catch (err) {
		const error = new ApiError('Unauthorized', 'Token is not valid');
		return {
			status: 401,
			error: error.toJSON()
		}
	}
	return null;
}

export default authMiddlewareValidation;
