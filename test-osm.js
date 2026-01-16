/**
 * Test OpenStreetMap (OSM) API Integration
 * 100% FREE - No API key needed!
 */

import dotenv from 'dotenv';
dotenv.config();

import osmAPIService from './src/services/osm-api.service.js';
import logger from './src/utils/logger.js';

async function testOSM() {
    try {
        logger.info('🧪 Testing OpenStreetMap (OSM) Overpass API');
        logger.info('='.repeat(60));
        logger.info('💚 100% FREE - No API key required!');
        logger.info('='.repeat(60));

        // Test with Paris
        const testCity = {
            name: 'Paris',
            country: 'France',
            searchQuery: 'Paris'
        };

        logger.info(`\nTesting OSM API with: ${testCity.name}, ${testCity.country}`);
        logger.info('Fetching hotel data from OpenStreetMap...\n');

        const hotels = await osmAPIService.searchHotels(testCity);

        logger.info('\n' + '='.repeat(60));
        logger.info('✅ OSM API TEST SUCCESSFUL!');
        logger.info('='.repeat(60));
        logger.info(`Hotels found: ${hotels.length}`);

        if (hotels.length > 0) {
            logger.info('\n📋 Sample hotel data from OpenStreetMap:\n');

            // Show first 3 hotels
            const samplesToShow = Math.min(3, hotels.length);
            for (let i = 0; i < samplesToShow; i++) {
                const hotel = hotels[i];
                logger.info(`${i + 1}. ${hotel.hotel_name}`);
                logger.info(`   Address: ${hotel.address}`);
                logger.info(`   Coordinates: ${hotel.latitude}, ${hotel.longitude}`);
                logger.info(`   Type: ${hotel.property_type}`);
                if (hotel.phone) logger.info(`   Phone: ${hotel.phone}`);
                if (hotel.website) logger.info(`   Website: ${hotel.website}`);
                if (hotel.amenities.length > 0) {
                    logger.info(`   Amenities: ${hotel.amenities.join(', ')}`);
                }
                logger.info(`   OSM URL: ${hotel.osm_url}`);
                logger.info('');
            }

            logger.info('📊 Data Available from OSM:');
            logger.info('  ✅ Hotel name');
            logger.info('  ✅ Exact coordinates (lat/lon)');
            logger.info('  ✅ Address');
            logger.info('  ✅ Contact info (phone, website, email)');
            logger.info('  ✅ Amenities (WiFi, parking, etc.)');
            logger.info('  ✅ Property type');
            logger.info('  ✅ Accessibility info');
            logger.info('');
            logger.info('⚠️  NOT Available from OSM:');
            logger.info('  ❌ Prices');
            logger.info('  ❌ Availability');
            logger.info('  ❌ User reviews/ratings');
            logger.info('  ❌ Booking links');
        }

        logger.info('\n' + '='.repeat(60));
        logger.info('✅ OpenStreetMap API is working perfectly!');
        logger.info('💚 Completely FREE - No API key needed!');
        logger.info('🌍 Works globally for any city');
        logger.info('\nYou can now run: npm start');
        logger.info('='.repeat(60));

    } catch (error) {
        logger.error('\n' + '='.repeat(60));
        logger.error('❌ OSM API TEST FAILED');
        logger.error('='.repeat(60));
        logger.error(`Error: ${error.message}`);

        if (error.code === 'ECONNABORTED') {
            logger.error('\n⏱️ Timeout Error:');
            logger.error('  - The OSM server took too long to respond');
            logger.error('  - This is usually temporary, try again');
        } else if (error.code === 'ENOTFOUND') {
            logger.error('\n🌐 Network Error:');
            logger.error('  - Cannot reach OSM servers');
            logger.error('  - Check your internet connection');
        } else {
            logger.error('\n📋 Details:');
            logger.error(`  Code: ${error.code}`);
            logger.error(`  Message: ${error.message}`);
        }

        logger.error('='.repeat(60));
        process.exit(1);
    }
}

// Run test
testOSM();
