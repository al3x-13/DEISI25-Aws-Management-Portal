import express, { Request, Response } from "express";
import { ApiError } from "../utils/errors";
import { JwtUserData, getUserId, getUserPasswordHash, usernameExists } from "../lib/users";
import { signJwt } from "./jwt";
import bcrypt from 'bcryptjs';
import { logger } from "../logging/logging";

const authController = express.Router();

authController.get('/', (req, res, next) => {
	res.send("NOICE");
});

authController.post('/authenticate', async (req: Request, res: Response) => {
	if (req.headers['content-type'] != 'application/json') {
		const error = new ApiError('Authentication failed', "Header 'content-type' must be 'application/json'")
		res.status(401).json(error.toJSON());
		return;
	}

	const { username, password } = req.body;
	if (!username) {
		const error = new ApiError('Authentication failed', "Missing 'username' body field");
		res.status(401).json(error.toJSON());
		return;
	}

	if (!password) {
		const error = new ApiError('Authentication failed', "Missing 'password' body field");
		res.status(401).json(error.toJSON());
		return;
	}

	// username validation
	const validUsername = await usernameExists(username);
	if (!validUsername) {
		const error = new ApiError('Authentication failed');
		res.status(401).json(error.toJSON());
		return;
	}

	// TODO: update this later to compare hashes (dev mode)
	let userPasswordHash = await getUserPasswordHash(username);
	userPasswordHash = userPasswordHash ? userPasswordHash : '';

	const validPassword = bcrypt.compareSync(password, userPasswordHash);

	if (!validPassword) {
		const error = new ApiError('Authentication failed');
		res.status(401).json(error.toJSON());
		return;
	}

	const userId = await getUserId(username);
	const userData: JwtUserData = { id: userId ? userId : -1, username: username };
	const token = signJwt(userData);

	// logging
	logger.info(`User '${username}' authenticated successfully`);

	res.json({ "JWT": token });
});

export default authController;
