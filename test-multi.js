/**
 * Quick test for multi-platform scraping
 * Tests the proxy and a single city scrape
 */

import dotenv from 'dotenv';
dotenv.config();

import logger from './src/utils/logger.js';
import proxyService from './src/services/iproyal-proxy.service.js';
import BookingScraper from './src/scrapers/platforms/booking.scraper.js';

async function quickTest() {
    logger.info('🧪 Quick Multi-Platform Test');
    logger.info('='.repeat(60));

    // Test 1: Check proxy configuration
    logger.info('\n1️⃣ Testing Proxy Configuration...');
    const proxyStats = proxyService.getStats();
    logger.info(`   Proxy Enabled: ${proxyStats.enabled}`);
    logger.info(`   Host: ${proxyStats.host}:${proxyStats.port}`);

    if (proxyStats.enabled) {
        logger.info('   Testing proxy connection...');
        const proxyOk = await proxyService.testConnection();
        if (proxyOk) {
            logger.info('   ✅ Proxy connection successful!');
        } else {
            logger.error('   ❌ Proxy connection failed');
        }
    }

    // Test 2: Test Booking.com scraper with one city
    logger.info('\n2️⃣ Testing Booking.com Scraper...');
    const testCity = {
        name: 'London',
        country: 'United Kingdom',
        region: 'europe'
    };

    const bookingScraper = new BookingScraper();

    try {
        logger.info(`   Launching browser for ${testCity.name}...`);
        await bookingScraper.launch('gb'); // UK proxy
        await bookingScraper.createPage('gb');

        logger.info(`   Scraping hotels in ${testCity.name}...`);
        const result = await bookingScraper.searchHotels(testCity);

        // Take screenshot regardless
        try {
            await bookingScraper.page.screenshot({ path: './data/test-screenshot.png', fullPage: true });
            logger.info('   📸 Screenshot saved to data/test-screenshot.png');
        } catch (e) {
            logger.warn('   Could not save screenshot');
        }

        await bookingScraper.close();

        if (result.blocked) {
            logger.warn('   ⚠️ Page was detected as blocked');
            logger.info('   Check data/test-screenshot.png to see the actual page');
        } else if (result.hotels && result.hotels.length > 0) {
            logger.info(`   ✅ Found ${result.hotels.length} hotels!`);
            logger.info('\n   Sample hotel:');
            const sample = result.hotels[0];
            logger.info(`   - Name: ${sample.hotel_name}`);
            logger.info(`   - Price: ${sample.currency} ${sample.price_per_night}`);
            logger.info(`   - Rating: ${sample.review_score}`);
        } else {
            logger.warn('   ⚠️ No hotels found');
        }

    } catch (error) {
        logger.error(`   ❌ Error: ${error.message}`);
        try {
            await bookingScraper.page.screenshot({ path: './data/error-screenshot.png', fullPage: true });
            logger.info('   📸 Error screenshot saved to data/error-screenshot.png');
        } catch (e) { }
        await bookingScraper.close();
    }

    logger.info('\n' + '='.repeat(60));
    logger.info('Test complete!');
}

quickTest();
