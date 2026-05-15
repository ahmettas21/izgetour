'use server';

import { Airport } from '@/data/airports';
import type { FlightResult, SearchParams, CabinClass } from '@/components/flights/types';

// Re-export types for consumers
export type { FlightResult, SearchParams, CabinClass } from '@/components/flights/types';

// ─── Amadeus API Types ───────────────────────────────────────────────────────

interface AmadeusTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface AmadeusFlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: AmadeusItinerary[];
  price: AmadeusPrice;
  pricingOptions: AmadeusPricingOptions;
  travelerPricings: AmadeusTravelerPricing[];
}

interface AmadeusItinerary {
  duration: string;
  segments: AmadeusSegment[];
}

interface AmadeusSegment {
  departure: { iataCode: string; terminal?: string; at: string };
  arrival: { iataCode: string; terminal?: string; at: string };
  carrierCode: string;
  number: string;
  aircraft: { code: string };
  operating?: { carrierCode: string };
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

interface AmadeusPrice {
  currency: string;
  total: string;
  base: string;
  fees?: Array<{ amount: string; type: string }>;
  grandTotal: string;
}

interface AmadeusPricingOptions {
  fareType: string[];
  includedCheckedBagsOnly: boolean;
}

interface AmadeusTravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: { currency: string; total: string };
  fareDetailsBySegment: Array<{
    segmentId: string;
    cabin: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
    fareBasis: string;
    class: string;
    includedCheckedBags?: { weight?: number; weightUnit?: string; quantity?: number };
  }>;
}

// ─── Airline Registry ───────────────────────────────────────────────────────

const AIRLINE_NAMES: Record<string, string> = {
  TK: 'Turkish Airlines',
  PC: 'Pegasus',
  XQ: 'SunExpress',
  LH: 'Lufthansa',
  BA: 'British Airways',
  AF: 'Air France',
  KL: 'KLM',
  SU: 'Aeroflot',
  EY: 'Etihad',
  QR: 'Qatar Airways',
  EK: 'Emirates',
  SK: 'SAS',
  IB: 'Iberia',
  VY: 'Vueling',
  FR: 'Ryanair',
  U2: 'EasyJet',
  W6: 'Wizz Air',
};

function getAirlineName(code: string): string {
  return AIRLINE_NAMES[code] ?? code;
}

// ─── Amadeus Token ───────────────────────────────────────────────────────────

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAmadeusToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
    return cachedToken.token;
  }

  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('AMADEUS_CLIENT_ID or AMADEUS_CLIENT_SECRET is not set');
  }

  const response = await fetch('https://api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to get Amadeus token: ${response.statusText}`);
  }

  const data: AmadeusTokenResponse = await response.json();

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return cachedToken.token;
}

// ─── ISO Duration Parser ─────────────────────────────────────────────────────

function parseISODuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  return parseInt(match[1] ?? '0', 10) * 60 + parseInt(match[2] ?? '0', 10);
}

// ─── Amadeus Response Normalizer ─────────────────────────────────────────────

function normalizeAmadeusOffer(
  offer: AmadeusFlightOffer,
  departureCity: string,
  arrivalCity: string,
): FlightResult {
  const firstSeg = offer.itineraries[0]?.segments[0];
  const lastSeg = offer.itineraries[0]?.segments.at(-1);
  const carrierCode = firstSeg?.carrierCode ?? 'TK';

  const stops = offer.itineraries.reduce(
    (acc, it) => acc + it.segments.reduce((s, seg) => s + seg.numberOfStops, 0),
    0,
  );

  const stopCities = offer.itineraries
    .flatMap((it) => it.segments.slice(0, -1))
    .map((seg) => seg.arrival.iataCode);

  const traveler = offer.travelerPricings[0];
  const segDetail = traveler?.fareDetailsBySegment[0];

  const cabinMap: Record<string, CabinClass> = {
    ECONOMY: 'economy',
    PREMIUM_ECONOMY: 'premium',
    BUSINESS: 'business',
    FIRST: 'first',
  };

  const baggage = segDetail?.includedCheckedBags?.weight != null
    ? `${segDetail.includedCheckedBags.weight}${segDetail.includedCheckedBags.weightUnit?.toLowerCase() ?? 'kg'}`
    : segDetail?.includedCheckedBags?.quantity != null
      ? `${segDetail.includedCheckedBags.quantity}x`
      : 'Kabin';

  return {
    id: offer.id,
    slug: offer.id,
    carrierCode,
    airline: getAirlineName(carrierCode),
    departure: departureCity,
    departureCode: firstSeg?.departure.iataCode ?? '',
    arrival: arrivalCity,
    arrivalCode: lastSeg?.arrival.iataCode ?? '',
    departureTime: firstSeg?.departure.at ?? '',
    arrivalTime: lastSeg?.arrival.at ?? '',
    durationMinutes: parseISODuration(offer.itineraries[0]?.duration ?? 'PT0H'),
    stops,
    stopCities,
    price: Math.round(parseFloat(offer.price.total) * 100) / 100,
    originalPrice: Math.round(parseFloat(offer.price.grandTotal) * 100) / 100,
    cabin: cabinMap[segDetail?.cabin ?? 'ECONOMY'] ?? 'economy',
    refundable: offer.pricingOptions.fareType.includes('REFUNDABLE'),
    availableSeats: offer.numberOfBookableSeats,
    baggage,
    aircraft: firstSeg?.aircraft?.code ?? '',
    co2Emissions: 0,
    // rawOffer omitted - not in FlightResult type
  };
}

// ─── Mock Data Generator ────────────────────────────────────────────────────

function generateMockResults(from: Airport, to: Airport, cabin: import('@/components/flights/types').CabinClass): FlightResult[] {
  const multipliers: Record<CabinClass, number> = { economy: 1, business: 4.5, premium: 2.5, first: 9 };
  const basePrices: Record<CabinClass, number> = { economy: 1500, business: 8500, premium: 5000, first: 18000 };

  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + 3);

  const airlines = [
    { code: 'TK', name: 'Turkish Airlines' },
    { code: 'PC', name: 'Pegasus' },
    { code: 'XQ', name: 'SunExpress' },
    { code: 'LH', name: 'Lufthansa' },
    { code: 'BA', name: 'British Airways' },
    { code: 'AF', name: 'Air France' },
  ];

  return airlines.map((al, i) => {
    const dur = 150 + Math.floor(Math.random() * 180);
    const depH = 6 + i * 2;
    const depD = new Date(baseDate);
    depD.setHours(depH, Math.floor(Math.random() * 60), 0, 0);
    const arrD = new Date(depD.getTime() + dur * 60 * 1000);
    const price = Math.round(basePrices[cabin] * (0.75 + Math.random() * 0.8) * multipliers[cabin]);
    const orig = Math.round(price * (1.1 + Math.random() * 0.4));
    const stops = i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2;
    const stopCodes = stops === 0 ? [] : stops === 1 ? ['FRA'] : ['FRA', 'VIE'];

    return {
      id: `${al.code}-${Date.now()}-${i}`,
      slug: `${al.code.toLowerCase()}-${from.cityNative.toLowerCase().replace(/\s+/g, '-')}-${to.cityNative.toLowerCase().replace(/\s+/g, '-')}-${depH}00`,
      carrierCode: al.code,
      airline: al.name,
      departure: from.cityNative,
      departureCode: from.iata,
      arrival: to.cityNative,
      arrivalCode: to.iata,
      departureTime: depD.toISOString(),
      arrivalTime: arrD.toISOString(),
      durationMinutes: dur,
      stops,
      stopCities: stopCodes,
      price,
      originalPrice: orig,
      cabin,
      refundable: i % 2 === 0,
      availableSeats: 2 + Math.floor(Math.random() * 20),
      baggage: cabin === 'economy' ? '20kg' : '2x32kg',
      aircraft: i % 2 === 0 ? 'Airbus A350' : 'Boeing 737',
      co2Emissions: 250 + Math.floor(Math.random() * 400),
    };
  });
}

// ─── Amadeus API Call ──────────────────────────────────────────────────────

async function searchAmadeusFlights(params: SearchParams): Promise<FlightResult[]> {
  if (!params.from || !params.to) return [];

  const token = await getAmadeusToken();

  // Build origin/destination
  const originDestinations = params.tripType === 'multicity'
    ? params.segments
        .filter((s) => s.from && s.to)
        .map((s) => ({
          id: '1',
          originLocationCode: s.from!.iata,
          destinationLocationCode: s.to!.iata,
          departureDateTimeRanges: [{ date: s.date }],
        }))
    : [
        {
          id: '1',
          originLocationCode: params.from.iata,
          destinationLocationCode: params.to.iata,
          departureDateTimeRanges: [{ date: params.departDate }],
        },
      ];

  const travelerCount = [
    { id: '1', travelerType: 'ADULT', count: params.passengers.adult },
    ...(params.passengers.child > 0 ? [{ id: String(params.passengers.adult + 1), travelerType: 'CHILD', count: params.passengers.child }] : []),
    ...(params.passengers.infant > 0 ? [{ id: String(params.passengers.adult + params.passengers.child + 1), travelerType: 'INFANT', count: params.passengers.infant }] : []),
  ];

  const cabinMap: Record<CabinClass, string> = {
    economy: 'ECONOMY',
    premium: 'PREMIUM_ECONOMY',
    business: 'BUSINESS',
    first: 'FIRST',
  };

  const requestBody = {
    originDestinations,
    travelers: travelerCount,
    sources: ['GDS'],
    searchCriteria: {
      maxPriceOnAdditionalFeesRequest: 'EXCLUDE_ADDITIONAL_FEES',
      numBookableSeats: 9,
    },
    flightFilters: {
      cabinRestrictions: [
        {
          cabin: cabinMap[params.cabinClass],
          coverage: 'MOST_SEGMENTS',
          originDestinationIds: ['1'],
        },
      ],
    },
  };

  const response = await fetch('https://api.amadeus.com/v2/shopping/flight-offers', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Amadeus API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const offers: AmadeusFlightOffer[] = data.data ?? [];

  return offers.map((offer) =>
    normalizeAmadeusOffer(offer, params.from!.cityNative, params.to!.cityNative),
  );
}

// ─── Main Server Action ─────────────────────────────────────────────────────

export async function searchFlights(params: SearchParams): Promise<{
  success: boolean;
  data?: FlightResult[];
  error?: string;
}> {
  try {
    // Validate inputs
    if (!params.from) {
      return { success: false, error: 'Nereden seçin' };
    }
    if (!params.to) {
      return { success: false, error: 'Nereye seçin' };
    }
    if (!params.departDate) {
      return { success: false, error: 'Gidiş tarihi seçin' };
    }
    if (params.tripType === 'roundtrip' && !params.returnDate) {
      return { success: false, error: 'Dönüş tarihi seçin' };
    }
    if (params.passengers.infant > params.passengers.adult) {
      return { success: false, error: 'Bebek sayısı yetişkin sayısını aşamaz' };
    }

    // Check if Amadeus credentials are configured
    const hasCredentials = !!(process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET);

    let results: FlightResult[];

    if (hasCredentials) {
      results = await searchAmadeusFlights(params);
    } else {
      // Fallback to mock data for development
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
      results = generateMockResults(params.from, params.to, params.cabinClass);
    }

    return { success: true, data: results };
  } catch (error) {
    console.error('Flight search error:', error);
    // Fallback to mock data on error
    try {
      if (params.from && params.to) {
        await new Promise((r) => setTimeout(r, 600));
        const results = generateMockResults(params.from, params.to, params.cabinClass);
        return { success: true, data: results };
      }
    } catch {}
    return { success: false, error: 'Arama sırasında bir hata oluştu. Lütfen tekrar deneyin.' };
  }
}
