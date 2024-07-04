import express, { Request, Response } from 'express';
import { getJwtData, validateJwt } from '../../auth/jwt';
import { ApiError } from '../../utils/errors';
import { initServer } from '@ts-rest/express';
import { userContract } from '@deisi25/types';
import { deleteUser, getAllUsers } from '../../lib/users/user-manager';

const userControllerDeprecated = express.Router();

userControllerDeprecated.get('/', async (req: Request, res: Response) => {
	res.send('TESTING');
});


userControllerDeprecated.get('/info', async (req: Request, res: Response) => {
	const jwtToken = req.cookies.token;
	const userData = getJwtData(jwtToken);

	if (!userData) {
		const error = new ApiError('Authorization', 'Token is not valid');
		res.status(401).json(error.toJSON());
		return;
	}

	res.send({
		id: userData.id,
		username: userData.username,
		role: userData.role,
	});
});


userControllerDeprecated.get('/id', async (req: Request, res: Response) => {
	const jwtToken = req.cookies.token;
	const userData = getJwtData(jwtToken);

	if (!userData) {
		const error = new ApiError('Authorization', 'Token is not valid');
		res.status(401).json(error.toJSON());
		return;
	}

	res.send({
		id: userData.id,
	});
});

userControllerDeprecated.get('/username', async (req: Request, res: Response) => {
	const jwtToken = req.cookies.token;
	const userData = getJwtData(jwtToken);

	if (!userData) {
		const error = new ApiError('Authorization', 'Token is not valid');
		res.status(401).json(error.toJSON());
		return;
	}

	res.send({
		username: userData.username,
	});
});

userControllerDeprecated.get('/role', async (req: Request, res: Response) => {
	const jwtToken = req.cookies.token;
	const userData = getJwtData(jwtToken);

	if (!userData) {
		const error = new ApiError('Authorization', 'Token is not valid');
		res.status(401).json(error.toJSON());
		return;
	}

	res.send({
		role: userData.role,
	});
});

userControllerDeprecated.get('/validate', async (req: Request, res: Response) => {
	const jwtToken = req.cookies.token;
	const valid = validateJwt(jwtToken);

	if (valid == null) {
		const error = new ApiError('Authorization', 'Token is not valid');
		res.status(401).json(error.toJSON());
		return;
	}

	if (valid) {
		res.send({ valid: true });
		return;
	}

	res.send({ valid: false });
});


const server = initServer();

const userController = server.router(userContract, {
	info: async ({ req }) => {
		const jwtToken = req.cookies.token;
		const userData = getJwtData(jwtToken);

		if (!userData) {
			const error = new ApiError('Authorization', 'Token is not valid');
			return {
				status: 401,
				body: error.toJSON()
			}
		}

		return {
			status: 200,
			body: {
				id: userData.id,
				username: userData.username,
				role: userData.role
			}
		}
	},
	id: async ({ req }) => {
		const jwtToken = req.cookies.token;
		const userData = getJwtData(jwtToken);

		if (!userData) {
			const error = new ApiError('Authorization', 'Token is not valid');
			return {
				status: 401,
				body: error.toJSON()
			}
		}

		return {
			status: 200,
			body: {
				id: userData.id
			}
		}
	},
	username: async ({ req }) => {
		const jwtToken = req.cookies.token;
		const userData = getJwtData(jwtToken);

		if (!userData) {
			const error = new ApiError('Authorization', 'Token is not valid');
			return {
				status: 401,
				body: error.toJSON()
			}
		}

		return {
			status: 200,
			body: {
				username: userData.username
			}
		}
	},
	role: async ({ req }) => {
		const jwtToken = req.cookies.token;
		const userData = getJwtData(jwtToken);

		if (!userData) {
			const error = new ApiError('Authorization', 'Token is not valid');
			return {
				status: 401,
				body: error.toJSON()
			}
		}

		return {
			status: 200,
			body: {
				role: userData.role
			}
		}
	},
	validate: async ({ req }) => {
		const jwtToken = req.cookies.token;
		const valid = validateJwt(jwtToken);

		if (valid == null) {
			const error = new ApiError('Authorization', 'Token is not valid');
			return {
				status: 401,
				body: error.toJSON()
			}
		}

		return {
			status: 200,
			body: {
				valid: valid
			}
		}
	},
	listAllUsers: async ({ req }) => {
		const jwtToken = req.cookies.token;
		const role = getJwtData(jwtToken)?.role;

		if (role == null || role === 'user') {
			const error = new ApiError('Failed to list users', "Requester must be 'admin' or 'root'");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		return {
			status: 200,
			body: {
				users: await getAllUsers()
			}
		}
	},
	delete: async ({ req }) => {
		const { id } = req.body;
		const jwtToken = req.cookies.token;
		const jwtData = getJwtData(jwtToken);
		const role = jwtData?.role;

		if (!id) {
			const error = new ApiError('Failed to list users', "Missing 'id' field");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		if (role == null || role === 'user') {
			const error = new ApiError('Failed to list users', "Requester must be 'admin' or 'root'");
			return {
				status: 400,
				body: error.toJSON()
			}
		}

		return {
			status: 200,
			body: {
				success: await deleteUser(id)
			}
		}
	}
});

export default userController;
