/**
 * İzgeTour — Seed script (idempotent).
 *
 * Çalıştırma: npm run db:seed
 * Havalimanları ve 10 popüler TR rotasını ekler. onConflictDoNothing ile
 * tekrar çalıştırılabilir (mevcut kayıtları bozmaz).
 */
import { randomUUID } from 'node:crypto';
import { getDb, getRawSqlite } from './index';
import { airports, routes, type NewAirport, type NewRoute } from './schema';

// ─── Havalimanları ──────────────────────────────────────────────────────────
const AIRPORTS: NewAirport[] = [
  { code: 'IST', name: 'İstanbul Havalimanı', city: 'İstanbul', country: 'Türkiye', lat: 41.2753, lng: 28.7519 },
  { code: 'AYT', name: 'Antalya Havalimanı', city: 'Antalya', country: 'Türkiye', lat: 36.8987, lng: 30.8005 },
  { code: 'ADB', name: 'İzmir Adnan Menderes Havalimanı', city: 'İzmir', country: 'Türkiye', lat: 38.2924, lng: 27.157 },
  { code: 'ESB', name: 'Ankara Esenboğa Havalimanı', city: 'Ankara', country: 'Türkiye', lat: 40.1281, lng: 32.9951 },
  { code: 'TZX', name: 'Trabzon Havalimanı', city: 'Trabzon', country: 'Türkiye', lat: 40.9951, lng: 39.7897 },
  { code: 'BJV', name: 'Bodrum-Milas Havalimanı', city: 'Bodrum', country: 'Türkiye', lat: 37.2506, lng: 27.6644 },
  { code: 'ADA', name: 'Adana Şakirpaşa Havalimanı', city: 'Adana', country: 'Türkiye', lat: 36.9822, lng: 35.2804 },
  { code: 'GZT', name: 'Gaziantep Havalimanı', city: 'Gaziantep', country: 'Türkiye', lat: 36.9472, lng: 37.4787 },
];

// ─── 10 popüler TR rotası (SEO landing meta ile) ────────────────────────────
type RouteSeed = Omit<NewRoute, 'id'>;

const ROUTES: RouteSeed[] = [
  {
    origin: 'IST', destination: 'AYT', popular: true, enabled: true, slug: 'istanbul-antalya',
    titleTr: 'İstanbul - Antalya Uçak Bileti', titleEn: 'Istanbul to Antalya Flights',
    descriptionTr: 'İstanbul Antalya arası en ucuz uçak biletlerini karşılaştırın ve anında rezervasyon yapın.',
    descriptionEn: 'Compare the cheapest flights from Istanbul to Antalya and book instantly.',
  },
  {
    origin: 'IST', destination: 'ADB', popular: true, enabled: true, slug: 'istanbul-izmir',
    titleTr: 'İstanbul - İzmir Uçak Bileti', titleEn: 'Istanbul to Izmir Flights',
    descriptionTr: 'İstanbul İzmir arası uygun fiyatlı uçuşları keşfedin.',
    descriptionEn: 'Discover affordable flights from Istanbul to Izmir.',
  },
  {
    origin: 'IST', destination: 'ESB', popular: true, enabled: true, slug: 'istanbul-ankara',
    titleTr: 'İstanbul - Ankara Uçak Bileti', titleEn: 'Istanbul to Ankara Flights',
    descriptionTr: 'İstanbul Ankara arası en iyi uçuş fırsatları burada.',
    descriptionEn: 'Best flight deals from Istanbul to Ankara.',
  },
  {
    origin: 'ESB', destination: 'ADB', popular: true, enabled: true, slug: 'ankara-izmir',
    titleTr: 'Ankara - İzmir Uçak Bileti', titleEn: 'Ankara to Izmir Flights',
    descriptionTr: 'Ankara İzmir arası uçak biletlerini karşılaştırın.',
    descriptionEn: 'Compare flights from Ankara to Izmir.',
  },
  {
    origin: 'IST', destination: 'TZX', popular: true, enabled: true, slug: 'istanbul-trabzon',
    titleTr: 'İstanbul - Trabzon Uçak Bileti', titleEn: 'Istanbul to Trabzon Flights',
    descriptionTr: 'İstanbul Trabzon arası en ucuz uçuşları bulun.',
    descriptionEn: 'Find the cheapest flights from Istanbul to Trabzon.',
  },
  {
    origin: 'IST', destination: 'BJV', popular: true, enabled: true, slug: 'istanbul-bodrum',
    titleTr: 'İstanbul - Bodrum Uçak Bileti', titleEn: 'Istanbul to Bodrum Flights',
    descriptionTr: 'İstanbul Bodrum arası tatil uçuşlarını karşılaştırın.',
    descriptionEn: 'Compare holiday flights from Istanbul to Bodrum.',
  },
  {
    origin: 'ADB', destination: 'AYT', popular: true, enabled: true, slug: 'izmir-antalya',
    titleTr: 'İzmir - Antalya Uçak Bileti', titleEn: 'Izmir to Antalya Flights',
    descriptionTr: 'İzmir Antalya arası uygun uçuş seçenekleri.',
    descriptionEn: 'Affordable flight options from Izmir to Antalya.',
  },
  {
    origin: 'IST', destination: 'ADA', popular: true, enabled: true, slug: 'istanbul-adana',
    titleTr: 'İstanbul - Adana Uçak Bileti', titleEn: 'Istanbul to Adana Flights',
    descriptionTr: 'İstanbul Adana arası en iyi bilet fiyatları.',
    descriptionEn: 'Best ticket prices from Istanbul to Adana.',
  },
  {
    origin: 'ESB', destination: 'AYT', popular: true, enabled: true, slug: 'ankara-antalya',
    titleTr: 'Ankara - Antalya Uçak Bileti', titleEn: 'Ankara to Antalya Flights',
    descriptionTr: 'Ankara Antalya arası uçuşları hızlıca karşılaştırın.',
    descriptionEn: 'Quickly compare flights from Ankara to Antalya.',
  },
  {
    origin: 'IST', destination: 'GZT', popular: true, enabled: true, slug: 'istanbul-gaziantep',
    titleTr: 'İstanbul - Gaziantep Uçak Bileti', titleEn: 'Istanbul to Gaziantep Flights',
    descriptionTr: 'İstanbul Gaziantep arası en ucuz uçak biletleri.',
    descriptionEn: 'Cheapest flights from Istanbul to Gaziantep.',
  },
];

async function main() {
  const db = getDb();

  // Havalimanları
  db.insert(airports).values(AIRPORTS).onConflictDoNothing().run();

  // Rotalar — id uygulama katmanında üretilir (uuid=text kararı)
  const routeRows: NewRoute[] = ROUTES.map((r) => ({ id: randomUUID(), ...r }));
  db.insert(routes).values(routeRows).onConflictDoNothing().run();

  // Doğrulama sayımları
  const raw = getRawSqlite();
  const airportCount = (raw.prepare('SELECT COUNT(*) AS c FROM airports').get() as { c: number }).c;
  const routeCount = (raw.prepare('SELECT COUNT(*) AS c FROM routes').get() as { c: number }).c;

  console.log(`[seed] airports: ${airportCount}, routes: ${routeCount}`);
}

main()
  .then(() => {
    console.log('[seed] tamamlandı.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('[seed] hata:', err);
    process.exit(1);
  });
