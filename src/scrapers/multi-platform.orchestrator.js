/**
 * Multi-Platform Hotel Scraper Orchestrator
 * Coordinates scraping across Booking.com, Agoda, and Hotels.com
 * with intelligent fallback and retry logic
 */

import BookingScraper from './platforms/booking.scraper.js';
import AgodaScraper from './platforms/agoda.scraper.js';
import HotelsScraper from './platforms/hotels.scraper.js';
import { WORLDWIDE_CITIES, getCitiesByRegion, getAllCities } from '../config/worldwide-cities.js';
import exportService from '../services/export.service.js';
import logger from '../utils/logger.js';
import { randomDelay } from '../utils/delay.js';
import { getScrapedCities, displayScrapingProgress } from '../utils/scrape-tracker.js';
import dotenv from 'dotenv';

dotenv.config();

const MIN_HOTELS_PER_CITY = parseInt(process.env.MIN_HOTELS_PER_CITY) || 1;
const PLATFORMS_ENABLED = {
    booking: process.env.ENABLE_BOOKING !== 'false',
    agoda: process.env.ENABLE_AGODA !== 'false',
    hotels: process.env.ENABLE_HOTELS !== 'false'
};

class MultiPlatformOrchestrator {
    constructor() {
        this.scrapers = {};
        this.results = {
            total: 0,
            byPlatform: { booking: 0, agoda: 0, hotels: 0 },
            byRegion: {},
            failures: [],
            successes: [],
            skipped: []
        };
        this.scrapedCities = getScrapedCities();
        this.skipScraped = process.env.SKIP_SCRAPED_CITIES !== 'false'; // Default true
    }

    /**
     * Initialize all platform scrapers
     */
    async initialize() {
        logger.info('Initializing multi-platform scrapers...');

        if (PLATFORMS_ENABLED.booking) {
            this.scrapers.booking = new BookingScraper();
            logger.info('  ✓ Booking.com scraper ready');
        }

        if (PLATFORMS_ENABLED.agoda) {
            this.scrapers.agoda = new AgodaScraper();
            logger.info('  ✓ Agoda.com scraper ready');
        }

        if (PLATFORMS_ENABLED.hotels) {
            this.scrapers.hotels = new HotelsScraper();
            logger.info('  ✓ Hotels.com scraper ready');
        }

        return Object.keys(this.scrapers).length > 0;
    }

    /**
     * Scrape a single city across all platforms
     */
    async scrapeCity(city) {
        const cityHotels = [];
        const platformResults = {};

        logger.info(`\n${'━'.repeat(60)}`);
        logger.info(`📍 Scraping: ${city.name}, ${city.country}`);
        logger.info(`${'━'.repeat(60)}`);

        // Try each enabled platform
        for (const [platform, scraper] of Object.entries(this.scrapers)) {
            try {
                logger.info(`  → Trying ${platform.charAt(0).toUpperCase() + platform.slice(1)}...`);

                const hotels = await this.scrapeWithRetry(scraper, city, platform);

                if (hotels && hotels.length > 0) {
                    platformResults[platform] = hotels.length;
                    cityHotels.push(...hotels);
                    this.results.byPlatform[platform] += hotels.length;
                    logger.info(`  ✓ ${platform}: Found ${hotels.length} hotels`);
                } else {
                    logger.warn(`  ⚠ ${platform}: No hotels found`);
                }

                // Delay between platforms
                await randomDelay(2000, 4000);

            } catch (error) {
                logger.error(`  ✗ ${platform}: ${error.message}`);
            }
        }

        // Check if we got any results
        if (cityHotels.length >= MIN_HOTELS_PER_CITY) {
            this.results.successes.push({
                city: city.name,
                country: city.country,
                hotels: cityHotels.length,
                platforms: platformResults
            });
            logger.info(`✅ ${city.name}: Total ${cityHotels.length} hotels collected`);
        } else {
            this.results.failures.push({
                city: city.name,
                country: city.country,
                reason: 'Insufficient hotels'
            });
            logger.warn(`❌ ${city.name}: Failed - only ${cityHotels.length} hotels found`);
        }

        return cityHotels;
    }

    /**
     * Scrape with retry logic
     */
    async scrapeWithRetry(scraper, city, platform, maxRetries = 3) {
        let lastError = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // Launch browser for this attempt
                await scraper.launch(city.countryCode);

                // Scrape the city
                const hotels = await scraper.scrapeCity(city);

                // Close browser
                await scraper.close();

                if (hotels && hotels.length > 0) {
                    return hotels;
                }

                // If no hotels, try alternate search query
                if (attempt < maxRetries && city.alternateNames) {
                    logger.info(`    Retry ${attempt}/${maxRetries}: Trying alternate search...`);
                    const altCity = { ...city, searchQuery: city.alternateNames[attempt - 1] };

                    await scraper.launch(city.countryCode);
                    const altHotels = await scraper.scrapeCity(altCity);
                    await scraper.close();

                    if (altHotels && altHotels.length > 0) {
                        return altHotels;
                    }
                }

            } catch (error) {
                lastError = error;
                logger.warn(`    Attempt ${attempt}/${maxRetries} failed: ${error.message}`);

                try {
                    await scraper.close();
                } catch (e) { }

                if (attempt < maxRetries) {
                    await randomDelay(5000, 10000);
                }
            }
        }

        return [];
    }

    /**
     * Scrape all cities in a region
     */
    async scrapeRegion(region) {
        const cities = getCitiesByRegion(region);
        const regionHotels = [];

        logger.info(`\n${'═'.repeat(60)}`);
        logger.info(`🌍 Starting region: ${region} (${cities.length} cities)`);
        logger.info(`${'═'.repeat(60)}`);

        // Filter out already scraped cities
        const citiesToScrape = this.skipScraped
            ? cities.filter(city => !this.scrapedCities.has(city.name))
            : cities;

        const skippedCount = cities.length - citiesToScrape.length;
        if (skippedCount > 0) {
            logger.info(`⏭️  Skipping ${skippedCount} already-scraped cities`);
            logger.info(`📍 Cities to scrape: ${citiesToScrape.length}`);
        }

        this.results.byRegion[region] = { total: 0, cities: 0, skipped: skippedCount };

        for (let i = 0; i < citiesToScrape.length; i++) {
            const city = citiesToScrape[i];

            logger.info(`\n[${i + 1}/${citiesToScrape.length}] ${city.name}, ${city.country}`);

            try {
                const hotels = await this.scrapeCity(city);
                regionHotels.push(...hotels);
                this.results.byRegion[region].total += hotels.length;
                this.results.byRegion[region].cities++;

                // Save incrementally
                if (hotels.length > 0) {
                    await this.saveRegionData(region, hotels);
                }

                // Delay between cities
                const cityDelay = parseInt(process.env.CITY_DELAY_MIN) || 5000;
                const cityDelayMax = parseInt(process.env.CITY_DELAY_MAX) || 10000;
                await randomDelay(cityDelay, cityDelayMax);

            } catch (error) {
                logger.error(`Failed to scrape ${city.name}: ${error.message}`);
            }
        }

        return regionHotels;
    }

    /**
     * Scrape all cities worldwide
     */
    async scrapeAllCities() {
        const allHotels = [];
        const allCities = getAllCities();

        logger.info('\n' + '═'.repeat(60));
        logger.info('🌐 WORLDWIDE HOTEL DATA COLLECTION');
        logger.info('═'.repeat(60));
        logger.info(`Total cities configured: ${allCities.length}`);

        // Display current progress
        if (this.scrapedCities.size > 0) {
            displayScrapingProgress();
        }

        // Filter out already scraped cities
        const citiesToScrape = this.skipScraped
            ? allCities.filter(city => !this.scrapedCities.has(city.name))
            : allCities;

        const skippedCount = allCities.length - citiesToScrape.length;
        if (skippedCount > 0) {
            logger.info(`⏭️  Skipping ${skippedCount} already-scraped cities`);
            this.results.skipped = citiesToScrape.filter(city => this.scrapedCities.has(city.name))
                .map(city => ({ city: city.name, country: city.country }));
        }
        logger.info(`📍 Cities to scrape: ${citiesToScrape.length}`);
        logger.info('═'.repeat(60));

        for (let i = 0; i < citiesToScrape.length; i++) {
            const city = citiesToScrape[i];

            logger.info(`\n[${i + 1}/${citiesToScrape.length}] ${city.name}, ${city.country}`);

            try {
                const hotels = await this.scrapeCity(city);
                allHotels.push(...hotels);

                // Save incrementally by region
                if (hotels.length > 0) {
                    await this.saveRegionData(city.region || 'other', hotels);
                }

                // Delay between cities
                const cityDelay = parseInt(process.env.CITY_DELAY_MIN) || 5000;
                const cityDelayMax = parseInt(process.env.CITY_DELAY_MAX) || 10000;
                await randomDelay(cityDelay, cityDelayMax);

            } catch (error) {
                logger.error(`Failed to scrape ${city.name}: ${error.message}`);
            }
        }

        // Save final combined data
        await this.saveGlobalData(allHotels);

        return allHotels;
    }

    /**
     * Scrape all regions worldwide
     */
    async scrapeWorldwide() {
        const allHotels = [];
        const regions = Object.keys(WORLDWIDE_CITIES);

        logger.info('\n' + '═'.repeat(60));
        logger.info('🌐 WORLDWIDE HOTEL DATA COLLECTION');
        logger.info('═'.repeat(60));
        logger.info(`Regions: ${regions.join(', ')}`);
        logger.info(`Total cities: ${getAllCities().length}`);
        logger.info('═'.repeat(60));

        for (const region of regions) {
            try {
                const regionHotels = await this.scrapeRegion(region);
                allHotels.push(...regionHotels);

                logger.info(`\n📊 ${region} complete: ${regionHotels.length} hotels`);

            } catch (error) {
                logger.error(`Region ${region} failed: ${error.message}`);
            }
        }

        // Save final combined data
        await this.saveGlobalData(allHotels);

        return allHotels;
    }

    /**
     * Save region data to file
     */
    async saveRegionData(region, hotels) {
        const filename = `${region.toLowerCase()}-hotels.json`;
        await exportService.saveToFile(hotels, filename, { append: true, deduplicate: true });
    }

    /**
     * Save global combined data
     */
    async saveGlobalData(hotels) {
        await exportService.saveToFile(hotels, 'global-hotels.json', { deduplicate: true });
        await exportService.save(hotels, { append: true, deduplicate: true });
    }

    /**
     * Get final results summary
     */
    getSummary() {
        return {
            total: this.results.successes.reduce((sum, s) => sum + s.hotels, 0),
            byPlatform: this.results.byPlatform,
            byRegion: this.results.byRegion,
            successfulCities: this.results.successes.length,
            failedCities: this.results.failures.length,
            skippedCities: this.results.skipped.length,
            failures: this.results.failures,
            skipped: this.results.skipped
        };
    }

    /**
     * Close all scrapers
     */
    async closeAll() {
        for (const scraper of Object.values(this.scrapers)) {
            try {
                await scraper.close();
            } catch (e) { }
        }
    }
}

export default MultiPlatformOrchestrator;
