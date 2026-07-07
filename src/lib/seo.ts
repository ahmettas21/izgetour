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

export const BASE_URL = 'https://izgetour.com';

// ─── Kur ────────────────────────────────────────────────────────────────────
export function getUsdTryRate(): number {
  const raw = Number(process.env.FX_USD_TRY);
  return Number.isFinite(raw) && raw > 0 ? raw : 34;
}

export type Currency = 'USD' | 'TRY';

export interface FormattedPrice {
  amount: number;       // sayısal değer
  currency: Currency;
  display: string;      // gösterim metni (ör. "₺15.300")
  approximate: boolean; // TRY çevriminde true
}

/**
 * USD fiyatı verilen para birimine göre formatlar.
 * TRY seçilirse sabit kurla "yaklaşık" çevrim yapar.
 */
export function formatPrice(
  priceUsd: number,
  currency: Currency = 'TRY',
  locale: string = 'tr',
): FormattedPrice {
  if (currency === 'USD') {
    return {
      amount: priceUsd,
      currency: 'USD',
      display: `$${priceUsd.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US', { maximumFractionDigits: 0 })}`,
      approximate: false,
    };
  }

  const tryAmount = Math.round(priceUsd * getUsdTryRate());
  return {
    amount: tryAmount,
    currency: 'TRY',
    display: `₺${tryAmount.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`,
    approximate: true,
  };
}

// ─── En ucuz fiyatı bul ─────────────────────────────────────────────────────
export function cheapestFlight(flights: FlightResult[]): FlightResult | null {
  if (flights.length === 0) return null;
  return flights.reduce((min, f) => (f.price < min.price ? f : min), flights[0]);
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
  const priceStr = cheapest
    ? formatPrice(cheapest.price, 'TRY', locale).display
    : isTR ? 'değişken' : 'variable';
  const airlines = [...new Set(flights.map((f) => f.airline).filter(Boolean))];
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

  if (cheapest) {
    const price = formatPrice(cheapest.price, 'USD', locale); // Offer'da net kur: USD
    graph.push({
      '@type': 'Product',
      name: title,
      description: (isTR ? route.descriptionTr : route.descriptionEn) ?? title,
      url,
      offers: {
        '@type': 'Offer',
        price: price.amount,
        priceCurrency: 'USD',
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
