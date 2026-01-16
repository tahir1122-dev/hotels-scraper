/**
 * Booking.com HTML parser
 * Extracts hotel data from HTML using Cheerio
 */

import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import {
    normalizeText,
    normalizePrice,
    normalizeRating,
    normalizeReviewCount,
    normalizeStarRating,
    normalizeAmenities,
    normalizeBoolean,
    normalizeUrl,
    normalizeCoordinate
} from '../utils/normalize.js';
import { SELECTORS } from '../config/puppeteer.config.js';
import { getCountryCurrency } from '../config/countries.js';
import logger from '../utils/logger.js';

/**
 * Parse HTML content and extract hotel data
 * @param {string} html - HTML content
 * @param {Object} cityInfo - City information
 * @returns {Array} Array of hotel objects
 */
export function parseHotels(html, cityInfo) {
    try {
        const $ = cheerio.load(html);
        const hotels = [];

        // Try to find hotel cards using multiple selectors
        let hotelCards = $(SELECTORS.hotelCard);

        if (hotelCards.length === 0) {
            // Try alternative selector
            hotelCards = $(SELECTORS.hotelCardAlt);
        }

        logger.info(`Found ${hotelCards.length} hotel cards in HTML`);

        // Extract data from each hotel card
        hotelCards.each((index, element) => {
            try {
                const hotelData = parseHotelCard($, $(element), cityInfo);
                if (hotelData) {
                    hotels.push(hotelData);
                }
            } catch (error) {
                logger.error(`Failed to parse hotel card ${index}:`, error);
                // Continue with next hotel
            }
        });

        logger.info(`Successfully parsed ${hotels.length} hotels`);
        return hotels;
    } catch (error) {
        logger.error('Failed to parse HTML:', error);
        return [];
    }
}

/**
 * Parse individual hotel card
 * @param {CheerioAPI} $ - Cheerio instance
 * @param {Cheerio} card - Hotel card element
 * @param {Object} cityInfo - City information
 * @returns {Object|null} Hotel data object
 */
function parseHotelCard($, card, cityInfo) {
    try {
        // Extract hotel name
        const hotelName = extractHotelName($, card);
        if (!hotelName) {
            logger.debug('Skipping card - no hotel name found');
            return null;
        }

        // Extract all hotel data
        const hotel = {
            id: uuidv4(),
            hotel_name: hotelName,
            city: cityInfo.name,
            country: cityInfo.country,
            address: extractAddress($, card),
            latitude: null, // Would need to parse from map data or coordinates
            longitude: null,
            star_rating: extractStarRating($, card),
            review_score: extractReviewScore($, card),
            review_count: extractReviewCount($, card),
            price_per_night: null,
            currency: null,
            room_type: extractRoomType($, card),
            property_type: extractPropertyType($, card),
            amenities: extractAmenities($, card),
            image_url: extractImageUrl($, card),
            booking_url: extractBookingUrl($, card),
            free_cancellation: extractFreeCancellation($, card),
            availability_status: 'available',
            scraped_at: new Date().toISOString()
        };

        // Extract price separately to get both amount and currency
        const priceData = extractPrice($, card, cityInfo);
        hotel.price_per_night = priceData.amount;
        hotel.currency = priceData.currency;

        // Try to extract coordinates from data attributes
        const coordinates = extractCoordinates($, card);
        hotel.latitude = coordinates.latitude;
        hotel.longitude = coordinates.longitude;

        return hotel;
    } catch (error) {
        logger.error('Error parsing hotel card:', error);
        return null;
    }
}

/**
 * Extract hotel name
 */
function extractHotelName($, card) {
    let name = card.find(SELECTORS.hotelName).first().text().trim();

    if (!name) {
        name = card.find(SELECTORS.hotelNameAlt).first().text().trim();
    }

    if (!name) {
        // Try finding any h3 or prominent heading
        name = card.find('h3, h2, [data-testid*="title"]').first().text().trim();
    }

    return normalizeText(name);
}

/**
 * Extract address
 */
function extractAddress($, card) {
    let address = card.find(SELECTORS.address).first().text().trim();

    if (!address) {
        address = card.find(SELECTORS.addressAlt).first().text().trim();
    }

    if (!address) {
        address = card.find('[data-testid*="address"], .address, [class*="address"]').first().text().trim();
    }

    return normalizeText(address);
}

/**
 * Extract star rating
 */
function extractStarRating($, card) {
    // Look for star rating in aria-label or data attributes
    const ratingText = card.find('[aria-label*="star"], [data-testid*="rating"], [class*="star"]')
        .first()
        .attr('aria-label') || card.find('[class*="star"]').first().text();

    return normalizeStarRating(ratingText);
}

/**
 * Extract review score
 */
function extractReviewScore($, card) {
    let score = card.find(SELECTORS.rating).first().text().trim();

    if (!score) {
        score = card.find(SELECTORS.ratingAlt).first().text().trim();
    }

    if (!score) {
        score = card.find('[data-testid*="review"], [class*="review-score"]').first().text().trim();
    }

    return normalizeRating(score);
}

/**
 * Extract review count
 */
function extractReviewCount($, card) {
    let count = card.find(SELECTORS.reviewCount).first().text().trim();

    if (!count) {
        count = card.find(SELECTORS.reviewCountAlt).first().text().trim();
    }

    if (!count) {
        count = card.find('[data-testid*="review"], [class*="review"]')
            .filter((i, el) => $(el).text().toLowerCase().includes('review'))
            .first()
            .text()
            .trim();
    }

    return normalizeReviewCount(count);
}

/**
 * Extract price
 */
function extractPrice($, card, cityInfo) {
    let priceText = card.find(SELECTORS.price).first().text().trim();

    if (!priceText) {
        priceText = card.find(SELECTORS.priceAlt).first().text().trim();
    }

    if (!priceText) {
        priceText = card.find('[data-testid*="price"], [class*="price"]').first().text().trim();
    }

    const priceData = normalizePrice(priceText);

    // If no currency found, use default for country
    if (!priceData.currency) {
        priceData.currency = getCountryCurrency(cityInfo.country);
    }

    return priceData;
}

/**
 * Extract room type
 */
function extractRoomType($, card) {
    const roomType = card.find('[data-testid*="room"], [class*="room-type"]').first().text().trim();
    return normalizeText(roomType);
}

/**
 * Extract property type
 */
function extractPropertyType($, card) {
    let propertyType = card.find(SELECTORS.propertyType).first().text().trim();

    if (!propertyType) {
        propertyType = card.find('[data-testid*="property"], [class*="property-type"]').first().text().trim();
    }

    return normalizeText(propertyType) || 'Hotel';
}

/**
 * Extract amenities
 */
function extractAmenities($, card) {
    const amenities = [];

    // Find amenity elements
    card.find(SELECTORS.amenities).each((i, el) => {
        const amenity = $(el).text().trim();
        if (amenity) {
            amenities.push(amenity);
        }
    });

    // Try alternative selectors if none found
    if (amenities.length === 0) {
        card.find('[data-testid*="facility"], [class*="facility"], [class*="amenity"]').each((i, el) => {
            const amenity = $(el).text().trim();
            if (amenity) {
                amenities.push(amenity);
            }
        });
    }

    return normalizeAmenities(amenities);
}

/**
 * Extract image URL
 */
function extractImageUrl($, card) {
    let imageUrl = card.find(SELECTORS.image).first().attr('src');

    if (!imageUrl) {
        imageUrl = card.find(SELECTORS.imageAlt).first().attr('src');
    }

    if (!imageUrl) {
        // Try data-src for lazy-loaded images
        imageUrl = card.find('img').first().attr('data-src') || card.find('img').first().attr('src');
    }

    return normalizeUrl(imageUrl);
}

/**
 * Extract booking URL
 */
function extractBookingUrl($, card) {
    // Find the main link to the hotel
    let url = card.find('a[data-testid*="title"]').first().attr('href');

    if (!url) {
        url = card.find('a').first().attr('href');
    }

    return normalizeUrl(url);
}

/**
 * Extract free cancellation status
 */
function extractFreeCancellation($, card) {
    const text = card.text().toLowerCase();
    const hasFreeCancellation = text.includes('free cancellation') ||
        text.includes('free cancelation') ||
        card.find(SELECTORS.freeCancellation).length > 0;

    return normalizeBoolean(hasFreeCancellation);
}

/**
 * Extract coordinates from data attributes
 */
function extractCoordinates($, card) {
    // Try to find coordinates in data attributes
    const lat = card.attr('data-latitude') || card.find('[data-latitude]').attr('data-latitude');
    const lng = card.attr('data-longitude') || card.find('[data-longitude]').attr('data-longitude');

    return {
        latitude: normalizeCoordinate(lat),
        longitude: normalizeCoordinate(lng)
    };
}

/**
 * Validate hotel data
 * @param {Object} hotel - Hotel data
 * @returns {boolean}
 */
export function validateHotel(hotel) {
    // Must have at minimum: name, city, country
    if (!hotel.hotel_name || !hotel.city || !hotel.country) {
        logger.warn('Invalid hotel - missing required fields:', hotel);
        return false;
    }

    // Hotel name should not be too short or too long
    if (hotel.hotel_name.length < 3 || hotel.hotel_name.length > 200) {
        logger.warn('Invalid hotel - name length out of range:', hotel.hotel_name);
        return false;
    }

    return true;
}

/**
 * Filter and validate hotels
 * @param {Array} hotels - Array of hotel objects
 * @returns {Array} Valid hotels
 */
export function filterValidHotels(hotels) {
    return hotels.filter(validateHotel);
}
