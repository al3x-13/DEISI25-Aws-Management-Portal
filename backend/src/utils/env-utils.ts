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
		console.log("'JWT_SECRET' environment variable is not set");
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
		console.log("'DB_URL' environment variable is not set");
		return false;
	}
	return true;
}

/**
* Checks if AWS environemnt variables are present.
* @returns Whether AWS settings are present
*/
function awsEnvironmentSettingsExist(): boolean {
	if (!process.env.AWS_ACCESS_KEY_ID) {
		logger.error("'AWS_ACCESS_KEY_ID' environment variable is not set");
		console.log("'AWS_ACCESS_KEY_ID' environment variable is not set");
		return false;
	}

	if (!process.env.AWS_SECRET_ACCESS_KEY) {
		logger.error("'AWS_SECRET_ACCESS_KEY' environment variable is not set");
		console.log("'AWS_SECRET_ACCESS_KEY' environment variable is not set");
		return false;
	}

	if (!process.env.AWS_DEFAULT_REGION) {
		logger.error("'AWS_DEFAULT_REGION' environment variable is not set");
		console.log("'AWS_DEFAULT_REGION' environment variable is not set");
		return false;
	}

	return true;
}

/**
 * Checks if SSH secret environemnt variable is present.
 * @returns Whether SSH secret is present
 */
function sshEcryptionSecret(): boolean {
	if (!process.env.SSH_SECRET) {
		return false;
	}
	return true;
}

/**
* Checks if all the required environment variables are present at startup (before running the server).
* @returns Whether 
*/
function validateEnvironmentVariablesOnStartup(): boolean {
	if (!jwtSecretExists()) {
		return false;
	}

	if (!dbUrlExists()) {
		return false;
	}

	if (!awsEnvironmentSettingsExist()) {
		return false;
	}

	if (!sshEcryptionSecret()) {
		return false;
	}

	return true;
}

export { validateEnvironmentVariablesOnStartup };
