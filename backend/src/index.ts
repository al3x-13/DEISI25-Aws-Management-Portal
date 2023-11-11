import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { fromEnv } from '@aws-sdk/credential-providers';
import { EC2Client, RunInstancesCommand, RunInstancesCommandInput, TerminateInstancesCommand, TerminateInstancesCommandInput } from '@aws-sdk/client-ec2';
import { logger, activateDebugModeLogging } from './logging/logging';
import { initializeDbConnection } from './db/db';


dotenv.config();

const app = express();
const port = 3000;

// TODO: remove this
const client = new EC2Client({
	credentials: fromEnv(),
	region: 'eu-west-2'
});
let instanceIds: string[] = [];


// Logging
activateDebugModeLogging();
app.use((req: Request, res: Response, next: NextFunction) => {
	logger.info(`HTTP Request (${req.method}) for '${req.path}'`);
	next();
});


// Database connection
if (initializeDbConnection(process.env.DB_URL)) {
	logger.info('Database connection initialized successfully');
} else {
	logger.error('Failed to initialize database connection: verify the connection string');
	process.exit(1);
}


app.get('/', (req, res) => {
	res.send('Hello World!');
});

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
