# Hotel Data Collector

A **flexible hotel data collection system** with **3 data sources**:

## 🌍 **OpenStreetMap (OSM)** - 100% FREE! (Recommended)
- ✅ No API key needed
- ✅ Unlimited requests
- ✅ Hotel locations, contacts, amenities
- ⚠️ No prices/availability

## 💰 **RapidAPI** - Paid API
- Requires API key & subscription
- Includes prices & availability
- Limited free tier

## ⚠️ **Web Scraping** - Not Recommended
- Gets blocked by anti-bot systems
- Unreliable for production

---

## 🚀 Quick Start (OpenStreetMap - FREE!)

1. **Install dependencies**:
```bash
npm install
```

2. **No configuration needed!** (Already set to OSM)

3. **Test**:
```bash
npm run test-osm
```

4. **Run collection**:
```bash
npm start
```

**That's it! No API key, no signup, 100% free!**

📖 **See [OSM-GUIDE.md](OSM-GUIDE.md) for complete OSM documentation**

---

## 💡 Choosing Your Data Source

### Use OpenStreetMap (OSM) if you need:
- ✅ Hotel locations & coordinates
- ✅ Contact information
- ✅ Amenities & facilities
- ✅ Free, unlimited access
- ✅ Global coverage

### Use RapidAPI if you need:
- 💰 Hotel prices
- 📅 Availability data
- ⭐ User reviews & ratings
- 🔗 Booking links

### Avoid Web Scraping:
- ❌ Gets blocked constantly
- ❌ Unreliable
- ❌ Not production-ready

---

## ⚠️ Legal Disclaimer

This tool is for **educational purposes only**. Before using:

- Always respect Terms of Service
- OSM: Open data, free to use (credit OpenStreetMap)
- RapidAPI: Follow API provider terms
- Web scraping: Not recommended, legal risks

**The authors are not responsible for any misuse of this software.**

---

## 🚀 Features

### OpenStreetMap Mode (FREE!) 💚
- **100% Free**: No API key, no limits
- **Rich Data**: Locations, contacts, amenities
- **Global**: Works worldwide
- **Legal**: Open data license
- **Reliable**: 99%+ uptime

### RapidAPI Mode 💰
- **Complete Data**: Prices, availability, reviews
- **Official**: Stable API structure
- **Scalable**: Production-ready
- **Paid**: Requires subscription

### Web Scraping Mode (Legacy) ⚠️
- **Not Recommended**: Frequently blocked
- **Anti-Detection**: Tries to avoid blocks
- **Unreliable**: <20% success rate

### All Modes
- **Data Normalization**: Comprehensive cleaning
- **Deduplication**: Automatic duplicate filtering
- **Multiple Formats**: JSON and CSV export
- **Logging**: Winston-based comprehensive logs
- **Modular**: Clean architecture

---

## 📋 Requirements

- **Node.js**: Version 18.0.0 or higher
- **npm**: Latest version
- **API Key**: RapidAPI key (for API mode)
- **Chrome**: Auto-installed by Puppeteer (for scraping mode)

---

## 📦 Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Choose Your Mode

#### Option A: API Mode (Recommended)
```bash
# Edit .env
USE_API=true
RAPIDAPI_KEY=your_actual_api_key_here

# Test configuration
npm run test-api

# Run
npm start
```

#### Option B: Web Scraping Mode (Not Recommended)
```bash
# Edit .env
USE_API=false
HEADLESS=true
USE_PROXY=false  # or true with PROXY_URL

# Run (expect blocks)
npm start
```

---

## 🎯 Usage

### Run All Cities

Scrape all configured cities (Europe + USA):

```bash
npm start
```

Or:

```bash
node src/index.js
```

### Run Specific Regions

**Europe only**:
```bash
node src/index.js --europe
```

**USA only**:
```bash
node src/index.js --usa
```

### Run Specific Cities

```bash
node src/index.js --city Paris London Berlin
```

### Help

```bash
node src/index.js --help
```

---

## 📁 Project Structure

```
Sacraping/
├── src/
│   ├── config/
│   │   ├── cities.js              # City configurations
│   │   ├── countries.js           # Country metadata
│   │   ├── headers.js             # User-agent rotation
│   │   └── puppeteer.config.js    # Browser configuration
│   ├── scrapers/
│   │   ├── booking.scraper.js     # Main scraping logic
│   │   └── booking.parser.js      # HTML parsing
│   ├── services/
│   │   ├── browser.service.js     # Browser management
│   │   ├── proxy.service.js       # Proxy rotation
│   │   └── export.service.js      # Data export
│   ├── utils/
│   │   ├── delay.js               # Delay utilities
│   │   ├── retry.js               # Retry logic
│   │   ├── normalize.js           # Data normalization
│   │   └── logger.js              # Logging configuration
│   └── index.js                   # Main entry point
├── data/                          # Output directory
│   ├── hotels.json                # JSON output
│   └── hotels.csv                 # CSV output
├── logs/                          # Log files
├── .env                           # Environment configuration
├── .gitignore
├── package.json
└── README.md
```

---

## 📊 Data Schema

Each hotel record contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `hotel_name` | String | Hotel name |
| `city` | String | City name |
| `country` | String | Country name |
| `address` | String | Hotel address |
| `latitude` | Number | Latitude coordinate |
| `longitude` | Number | Longitude coordinate |
| `star_rating` | Number | Star rating (0-5) |
| `review_score` | Number | Review score (0-10) |
| `review_count` | Number | Number of reviews |
| `price_per_night` | Number | Price per night |
| `currency` | String | Currency code (USD, EUR, GBP) |
| `room_type` | String | Room type |
| `property_type` | String | Property type (Hotel, Apartment, etc.) |
| `amenities` | Array | List of amenities |
| `image_url` | String | Main image URL |
| `booking_url` | String | Booking page URL |
| `free_cancellation` | Boolean | Free cancellation available |
| `availability_status` | String | Availability status |
| `scraped_at` | ISO Date | Timestamp of scraping |

---

## ⚙️ Configuration

### Environment Variables (.env)

```bash
# Browser Configuration
HEADLESS=true                    # Run browser in headless mode

# Proxy Configuration
USE_PROXY=false                  # Enable proxy support
PROXY_URL=                       # Proxy URL (http://user:pass@host:port)

# Scraping Configuration
DELAY_MIN=2000                   # Minimum delay between requests (ms)
DELAY_MAX=6000                   # Maximum delay between requests (ms)
MAX_RETRIES=3                    # Number of retry attempts

# Output Configuration
OUTPUT_DIR=data                  # Output directory for data files

# Logging
LOG_LEVEL=info                   # Log level (debug, info, warn, error)
```

### Adding More Cities

Edit `src/config/cities.js`:

```javascript
EUROPE: [
  {
    name: 'Barcelona',
    country: 'Spain',
    searchQuery: 'Barcelona',
    countryCode: 'es'
  },
  // Add more cities...
]
```

---

## 🛡️ Anti-Blocking Features

1. **User-Agent Rotation**: Random user agents from a pool of real browsers
2. **Request Delays**: Randomized delays between requests (2-6 seconds)
3. **Exponential Backoff**: Smart retry with increasing delays
4. **Proxy Support**: Route requests through proxies
5. **Headless Toggle**: Switch between headless and visible browser
6. **Anti-Detection Scripts**: Disable WebDriver detection
7. **Cookie Handling**: Automatic cookie consent management
8. **Page Blocking Detection**: Detect and handle CAPTCHA/blocks

---

## 📝 Logging

Logs are saved in the `logs/` directory:

- `combined.log` - All logs
- `error.log` - Error logs only
- `scraping-YYYY-MM-DD.log` - Daily scraping logs

Console output includes:
- Progress updates
- City-by-city status
- Error messages
- Final statistics

---

## 🔧 Troubleshooting

### Browser Launch Issues

If Puppeteer fails to launch:

```bash
# Install Chrome dependencies (Linux)
sudo apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils
```

### Empty Results

- Check if selectors have changed (Booking.com updates their HTML)
- Enable visible mode: `HEADLESS=false`
- Check `logs/` for screenshots and error details
- Verify your IP is not blocked

### Rate Limiting

- Increase `DELAY_MIN` and `DELAY_MAX`
- Enable proxy: `USE_PROXY=true`
- Reduce number of cities per run

---

## 🎨 Customization

### Change Selectors

Edit `src/config/puppeteer.config.js`:

```javascript
export const SELECTORS = {
  hotelCard: '[data-testid="property-card"]',
  hotelName: '[data-testid="title"]',
  // Update selectors as needed
};
```

### Add More Data Fields

1. Update parser in `src/scrapers/booking.parser.js`
2. Add extraction function
3. Update data schema in export service

---

## 📈 Performance Tips

1. **Use headless mode** for faster scraping
2. **Enable incremental saving** to prevent data loss
3. **Adjust delays** based on your needs (faster = more risk)
4. **Use proxies** to distribute requests
5. **Run region by region** for better control

---

## 🤝 Contributing

This is an educational project. Contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- Built with [Puppeteer](https://pptr.dev/)
- Parsing with [Cheerio](https://cheerio.js.org/)
- Logging with [Winston](https://github.com/winstonjs/winston)

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Run the scraper
npm start

# Check results
cat data/hotels.json
```

---

## 📞 Support

For issues or questions:
- Check the logs in `logs/` directory
- Review error screenshots
- Adjust configuration in `.env`
- Consult the troubleshooting section

---

**Remember**: Use responsibly and ethically. Always respect website terms of service and implement appropriate rate limiting.
