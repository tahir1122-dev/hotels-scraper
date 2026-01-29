/**
 * IPRoyal Proxy Service
 * Manages proxy connections with country targeting and rotation
 */

import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

class ProxyService {
    constructor() {
        this.host = process.env.PROXY_HOST || 'geo.iproyal.com';
        this.port = process.env.PROXY_PORT || '12321';
        this.username = process.env.PROXY_USERNAME;
        this.password = process.env.PROXY_PASSWORD;
        this.enabled = process.env.USE_PROXY === 'true';

        this.requestCount = 0;
        this.currentCountry = null;

        // Country codes for geo-targeting
        this.countryCodes = {
            'United States': 'us',
            'United Kingdom': 'gb',
            'Germany': 'de',
            'France': 'fr',
            'Italy': 'it',
            'Spain': 'es',
            'Netherlands': 'nl',
            'Japan': 'jp',
            'Australia': 'au',
            'Canada': 'ca',
            'Singapore': 'sg',
            'Thailand': 'th',
            'India': 'in',
            'Brazil': 'br',
            'Mexico': 'mx',
            'UAE': 'ae',
            'United Arab Emirates': 'ae',
            'South Korea': 'kr',
            'Indonesia': 'id',
            'Malaysia': 'my',
            'South Africa': 'za',
            'Morocco': 'ma',
            'Egypt': 'eg',
            'Kenya': 'ke',
            'Argentina': 'ar',
            'Peru': 'pe',
            'Colombia': 'co',
            'Czech Republic': 'cz',
            'Austria': 'at',
            'Portugal': 'pt',
            'New Zealand': 'nz',
            'Hong Kong': 'hk',
            'China': 'cn',
            'Russia': 'ru',
            'Poland': 'pl',
            'Sweden': 'se',
            'Norway': 'no',
            'Denmark': 'dk',
            'Finland': 'fi',
            'Ireland': 'ie',
            'Belgium': 'be',
            'Switzerland': 'ch',
            'Greece': 'gr',
            'Turkey': 'tr',
            'Vietnam': 'vn',
            'Philippines': 'ph'
        };
    }

    /**
     * Check if proxy is enabled
     */
    isEnabled() {
        return !!(this.enabled && this.username && this.password);
    }

    /**
     * Get proxy URL for a specific country
     * @param {string} country - Target country name
     * @returns {string} Proxy URL with country targeting
     */
    getProxyUrl(country = null) {
        if (!this.isEnabled()) {
            return null;
        }

        let password = this.password;

        // Add country targeting if specified
        if (country && this.countryCodes[country]) {
            const countryCode = this.countryCodes[country];
            password = `${this.password}_country-${countryCode}`;
            this.currentCountry = country;
        }

        const proxyUrl = `http://${this.username}:${password}@${this.host}:${this.port}`;
        return proxyUrl;
    }

    /**
     * Get proxy configuration for Puppeteer
     * @param {string} country - Target country
     * @returns {Array} Puppeteer proxy args
     */
    getPuppeteerArgs(country = null) {
        if (!this.isEnabled()) {
            return [];
        }

        // Return proxy server without auth - auth will be set via setRequestInterception
        return [`--proxy-server=http://${this.host}:${this.port}`];
    }

    /**
     * Get proxy URL with authentication for request interception
     * @param {string} country - Target country
     * @returns {string} Full proxy URL with auth
     */
    getProxyUrlWithAuth(country = null) {
        if (!this.isEnabled()) {
            return null;
        }

        return this.getProxyUrl(country);
    }

    /**
     * Get proxy authentication for Puppeteer page
     * @param {string} country - Target country
     * @returns {Object} Authentication credentials
     */
    getAuthentication(country = null) {
        if (!this.isEnabled()) {
            return null;
        }

        let password = this.password;
        if (country && this.countryCodes[country]) {
            password = `${this.password}_country-${this.countryCodes[country]}`;
        }

        return {
            username: this.username,
            password: password
        };
    }

    /**
     * Get proxy for axios requests
     * @param {string} country - Target country
     * @returns {Object} Axios proxy configuration
     */
    getAxiosProxy(country = null) {
        if (!this.isEnabled()) {
            return null;
        }

        let password = this.password;
        if (country && this.countryCodes[country]) {
            password = `${this.password}_country-${this.countryCodes[country]}`;
        }

        return {
            host: this.host,
            port: parseInt(this.port),
            auth: {
                username: this.username,
                password: password
            }
        };
    }

    /**
     * Track request
     */
    trackRequest() {
        this.requestCount++;
    }

    /**
     * Get stats
     */
    getStats() {
        return {
            enabled: this.isEnabled(),
            host: this.host,
            port: this.port,
            requestCount: this.requestCount,
            currentCountry: this.currentCountry
        };
    }

    /**
     * Test proxy connection
     */
    async testConnection() {
        if (!this.isEnabled()) {
            logger.warn('Proxy is not enabled');
            return false;
        }

        try {
            const { default: axios } = await import('axios');
            const { HttpsProxyAgent } = await import('https-proxy-agent');

            logger.info('Testing proxy connection...');
            logger.info(`Proxy: ${this.host}:${this.port}`);
            logger.info(`Username: ${this.username}`);

            const proxyUrl = `http://${this.username}:${this.password}@${this.host}:${this.port}`;
            const agent = new HttpsProxyAgent(proxyUrl);

            const response = await axios.get('https://ipv4.icanhazip.com', {
                httpsAgent: agent,
                timeout: 30000,
                proxy: false // Disable default proxy handling
            });
            logger.info(`Proxy test successful. IP: ${response.data.trim()}`);
            return true;
        } catch (error) {
            logger.error('Proxy test failed:', error.message);
            if (error.response) {
                logger.error('Response status:', error.response.status);
            }
            if (error.code) {
                logger.error('Error code:', error.code);
            }
            return false;
        }
    }
}

export default new ProxyService();
