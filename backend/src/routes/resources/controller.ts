import express, { Request, Response } from "express";
import computeController from "./compute/controller";

const resourcesController = express.Router();

resourcesController.get('/', async (_req: Request, res: Response) => {
	res.send('working');
});

resourcesController.use('/compute', computeController);

export default resourcesController;
