/**
 * İzgeTour — /go iç link üreticisi (DB'siz, client-safe).
 *
 * buildGoLink saf bir fonksiyondur; hiçbir sunucu/DB bağımlılığı yoktur, bu yüzden
 * client component'lerden güvenle import edilebilir. Gerçek affiliate çözümü
 * /go endpoint'inde (src/lib/affiliate.ts) yapılır.
 */

export interface GoLinkParams {
  source?: string;      // bookingSource (FAST, Kiwi, GoogleFlights, FlightNetwork...)
  origin: string;       // IATA (IST)
  destination: string;  // IATA (AYT)
  date?: string;        // YYYY-MM-DD
  price?: number;       // USD (ham cache fiyatı)
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
