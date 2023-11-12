import { Request } from "express";

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

export { extractJwt };
