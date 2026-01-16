/**
 * Proxy service for managing proxy connections
 * Handles proxy rotation and validation
 */

import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

class ProxyService {
    constructor() {
        this.useProxy = process.env.USE_PROXY === 'true';
        this.proxyUrl = process.env.PROXY_URL;
        this.proxyList = [];
        this.currentProxyIndex = 0;
    }

    /**
     * Check if proxy is enabled
     * @returns {boolean}
     */
    isEnabled() {
        return this.useProxy && this.proxyUrl;
    }

    /**
     * Get current proxy URL
     * @returns {string|null}
     */
    getCurrentProxy() {
        if (!this.isEnabled()) {
            return null;
        }

        // If we have a proxy list, rotate through them
        if (this.proxyList.length > 0) {
            const proxy = this.proxyList[this.currentProxyIndex];
            this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxyList.length;
            return proxy;
        }

        // Otherwise use the single proxy URL
        return this.proxyUrl;
    }

    /**
     * Load proxy list from array or file
     * @param {Array<string>} proxies - List of proxy URLs
     */
    loadProxyList(proxies) {
        if (!Array.isArray(proxies) || proxies.length === 0) {
            logger.warn('No proxies provided to load');
            return;
        }

        this.proxyList = proxies.filter(p => this.validateProxyFormat(p));
        logger.info(`Loaded ${this.proxyList.length} proxies`);
    }

    /**
     * Validate proxy URL format
     * @param {string} proxyUrl - Proxy URL to validate
     * @returns {boolean}
     */
    validateProxyFormat(proxyUrl) {
        if (!proxyUrl || typeof proxyUrl !== 'string') {
            return false;
        }

        // Check for valid proxy format: protocol://[user:pass@]host:port
        const proxyPattern = /^(http|https|socks4|socks5):\/\/(.+:)?(.+@)?[\w.-]+:\d+$/;
        return proxyPattern.test(proxyUrl);
    }

    /**
     * Test proxy connection
     * @param {string} proxyUrl - Proxy URL to test
     * @returns {Promise<boolean>}
     */
    async testProxy(proxyUrl) {
        try {
            // This is a placeholder - in production, you'd actually test the proxy
            // by making a request through it
            logger.info(`Testing proxy: ${proxyUrl}`);

            // For now, just validate format
            return this.validateProxyFormat(proxyUrl);
        } catch (error) {
            logger.error(`Proxy test failed for ${proxyUrl}:`, error);
            return false;
        }
    }

    /**
     * Get proxy configuration for Puppeteer
     * @returns {Object|null}
     */
    getPuppeteerProxyConfig() {
        const proxy = this.getCurrentProxy();

        if (!proxy) {
            return null;
        }

        try {
            const url = new URL(proxy);

            const config = {
                server: `${url.protocol}//${url.host}`,
            };

            // Add authentication if present
            if (url.username && url.password) {
                config.username = url.username;
                config.password = url.password;
            }

            return config;
        } catch (error) {
            logger.error('Failed to parse proxy URL:', error);
            return null;
        }
    }

    /**
     * Get proxy configuration for Axios
     * @returns {Object|null}
     */
    getAxiosProxyConfig() {
        const proxy = this.getCurrentProxy();

        if (!proxy) {
            return null;
        }

        try {
            const url = new URL(proxy);

            const config = {
                host: url.hostname,
                port: parseInt(url.port),
                protocol: url.protocol.replace(':', '')
            };

            // Add authentication if present
            if (url.username && url.password) {
                config.auth = {
                    username: url.username,
                    password: url.password
                };
            }

            return config;
        } catch (error) {
            logger.error('Failed to parse proxy URL for Axios:', error);
            return null;
        }
    }

    /**
     * Mark proxy as failed (for rotation logic)
     * @param {string} proxyUrl - Failed proxy URL
     */
    markProxyFailed(proxyUrl) {
        logger.warn(`Proxy marked as failed: ${proxyUrl}`);

        // In production, you might want to:
        // 1. Remove from rotation temporarily
        // 2. Add to a blacklist
        // 3. Track failure count

        // For now, just log it
    }

    /**
     * Get proxy statistics
     * @returns {Object}
     */
    getStats() {
        return {
            enabled: this.isEnabled(),
            totalProxies: this.proxyList.length,
            currentIndex: this.currentProxyIndex,
            currentProxy: this.getCurrentProxy()
        };
    }
}

// Export singleton instance
export default new ProxyService();
