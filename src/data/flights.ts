export type Flight = {
  id: string;
  slug: string;
  airline: string;
  airlineCode: string;
  departure: string;
  arrival: string;
  departureCode: string;
  arrivalCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  durationMinutes: number;
  stops: number;
  stopCities: string[];
  price: number;
  originalPrice: number;
  cabinClass: 'economy' | 'business' | 'premium';
  baggage: string;
  aircraft: string;
  availableSeats: number;
  refundable: boolean;
  departureDate: string;
  co2Emissions: number;
};

export const MOCK_FLIGHTS: Flight[] = [
  {
    id: 'tk1', slug: 'tk-istanbul-londra-0630',
    airline: 'Turkish Airlines', airlineCode: 'TK',
    departure: 'İstanbul', arrival: 'Londra',
    departureCode: 'IST', arrivalCode: 'LHR',
    departureTime: '06:30', arrivalTime: '09:45',
    duration: '4s 15d', durationMinutes: 255,
    stops: 0, stopCities: [],
    price: 2849, originalPrice: 3200,
    cabinClass: 'economy', baggage: '2x23kg',
    aircraft: 'Airbus A350', availableSeats: 12,
  seatsLeft: 12, refundable: true,
    departureDate: '2026-05-15',
    co2Emissions: 390,
  },
  {
    id: 'pc1', slug: 'pc-istanbul-londra-0815',
    airline: 'Pegasus', airlineCode: 'PC',
    departure: 'İstanbul', arrival: 'Londra',
    departureCode: 'SAW', arrivalCode: 'STN',
    departureTime: '08:15', arrivalTime: '11:30',
    duration: '4s 15d', durationMinutes: 255,
    stops: 0, stopCities: [],
    price: 1849, originalPrice: 2100,
    cabinClass: 'economy', baggage: '20kg',
    aircraft: 'Boeing 737', availableSeats: 28,
  seatsLeft: 28, refundable: false,
    departureDate: '2026-05-15',
    co2Emissions: 380,
  },
  {
    id: 'xq1', slug: 'xq-istanbul-londra-1100',
    airline: 'SunExpress', airlineCode: 'XQ',
    departure: 'İstanbul', arrival: 'Londra',
    departureCode: 'SAW', arrivalCode: 'LGW',
    departureTime: '11:00', arrivalTime: '15:30',
    duration: '5s 30d', durationMinutes: 330,
    stops: 1, stopCities: ['Frankfurt'],
    price: 2199, originalPrice: 2199,
    cabinClass: 'economy', baggage: '20kg',
    aircraft: 'Boeing 737 MAX', availableSeats: 15,
  seatsLeft: 15, refundable: true,
    departureDate: '2026-05-15',
    co2Emissions: 460,
  },
  {
    id: 'tk2', slug: 'tk-istanbul-dubai-0700',
    airline: 'Turkish Airlines', airlineCode: 'TK',
    departure: 'İstanbul', arrival: 'Dubai',
    departureCode: 'IST', arrivalCode: 'DXB',
    departureTime: '07:00', arrivalTime: '12:30',
    duration: '4s 30d', durationMinutes: 270,
    stops: 0, stopCities: [],
    price: 4499, originalPrice: 4800,
    cabinClass: 'economy', baggage: '2x23kg',
    aircraft: 'Boeing 777', availableSeats: 8,
  seatsLeft: 8, refundable: true,
    departureDate: '2026-05-16',
    co2Emissions: 680,
  },
  {
    id: 'ba1', slug: 'ba-istanbul-londra-1420',
    airline: 'British Airways', airlineCode: 'BA',
    departure: 'İstanbul', arrival: 'Londra',
    departureCode: 'IST', arrivalCode: 'LHR',
    departureTime: '14:20', arrivalTime: '17:00',
    duration: '4s 40d', durationMinutes: 280,
    stops: 0, stopCities: [],
    price: 3499, originalPrice: 3800,
    cabinClass: 'economy', baggage: '1x23kg',
    aircraft: 'Airbus A321', availableSeats: 5,
  seatsLeft: 5, refundable: true,
    departureDate: '2026-05-15',
    co2Emissions: 390,
  },
  {
    id: 'lh1', slug: 'lh-istanbul-londra-1845',
    airline: 'Lufthansa', airlineCode: 'LH',
    departure: 'İstanbul', arrival: 'Londra',
    departureCode: 'IST', arrivalCode: 'LHR',
    departureTime: '18:45', arrivalTime: '23:10',
    duration: '6s 25d', durationMinutes: 385,
    stops: 1, stopCities: ['Münih'],
    price: 2599, originalPrice: 2599,
    cabinClass: 'economy', baggage: '1x23kg',
    aircraft: 'Airbus A320', availableSeats: 22,
  seatsLeft: 22, refundable: false,
    departureDate: '2026-05-15',
    co2Emissions: 470,
  },
  {
    id: 'tk3', slug: 'tk-istanbul-newyork-0130',
    airline: 'Turkish Airlines', airlineCode: 'TK',
    departure: 'İstanbul', arrival: 'New York',
    departureCode: 'IST', arrivalCode: 'JFK',
    departureTime: '01:30', arrivalTime: '06:00',
    duration: '10s 30d', durationMinutes: 630,
    stops: 0, stopCities: [],
    price: 12999, originalPrice: 14500,
    cabinClass: 'economy', baggage: '2x23kg',
    aircraft: 'Airbus A350', availableSeats: 3,
  seatsLeft: 3, refundable: true,
    departureDate: '2026-05-17',
    co2Emissions: 1050,
  },
  {
    id: 'pc2', slug: 'pc-ankara-berlin-1000',
    airline: 'Pegasus', airlineCode: 'PC',
    departure: 'Ankara', arrival: 'Berlin',
    departureCode: 'ESB', arrivalCode: 'BER',
    departureTime: '10:00', arrivalTime: '12:45',
    duration: '3s 45d', durationMinutes: 225,
    stops: 0, stopCities: [],
    price: 2499, originalPrice: 2499,
    cabinClass: 'economy', baggage: '20kg',
    aircraft: 'Boeing 737', availableSeats: 18,
  seatsLeft: 18, refundable: false,
    departureDate: '2026-05-18',
    co2Emissions: 290,
  },
];

export const AIRLINES = [
  { code: 'TK', name: 'Turkish Airlines' },
  { code: 'PC', name: 'Pegasus' },
  { code: 'XQ', name: 'SunExpress' },
  { code: 'BA', name: 'British Airways' },
  { code: 'LH', name: 'Lufthansa' },
];

export const POPULAR_ROUTES = [
  { from: 'İstanbul', to: 'Londra', fromCode: 'IST', toCode: 'LHR', icon: '🇬🇧' },
  { from: 'İstanbul', to: 'Dubai', fromCode: 'IST', toCode: 'DXB', icon: '🇦🇪' },
  { from: 'İstanbul', to: 'Paris', fromCode: 'IST', toCode: 'CDG', icon: '🇫🇷' },
  { from: 'Ankara', to: 'Berlin', fromCode: 'ESB', toCode: 'BER', icon: '🇩🇪' },
  { from: 'İstanbul', to: 'New York', fromCode: 'IST', toCode: 'JFK', icon: '🇺🇸' },
];
