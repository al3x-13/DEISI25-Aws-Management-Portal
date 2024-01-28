import express, { Request, Response, NextFunction } from 'express';
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { fromEnv } from '@aws-sdk/credential-providers';
import { EC2Client, RunInstancesCommand, RunInstancesCommandInput, TerminateInstancesCommand, TerminateInstancesCommandInput } from '@aws-sdk/client-ec2';
import { logger, activateDebugModeLogging } from './logging/logging';
import db from './db/db';
import authMiddleware from './auth/auth-middleware';
import { dbUrlExists, jwtSecretExists } from './utils/env-utils';
import mainController from './routes/controller';
import authControllerOld from './routes/auth/controller';
import { ApiError } from './utils/errors';
import { protectedContract, unprotectedContract } from '@deisi25/types/index';
import authController from './routes/auth/controller';
import { isContentTypeValid, validateRequestHeaders } from './utils/endpoint-utils';
import userController from './routes/user/controller';


dotenv.config();

const app = express();
const port = 3000;

// TODO: remove this
const client = new EC2Client({
	credentials: fromEnv(),
	region: 'eu-west-2'
});
let instanceIds: string[] = [];

// Checks for env variables
if (!jwtSecretExists() || !dbUrlExists()) {
	process.exit(1);
}

// config
app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Logging
activateDebugModeLogging();
app.use((req: Request, res: Response, next: NextFunction) => {
	logger.info(`HTTP Request (${req.method}) for '${req.path}'`);
	next();
});

// Database connection
db.initializeConnection(process.env.DB_URL, (success: boolean) => {
	if (!success) {
		logger.error('Failed to initialize database connection: verify the connection string');
		process.exit(1);
	}
	logger.info('Database connection initialized successfully');
});


// app.get('/', (req, res) => {
// 	res.send('Hello World!');
// });
//
// app.get('/test', (req, res) => {
// 	res.send('Big F');
// });


// contract endpoints
const server = initServer();

const unprotectedRoutesRouter = server.router(unprotectedContract, {
	test: {
		default: async ({}) => {
			return {
				status: 200,
				body: 'test',
			}
		},
		test: async () => {
			return {
				status: 200,
				body: {
					test: 'testing',
				},
			}
		},
	},
	auth: authController,
});

createExpressEndpoints(unprotectedContract, unprotectedRoutesRouter, app, {
	globalMiddleware: [
		// validate 'Content-Type' header
		(req: Request, res: Response, next: NextFunction) => {
			const validateHeadersResult = validateRequestHeaders(req);
			if (validateHeadersResult != null) {
				res.status(400).json(validateHeadersResult.toJSON());
				return;
			}
			next();
		},
	]
});


const protectedRoutesRouter = server.router(protectedContract, {
	user: userController,
});

createExpressEndpoints(protectedContract, protectedRoutesRouter, app, {
	globalMiddleware: [
		// validate 'Content-Type' header
		(req: Request, res: Response, next: NextFunction) => {
			const validateHeadersResult = validateRequestHeaders(req);
			if (validateHeadersResult != null) {
				res.status(400).json(validateHeadersResult.toJSON());
				return;
			}
			next();
		},
	]
});

// Auth routes
// app.use('/auth', authControllerOld);

// Auth middleware setup
// app.use(authMiddleware);

// Routes (auth required)
app.use('/', mainController);


// TODO: remove this (testing)
app.get('/create', async (req, res) => {
	const instanceInput: RunInstancesCommandInput = {
		ImageId: 'ami-04fb7beeed4da358b',	// Amazon Linux 2023 AMI
		InstanceType: 't2.micro',
		MinCount: 1,
		MaxCount: 1
	};

	const command = new RunInstancesCommand(instanceInput);
	try {
		const response = await client.send(command);
		const instance = response.Instances?.at(0)?.InstanceId;
		if (instance) {
			instanceIds.push(instance);
		}

		console.log(response);
		res.send(`Instance ${instanceIds} created successfully.`);
	} catch (err) {
		console.log(err);
		res.send(`Error ocurred while creating instace: ${instanceIds}.`);
	}
});

app.get('/terminate', async (req, res) => {
	console.log("InstanceIds:", instanceIds);
	const terminateInput: TerminateInstancesCommandInput = {
		InstanceIds: instanceIds
	};
	
	const command = new TerminateInstancesCommand(terminateInput);
	try {
		const response = await client.send(command);
		console.log(response);
		res.send(`Instance ${instanceIds} successfully deleted.`);
	} catch (err) {
		console.log(err);
		res.send(`Error ocurred while deleting instance: ${instanceIds}.`)
	}
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
