/**
 * OpenStreetMap (OSM) Overpass API Service
 * 100% FREE - No API key required!
 * Fetches hotel POI data from OpenStreetMap
 */

import axios from 'axios';
import logger from '../utils/logger.js';
import { randomDelay } from '../utils/delay.js';
import dotenv from 'dotenv';

dotenv.config();

// Free Overpass API endpoints (no key needed!)
const OVERPASS_ENDPOINTS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.private.coffee/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter'
];

class OSMAPIService {
    constructor() {
        this.currentEndpointIndex = 0;
        this.endpoint = OVERPASS_ENDPOINTS[0];
    }

    /**
     * Get current Overpass API endpoint
     * @returns {string} API endpoint URL
     */
    getEndpoint() {
        return OVERPASS_ENDPOINTS[this.currentEndpointIndex];
    }

    /**
     * Rotate to next endpoint (if current fails)
     */
    rotateEndpoint() {
        this.currentEndpointIndex = (this.currentEndpointIndex + 1) % OVERPASS_ENDPOINTS.length;
        this.endpoint = OVERPASS_ENDPOINTS[this.currentEndpointIndex];
        logger.info(`Switched to Overpass endpoint: ${this.endpoint}`);
    }

    /**
     * Build Overpass QL query for hotels in a city
     * @param {string} cityName - Name of the city
     * @param {string} countryName - Name of the country (optional, for disambiguation)
     * @returns {string} Overpass QL query
     */
    buildQuery(cityName, countryName = null) {
        // Build area search with country disambiguation if provided
        const areaFilter = countryName
            ? `area["name"="${cityName}"]["place"~"city|town"]["admin_level"~"[6-8]"]->.searchArea;`
            : `area["name"="${cityName}"]->.searchArea;`;

        return `
[out:json][timeout:25];
${areaFilter}
(
  node["tourism"="hotel"](area.searchArea);
  way["tourism"="hotel"](area.searchArea);
  relation["tourism"="hotel"](area.searchArea);
);
out center tags;
        `.trim();
    }

    /**
     * Search for hotels in a city using OSM data
     * @param {Object} city - City configuration
     * @returns {Promise<Array>} Array of hotels
     */
    async searchHotels(city) {
        try {
            logger.info(`Fetching hotels for ${city.name} from OpenStreetMap...`);

            const query = this.buildQuery(city.name, city.country);

            const response = await axios.post(
                this.getEndpoint(),
                query,
                {
                    headers: {
                        'Content-Type': 'text/plain',
                        'User-Agent': 'HotelDataCollector/2.0'
                    },
                    timeout: 30000
                }
            );

            const hotels = this.parseOSMResponse(response.data, city);
            logger.info(`Found ${hotels.length} hotels for ${city.name}`);

            // Be nice to free API - add delay
            await randomDelay(1000, 2000);

            return hotels;

        } catch (error) {
            // Try next endpoint if current one fails
            if (error.code === 'ECONNABORTED' || error.response?.status >= 500) {
                logger.warn(`Endpoint failed, trying alternate...`);
                this.rotateEndpoint();

                // Retry with new endpoint
                return this.searchHotels(city);
            }

            logger.error(`OSM API error for ${city.name}:`, {
                message: error.message,
                status: error.response?.status
            });

            throw error;
        }
    }

    /**
     * Parse OSM Overpass API response
     * @param {Object} data - API response data
     * @param {Object} city - City info
     * @returns {Array} Parsed hotels
     */
    parseOSMResponse(data, city) {
        const hotels = [];

        if (!data.elements || !Array.isArray(data.elements)) {
            return hotels;
        }

        for (const element of data.elements) {
            try {
                const tags = element.tags || {};

                // Skip if no name
                if (!tags.name) continue;

                // Get coordinates (center for ways/relations)
                const lat = element.lat || element.center?.lat || null;
                const lon = element.lon || element.center?.lon || null;

                const hotel = {
                    // Basic info
                    hotel_id: `osm_${element.type}_${element.id}`,
                    hotel_name: tags.name,

                    // Location
                    city: city.name,
                    country: city.country,
                    address: this.buildAddress(tags),
                    latitude: lat,
                    longitude: lon,

                    // OSM-specific data
                    osm_id: element.id,
                    osm_type: element.type,

                    // Rating (if available from OSM)
                    rating: this.parseStars(tags.stars),
                    review_count: 0, // OSM doesn't have reviews
                    review_score_word: null,

                    // Price - NOT available in OSM
                    price: null,
                    currency: null,

                    // Property details
                    property_type: this.getPropertyType(tags),
                    hotel_class: this.parseStars(tags.stars),

                    // Additional tags
                    phone: tags.phone || tags['contact:phone'] || null,
                    website: tags.website || tags['contact:website'] || null,
                    email: tags.email || tags['contact:email'] || null,

                    // Amenities from OSM tags
                    amenities: this.extractAmenities(tags),

                    // Additional info
                    wheelchair_accessible: tags.wheelchair === 'yes',
                    internet_access: tags['internet_access'] || null,
                    smoking: tags.smoking || null,
                    rooms: tags.rooms || null,
                    beds: tags.beds || null,

                    // Brand info
                    brand: tags.brand || null,
                    operator: tags.operator || null,

                    // Metadata
                    scraped_at: new Date().toISOString(),
                    data_source: 'OpenStreetMap',
                    osm_url: `https://www.openstreetmap.org/${element.type}/${element.id}`
                };

                hotels.push(hotel);

            } catch (error) {
                logger.warn(`Failed to parse OSM element: ${error.message}`);
            }
        }

        return hotels;
    }

    /**
     * Build address from OSM tags
     * @param {Object} tags - OSM tags
     * @returns {string} Formatted address
     */
    buildAddress(tags) {
        const parts = [];

        if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
        if (tags['addr:street']) parts.push(tags['addr:street']);
        if (tags['addr:city']) parts.push(tags['addr:city']);
        if (tags['addr:postcode']) parts.push(tags['addr:postcode']);

        return parts.join(', ') || 'Address not available';
    }

    /**
     * Parse star rating
     * @param {string} stars - Star rating string
     * @returns {number|null} Star rating
     */
    parseStars(stars) {
        if (!stars) return null;
        const match = stars.match(/(\d+)/);
        return match ? parseInt(match[1]) : null;
    }

    /**
     * Get property type from tags
     * @param {Object} tags - OSM tags
     * @returns {string} Property type
     */
    getPropertyType(tags) {
        if (tags.tourism === 'hotel') return 'Hotel';
        if (tags.tourism === 'motel') return 'Motel';
        if (tags.tourism === 'hostel') return 'Hostel';
        if (tags.tourism === 'guest_house') return 'Guest House';
        if (tags.building === 'hotel') return 'Hotel';
        return 'Accommodation';
    }

    /**
     * Extract amenities from OSM tags
     * @param {Object} tags - OSM tags
     * @returns {Array} Array of amenity names
     */
    extractAmenities(tags) {
        const amenities = [];

        // Check common amenity tags
        if (tags['wifi'] === 'yes' || tags['internet_access'] === 'wlan') {
            amenities.push('Free WiFi');
        }
        if (tags['parking'] === 'yes') amenities.push('Parking');
        if (tags['swimming_pool'] === 'yes') amenities.push('Swimming Pool');
        if (tags['restaurant'] === 'yes') amenities.push('Restaurant');
        if (tags['bar'] === 'yes') amenities.push('Bar');
        if (tags['fitness_centre'] === 'yes') amenities.push('Fitness Center');
        if (tags['spa'] === 'yes') amenities.push('Spa');
        if (tags['sauna'] === 'yes') amenities.push('Sauna');
        if (tags['breakfast'] === 'yes') amenities.push('Breakfast');
        if (tags['air_conditioning'] === 'yes') amenities.push('Air Conditioning');
        if (tags['wheelchair'] === 'yes') amenities.push('Wheelchair Accessible');

        return amenities;
    }

    /**
     * Fetch hotels for multiple cities
     * @param {Array} cities - Array of city configs
     * @returns {Promise<Array>} All hotels
     */
    async fetchMultipleCities(cities) {
        const allHotels = [];

        logger.info(`Starting OSM data fetch for ${cities.length} cities`);
        logger.info(`Using free OpenStreetMap Overpass API (no API key needed!)`);

        for (let i = 0; i < cities.length; i++) {
            const city = cities[i];

            try {
                logger.info(`\n${'='.repeat(50)}`);
                logger.info(`Processing city ${i + 1}/${cities.length}: ${city.name}, ${city.country}`);
                logger.info(`${'='.repeat(50)}\n`);

                const hotels = await this.searchHotels(city);
                allHotels.push(...hotels);

                logger.info(`✓ Successfully fetched ${hotels.length} hotels from ${city.name}`);

                // Be respectful to free API
                if (i < cities.length - 1) {
                    await randomDelay(2000, 3000);
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

        logger.info(`\nCompleted OSM fetch for ${cities.length} cities`);
        logger.info(`Total hotels collected: ${allHotels.length}`);

        return allHotels;
    }

    /**
     * Search hotels by bounding box (for specific area)
     * @param {Object} bbox - Bounding box {south, west, north, east}
     * @returns {Promise<Array>} Array of hotels
     */
    async searchByBoundingBox(bbox) {
        const query = `
[out:json][timeout:25];
(
  node["tourism"="hotel"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
  way["tourism"="hotel"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
  relation["tourism"="hotel"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
);
out center tags;
        `.trim();

        try {
            const response = await axios.post(this.getEndpoint(), query, {
                headers: { 'Content-Type': 'text/plain' },
                timeout: 30000
            });

            return this.parseOSMResponse(response.data, { name: 'Custom Area', country: 'Various' });

        } catch (error) {
            logger.error('OSM bounding box search failed:', error.message);
            throw error;
        }
    }
}

export default new OSMAPIService();
