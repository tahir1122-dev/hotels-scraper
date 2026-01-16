/**
 * Puppeteer browser configuration
 */

import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import { existsSync } from 'fs';
dotenv.config();

/**
 * Get Puppeteer launch options
 * @returns {Object} Puppeteer configuration
 */
export function getPuppeteerConfig() {
    const isHeadless = process.env.HEADLESS === 'true';
    const useProxy = process.env.USE_PROXY === 'true';
    const proxyUrl = process.env.PROXY_URL;

    // Try to use system Chrome (no download needed)
    const chromePaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
    ];

    let execPath;
    for (const path of chromePaths) {
        try {
            if (existsSync(path)) {
                execPath = path;
                break;
            }
        } catch (e) { }
    }

    const config = {
        headless: isHeadless ? 'new' : false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--window-size=1920,1080',
            '--disable-blink-features=AutomationControlled'
        ],
        defaultViewport: {
            width: 1920,
            height: 1080
        },
        ignoreHTTPSErrors: true
    };

    if (execPath) {
        config.executablePath = execPath;
    }

    // Add proxy if enabled
    if (useProxy && proxyUrl) {
        config.args.push(`--proxy-server=${proxyUrl}`);
    }

    return config;
}

/**
 * Page configuration for anti-detection
 */
export const PAGE_CONFIG = {
    // Timeout for navigation (reduced for speed)
    navigationTimeout: 15000,

    // Wait until network is idle (faster)
    waitUntil: 'domcontentloaded',

    // Viewport settings
    viewport: {
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        hasTouch: false,
        isLandscape: true,
        isMobile: false
    }
};

/**
 * Selectors for Booking.com
 * Using data-testid attributes for stability
 */
export const SELECTORS = {
    // Hotel card container
    hotelCard: '[data-testid="property-card"]',

    // Alternative selectors if data-testid changes
    hotelCardAlt: '.sr_property_block, [data-testid="property-card"], .d20f4628d0',

    // Hotel details
    hotelName: '[data-testid="title"]',
    hotelNameAlt: 'h3.sr-card__name, .fcab3ed991.a23c043802',

    address: '[data-testid="address"]',
    addressAlt: '.bui-card__subtitle, [data-testid="address"]',

    rating: '[data-testid="review-score"]',
    ratingAlt: '.bui-review-score__badge, [aria-label*="Scored"]',

    reviewCount: '[data-testid="review-score-total"]',
    reviewCountAlt: '.bui-review-score__text',

    price: '[data-testid="price-and-discounted-price"]',
    priceAlt: '.prco-valign-middle-helper, [data-testid="price-and-discounted-price"]',

    image: 'img[data-testid="image"]',
    imageAlt: '.sr-card__photo-image, img[data-testid="image"]',

    // Property type
    propertyType: '[data-testid="property-type-badge"]',

    // Amenities
    amenities: '[data-testid="facility"]',

    // Free cancellation
    freeCancellation: '[data-testid="free-cancellation"]',

    // Load more button
    loadMoreButton: 'button[type="submit"]',

    // Cookie consent
    cookieAccept: 'button[id="onetrust-accept-btn-handler"]'
};
