/**
 * Calculate expected hotel count to verify 100k+ mission
 */

import { getAllCities, getCitiesByPriority } from './src/config/worldwide-cities.js';

const allCities = getAllCities();
const priority1 = getCitiesByPriority(1);
const priority2 = getCitiesByPriority(2);
const priority3 = getCitiesByPriority(3);

console.log('\n🎯 100K+ HOTELS MISSION - CAPACITY ANALYSIS\n');
console.log('='.repeat(70));

console.log('\n📊 CURRENT CONFIGURATION:');
console.log(`   Total Cities: ${allCities.length}`);
console.log(`   Priority 1 (Major): ${priority1.length} cities`);
console.log(`   Priority 2 (Medium): ${priority2.length} cities`);
console.log(`   Priority 3 (Small): ${priority3.length} cities`);

console.log('\n' + '='.repeat(70));
console.log('\n💡 HOTEL COUNT ESTIMATION:\n');

// Conservative estimate (minimal scraping)
const conservative = {
    p1: priority1.length * 150,  // 150 hotels per major city
    p2: priority2.length * 75,   // 75 hotels per medium city
    p3: priority3.length * 30    // 30 hotels per small city
};
const conservativeTotal = conservative.p1 + conservative.p2 + conservative.p3;

console.log('📉 Conservative (First page only, ~25-50 hotels/city):');
console.log(`   Priority 1: ${priority1.length} × 150 avg = ${conservative.p1.toLocaleString()} hotels`);
console.log(`   Priority 2: ${priority2.length} × 75 avg  = ${conservative.p2.toLocaleString()} hotels`);
console.log(`   Priority 3: ${priority3.length} × 30 avg  = ${conservative.p3.toLocaleString()} hotels`);
console.log(`   ─────────────────────────────────────`);
console.log(`   TOTAL: ${conservativeTotal.toLocaleString()} hotels`);

// Moderate estimate (some pagination)
const moderate = {
    p1: priority1.length * 300,  // 300 hotels per major city
    p2: priority2.length * 150,  // 150 hotels per medium city
    p3: priority3.length * 60    // 60 hotels per small city
};
const moderateTotal = moderate.p1 + moderate.p2 + moderate.p3;

console.log('\n📊 Moderate (2-4 pages, ~100-200 hotels/city):');
console.log(`   Priority 1: ${priority1.length} × 300 avg = ${moderate.p1.toLocaleString()} hotels`);
console.log(`   Priority 2: ${priority2.length} × 150 avg = ${moderate.p2.toLocaleString()} hotels`);
console.log(`   Priority 3: ${priority3.length} × 60 avg  = ${moderate.p3.toLocaleString()} hotels`);
console.log(`   ─────────────────────────────────────`);
console.log(`   TOTAL: ${moderateTotal.toLocaleString()} hotels`);

// Aggressive estimate (deep scraping)
const aggressive = {
    p1: priority1.length * 500,  // 500 hotels per major city  
    p2: priority2.length * 250,  // 250 hotels per medium city
    p3: priority3.length * 100   // 100 hotels per small city
};
const aggressiveTotal = aggressive.p1 + aggressive.p2 + aggressive.p3;

console.log('\n📈 Aggressive (Deep scraping, 10+ pages/city):');
console.log(`   Priority 1: ${priority1.length} × 500 avg = ${aggressive.p1.toLocaleString()} hotels`);
console.log(`   Priority 2: ${priority2.length} × 250 avg = ${aggressive.p2.toLocaleString()} hotels`);
console.log(`   Priority 3: ${priority3.length} × 100 avg = ${aggressive.p3.toLocaleString()} hotels`);
console.log(`   ─────────────────────────────────────`);
console.log(`   TOTAL: ${aggressiveTotal.toLocaleString()} hotels`);

console.log('\n' + '='.repeat(70));
console.log('\n🎯 MISSION STATUS:\n');

if (conservativeTotal >= 100000) {
    console.log(`   ✅ EASILY ACHIEVABLE: Even with minimal scraping, we can get ${conservativeTotal.toLocaleString()}+ hotels!`);
} else if (moderateTotal >= 100000) {
    console.log(`   ✅ ACHIEVABLE: With moderate pagination (2-4 pages), we'll reach ${moderateTotal.toLocaleString()}+ hotels!`);
} else if (aggressiveTotal >= 100000) {
    console.log(`   ⚠️  REQUIRES DEEP SCRAPING: Need 10+ pages per city to reach ${aggressiveTotal.toLocaleString()}+ hotels`);
} else {
    console.log(`   ❌ NEED MORE CITIES: Current max is ~${aggressiveTotal.toLocaleString()} hotels`);
    const citiesNeeded = Math.ceil((100000 - conservativeTotal) / 150);
    console.log(`   💡 Add ${citiesNeeded}+ more cities OR enable deeper pagination`);
}

console.log('\n📝 RECOMMENDATION:\n');

if (moderateTotal >= 100000) {
    console.log('   1. Configure scraper to get 2-4 pages per city');
    console.log('   2. This will give you 100k-150k hotels comfortably');
    console.log('   3. Estimated time: 2-3 days with proper setup');
} else {
    console.log('   1. Add more tier 2 and tier 3 cities (target: 600-800 total cities)');
    console.log('   2. Enable pagination for 4-8 pages per city');
    console.log('   3. Use proxies and parallel processing');
    console.log('   4. Estimated time: 3-5 days');
}

console.log('\n' + '='.repeat(70));
console.log('\n💪 Ready to achieve 100k+ hotels!\n');
