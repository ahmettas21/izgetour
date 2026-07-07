/**
 * İzgeTour — Worker: popüler rotaları FlareSolverr üzerinden çekip DB'ye yazar.
 *
 * Akış (ekip kararları):
 *  - getEnabledRoutes() → her rota için birkaç gelecekteki tarih
 *  - searchSkiplaggedFlights (FlareSolverr üzerinden) → saveFlights ("yaz-önce-sil")
 *  - logFetch ile her denemeyi kaydet
 *  - rotalar/tarihler arası jitter (2-5sn) — seri çekim, IP/rate-limit koruması
 *
 * Çalıştırma: npm run worker:once   (tek seferlik)
 * veya src/worker/index.ts üzerinden cron ile.
 */
import type { Airport } from '@/data/airports';
import type { SearchParams } from '@/components/flights/types';
import { searchFlightsWithFallback } from '@/actions/searchProviders';
import {
  getEnabledRoutes,
  getAirport,
  saveFlights,
  logFetch,
} from '@/db/repository';
import type { Route } from '@/db/schema';

// Bugünden itibaren çekilecek gün ofsetleri (ekip: 7-14-30 gün örneği)
const DEPART_OFFSETS_DAYS = [7, 14, 30];

// ─── Yardımcılar ────────────────────────────────────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** 2-5 saniye arası rastgele jitter */
function jitterMs(): number {
  return 2000 + Math.floor(Math.random() * 3000);
}

/** Bugün + offset gün → "YYYY-MM-DD" */
function futureDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/** IATA kodundan minimal Airport nesnesi (searchSkiplaggedFlights yalnızca iata kullanır) */
function toAirport(code: string): Airport {
  const a = getAirport(code);
  return {
    iata: code,
    city: a?.city ?? code,
    cityNative: a?.city ?? code,
    country: a?.country ?? '',
    countryCode: '',
    name: a?.name ?? code,
  };
}

/** Rota + tarih → SearchParams (oneway, 1 yetişkin, economy) */
function buildParams(route: Route, departDate: string): SearchParams {
  return {
    tripType: 'oneway',
    from: toAirport(route.origin),
    to: toAirport(route.destination),
    departDate,
    returnDate: '',
    passengers: { adult: 1, child: 0, infant: 0 },
    cabinClass: 'economy',
    segments: [],
  };
}

// ─── Ana worker akışı ───────────────────────────────────────────────────────
export interface WorkerSummary {
  routesProcessed: number;
  fetchAttempts: number;
  totalFlights: number;
  errors: number;
}

export async function runFetchRoutes(): Promise<WorkerSummary> {
  const routeList = getEnabledRoutes();
  console.log(`[worker] ${routeList.length} aktif rota bulundu.`);

  const summary: WorkerSummary = {
    routesProcessed: 0,
    fetchAttempts: 0,
    totalFlights: 0,
    errors: 0,
  };

  for (const route of routeList) {
    const label = `${route.origin}→${route.destination}`;

    for (const offset of DEPART_OFFSETS_DAYS) {
      const departDate = futureDate(offset);
      const started = Date.now();
      summary.fetchAttempts += 1;

      try {
        const params = buildParams(route, departDate);
        // Sağlayıcı zinciri: Skiplagged → (Kiwi) → Google Flights.
        // Birincil 0 dönerse ikincil kaynak otomatik denenir.
        const outcome = await searchFlightsWithFallback(params);
        const saved = saveFlights(route.id, departDate, outcome.flights);
        const durationMs = Date.now() - started;

        // Provider ve deneme özeti loglansın (0 sonuçta da fallback izlenebilsin)
        const attemptsStr = outcome.attempts
          .map((a) => `${a.provider}=${a.error ? `ERR(${a.error.slice(0, 40)})` : a.count}`)
          .join(', ');
        logFetch(route.id, 'success', saved, null, durationMs);
        summary.totalFlights += saved;
        console.log(
          `[worker] ${label} ${departDate}: ${saved} uçuş via ${outcome.provider} ` +
            `(${durationMs}ms) [${attemptsStr}]`,
        );
      } catch (err) {
        const durationMs = Date.now() - started;
        const msg = err instanceof Error ? err.message : String(err);
        logFetch(route.id, 'error', 0, msg, durationMs);
        summary.errors += 1;
        console.warn(`[worker] ${label} ${departDate}: HATA — ${msg}`);
      }

      // Seri çekim + jitter (IP/rate-limit koruması)
      await sleep(jitterMs());
    }

    summary.routesProcessed += 1;
  }

  console.log(
    `[worker] Bitti. Rota: ${summary.routesProcessed}, deneme: ${summary.fetchAttempts}, ` +
      `uçuş: ${summary.totalFlights}, hata: ${summary.errors}`,
  );

  return summary;
}

// tsx src/worker/fetchRoutes.ts ile doğrudan çalıştırılabilir
const isDirectRun = process.argv[1]?.includes('fetchRoutes');
if (isDirectRun) {
  runFetchRoutes()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[worker] ölümcül hata:', err);
      process.exit(1);
    });
}
