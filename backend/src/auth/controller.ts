import express, { Request, Response } from "express";

const authController = express.Router();

authController.get('/', (req, res, next) => {
	res.send("NOICE");
});

authController.post('/authenticate', (req: Request, res: Response) => {
	// TODO
});

export default authController;
