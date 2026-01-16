/**
 * Export service for saving scraped data
 * Supports JSON and CSV formats with deduplication
 */

import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import logger from '../utils/logger.js';
import { createHotelHash } from '../utils/normalize.js';
import dotenv from 'dotenv';

dotenv.config();

const OUTPUT_DIR = process.env.OUTPUT_DIR || 'data';

class ExportService {
    constructor() {
        this.outputDir = OUTPUT_DIR;
        this.jsonFilePath = path.join(this.outputDir, 'hotels.json');
        this.csvFilePath = path.join(this.outputDir, 'hotels.csv');
        this.seenHotels = new Set();

        this.ensureOutputDir();
    }

    /**
     * Ensure output directory exists
     */
    ensureOutputDir() {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
            logger.info(`Created output directory: ${this.outputDir}`);
        }
    }

    /**
     * Load existing hotels to track duplicates
     * @returns {Promise<void>}
     */
    async loadExistingHotels() {
        try {
            if (fs.existsSync(this.jsonFilePath)) {
                const data = fs.readFileSync(this.jsonFilePath, 'utf-8');
                const hotels = JSON.parse(data);

                // Build hash set of existing hotels
                for (const hotel of hotels) {
                    const hash = createHotelHash(hotel.hotel_name, hotel.city);
                    this.seenHotels.add(hash);
                }

                logger.info(`Loaded ${this.seenHotels.size} existing hotels for deduplication`);
            }
        } catch (error) {
            logger.error('Failed to load existing hotels:', error);
            // Continue anyway - we'll just have a fresh start
        }
    }

    /**
     * Check if hotel is duplicate
     * @param {Object} hotel - Hotel data
     * @returns {boolean}
     */
    isDuplicate(hotel) {
        const hash = createHotelHash(hotel.hotel_name, hotel.city);
        return this.seenHotels.has(hash);
    }

    /**
     * Mark hotel as seen
     * @param {Object} hotel - Hotel data
     */
    markAsSeen(hotel) {
        const hash = createHotelHash(hotel.hotel_name, hotel.city);
        this.seenHotels.add(hash);
    }

    /**
     * Filter out duplicate hotels
     * @param {Array} hotels - Array of hotel data
     * @returns {Array} Deduplicated hotels
     */
    deduplicateHotels(hotels) {
        const unique = [];

        for (const hotel of hotels) {
            if (!this.isDuplicate(hotel)) {
                unique.push(hotel);
                this.markAsSeen(hotel);
            }
        }

        if (hotels.length !== unique.length) {
            logger.info(`Filtered ${hotels.length - unique.length} duplicate hotels`);
        }

        return unique;
    }

    /**
     * Save hotels to JSON file
     * @param {Array} hotels - Array of hotel data
     * @param {boolean} append - Whether to append or overwrite
     * @returns {Promise<void>}
     */
    async saveToJSON(hotels, append = true) {
        try {
            let allHotels = hotels;

            // Load existing data if appending
            if (append && fs.existsSync(this.jsonFilePath)) {
                const existingData = fs.readFileSync(this.jsonFilePath, 'utf-8');
                const existingHotels = JSON.parse(existingData);
                allHotels = [...existingHotels, ...hotels];
            }

            // Write to file with pretty formatting
            fs.writeFileSync(
                this.jsonFilePath,
                JSON.stringify(allHotels, null, 2),
                'utf-8'
            );

            logger.info(`Saved ${hotels.length} hotels to JSON (total: ${allHotels.length})`);
        } catch (error) {
            logger.error('Failed to save to JSON:', error);
            throw error;
        }
    }

    /**
     * Save hotels to CSV file
     * @param {Array} hotels - Array of hotel data
     * @param {boolean} append - Whether to append or overwrite
     * @returns {Promise<void>}
     */
    async saveToCSV(hotels, append = true) {
        try {
            if (!hotels || hotels.length === 0) {
                logger.warn('No hotels to save to CSV');
                return;
            }

            // Define CSV columns
            const csvWriter = createObjectCsvWriter({
                path: this.csvFilePath,
                header: [
                    { id: 'id', title: 'ID' },
                    { id: 'hotel_name', title: 'Hotel Name' },
                    { id: 'city', title: 'City' },
                    { id: 'country', title: 'Country' },
                    { id: 'address', title: 'Address' },
                    { id: 'latitude', title: 'Latitude' },
                    { id: 'longitude', title: 'Longitude' },
                    { id: 'star_rating', title: 'Star Rating' },
                    { id: 'review_score', title: 'Review Score' },
                    { id: 'review_count', title: 'Review Count' },
                    { id: 'price_per_night', title: 'Price Per Night' },
                    { id: 'currency', title: 'Currency' },
                    { id: 'room_type', title: 'Room Type' },
                    { id: 'property_type', title: 'Property Type' },
                    { id: 'amenities', title: 'Amenities' },
                    { id: 'image_url', title: 'Image URL' },
                    { id: 'booking_url', title: 'Booking URL' },
                    { id: 'free_cancellation', title: 'Free Cancellation' },
                    { id: 'availability_status', title: 'Availability Status' },
                    { id: 'scraped_at', title: 'Scraped At' }
                ],
                append: append && fs.existsSync(this.csvFilePath)
            });

            // Convert amenities array to string for CSV
            const csvRecords = hotels.map(hotel => ({
                ...hotel,
                amenities: Array.isArray(hotel.amenities)
                    ? hotel.amenities.join('; ')
                    : hotel.amenities
            }));

            await csvWriter.writeRecords(csvRecords);

            logger.info(`Saved ${hotels.length} hotels to CSV`);
        } catch (error) {
            logger.error('Failed to save to CSV:', error);
            throw error;
        }
    }

    /**
     * Save hotels to both JSON and CSV
     * @param {Array} hotels - Array of hotel data
     * @param {Object} options - Save options
     * @returns {Promise<void>}
     */
    async save(hotels, options = {}) {
        const {
            append = true,
            deduplicate = true
        } = options;

        try {
            if (!hotels || hotels.length === 0) {
                logger.warn('No hotels to save');
                return;
            }

            // Deduplicate if requested
            let hotelsToSave = hotels;
            if (deduplicate) {
                hotelsToSave = this.deduplicateHotels(hotels);
            }

            if (hotelsToSave.length === 0) {
                logger.info('All hotels were duplicates, nothing to save');
                return;
            }

            // Save to both formats in parallel
            await Promise.all([
                this.saveToJSON(hotelsToSave, append),
                this.saveToCSV(hotelsToSave, append)
            ]);

            logger.info(`Successfully saved ${hotelsToSave.length} hotels`);
        } catch (error) {
            logger.error('Failed to save hotels:', error);
            throw error;
        }
    }

    /**
     * Get save statistics
     * @returns {Object}
     */
    getStats() {
        let totalHotels = 0;

        try {
            if (fs.existsSync(this.jsonFilePath)) {
                const data = fs.readFileSync(this.jsonFilePath, 'utf-8');
                const hotels = JSON.parse(data);
                totalHotels = hotels.length;
            }
        } catch (error) {
            logger.error('Failed to get stats:', error);
        }

        return {
            totalHotels,
            uniqueHotels: this.seenHotels.size,
            outputDir: this.outputDir,
            jsonFile: this.jsonFilePath,
            csvFile: this.csvFilePath
        };
    }

    /**
     * Save hotels to a specific file
     * @param {Array} hotels - Array of hotel data
     * @param {string} filename - Output filename
     * @param {Object} options - Save options
     * @returns {Promise<void>}
     */
    async saveToFile(hotels, filename, options = {}) {
        const { append = true, deduplicate = true } = options;
        const filePath = path.join(this.outputDir, filename);

        try {
            if (!hotels || hotels.length === 0) {
                return;
            }

            let hotelsToSave = hotels;
            if (deduplicate) {
                hotelsToSave = this.deduplicateHotels(hotels);
            }

            let allHotels = hotelsToSave;

            // Load existing data if appending
            if (append && fs.existsSync(filePath)) {
                const existingData = fs.readFileSync(filePath, 'utf-8');
                const existingHotels = JSON.parse(existingData);
                allHotels = [...existingHotels, ...hotelsToSave];
            }

            // Write to file
            fs.writeFileSync(filePath, JSON.stringify(allHotels, null, 2), 'utf-8');
            logger.info(`Saved ${hotelsToSave.length} hotels to ${filename} (total: ${allHotels.length})`);

        } catch (error) {
            logger.error(`Failed to save to ${filename}:`, error);
        }
    }

    /**
     * Clear all saved data
     * @returns {Promise<void>}
     */
    async clear() {
        try {
            if (fs.existsSync(this.jsonFilePath)) {
                fs.unlinkSync(this.jsonFilePath);
            }
            if (fs.existsSync(this.csvFilePath)) {
                fs.unlinkSync(this.csvFilePath);
            }

            this.seenHotels.clear();
            logger.info('Cleared all saved data');
        } catch (error) {
            logger.error('Failed to clear data:', error);
            throw error;
        }
    }
}

// Export singleton instance
export default new ExportService();
