import express, { Request, Response } from "express";
import { ApiError } from "../../utils/errors";
import { JwtUserData, getUserId } from "../../lib/users";
import { signJwt } from "../../auth/jwt";
import { logger } from "../../logging/logging";
import dotenv from "dotenv";
import { isContentTypeValid, validateAuthCredentials, validateAuthenticationBody } from "../../utils/endpoint-utils";

dotenv.config();

const authController = express.Router();

authController.get('/', (_req, res, _next) => {
	res.send("NOICE");
});

authController.post('/authenticate', async (req: Request, res: Response) => {
	if (!isContentTypeValid(req)) {
		const error = new ApiError('Authentication failed', "Header 'content-type' must be 'application/json'")
		res.status(401).json(error.toJSON());
		return;
	}

	let fieldsValidation = validateAuthenticationBody(req);
	if (fieldsValidation != 'valid') {
		const error = new ApiError('Authentication failed', `Missing '${fieldsValidation}' body field`);
		res.status(401).json(error.toJSON());
		return;
	}

	const { username, password } = req.body;

	// credentials validation
	if (await validateAuthCredentials(username, password)) {
		const error = new ApiError('Authentication failed');
		res.status(401).json(error.toJSON());
	}

	const userId = await getUserId(username);
	const userData: JwtUserData = { id: userId ? userId : -1, username: username };
	const token = signJwt(userData);

	// save token as cookie
	res.cookie('token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		path: '/',
		maxAge: 21600000, // 6h in ms (TODO: hardcoded, change later)
	});

	// logging
	logger.info(`User '${username}' authenticated successfully`);

	res.send("JWT has been set successfully")
});

export default authController;
