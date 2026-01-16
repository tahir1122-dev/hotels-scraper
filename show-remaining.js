/**
 * Show Remaining Cities
 * Displays which cities are left to scrape vs already completed
 */

import { getAllCities } from './src/config/worldwide-cities.js';
import { getScrapedCities, getCityHotelCounts } from './src/utils/scrape-tracker.js';

const allCities = getAllCities();
const scrapedCities = getScrapedCities();
const hotelCounts = getCityHotelCounts();

// Separate cities
const completed = [];
const remaining = [];

allCities.forEach(city => {
    if (scrapedCities.has(city.name)) {
        completed.push({
            ...city,
            hotels: hotelCounts[city.name] || 0
        });
    } else {
        remaining.push(city);
    }
});

// Sort by priority
const sortByPriority = (a, b) => a.priority - b.priority || a.name.localeCompare(b.name);
completed.sort(sortByPriority);
remaining.sort(sortByPriority);

console.log('\n' + '═'.repeat(80));
console.log('📊 SCRAPING STATUS OVERVIEW');
console.log('═'.repeat(80));
console.log(`✅ Completed Cities: ${completed.length}/${allCities.length} (${Math.round(completed.length / allCities.length * 100)}%)`);
console.log(`⏳ Remaining Cities: ${remaining.length}/${allCities.length} (${Math.round(remaining.length / allCities.length * 100)}%)`);
console.log(`🏨 Total Hotels Scraped: ${Object.values(hotelCounts).reduce((sum, count) => sum + count, 0).toLocaleString()}`);
console.log('═'.repeat(80));

console.log('\n✅ COMPLETED CITIES (will be SKIPPED on next run):');
console.log('─'.repeat(80));

if (completed.length > 0) {
    // Group by region
    const byRegion = {};
    completed.forEach(city => {
        if (!byRegion[city.region]) byRegion[city.region] = [];
        byRegion[city.region].push(city);
    });

    Object.entries(byRegion).forEach(([region, cities]) => {
        console.log(`\n📍 ${region.toUpperCase()} (${cities.length} cities):`);
        cities.forEach(city => {
            const priorityEmoji = city.priority === 1 ? '🔴' : city.priority === 2 ? '🟡' : '🟢';
            console.log(`   ${priorityEmoji} ${city.name}, ${city.country} - ${city.hotels} hotels`);
        });
    });
} else {
    console.log('   (none yet)');
}

console.log('\n\n⏳ REMAINING CITIES (will be scraped on next run):');
console.log('─'.repeat(80));

if (remaining.length > 0) {
    // Group by region
    const byRegion = {};
    remaining.forEach(city => {
        if (!byRegion[city.region]) byRegion[city.region] = [];
        byRegion[city.region].push(city);
    });

    Object.entries(byRegion).forEach(([region, cities]) => {
        console.log(`\n📍 ${region.toUpperCase()} (${cities.length} cities):`);

        // Group by priority
        const p1 = cities.filter(c => c.priority === 1);
        const p2 = cities.filter(c => c.priority === 2);
        const p3 = cities.filter(c => c.priority === 3);

        if (p1.length > 0) {
            console.log(`   🔴 Priority 1 (${p1.length}): ${p1.map(c => c.name).join(', ')}`);
        }
        if (p2.length > 0) {
            console.log(`   🟡 Priority 2 (${p2.length}): ${p2.map(c => c.name).join(', ')}`);
        }
        if (p3.length > 0) {
            console.log(`   🟢 Priority 3 (${p3.length}): ${p3.map(c => c.name).join(', ')}`);
        }
    });

    console.log('\n\n📊 REMAINING BREAKDOWN BY PRIORITY:');
    console.log('─'.repeat(80));
    const p1Total = remaining.filter(c => c.priority === 1).length;
    const p2Total = remaining.filter(c => c.priority === 2).length;
    const p3Total = remaining.filter(c => c.priority === 3).length;
    console.log(`🔴 Priority 1 (High):   ${p1Total} cities`);
    console.log(`🟡 Priority 2 (Medium): ${p2Total} cities`);
    console.log(`🟢 Priority 3 (Low):    ${p3Total} cities`);
} else {
    console.log('   🎉 All cities completed!');
}

console.log('\n' + '═'.repeat(80));
console.log('💡 TIP: To re-scrape all cities, set SKIP_SCRAPED_CITIES=false in .env');
console.log('═'.repeat(80) + '\n');
