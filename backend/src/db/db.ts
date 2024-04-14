import { Pool, QueryResult } from 'pg';
import { logger } from '../logging/logging';


let pool: Pool;

/**
* Initializes the postgres database connection.
* @param connectionString Database connection url
* @returns Whether connection was successful
*/
function initializeConnection(connectionString: string | undefined, callback: (success: boolean) => void): void {
	if (!connectionString) {
		logger.error('Failed to initialize database connection: verify the connection string');
		callback(false);
	}

	pool = new Pool({
		connectionString: connectionString,
	});
	
	const timeout = 60000; // 1 min
    const interval = 10000; // 10 sec
    const startTime = Date.now();

	// checking if the database is up
    const attemptConnection = () => {
        pool.query('SELECT 1')
            .then(_ => callback(true))
            .catch(_ => {
                if (Date.now() - startTime > timeout) {
					logger.error('Failed to initialize database connection: could not establish connection');
                    callback(false);
                } else {
					logger.info('Failed to establish a connection to the database. Trying again in 10 seconds')
                    setTimeout(attemptConnection, interval);
                }
            });
    };
	attemptConnection();
}

/**
 * Closes the active database pool.
 */
function closeConnection(): Promise<void> {
	return pool.end();
}

/**
 * Performs a database query.
 * @param query Database query
 * @param values Query values
 * @returns Query result
 */
async function query(query: string, values?: any[]): Promise<QueryResult<any>> {
	const timerStart = Date.now();
	const queryResponse = await pool.query(query, values);
	const timerEnd = Date.now();
	const queryDuration = `${timerEnd - timerStart} ms`;

	// logging
	logger.info(
		'DB query executed',
		{ query: query, rows: queryResponse.rowCount, duration: queryDuration, timestamp: getQueryTimestamp() }
	);

	return queryResponse;
}

/**
* Gets query timestamp for query logs.
* @returns Query timestamp
*/
function getQueryTimestamp(): string {
	const currentDate = new Date();
	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, '0');
	const day = String(currentDate.getDate()).padStart(2, '0');
	const hours = String(currentDate.getHours()).padStart(2, '0');
	const minutes = String(currentDate.getMinutes()).padStart(2, '0');
	const seconds = String(currentDate.getSeconds()).padStart(2, '0');
	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}


const db = {
	initializeConnection,
	closeConnection,
	query,
};

export default db;
