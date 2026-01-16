/**
 * Display all countries covered in the worldwide cities configuration
 */

import { WORLDWIDE_CITIES, getAllWorldwideCities } from './src/config/worldwide-cities.js';

console.log('\n🌍 WORLDWIDE HOTEL SCRAPER - COUNTRY COVERAGE\n');
console.log('='.repeat(70));

const allCities = getAllWorldwideCities();
const countryStats = {};
const regionStats = {};

// Collect statistics
for (const city of allCities) {
    if (!countryStats[city.country]) {
        countryStats[city.country] = {
            count: 0,
            region: city.region,
            cities: []
        };
    }
    countryStats[city.country].count++;
    countryStats[city.country].cities.push(city.name);

    if (!regionStats[city.region]) {
        regionStats[city.region] = {
            countries: new Set(),
            cities: 0
        };
    }
    regionStats[city.region].countries.add(city.country);
    regionStats[city.region].cities++;
}

// Sort countries alphabetically
const sortedCountries = Object.keys(countryStats).sort();

console.log(`\n📊 SUMMARY:`);
console.log(`   Total Countries: ${sortedCountries.length}`);
console.log(`   Total Cities: ${allCities.length}`);
console.log(`   Regions: ${Object.keys(regionStats).length}`);
console.log('='.repeat(70));

// Display by region
for (const [region, regionData] of Object.entries(WORLDWIDE_CITIES)) {
    const regionName = region.replace(/_/g, ' ');
    const countries = new Set(regionData.map(c => c.country));

    console.log(`\n🌎 ${regionName.toUpperCase()}`);
    console.log(`   Countries: ${countries.size} | Cities: ${regionData.length}`);
    console.log('   ' + '-'.repeat(66));

    const countryGroups = {};
    for (const city of regionData) {
        if (!countryGroups[city.country]) {
            countryGroups[city.country] = [];
        }
        countryGroups[city.country].push(city.name);
    }

    for (const [country, cities] of Object.entries(countryGroups).sort()) {
        console.log(`   📍 ${country} (${cities.length} cities)`);
        console.log(`      → ${cities.join(', ')}`);
    }
}

console.log('\n' + '='.repeat(70));
console.log('\n✅ All Countries Alphabetically:\n');

for (const country of sortedCountries) {
    const stats = countryStats[country];
    console.log(`   ${country.padEnd(30)} ${stats.count} cities (${stats.region})`);
}

console.log('\n' + '='.repeat(70));
console.log('\n📋 REGION SUMMARY:\n');

for (const [region, stats] of Object.entries(regionStats)) {
    console.log(`   ${region.toUpperCase().padEnd(20)} ${stats.countries.size} countries, ${stats.cities} cities`);
}

console.log('\n' + '='.repeat(70));
console.log('\n✨ Ready to scrape hotels from all these countries!\n');
