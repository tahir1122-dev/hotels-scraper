/**
 * Quick regional test for multi-platform scraping
 * Tests with 3 cities to verify the full orchestration
 */

import dotenv from 'dotenv';
dotenv.config();

import logger from './src/utils/logger.js';
import MultiPlatformOrchestrator from './src/scrapers/multi-platform.orchestrator.js';

// Override to only use Booking.com for speed
process.env.ENABLE_AGODA = 'false';
process.env.ENABLE_HOTELS = 'false';

const TEST_CITIES = [
    { name: 'London', country: 'United Kingdom', countryCode: 'gb', region: 'europe' },
    { name: 'Paris', country: 'France', countryCode: 'fr', region: 'europe' },
    { name: 'Barcelona', country: 'Spain', countryCode: 'es', region: 'europe' }
];

async function testRegion() {
    const startTime = Date.now();

    logger.info('🧪 Multi-Platform Regional Test');
    logger.info('='.repeat(60));
    logger.info(`Testing with ${TEST_CITIES.length} cities (Booking.com only)\n`);

    const orchestrator = new MultiPlatformOrchestrator();
    const initialized = await orchestrator.initialize();

    if (!initialized) {
        logger.error('Failed to initialize scrapers');
        return;
    }

    const allHotels = [];

    for (let i = 0; i < TEST_CITIES.length; i++) {
        const city = TEST_CITIES[i];
        logger.info(`\n[${i + 1}/${TEST_CITIES.length}] Processing ${city.name}, ${city.country}...`);

        try {
            const hotels = await orchestrator.scrapeCity(city);
            allHotels.push(...hotels);
            logger.info(`✅ Collected ${hotels.length} hotels from ${city.name}`);
        } catch (error) {
            logger.error(`❌ Failed: ${error.message}`);
        }

        // Wait between cities
        if (i < TEST_CITIES.length - 1) {
            logger.info('   Waiting 10 seconds before next city...');
            await new Promise(r => setTimeout(r, 10000));
        }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    logger.info('\n' + '='.repeat(60));
    logger.info('📊 Test Results:');
    logger.info(`   Total Hotels: ${allHotels.length}`);
    logger.info(`   Duration: ${duration}s`);
    logger.info(`   Average per city: ${(allHotels.length / TEST_CITIES.length).toFixed(1)} hotels`);

    const summary = orchestrator.getSummary();
    logger.info(`\n   Successes: ${summary.successes.length}/${TEST_CITIES.length} cities`);
    logger.info(`   Failures: ${summary.failures.length}/${TEST_CITIES.length} cities`);

    if (allHotels.length > 0) {
        logger.info('\n📝 Sample Hotels:');
        allHotels.slice(0, 3).forEach((hotel, i) => {
            logger.info(`   ${i + 1}. ${hotel.hotel_name} (${hotel.city})`);
            logger.info(`      Price: ${hotel.currency} ${hotel.price_per_night || 'N/A'}`);
            logger.info(`      Rating: ${hotel.review_score || 'N/A'}`);
        });
    }

    logger.info('\n' + '='.repeat(60));
    logger.info('Test complete!\n');
}

testRegion();
