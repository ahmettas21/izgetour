/**
 * İzgeTour — DB erişim katmanı (soyutlama) — Supabase (Postgres) sürümü.
 *
 * Tüm DB okuma/yazma buradan geçer. Supabase JS client (service_role) kullanır.
 * Supabase JS ASENKRON olduğundan tüm fonksiyonlar Promise döner.
 *
 * NOT (SQLite → Postgres farkları):
 *  - Fiyat: Postgres şemasında `price_usd` (numeric USD). Uygulama içinde
 *    doğrudan USD taşınır; SQLite'taki `price_usd_cents` mantığı burada YOK.
 *  - id / route_id: uuid (DB üretir; insert'te göndermiyoruz → gen_random_uuid).
 *  - depart_date: date, departure/arrival_time: timestamptz.
 */
import { getSupabaseAdmin } from './supabase-admin';
import type { Route, Airport, AffiliateLink } from './schema';
import type { FlightResult, CabinClass } from '@/components/flights/types';

// ─── Postgres satır tipleri (snake_case) ────────────────────────────────────
interface RouteRow {
  id: string;
  origin: string;
  destination: string;
  slug: string | null;
  popular: boolean;
  enabled: boolean;
  title_tr: string | null;
  title_en: string | null;
  description_tr: string | null;
  description_en: string | null;
  created_at: string;
}

interface AirportRow {
  code: string;
  name: string;
  city: string;
  country: string;
  lat: number | null;
  lng: number | null;
}

interface PriceCacheRow {
  id: string;
  route_id: string | null;
  depart_date: string;
  airline_code: string | null;
  airline_name: string | null;
  flight_id: string | null;
  departure_city: string | null;
  departure_code: string | null;
  arrival_city: string | null;
  arrival_code: string | null;
  departure_time: string | null;
  arrival_time: string | null;
  duration_minutes: number | null;
  stops: number | null;
  price_usd: number | null;
  booking_source: string | null;
  cabin: string | null;
  fetched_at: string | null;
  raw: unknown;
}

interface AffiliateLinkRow {
  id: string;
  booking_source: string;
  affiliate_url_template: string;
  commission_note: string | null;
  enabled: boolean;
  created_at: string;
}

// ─── Satır → uygulama tipi map'leri (snake_case → camelCase) ─────────────────
function mapRoute(r: RouteRow): Route {
  return {
    id: r.id,
    origin: r.origin,
    destination: r.destination,
    slug: r.slug,
    popular: r.popular,
    enabled: r.enabled,
    titleTr: r.title_tr,
    titleEn: r.title_en,
    descriptionTr: r.description_tr,
    descriptionEn: r.description_en,
    createdAt: r.created_at,
  };
}

function mapAirport(a: AirportRow): Airport {
  return {
    code: a.code,
    name: a.name,
    city: a.city,
    country: a.country,
    lat: a.lat,
    lng: a.lng,
  };
}

function mapAffiliate(l: AffiliateLinkRow): AffiliateLink {
  return {
    id: l.id,
    bookingSource: l.booking_source,
    affiliateUrlTemplate: l.affiliate_url_template,
    commissionNote: l.commission_note,
    enabled: l.enabled,
    createdAt: l.created_at,
  };
}

// ─── Rota / havalimanı okuma ────────────────────────────────────────────────
export async function getRouteBySlug(slug: string): Promise<Route | undefined> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from('routes')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw new Error(`[repo] getRouteBySlug: ${error.message}`);
  return data ? mapRoute(data as RouteRow) : undefined;
}

export async function getEnabledRoutes(): Promise<Route[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from('routes').select('*').eq('enabled', true);
  if (error) throw new Error(`[repo] getEnabledRoutes: ${error.message}`);
  return (data as RouteRow[]).map(mapRoute);
}

export async function getRouteByOriginDest(
  origin: string,
  destination: string,
): Promise<Route | undefined> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from('routes')
    .select('*')
    .eq('origin', origin)
    .eq('destination', destination)
    .maybeSingle();
  if (error) throw new Error(`[repo] getRouteByOriginDest: ${error.message}`);
  return data ? mapRoute(data as RouteRow) : undefined;
}

export async function getAirport(code: string): Promise<Airport | undefined> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from('airports')
    .select('*')
    .eq('code', code)
    .maybeSingle();
  if (error) throw new Error(`[repo] getAirport: ${error.message}`);
  return data ? mapAirport(data as AirportRow) : undefined;
}

// ─── price_cache ↔ FlightResult dönüşümleri ─────────────────────────────────
const VALID_CABINS: CabinClass[] = ['economy', 'business', 'premium', 'first'];

function toCabin(value: string | null): CabinClass {
  return VALID_CABINS.includes(value as CabinClass) ? (value as CabinClass) : 'economy';
}

/** price_cache satırı → FlightResult (Postgres price_usd → USD) */
function rowToFlightResult(row: PriceCacheRow): FlightResult {
  const price = row.price_usd ?? 0;
  return {
    id: row.flight_id ?? row.id,
    slug: row.id,
    carrierCode: row.airline_code ?? '',
    airline: row.airline_name ?? row.airline_code ?? '',
    departure: row.departure_city ?? row.departure_code ?? '',
    departureCode: row.departure_code ?? '',
    arrival: row.arrival_city ?? row.arrival_code ?? '',
    arrivalCode: row.arrival_code ?? '',
    departureTime: row.departure_time ?? '',
    arrivalTime: row.arrival_time ?? '',
    durationMinutes: row.duration_minutes ?? 0,
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
    bookingSource: row.booking_source ?? undefined,
  };
}

/** FlightResult → price_cache insert satırı (id/fetched_at DB üretir) */
function flightResultToInsert(
  routeId: string,
  departDate: string,
  f: FlightResult,
): Record<string, unknown> {
  return {
    route_id: routeId,
    depart_date: departDate,
    airline_code: f.carrierCode,
    airline_name: f.airline,
    flight_id: f.id,
    departure_city: f.departure,
    departure_code: f.departureCode,
    arrival_city: f.arrival,
    arrival_code: f.arrivalCode,
    departure_time: f.departureTime || null,
    arrival_time: f.arrivalTime || null,
    duration_minutes: f.durationMinutes,
    stops: f.stops,
    price_usd: f.price,
    booking_source: f.bookingSource ?? null,
    cabin: f.cabin,
    raw: f,
  };
}

// ─── Cache okuma ────────────────────────────────────────────────────────────
export async function getCachedFlights(
  routeId: string,
  departDate: string,
): Promise<FlightResult[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from('price_cache')
    .select('*')
    .eq('route_id', routeId)
    .eq('depart_date', departDate);
  if (error) throw new Error(`[repo] getCachedFlights: ${error.message}`);
  return (data as PriceCacheRow[]).map(rowToFlightResult);
}

export interface CachedRouteSnapshot {
  departDate: string | null;
  fetchedAt: string | null;
  flights: FlightResult[];
}

/**
 * Bir rota için cache'te bulunan EN YAKIN gelecekteki tarihin uçuşlarını döner.
 * Landing sayfası "en ucuz fiyat" özeti için kullanılır.
 */
export async function getNearestCachedFlights(routeId: string): Promise<CachedRouteSnapshot> {
  const sb = getSupabaseAdmin();
  const today = new Date().toISOString().slice(0, 10);

  // En yakın gelecekteki tarih (>= bugün).
  const { data: futureData, error: futureErr } = await sb
    .from('price_cache')
    .select('depart_date, fetched_at')
    .eq('route_id', routeId)
    .gte('depart_date', today)
    .order('depart_date', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (futureErr) throw new Error(`[repo] getNearestCachedFlights(future): ${futureErr.message}`);

  let chosen = futureData as { depart_date: string; fetched_at: string | null } | null;

  // Gelecekte yoksa herhangi bir tarih (en yeni depart_date).
  if (!chosen) {
    const { data: anyData, error: anyErr } = await sb
      .from('price_cache')
      .select('depart_date, fetched_at')
      .eq('route_id', routeId)
      .order('depart_date', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (anyErr) throw new Error(`[repo] getNearestCachedFlights(any): ${anyErr.message}`);
    chosen = anyData as { depart_date: string; fetched_at: string | null } | null;
  }

  if (!chosen?.depart_date) {
    return { departDate: null, fetchedAt: null, flights: [] };
  }

  const { data: rows, error: rowsErr } = await sb
    .from('price_cache')
    .select('*')
    .eq('route_id', routeId)
    .eq('depart_date', chosen.depart_date);
  if (rowsErr) throw new Error(`[repo] getNearestCachedFlights(rows): ${rowsErr.message}`);

  return {
    departDate: chosen.depart_date,
    fetchedAt: chosen.fetched_at,
    flights: (rows as PriceCacheRow[]).map(rowToFlightResult),
  };
}

// ─── Cache yazma: "yaz-önce-sil" (route_id + depart_date bazında) ────────────
export async function saveFlights(
  routeId: string,
  departDate: string,
  flights: FlightResult[],
): Promise<number> {
  const sb = getSupabaseAdmin();

  // Bu rota+tarih için eski snapshot'ı temizle (şişmeyi önle).
  const { error: delErr } = await sb
    .from('price_cache')
    .delete()
    .eq('route_id', routeId)
    .eq('depart_date', departDate);
  if (delErr) throw new Error(`[repo] saveFlights(delete): ${delErr.message}`);

  if (flights.length > 0) {
    const rows = flights.map((f) => flightResultToInsert(routeId, departDate, f));
    const { error: insErr } = await sb.from('price_cache').insert(rows);
    if (insErr) throw new Error(`[repo] saveFlights(insert): ${insErr.message}`);
  }

  return flights.length;
}

// ─── Fetch günlüğü ──────────────────────────────────────────────────────────
export async function logFetch(
  routeId: string | null,
  status: 'success' | 'error',
  flightsFound: number,
  error: string | null,
  durationMs: number,
): Promise<void> {
  const sb = getSupabaseAdmin();
  const { error: insErr } = await sb.from('fetch_log').insert({
    route_id: routeId,
    status,
    flights_found: flightsFound,
    error,
    duration_ms: durationMs,
  });
  if (insErr) {
    // Log yazımı kritik değil; worker'ı durdurma, yalnızca uyar.
    console.warn(`[repo] logFetch: ${insErr.message}`);
  }
}

// ─── Affiliate ──────────────────────────────────────────────────────────────
export async function getAffiliateLink(
  bookingSource: string,
): Promise<AffiliateLink | undefined> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from('affiliate_links')
    .select('*')
    .eq('booking_source', bookingSource)
    .eq('enabled', true)
    .maybeSingle();
  if (error) throw new Error(`[repo] getAffiliateLink: ${error.message}`);
  return data ? mapAffiliate(data as AffiliateLinkRow) : undefined;
}

/** enabled=true tüm affiliate linkleri (fallback seçimi için) */
export async function getEnabledAffiliateLinks(): Promise<AffiliateLink[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from('affiliate_links')
    .select('*')
    .eq('enabled', true)
    .order('created_at', { ascending: false });
  if (error) throw new Error(`[repo] getEnabledAffiliateLinks: ${error.message}`);
  return (data as AffiliateLinkRow[]).map(mapAffiliate);
}
