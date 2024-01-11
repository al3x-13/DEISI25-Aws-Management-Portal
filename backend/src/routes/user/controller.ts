import express, { Request, Response } from 'express';
import { getJwtData } from '../../auth/jwt';
import { ApiError } from '../../utils/errors';

const userController = express.Router();

userController.get('/', async (req: Request, res: Response) => {
	res.send('TESTING');
});


userController.get('/info', async (req: Request, res: Response) => {
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


userController.get('/id', async (req: Request, res: Response) => {
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

userController.get('/username', async (req: Request, res: Response) => {
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

userController.get('/role', async (req: Request, res: Response) => {
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

export default userController;
