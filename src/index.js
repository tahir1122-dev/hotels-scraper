/**
 * Main entry point for the Booking.com hotel scraper
 * Production-ready web scraping application
 */

import dotenv from 'dotenv';
dotenv.config();

import { getAllCities, getCitiesByRegion } from './config/cities.js';
import exportService from './services/export.service.js';
import logger from './utils/logger.js';

// Determine data source
const DATA_SOURCE = process.env.DATA_SOURCE || 'osm'; // Default to OSM (free!)
const USE_API = process.env.USE_API === 'true'; // Legacy support

/**
 * Main scraping function
 */
async function main() {
    const startTime = Date.now();

    try {
        logger.info('🚀 Starting Hotel Data Collector');
        logger.info('='.repeat(60));

        // Determine mode
        let mode = DATA_SOURCE;
        if (USE_API && DATA_SOURCE === 'osm') {
            mode = 'rapidapi'; // Legacy: USE_API=true means RapidAPI
        }

        // Log configuration
        logger.info('Configuration:');
        logger.info(`  Data Source: ${mode.toUpperCase()}`);

        if (mode === 'booking') {
            logger.info('  🏨 Booking.com only (most reliable)');
            logger.info(`  📡 Proxy: ${process.env.USE_PROXY === 'true' ? 'ENABLED (IPRoyal)' : 'DISABLED'}`);
            logger.info(`  🌍 Coverage: Worldwide`);
        } else if (mode === 'multi-platform') {
            logger.info('  🚀 Multi-Platform Scraping: Booking.com + Agoda + Hotels.com');
            logger.info(`  📡 Proxy: ${process.env.USE_PROXY === 'true' ? 'ENABLED (IPRoyal)' : 'DISABLED'}`);
            logger.info(`  🌍 Coverage: Worldwide`);
        } else if (mode === 'osm') {
            logger.info('  💚 OpenStreetMap - 100% FREE, no API key needed!');
            logger.info('  ℹ️  Provides: name, location, address, amenities');
            logger.info('  ⚠️  Does NOT provide: prices, availability');
        } else if (mode === 'rapidapi') {
            logger.info('  RapidAPI: Requires API key');
        } else if (mode === 'scraping') {
            logger.info(`  Headless: ${process.env.HEADLESS}`);
            logger.info(`  Proxy: ${process.env.USE_PROXY === 'true' ? 'Enabled' : 'Disabled'}`);
        }

        logger.info(`  Delay: ${process.env.DELAY_MIN}ms - ${process.env.DELAY_MAX}ms`);
        logger.info(`  Max Retries: ${process.env.MAX_RETRIES}`);
        logger.info(`  Output Dir: ${process.env.OUTPUT_DIR}`);
        logger.info('='.repeat(60));

        // Check proxy status
        if (mode === 'scraping' && process.env.USE_PROXY === 'true') {
            const { default: proxyService } = await import('./services/proxy.service.js');
            logger.info('Proxy is enabled');
            const proxyStats = proxyService.getStats();
            logger.info(`Current proxy: ${proxyStats.currentProxy}`);
        }

        // Load existing hotels for deduplication
        await exportService.loadExistingHotels();

        // Get cities to fetch - ALL WORLDWIDE CITIES
        const cities = getAllCities();
        logger.info(`\nCities to fetch: ${cities.length} (Worldwide - all regions)`);

        // You can also fetch specific regions:
        // const cities = getCitiesByRegion('EUROPE');
        // const cities = getCitiesByRegion('NORTH_AMERICA');
        // const cities = getCitiesByRegion('ASIA');

        // Display cities
        logger.info('\nTarget cities:');
        cities.forEach((city, index) => {
            logger.info(`  ${index + 1}. ${city.name}, ${city.country}`);
        });
        logger.info('');

        let hotels;

        if (mode === 'multi-platform' || mode === 'booking') {
            // Use multi-platform scraping with proxy (Booking.com focused)
            if (mode === 'booking') {
                logger.info('🏨 Using Booking.com Scraper (with IPRoyal proxy)');
                // Override to booking only
                process.env.ENABLE_AGODA = 'false';
                process.env.ENABLE_HOTELS = 'false';
            } else {
                logger.info('🌐 Using Multi-Platform Scraping (Booking.com, Agoda, Hotels.com)');
            }
            logger.info(`📡 Proxy: ${process.env.USE_PROXY === 'true' ? 'ENABLED' : 'DISABLED'}\n`);

            const MultiPlatformOrchestrator = (await import('./scrapers/multi-platform.orchestrator.js')).default;
            const orchestrator = new MultiPlatformOrchestrator();

            await orchestrator.initialize();

            // Scrape all worldwide cities
            logger.info('🌍 Scraping ALL WORLDWIDE CITIES...\n');
            hotels = await orchestrator.scrapeAllCities();

            // Get detailed summary
            const summary = orchestrator.getSummary();
            logger.info('\n📊 Platform Results:');
            logger.info(`  Booking.com: ${summary.byPlatform.booking} hotels`);
            if (mode !== 'booking') {
                logger.info(`  Agoda.com: ${summary.byPlatform.agoda} hotels`);
                logger.info(`  Hotels.com: ${summary.byPlatform.hotels} hotels`);
            }

            await orchestrator.closeAll();

        } else if (mode === 'osm') {
            // Use OpenStreetMap (FREE!)
            logger.info('🌍 Using OpenStreetMap Overpass API (100% free!)\n');

            const osmAPIService = (await import('./services/osm-api.service.js')).default;
            hotels = await osmAPIService.fetchMultipleCities(cities);

        } else if (mode === 'rapidapi') {
            // Use RapidAPI
            logger.info('Using RapidAPI Booking.com API\n');

            const hotelAPIService = (await import('./services/hotel-api.service.js')).default;
            hotels = await hotelAPIService.fetchMultipleCities(cities);

        } else {
            // Use web scraping (legacy - may get blocked)
            logger.warn('⚠️  Using web scraping mode - may encounter blocks/CAPTCHAs');
            logger.warn('⚠️  Consider switching to multi-platform mode\n');

            const { scrapeCities } = await import('./scrapers/booking.scraper.js');
            const { default: browserService } = await import('./services/browser.service.js');

            await browserService.launch();

            hotels = await scrapeCities(cities, {
                saveIncremental: true,
                delayBetweenCities: true
            });
        }

        // Final save (in case incremental saving was disabled)
        if (hotels.length > 0) {
            logger.info('\nSaving final results...');
            await exportService.save(hotels, {
                append: true,
                deduplicate: true
            });
        }

        // Get statistics
        const stats = exportService.getStats();

        // Calculate duration
        const duration = Date.now() - startTime;
        const minutes = Math.floor(duration / 60000);
        const seconds = ((duration % 60000) / 1000).toFixed(0);

        // Display summary
        logger.info('\n' + '='.repeat(60));
        logger.info('✅ DATA COLLECTION COMPLETED SUCCESSFULLY');
        logger.info('='.repeat(60));
        logger.info(`Data Source: ${mode.toUpperCase()}`);
        logger.info(`Total time: ${minutes}m ${seconds}s`);
        logger.info(`Hotels collected: ${hotels.length}`);
        logger.info(`Total unique hotels: ${stats.uniqueHotels}`);
        logger.info(`Output files:`);
        logger.info(`  JSON: ${stats.jsonFile}`);
        logger.info(`  CSV: ${stats.csvFile}`);
        logger.info('='.repeat(60));

    } catch (error) {
        logger.error('Fatal error in main process:', error);
        process.exit(1);
    } finally {
        // Clean up (only for web scraping mode)
        if (mode === 'scraping') {
            try {
                const { default: browserService } = await import('./services/browser.service.js');
                logger.info('\nClosing browser...');
                await browserService.close();
                logger.info('Cleanup complete');
            } catch (e) {
                // Browser might not be initialized
            }
        }
    }
}

/**
 * Scrape specific cities
 * @param {Array<string>} cityNames - Array of city names to scrape
 */
async function scrapeSpecificCities(cityNames) {
    try {
        const allCities = getAllCities();
        const citiesToScrape = allCities.filter(city =>
            cityNames.includes(city.name)
        );

        if (citiesToScrape.length === 0) {
            logger.error('No matching cities found');
            return;
        }

        logger.info(`Scraping ${citiesToScrape.length} specific cities`);

        await exportService.loadExistingHotels();
        await browserService.launch();

        const hotels = await scrapeCities(citiesToScrape, {
            saveIncremental: true,
            delayBetweenCities: true
        });

        await exportService.save(hotels, {
            append: true,
            deduplicate: true
        });

        logger.info(`Completed scraping ${hotels.length} hotels`);

    } catch (error) {
        logger.error('Error scraping specific cities:', error);
    } finally {
        await browserService.close();
    }
}

/**
 * Scrape by region
 * @param {string} region - 'EUROPE', 'NORTH_AMERICA', 'ASIA', 'OCEANIA', 'SOUTH_AMERICA', or 'AFRICA'
 */
async function scrapeByRegion(region) {
    try {
        const cities = getCitiesByRegion(region.toUpperCase());

        if (cities.length === 0) {
            logger.error(`No cities found for region: ${region}`);
            return;
        }

        logger.info(`Scraping ${region}: ${cities.length} cities`);

        await exportService.loadExistingHotels();
        await browserService.launch();

        const hotels = await scrapeCities(cities, {
            saveIncremental: true,
            delayBetweenCities: true
        });

        await exportService.save(hotels, {
            append: true,
            deduplicate: true
        });

        logger.info(`Completed scraping ${hotels.length} hotels from ${region}`);

    } catch (error) {
        logger.error(`Error scraping region ${region}:`, error);
    } finally {
        await browserService.close();
    }
}

// Handle process termination gracefully
process.on('SIGINT', async () => {
    logger.info('\n\nReceived SIGINT, shutting down gracefully...');
    await browserService.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.info('\n\nReceived SIGTERM, shutting down gracefully...');
    await browserService.close();
    process.exit(0);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Check command line arguments
const args = process.argv.slice(2);

if (args.length > 0) {
    const command = args[0];

    switch (command) {
        case '--europe':
            scrapeByRegion('EUROPE');
            break;
        case '--north-america':
        case '--northamerica':
            scrapeByRegion('NORTH_AMERICA');
            break;
        case '--asia':
            scrapeByRegion('ASIA');
            break;
        case '--oceania':
            scrapeByRegion('OCEANIA');
            break;
        case '--south-america':
        case '--southamerica':
            scrapeByRegion('SOUTH_AMERICA');
            break;
        case '--africa':
            scrapeByRegion('AFRICA');
            break;
        case '--city':
            // Scrape specific cities: node src/index.js --city Paris London
            const cityNames = args.slice(1);
            if (cityNames.length === 0) {
                logger.error('Please provide city names: --city Paris London');
                process.exit(1);
            }
            scrapeSpecificCities(cityNames);
            break;
        case '--help':
            console.log(`
Booking.com Hotel Scraper - Worldwide Edition

Usage:
  node src/index.js                        # Scrape all cities worldwide
  node src/index.js --europe               # Scrape European cities only
  node src/index.js --north-america        # Scrape North American cities only
  node src/index.js --asia                 # Scrape Asian cities only
  node src/index.js --oceania              # Scrape Oceania cities only
  node src/index.js --south-america        # Scrape South American cities only
  node src/index.js --africa               # Scrape African cities only
  node src/index.js --city Paris Tokyo     # Scrape specific cities

Options:
  --help                                   # Show this help message

Regions Available:
  - Europe: ${getCitiesByRegion('EUROPE').length} cities
  - North America: ${getCitiesByRegion('NORTH_AMERICA').length} cities
  - Asia: ${getCitiesByRegion('ASIA').length} cities
  - Oceania: ${getCitiesByRegion('OCEANIA').length} cities
  - South America: ${getCitiesByRegion('SOUTH_AMERICA').length} cities
  - Africa: ${getCitiesByRegion('AFRICA').length} cities
  - Total: ${getAllCities().length} cities worldwide

Configuration:
  Edit .env file to configure:
    - HEADLESS: Run browser in headless mode
    - USE_PROXY: Enable proxy support
    - DELAY_MIN/MAX: Request delays
    - MAX_RETRIES: Retry attempts
    - OUTPUT_DIR: Output directory
      `);
            process.exit(0);
        default:
            logger.error(`Unknown command: ${command}`);
            logger.info('Use --help for usage information');
            process.exit(1);
    }
} else {
    // Run main scraper (all cities)
    main();
}

// Export functions for programmatic use
export {
    main,
    scrapeSpecificCities,
    scrapeByRegion
};
