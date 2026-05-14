export type CabinClass = 'economy' | 'business' | 'premium' | 'first';

export interface SearchParams {
  tripType: 'oneway' | 'roundtrip' | 'multicity';
  from: import('@/data/airports').Airport | null;
  to: import('@/data/airports').Airport | null;
  departDate: string;
  returnDate: string;
  passengers: {
    adult: number;
    child: number;
    infant: number;
  };
  cabinClass: CabinClass;
  segments: Array<{
    from: import('@/data/airports').Airport | null;
    to: import('@/data/airports').Airport | null;
    date: string;
  }>;
}

/**
 * Unified flight data type compatible with both:
 * - @/data/flights/Flight (existing mock data)
 * - Amadeus API response (via searchFlights server action)
 */
export interface FlightResult {
  id: string;
  slug: string;
  carrierCode: string; // Amadeus: carrierCode, legacy: airlineCode
  airline: string;
  departure: string;
  departureCode: string;
  arrival: string;
  arrivalCode: string;
  departureTime: string; // ISO string or "HH:mm"
  arrivalTime: string;   // ISO string or "HH:mm"
  durationMinutes: number;
  stops: number;
  stopCities: string[];
  price: number;
  originalPrice: number;
  cabin: CabinClass;
  baggage: string;
  aircraft: string;
  availableSeats: number; // unified name
  refundable: boolean;
  co2Emissions: number;
}
