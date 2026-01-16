/**
 * Booking.com scraper
 * Main scraping logic for hotel data collection
 */

import browserService from '../services/browser.service.js';
import exportService from '../services/export.service.js';
import { parseHotels, filterValidHotels } from './booking.parser.js';
import { randomDelay, pageLoadDelay, scrollDelay } from '../utils/delay.js';
import { retry } from '../utils/retry.js';
import logger, { logStart, logComplete, logProgress, logError } from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const MAX_RETRIES = parseInt(process.env.MAX_RETRIES) || 1;

// Base URL for Booking.com search
const BASE_URL = 'https://www.booking.com';

/**
 * Build search URL for a city
 * @param {Object} city - City configuration object
 * @returns {string} Search URL
 */
function buildSearchUrl(city) {
    const params = new URLSearchParams({
        ss: city.searchQuery,
        rows: '25', // Number of results per page
        nflt: '', // No filters
        offset: '0' // Start from first result
    });

    return `${BASE_URL}/searchresults.html?${params.toString()}`;
}

/**
 * Scrape hotels for a single city
 * @param {Object} city - City configuration object
 * @returns {Promise<Array>} Array of hotel data
 */
export async function scrapeCity(city) {
    const startTime = Date.now();
    logStart(city.name);

    let page = null;

    try {
        // Create a new page
        page = await browserService.createPage();

        // Build search URL
        const searchUrl = buildSearchUrl(city);
        logger.info(`Search URL: ${searchUrl}`);

        // Navigate to search results
        await browserService.navigateTo(page, searchUrl);

        // Wait for page to load
        await pageLoadDelay();

        // Handle cookie consent
        await browserService.handleCookieConsent(page);
        await randomDelay(1000, 2000);

        // Scroll to load more results
        await browserService.autoScroll(page, 5);
        await scrollDelay();

        // Check if page is blocked
        const isBlocked = await browserService.isPageBlocked(page);
        if (isBlocked) {
            logger.error(`Page appears to be blocked for ${city.name}`);
            // Take screenshot for debugging
            await browserService.screenshot(page, `blocked-${city.name}-${Date.now()}.png`);
            throw new Error('Page blocked or CAPTCHA detected');
        }

        // Get page HTML
        const html = await page.content();

        // Parse hotels from HTML
        const hotels = parseHotels(html, city);

        // Filter valid hotels
        const validHotels = filterValidHotels(hotels);

        logProgress(city.name, validHotels.length);

        // Calculate duration
        const duration = Date.now() - startTime;
        logComplete(city.name, duration);

        return validHotels;

    } catch (error) {
        logError(city.name, error);

        // Take screenshot on error
        if (page) {
            try {
                await browserService.screenshot(page, `error-${city.name}-${Date.now()}.png`);
            } catch (screenshotError) {
                // Ignore screenshot errors
            }
        }

        throw error;
    } finally {
        // Close the page
        if (page) {
            await browserService.closePage(page);
        }
    }
}

/**
 * Scrape hotels for a city with retry logic
 * @param {Object} city - City configuration object
 * @returns {Promise<Array>} Array of hotel data
 */
export async function scrapeCityWithRetry(city) {
    return retry(
        () => scrapeCity(city),
        {
            maxRetries: MAX_RETRIES,
            baseDelay: 2000,
            context: `scraping ${city.name}`
        }
    );
}

/**
 * Scrape hotels for multiple cities
 * @param {Array} cities - Array of city configuration objects
 * @param {Object} options - Scraping options
 * @returns {Promise<Array>} Array of all hotel data
 */
export async function scrapeCities(cities, options = {}) {
    const {
        saveIncremental = true,
        delayBetweenCities = true
    } = options;

    const allHotels = [];

    logger.info(`Starting scrape for ${cities.length} cities`);

    for (let i = 0; i < cities.length; i++) {
        const city = cities[i];

        try {
            logger.info(`\n${'='.repeat(50)}`);
            logger.info(`Processing city ${i + 1}/${cities.length}: ${city.name}, ${city.country}`);
            logger.info(`${'='.repeat(50)}\n`);

            // Scrape the city
            const hotels = await scrapeCityWithRetry(city);

            // Add to collection
            allHotels.push(...hotels);

            // Save incrementally if requested
            if (saveIncremental && hotels.length > 0) {
                await exportService.save(hotels, {
                    append: true,
                    deduplicate: true
                });
            }

            // Delay between cities to avoid rate limiting
            if (delayBetweenCities && i < cities.length - 1) {
                logger.info('Waiting before next city...');
                await randomDelay(5000, 10000);
            }

        } catch (error) {
            logger.error(`Failed to scrape ${city.name} after all retries:`, {
                message: error.message,
                city: city.name,
                country: city.country
            });
            logger.warn(`Skipping ${city.name} and moving to next city...`);
            // Continue with next city
            continue;
        }
    }

    logger.info(`\nCompleted scraping ${cities.length} cities`);
    logger.info(`Total hotels collected: ${allHotels.length}`);

    return allHotels;
}

/**
 * Scrape a single page with specific URL
 * Useful for testing or custom searches
 * @param {string} url - URL to scrape
 * @param {Object} cityInfo - City information
 * @returns {Promise<Array>} Array of hotel data
 */
export async function scrapePage(url, cityInfo) {
    let page = null;

    try {
        logger.info(`Scraping page: ${url}`);

        // Create page
        page = await browserService.createPage();

        // Navigate
        await browserService.navigateTo(page, url);
        await pageLoadDelay();

        // Handle cookie consent
        await browserService.handleCookieConsent(page);

        // Scroll
        await browserService.autoScroll(page, 3);

        // Get HTML
        const html = await page.content();

        // Parse
        const hotels = parseHotels(html, cityInfo);
        const validHotels = filterValidHotels(hotels);

        logger.info(`Found ${validHotels.length} hotels on page`);

        return validHotels;

    } catch (error) {
        logger.error('Failed to scrape page:', error);
        throw error;
    } finally {
        if (page) {
            await browserService.closePage(page);
        }
    }
}

/**
 * Get hotels count without full scraping
 * Quick check to see how many results are available
 * @param {Object} city - City configuration
 * @returns {Promise<number>} Estimated hotel count
 */
export async function getHotelCount(city) {
    let page = null;

    try {
        page = await browserService.createPage();
        const searchUrl = buildSearchUrl(city);

        await browserService.navigateTo(page, searchUrl);
        await pageLoadDelay();

        // Try to find results count
        const count = await page.evaluate(() => {
            // Look for common result count selectors
            const countElement = document.querySelector('[data-testid*="result"], .sr_header, h1');
            if (countElement) {
                const text = countElement.textContent;
                const match = text.match(/(\d+[\d,]*)\s*propert/i);
                if (match) {
                    return parseInt(match[1].replace(/,/g, ''));
                }
            }
            return 0;
        });

        logger.info(`Estimated ${count} hotels in ${city.name}`);
        return count;

    } catch (error) {
        logger.error('Failed to get hotel count:', error);
        return 0;
    } finally {
        if (page) {
            await browserService.closePage(page);
        }
    }
}
