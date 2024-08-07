import express, { Request, Response, NextFunction } from 'express';
import { TsRestRequest, createExpressEndpoints, initServer } from "@ts-rest/express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { logger, activateDebugModeLogging } from './logging/logging';
import db from './db/db';
import { validateEnvironmentVariablesOnStartup } from './utils/env-utils';
import { protectedContract, unprotectedContract, apiDocsContract, ResourceType } from '@deisi25/types';
import authController from './routes/auth/controller';
import { validateRequestHeaders } from './utils/endpoint-utils';
import userController from './routes/user/controller';
import authMiddlewareValidation from './auth/auth-middleware';
import ec2Controller from './routes/resources/compute/ec2/controller';
import * as swaggerui from "swagger-ui-express";
import { generateOpenApi } from "@ts-rest/open-api";
import { buildDocsFromTSRestOAS } from '../docs/docs';
import { OpenAPIObject } from 'openapi3-ts/oas31';
import sshController from './routes/resources/compute/ssh/controller';
import inviteUnprotectedController from './routes/invite/controllerUnprotected';
import inviteProtectedController from './routes/invite/controllerProtected';


dotenv.config();

const app = express();
const port = 3000;

// Checks for env variables
if (!validateEnvironmentVariablesOnStartup()) {
	console.error('[Startup Failure] Missing environment variables');
	process.exit(1);
}

// config
const allowedCorsOrigins = ['127.0.0.1', 'http://localhost:5173'];
app.use(cors({
	origin: function (origin, callback) {
		if (!origin) return callback(null, true);
		if (allowedCorsOrigins.includes(origin)) {
			return callback(null, true);
		}
		return callback(new Error('Not allowed by CORS'));
	},
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
		process.exit(1);
	}
	logger.info('Database connection initialized successfully');
	console.log('Database connection initialized successfully');
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
			// const success = await deleteResourceMetadata(['f0392jf3290fj', 'f0392jf37fdsfj']);
			const success = true;

			//getEC2Instances(30);

			return {
				status: 200,
				body: {
					test: `Success: ${success}`,
				},
			}
		},
	},
	auth: authController,
	invite: inviteUnprotectedController,
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
	invite: inviteProtectedController,
	resources: {
		compute: {
			ec2: ec2Controller,
			ssh: sshController,
		},
	},
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
			description: 'API documentation for AWS Management Portal backend API.',
			version: '1.0.0',
		},
	},
	{
		jsonQuery: true,
	}
);


const docsOAS = buildDocsFromTSRestOAS(docs as OpenAPIObject);
// console.log(`DOCS: ${JSON.stringify(docsOAS, null, 2)}`);

app.use('/docs', swaggerui.serve, swaggerui.setup(docsOAS));

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
