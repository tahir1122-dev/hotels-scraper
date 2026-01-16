/**
 * City configuration for hotel scraping
 * Each city includes search parameters for Booking.com
 */

export const CITIES = {
    // Europe
    EUROPE: [
        { name: 'Paris', country: 'France', searchQuery: 'Paris', countryCode: 'fr' },
        { name: 'London', country: 'United Kingdom', searchQuery: 'London', countryCode: 'gb' },
        { name: 'Berlin', country: 'Germany', searchQuery: 'Berlin', countryCode: 'de' },
        { name: 'Rome', country: 'Italy', searchQuery: 'Rome', countryCode: 'it' },
        { name: 'Madrid', country: 'Spain', searchQuery: 'Madrid', countryCode: 'es' },
        { name: 'Barcelona', country: 'Spain', searchQuery: 'Barcelona', countryCode: 'es' },
        { name: 'Amsterdam', country: 'Netherlands', searchQuery: 'Amsterdam', countryCode: 'nl' },
        { name: 'Vienna', country: 'Austria', searchQuery: 'Vienna', countryCode: 'at' },
        { name: 'Prague', country: 'Czech Republic', searchQuery: 'Prague', countryCode: 'cz' },
        { name: 'Zurich', country: 'Switzerland', searchQuery: 'Zurich', countryCode: 'ch' },
        { name: 'Stockholm', country: 'Sweden', searchQuery: 'Stockholm', countryCode: 'se' },
        { name: 'Oslo', country: 'Norway', searchQuery: 'Oslo', countryCode: 'no' },
        { name: 'Copenhagen', country: 'Denmark', searchQuery: 'Copenhagen', countryCode: 'dk' },
        { name: 'Helsinki', country: 'Finland', searchQuery: 'Helsinki', countryCode: 'fi' }
    ],

    // North America
    NORTH_AMERICA: [
        { name: 'New York', country: 'United States', searchQuery: 'New York', countryCode: 'us' },
        { name: 'Los Angeles', country: 'United States', searchQuery: 'Los Angeles', countryCode: 'us' },
        { name: 'Chicago', country: 'United States', searchQuery: 'Chicago', countryCode: 'us' },
        { name: 'San Francisco', country: 'United States', searchQuery: 'San Francisco', countryCode: 'us' },
        { name: 'Miami', country: 'United States', searchQuery: 'Miami', countryCode: 'us' },
        { name: 'Dallas', country: 'United States', searchQuery: 'Dallas', countryCode: 'us' },
        { name: 'Toronto', country: 'Canada', searchQuery: 'Toronto', countryCode: 'ca' },
        { name: 'Vancouver', country: 'Canada', searchQuery: 'Vancouver', countryCode: 'ca' },
        { name: 'Montreal', country: 'Canada', searchQuery: 'Montreal', countryCode: 'ca' },
        { name: 'Mexico City', country: 'Mexico', searchQuery: 'Mexico City', countryCode: 'mx' },
        { name: 'Cancun', country: 'Mexico', searchQuery: 'Cancun', countryCode: 'mx' }
    ],

    // South America
    SOUTH_AMERICA: [
        { name: 'São Paulo', country: 'Brazil', searchQuery: 'São Paulo', countryCode: 'br' },
        { name: 'Rio de Janeiro', country: 'Brazil', searchQuery: 'Rio de Janeiro', countryCode: 'br' },
        { name: 'Buenos Aires', country: 'Argentina', searchQuery: 'Buenos Aires', countryCode: 'ar' },
        { name: 'Santiago', country: 'Chile', searchQuery: 'Santiago', countryCode: 'cl' },
        { name: 'Lima', country: 'Peru', searchQuery: 'Lima', countryCode: 'pe' },
        { name: 'Bogotá', country: 'Colombia', searchQuery: 'Bogotá', countryCode: 'co' }
    ],

    // Asia (including Pakistan & Middle East)
    ASIA: [
        { name: 'Dubai', country: 'United Arab Emirates', searchQuery: 'Dubai', countryCode: 'ae' },
        { name: 'Abu Dhabi', country: 'United Arab Emirates', searchQuery: 'Abu Dhabi', countryCode: 'ae' },
        { name: 'Riyadh', country: 'Saudi Arabia', searchQuery: 'Riyadh', countryCode: 'sa' },
        { name: 'Doha', country: 'Qatar', searchQuery: 'Doha', countryCode: 'qa' },
        { name: 'Tokyo', country: 'Japan', searchQuery: 'Tokyo', countryCode: 'jp' },
        { name: 'Osaka', country: 'Japan', searchQuery: 'Osaka', countryCode: 'jp' },
        { name: 'Seoul', country: 'South Korea', searchQuery: 'Seoul', countryCode: 'kr' },
        { name: 'Beijing', country: 'China', searchQuery: 'Beijing', countryCode: 'cn' },
        { name: 'Shanghai', country: 'China', searchQuery: 'Shanghai', countryCode: 'cn' },
        { name: 'Bangkok', country: 'Thailand', searchQuery: 'Bangkok', countryCode: 'th' },
        { name: 'Singapore', country: 'Singapore', searchQuery: 'Singapore', countryCode: 'sg' },
        { name: 'Kuala Lumpur', country: 'Malaysia', searchQuery: 'Kuala Lumpur', countryCode: 'my' },
        { name: 'Jakarta', country: 'Indonesia', searchQuery: 'Jakarta', countryCode: 'id' },

        // Pakistan
        { name: 'Karachi', country: 'Pakistan', searchQuery: 'Karachi', countryCode: 'pk' },
        { name: 'Lahore', country: 'Pakistan', searchQuery: 'Lahore', countryCode: 'pk' },
        { name: 'Islamabad', country: 'Pakistan', searchQuery: 'Islamabad', countryCode: 'pk' },
        { name: 'Rawalpindi', country: 'Pakistan', searchQuery: 'Rawalpindi', countryCode: 'pk' },
        { name: 'Faisalabad', country: 'Pakistan', searchQuery: 'Faisalabad', countryCode: 'pk' },

        // India
        { name: 'Delhi', country: 'India', searchQuery: 'Delhi', countryCode: 'in' },
        { name: 'Mumbai', country: 'India', searchQuery: 'Mumbai', countryCode: 'in' },
        { name: 'Bangalore', country: 'India', searchQuery: 'Bangalore', countryCode: 'in' },
        { name: 'Chennai', country: 'India', searchQuery: 'Chennai', countryCode: 'in' }
    ],

    // Africa
    AFRICA: [
        { name: 'Cairo', country: 'Egypt', searchQuery: 'Cairo', countryCode: 'eg' },
        { name: 'Alexandria', country: 'Egypt', searchQuery: 'Alexandria', countryCode: 'eg' },
        { name: 'Cape Town', country: 'South Africa', searchQuery: 'Cape Town', countryCode: 'za' },
        { name: 'Johannesburg', country: 'South Africa', searchQuery: 'Johannesburg', countryCode: 'za' },
        { name: 'Nairobi', country: 'Kenya', searchQuery: 'Nairobi', countryCode: 'ke' },
        { name: 'Lagos', country: 'Nigeria', searchQuery: 'Lagos', countryCode: 'ng' }
    ],

    // Oceania
    OCEANIA: [
        { name: 'Sydney', country: 'Australia', searchQuery: 'Sydney', countryCode: 'au' },
        { name: 'Melbourne', country: 'Australia', searchQuery: 'Melbourne', countryCode: 'au' },
        { name: 'Brisbane', country: 'Australia', searchQuery: 'Brisbane', countryCode: 'au' },
        { name: 'Perth', country: 'Australia', searchQuery: 'Perth', countryCode: 'au' },
        { name: 'Auckland', country: 'New Zealand', searchQuery: 'Auckland', countryCode: 'nz' }
    ]
};


/**
 * Get all cities flattened into a single array
 * @returns {Array} All cities
 */
export function getAllCities() {
    return [
        ...CITIES.EUROPE,
        ...CITIES.NORTH_AMERICA,
        ...CITIES.ASIA,
        ...CITIES.OCEANIA,
        ...CITIES.SOUTH_AMERICA,
        ...CITIES.AFRICA
    ];
}

/**
 * Get cities by region
 * @param {string} region - 'EUROPE', 'NORTH_AMERICA', 'ASIA', 'OCEANIA', 'SOUTH_AMERICA', or 'AFRICA'
 * @returns {Array} Cities for the specified region
 */
export function getCitiesByRegion(region) {
    return CITIES[region] || [];
}
