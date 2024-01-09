import { Request } from "express";
import { getUserPasswordHash, usernameExists } from "../lib/users";
import bcrypt from "bcryptjs";

export function isContentTypeValid(req: Request) {
	return req.headers['content-type'] == 'application/json';
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
