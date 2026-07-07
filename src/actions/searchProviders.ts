/**
 * İzgeTour — Sağlayıcı zinciri (fallback mimarisi).
 *
 * Amaç: GENEL "0 sonuç → ikincil sağlayıcı dene" dayanıklılığı. Trabzon'a
 * özel değil; Skiplagged'de indekslenmeyen HERHANGİ bir rota için geçerli.
 *
 * Zincir (sıra önemli):
 *   1. Skiplagged (birincil — hidden-city, en zengin kaynak)
 *   2. Kiwi Tequila (yalnızca KIWI_API_KEY varsa; yoksa atlanır)
 *   3. Google Flights (FlareSolverr üzerinden HTML kazıma — aktif fallback)
 *
 * Kurallar:
 *  - Birincil >0 uçuş dönerse ikincil kaynaklar DENENMEZ (gereksiz yük yok).
 *  - Her sağlayıcı kendi try/catch'inde; biri patlarsa zincir devam eder.
 *  - Hiçbir kaynak sonuç vermezse temiz [] döner — ÇÖKMEZ.
 *  - Her sağlayıcı FlightResult[] döndürür (bookingSource normalize edilmiş).
 */
import type { FlightResult, SearchParams } from '@/components/flights/types';
import { searchSkiplaggedFlights } from './skiplagged';
import { searchGoogleFlights } from './googleflights';
import { searchKiwiFlights, isKiwiEnabled } from './kiwi';

export interface ProviderOutcome {
  flights: FlightResult[];
  /** Uçuşları veren sağlayıcı adı ('skiplagged' | 'kiwi' | 'googleflights' | 'none') */
  provider: 'skiplagged' | 'kiwi' | 'googleflights' | 'none';
  /** Denenen tüm sağlayıcılar + sonuç/hata özeti (loglama için) */
  attempts: Array<{ provider: string; count: number; error?: string }>;
}

type NamedProvider = {
  name: 'skiplagged' | 'kiwi' | 'googleflights';
  enabled: boolean;
  run: (p: SearchParams) => Promise<FlightResult[]>;
};

/**
 * Sağlayıcı zincirini sırayla dener. İlk >0 uçuş dönende durur.
 */
export async function searchFlightsWithFallback(
  params: SearchParams,
): Promise<ProviderOutcome> {
  const chain: NamedProvider[] = [
    { name: 'skiplagged', enabled: true, run: searchSkiplaggedFlights },
    { name: 'kiwi', enabled: isKiwiEnabled(), run: searchKiwiFlights },
    { name: 'googleflights', enabled: true, run: searchGoogleFlights },
  ];

  const attempts: ProviderOutcome['attempts'] = [];

  for (const provider of chain) {
    if (!provider.enabled) {
      attempts.push({ provider: provider.name, count: 0, error: 'disabled' });
      continue;
    }
    try {
      const flights = await provider.run(params);
      attempts.push({ provider: provider.name, count: flights.length });
      if (flights.length > 0) {
        return { flights, provider: provider.name, attempts };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      attempts.push({ provider: provider.name, count: 0, error: msg });
      // zincir devam etsin (bir sağlayıcı patlarsa diğerini dene)
    }
  }

  // Hiçbir kaynak uçuş vermedi → temiz boş sonuç (çökme yok)
  return { flights: [], provider: 'none', attempts };
}
