/**
 * İzgeTour — DB erişim katmanı (soyutlama).
 *
 * Tüm DB okuma/yazma buradan geçer. İleride Postgres/Turso geçişinde
 * yalnızca bu dosya ve src/db/index.ts değişir; çağıran kod aynı kalır.
 */
import { randomUUID } from 'node:crypto';
import { and, eq, desc } from 'drizzle-orm';
import { getDb } from './index';
import {
  routes,
  airports,
  priceCache,
  affiliateLinks,
  fetchLog,
  type Route,
  type Airport,
  type AffiliateLink,
} from './schema';
import type { FlightResult, CabinClass } from '@/components/flights/types';

// ─── Rota / havalimanı okuma ────────────────────────────────────────────────
export function getRouteBySlug(slug: string): Route | undefined {
  const db = getDb();
  return db.select().from(routes).where(eq(routes.slug, slug)).get();
}

export function getEnabledRoutes(): Route[] {
  const db = getDb();
  return db.select().from(routes).where(eq(routes.enabled, true)).all();
}

export function getRouteByOriginDest(origin: string, destination: string): Route | undefined {
  const db = getDb();
  return db
    .select()
    .from(routes)
    .where(and(eq(routes.origin, origin), eq(routes.destination, destination)))
    .get();
}

export function getAirport(code: string): Airport | undefined {
  const db = getDb();
  return db.select().from(airports).where(eq(airports.code, code)).get();
}

// ─── price_cache ↔ FlightResult dönüşümleri ─────────────────────────────────
const VALID_CABINS: CabinClass[] = ['economy', 'business', 'premium', 'first'];

function toCabin(value: string | null): CabinClass {
  return VALID_CABINS.includes(value as CabinClass) ? (value as CabinClass) : 'economy';
}

/** price_cache satırı → FlightResult (cent → USD) */
function rowToFlightResult(row: typeof priceCache.$inferSelect): FlightResult {
  const price = (row.priceUsdCents ?? 0) / 100;
  return {
    id: row.flightId ?? row.id,
    slug: row.id,
    carrierCode: row.airlineCode ?? '',
    airline: row.airlineName ?? row.airlineCode ?? '',
    departure: row.departureCity ?? row.departureCode ?? '',
    departureCode: row.departureCode ?? '',
    arrival: row.arrivalCity ?? row.arrivalCode ?? '',
    arrivalCode: row.arrivalCode ?? '',
    departureTime: row.departureTime ?? '',
    arrivalTime: row.arrivalTime ?? '',
    durationMinutes: row.durationMinutes ?? 0,
    stops: row.stops ?? 0,
    stopCities: [],
    price,
    originalPrice: price,
    cabin: toCabin(row.cabin),
    baggage: toCabin(row.cabin) === 'economy' ? 'Kabin' : '2x32kg',
    aircraft: '',
    availableSeats: 9,
    refundable: false,
    co2Emissions: 0,
    bookingSource: row.bookingSource ?? undefined,
  };
}

/** FlightResult → price_cache insert satırı (USD → cent) */
function flightResultToRow(
  routeId: string,
  departDate: string,
  f: FlightResult,
): typeof priceCache.$inferInsert {
  return {
    id: randomUUID(),
    routeId,
    departDate,
    airlineCode: f.carrierCode,
    airlineName: f.airline,
    flightId: f.id,
    departureCity: f.departure,
    departureCode: f.departureCode,
    arrivalCity: f.arrival,
    arrivalCode: f.arrivalCode,
    departureTime: f.departureTime,
    arrivalTime: f.arrivalTime,
    durationMinutes: f.durationMinutes,
    stops: f.stops,
    priceUsdCents: Math.round(f.price * 100),
    bookingSource: f.bookingSource ?? null,
    cabin: f.cabin,
    raw: f,
  };
}

// ─── Cache okuma ────────────────────────────────────────────────────────────
export function getCachedFlights(routeId: string, departDate: string): FlightResult[] {
  const db = getDb();
  const rows = db
    .select()
    .from(priceCache)
    .where(and(eq(priceCache.routeId, routeId), eq(priceCache.departDate, departDate)))
    .all();
  return rows.map(rowToFlightResult);
}

// ─── Cache yazma: "yaz-önce-sil" (transaction) ──────────────────────────────
export function saveFlights(
  routeId: string,
  departDate: string,
  flights: FlightResult[],
): number {
  const db = getDb();

  db.transaction((tx) => {
    // Bu rota+tarih için eski snapshot'ı temizle (şişmeyi önle)
    tx.delete(priceCache)
      .where(and(eq(priceCache.routeId, routeId), eq(priceCache.departDate, departDate)))
      .run();

    if (flights.length > 0) {
      tx.insert(priceCache)
        .values(flights.map((f) => flightResultToRow(routeId, departDate, f)))
        .run();
    }
  });

  return flights.length;
}

// ─── Fetch günlüğü ──────────────────────────────────────────────────────────
export function logFetch(
  routeId: string | null,
  status: 'success' | 'error',
  flightsFound: number,
  error: string | null,
  durationMs: number,
): void {
  const db = getDb();
  db.insert(fetchLog)
    .values({
      id: randomUUID(),
      routeId,
      status,
      flightsFound,
      error,
      durationMs,
    })
    .run();
}

// ─── Affiliate ──────────────────────────────────────────────────────────────
export function getAffiliateLink(bookingSource: string): AffiliateLink | undefined {
  const db = getDb();
  return db
    .select()
    .from(affiliateLinks)
    .where(and(eq(affiliateLinks.bookingSource, bookingSource), eq(affiliateLinks.enabled, true)))
    .get();
}

/** enabled=true tüm affiliate linkleri (fallback seçimi için) */
export function getEnabledAffiliateLinks(): AffiliateLink[] {
  const db = getDb();
  return db
    .select()
    .from(affiliateLinks)
    .where(eq(affiliateLinks.enabled, true))
    .orderBy(desc(affiliateLinks.createdAt))
    .all();
}
