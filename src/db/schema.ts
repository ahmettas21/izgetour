/**
 * İzgeTour — Drizzle SQLite şeması (Cache-First Flight Engine).
 *
 * Kararlara uyum:
 *  - uuid yerine text PK + crypto.randomUUID() (uygulama katmanında üretilir)
 *  - boolean → integer({ mode: 'boolean' })
 *  - jsonb → text({ mode: 'json' })
 *  - timestamptz → ISO string (text)
 *  - fiyat → priceUsdCents (INTEGER, cent cinsinden; sunumda ÷100)
 */
import { sql } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  real,
  index,
  unique,
} from 'drizzle-orm/sqlite-core';

// ─── airports — havalimanı sözlüğü ──────────────────────────────────────────
export const airports = sqliteTable('airports', {
  code: text('code').primaryKey(), // IATA kodu (ör. IST)
  name: text('name').notNull(),    // havalimanı adı
  city: text('city').notNull(),    // şehir adı
  country: text('country').notNull(),
  lat: real('lat'),                // enlem
  lng: real('lng'),                // boylam
});

// ─── routes — rota tanımları + SEO landing meta ─────────────────────────────
export const routes = sqliteTable(
  'routes',
  {
    id: text('id').primaryKey(),                    // crypto.randomUUID()
    origin: text('origin').notNull(),               // kalkış IATA (FK airports.code)
    destination: text('destination').notNull(),     // varış IATA (FK airports.code)
    slug: text('slug').unique(),                    // ör. "istanbul-antalya"
    popular: integer('popular', { mode: 'boolean' }).notNull().default(false),
    enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
    titleTr: text('title_tr'),
    titleEn: text('title_en'),
    descriptionTr: text('description_tr'),
    descriptionEn: text('description_en'),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [unique('routes_origin_destination_unique').on(t.origin, t.destination)],
);

// ─── priceCache — worker'ın yazdığı, sitenin okuduğu fiyat önbelleği ────────
export const priceCache = sqliteTable(
  'price_cache',
  {
    id: text('id').primaryKey(),                 // crypto.randomUUID()
    routeId: text('route_id'),                   // FK routes.id
    departDate: text('depart_date').notNull(),   // "YYYY-MM-DD"
    airlineCode: text('airline_code'),
    airlineName: text('airline_name'),
    flightId: text('flight_id'),                 // Skiplagged flight key
    departureCity: text('departure_city'),
    departureCode: text('departure_code'),
    arrivalCity: text('arrival_city'),
    arrivalCode: text('arrival_code'),
    departureTime: text('departure_time'),       // ISO string
    arrivalTime: text('arrival_time'),           // ISO string
    durationMinutes: integer('duration_minutes'),
    stops: integer('stops'),
    priceUsdCents: integer('price_usd_cents'),   // cent (÷100 sunumda)
    bookingSource: text('booking_source'),       // en ucuz rezervasyon sitesi
    cabin: text('cabin'),
    fetchedAt: text('fetched_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    raw: text('raw', { mode: 'json' }),          // ham normalize kayıt
  },
  (t) => [
    index('idx_price_cache_route_date').on(t.routeId, t.departDate),
    index('idx_price_cache_fetched_at').on(t.fetchedAt),
  ],
);

// ─── affiliateLinks — kaynak → affiliate URL şablonu ────────────────────────
export const affiliateLinks = sqliteTable('affiliate_links', {
  id: text('id').primaryKey(),
  bookingSource: text('booking_source').unique().notNull(), // ör. "Kiwi"
  affiliateUrlTemplate: text('affiliate_url_template').notNull(), // {origin}{destination}{date}
  commissionNote: text('commission_note'),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ─── fetchLog — worker çekim günlüğü ────────────────────────────────────────
export const fetchLog = sqliteTable('fetch_log', {
  id: text('id').primaryKey(),
  routeId: text('route_id'),
  status: text('status'),                     // success / error
  flightsFound: integer('flights_found'),
  error: text('error'),
  durationMs: integer('duration_ms'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ─── Tip çıkarımları (select/insert) ────────────────────────────────────────
export type Airport = typeof airports.$inferSelect;
export type NewAirport = typeof airports.$inferInsert;
export type Route = typeof routes.$inferSelect;
export type NewRoute = typeof routes.$inferInsert;
export type PriceCache = typeof priceCache.$inferSelect;
export type NewPriceCache = typeof priceCache.$inferInsert;
export type AffiliateLink = typeof affiliateLinks.$inferSelect;
export type NewAffiliateLink = typeof affiliateLinks.$inferInsert;
export type FetchLog = typeof fetchLog.$inferSelect;
export type NewFetchLog = typeof fetchLog.$inferInsert;
