/**
 * Retry utility with exponential backoff
 * Handles transient failures gracefully
 */

import { exponentialBackoff } from './delay.js';
import logger, { logRetry } from './logger.js';
import dotenv from 'dotenv';

dotenv.config();

const MAX_RETRIES = parseInt(process.env.MAX_RETRIES) || 3;

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retries
 * @param {number} options.baseDelay - Base delay for backoff
 * @param {string} options.context - Context for logging
 * @returns {Promise<any>} Result of the function
 */
export async function retry(fn, options = {}) {
    const {
        maxRetries = MAX_RETRIES,
        baseDelay = 1000,
        context = 'operation'
    } = options;

    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            // Attempt the function
            const result = await fn();

            // Success - return result
            if (attempt > 0) {
                logger.info(`${context} succeeded after ${attempt} retries`);
            }
            return result;

        } catch (error) {
            lastError = error;

            // If this was the last attempt, throw the error
            if (attempt === maxRetries) {
                logger.error(`${context} failed after ${maxRetries} retries:`, {
                    message: error.message,
                    stack: error.stack
                });
                throw error;
            }

            // Log retry attempt
            logRetry(context, attempt + 1);

            // Wait before retrying with exponential backoff
            await exponentialBackoff(attempt, baseDelay);
        }
    }

    // This should never be reached, but just in case
    throw lastError;
}

/**
 * Retry with specific error handling
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @param {Function} options.shouldRetry - Function to determine if error is retryable
 * @param {Function} options.onRetry - Callback on retry
 * @returns {Promise<any>}
 */
export async function retryWithCondition(fn, options = {}) {
    const {
        maxRetries = MAX_RETRIES,
        baseDelay = 1000,
        context = 'operation',
        shouldRetry = () => true,
        onRetry = () => { }
    } = options;

    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // Check if we should retry this error
            if (!shouldRetry(error)) {
                logger.error(`${context} failed with non-retryable error:`, {
                    message: error.message
                });
                throw error;
            }

            // If this was the last attempt, throw
            if (attempt === maxRetries) {
                logger.error(`${context} failed after ${maxRetries} retries`);
                throw error;
            }

            // Call retry callback
            onRetry(error, attempt);

            // Log and wait
            logRetry(context, attempt + 1);
            await exponentialBackoff(attempt, baseDelay);
        }
    }

    throw lastError;
}

/**
 * Check if an error is retryable
 * @param {Error} error - Error to check
 * @returns {boolean}
 */
export function isRetryableError(error) {
    const retryableMessages = [
        'timeout',
        'ETIMEDOUT',
        'ECONNRESET',
        'ECONNREFUSED',
        'ENOTFOUND',
        'network',
        'Navigation timeout',
        'net::ERR_',
        'Protocol error'
    ];

    const errorMessage = error.message.toLowerCase();
    return retryableMessages.some(msg =>
        errorMessage.includes(msg.toLowerCase())
    );
}

/**
 * Retry specifically for network requests
 * @param {Function} fn - Async function to retry
 * @param {string} context - Context for logging
 * @returns {Promise<any>}
 */
export async function retryNetworkRequest(fn, context = 'network request') {
    return retryWithCondition(fn, {
        context,
        shouldRetry: isRetryableError,
        onRetry: (error, attempt) => {
            logger.warn(`Network error on attempt ${attempt + 1}: ${error.message}`);
        }
    });
}
