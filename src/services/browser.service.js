/**
 * Browser service - manages Puppeteer browser instances
 * Implements anti-detection measures and lifecycle management
 */

import puppeteer from 'puppeteer';
import { getPuppeteerConfig, PAGE_CONFIG } from '../config/puppeteer.config.js';
import { getRandomUserAgent } from '../config/headers.js';
import logger from '../utils/logger.js';

class BrowserService {
    constructor() {
        this.browser = null;
        this.pages = new Map();
    }

    /**
     * Launch browser instance
     * @returns {Promise<Browser>}
     */
    async launch() {
        if (this.browser) {
            return this.browser;
        }

        try {
            const config = getPuppeteerConfig();
            logger.info('Launching browser...', { headless: config.headless });

            this.browser = await puppeteer.launch(config);

            logger.info('Browser launched successfully');
            return this.browser;
        } catch (error) {
            logger.error('Failed to launch browser:', error);
            throw error;
        }
    }

    /**
     * Create a new page with anti-detection measures
     * @returns {Promise<Page>}
     */
    async createPage() {
        if (!this.browser) {
            await this.launch();
        }

        try {
            const page = await this.browser.newPage();

            // Set viewport
            await page.setViewport(PAGE_CONFIG.viewport);

            // Set random user agent
            const userAgent = getRandomUserAgent();
            await page.setUserAgent(userAgent);

            // Set extra HTTP headers
            await page.setExtraHTTPHeaders({
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            });

            // Disable automation detection
            await page.evaluateOnNewDocument(() => {
                // Override the navigator.webdriver property
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => false
                });

                // Override plugins to appear like a real browser
                Object.defineProperty(navigator, 'plugins', {
                    get: () => [1, 2, 3, 4, 5]
                });

                // Override languages
                Object.defineProperty(navigator, 'languages', {
                    get: () => ['en-US', 'en']
                });

                // Chrome runtime
                window.chrome = {
                    runtime: {}
                };

                // Permissions
                const originalQuery = window.navigator.permissions.query;
                window.navigator.permissions.query = (parameters) => (
                    parameters.name === 'notifications' ?
                        Promise.resolve({ state: Notification.permission }) :
                        originalQuery(parameters)
                );
            });

            // Set default timeout
            page.setDefaultNavigationTimeout(PAGE_CONFIG.navigationTimeout);
            page.setDefaultTimeout(PAGE_CONFIG.navigationTimeout);

            // Store page reference
            const pageId = `page_${Date.now()}_${Math.random()}`;
            this.pages.set(pageId, page);

            logger.info('New page created with anti-detection measures');

            return page;
        } catch (error) {
            logger.error('Failed to create page:', error);
            throw error;
        }
    }

    /**
     * Navigate to URL with retries
     * @param {Page} page - Puppeteer page
     * @param {string} url - URL to navigate to
     * @returns {Promise<void>}
     */
    async navigateTo(page, url) {
        try {
            logger.info(`Navigating to: ${url}`);

            await page.goto(url, {
                waitUntil: PAGE_CONFIG.waitUntil,
                timeout: PAGE_CONFIG.navigationTimeout
            });

            // Wait for page to be fully loaded
            await page.waitForTimeout(2000);

            logger.info('Navigation successful');
        } catch (error) {
            logger.error(`Navigation failed for ${url}:`, error);
            throw error;
        }
    }

    /**
     * Handle cookie consent dialogs
     * @param {Page} page - Puppeteer page
     */
    async handleCookieConsent(page) {
        try {
            // Common cookie consent selectors
            const cookieSelectors = [
                'button[id*="accept"]',
                'button[id*="cookie"]',
                'button.onetrust-close-btn-handler',
                '#onetrust-accept-btn-handler',
                'button[aria-label*="Accept"]',
                '.cookie-banner button',
                '[data-testid="cookie-accept"]'
            ];

            for (const selector of cookieSelectors) {
                try {
                    const button = await page.$(selector);
                    if (button) {
                        await button.click();
                        logger.info('Cookie consent accepted');
                        await page.waitForTimeout(1000);
                        break;
                    }
                } catch (e) {
                    // Continue to next selector
                }
            }
        } catch (error) {
            // Cookie consent is optional, don't fail
            logger.debug('No cookie consent found or already accepted');
        }
    }

    /**
     * Scroll page to load dynamic content
     * @param {Page} page - Puppeteer page
     * @param {number} maxScrolls - Maximum number of scrolls
     * @returns {Promise<void>}
     */
    async autoScroll(page, maxScrolls = 10) {
        try {
            logger.info('Auto-scrolling page...');

            let scrollCount = 0;
            let previousHeight = 0;

            while (scrollCount < maxScrolls) {
                // Get current scroll height
                const currentHeight = await page.evaluate(() => {
                    return document.body.scrollHeight;
                });

                // If no new content, break
                if (currentHeight === previousHeight) {
                    logger.info('No new content loaded, stopping scroll');
                    break;
                }

                // Scroll to bottom
                await page.evaluate(() => {
                    window.scrollTo(0, document.body.scrollHeight);
                });

                // Wait for content to load
                await page.waitForTimeout(2000);

                previousHeight = currentHeight;
                scrollCount++;

                logger.debug(`Scroll ${scrollCount}/${maxScrolls}`);
            }

            logger.info(`Auto-scroll completed (${scrollCount} scrolls)`);
        } catch (error) {
            logger.error('Auto-scroll failed:', error);
            // Don't throw - scrolling is optional
        }
    }

    /**
     * Take screenshot for debugging
     * @param {Page} page - Puppeteer page
     * @param {string} filename - Screenshot filename
     */
    async screenshot(page, filename) {
        try {
            await page.screenshot({
                path: `logs/${filename}`,
                fullPage: true
            });
            logger.info(`Screenshot saved: ${filename}`);
        } catch (error) {
            logger.error('Screenshot failed:', error);
        }
    }

    /**
     * Close a specific page
     * @param {Page} page - Page to close
     */
    async closePage(page) {
        try {
            await page.close();

            // Remove from tracking
            for (const [id, p] of this.pages.entries()) {
                if (p === page) {
                    this.pages.delete(id);
                    break;
                }
            }

            logger.debug('Page closed');
        } catch (error) {
            logger.error('Failed to close page:', error);
        }
    }

    /**
     * Close browser and all pages
     */
    async close() {
        try {
            if (this.browser) {
                await this.browser.close();
                this.browser = null;
                this.pages.clear();
                logger.info('Browser closed');
            }
        } catch (error) {
            logger.error('Failed to close browser:', error);
        }
    }

    /**
     * Check if page is blocked or shows captcha
     * @param {Page} page - Puppeteer page
     * @returns {Promise<boolean>}
     */
    async isPageBlocked(page) {
        try {
            const content = await page.content();
            const text = await page.evaluate(() => document.body.innerText);

            // Check for common blocking indicators
            const blockingIndicators = [
                'captcha',
                'robot',
                'blocked',
                'access denied',
                'unusual traffic',
                'verify you are human'
            ];

            const contentLower = (content + text).toLowerCase();

            for (const indicator of blockingIndicators) {
                if (contentLower.includes(indicator)) {
                    logger.warn(`Page appears to be blocked (found: ${indicator})`);
                    return true;
                }
            }

            return false;
        } catch (error) {
            logger.error('Failed to check if page is blocked:', error);
            return false;
        }
    }
}

// Export singleton instance
export default new BrowserService();
