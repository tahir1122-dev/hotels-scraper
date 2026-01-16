/**
 * Data normalization utilities
 * Clean and standardize scraped data
 */

/**
 * Normalize text - trim whitespace and remove extra spaces
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
export function normalizeText(text) {
    if (!text || typeof text !== 'string') return null;

    return text
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, ' ')
        .trim();
}

/**
 * Extract and normalize price
 * @param {string} priceText - Raw price text
 * @returns {Object} {amount: number, currency: string}
 */
export function normalizePrice(priceText) {
    if (!priceText || typeof priceText !== 'string') {
        return { amount: null, currency: null };
    }

    // Remove whitespace
    const cleaned = priceText.replace(/\s+/g, '');

    // Common currency symbols and codes
    const currencyMap = {
        '$': 'USD',
        '€': 'EUR',
        '£': 'GBP',
        '¥': 'JPY',
        'USD': 'USD',
        'EUR': 'EUR',
        'GBP': 'GBP'
    };

    // Extract currency
    let currency = null;
    for (const [symbol, code] of Object.entries(currencyMap)) {
        if (cleaned.includes(symbol)) {
            currency = code;
            break;
        }
    }

    // Extract numeric value
    const numericMatch = cleaned.match(/[\d,]+\.?\d*/);
    if (!numericMatch) {
        return { amount: null, currency };
    }

    const amount = parseFloat(numericMatch[0].replace(/,/g, ''));

    return {
        amount: isNaN(amount) ? null : amount,
        currency: currency || 'USD'
    };
}

/**
 * Normalize rating score
 * @param {string} ratingText - Raw rating text
 * @returns {number} Rating score (0-10)
 */
export function normalizeRating(ratingText) {
    if (!ratingText) return null;

    // Extract numeric value
    const match = String(ratingText).match(/[\d.]+/);
    if (!match) return null;

    const rating = parseFloat(match[0]);

    // Ensure rating is in 0-10 range
    if (isNaN(rating) || rating < 0 || rating > 10) {
        return null;
    }

    return Math.round(rating * 10) / 10; // Round to 1 decimal
}

/**
 * Normalize review count
 * @param {string} reviewText - Raw review count text
 * @returns {number} Review count
 */
export function normalizeReviewCount(reviewText) {
    if (!reviewText) return null;

    // Handle formats like "1,234 reviews" or "1.2K reviews"
    const text = String(reviewText).toLowerCase();

    // Check for K notation (thousands)
    if (text.includes('k')) {
        const match = text.match(/([\d.]+)k/);
        if (match) {
            return Math.round(parseFloat(match[1]) * 1000);
        }
    }

    // Extract regular number
    const match = text.match(/[\d,]+/);
    if (!match) return null;

    const count = parseInt(match[0].replace(/,/g, ''));
    return isNaN(count) ? null : count;
}

/**
 * Normalize star rating
 * @param {string} starText - Raw star rating text
 * @returns {number} Star rating (0-5)
 */
export function normalizeStarRating(starText) {
    if (!starText) return null;

    const match = String(starText).match(/(\d+)[\s-]*star/i);
    if (!match) return null;

    const stars = parseInt(match[1]);
    return (stars >= 0 && stars <= 5) ? stars : null;
}

/**
 * Normalize amenities array
 * @param {Array|string} amenities - Raw amenities
 * @returns {Array} Normalized amenities
 */
export function normalizeAmenities(amenities) {
    if (!amenities) return [];

    // If string, split by common delimiters
    if (typeof amenities === 'string') {
        amenities = amenities.split(/[,;•·]/).map(a => a.trim());
    }

    // Ensure array
    if (!Array.isArray(amenities)) {
        return [];
    }

    // Clean and filter
    return amenities
        .map(a => normalizeText(a))
        .filter(a => a && a.length > 0)
        .filter(a => a.length < 100); // Remove overly long strings
}

/**
 * Normalize boolean value
 * @param {any} value - Value to normalize
 * @returns {boolean}
 */
export function normalizeBoolean(value) {
    if (typeof value === 'boolean') return value;
    if (!value) return false;

    const trueValues = ['true', 'yes', '1', 'available'];
    return trueValues.includes(String(value).toLowerCase());
}

/**
 * Normalize URL
 * @param {string} url - URL to normalize
 * @param {string} baseUrl - Base URL if relative
 * @returns {string} Normalized URL
 */
export function normalizeUrl(url, baseUrl = 'https://www.booking.com') {
    if (!url || typeof url !== 'string') return null;

    // Already absolute URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    // Relative URL - prepend base
    if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
    }

    // Protocol-relative URL
    if (url.startsWith('//')) {
        return `https:${url}`;
    }

    return url;
}

/**
 * Normalize coordinates
 * @param {string|number} coord - Coordinate value
 * @returns {number} Normalized coordinate
 */
export function normalizeCoordinate(coord) {
    if (coord === null || coord === undefined) return null;

    const num = parseFloat(coord);
    return isNaN(num) ? null : Math.round(num * 1000000) / 1000000; // 6 decimal places
}

/**
 * Extract coordinates from various formats
 * @param {string} text - Text containing coordinates
 * @returns {Object} {latitude, longitude}
 */
export function extractCoordinates(text) {
    if (!text) return { latitude: null, longitude: null };

    // Pattern: lat, lng or similar
    const pattern = /([-\d.]+)[,\s]+([-\d.]+)/;
    const match = String(text).match(pattern);

    if (!match) {
        return { latitude: null, longitude: null };
    }

    return {
        latitude: normalizeCoordinate(match[1]),
        longitude: normalizeCoordinate(match[2])
    };
}

/**
 * Create a hash for duplicate detection
 * @param {string} hotelName - Hotel name
 * @param {string} city - City name
 * @returns {string} Hash string
 */
export function createHotelHash(hotelName, city) {
    const normalized = `${normalizeText(hotelName)}_${normalizeText(city)}`.toLowerCase();
    return normalized.replace(/[^a-z0-9]/g, '_');
}
