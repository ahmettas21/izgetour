import type { Flight } from '@/data/flights';

// ── Types ──────────────────────────────────────────────────────────────────────

export type FlightLeg = {
  id: string; // client-generated stable id
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  date: string; // YYYY-MM-DD
};

export type LegSearchResult = {
  legId: string;
  flights: Flight[];
};

export type MultiCityItinerary = {
  legs: FlightLeg[];
  // key = legId, value = selected flight for that leg
  selections: Record<string, Flight>;
};

// ── Mock city autocomplete ────────────────────────────────────────────────────

const CITIES = [
  { city: 'İstanbul', code: 'IST' },
  { city: 'İstanbul (Sabiha)', code: 'SAW' },
  { city: 'Ankara', code: 'ESB' },
  { city: 'İzmir', code: 'ADB' },
  { city: 'Antalya', code: 'AYT' },
  { city: 'Bodrum', code: 'BJV' },
  { city: 'Trabzon', code: 'TZX' },
  { city: 'Londra', code: 'LHR' },
  { city: 'Dubai', code: 'DXB' },
  { city: 'Paris', code: 'CDG' },
  { city: 'New York', code: 'JFK' },
  { city: 'Berlin', code: 'BER' },
  { city: 'Amsterdam', code: 'AMS' },
  { city: 'Roma', code: 'FCO' },
  { city: 'Madrid', code: 'MAD' },
  { city: 'Barselona', code: 'BCN' },
  { city: 'Viyana', code: 'VIE' },
  { city: 'Zürih', code: 'ZRH' },
  { city: 'Münih', code: 'MUC' },
  { city: 'Tokyo', code: 'NRT' },
  { city: 'Singapur', code: 'SIN' },
  { city: 'Los Angeles', code: 'LAX' },
  { city: 'Miami', code: 'MIA' },
  { city: 'Sydney', code: 'SYD' },
];

export function searchCities(query: string): typeof CITIES {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return CITIES.filter(
    (c) =>
      c.city.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q)
  ).slice(0, 6);
}

export function getCityCode(cityName: string): string {
  return CITIES.find((c) => c.city === cityName)?.code ?? cityName.slice(0, 3).toUpperCase();
}

// ── Date helpers ──────────────────────────────────────────────────────────────

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatDisplayDate(dateStr: string, locale: 'tr' | 'en'): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function isValidDate(dateStr: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) && !isNaN(Date.parse(dateStr));
}

// ── Date validation (each leg's date must be after previous leg's arrival) ────

export type DateValidationError = {
  legId: string;
  message: string;
};

export function validateLegDates(legs: FlightLeg[]): DateValidationError[] {
  const errors: DateValidationError[] = [];
  for (let i = 1; i < legs.length; i++) {
    const prev = legs[i - 1];
    const curr = legs[i];
    if (!prev.date || !curr.date) continue;
    if (curr.date <= prev.date) {
      errors.push({
        legId: curr.id,
        message:
          'Tarih önceki uçuştan sonra olmalıdır.',
      });
    }
  }
  return errors;
}

// ── Multi-GDS flight query ────────────────────────────────────────────────────
// Searches flights.ts for each leg concurrently (simulates Promise.all)

export async function queryFlightsForLeg(leg: FlightLeg): Promise<LegSearchResult> {
  // Simulate async GDS latency (50–150ms per leg)
  await new Promise((r) => setTimeout(r, 50 + Math.random() * 100));

  // Dynamic import to avoid circular deps — resolved at call site
  const { MOCK_FLIGHTS } = await import('@/data/flights');

  const flights = MOCK_FLIGHTS.filter((f) => {
    const depMatch =
      f.departureCode === leg.originCode ||
      f.departure.toLowerCase() === leg.origin.toLowerCase();
    const arrMatch =
      f.arrivalCode === leg.destinationCode ||
      f.arrival.toLowerCase() === leg.destination.toLowerCase();
    const dateMatch = !leg.date || f.departureDate === leg.date;
    return depMatch && arrMatch && dateMatch;
  });

  // Vary prices slightly per search to simulate GDS price fluctuation
  return {
    legId: leg.id,
    flights: flights.map((f) => ({
      ...f,
      price: Math.round(f.price * (0.88 + Math.random() * 0.24)),
      originalPrice: f.price,
    })),
  };
}

export async function queryAllLegs(legs: FlightLeg[]): Promise<LegSearchResult[]> {
  return Promise.all(legs.map(queryFlightsForLeg));
}

// ── Aggregation helpers ───────────────────────────────────────────────────────

export function aggregateItineraryPrice(
  selections: Record<string, Flight>
): { total: number; originalTotal: number; legCount: number } {
  const values = Object.values(selections);
  return {
    total: values.reduce((s, f) => s + f.price, 0),
    originalTotal: values.reduce((s, f) => s + f.originalPrice, 0),
    legCount: values.length,
  };
}

export function getCheapestPerLeg(
  results: LegSearchResult[]
): Record<string, Flight> {
  const selections: Record<string, Flight> = {};
  for (const result of results) {
    if (result.flights.length > 0) {
      const cheapest = result.flights.reduce((a, b) =>
        a.price <= b.price ? a : b
      );
      selections[result.legId] = cheapest;
    }
  }
  return selections;
}

export function countStops(flights: Flight[]): number {
  return flights.reduce((s, f) => s + f.stops, 0);
}

export function totalDurationMinutes(flights: Flight[]): number {
  return flights.reduce((s, f) => s + f.durationMinutes, 0);
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}s ${m}d`;
}
