/**
 * Booking.com Platform Scraper
 * Production-grade scraper with proxy support and anti-detection
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import proxyService from '../../services/iproyal-proxy.service.js';
import { randomDelay, humanDelay } from '../../utils/delay.js';
import logger from '../../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

// Add stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

const PLATFORM = 'booking';
const BASE_URL = 'https://www.booking.com';

// Selectors for Booking.com - multiple selectors for robustness
const SELECTORS = {
    // Hotel cards - multiple selectors to handle layout variations
    hotelCard: '[data-testid="property-card"]',
    hotelCardAlt: '.sr_property_block, .d20f4628d0, [data-testid="property-card-container"], .c066246e13',
    hotelCardAlt2: '.bui-card, .b978843432',

    // Hotel names
    hotelName: '[data-testid="title"]',
    hotelNameAlt: '.fcab3ed991, .sr-hotel__name, a[data-testid="title-link"]',

    // Prices
    price: '[data-testid="price-and-discounted-price"]',
    priceAlt: '.prco-valign-middle-helper, .fbd1d3018c, .bui-price-display__value, [data-testid="price-for-x-nights"]',

    // Ratings
    rating: '[data-testid="review-score"]',
    ratingAlt: '.b5cd09854e, .bui-review-score__badge, .sr-review-score__badge',

    // Review count
    reviewCount: '[data-testid="review-score"] span:last-child',

    // Address
    address: '[data-testid="address"]',
    addressAlt: '.aee5343fdb, [data-testid="distance"], .sr_card_address_line',

    // Image
    image: '[data-testid="image"]',
    imageAlt: '.f9671d49b1, img.hotel_image',

    // Property type
    propertyType: '[data-testid="property-type-badge"]',

    // Search controls
    searchInput: '[data-testid="destination-container"] input',
    searchInputAlt: '#ss, .sb-searchbox__input',
    searchButton: 'button[type="submit"]',

    // Popups
    cookieAccept: '#onetrust-accept-btn-handler',
    dismissPopup: '[aria-label="Dismiss sign-in info"]',
    geniusPopup: '[data-testid="genius-banner-close"], button[aria-label="Close"]',

    // Load more
    loadMore: 'button[data-testid="show-more-results"]',

    // Results container - to detect page loaded
    resultsContainer: '[data-testid="property-card"], .sr_property_block, #search_results_table'
};

class BookingScraper {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    /**
     * Launch browser with proxy
     */
    async launch(country = null) {
        const args = [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--window-size=1920,1080',
            '--disable-blink-features=AutomationControlled',
            '--ignore-certificate-errors',
            '--ignore-certificate-errors-spki-list'
        ];

        // Add proxy if enabled - using simple HTTP proxy
        if (proxyService.isEnabled()) {
            const auth = proxyService.getAuthentication(country);
            const proxyUrl = `http://${auth.username}:${encodeURIComponent(auth.password)}@${proxyService.host}:${proxyService.port}`;

            // Set proxy as environment variable for Chromium
            process.env.HTTPS_PROXY = proxyUrl;
            process.env.HTTP_PROXY = proxyUrl;

            logger.info(`Booking.com: Using proxy for ${country || 'default'}`);
        }

        this.browser = await puppeteer.launch({
            headless: process.env.HEADLESS === 'true' ? 'new' : false,
            args,
            defaultViewport: { width: 1920, height: 1080 },
            timeout: parseInt(process.env.BROWSER_TIMEOUT) || 60000
        });

        return this.browser;
    }

    /**
     * Create new page with anti-detection
     */
    async createPage(country = null) {
        this.page = await this.browser.newPage();

        // Set viewport to avoid detection
        await this.page.setViewport({ width: 1920, height: 1080 });

        // Proxy auth is now handled via environment variables - no need for page.authenticate

        // Set user agent
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ];
        await this.page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);

        // Set extra headers
        await this.page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
        });

        // Override navigator properties
        await this.page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
            Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
        });

        return this.page;
    }

    /**
     * Search hotels in a city
     */
    async searchHotels(city) {
        const hotels = [];

        try {
            logger.info(`Booking.com: Searching hotels in ${city.name}, ${city.country}`);

            // Build search URL
            const checkIn = this.getCheckInDate();
            const checkOut = this.getCheckOutDate();
            const searchUrl = `${BASE_URL}/searchresults.html?ss=${encodeURIComponent(city.name + ', ' + city.country)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=2&no_rooms=1&group_children=0`;

            logger.info(`Booking.com: Navigating to ${searchUrl}`);

            // Add small delay after authenticate to ensure proxy is ready
            await randomDelay(500, 1000);

            await this.page.goto(searchUrl, {
                waitUntil: 'networkidle2',
                timeout: parseInt(process.env.NAVIGATION_TIMEOUT) || 45000
            });

            // Handle cookie consent
            await this.handleCookies();

            // Wait for results
            await this.waitForResults();

            // Check for blocking
            const isBlocked = await this.checkIfBlocked();
            if (isBlocked) {
                logger.warn(`Booking.com: Page blocked for ${city.name}`);
                return { hotels: [], blocked: true };
            }

            // Auto-scroll to load more results
            await this.autoScroll();

            // Extract hotel data
            const extractedHotels = await this.extractHotels(city);
            hotels.push(...extractedHotels);

            logger.info(`Booking.com: Found ${hotels.length} hotels in ${city.name}`);

            return { hotels, blocked: false };

        } catch (error) {
            logger.error(`Booking.com: Error scraping ${city.name}: ${error.message}`);
            return { hotels: [], blocked: false, error: error.message };
        }
    }

    /**
     * Handle cookie consent popup
     */
    async handleCookies() {
        try {
            const cookieButton = await this.page.$(SELECTORS.cookieAccept);
            if (cookieButton) {
                await cookieButton.click();
                await humanDelay(500, 1000);
            }
        } catch (e) {
            // Ignore cookie handling errors
        }

        try {
            const dismissButton = await this.page.$(SELECTORS.dismissPopup);
            if (dismissButton) {
                await dismissButton.click();
                await humanDelay(500, 1000);
            }
        } catch (e) {
            // Ignore
        }
    }

    /**
     * Wait for search results with multiple fallback selectors
     */
    async waitForResults() {
        const selectors = [
            SELECTORS.hotelCard,
            SELECTORS.hotelCardAlt,
            SELECTORS.hotelCardAlt2,
            SELECTORS.resultsContainer
        ];

        for (const selector of selectors) {
            try {
                await this.page.waitForSelector(selector, { timeout: 8000 });
                logger.info(`Booking.com: Found results using selector: ${selector.substring(0, 30)}...`);
                return true;
            } catch (e) {
                // Try next selector
            }
        }

        // Final fallback - wait for page to fully load
        logger.warn('Booking.com: Primary selectors not found, waiting for page load...');
        await humanDelay(3000, 5000);

        // Check if there are any results at all
        const hasAnyCards = await this.page.evaluate(() => {
            // Try multiple ways to find hotel cards
            const cards1 = document.querySelectorAll('[data-testid="property-card"]');
            const cards2 = document.querySelectorAll('.sr_property_block');
            const cards3 = document.querySelectorAll('[data-testid*="property"]');
            const cards4 = document.querySelectorAll('.c066246e13');
            return cards1.length + cards2.length + cards3.length + cards4.length;
        });

        if (hasAnyCards > 0) {
            logger.info(`Booking.com: Found ${hasAnyCards} cards via fallback detection`);
            return true;
        }

        logger.warn('Booking.com: Could not find hotel cards');
        return false;
    }

    /**
     * Check if page is blocked
     */
    async checkIfBlocked() {
        const content = await this.page.content();
        const lowerContent = content.toLowerCase();

        // More specific blocking indicators
        const blockedIndicators = [
            'we couldn\'t find robots.txt',  // False positive - ignore
            'captcha',
            'challenge',
            'access denied',
            'unusual traffic',
            'verify you are human',
            'please verify',
            'browser verification',
            'you have been blocked',
            'cf-browser-verification',
            'checking your browser'
        ];

        // Check for actual CAPTCHA elements
        const hasCaptcha = await this.page.$('#captcha-box, .g-recaptcha, iframe[src*="recaptcha"], iframe[src*="captcha"]');
        if (hasCaptcha) {
            return true;
        }

        // Check title for blocking
        const title = await this.page.title();
        if (title.toLowerCase().includes('access denied') ||
            title.toLowerCase().includes('blocked') ||
            title.toLowerCase().includes('captcha')) {
            return true;
        }

        // Check for specific blocking patterns (not just any mention of robot)
        const strictBlockingPatterns = [
            'you have been blocked',
            'access denied',
            'captcha',
            'verify you are human',
            'unusual traffic'
        ];

        return strictBlockingPatterns.some(indicator => lowerContent.includes(indicator));
    }

    /**
     * Auto scroll to load more results
     */
    async autoScroll() {
        await this.page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 500;
                const timer = setInterval(() => {
                    const scrollHeight = document.documentElement.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight - window.innerHeight || totalHeight > 5000) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 200);
            });
        });

        await humanDelay(1000, 2000);
    }

    /**
     * Extract hotel data from page
     */
    async extractHotels(city) {
        return await this.page.evaluate((selectors, cityInfo, platform) => {
            const hotels = [];

            // Try multiple selectors to find hotel cards
            let cards = document.querySelectorAll(selectors.hotelCard);
            if (cards.length === 0) {
                // Try splitting alt selectors
                const altSelectors = selectors.hotelCardAlt.split(', ');
                for (const sel of altSelectors) {
                    cards = document.querySelectorAll(sel);
                    if (cards.length > 0) break;
                }
            }
            if (cards.length === 0) {
                cards = document.querySelectorAll(selectors.hotelCardAlt2);
            }

            cards.forEach((card, index) => {
                try {
                    // Hotel name - try multiple selectors
                    let hotelName = null;
                    const nameSelectors = [
                        selectors.hotelName,
                        ...selectors.hotelNameAlt.split(', '),
                        'a[href*="/hotel/"] span',
                        'h3',
                        '.hotel-name'
                    ];
                    for (const sel of nameSelectors) {
                        const el = card.querySelector(sel);
                        if (el && el.textContent.trim()) {
                            hotelName = el.textContent.trim();
                            break;
                        }
                    }

                    if (!hotelName) return;

                    // Price - try multiple selectors
                    let price = null;
                    let currency = 'USD';
                    const priceSelectors = [
                        selectors.price,
                        ...selectors.priceAlt.split(', ')
                    ];
                    for (const sel of priceSelectors) {
                        const el = card.querySelector(sel);
                        if (el && el.textContent.trim()) {
                            const priceText = el.textContent.trim();
                            const priceMatch = priceText.match(/[\d,]+/);
                            if (priceMatch) {
                                price = parseFloat(priceMatch[0].replace(/,/g, ''));
                                if (priceText.includes('€')) currency = 'EUR';
                                else if (priceText.includes('£')) currency = 'GBP';
                                break;
                            }
                        }
                    }

                    // Rating - try multiple selectors
                    let rating = null;
                    const ratingSelectors = [
                        selectors.rating,
                        ...selectors.ratingAlt.split(', ')
                    ];
                    for (const sel of ratingSelectors) {
                        const el = card.querySelector(sel);
                        if (el && el.textContent.trim()) {
                            const ratingMatch = el.textContent.trim().match(/[\d.]+/);
                            if (ratingMatch) {
                                rating = parseFloat(ratingMatch[0]);
                                break;
                            }
                        }
                    }

                    // Review count
                    let reviewCount = 0;
                    const reviewEl = card.querySelector(selectors.reviewCount);
                    if (reviewEl) {
                        const reviewMatch = reviewEl.textContent.match(/[\d,]+/);
                        if (reviewMatch) {
                            reviewCount = parseInt(reviewMatch[0].replace(/,/g, ''));
                        }
                    }

                    // Address - try multiple selectors
                    let address = '';
                    const addressSelectors = [
                        selectors.address,
                        ...selectors.addressAlt.split(', ')
                    ];
                    for (const sel of addressSelectors) {
                        const el = card.querySelector(sel);
                        if (el && el.textContent.trim()) {
                            address = el.textContent.trim();
                            break;
                        }
                    }

                    // Image
                    const imageEl = card.querySelector(selectors.image) || card.querySelector(selectors.imageAlt) || card.querySelector('img');
                    const imageUrl = imageEl?.src || imageEl?.getAttribute('data-src') || '';

                    // URL
                    const linkEl = card.querySelector('a[data-testid="title-link"]') || card.querySelector('a[href*="/hotel/"]') || card.querySelector('a');
                    const hotelUrl = linkEl?.href || '';

                    hotels.push({
                        hotel_name: hotelName,
                        platform: platform,
                        city: cityInfo.name,
                        country: cityInfo.country,
                        region: cityInfo.region,
                        address: address,
                        latitude: null,
                        longitude: null,
                        star_rating: null,
                        review_score: rating,
                        review_count: reviewCount,
                        price_per_night: price,
                        currency: currency,
                        property_type: 'Hotel',
                        amenities: [],
                        image_url: imageUrl,
                        hotel_url: hotelUrl,
                        scraped_at: new Date().toISOString()
                    });
                } catch (e) {
                    console.error('Error parsing hotel card:', e);
                }
            });

            return hotels;
        }, SELECTORS, city, PLATFORM);
    }



    /**
     * Get check-in date (tomorrow)
     */
    getCheckInDate() {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    }

    /**
     * Get check-out date (3 days from now)
     */
    getCheckOutDate() {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        return date.toISOString().split('T')[0];
    }

    /**
     * Scrape city - alias for searchHotels (for unified interface)
     */
    async scrapeCity(city) {
        // Create page if not exists
        if (!this.page) {
            await this.createPage(city.region);
        }

        const result = await this.searchHotels(city);
        return result.hotels || [];
    }

    /**
     * Close browser
     */
    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
        }
    }
}

export default BookingScraper;
