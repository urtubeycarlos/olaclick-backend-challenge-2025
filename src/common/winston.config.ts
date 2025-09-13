import * as winston from 'winston';
import 'winston-daily-rotate-file';

const transport = new winston.transports.DailyRotateFile({
    filename: './logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '5m',
    maxFiles: '14d',
    level: 'info',
});

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        transport,
        new winston.transports.Console(), // Opcional: también loguea en consola
    ],
});
