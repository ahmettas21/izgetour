/**
 * İzgeTour — SEO yardımcıları (programmatic rota landing sayfaları için).
 *
 * - formatPrice: USD → TRY yaklaşık çevrim (sabit kur, "yaklaşık" ibaresi)
 * - buildFaq: rota bazlı 5 SSS (schema.org FAQPage için)
 * - buildRouteJsonLd: BreadcrumbList + FAQPage + Product/Offer JSON-LD
 *
 * NOT: Sahte indirim yok — gösterilen fiyat gerçek cache fiyatıdır.
 */
import type { FlightResult } from '@/components/flights/types';
import type { Route } from '@/db/schema';
import { airlineName } from '@/lib/airlines';

export const BASE_URL = 'https://izgetour.com';

// ─── Kur ────────────────────────────────────────────────────────────────────
/** USD→TRY sabit kuru (env FX_USD_TRY, verilmezse 40). Tek kaynak. */
export const FX_USD_TRY: number = (() => {
  const raw = Number(process.env.FX_USD_TRY);
  return Number.isFinite(raw) && raw > 0 ? raw : 40;
})();

/** Geriye dönük uyumluluk: sabit kuru döner. */
export function getUsdTryRate(): number {
  return FX_USD_TRY;
}

/** Ham USD fiyatı geçerli mi? (0, negatif, NaN → geçersiz). */
export function isValidPrice(priceUsd: number | null | undefined): boolean {
  return typeof priceUsd === 'number' && Number.isFinite(priceUsd) && priceUsd > 0;
}

/** USD → TL (yuvarlanmış tam sayı, sabit kur). */
export function usdToTry(priceUsd: number): number {
  return Math.round(priceUsd * FX_USD_TRY);
}

export type Currency = 'TRY';

export interface FormattedPrice {
  amount: number;       // TL değeri (yuvarlanmış)
  currency: 'TRY';
  display: string;      // gösterim metni (ör. "₺15.300")
  approximate: boolean; // sabit kur çevriminde her zaman true
}

/**
 * Ham USD fiyatını TL'ye çevirip formatlar. TR sitesi → her yerde TL, tek birim.
 * Geçersiz fiyat (0/negatif/NaN) durumunda amount=0 döner; çağıran taraf
 * isValidPrice ile kontrol edip "fiyat için tıkla" gösterebilir.
 */
export function formatPrice(priceUsd: number): FormattedPrice {
  const tryAmount = isValidPrice(priceUsd) ? usdToTry(priceUsd) : 0;
  return {
    amount: tryAmount,
    currency: 'TRY',
    display: `₺${tryAmount.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`,
    approximate: true,
  };
}

/**
 * Ham USD fiyatı → "~2.600 TL" formatında TL gösterim (sabit kur, "~" yaklaşık).
 * Geçersiz fiyatta null döner → çağıran "Fiyat için tıkla" gösterebilir.
 */
export function formatPriceTRY(priceUsd: number): string | null {
  if (!isValidPrice(priceUsd)) return null;
  const tryAmount = usdToTry(priceUsd);
  return `~${tryAmount.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} TL`;
}

// ─── Saat / süre yardımcıları ───────────────────────────────────────────────
/**
 * ISO datetime veya "HH:mm" stringinden HH:mm gösterimi üretir.
 * Timezone offset'i olan ISO'da yerel duvar saati (kaynak TZ) korunur.
 */
export function displayTime(value: string | null | undefined): string {
  if (!value) return '';
  const s = String(value);
  // "2026-07-14T06:05:00+03:00" veya "2026-07-14T13:45:00.000Z"
  const m = s.match(/T(\d{2}):(\d{2})/);
  if (m) return `${m[1]}:${m[2]}`;
  // "HH:mm..." düz string
  const hm = s.match(/^(\d{2}):(\d{2})/);
  if (hm) return `${hm[1]}:${hm[2]}`;
  return '';
}

/** ISO datetime → epoch ms (offset dahil). Parse edilemezse null. */
function toEpoch(value: string | null | undefined): number | null {
  if (!value) return null;
  const t = Date.parse(String(value));
  return Number.isFinite(t) ? t : null;
}

/**
 * Uçuş süresini dakika olarak döndürür.
 * Öncelik: geçerli görünen durationMinutes; değilse kalkış/varış farkından
 * (offset'ler dahil) hesaplar. Hiçbiri olmazsa 0.
 * DB'deki bozuk timezone kaynaklı hatalı süreleri düzeltmek için kullanılır.
 */
export function resolveDurationMinutes(
  durationMinutes: number,
  departureTime: string | null | undefined,
  arrivalTime: string | null | undefined,
): number {
  const dep = toEpoch(departureTime);
  const arr = toEpoch(arrivalTime);
  if (dep != null && arr != null && arr > dep) {
    const diff = Math.round((arr - dep) / 60000);
    // 20 dk – 24 saat arası makul aralık
    if (diff >= 20 && diff <= 24 * 60) return diff;
  }
  if (Number.isFinite(durationMinutes) && durationMinutes >= 20 && durationMinutes <= 24 * 60) {
    return durationMinutes;
  }
  return 0;
}

/** Dakikayı "1s 35dk" (tr) / "1h 35m" (en) biçiminde gösterir. */
export function formatDuration(minutes: number, locale: string = 'tr'): string {
  if (!minutes || minutes <= 0) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const isTR = locale === 'tr';
  const hu = isTR ? 's' : 'h';
  const mu = isTR ? 'dk' : 'm';
  if (h === 0) return `${m}${mu}`;
  if (m === 0) return `${h}${hu}`;
  return `${h}${hu} ${m}${mu}`;
}

// ─── En ucuz fiyatı bul (geçersiz fiyatları eler) ───────────────────────────
export function cheapestFlight(flights: FlightResult[]): FlightResult | null {
  const valid = flights.filter((f) => isValidPrice(f.price));
  if (valid.length === 0) return null;
  return valid.reduce((min, f) => (f.price < min.price ? f : min), valid[0]);
}

// ─── FAQ üretimi ────────────────────────────────────────────────────────────
export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaq(
  route: Route,
  flights: FlightResult[],
  locale: string,
): FaqItem[] {
  const isTR = locale === 'tr';
  const origin = route.origin;
  const dest = route.destination;
  const cheapest = cheapestFlight(flights);
  const priceStr =
    cheapest && isValidPrice(cheapest.price)
      ? formatPrice(cheapest.price).display
      : isTR ? 'değişken' : 'variable';
  const airlines = [
    ...new Set(
      flights.map((f) => airlineName(f.carrierCode, f.airline)).filter(Boolean),
    ),
  ];
  const airlinesStr = airlines.length > 0
    ? airlines.slice(0, 4).join(', ')
    : isTR ? 'çeşitli havayolları' : 'various airlines';
  const directCount = flights.filter((f) => f.stops === 0).length;
  const minDuration = flights.length
    ? Math.min(...flights.map((f) => f.durationMinutes).filter((d) => d > 0))
    : 0;
  const durationStr = minDuration > 0
    ? `${Math.floor(minDuration / 60)}s ${minDuration % 60}dk`
    : isTR ? 'ortalama 1-2 saat' : 'about 1-2 hours';

  if (isTR) {
    return [
      {
        question: `${origin} - ${dest} uçak bileti ne kadar?`,
        answer: `${origin} - ${dest} arası uçak biletleri ${priceStr} seviyesinden başlamaktadır (yaklaşık, güncel kur ve müsaitliğe göre değişir).`,
      },
      {
        question: `${origin} - ${dest} arası kaç saat sürer?`,
        answer: `${origin} - ${dest} uçuşu yaklaşık ${durationStr} sürmektedir. Aktarmalı seçeneklerde süre uzayabilir.`,
      },
      {
        question: `${origin} - ${dest} arası hangi havayolları uçuyor?`,
        answer: `Bu rotada ${airlinesStr} gibi havayolları sefer düzenlemektedir.`,
      },
      {
        question: `${origin} - ${dest} direkt uçuş var mı?`,
        answer: directCount > 0
          ? `Evet, bu rotada direkt (aktarmasız) uçuş seçenekleri mevcuttur.`
          : `Şu an için ağırlıklı aktarmalı seçenekler listelenmektedir; müsaitliğe göre direkt uçuşlar da çıkabilir.`,
      },
      {
        question: `En ucuz ${origin} - ${dest} bileti nasıl bulunur?`,
        answer: `Farklı tarihleri karşılaştırarak ve fiyatları erkenden takip ederek en uygun ${origin} - ${dest} biletini bulabilirsiniz. İzgeTour fiyatları düzenli günceller.`,
      },
    ];
  }

  return [
    {
      question: `How much is a ${origin} - ${dest} flight ticket?`,
      answer: `Flights from ${origin} to ${dest} start around ${priceStr} (approximate, varies by date and availability).`,
    },
    {
      question: `How long is the ${origin} - ${dest} flight?`,
      answer: `The ${origin} - ${dest} flight takes about ${durationStr}. Connecting options may take longer.`,
    },
    {
      question: `Which airlines fly ${origin} - ${dest}?`,
      answer: `Airlines such as ${airlinesStr} operate on this route.`,
    },
    {
      question: `Are there direct ${origin} - ${dest} flights?`,
      answer: directCount > 0
        ? `Yes, direct (non-stop) flight options are available on this route.`
        : `Currently mostly connecting options are listed; direct flights may appear based on availability.`,
    },
    {
      question: `How to find the cheapest ${origin} - ${dest} ticket?`,
      answer: `Compare different dates and track prices early to find the best ${origin} - ${dest} deal. İzgeTour updates prices regularly.`,
    },
  ];
}

// ─── JSON-LD üretimi ────────────────────────────────────────────────────────
export function routeUrl(slug: string, locale: string): string {
  // localePrefix: 'as-needed' → tr (default) prefix'siz, en prefix'li
  const prefix = locale === 'tr' ? '' : `/${locale}`;
  return `${BASE_URL}${prefix}/ucak-bileti/rota/${slug}`;
}

export function buildRouteJsonLd(
  route: Route,
  flights: FlightResult[],
  faq: FaqItem[],
  locale: string,
): Record<string, unknown> {
  const isTR = locale === 'tr';
  const title = (isTR ? route.titleTr : route.titleEn) ?? `${route.origin} - ${route.destination}`;
  const url = routeUrl(route.slug ?? `${route.origin}-${route.destination}`.toLowerCase(), locale);
  const cheapest = cheapestFlight(flights);

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isTR ? 'Ana Sayfa' : 'Home',
        item: locale === 'tr' ? BASE_URL : `${BASE_URL}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isTR ? 'Uçak Bileti' : 'Flights',
        item: `${locale === 'tr' ? BASE_URL : `${BASE_URL}/${locale}`}/ucak-bileti`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: url,
      },
    ],
  };

  const faqPage = {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const graph: Record<string, unknown>[] = [breadcrumb, faqPage];

  if (cheapest && isValidPrice(cheapest.price)) {
    // TR sitesi → Offer da TL (TRY). price: TL değeri, priceCurrency: TRY.
    const price = formatPrice(cheapest.price);
    graph.push({
      '@type': 'Product',
      name: title,
      description: (isTR ? route.descriptionTr : route.descriptionEn) ?? title,
      url,
      offers: {
        '@type': 'Offer',
        price: price.amount,
        priceCurrency: 'TRY',
        availability: 'https://schema.org/InStock',
        url,
      },
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
