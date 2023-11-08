import { createLogger, format, transports } from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}),
		format.errors({ stack: true }),
		format.splat(),
		format.json(),
	),
	defaultMeta: { service: 'backend-api' },
	transports: [
		new transports.File({ filename: 'logs/error.log', level: 'error' }),
		new transports.File({ filename: 'logs/logs.log' }),
	],
})

function activateDebugModeLogging() {
	if (process.env.NODE_ENV !== 'production') {
		logger.add(new transports.Console({
			format: format.combine(
				format.colorize(),
				format.cli(),
			),
		}));
	}
}

export { logger, activateDebugModeLogging };
