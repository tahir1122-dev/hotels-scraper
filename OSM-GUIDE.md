# 🌍 OpenStreetMap (OSM) Integration - 100% FREE!

## ✅ What You Get

Your hotel data collector now uses **OpenStreetMap Overpass API** - completely free, no API key required!

---

## 🎯 Quick Start

### 1. It's Already Configured!

The `.env` file is already set to use OSM:
```env
DATA_SOURCE=osm
```

### 2. Test It
```bash
npm run test-osm
```

### 3. Run Full Collection
```bash
npm start
```

That's it! No signup, no API key, no cost.

---

## 📊 What Data Do You Get?

### ✅ Available from OSM:
- ✅ **Hotel name**
- ✅ **Exact coordinates** (latitude/longitude)
- ✅ **Address** (street, city, postcode)
- ✅ **Contact info** (phone, website, email)
- ✅ **Amenities** (WiFi, parking, pool, etc.)
- ✅ **Property type** (hotel, motel, hostel, etc.)
- ✅ **Accessibility** (wheelchair access)
- ✅ **Star rating** (if tagged in OSM)
- ✅ **Brand/Chain** info
- ✅ **Room/bed count** (if available)

### ❌ NOT Available from OSM:
- ❌ Prices
- ❌ Availability
- ❌ User reviews/ratings
- ❌ Booking links
- ❌ Real-time data

---

## 🆚 Comparison: OSM vs Other Sources

| Feature | OSM (Free) | RapidAPI | Web Scraping |
|---------|------------|----------|--------------|
| **Cost** | 💚 $0/month | 💰 $10-50/month | 💰 Proxy costs |
| **API Key** | ✅ None needed | ⚠️ Required | ❌ N/A |
| **Rate Limits** | ✅ Very high | ⚠️ 500-5000/mo | ❌ Gets blocked |
| **Reliability** | ✅ 99%+ | ✅ 99%+ | ❌ <20% |
| **Prices** | ❌ No | ✅ Yes | ✅ Yes (when works) |
| **Location Data** | ✅ Best | ✅ Good | ⚠️ Limited |
| **Contact Info** | ✅ Yes | ⚠️ Limited | ⚠️ Limited |
| **Amenities** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Legal Issues** | ✅ None | ✅ None | ⚠️ Possible |

---

## 🎓 Use Cases

### ✅ Perfect For:
- 📍 **Hotel location mapping**
- 📊 **Market research** (where hotels are concentrated)
- 🗺️ **Geographic analysis**
- 📱 **Building a hotel locator app**
- 📈 **Industry analysis** (hotel distribution by region)
- 🏢 **Real estate research**
- 📇 **Contact database building**

### ⚠️ NOT Ideal For:
- 💰 Price comparison tools
- 📅 Booking/availability systems
- ⭐ Review aggregation
- 💳 Travel booking platforms

---

## 🔧 How It Works

### The Overpass API

OSM uses the Overpass API to query OpenStreetMap data:

```javascript
// Example query for Paris hotels
[out:json];
area["name"="Paris"]->.searchArea;
(
  node["tourism"="hotel"](area.searchArea);
  way["tourism"="hotel"](area.searchArea);
  relation["tourism"="hotel"](area.searchArea);
);
out center tags;
```

### Available Endpoints (Free)
1. `https://overpass-api.de/api/interpreter` (Main)
2. `https://overpass.private.coffee/api/interpreter` (Mirror)
3. `https://overpass.kumi.systems/api/interpreter` (Mirror)

The service automatically rotates between endpoints if one fails.

---

## 📋 Sample Output

```json
{
  "hotel_id": "osm_way_123456",
  "hotel_name": "Grand Hotel Paris",
  "city": "Paris",
  "country": "France",
  "address": "123 Rue de Rivoli, Paris, 75001",
  "latitude": 48.8566,
  "longitude": 2.3522,
  "phone": "+33 1 23 45 67 89",
  "website": "https://grandhotel.com",
  "email": "contact@grandhotel.com",
  "property_type": "Hotel",
  "hotel_class": 4,
  "amenities": ["Free WiFi", "Parking", "Restaurant", "Bar"],
  "wheelchair_accessible": true,
  "internet_access": "wlan",
  "rooms": 150,
  "brand": "Accor Hotels",
  "osm_url": "https://www.openstreetmap.org/way/123456",
  "scraped_at": "2026-01-05T19:00:00Z",
  "data_source": "OpenStreetMap"
}
```

---

## 💡 Tips for Best Results

### 1. **City Names**
OSM sometimes finds cities with same names in different countries:
- "Paris" might return Paris, France AND Paris, Texas
- Use country name for disambiguation (already configured)

### 2. **Data Completeness**
OSM quality varies by region:
- ✅ **Best**: Western Europe, USA, Japan
- ✅ **Good**: Major cities worldwide
- ⚠️ **Variable**: Rural areas, developing countries

### 3. **Rate Limiting**
While OSM is very generous, be respectful:
- Current delays: 1-2 seconds between requests
- Don't make thousands of requests per minute
- The service auto-rotates endpoints if needed

### 4. **Data Updates**
OSM is community-maintained:
- Data is usually very current
- New hotels appear as community adds them
- You can contribute to OSM yourself!

---

## 🚀 Commands

```bash
# Test OSM integration
npm run test-osm

# Run with OSM (default)
npm start

# Explicitly use OSM
npm run osm

# Switch to RapidAPI (needs key)
npm run api

# Switch to web scraping (not recommended)
npm run scrape
```

---

## 📖 Example: Combine OSM with Other Sources

**Strategy**: Use OSM for base data, enrich with other sources

```
1. Get hotel locations from OSM (FREE)
   ↓
2. Use coordinates to look up prices elsewhere
   ↓
3. Final dataset with location + pricing
```

This way you minimize API costs while getting complete data.

---

## ❓ FAQ

**Q: Is this really free?**
A: Yes! OpenStreetMap and Overpass API are 100% free, no signup needed.

**Q: What are the rate limits?**
A: Very generous. Typical limit is ~1 million elements per query. You won't hit this.

**Q: Can I use this commercially?**
A: Yes! OSM data is open (ODbL license). Just credit OpenStreetMap.

**Q: Why don't I get prices?**
A: OSM is a geographic database, not a booking platform. It doesn't track prices or availability.

**Q: What if a city isn't found?**
A: OSM might use different name. Try alternatives or coordinates.

**Q: Can I add missing hotels?**
A: Yes! You can contribute to OpenStreetMap at openstreetmap.org

**Q: Is this legal?**
A: Completely legal. OSM data is open and free to use.

---

## 🌟 Benefits Summary

### Why OSM is Perfect for This Project:

1. ✅ **$0 Cost** - Forever free
2. ✅ **No Signup** - Start immediately
3. ✅ **No API Key** - No configuration needed
4. ✅ **High Quality** - Community-verified data
5. ✅ **Global Coverage** - Works everywhere
6. ✅ **Exact Coordinates** - Perfect for mapping
7. ✅ **Rich Metadata** - Amenities, contact info
8. ✅ **Legal** - Open data license
9. ✅ **Reliable** - 99%+ uptime
10. ✅ **Fast** - Direct HTTP requests

---

## 📚 Additional Resources

- **OSM Main Site**: https://www.openstreetmap.org
- **Overpass API**: https://overpass-api.de/
- **Overpass Turbo** (Query Builder): https://overpass-turbo.eu/
- **OSM Wiki**: https://wiki.openstreetmap.org/
- **OSM Tag Info**: https://taginfo.openstreetmap.org/

---

## 🎯 Next Steps

1. **Run test**: `npm run test-osm`
2. **Verify output**: Check sample data
3. **Run full collection**: `npm start`
4. **Check results**: Look in `data/` folder

---

**You're all set! Enjoy unlimited, free hotel data collection! 🎉**
