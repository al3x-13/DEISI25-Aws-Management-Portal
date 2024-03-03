import { ApiError } from "../../utils/errors";
import { JwtUserData, getUserId, getUserRole } from "../../lib/users";
import { signJwt } from "../../auth/jwt";
import { logger } from "../../logging/logging";
import dotenv from "dotenv";
import { validateUserCredentials } from "../../auth/auth-utils";
import { initServer } from "@ts-rest/express";
import { authContract } from "@deisi25/types/lib/api/contracts/auth-contract";

dotenv.config();

const server = initServer();

const authController = server.router(authContract, {
	authenticate: async ({ body }) => {
		const { username, password } = body;

		// credentials validation
		if (!(await validateUserCredentials(username, password))) {
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
