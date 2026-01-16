/**
 * Example: Test API integration with a single city
 * Use this to verify your API key is working before running full collection
 */

import dotenv from 'dotenv';
dotenv.config();

import hotelAPIService from './services/hotel-api.service.js';
import logger from './utils/logger.js';

async function testAPI() {
    try {
        logger.info('🧪 Testing Hotel API Integration');
        logger.info('='.repeat(60));

        // Check if API key is configured
        if (!process.env.RAPIDAPI_KEY || process.env.RAPIDAPI_KEY === 'your_rapidapi_key_here') {
            logger.error('❌ RAPIDAPI_KEY not configured in .env file');
            logger.info('\nPlease:');
            logger.info('1. Get API key from: https://rapidapi.com/apidojo/api/booking-com');
            logger.info('2. Add it to .env: RAPIDAPI_KEY=your_actual_key_here');
            process.exit(1);
        }

        logger.info(`API Key: ${process.env.RAPIDAPI_KEY.substring(0, 10)}...`);
        logger.info(`API Host: ${process.env.RAPIDAPI_HOST || 'booking-com.p.rapidapi.com'}`);
        logger.info('='.repeat(60));

        // Test with Paris
        const testCity = {
            name: 'Paris',
            country: 'France',
            searchQuery: 'Paris'
        };

        logger.info(`\nTesting API with: ${testCity.name}, ${testCity.country}`);
        logger.info('This will make 2 API calls:\n  1. Get destination ID\n  2. Search hotels\n');

        const hotels = await hotelAPIService.searchHotels(testCity);

        logger.info('\n' + '='.repeat(60));
        logger.info('✅ API TEST SUCCESSFUL!');
        logger.info('='.repeat(60));
        logger.info(`Hotels found: ${hotels.length}`);

        if (hotels.length > 0) {
            logger.info('\nSample hotel data:');
            const sample = hotels[0];
            logger.info(`  Name: ${sample.hotel_name}`);
            logger.info(`  Address: ${sample.address}`);
            logger.info(`  Rating: ${sample.rating}/10`);
            logger.info(`  Reviews: ${sample.review_count}`);
            logger.info(`  Price: ${sample.currency} ${sample.price}`);
            logger.info(`  Type: ${sample.property_type}`);
        }

        logger.info('\n✅ Your API is configured correctly!');
        logger.info('You can now run: npm start');
        logger.info('='.repeat(60));

    } catch (error) {
        logger.error('\n' + '='.repeat(60));
        logger.error('❌ API TEST FAILED');
        logger.error('='.repeat(60));
        logger.error(`Error: ${error.message}`);

        if (error.response) {
            logger.error(`Status: ${error.response.status}`);
            logger.error(`Status Text: ${error.response.statusText}`);

            if (error.response.status === 401 || error.response.status === 403) {
                logger.error('\n🔑 API Key Issue:');
                logger.error('  - Check your RAPIDAPI_KEY in .env');
                logger.error('  - Verify subscription at: https://rapidapi.com/apidojo/api/booking-com');
            }

            if (error.response.status === 429) {
                logger.error('\n⏱️ Rate Limit:');
                logger.error('  - You have exceeded your API quota');
                logger.error('  - Wait or upgrade your plan');
            }
        }

        logger.error('='.repeat(60));
        process.exit(1);
    }
}

// Run test
testAPI();
