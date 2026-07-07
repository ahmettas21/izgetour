/**
 * Skiplagged flight provider for İzgeTour.
 * Reverse-engineered from the public /api/search.php endpoint (v3 format).
 * Returns hidden-city aware, multi-source priced flights.
 *
 * NOT: Bu iç endpoint resmi değildir, uyarısız değişebilir; her zaman
 * try/catch ile sarıp mock fallback'e düşülmeli.
 */
import type { FlightResult, SearchParams, CabinClass } from '@/components/flights/types';
import { fetchViaFlareSolverr } from '@/lib/flaresolverr';

// ─── Skiplagged raw types ────────────────────────────────────────────────────
interface SkSegment {
  airline: string;
  flight_number: number;
  departure: { time: string; airport: string };
  arrival: { time: string; airport: string };
  duration: number; // seconds
}
interface SkFlight {
  segments: SkSegment[];
  duration: number; // seconds, total
  count: number;    // segment count
  data: string;
}
interface SkItinerary {
  data: string;
  flight: string;         // key into flights map
  one_way_price?: number; // cents
  min_round_trip_price?: number;
}
interface SkResponse {
  airlines: Record<string, { name: string }>;
  cities: Record<string, { name: string }>;
  airports: Record<string, { name: string; city?: string }>;
  flights: Record<string, SkFlight>;
  itineraries: { outbound: SkItinerary[]; inbound: SkItinerary[] };
  info: { from: SkLoc; to: SkLoc };
}
interface SkLoc { city: string; country: string; airports: string[] }

const AIRLINE_FALLBACK: Record<string, string> = {
  TK: 'Turkish Airlines', PC: 'Pegasus', LO: 'LOT', LH: 'Lufthansa',
  BA: 'British Airways', AF: 'Air France', KL: 'KLM', A3: 'Aegean',
};

// ─── IATA → şehir adı zenginleştirme ─────────────────────────────────────────
function resolveCityName(
  iata: string,
  airports: Record<string, { name: string; city?: string }>,
  cities: Record<string, { name: string }>,
): string {
  const airport = airports[iata];
  if (airport) {
    // airport.city bir şehir key'i ise cities map'inden çöz
    if (airport.city && cities[airport.city]) return cities[airport.city].name;
    if (airport.city) return airport.city;
    if (airport.name) return airport.name;
  }
  if (cities[iata]) return cities[iata].name;
  return iata; // son çare: IATA kodunun kendisi
}

// ─── Best source price extractor (bonus: cheapest booking site) ──────────────
function parseCheapestSource(dataField: string): { site: string; cost: number } | null {
  try {
    const json = dataField.slice(dataField.indexOf('|') + 1);
    const parsed = JSON.parse(json);
    const sources = parsed?.source?.[0]?.source as Record<string, [number, number]> | undefined;
    if (!sources) return null;
    let best: { site: string; cost: number } | null = null;
    for (const [site, [, cost]] of Object.entries(sources)) {
      if (!best || cost < best.cost) best = { site, cost };
    }
    return best;
  } catch { return null; }
}

// ─── Normalizer: Skiplagged → İzgeTour FlightResult ──────────────────────────
function normalizeItinerary(
  it: SkItinerary,
  flights: Record<string, SkFlight>,
  airlines: Record<string, { name: string }>,
  airports: Record<string, { name: string; city?: string }>,
  cities: Record<string, { name: string }>,
  cabin: CabinClass,
): FlightResult | null {
  const f = flights[it.flight];
  if (!f || !f.segments?.length) return null;

  const first = f.segments[0];
  const last = f.segments[f.segments.length - 1];
  const carrierCode = first.airline;
  const stops = f.segments.length - 1;
  const stopCities = f.segments.slice(0, -1).map((s) => s.arrival.airport);
  const priceCents = it.one_way_price ?? it.min_round_trip_price ?? 0;
  const price = Math.round(priceCents) / 100;

  const cheapest = parseCheapestSource(it.data);
  // originalPrice: gerçek "liste fiyatı" yok; price=originalPrice
  const originalPrice = price;

  return {
    id: it.flight,
    slug: `${carrierCode.toLowerCase()}-${first.departure.airport.toLowerCase()}-${last.arrival.airport.toLowerCase()}-${first.departure.time.slice(11, 16).replace(':', '')}`,
    carrierCode,
    airline: airlines[carrierCode]?.name ?? AIRLINE_FALLBACK[carrierCode] ?? carrierCode,
    departure: resolveCityName(first.departure.airport, airports, cities),
    departureCode: first.departure.airport,
    arrival: resolveCityName(last.arrival.airport, airports, cities),
    arrivalCode: last.arrival.airport,
    departureTime: first.departure.time,
    arrivalTime: last.arrival.time,
    durationMinutes: Math.round(f.duration / 60),
    stops,
    stopCities,
    price,
    originalPrice,
    cabin,
    baggage: cabin === 'economy' ? 'Kabin' : '2x32kg',
    aircraft: '',
    availableSeats: 9,
    refundable: false,
    co2Emissions: 0,
    bookingSource: cheapest?.site,
  };
}

// ─── Fetch + search ──────────────────────────────────────────────────────────
const SK_BASE = 'https://skiplagged.com/api/search.php';

export async function searchSkiplaggedFlights(params: SearchParams): Promise<FlightResult[]> {
  if (!params.from || !params.to) return [];

  const qs = new URLSearchParams({
    from: params.from.iata,
    to: params.to.iata,
    depart: params.departDate,
    return: params.tripType === 'roundtrip' ? params.returnDate : '',
    poll: 'true',
    format: 'v3',
    'counts[adults]': String(params.passengers.adult || 1),
    'counts[children]': String(params.passengers.child || 0),
  });

  // Cloudflare korumalı endpoint → FlareSolverr üzerinden çekilir.
  // (Düz fetch CF challenge'ına takılır; bu fonksiyon yalnızca worker'dan çağrılır.)
  const data = await fetchViaFlareSolverr<SkResponse>(`${SK_BASE}?${qs.toString()}`);
  const out = data.itineraries?.outbound ?? [];

  // Dedup: aynı flight key (id) birden fazla itinerary'de dönebilir → Map ile tekilleştir
  const deduped = new Map<string, FlightResult>();
  for (const it of out) {
    const normalized = normalizeItinerary(
      it,
      data.flights,
      data.airlines,
      data.airports ?? {},
      data.cities ?? {},
      params.cabinClass,
    );
    if (normalized && !deduped.has(normalized.id)) {
      deduped.set(normalized.id, normalized);
    }
  }

  return Array.from(deduped.values());
}
