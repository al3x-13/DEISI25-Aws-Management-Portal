import express, { Request, Response, NextFunction } from 'express';
import { TsRestRequest, createExpressEndpoints, initServer } from "@ts-rest/express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { logger, activateDebugModeLogging } from './logging/logging';
import db from './db/db';
import { dbUrlExists, jwtSecretExists } from './utils/env-utils';
import { protectedContract, unprotectedContract, apiDocsContract } from '@deisi25/types/index';
import authController from './routes/auth/controller';
import { validateRequestHeaders } from './utils/endpoint-utils';
import userController from './routes/user/controller';
import authMiddlewareValidation from './auth/auth-middleware';
import ec2Controller from './routes/resources/compute/ec2/controller';
import * as swaggerui from "swagger-ui-express";
import { generateOpenApi } from "@ts-rest/open-api";
import { buildDocsFromTSRestOAS } from '../docs/docs';
import { OpenAPIObject } from 'openapi3-ts/oas31';


dotenv.config();

const app = express();
const port = 3000;

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
app.use((req: Request, _res: Response, next: NextFunction) => {
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
		(req: TsRestRequest<any>, res, next) => {
			const validateHeadersResult = validateRequestHeaders(req);
			if (validateHeadersResult != null) {
				res.status(validateHeadersResult.status)
					.json(validateHeadersResult.error);
				return;
			}
			next();
		},
	],
	jsonQuery: true
});


const protectedRoutesRouter = server.router(protectedContract, {
	user: userController,
	resources: {
		compute: {
			ec2: ec2Controller,
		}
	}
});

createExpressEndpoints(protectedContract, protectedRoutesRouter, app, {
	globalMiddleware: [
		// validate 'Content-Type' header
		(req: TsRestRequest<any>, res , next) => {
			const validateHeadersResult = validateRequestHeaders(req);
			if (validateHeadersResult != null) {
				res.status(validateHeadersResult.status)
					.json(validateHeadersResult.error);
				return;
			}
			next();
		},

		// auth middleware
		(req: TsRestRequest<any>, res, next) => {
			const authMiddleware = authMiddlewareValidation(req);
			if (authMiddleware != null) {
				res.status(authMiddleware.status).json(authMiddleware.error);
				return;
			}
			next();
		}
	],
	jsonQuery: true
});

const docs = generateOpenApi(apiDocsContract,
	{
		info: {
			title: 'API Docs',
			description: 'API documentation for AWS Management Portal bakcend API.',
			version: '1.0.0',
		},
	},
	{
		jsonQuery: true,
	}
);


const docsOAS = buildDocsFromTSRestOAS(docs as OpenAPIObject);

app.use('/docs', swaggerui.serve, swaggerui.setup(docsOAS));

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
