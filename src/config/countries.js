/**
 * Country configuration with metadata
 */

export const COUNTRIES = {
    // European Countries
    'France': {
        code: 'FR',
        currency: 'EUR',
        timezone: 'Europe/Paris'
    },
    'United Kingdom': {
        code: 'GB',
        currency: 'GBP',
        timezone: 'Europe/London'
    },
    'Germany': {
        code: 'DE',
        currency: 'EUR',
        timezone: 'Europe/Berlin'
    },
    'Italy': {
        code: 'IT',
        currency: 'EUR',
        timezone: 'Europe/Rome'
    },
    'Spain': {
        code: 'ES',
        currency: 'EUR',
        timezone: 'Europe/Madrid'
    },
    'Netherlands': {
        code: 'NL',
        currency: 'EUR',
        timezone: 'Europe/Amsterdam'
    },

    // United States
    'United States': {
        code: 'US',
        currency: 'USD',
        timezone: 'America/New_York'
    }
};

/**
 * Get country information
 * @param {string} countryName - Name of the country
 * @returns {Object} Country metadata
 */
export function getCountryInfo(countryName) {
    return COUNTRIES[countryName] || {
        code: 'UNKNOWN',
        currency: 'USD',
        timezone: 'UTC'
    };
}

/**
 * Get default currency for a country
 * @param {string} countryName - Name of the country
 * @returns {string} Currency code
 */
export function getCountryCurrency(countryName) {
    const country = COUNTRIES[countryName];
    return country ? country.currency : 'USD';
}
