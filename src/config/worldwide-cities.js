/**
 * Worldwide Cities Configuration
 * Comprehensive list of cities for global hotel data collection
 * Organized by region for efficient scraping
 */

export const WORLDWIDE_CITIES = {
    // =========================================================================
    // EUROPE
    // =========================================================================
    EUROPE: [
        // Western Europe
        { name: 'Paris', country: 'France', region: 'europe', priority: 1 },
        { name: 'London', country: 'United Kingdom', region: 'europe', priority: 1 },
        { name: 'Amsterdam', country: 'Netherlands', region: 'europe', priority: 1 },
        { name: 'Berlin', country: 'Germany', region: 'europe', priority: 1 },
        { name: 'Munich', country: 'Germany', region: 'europe', priority: 2 },
        { name: 'Frankfurt', country: 'Germany', region: 'europe', priority: 2 },
        { name: 'Rome', country: 'Italy', region: 'europe', priority: 1 },
        { name: 'Milan', country: 'Italy', region: 'europe', priority: 2 },
        { name: 'Venice', country: 'Italy', region: 'europe', priority: 2 },
        { name: 'Florence', country: 'Italy', region: 'europe', priority: 2 },
        { name: 'Madrid', country: 'Spain', region: 'europe', priority: 1 },
        { name: 'Barcelona', country: 'Spain', region: 'europe', priority: 1 },
        { name: 'Seville', country: 'Spain', region: 'europe', priority: 3 },
        { name: 'Lisbon', country: 'Portugal', region: 'europe', priority: 1 },
        { name: 'Porto', country: 'Portugal', region: 'europe', priority: 3 },
        { name: 'Vienna', country: 'Austria', region: 'europe', priority: 1 },
        { name: 'Salzburg', country: 'Austria', region: 'europe', priority: 3 },
        { name: 'Prague', country: 'Czech Republic', region: 'europe', priority: 1 },
        { name: 'Brussels', country: 'Belgium', region: 'europe', priority: 2 },
        { name: 'Zurich', country: 'Switzerland', region: 'europe', priority: 2 },
        { name: 'Geneva', country: 'Switzerland', region: 'europe', priority: 2 },

        // Northern Europe
        { name: 'Stockholm', country: 'Sweden', region: 'europe', priority: 2 },
        { name: 'Copenhagen', country: 'Denmark', region: 'europe', priority: 2 },
        { name: 'Oslo', country: 'Norway', region: 'europe', priority: 2 },
        { name: 'Helsinki', country: 'Finland', region: 'europe', priority: 2 },
        { name: 'Dublin', country: 'Ireland', region: 'europe', priority: 2 },
        { name: 'Edinburgh', country: 'United Kingdom', region: 'europe', priority: 2 },
        { name: 'Manchester', country: 'United Kingdom', region: 'europe', priority: 2 },

        // Eastern Europe
        { name: 'Warsaw', country: 'Poland', region: 'europe', priority: 2 },
        { name: 'Krakow', country: 'Poland', region: 'europe', priority: 2 },
        { name: 'Budapest', country: 'Hungary', region: 'europe', priority: 1 },
        { name: 'Athens', country: 'Greece', region: 'europe', priority: 1 },
        { name: 'Santorini', country: 'Greece', region: 'europe', priority: 2 },
        { name: 'Istanbul', country: 'Turkey', region: 'europe', priority: 1 },
        { name: 'Moscow', country: 'Russia', region: 'europe', priority: 2 },
        { name: 'St Petersburg', country: 'Russia', region: 'europe', priority: 2 },
        { name: 'Bucharest', country: 'Romania', region: 'europe', priority: 2 },
        { name: 'Sofia', country: 'Bulgaria', region: 'europe', priority: 3 },
        { name: 'Zagreb', country: 'Croatia', region: 'europe', priority: 2 },
        { name: 'Dubrovnik', country: 'Croatia', region: 'europe', priority: 3 },
        { name: 'Belgrade', country: 'Serbia', region: 'europe', priority: 3 },
        { name: 'Bratislava', country: 'Slovakia', region: 'europe', priority: 3 },
        { name: 'Ljubljana', country: 'Slovenia', region: 'europe', priority: 3 },
        { name: 'Tallinn', country: 'Estonia', region: 'europe', priority: 3 },
        { name: 'Riga', country: 'Latvia', region: 'europe', priority: 3 },
        { name: 'Vilnius', country: 'Lithuania', region: 'europe', priority: 3 },
        { name: 'Reykjavik', country: 'Iceland', region: 'europe', priority: 2 },
        { name: 'Tirana', country: 'Albania', region: 'europe', priority: 3 },
        { name: 'Skopje', country: 'North Macedonia', region: 'europe', priority: 3 },
        { name: 'Sarajevo', country: 'Bosnia and Herzegovina', region: 'europe', priority: 3 },
        { name: 'Luxembourg City', country: 'Luxembourg', region: 'europe', priority: 3 },
        { name: 'Kiev', country: 'Ukraine', region: 'europe', priority: 3 },
        { name: 'Minsk', country: 'Belarus', region: 'europe', priority: 3 },
        { name: 'Chisinau', country: 'Moldova', region: 'europe', priority: 3 }
    ],

    // =========================================================================
    // NORTH AMERICA
    // =========================================================================
    NORTH_AMERICA: [
        // USA - Major Cities (100+ cities for comprehensive coverage)
        { name: 'New York', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'Los Angeles', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'Chicago', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'Houston', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'Phoenix', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'Philadelphia', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'San Antonio', country: 'United States', region: 'north-america', priority: 2 },
        { name: 'San Diego', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'Dallas', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'San Jose', country: 'United States', region: 'north-america', priority: 2 },
        { name: 'Austin', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'Jacksonville', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Fort Worth', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Columbus', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'San Francisco', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'Charlotte', country: 'United States', region: 'north-america', priority: 2 },
        { name: 'Indianapolis', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Seattle', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'Denver', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'Washington DC', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'Boston', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'Nashville', country: 'United States', region: 'north-america', priority: 2 },
        { name: 'Baltimore', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Oklahoma City', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Portland', country: 'United States', region: 'north-america', priority: 2 },
        { name: 'Las Vegas', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'Milwaukee', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Albuquerque', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Tucson', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Fresno', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Sacramento', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Mesa', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Kansas City', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Atlanta', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'Long Beach', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Omaha', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Raleigh', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Miami', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'Oakland', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Minneapolis', country: 'United States', region: 'north-america', priority: 2 },
        { name: 'Tulsa', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Cleveland', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Wichita', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Arlington', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'New Orleans', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'Tampa', country: 'United States', region: 'north-america', priority: 2 },
        { name: 'Honolulu', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'Orlando', country: 'United States', region: 'north-america', priority: 1 },
        { name: 'Anaheim', country: 'United States', region: 'north-america', priority: 2 },
        { name: 'St. Louis', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Cincinnati', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Pittsburgh', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Anchorage', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Savannah', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Charleston', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Salt Lake City', country: 'United States', region: 'north-america', priority: 2 },
        { name: 'Key West', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Napa Valley', country: 'United States', region: 'north-america', priority: 3 },
        { name: 'Aspen', country: 'United States', region: 'north-america', priority: 3 },

        // Canada (30+ cities)
        { name: 'Toronto', country: 'Canada', region: 'north-america', priority: 1 },
        { name: 'Montreal', country: 'Canada', region: 'north-america', priority: 1 },
        { name: 'Vancouver', country: 'Canada', region: 'north-america', priority: 1 },
        { name: 'Calgary', country: 'Canada', region: 'north-america', priority: 2 },
        { name: 'Edmonton', country: 'Canada', region: 'north-america', priority: 2 },
        { name: 'Ottawa', country: 'Canada', region: 'north-america', priority: 2 },
        { name: 'Winnipeg', country: 'Canada', region: 'north-america', priority: 3 },
        { name: 'Quebec City', country: 'Canada', region: 'north-america', priority: 2 },
        { name: 'Hamilton', country: 'Canada', region: 'north-america', priority: 3 },
        { name: 'Kitchener', country: 'Canada', region: 'north-america', priority: 3 },
        { name: 'London', country: 'Canada', region: 'north-america', priority: 3 },
        { name: 'Victoria', country: 'Canada', region: 'north-america', priority: 3 },
        { name: 'Halifax', country: 'Canada', region: 'north-america', priority: 3 },
        { name: 'Whistler', country: 'Canada', region: 'north-america', priority: 3 },
        { name: 'Niagara Falls', country: 'Canada', region: 'north-america', priority: 2 },

        // Mexico (30+ cities)
        { name: 'Mexico City', country: 'Mexico', region: 'north-america', priority: 1 },
        { name: 'Cancun', country: 'Mexico', region: 'north-america', priority: 1 },
        { name: 'Guadalajara', country: 'Mexico', region: 'north-america', priority: 2 },
        { name: 'Monterrey', country: 'Mexico', region: 'north-america', priority: 2 },
        { name: 'Tijuana', country: 'Mexico', region: 'north-america', priority: 3 },
        { name: 'Playa del Carmen', country: 'Mexico', region: 'north-america', priority: 1 },
        { name: 'Puerto Vallarta', country: 'Mexico', region: 'north-america', priority: 1 },
        { name: 'Los Cabos', country: 'Mexico', region: 'north-america', priority: 1 },
        { name: 'Tulum', country: 'Mexico', region: 'north-america', priority: 2 },
        { name: 'Mazatlan', country: 'Mexico', region: 'north-america', priority: 3 },
        { name: 'Acapulco', country: 'Mexico', region: 'north-america', priority: 3 },
        { name: 'Cozumel', country: 'Mexico', region: 'north-america', priority: 2 },
        { name: 'Oaxaca', country: 'Mexico', region: 'north-america', priority: 3 },
        { name: 'Merida', country: 'Mexico', region: 'north-america', priority: 3 },
        { name: 'Puebla', country: 'Mexico', region: 'north-america', priority: 3 },
        { name: 'San Miguel de Allende', country: 'Mexico', region: 'north-america', priority: 3 }
    ],

    // =========================================================================
    // CENTRAL AMERICA
    // =========================================================================
    CENTRAL_AMERICA: [
        { name: 'Panama City', country: 'Panama', region: 'central-america', priority: 2 },
        { name: 'San Jose', country: 'Costa Rica', region: 'central-america', priority: 2 },
        { name: 'Managua', country: 'Nicaragua', region: 'central-america', priority: 3 },
        { name: 'Tegucigalpa', country: 'Honduras', region: 'central-america', priority: 3 },
        { name: 'San Salvador', country: 'El Salvador', region: 'central-america', priority: 3 },
        { name: 'Guatemala City', country: 'Guatemala', region: 'central-america', priority: 3 },
        { name: 'Belize City', country: 'Belize', region: 'central-america', priority: 3 }
    ],

    // =========================================================================
    // ASIA
    // =========================================================================
    ASIA: [
        // East Asia
        { name: 'Tokyo', country: 'Japan', region: 'asia', priority: 1 },
        { name: 'Osaka', country: 'Japan', region: 'asia', priority: 2 },
        { name: 'Kyoto', country: 'Japan', region: 'asia', priority: 2 },
        { name: 'Nagoya', country: 'Japan', region: 'asia', priority: 3 },
        { name: 'Sapporo', country: 'Japan', region: 'asia', priority: 3 },
        { name: 'Seoul', country: 'South Korea', region: 'asia', priority: 1 },
        { name: 'Busan', country: 'South Korea', region: 'asia', priority: 2 },
        { name: 'Incheon', country: 'South Korea', region: 'asia', priority: 3 },
        { name: 'Hong Kong', country: 'Hong Kong', region: 'asia', priority: 1 },
        { name: 'Beijing', country: 'China', region: 'asia', priority: 1 },
        { name: 'Shanghai', country: 'China', region: 'asia', priority: 1 },
        { name: 'Shenzhen', country: 'China', region: 'asia', priority: 2 },
        { name: 'Guangzhou', country: 'China', region: 'asia', priority: 2 },
        { name: 'Chengdu', country: 'China', region: 'asia', priority: 3 },
        { name: 'Hangzhou', country: 'China', region: 'asia', priority: 3 },
        { name: 'Taipei', country: 'Taiwan', region: 'asia', priority: 2 },

        // Southeast Asia
        { name: 'Singapore', country: 'Singapore', region: 'asia', priority: 1 },
        { name: 'Bangkok', country: 'Thailand', region: 'asia', priority: 1 },
        { name: 'Phuket', country: 'Thailand', region: 'asia', priority: 1 },
        { name: 'Pattaya', country: 'Thailand', region: 'asia', priority: 2 },
        { name: 'Chiang Mai', country: 'Thailand', region: 'asia', priority: 2 },
        { name: 'Krabi', country: 'Thailand', region: 'asia', priority: 3 },
        { name: 'Bali', country: 'Indonesia', region: 'asia', priority: 1 },
        { name: 'Jakarta', country: 'Indonesia', region: 'asia', priority: 2 },
        { name: 'Surabaya', country: 'Indonesia', region: 'asia', priority: 3 },
        { name: 'Kuala Lumpur', country: 'Malaysia', region: 'asia', priority: 1 },
        { name: 'Penang', country: 'Malaysia', region: 'asia', priority: 3 },
        { name: 'Langkawi', country: 'Malaysia', region: 'asia', priority: 3 },
        { name: 'Ho Chi Minh City', country: 'Vietnam', region: 'asia', priority: 1 },
        { name: 'Hanoi', country: 'Vietnam', region: 'asia', priority: 2 },
        { name: 'Da Nang', country: 'Vietnam', region: 'asia', priority: 3 },
        { name: 'Manila', country: 'Philippines', region: 'asia', priority: 2 },
        { name: 'Cebu', country: 'Philippines', region: 'asia', priority: 3 },
        { name: 'Boracay', country: 'Philippines', region: 'asia', priority: 3 },
        { name: 'Phnom Penh', country: 'Cambodia', region: 'asia', priority: 3 },
        { name: 'Siem Reap', country: 'Cambodia', region: 'asia', priority: 3 },
        { name: 'Vientiane', country: 'Laos', region: 'asia', priority: 3 },
        { name: 'Yangon', country: 'Myanmar', region: 'asia', priority: 3 },

        // South Asia
        { name: 'Mumbai', country: 'India', region: 'asia', priority: 1 },
        { name: 'Delhi', country: 'India', region: 'asia', priority: 1 },
        { name: 'Bangalore', country: 'India', region: 'asia', priority: 2 },
        { name: 'Chennai', country: 'India', region: 'asia', priority: 2 },
        { name: 'Hyderabad', country: 'India', region: 'asia', priority: 2 },
        { name: 'Kolkata', country: 'India', region: 'asia', priority: 2 },
        { name: 'Goa', country: 'India', region: 'asia', priority: 2 },
        { name: 'Jaipur', country: 'India', region: 'asia', priority: 2 },
        { name: 'Agra', country: 'India', region: 'asia', priority: 3 },
        { name: 'Kathmandu', country: 'Nepal', region: 'asia', priority: 2 },
        { name: 'Dhaka', country: 'Bangladesh', region: 'asia', priority: 2 },
        { name: 'Chittagong', country: 'Bangladesh', region: 'asia', priority: 3 },
        { name: 'Colombo', country: 'Sri Lanka', region: 'asia', priority: 3 },
        { name: 'Malé', country: 'Maldives', region: 'asia', priority: 2 },

        // 🇵🇰 Pakistan

        // Major Cities (Priority 1)
        { name: 'Karachi', country: 'Pakistan', region: 'asia', priority: 1 },
        { name: 'Lahore', country: 'Pakistan', region: 'asia', priority: 1 },
        { name: 'Islamabad', country: 'Pakistan', region: 'asia', priority: 1 },

        // Big Cities / Popular (Priority 2)
        { name: 'Rawalpindi', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Faisalabad', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Multan', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Peshawar', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Gujranwala', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Sialkot', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Hyderabad', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Quetta', country: 'Pakistan', region: 'asia', priority: 2 },

        // Northern Areas / Hill Stations (Priority 2)
        { name: 'Murree', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Hunza', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Skardu', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Gilgit', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Naran', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Kaghan', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Swat', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Kalam', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Chitral', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Fairy Meadows', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Astore', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Shogran', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Neelum Valley', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Arang Kel', country: 'Pakistan', region: 'asia', priority: 2 },
        { name: 'Ratti Gali', country: 'Pakistan', region: 'asia', priority: 2 },

        // Historical / Cultural / Coastal (Priority 3)
        { name: 'Taxila', country: 'Pakistan', region: 'asia', priority: 3 },
        { name: 'Thatta', country: 'Pakistan', region: 'asia', priority: 3 },
        { name: 'Mohenjo-daro', country: 'Pakistan', region: 'asia', priority: 3 },
        { name: 'Bahawalpur', country: 'Pakistan', region: 'asia', priority: 3 },
        { name: 'Derawar Fort', country: 'Pakistan', region: 'asia', priority: 3 },
        { name: 'Makran', country: 'Pakistan', region: 'asia', priority: 3 },
        { name: 'Gwadar', country: 'Pakistan', region: 'asia', priority: 3 },
        { name: 'Ormara', country: 'Pakistan', region: 'asia', priority: 3 },
        { name: 'Pasni', country: 'Pakistan', region: 'asia', priority: 3 },

        // Religious / Shrines (Priority 3)
        { name: 'Nankana Sahib', country: 'Pakistan', region: 'asia', priority: 3 },
        { name: 'Kartarpur', country: 'Pakistan', region: 'asia', priority: 3 },
        { name: 'Sehwan Sharif', country: 'Pakistan', region: 'asia', priority: 3 },



        // Middle East
        { name: 'Dubai', country: 'United Arab Emirates', region: 'asia', priority: 1 },
        { name: 'Abu Dhabi', country: 'United Arab Emirates', region: 'asia', priority: 2 },
        { name: 'Sharjah', country: 'United Arab Emirates', region: 'asia', priority: 3 },
        { name: 'Doha', country: 'Qatar', region: 'asia', priority: 2 },
        { name: 'Riyadh', country: 'Saudi Arabia', region: 'asia', priority: 1 },
        { name: 'Jeddah', country: 'Saudi Arabia', region: 'asia', priority: 2 },
        { name: 'Mecca', country: 'Saudi Arabia', region: 'asia', priority: 1 },
        { name: 'Medina', country: 'Saudi Arabia', region: 'asia', priority: 1 },
        { name: 'Kuwait City', country: 'Kuwait', region: 'asia', priority: 2 },
        { name: 'Manama', country: 'Bahrain', region: 'asia', priority: 2 },
        { name: 'Muscat', country: 'Oman', region: 'asia', priority: 2 },
        { name: 'Tehran', country: 'Iran', region: 'asia', priority: 2 },
        { name: 'Tel Aviv', country: 'Israel', region: 'asia', priority: 2 },
        { name: 'Jerusalem', country: 'Israel', region: 'asia', priority: 2 },
        { name: 'Amman', country: 'Jordan', region: 'asia', priority: 2 },
        { name: 'Petra', country: 'Jordan', region: 'asia', priority: 3 },
        { name: 'Beirut', country: 'Lebanon', region: 'asia', priority: 3 },
        { name: 'Baghdad', country: 'Iraq', region: 'asia', priority: 3 },
        { name: 'Damascus', country: 'Syria', region: 'asia', priority: 3 },
        { name: 'Sana\'a', country: 'Yemen', region: 'asia', priority: 3 },
        { name: 'Kabul', country: 'Afghanistan', region: 'asia', priority: 3 },
        { name: 'Yerevan', country: 'Armenia', region: 'asia', priority: 3 },
        { name: 'Baku', country: 'Azerbaijan', region: 'asia', priority: 3 },
        { name: 'Tbilisi', country: 'Georgia', region: 'asia', priority: 3 },
        { name: 'Ulaanbaatar', country: 'Mongolia', region: 'asia', priority: 3 },
        { name: 'Thimphu', country: 'Bhutan', region: 'asia', priority: 3 },
        { name: 'Bandar Seri Begawan', country: 'Brunei', region: 'asia', priority: 3 },
        { name: 'Dili', country: 'Timor-Leste', region: 'asia', priority: 3 }
    ]

    ,

    // =========================================================================
    // OCEANIA
    // =========================================================================
    OCEANIA: [
        // Australia
        { name: 'Sydney', country: 'Australia', region: 'oceania', priority: 1 },
        { name: 'Melbourne', country: 'Australia', region: 'oceania', priority: 1 },
        { name: 'Brisbane', country: 'Australia', region: 'oceania', priority: 2 },
        { name: 'Perth', country: 'Australia', region: 'oceania', priority: 2 },
        { name: 'Gold Coast', country: 'Australia', region: 'oceania', priority: 2 },
        { name: 'Cairns', country: 'Australia', region: 'oceania', priority: 3 },
        { name: 'Adelaide', country: 'Australia', region: 'oceania', priority: 3 },

        // New Zealand
        { name: 'Auckland', country: 'New Zealand', region: 'oceania', priority: 1 },
        { name: 'Queenstown', country: 'New Zealand', region: 'oceania', priority: 2 },
        { name: 'Wellington', country: 'New Zealand', region: 'oceania', priority: 3 },
        { name: 'Christchurch', country: 'New Zealand', region: 'oceania', priority: 3 },

        // Pacific Islands
        { name: 'Suva', country: 'Fiji', region: 'oceania', priority: 3 },
        { name: 'Nadi', country: 'Fiji', region: 'oceania', priority: 3 },
        { name: 'Port Moresby', country: 'Papua New Guinea', region: 'oceania', priority: 3 },
        { name: 'Apia', country: 'Samoa', region: 'oceania', priority: 3 },
        { name: 'Nuku\'alofa', country: 'Tonga', region: 'oceania', priority: 3 },
        { name: 'Port Vila', country: 'Vanuatu', region: 'oceania', priority: 3 },
        { name: 'Honiara', country: 'Solomon Islands', region: 'oceania', priority: 3 },
        { name: 'Noumea', country: 'New Caledonia', region: 'oceania', priority: 3 },
        { name: 'Papeete', country: 'French Polynesia', region: 'oceania', priority: 3 }
    ],

    // =========================================================================
    // SOUTH AMERICA
    // =========================================================================
    SOUTH_AMERICA: [
        // Brazil
        { name: 'Sao Paulo', country: 'Brazil', region: 'south-america', priority: 1 },
        { name: 'Rio de Janeiro', country: 'Brazil', region: 'south-america', priority: 1 },
        { name: 'Brasilia', country: 'Brazil', region: 'south-america', priority: 2 },
        { name: 'Salvador', country: 'Brazil', region: 'south-america', priority: 3 },
        { name: 'Fortaleza', country: 'Brazil', region: 'south-america', priority: 3 },

        // Argentina
        { name: 'Buenos Aires', country: 'Argentina', region: 'south-america', priority: 1 },
        { name: 'Cordoba', country: 'Argentina', region: 'south-america', priority: 3 },
        { name: 'Mendoza', country: 'Argentina', region: 'south-america', priority: 3 },

        // Colombia
        { name: 'Bogota', country: 'Colombia', region: 'south-america', priority: 1 },
        { name: 'Cartagena', country: 'Colombia', region: 'south-america', priority: 2 },
        { name: 'Medellin', country: 'Colombia', region: 'south-america', priority: 2 },

        // Peru
        { name: 'Lima', country: 'Peru', region: 'south-america', priority: 1 },
        { name: 'Cusco', country: 'Peru', region: 'south-america', priority: 2 },

        // Chile
        { name: 'Santiago', country: 'Chile', region: 'south-america', priority: 1 },
        { name: 'Valparaiso', country: 'Chile', region: 'south-america', priority: 3 },

        // Other South American Countries
        { name: 'Quito', country: 'Ecuador', region: 'south-america', priority: 2 },
        { name: 'Guayaquil', country: 'Ecuador', region: 'south-america', priority: 3 },
        { name: 'Montevideo', country: 'Uruguay', region: 'south-america', priority: 3 },
        { name: 'Asuncion', country: 'Paraguay', region: 'south-america', priority: 3 },
        { name: 'La Paz', country: 'Bolivia', region: 'south-america', priority: 3 },
        { name: 'Santa Cruz', country: 'Bolivia', region: 'south-america', priority: 3 },
        { name: 'Caracas', country: 'Venezuela', region: 'south-america', priority: 3 },
        { name: 'Georgetown', country: 'Guyana', region: 'south-america', priority: 3 },
        { name: 'Paramaribo', country: 'Suriname', region: 'south-america', priority: 3 },
        { name: 'Cayenne', country: 'French Guiana', region: 'south-america', priority: 3 }
    ],

    // =========================================================================
    // AFRICA
    // =========================================================================
    AFRICA: [
        // North Africa
        { name: 'Cairo', country: 'Egypt', region: 'africa', priority: 1 },
        { name: 'Hurghada', country: 'Egypt', region: 'africa', priority: 2 },
        { name: 'Sharm El Sheikh', country: 'Egypt', region: 'africa', priority: 2 },
        { name: 'Marrakech', country: 'Morocco', region: 'africa', priority: 1 },
        { name: 'Casablanca', country: 'Morocco', region: 'africa', priority: 2 },
        { name: 'Tunis', country: 'Tunisia', region: 'africa', priority: 2 },
        { name: 'Algiers', country: 'Algeria', region: 'africa', priority: 3 },
        { name: 'Tripoli', country: 'Libya', region: 'africa', priority: 3 },

        // West Africa
        { name: 'Lagos', country: 'Nigeria', region: 'africa', priority: 1 },
        { name: 'Abuja', country: 'Nigeria', region: 'africa', priority: 2 },
        { name: 'Accra', country: 'Ghana', region: 'africa', priority: 2 },
        { name: 'Dakar', country: 'Senegal', region: 'africa', priority: 3 },
        { name: 'Abidjan', country: 'Ivory Coast', region: 'africa', priority: 3 },
        { name: 'Bamako', country: 'Mali', region: 'africa', priority: 3 },

        // East Africa
        { name: 'Nairobi', country: 'Kenya', region: 'africa', priority: 1 },
        { name: 'Dar es Salaam', country: 'Tanzania', region: 'africa', priority: 2 },
        { name: 'Zanzibar', country: 'Tanzania', region: 'africa', priority: 2 },
        { name: 'Addis Ababa', country: 'Ethiopia', region: 'africa', priority: 2 },
        { name: 'Kampala', country: 'Uganda', region: 'africa', priority: 3 },
        { name: 'Kigali', country: 'Rwanda', region: 'africa', priority: 3 },

        // Southern Africa
        { name: 'Cape Town', country: 'South Africa', region: 'africa', priority: 1 },
        { name: 'Johannesburg', country: 'South Africa', region: 'africa', priority: 2 },
        { name: 'Durban', country: 'South Africa', region: 'africa', priority: 3 },
        { name: 'Windhoek', country: 'Namibia', region: 'africa', priority: 3 },
        { name: 'Gaborone', country: 'Botswana', region: 'africa', priority: 3 },
        { name: 'Harare', country: 'Zimbabwe', region: 'africa', priority: 3 },
        { name: 'Lusaka', country: 'Zambia', region: 'africa', priority: 3 },
        { name: 'Maputo', country: 'Mozambique', region: 'africa', priority: 3 },
        { name: 'Luanda', country: 'Angola', region: 'africa', priority: 3 },

        // Islands
        { name: 'Mauritius', country: 'Mauritius', region: 'africa', priority: 2 },
        { name: 'Seychelles', country: 'Seychelles', region: 'africa', priority: 3 },
        { name: 'Antananarivo', country: 'Madagascar', region: 'africa', priority: 3 }
    ],

    // =========================================================================
    // CARIBBEAN
    // =========================================================================
    CARIBBEAN: [
        { name: 'Punta Cana', country: 'Dominican Republic', region: 'caribbean', priority: 1 },
        { name: 'Santo Domingo', country: 'Dominican Republic', region: 'caribbean', priority: 2 },
        { name: 'Nassau', country: 'Bahamas', region: 'caribbean', priority: 2 },
        { name: 'San Juan', country: 'Puerto Rico', region: 'caribbean', priority: 2 },
        { name: 'Havana', country: 'Cuba', region: 'caribbean', priority: 2 },
        { name: 'Montego Bay', country: 'Jamaica', region: 'caribbean', priority: 2 },
        { name: 'Kingston', country: 'Jamaica', region: 'caribbean', priority: 3 },
        { name: 'Oranjestad', country: 'Aruba', region: 'caribbean', priority: 2 },
        { name: 'Bridgetown', country: 'Barbados', region: 'caribbean', priority: 3 },
        { name: 'Port of Spain', country: 'Trinidad and Tobago', region: 'caribbean', priority: 3 },
        { name: 'Willemstad', country: 'Curacao', region: 'caribbean', priority: 3 },
        { name: 'Castries', country: 'Saint Lucia', region: 'caribbean', priority: 3 },
        { name: 'St. George\'s', country: 'Grenada', region: 'caribbean', priority: 3 },
        { name: 'Basseterre', country: 'Saint Kitts and Nevis', region: 'caribbean', priority: 3 },
        { name: 'Fort-de-France', country: 'Martinique', region: 'caribbean', priority: 3 },
        { name: 'Pointe-à-Pitre', country: 'Guadeloupe', region: 'caribbean', priority: 3 },
        { name: 'George Town', country: 'Cayman Islands', region: 'caribbean', priority: 3 }
    ]
};

/**
 * Get all cities worldwide
 */
export function getAllWorldwideCities() {
    const allCities = [];
    for (const region of Object.values(WORLDWIDE_CITIES)) {
        allCities.push(...region);
    }
    return allCities;
}

// Alias for backward compatibility
export const getAllCities = getAllWorldwideCities;

/**
 * Get cities by region
 */
export function getCitiesByRegion(regionName) {
    return WORLDWIDE_CITIES[regionName] || [];
}

/**
 * Get cities by priority (1 = highest priority)
 */
export function getCitiesByPriority(priority) {
    const allCities = getAllWorldwideCities();
    return allCities.filter(city => city.priority === priority);
}

/**
 * Get high-priority cities (priority 1)
 */
export function getHighPriorityCities() {
    return getCitiesByPriority(1);
}

/**
 * Get all region names
 */
export function getRegionNames() {
    return Object.keys(WORLDWIDE_CITIES);
}

/**
 * Get cities count by region
 */
export function getCitiesCountByRegion() {
    const counts = {};
    for (const [region, cities] of Object.entries(WORLDWIDE_CITIES)) {
        counts[region] = cities.length;
    }
    return counts;
}

export default WORLDWIDE_CITIES;
