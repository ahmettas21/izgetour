/**
 * İzgeTour — Affiliate link yardımcıları.
 *
 * İki katman:
 *  1. buildGoLink(params)  → landing sayfasında butona konan İÇ link: /go?source=...&origin=...
 *     (tıklama /go endpoint'inden geçer, orada gerçek affiliate URL'ye 302 redirect edilir)
 *  2. buildAffiliateUrl(source, params) → /go endpoint'i içinde çağrılır:
 *     affiliate_links tablosundaki template doldurulur; yoksa/enabled=false ise fallback.
 *
 * Template placeholder'ları: {origin} {destination} {date} {price}
 * İlker gerçek affiliate linklerini sonra girecek — sistem şimdiden hazır.
 */
import { getAffiliateLink } from '@/db/repository';

export interface GoLinkParams {
  source?: string;      // bookingSource (FAST, Kiwi, Skyscanner...)
  origin: string;       // IATA (IST)
  destination: string;  // IATA (AYT)
  date?: string;        // YYYY-MM-DD
  price?: number;       // USD (ham cache fiyatı)
}

/**
 * Genel fallback URL. Belirli bir affiliate yoksa veya kaynak pasifse buraya yönlendirilir.
 * env AFFILIATE_FALLBACK_URL verilebilir; verilmezse Skiplagged arama sayfası.
 */
export function fallbackUrl(params: {
  origin: string;
  destination: string;
  date?: string;
}): string {
  const base = process.env.AFFILIATE_FALLBACK_URL;
  if (base) {
    // env fallback da template olabilir; placeholder'ları doldur.
    return fillTemplate(base, params);
  }
  // Skiplagged arama URL (affiliate değil, sadece kullanıcıyı uçuşa götürür)
  const depart = params.date ?? '';
  return `https://skiplagged.com/flights/${encodeURIComponent(params.origin)}/${encodeURIComponent(
    params.destination,
  )}/${encodeURIComponent(depart)}`;
}

/**
 * Template içindeki {origin}{destination}{date}{price} placeholder'larını doldurur.
 */
export function fillTemplate(
  template: string,
  params: { origin: string; destination: string; date?: string; price?: number },
): string {
  return template
    .replaceAll('{origin}', encodeURIComponent(params.origin))
    .replaceAll('{destination}', encodeURIComponent(params.destination))
    .replaceAll('{date}', encodeURIComponent(params.date ?? ''))
    .replaceAll('{price}', encodeURIComponent(params.price != null ? String(params.price) : ''));
}

export interface ResolvedAffiliate {
  url: string;
  source: string | null;   // eşleşen aktif affiliate kaynağı (yoksa null)
  fallback: boolean;        // fallback'e mi düştü
}

/**
 * Bir kaynak (bookingSource) için gerçek affiliate URL'yi çözer.
 * - Aktif affiliate varsa: template doldurulur.
 * - Yoksa VEYA enabled=false ise: fallback URL.
 * /go endpoint'i içinde kullanılır.
 */
export function buildAffiliateUrl(
  source: string | undefined,
  params: { origin: string; destination: string; date?: string; price?: number },
): ResolvedAffiliate {
  if (source) {
    const link = getAffiliateLink(source); // getAffiliateLink zaten enabled=true filtreler
    if (link) {
      return {
        url: fillTemplate(link.affiliateUrlTemplate, params),
        source,
        fallback: false,
      };
    }
  }
  return {
    url: fallbackUrl(params),
    source: null,
    fallback: true,
  };
}

/**
 * Landing sayfası butonunun href'i: iç /go linki.
 * Tıklama endpoint'ten geçsin ki loglayıp gerçek affiliate'e yönlendirebilelim.
 */
export function buildGoLink(params: GoLinkParams): string {
  const q = new URLSearchParams();
  if (params.source) q.set('source', params.source);
  q.set('origin', params.origin);
  q.set('dest', params.destination);
  if (params.date) q.set('date', params.date);
  if (params.price != null) q.set('price', String(params.price));
  return `/go?${q.toString()}`;
}
