import { getAllCities } from './src/config/worldwide-cities.js';

const cities = getAllCities();
console.log(`\n✅ Total Cities Configured: ${cities.length}`);
console.log(`Ready to scrape hotels worldwide!\n`);
