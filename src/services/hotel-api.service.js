/**
 * Hotel API Service
 * Fetches hotel data from RapidAPI (Booking.com API)
 * Alternative to web scraping - stable, legal, and scalable
 */

import axios from 'axios';
import logger from '../utils/logger.js';
import { randomDelay } from '../utils/delay.js';
import dotenv from 'dotenv';

dotenv.config();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'booking-com.p.rapidapi.com';

class HotelAPIService {
    constructor() {
        this.baseURL = `https://${RAPIDAPI_HOST}`;
        this.headers = {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_HOST
        };
    }

    /**
     * Search for hotels in a city
     * @param {Object} city - City configuration
     * @param {Object} options - Search options
     * @returns {Promise<Array>} Array of hotels
     */
    async searchHotels(city, options = {}) {
        const {
            checkIn = this.getDefaultCheckIn(),
            checkOut = this.getDefaultCheckOut(),
            adults = 2,
            rooms = 1,
            currency = 'USD',
            locale = 'en-us'
        } = options;

        try {
            logger.info(`Fetching hotels for ${city.name} via API...`);

            // Step 1: Search for destination ID
            const destId = await this.getDestinationId(city.searchQuery);

            if (!destId) {
                logger.warn(`Could not find destination ID for ${city.name}`);
                return [];
            }

            // Step 2: Search hotels
            const response = await axios.get(`${this.baseURL}/v1/hotels/search`, {
                headers: this.headers,
                params: {
                    dest_id: destId,
                    dest_type: 'city',
                    arrival_date: checkIn,
                    departure_date: checkOut,
                    adults_number: adults,
                    room_number: rooms,
                    units: 'metric',
                    locale: locale,
                    currency: currency,
                    order_by: 'popularity',
                    page_number: 0,
                    include_adjacency: false
                },
                timeout: 30000
            });

            const hotels = this.parseHotelsResponse(response.data, city);
            logger.info(`Found ${hotels.length} hotels for ${city.name}`);

            // Respect API rate limits
            await randomDelay(1000, 2000);

            return hotels;

        } catch (error) {
            logger.error(`API error for ${city.name}:`, {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText
            });

            // Handle rate limiting
            if (error.response?.status === 429) {
                logger.warn('Rate limit reached, waiting...');
                await randomDelay(5000, 10000);
            }

            throw error;
        }
    }

    /**
     * Get destination ID for a city
     * @param {string} searchQuery - City search query
     * @returns {Promise<string|null>} Destination ID
     */
    async getDestinationId(searchQuery) {
        try {
            const response = await axios.get(`${this.baseURL}/v1/hotels/locations`, {
                headers: this.headers,
                params: {
                    name: searchQuery,
                    locale: 'en-us'
                },
                timeout: 15000
            });

            // Get first city result
            const locations = response.data;
            if (locations && locations.length > 0) {
                const cityResult = locations.find(loc => loc.dest_type === 'city') || locations[0];
                return cityResult.dest_id;
            }

            return null;

        } catch (error) {
            logger.error(`Failed to get destination ID for ${searchQuery}:`, error.message);
            return null;
        }
    }

    /**
     * Parse hotels from API response
     * @param {Object} data - API response data
     * @param {Object} city - City info
     * @returns {Array} Parsed hotels
     */
    parseHotelsResponse(data, city) {
        const hotels = [];

        if (!data.result || !Array.isArray(data.result)) {
            return hotels;
        }

        for (const hotel of data.result) {
            try {
                const parsedHotel = {
                    // Basic info
                    hotel_id: hotel.hotel_id?.toString() || '',
                    hotel_name: hotel.hotel_name || 'Unknown Hotel',

                    // Location
                    city: city.name,
                    country: city.country,
                    address: hotel.address || '',
                    latitude: hotel.latitude || null,
                    longitude: hotel.longitude || null,

                    // Rating and reviews
                    rating: hotel.review_score || null,
                    review_count: hotel.review_nr || 0,
                    review_score_word: hotel.review_score_word || '',

                    // Price
                    price: hotel.min_total_price || hotel.price_breakdown?.gross_price || null,
                    currency: hotel.currency_code || 'USD',

                    // Property details
                    property_type: hotel.accommodation_type_name || '',
                    hotel_class: hotel.class || null,

                    // Images
                    image_url: hotel.max_photo_url || hotel.main_photo_url || '',

                    // Amenities
                    amenities: this.extractAmenities(hotel),

                    // Additional info
                    distance_to_center: hotel.distance || null,
                    free_cancellation: hotel.is_free_cancellable === 1,
                    genius_discount: hotel.is_genius_deal === 1,

                    // Metadata
                    scraped_at: new Date().toISOString(),
                    data_source: 'API',
                    booking_url: `https://www.booking.com/hotel/${hotel.country_trans}/${hotel.hotel_name_trans || hotel.hotel_id}.html`
                };

                hotels.push(parsedHotel);

            } catch (error) {
                logger.warn(`Failed to parse hotel: ${error.message}`);
            }
        }

        return hotels;
    }

    /**
     * Extract amenities from hotel data
     * @param {Object} hotel - Hotel data
     * @returns {Array} Array of amenity names
     */
    extractAmenities(hotel) {
        const amenities = [];

        if (hotel.has_free_parking) amenities.push('Free Parking');
        if (hotel.has_swimming_pool) amenities.push('Swimming Pool');
        if (hotel.is_beach_front) amenities.push('Beach Front');
        if (hotel.has_spa) amenities.push('Spa');
        if (hotel.has_fitness_center) amenities.push('Fitness Center');

        return amenities;
    }

    /**
     * Get default check-in date (tomorrow)
     * @returns {string} Date in YYYY-MM-DD format
     */
    getDefaultCheckIn() {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    }

    /**
     * Get default check-out date (3 days from now)
     * @returns {string} Date in YYYY-MM-DD format
     */
    getDefaultCheckOut() {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        return date.toISOString().split('T')[0];
    }

    /**
     * Fetch hotels for multiple cities
     * @param {Array} cities - Array of city configs
     * @param {Object} options - Search options
     * @returns {Promise<Array>} All hotels
     */
    async fetchMultipleCities(cities, options = {}) {
        const allHotels = [];

        logger.info(`Starting API fetch for ${cities.length} cities`);

        for (let i = 0; i < cities.length; i++) {
            const city = cities[i];

            try {
                logger.info(`\n${'='.repeat(50)}`);
                logger.info(`Processing city ${i + 1}/${cities.length}: ${city.name}, ${city.country}`);
                logger.info(`${'='.repeat(50)}\n`);

                const hotels = await this.searchHotels(city, options);
                allHotels.push(...hotels);

                logger.info(`✓ Successfully fetched ${hotels.length} hotels from ${city.name}`);

                // Rate limiting delay
                if (i < cities.length - 1) {
                    await randomDelay(2000, 4000);
                }

            } catch (error) {
                logger.error(`Failed to fetch ${city.name}:`, {
                    message: error.message,
                    city: city.name,
                    country: city.country
                });
                // Continue with next city
                continue;
            }
        }

        logger.info(`\nCompleted API fetch for ${cities.length} cities`);
        logger.info(`Total hotels collected: ${allHotels.length}`);

        return allHotels;
    }
}

export default new HotelAPIService();
