/**
 * Delay utilities for rate limiting and human-like behavior
 */

import dotenv from 'dotenv';
dotenv.config();

// Get delay range from environment variables
const DELAY_MIN = parseInt(process.env.DELAY_MIN) || 2000;
const DELAY_MAX = parseInt(process.env.DELAY_MAX) || 6000;

/**
 * Generate random delay between min and max
 * @param {number} min - Minimum delay in milliseconds
 * @param {number} max - Maximum delay in milliseconds
 * @returns {number} Random delay value
 */
function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Sleep for a random amount of time
 * @param {number} min - Minimum delay (default from env)
 * @param {number} max - Maximum delay (default from env)
 * @returns {Promise<void>}
 */
export async function randomDelay(min = DELAY_MIN, max = DELAY_MAX) {
    const delay = getRandomDelay(min, max);
    return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Sleep for a specific amount of time
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Delay with exponential backoff
 * Used for retries
 * @param {number} attempt - Current attempt number (0-indexed)
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise<void>}
 */
export async function exponentialBackoff(attempt, baseDelay = 1000) {
    const delay = baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 1000; // Add random jitter
    const totalDelay = delay + jitter;

    return new Promise(resolve => setTimeout(resolve, totalDelay));
}

/**
 * Human-like typing delay
 * Simulates realistic typing speed
 * @param {string} text - Text to type
 * @returns {number} Delay in milliseconds
 */
export function getTypingDelay(text) {
    // Average typing speed: 40-60 WPM = ~200-300ms per word
    const words = text.split(' ').length;
    const baseDelay = words * 250; // 250ms per word
    const jitter = Math.random() * 500; // Random jitter
    return baseDelay + jitter;
}

/**
 * Random scroll delay
 * Simulates human scrolling behavior
 * @returns {Promise<void>}
 */
export async function scrollDelay() {
    const delay = getRandomDelay(500, 1500);
    return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Human-like delay
 * Simulates natural user behavior with variability
 * @param {number} min - Minimum delay (default 1000ms)
 * @param {number} max - Maximum delay (default 3000ms)
 * @returns {Promise<void>}
 */
export async function humanDelay(min = 1000, max = 3000) {
    const delay = getRandomDelay(min, max);
    return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Page load delay
 * Wait for page content to load
 * @returns {Promise<void>}
 */
export async function pageLoadDelay() {
    const delay = getRandomDelay(2000, 4000);
    return new Promise(resolve => setTimeout(resolve, delay));
}
