/**
 * Winston logger configuration
 * Provides structured logging with file and console outputs
 */

import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Custom format for console output
 */
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (Object.keys(meta).length > 0) {
            msg += ` ${JSON.stringify(meta)}`;
        }
        return msg;
    })
);

/**
 * Custom format for file output
 */
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

/**
 * Create logger instance
 */
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports: [
        // Console output
        new winston.transports.Console({
            format: consoleFormat
        }),

        // Error log file
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            format: fileFormat
        }),

        // Combined log file
        new winston.transports.File({
            filename: path.join(logsDir, 'combined.log'),
            format: fileFormat
        }),

        // Daily scraping log
        new winston.transports.File({
            filename: path.join(logsDir, `scraping-${new Date().toISOString().split('T')[0]}.log`),
            format: fileFormat
        })
    ]
});

/**
 * Log scraping progress
 * @param {string} city - City being scraped
 * @param {number} hotelCount - Number of hotels found
 */
export function logProgress(city, hotelCount) {
    logger.info(`Progress: ${city} - ${hotelCount} hotels scraped`);
}

/**
 * Log scraping error
 * @param {string} city - City where error occurred
 * @param {Error} error - Error object
 */
export function logError(city, error) {
    logger.error(`Error scraping ${city}:`, {
        message: error.message,
        stack: error.stack
    });
}

/**
 * Log scraping start
 * @param {string} city - City to scrape
 */
export function logStart(city) {
    logger.info(`Starting scrape for: ${city}`);
}

/**
 * Log scraping completion
 * @param {string} city - City scraped
 * @param {number} duration - Time taken in ms
 */
export function logComplete(city, duration) {
    logger.info(`Completed scrape for ${city} in ${(duration / 1000).toFixed(2)}s`);
}

/**
 * Log retry attempt
 * @param {string} city - City being retried
 * @param {number} attempt - Attempt number
 */
export function logRetry(city, attempt) {
    logger.warn(`Retry attempt ${attempt} for ${city}`);
}

export default logger;
