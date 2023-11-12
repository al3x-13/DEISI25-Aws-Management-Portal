import dotenv from 'dotenv';
import { logger } from '../logging/logging';

dotenv.config();

/**
* Checks if 'JWT_SECRET' env variable is present.
* @returns Whether 'JWT_SECRET' exists
*/
function jwtSecretExists(): boolean {
	if (!process.env.JWT_SECRET) {
		logger.error("'JWT_SECRET' environment variable is not set");
		return false;
	}
	return true;
}

/**
* Checks if 'DB_URL' env variable is present.
* @returns Whether 'DB_URL' exists
*/
function dbUrlExists(): boolean {
	if (!process.env.DB_URL) {
		logger.error("'DB_URL' environment variable is not set");
		return false;
	}
	return true;
}

export { jwtSecretExists, dbUrlExists };
