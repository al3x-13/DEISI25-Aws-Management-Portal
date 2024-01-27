import express, { Request, Response } from "express";
import { ApiError } from "../../utils/errors";
import { JwtUserData, getUserId, getUserRole } from "../../lib/users";
import { signJwt } from "../../auth/jwt";
import { logger } from "../../logging/logging";
import dotenv from "dotenv";
import { isContentTypeValid, validateAuthCredentials, validateAuthenticationBody } from "../../utils/endpoint-utils";
import { initServer } from "@ts-rest/express";
import { authContract } from "@deisi25/types/lib/api/contracts/auth-contract";

dotenv.config();

const authControllerDeprecated = express.Router();

authControllerDeprecated.get('/', (_req, res, _next) => {
	res.send("NOICE");
});

authControllerDeprecated.post('/authenticate', async (req: Request, res: Response) => {
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
	if (!(await validateAuthCredentials(username, password))) {
		const error = new ApiError('Authentication failed');
		res.status(401).json(error.toJSON());
		return;
	}

	const userId = await getUserId(username);
	const userRole = await getUserRole(username);
	const userData: JwtUserData = { id: userId ? userId : -1, username: username, role: userRole };
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
	res.send({ token: token });
});

const server = initServer();

const authController = server.router(authContract, {
	authenticate: async ({ body }) => {
		const { username, password } = body;

		// credentials validation
		if (!(await validateAuthCredentials(username, password))) {
			const error = new ApiError('Authentication failed');
			return {
				status: 401,
				body: error.toJSON()
			};
		}

		const userId = await getUserId(username);
		const userRole = await getUserRole(username);
		const userData: JwtUserData = { id: userId ? userId : -1, username: username, role: userRole };
		const token = signJwt(userData);

		// logging
		logger.info(`User '${username}' authenticated successfully`);

		return {
			status: 200,
			body: {
				token: token,
			},
		}
	}
});

export default authController;
