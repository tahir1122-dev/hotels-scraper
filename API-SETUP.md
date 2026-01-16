# Hotel Data Collection - API Setup Guide

## 🎯 Recommended Approach: Use APIs Instead of Web Scraping

This project now supports **two modes**:
1. ✅ **API Mode** (Recommended) - Stable, reliable, no blocks
2. ⚠️ **Web Scraping Mode** (Legacy) - Gets blocked by anti-bot systems

---

## 🚀 Quick Start with API Mode

### Step 1: Get RapidAPI Key

1. Go to [RapidAPI Booking.com API](https://rapidapi.com/apidojo/api/booking-com)
2. Sign up for a free account
3. Subscribe to the API (free tier available)
4. Copy your API key

### Step 2: Configure Environment

Edit `.env` file:

```env
# Enable API mode
USE_API=true

# Add your RapidAPI key
RAPIDAPI_KEY=your_actual_api_key_here
RAPIDAPI_HOST=booking-com.p.rapidapi.com
```

### Step 3: Run the Application

```bash
npm start
```

That's it! No browser, no proxies, no CAPTCHAs.

---

## 📊 API Benefits vs Web Scraping

| Feature | API Mode ✅ | Web Scraping ⚠️ |
|---------|------------|------------------|
| **Reliability** | Always works | Often blocked |
| **Speed** | Fast (JSON) | Slow (browser) |
| **IP Blocks** | None | Frequent |
| **CAPTCHAs** | None | Common |
| **Maintenance** | Minimal | High |
| **Cost** | API fees | Proxy costs |
| **Legal** | Compliant | Risky |
| **Data Quality** | Structured | Requires parsing |

---

## 🔑 API Providers

### 1. RapidAPI Booking.com (Recommended)
- **URL**: https://rapidapi.com/apidojo/api/booking-com
- **Pricing**: Free tier + paid plans
- **Features**: Hotels, prices, availability, reviews
- **Coverage**: Global (Europe, USA, Asia, etc.)

### 2. Alternative APIs

#### Booking.com Partner/Affiliate API
- **URL**: https://www.booking.com/affiliate-program/
- **Type**: Official Booking.com API
- **Best for**: Commercial use, production apps

#### SerpApi Hotels
- **URL**: https://serpapi.com/hotels-api
- **Features**: Google Hotels data
- **Good for**: Price comparisons

#### Amadeus Hotel API
- **URL**: https://developers.amadeus.com/
- **Type**: Enterprise travel API
- **Best for**: Large-scale applications

---

## 💡 API Usage Example

The API service is already implemented in `src/services/hotel-api.service.js`:

```javascript
import hotelAPIService from './services/hotel-api.service.js';

// Fetch hotels for a city
const hotels = await hotelAPIService.searchHotels({
    name: 'Paris',
    country: 'France',
    searchQuery: 'Paris'
});

// Fetch multiple cities
const allHotels = await hotelAPIService.fetchMultipleCities(cities);
```

---

## 🛠️ Configuration Options

### API Mode Settings

```env
USE_API=true                                # Enable API mode
RAPIDAPI_KEY=your_key_here                  # Your RapidAPI key
RAPIDAPI_HOST=booking-com.p.rapidapi.com    # API endpoint
DELAY_MIN=1000                              # Rate limiting delay
DELAY_MAX=2000                              # Rate limiting delay
MAX_RETRIES=2                               # Retry failed requests
OUTPUT_DIR=data                             # Output directory
```

### Web Scraping Mode (Not Recommended)

```env
USE_API=false                               # Disable API mode
HEADLESS=true                               # Browser headless mode
USE_PROXY=true                              # Use proxy rotation
PROXY_URL=http://proxy:port                 # Proxy server
```

---

## 📈 Data Output

Both modes save data in the same format:

**hotels.json** - Complete dataset
```json
[
  {
    "hotel_id": "123456",
    "hotel_name": "Grand Hotel Paris",
    "city": "Paris",
    "country": "France",
    "address": "123 Champs-Élysées",
    "latitude": 48.8566,
    "longitude": 2.3522,
    "rating": 8.9,
    "review_count": 1250,
    "price": 250.00,
    "currency": "USD",
    "property_type": "Hotel",
    "image_url": "https://...",
    "amenities": ["Free WiFi", "Swimming Pool"],
    "scraped_at": "2026-01-05T12:00:00Z",
    "data_source": "API"
  }
]
```

**hotels.csv** - Spreadsheet format

---

## 🔍 Troubleshooting

### API Issues

**Error: "Invalid API Key"**
- Check your `RAPIDAPI_KEY` in `.env`
- Verify subscription on RapidAPI

**Error: "Rate Limit Exceeded"**
- Increase delays (`DELAY_MIN`, `DELAY_MAX`)
- Upgrade your API plan
- Reduce number of cities

**Error: "Destination not found"**
- City name might be incorrect
- Try different search query format

### Web Scraping Issues

**"Page blocked or CAPTCHA detected"**
- ⚠️ This is expected with web scraping
- Switch to API mode: `USE_API=true`
- Or use proxy rotation (expensive)

---

## 🎓 Best Practices

1. **Start Small**: Test with 5-10 cities first
2. **Monitor Usage**: Check API quota on RapidAPI dashboard
3. **Respect Rate Limits**: Don't reduce delays too much
4. **Cache Results**: Save data incrementally
5. **Handle Errors**: API can fail, always retry

---

## 📝 Notes

- Free RapidAPI tier: ~500 requests/month
- Each city search = 2 API calls (location + hotels)
- ~25 cities = 50 API calls
- For 42 cities, you need a paid plan or multiple API keys

---

## 🤝 Support

If you need help:
1. Check RapidAPI documentation
2. Review logs in `logs/` directory
3. Test with single city first
4. Verify `.env` configuration

---

## ⚡ Quick Command Reference

```bash
# Install dependencies
npm install

# Run with API mode
npm start

# Run specific region (edit index.js)
# const cities = getCitiesByRegion('EUROPE');

# Check logs
cat logs/app.log
```

---

**Remember**: API mode is always better than web scraping for production use! 🎯
