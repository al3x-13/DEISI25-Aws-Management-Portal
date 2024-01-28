import { Request } from "express";
import { getUserPasswordHash, usernameExists } from "../lib/users";
import bcrypt from "bcryptjs";
import { ApiError, ApiErrorData } from "./errors";

export function isContentTypeValid(req: Request) {
	return req.headers['content-type'] == 'application/json';
}

export function validateRequestHeaders(req: Request): ApiErrorData | null {
	if (!req.headers['content-type']) {
		const error = new ApiError(
			"Bad Request", 
			"Missing 'Content-Type' header", "Set the 'Content-Type' header to 'application/json'"
		);
		return {
			status: 400,
			error: error.toJSON()
		}
	}

	if (!isContentTypeValid(req)) {
		const error = new ApiError(
			"Bad Request", 
			"Invalid 'Content-Type' header", "The 'Contet-Type' header must be set to 'application/json'"
		);
		return {
			status: 400,
			error: error.toJSON()
		}
	}
	return null;
}

export function validateAuthenticationBody(req: Request): string {
	const { username, password } = req.body;

	if (!username) return 'username';
	if (!password) return 'password';
	return 'valid';
}

export async function validateAuthCredentials(username: string, password: string): Promise<boolean> {
	const validUsername = await usernameExists(username);
	if (!validUsername) {
		return false;
	}

	let userPasswordHash = await getUserPasswordHash(username);
	userPasswordHash = userPasswordHash ? userPasswordHash : '';

	const validPassword = await bcrypt.compare(password, userPasswordHash);
	if (!validPassword) {
		return false;
	}

	return true;
}
