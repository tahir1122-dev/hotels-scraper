/**
 * Scrape Tracker Utility
 * Tracks which cities have already been scraped to avoid duplicates
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');

/**
 * Get all cities that have already been scraped from existing data files
 * @returns {Set<string>} Set of city names that have been scraped
 */
export function getScrapedCities() {
    const scrapedCities = new Set();

    try {
        // Check if data directory exists
        if (!fs.existsSync(DATA_DIR)) {
            return scrapedCities;
        }

        // Get all hotel JSON files
        const files = fs.readdirSync(DATA_DIR)
            .filter(file => file.endsWith('-hotels.json'));

        // Read each file and extract unique cities
        for (const file of files) {
            const filePath = path.join(DATA_DIR, file);
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const hotels = JSON.parse(content);

                // Extract unique city names
                hotels.forEach(hotel => {
                    if (hotel.city) {
                        scrapedCities.add(hotel.city);
                    }
                });
            } catch (error) {
                console.warn(`⚠️  Warning: Could not read ${file}:`, error.message);
            }
        }
    } catch (error) {
        console.warn('⚠️  Warning: Error reading data directory:', error.message);
    }

    return scrapedCities;
}

/**
 * Get count of hotels scraped for each city
 * @returns {Object} Object with city names as keys and hotel counts as values
 */
export function getCityHotelCounts() {
    const cityCounts = {};

    try {
        if (!fs.existsSync(DATA_DIR)) {
            return cityCounts;
        }

        const files = fs.readdirSync(DATA_DIR)
            .filter(file => file.endsWith('-hotels.json'));

        for (const file of files) {
            const filePath = path.join(DATA_DIR, file);
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const hotels = JSON.parse(content);

                hotels.forEach(hotel => {
                    if (hotel.city) {
                        cityCounts[hotel.city] = (cityCounts[hotel.city] || 0) + 1;
                    }
                });
            } catch (error) {
                console.warn(`⚠️  Warning: Could not read ${file}:`, error.message);
            }
        }
    } catch (error) {
        console.warn('⚠️  Warning: Error reading data directory:', error.message);
    }

    return cityCounts;
}

/**
 * Get total number of hotels scraped
 * @returns {number} Total hotel count
 */
export function getTotalHotelsScraped() {
    let total = 0;

    try {
        if (!fs.existsSync(DATA_DIR)) {
            return total;
        }

        const files = fs.readdirSync(DATA_DIR)
            .filter(file => file.endsWith('-hotels.json'));

        for (const file of files) {
            const filePath = path.join(DATA_DIR, file);
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const hotels = JSON.parse(content);
                total += hotels.length;
            } catch (error) {
                console.warn(`⚠️  Warning: Could not read ${file}:`, error.message);
            }
        }
    } catch (error) {
        console.warn('⚠️  Warning: Error reading data directory:', error.message);
    }

    return total;
}

/**
 * Display scraping progress summary
 */
export function displayScrapingProgress() {
    const scrapedCities = getScrapedCities();
    const cityCounts = getCityHotelCounts();
    const totalHotels = getTotalHotelsScraped();

    console.log('\n' + '='.repeat(70));
    console.log('📊 SCRAPING PROGRESS SUMMARY');
    console.log('='.repeat(70));
    console.log(`✅ Cities Scraped: ${scrapedCities.size}`);
    console.log(`🏨 Total Hotels: ${totalHotels.toLocaleString()}`);
    console.log(`📈 Average Hotels per City: ${Math.round(totalHotels / scrapedCities.size)}`);
    console.log('='.repeat(70));
    console.log('\n🔍 Top 10 Cities by Hotel Count:');

    const sortedCities = Object.entries(cityCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    sortedCities.forEach(([city, count], index) => {
        console.log(`   ${index + 1}. ${city}: ${count} hotels`);
    });
    console.log('='.repeat(70) + '\n');
}

export default {
    getScrapedCities,
    getCityHotelCounts,
    getTotalHotelsScraped,
    displayScrapingProgress
};
