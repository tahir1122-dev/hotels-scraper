# 🌍 Worldwide Hotel Scraper - Complete Country Coverage

## 📊 Coverage Statistics

- **Total Countries**: 152
- **Total Cities**: 273
- **Regions**: 8 (Europe, North America, Central America, Asia, Oceania, South America, Africa, Caribbean)

## 🗺️ Countries by Region

### 🇪🇺 Europe (38 countries, 54 cities)
Albania, Austria, Belarus, Belgium, Bosnia and Herzegovina, Bulgaria, Croatia, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Iceland, Ireland, Italy, Latvia, Lithuania, Luxembourg, Moldova, Netherlands, North Macedonia, Norway, Poland, Portugal, Romania, Russia, Serbia, Slovakia, Slovenia, Spain, Sweden, Switzerland, Turkey, Ukraine, United Kingdom

### 🇺🇸 North America (3 countries, 28 cities)
Canada, Mexico, United States

### 🌎 Central America (7 countries, 7 cities)
Belize, Costa Rica, El Salvador, Guatemala, Honduras, Nicaragua, Panama

### 🇯🇵 Asia (41 countries, 90 cities)
Afghanistan, Armenia, Azerbaijan, Bahrain, Bangladesh, Bhutan, Brunei, Cambodia, China, Georgia, Hong Kong, India, Indonesia, Iran, Iraq, Israel, Japan, Jordan, Kuwait, Laos, Lebanon, Malaysia, Maldives, Mongolia, Myanmar, Nepal, Oman, Pakistan, Philippines, Qatar, Saudi Arabia, Singapore, South Korea, Sri Lanka, Syria, Taiwan, Thailand, Timor-Leste, United Arab Emirates, Vietnam, Yemen

### 🇦🇺 Oceania (10 countries, 20 cities)
Australia, Fiji, French Polynesia, New Caledonia, New Zealand, Papua New Guinea, Samoa, Solomon Islands, Tonga, Vanuatu

### 🇧🇷 South America (13 countries, 25 cities)
Argentina, Bolivia, Brazil, Chile, Colombia, Ecuador, French Guiana, Guyana, Paraguay, Peru, Suriname, Uruguay, Venezuela

### 🌍 Africa (25 countries, 32 cities)
Algeria, Angola, Botswana, Egypt, Ethiopia, Ghana, Ivory Coast, Kenya, Libya, Madagascar, Mali, Mauritius, Morocco, Mozambique, Namibia, Nigeria, Rwanda, Senegal, Seychelles, South Africa, Tanzania, Tunisia, Uganda, Zambia, Zimbabwe

### 🏝️ Caribbean (15 countries, 17 cities)
Aruba, Bahamas, Barbados, Cayman Islands, Cuba, Curacao, Dominican Republic, Grenada, Guadeloupe, Jamaica, Martinique, Puerto Rico, Saint Kitts and Nevis, Saint Lucia, Trinidad and Tobago

---

## 🎯 Coverage Highlights

### Most Cities by Country
1. 🇺🇸 **United States** - 18 cities
2. 🇵🇰 **Pakistan** - 10 cities
3. 🇮🇳 **India** - 9 cities
4. 🇦🇺 **Australia** - 7 cities
5. 🇨🇳 **China** - 6 cities
6. 🇧🇷 **Brazil** - 5 cities
7. 🇨🇦 **Canada** - 5 cities
8. 🇯🇵 **Japan** - 5 cities
9. 🇲🇽 **Mexico** - 5 cities
10. 🇹🇭 **Thailand** - 5 cities

### All 152 Countries (Alphabetically)

Afghanistan • Albania • Algeria • Angola • Argentina • Armenia • Aruba • Australia • Austria • Azerbaijan • Bahamas • Bahrain • Bangladesh • Barbados • Belarus • Belgium • Belize • Bhutan • Bolivia • Bosnia and Herzegovina • Botswana • Brazil • Brunei • Bulgaria • Cambodia • Canada • Cayman Islands • Chile • China • Colombia • Costa Rica • Croatia • Cuba • Curacao • Czech Republic • Denmark • Dominican Republic • Ecuador • Egypt • El Salvador • Estonia • Ethiopia • Fiji • Finland • France • French Guiana • French Polynesia • Georgia • Germany • Ghana • Greece • Grenada • Guadeloupe • Guatemala • Guyana • Honduras • Hong Kong • Hungary • Iceland • India • Indonesia • Iran • Iraq • Ireland • Israel • Italy • Ivory Coast • Jamaica • Japan • Jordan • Kenya • Kuwait • Laos • Latvia • Lebanon • Libya • Lithuania • Luxembourg • Madagascar • Malaysia • Maldives • Mali • Martinique • Mauritius • Mexico • Moldova • Mongolia • Morocco • Mozambique • Myanmar • Namibia • Nepal • Netherlands • New Caledonia • New Zealand • Nicaragua • Nigeria • North Macedonia • Norway • Oman • Pakistan • Panama • Papua New Guinea • Paraguay • Peru • Philippines • Poland • Portugal • Puerto Rico • Qatar • Romania • Russia • Rwanda • Saint Kitts and Nevis • Saint Lucia • Samoa • Saudi Arabia • Senegal • Serbia • Seychelles • Singapore • Slovakia • Slovenia • Solomon Islands • South Africa • South Korea • Spain • Sri Lanka • Suriname • Sweden • Switzerland • Syria • Taiwan • Tanzania • Thailand • Timor-Leste • Tonga • Trinidad and Tobago • Tunisia • Turkey • Uganda • Ukraine • United Arab Emirates • United Kingdom • United States • Uruguay • Vanuatu • Venezuela • Vietnam • Yemen • Zambia • Zimbabwe

---

## 🚀 How to Use

### Run Worldwide Scraping
```bash
# Scrape ALL 273 cities worldwide
node src/index.js

# Or scrape by specific region
node src/index.js --europe
node src/index.js --asia
node src/index.js --north-america
node src/index.js --africa
node src/index.js --oceania
node src/index.js --south-america
```

### View Country Coverage
```bash
# Display all countries and cities
node show-countries.js
```

### Environment Configuration
```env
# .env file
DATA_SOURCE=booking           # Use Booking.com scraper
USE_PROXY=true               # Enable proxy for better success
HEADLESS=true                # Run in headless mode
DELAY_MIN=3000              # Minimum delay between requests
DELAY_MAX=7000              # Maximum delay between requests
```

---

## 📋 City Priority Levels

- **Priority 1** (High): Major tourist destinations and capitals (68 cities)
- **Priority 2** (Medium): Important regional cities (108 cities)
- **Priority 3** (Low): Secondary cities and smaller destinations (97 cities)

You can filter by priority:
```javascript
import { getCitiesByPriority } from './src/config/worldwide-cities.js';

// Get only high-priority cities
const topCities = getCitiesByPriority(1);
```

---

## ✨ Features

✅ **Comprehensive Coverage** - 152 countries across all continents  
✅ **No Descriptions** - Fast scraping without visiting individual hotel pages  
✅ **Multi-Platform Support** - Booking.com, Agoda, Hotels.com  
✅ **Proxy Support** - IPRoyal proxy integration for global access  
✅ **Region-Based Scraping** - Target specific regions or go worldwide  
✅ **Priority-Based Filtering** - Focus on major cities first  
✅ **Incremental Saving** - Save results as you go  
✅ **Deduplication** - Automatic removal of duplicate hotels  

---

## 🎓 Data Fields Collected

Each hotel includes:
- Hotel Name
- City & Country
- Address
- Star Rating
- Review Score & Count
- Price per Night
- Currency
- Property Type
- Amenities
- Image URL
- Booking URL
- Coordinates (when available)
- Scraped Timestamp

---

## 📞 Support

For issues or questions about specific countries or cities, please check:
1. The city is defined in `src/config/worldwide-cities.js`
2. The country code is properly set
3. Proxy settings are configured correctly

---

**Last Updated**: January 2026  
**Version**: 2.0.0 - Worldwide Edition
