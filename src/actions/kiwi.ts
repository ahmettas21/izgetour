/**
 * Kiwi (Tequila) fallback provider — ENV ile devre dışı bırakılabilir.
 *
 * DURUM (2026 araştırması): Kiwi.com, Tequila API'sinin PUBLIC self-service
 * kaydını 30 Mayıs 2024'te kapattı. Erişim artık yalnızca davetli B2B
 * partnerlik ile ve yüksek hacim şartıyla mümkün. Bağımsız ürünler için
 * self-serve API key YOK. Bu yüzden varsayılan olarak DEVRE DIŞI.
 *
 * Yine de: KIWI_API_KEY ortam değişkeni tanımlanırsa (bir gün partner key
 * gelirse) provider otomatik aktifleşir. Key yoksa boş dizi döner — HATA
 * FIRLATMAZ (fallback zinciri temiz devam etsin).
 *
 * Aktif fallback Google Flights'tır (src/actions/googleflights.ts).
 */
import type { FlightResult, SearchParams, CabinClass } from '@/components/flights/types';

export const KIWI_SOURCE = 'Kiwi';

const TEQUILA_SEARCH = 'https://api.tequila.kiwi.com/v2/search';

interface KiwiRoute {
  airline: string;
  flight_no: number;
  cityFrom: string;
  cityCodeFrom: string;
  flyFrom: string;
  cityTo: string;
  cityCodeTo: string;
  flyTo: string;
  local_departure: string;
  local_arrival: string;
}
interface KiwiFlight {
  id: string;
  price: number; // USD (curr=USD ile)
  airlines: string[];
  route: KiwiRoute[];
  duration: { total: number }; // saniye
  deep_link?: string;
}
interface KiwiResponse {
  data?: KiwiFlight[];
}

/** Kiwi provider aktif mi? (yalnızca key varsa) */
export function isKiwiEnabled(): boolean {
  return !!process.env.KIWI_API_KEY;
}

/** "YYYY-MM-DD" → "DD/MM/YYYY" (Tequila formatı) */
function toKiwiDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function normalizeKiwi(f: KiwiFlight, cabin: CabinClass): FlightResult | null {
  if (!f.route?.length) return null;
  const first = f.route[0];
  const last = f.route[f.route.length - 1];
  const code = f.airlines[0] ?? first.airline ?? 'XX';
  const stops = Math.max(0, f.route.length - 1);
  return {
    id: f.id,
    slug: `${code.toLowerCase()}-${first.flyFrom.toLowerCase()}-${last.flyTo.toLowerCase()}-${first.local_departure.slice(11, 16).replace(':', '')}`,
    carrierCode: code,
    airline: code,
    departure: first.cityFrom,
    departureCode: first.flyFrom,
    arrival: last.cityTo,
    arrivalCode: last.flyTo,
    departureTime: first.local_departure,
    arrivalTime: last.local_arrival,
    durationMinutes: Math.round((f.duration?.total ?? 0) / 60),
    stops,
    stopCities: f.route.slice(0, -1).map((r) => r.flyTo),
    price: f.price,
    originalPrice: f.price,
    cabin,
    baggage: cabin === 'economy' ? 'Kabin' : '2x32kg',
    aircraft: '',
    availableSeats: 9,
    refundable: false,
    co2Emissions: 0,
    bookingSource: KIWI_SOURCE,
  };
}

/**
 * Kiwi Tequila araması. Key yoksa boş dizi (disabled), HATA FIRLATMAZ.
 */
export async function searchKiwiFlights(params: SearchParams): Promise<FlightResult[]> {
  const apiKey = process.env.KIWI_API_KEY;
  if (!apiKey) return []; // disabled — sessizce boş
  if (!params.from || !params.to || !params.departDate) return [];

  const qs = new URLSearchParams({
    fly_from: params.from.iata,
    fly_to: params.to.iata,
    date_from: toKiwiDate(params.departDate),
    date_to: toKiwiDate(params.departDate),
    adults: String(params.passengers.adult || 1),
    children: String(params.passengers.child || 0),
    infants: String(params.passengers.infant || 0),
    curr: 'USD',
    limit: '30',
    one_for_city: '0',
    flight_type: 'oneway',
  });

  const res = await fetch(`${TEQUILA_SEARCH}?${qs.toString()}`, {
    headers: { apikey: apiKey, accept: 'application/json' },
    cache: 'no-store',
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    throw new Error(`Kiwi Tequila API hatası: HTTP ${res.status}`);
  }

  const data: KiwiResponse = await res.json();
  const out: FlightResult[] = [];
  for (const f of data.data ?? []) {
    const n = normalizeKiwi(f, params.cabinClass);
    if (n) out.push(n);
  }
  return out;
}
