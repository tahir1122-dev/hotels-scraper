/**
 * Agoda.com Platform Scraper
 * Production-grade scraper with proxy support
 */

import puppeteer from 'puppeteer';
import proxyService from '../../services/iproyal-proxy.service.js';
import { randomDelay, humanDelay } from '../../utils/delay.js';
import logger from '../../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const PLATFORM = 'agoda';
const BASE_URL = 'https://www.agoda.com';

// Selectors for Agoda
const SELECTORS = {
    hotelCard: '[data-selenium="hotel-item"]',
    hotelCardAlt: '.PropertyCard, .hotel-list-item, [data-element-name="property-card"]',
    hotelName: '[data-selenium="hotel-name"]',
    hotelNameAlt: '.PropertyCard__HotelName, .hotel-name',
    price: '[data-selenium="display-price"]',
    priceAlt: '.PropertyCardPrice__Value, .price-text',
    rating: '[data-selenium="review-score"]',
    ratingAlt: '.PropertyCard__ReviewScore, .review-score',
    reviewCount: '[data-selenium="review-count"]',
    address: '[data-selenium="area-city-text"]',
    addressAlt: '.PropertyCard__Address',
    image: '[data-selenium="hotel-img"]',
    imageAlt: '.PropertyCard__Image img',
    cookieAccept: '#onetrust-accept-btn-handler, .CookieBanner button',
    searchInput: '#textInput',
    searchButton: '[data-selenium="search-button"]'
};

class AgodaScraper {
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
            '--disable-blink-features=AutomationControlled'
        ];

        if (proxyService.isEnabled()) {
            const proxyArgs = proxyService.getPuppeteerArgs(country);
            args.push(...proxyArgs);
            logger.info(`Agoda: Using proxy for ${country || 'default'}`);
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

        // Authenticate proxy if needed (must be done before any navigation)
        if (proxyService.isEnabled()) {
            const auth = proxyService.getAuthentication(country);
            if (auth) {
                await this.page.authenticate(auth);
            }
        }

        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ];
        await this.page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);

        await this.page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
        });

        await this.page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
        });

        return this.page;
    }

    /**
     * Search hotels in a city
     */
    async searchHotels(city) {
        const hotels = [];

        try {
            logger.info(`Agoda: Searching hotels in ${city.name}, ${city.country}`);

            const checkIn = this.getCheckInDate();
            const checkOut = this.getCheckOutDate();

            // Agoda URL format
            const searchUrl = `${BASE_URL}/search?city=-1&checkIn=${checkIn}&checkOut=${checkOut}&rooms=1&adults=2&children=0&cid=-1&textToSearch=${encodeURIComponent(city.name + ' ' + city.country)}`;

            logger.info(`Agoda: Navigating to search page`);

            await this.page.goto(searchUrl, {
                waitUntil: 'domcontentloaded',
                timeout: parseInt(process.env.NAVIGATION_TIMEOUT) || 30000
            });

            await this.handleCookies();
            await this.waitForResults();

            const isBlocked = await this.checkIfBlocked();
            if (isBlocked) {
                logger.warn(`Agoda: Page blocked for ${city.name}`);
                return { hotels: [], blocked: true };
            }

            await this.autoScroll();
            const extractedHotels = await this.extractHotels(city);
            hotels.push(...extractedHotels);

            logger.info(`Agoda: Found ${hotels.length} hotels in ${city.name}`);

            return { hotels, blocked: false };

        } catch (error) {
            logger.error(`Agoda: Error scraping ${city.name}: ${error.message}`);
            return { hotels: [], blocked: false, error: error.message };
        }
    }

    /**
     * Handle cookie consent
     */
    async handleCookies() {
        try {
            const cookieButton = await this.page.$(SELECTORS.cookieAccept);
            if (cookieButton) {
                await cookieButton.click();
                await humanDelay(500, 1000);
            }
        } catch (e) { }
    }

    /**
     * Wait for results
     */
    async waitForResults() {
        try {
            await this.page.waitForSelector(SELECTORS.hotelCard, { timeout: 10000 });
        } catch (e) {
            try {
                await this.page.waitForSelector(SELECTORS.hotelCardAlt, { timeout: 5000 });
            } catch (e2) {
                logger.warn('Agoda: Could not find hotel cards');
            }
        }
    }

    /**
     * Check if blocked
     */
    async checkIfBlocked() {
        const content = await this.page.content();
        const blockedIndicators = ['robot', 'captcha', 'blocked', 'verify'];
        const lowerContent = content.toLowerCase();
        return blockedIndicators.some(indicator => lowerContent.includes(indicator));
    }

    /**
     * Auto scroll
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
     * Extract hotel data
     */
    async extractHotels(city) {
        return await this.page.evaluate((selectors, cityInfo, platform) => {
            const hotels = [];

            let cards = document.querySelectorAll(selectors.hotelCard);
            if (cards.length === 0) {
                cards = document.querySelectorAll(selectors.hotelCardAlt);
            }

            cards.forEach((card) => {
                try {
                    let nameEl = card.querySelector(selectors.hotelName) || card.querySelector(selectors.hotelNameAlt);
                    const hotelName = nameEl?.textContent?.trim() || null;

                    if (!hotelName) return;

                    let priceEl = card.querySelector(selectors.price) || card.querySelector(selectors.priceAlt);
                    let priceText = priceEl?.textContent?.trim() || '';
                    let price = null;
                    let currency = 'USD';

                    const priceMatch = priceText.match(/[\d,]+/);
                    if (priceMatch) {
                        price = parseFloat(priceMatch[0].replace(/,/g, ''));
                    }

                    let ratingEl = card.querySelector(selectors.rating) || card.querySelector(selectors.ratingAlt);
                    let ratingText = ratingEl?.textContent?.trim() || '';
                    let rating = null;
                    const ratingMatch = ratingText.match(/[\d.]+/);
                    if (ratingMatch) {
                        rating = parseFloat(ratingMatch[0]);
                    }

                    let addressEl = card.querySelector(selectors.address) || card.querySelector(selectors.addressAlt);
                    const address = addressEl?.textContent?.trim() || '';

                    let imageEl = card.querySelector(selectors.image) || card.querySelector(selectors.imageAlt);
                    const imageUrl = imageEl?.src || imageEl?.getAttribute('data-src') || '';

                    let linkEl = card.querySelector('a[href*="/hotel/"]') || card.querySelector('a');
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
                        review_count: 0,
                        price_per_night: price,
                        currency: currency,
                        property_type: 'Hotel',
                        amenities: [],
                        image_url: imageUrl,
                        hotel_url: hotelUrl,
                        scraped_at: new Date().toISOString()
                    });
                } catch (e) { }
            });

            return hotels;
        }, SELECTORS, city, PLATFORM);
    }

    /**
     * Scrape city - alias for searchHotels (unified interface)
     */
    async scrapeCity(city) {
        if (!this.page) {
            await this.createPage(city.region);
        }
        const result = await this.searchHotels(city);
        return result.hotels || [];
    }

    getCheckInDate() {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    }

    getCheckOutDate() {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        return date.toISOString().split('T')[0];
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
        }
    }
}

export default AgodaScraper;
