/**
 * Google Flights fallback provider for İzgeTour.
 *
 * Neden: Bazı rotalar (ör. IST→TZX Trabzon) Skiplagged'de hiç indekslenmiyor
 * (status 200 ama 0 uçuş). Google Flights bu rotaları içeriyor. Skiplagged 0
 * dönerse ikincil kaynak olarak devreye girer.
 *
 * Yöntem: Google Flights sonuç sayfası FlareSolverr üzerinden (gerçek tarayıcı)
 * çekilir; uçuş satırları erişilebilirlik (aria-label) metinlerinden kazınır.
 * Bu metinler deterministik ve kararlıdır:
 *   "From 107 US dollars. Nonstop flight with Turkish Airlines. Leaves Istanbul
 *    Airport at 1:45 PM on Tuesday, July 14 and arrives at Trabzon Airport at
 *    3:30 PM on Tuesday, July 14. Total duration 1 hr 45 min. Select flight"
 *
 * NOT: Resmi API değildir; her zaman try/catch ile sarılıp temiz 0'a düşülmeli.
 * bookingSource = 'GoogleFlights' → /go affiliate redirect fallback'i kullanır.
 */
import type { FlightResult, SearchParams, CabinClass } from '@/components/flights/types';
import { fetchHtmlViaFlareSolverr } from '@/lib/flaresolverr';

export const GOOGLE_FLIGHTS_SOURCE = 'GoogleFlights';

const AIRLINE_CODE_BY_NAME: Record<string, string> = {
  'Turkish Airlines': 'TK',
  Pegasus: 'PC',
  'Pegasus Airlines': 'PC',
  SunExpress: 'XQ',
  AnadoluJet: 'AJ',
  'AJet': 'VF',
  Lufthansa: 'LH',
  'British Airways': 'BA',
  'Air France': 'AF',
  KLM: 'KL',
  'Qatar Airways': 'QR',
  Emirates: 'EK',
  Aegean: 'A3',
  'Aegean Airlines': 'A3',
};

function airlineCode(name: string): string {
  if (AIRLINE_CODE_BY_NAME[name]) return AIRLINE_CODE_BY_NAME[name];
  // Bilinmeyen: baş harflerden 2 harflik pseudo-kod türet
  const letters = name.replace(/[^A-Za-z]/g, '').toUpperCase();
  return letters.slice(0, 2) || 'XX';
}

/** "1 hr 45 min" / "2 hr" / "50 min" → dakika */
function parseDuration(text: string): number {
  const h = /(\d+)\s*hr/.exec(text);
  const m = /(\d+)\s*min/.exec(text);
  return (h ? parseInt(h[1], 10) * 60 : 0) + (m ? parseInt(m[1], 10) : 0);
}

/** "Nonstop" → 0, "1 stop" → 1, "2 stops" → 2 */
function parseStops(text: string): number {
  if (/nonstop/i.test(text)) return 0;
  const s = /(\d+)\s*stop/i.exec(text);
  return s ? parseInt(s[1], 10) : 0;
}

/**
 * "1:45 PM on Tuesday, July 14" (+ referans yıl) → ISO string.
 * Google saat dilimi yerel; yaklaşık ISO yeterli (sunum HH:mm kullanır).
 */
function toIso(timeAndDate: string, refYear: number): string {
  // timeAndDate: "1:45 PM on Tuesday, July 14"
  const m = /(\d{1,2}):(\d{2})\s*(AM|PM)\s+on\s+\w+,\s+(\w+)\s+(\d{1,2})/i.exec(timeAndDate);
  if (!m) return '';
  const [, hh, mm, ap, monthName, day] = m;
  const months: Record<string, number> = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  };
  const month = months[monthName.toLowerCase()];
  if (month == null) return '';
  let hour = parseInt(hh, 10) % 12;
  if (/pm/i.test(ap)) hour += 12;
  const d = new Date(refYear, month, parseInt(day, 10), hour, parseInt(mm, 10), 0);
  return d.toISOString();
}

interface ParsedFlight {
  price: number;
  airline: string;
  stops: number;
  depTime: string; // ISO
  arrTime: string; // ISO
  durationMinutes: number;
}

/**
 * aria-label metnini yapılandırılmış uçuşa çevirir. Eşleşmezse null.
 */
export function parseAriaLabel(label: string, refYear: number): ParsedFlight | null {
  // Fiyat: "From 107 US dollars" (bazı satırlar "From X US dollars round trip")
  const priceMatch = /From\s+([\d,]+)\s+US dollars/i.exec(label);
  if (!priceMatch) return null;
  const price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
  if (!Number.isFinite(price) || price <= 0) return null;

  const airlineMatch = /flight[s]?\s+with\s+([^.]+?)\./i.exec(label);
  const airline = airlineMatch ? airlineMatch[1].trim() : 'Unknown';

  const stops = parseStops(label);

  // "Leaves ... at <dep> and arrives at ... at <arr>."
  const legMatch = /Leaves\s+.+?\s+at\s+(.+?)\s+and\s+arrives at\s+.+?\s+at\s+(.+?)\.\s*Total duration\s+(.+?)\./i.exec(
    label,
  );
  let depTime = '';
  let arrTime = '';
  let durationMinutes = 0;
  if (legMatch) {
    depTime = toIso(legMatch[1], refYear);
    arrTime = toIso(legMatch[2], refYear);
    durationMinutes = parseDuration(legMatch[3]);
  } else {
    const durMatch = /Total duration\s+(.+?)\./i.exec(label);
    if (durMatch) durationMinutes = parseDuration(durMatch[1]);
  }

  return { price, airline, stops, depTime, arrTime, durationMinutes };
}

/** Google Flights HTML'inden uçuş aria-label'larını ayıkla + normalize et. */
function normalizeGoogleFlightsHtml(
  html: string,
  params: SearchParams,
  cabin: CabinClass,
): FlightResult[] {
  const refYear = new Date(params.departDate).getFullYear() || new Date().getFullYear();
  const fromCode = params.from!.iata;
  const toCode = params.to!.iata;
  const fromCity = params.from!.cityNative || params.from!.city || fromCode;
  const toCity = params.to!.cityNative || params.to!.city || toCode;

  // Uçuş satırı aria-label'ları "From <price> US dollars" ile başlar.
  const labels = [...html.matchAll(/aria-label="(From [\d,]+ US dollars[^"]{20,600})"/g)].map(
    (m) => m[1],
  );

  const deduped = new Map<string, FlightResult>();
  for (const label of labels) {
    const parsed = parseAriaLabel(label, refYear);
    if (!parsed) continue;

    const timeKey = parsed.depTime.slice(11, 16).replace(':', '') || String(deduped.size);
    const code = airlineCode(parsed.airline);
    const id = `gf-${code}-${fromCode}-${toCode}-${timeKey}`;
    if (deduped.has(id)) continue;

    deduped.set(id, {
      id,
      slug: `${code.toLowerCase()}-${fromCode.toLowerCase()}-${toCode.toLowerCase()}-${timeKey}`,
      carrierCode: code,
      airline: parsed.airline,
      departure: fromCity,
      departureCode: fromCode,
      arrival: toCity,
      arrivalCode: toCode,
      departureTime: parsed.depTime,
      arrivalTime: parsed.arrTime,
      durationMinutes: parsed.durationMinutes,
      stops: parsed.stops,
      stopCities: [],
      price: parsed.price,
      originalPrice: parsed.price,
      cabin,
      baggage: cabin === 'economy' ? 'Kabin' : '2x32kg',
      aircraft: '',
      availableSeats: 9,
      refundable: false,
      co2Emissions: 0,
      bookingSource: GOOGLE_FLIGHTS_SOURCE,
    });
  }

  return Array.from(deduped.values());
}

/**
 * Google Flights sonuç sayfasını FlareSolverr üzerinden çeker ve
 * FlightResult[] döndürür. Skiplagged ile aynı arayüz.
 */
export async function searchGoogleFlights(params: SearchParams): Promise<FlightResult[]> {
  if (!params.from || !params.to || !params.departDate) return [];

  // Google Flights doğal dil sorgusu URL'i (en kararlı yöntem).
  // curr=USD → fiyatlar dolar (price_cache cent USD ile uyumlu).
  const q = `Flights from ${params.from.iata} to ${params.to.iata} on ${params.departDate} oneway`;
  const url = `https://www.google.com/travel/flights?curr=USD&hl=en&q=${encodeURIComponent(q)}`;

  const html = await fetchHtmlViaFlareSolverr(url);
  return normalizeGoogleFlightsHtml(html, params, params.cabinClass);
}
