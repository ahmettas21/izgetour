// Airport & City data for autocomplete
// IATA codes + city names (IATA standard)

export interface Airport {
  iata: string;
  city: string;
  cityNative: string; // native name for search
  country: string;
  countryCode: string;
  name: string;
}

export const AIRPORTS: Airport[] = [
  // Turkey
  { iata: 'IST', city: 'Istanbul', cityNative: 'İstanbul', country: 'Turkey', countryCode: 'TR', name: 'Istanbul Airport' },
  { iata: 'SAW', city: 'Istanbul', cityNative: 'İstanbul', country: 'Turkey', countryCode: 'TR', name: 'Sabiha Gokcen Airport' },
  { iata: 'ESB', city: 'Ankara', cityNative: 'Ankara', country: 'Turkey', countryCode: 'TR', name: 'Esenboga Airport' },
  { iata: 'ADB', city: 'Izmir', cityNative: 'İzmir', country: 'Turkey', countryCode: 'TR', name: 'Adnan Menderes Airport' },
  { iata: 'AYT', city: 'Antalya', cityNative: 'Antalya', country: 'Turkey', countryCode: 'TR', name: 'Antalya Airport' },
  { iata: 'BJV', city: 'Bodrum', cityNative: 'Bodrum', country: 'Turkey', countryCode: 'TR', name: 'Milas-Bodrum Airport' },
  { iata: 'DLM', city: 'Dalaman', cityNative: 'Dalaman', country: 'Turkey', countryCode: 'TR', name: 'Dalaman Airport' },
  { iata: 'TZX', city: 'Trabzon', cityNative: 'Trabzon', country: 'Turkey', countryCode: 'TR', name: 'Trabzon Airport' },
  // Adana: eski Şakirpaşa (ADA) kapatıldı → aktif havalimanı Çukurova (COV).
  // Skiplagged yalnızca COV'u indeksliyor; ADA 0 döner. Arama uyumu için
  // cityNative'e "Adana Şakirpaşa" da eklendi (ADA->COV alias etkisi).
  { iata: 'COV', city: 'Adana', cityNative: 'Adana Şakirpaşa', country: 'Turkey', countryCode: 'TR', name: 'Çukurova Airport' },
  { iata: 'ASR', city: 'Kayseri', cityNative: 'Kayseri', country: 'Turkey', countryCode: 'TR', name: 'Erciyes Airport' },
  // Europe
  { iata: 'LHR', city: 'London', cityNative: 'Londra', country: 'United Kingdom', countryCode: 'GB', name: 'Heathrow Airport' },
  { iata: 'LGW', city: 'London', cityNative: 'Londra', country: 'United Kingdom', countryCode: 'GB', name: 'Gatwick Airport' },
  { iata: 'CDG', city: 'Paris', cityNative: 'Paris', country: 'France', countryCode: 'FR', name: 'Charles de Gaulle' },
  { iata: 'ORY', city: 'Paris', cityNative: 'Paris', country: 'France', countryCode: 'FR', name: 'Orly Airport' },
  { iata: 'FRA', city: 'Frankfurt', cityNative: 'Frankfurt', country: 'Germany', countryCode: 'DE', name: 'Frankfurt Airport' },
  { iata: 'MUC', city: 'Munich', cityNative: 'Münih', country: 'Germany', countryCode: 'DE', name: 'Munich Airport' },
  { iata: 'BER', city: 'Berlin', cityNative: 'Berlin', country: 'Germany', countryCode: 'DE', name: 'Berlin Brandenburg' },
  { iata: 'AMS', city: 'Amsterdam', cityNative: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', name: 'Schiphol Airport' },
  { iata: 'BCN', city: 'Barcelona', cityNative: 'Barcelona', country: 'Spain', countryCode: 'ES', name: 'Barcelona El Prat' },
  { iata: 'MAD', city: 'Madrid', cityNative: 'Madrid', country: 'Spain', countryCode: 'ES', name: 'Barajas Airport' },
  { iata: 'FCO', city: 'Rome', cityNative: 'Roma', country: 'Italy', countryCode: 'IT', name: 'Fiumicino Airport' },
  { iata: 'MXP', city: 'Milan', cityNative: 'Milano', country: 'Italy', countryCode: 'IT', name: 'Malpensa Airport' },
  { iata: 'VIE', city: 'Vienna', cityNative: 'Viyana', country: 'Austria', countryCode: 'AT', name: 'Vienna Airport' },
  { iata: 'ZRH', city: 'Zurich', cityNative: 'Zürih', country: 'Switzerland', countryCode: 'CH', name: 'Zurich Airport' },
  { iata: 'GVA', city: 'Geneva', cityNative: 'Cenevre', country: 'Switzerland', countryCode: 'CH', name: 'Geneva Airport' },
  { iata: 'CPH', city: 'Copenhagen', cityNative: 'Kopenhag', country: 'Denmark', countryCode: 'DK', name: 'Copenhagen Airport' },
  { iata: 'OSL', city: 'Oslo', cityNative: 'Oslo', country: 'Norway', countryCode: 'NO', name: 'Oslo Gardermoen' },
  { iata: 'ARN', city: 'Stockholm', cityNative: 'Stokholm', country: 'Sweden', countryCode: 'SE', name: 'Arlanda Airport' },
  { iata: 'HEL', city: 'Helsinki', cityNative: 'Helsinki', country: 'Finland', countryCode: 'FI', name: 'Helsinki Airport' },
  { iata: 'WAW', city: 'Warsaw', cityNative: 'Varşova', country: 'Poland', countryCode: 'PL', name: 'Warsaw Chopin' },
  { iata: 'PRG', city: 'Prague', cityNative: 'Prag', country: 'Czech Republic', countryCode: 'CZ', name: 'Vaclava Havela' },
  { iata: 'BUD', city: 'Budapest', cityNative: 'Budapeşte', country: 'Hungary', countryCode: 'HU', name: 'Budapest Airport' },
  { iata: 'ATH', city: 'Athens', cityNative: 'Atina', country: 'Greece', countryCode: 'GR', name: 'Athens Airport' },
  { iata: 'LIS', city: 'Lisbon', cityNative: 'Lizbon', country: 'Portugal', countryCode: 'PT', name: 'Lisbon Airport' },
  { iata: 'OPO', city: 'Porto', cityNative: 'Porto', country: 'Portugal', countryCode: 'PT', name: 'Porto Airport' },
  // Middle East
  { iata: 'DXB', city: 'Dubai', cityNative: 'Dubai', country: 'UAE', countryCode: 'AE', name: 'Dubai International' },
  { iata: 'AUH', city: 'Abu Dhabi', cityNative: 'Abu Dhabi', country: 'UAE', countryCode: 'AE', name: 'Abu Dhabi International' },
  { iata: 'DOH', city: 'Doha', cityNative: 'Doha', country: 'Qatar', countryCode: 'QA', name: 'Hamad International' },
  { iata: 'CAI', city: 'Cairo', cityNative: 'Kahire', country: 'Egypt', countryCode: 'EG', name: 'Cairo International' },
  { iata: 'JED', city: 'Jeddah', cityNative: 'Cidde', country: 'Saudi Arabia', countryCode: 'SA', name: 'King Abdulaziz' },
  { iata: 'RUH', city: 'Riyadh', cityNative: 'Riyad', country: 'Saudi Arabia', countryCode: 'SA', name: 'King Khaled' },
  { iata: 'AMM', city: 'Amman', cityNative: 'Amman', country: 'Jordan', countryCode: 'JO', name: 'Queen Alia Airport' },
  { iata: 'BEY', city: 'Beirut', cityNative: 'Beyrut', country: 'Lebanon', countryCode: 'LB', name: 'Beirut Airport' },
  // Americas
  { iata: 'JFK', city: 'New York', cityNative: 'New York', country: 'USA', countryCode: 'US', name: 'John F. Kennedy' },
  { iata: 'EWR', city: 'New York', cityNative: 'New York', country: 'USA', countryCode: 'US', name: 'Newark Liberty' },
  { iata: 'LAX', city: 'Los Angeles', cityNative: 'Los Angeles', country: 'USA', countryCode: 'US', name: 'Los Angeles Intl' },
  { iata: 'ORD', city: 'Chicago', cityNative: 'Chicago', country: 'USA', countryCode: 'US', name: "O'Hare International" },
  { iata: 'MIA', city: 'Miami', cityNative: 'Miami', country: 'USA', countryCode: 'US', name: 'Miami International' },
  { iata: 'SFO', city: 'San Francisco', cityNative: 'San Francisco', country: 'USA', countryCode: 'US', name: 'San Francisco Intl' },
  { iata: 'BOS', city: 'Boston', cityNative: 'Boston', country: 'USA', countryCode: 'US', name: 'Logan International' },
  { iata: 'YYZ', city: 'Toronto', cityNative: 'Toronto', country: 'Canada', countryCode: 'CA', name: 'Pearson International' },
  { iata: 'YVR', city: 'Vancouver', cityNative: 'Vancouver', country: 'Canada', countryCode: 'CA', name: 'Vancouver International' },
  { iata: 'MEX', city: 'Mexico City', cityNative: 'Mexico City', country: 'Mexico', countryCode: 'MX', name: 'Benito Juarez' },
  { iata: 'GRU', city: 'Sao Paulo', cityNative: 'Sao Paulo', country: 'Brazil', countryCode: 'BR', name: 'Guarulhos International' },
  { iata: 'EZE', city: 'Buenos Aires', cityNative: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', name: 'Ministro Pistarini' },
  // Asia
  { iata: 'BKK', city: 'Bangkok', cityNative: 'Bangkok', country: 'Thailand', countryCode: 'TH', name: 'Suvarnabhumi Airport' },
  { iata: 'DMK', city: 'Bangkok', cityNative: 'Bangkok', country: 'Thailand', countryCode: 'TH', name: 'Don Mueang Airport' },
  { iata: 'SIN', city: 'Singapore', cityNative: 'Singapur', country: 'Singapore', countryCode: 'SG', name: 'Changi Airport' },
  { iata: 'HKG', city: 'Hong Kong', cityNative: 'Hong Kong', country: 'Hong Kong', countryCode: 'HK', name: 'Hong Kong International' },
  { iata: 'ICN', city: 'Seoul', cityNative: 'Seul', country: 'South Korea', countryCode: 'KR', name: 'Incheon International' },
  { iata: 'NRT', city: 'Tokyo', cityNative: 'Tokyo', country: 'Japan', countryCode: 'JP', name: 'Narita International' },
  { iata: 'HND', city: 'Tokyo', cityNative: 'Tokyo', country: 'Japan', countryCode: 'JP', name: 'Haneda Airport' },
  { iata: 'PEK', city: 'Beijing', cityNative: 'Pekin', country: 'China', countryCode: 'CN', name: 'Beijing Capital' },
  { iata: 'PVG', city: 'Shanghai', cityNative: 'Şangay', country: 'China', countryCode: 'CN', name: 'Pudong International' },
  { iata: 'DEL', city: 'New Delhi', cityNative: 'Yeni Delhi', country: 'India', countryCode: 'IN', name: 'Indira Gandhi Airport' },
  { iata: 'BOM', city: 'Mumbai', cityNative: 'Mumbai', country: 'India', countryCode: 'IN', name: 'Chhatrapati Shivaji' },
  { iata: 'KUL', city: 'Kuala Lumpur', cityNative: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', name: 'KLIA Airport' },
  { iata: 'CGK', city: 'Jakarta', cityNative: 'Cakarta', country: 'Indonesia', countryCode: 'ID', name: 'Soekarno-Hatta Airport' },
  { iata: 'MNL', city: 'Manila', cityNative: 'Manila', country: 'Philippines', countryCode: 'PH', name: 'Ninoy Aquino Airport' },
  { iata: 'TPE', city: 'Taipei', cityNative: 'Taipei', country: 'Taiwan', countryCode: 'TW', name: 'Taiwan Taoyuan' },
  // Oceania
  { iata: 'SYD', city: 'Sydney', cityNative: 'Sidney', country: 'Australia', countryCode: 'AU', name: 'Sydney Kingsford Smith' },
  { iata: 'MEL', city: 'Melbourne', cityNative: 'Melbourne', country: 'Australia', countryCode: 'AU', name: 'Melbourne Airport' },
  { iata: 'AKL', city: 'Auckland', cityNative: 'Auckland', country: 'New Zealand', countryCode: 'NZ', name: 'Auckland Airport' },
  // Africa
  { iata: 'CPT', city: 'Cape Town', cityNative: 'Cape Town', country: 'South Africa', countryCode: 'ZA', name: 'Cape Town Airport' },
  { iata: 'JNB', city: 'Johannesburg', cityNative: 'Johannesburg', country: 'South Africa', countryCode: 'ZA', name: 'OR Tambo International' },
  { iata: 'CMN', city: 'Casablanca', cityNative: 'Kazablanka', country: 'Morocco', countryCode: 'MA', name: 'Mohammed V Airport' },
  { iata: 'NBO', city: 'Nairobi', cityNative: 'Nairobi', country: 'Kenya', countryCode: 'KE', name: 'Jomo Kenyatta Airport' },
];

export const POPULAR_ROUTES = [
  { from: 'IST', to: 'LHR', label: 'İstanbul → Londra' },
  { from: 'IST', to: 'DXB', label: 'İstanbul → Dubai' },
  { from: 'IST', to: 'CDG', label: 'İstanbul → Paris' },
  { from: 'ESB', to: 'BER', label: 'Ankara → Berlin' },
  { from: 'IST', to: 'JFK', label: 'İstanbul → New York' },
  { from: 'IST', to: 'BKK', label: 'İstanbul → Bangkok' },
  { from: 'IST', to: 'SIN', label: 'İstanbul → Singapur' },
  { from: 'AYT', to: 'FRA', label: 'Antalya → Frankfurt' },
];

export function searchAirports(query: string): Airport[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return AIRPORTS.filter(
    (a) =>
      a.iata.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.cityNative.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  ).slice(0, 8);
}
