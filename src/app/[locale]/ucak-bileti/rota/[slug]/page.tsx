import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { Plane, Clock, ArrowRight, Info } from 'lucide-react';
import {
  getRouteBySlug,
  getEnabledRoutes,
  getNearestCachedFlights,
} from '@/db/repository';
import {
  buildFaq,
  buildRouteJsonLd,
  formatPrice,
  cheapestFlight,
  routeUrl,
} from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// ISR: popüler rotalar build'de, gerisi on-demand; saatte bir tazele.
export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  const routes = getEnabledRoutes();
  const params: { locale: string; slug: string }[] = [];
  for (const r of routes) {
    if (!r.slug) continue;
    params.push({ locale: 'tr', slug: r.slug });
    params.push({ locale: 'en', slug: r.slug });
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const route = getRouteBySlug(slug);
  if (!route) return { title: 'Sayfa Bulunamadı' };

  const isTR = locale === 'tr';
  const title = (isTR ? route.titleTr : route.titleEn) ?? `${route.origin} - ${route.destination}`;
  const description =
    (isTR ? route.descriptionTr : route.descriptionEn) ?? title;

  const trUrl = routeUrl(slug, 'tr');
  const enUrl = routeUrl(slug, 'en');
  const canonical = routeUrl(slug, locale);

  return {
    title: `${title} | İzgeTour`,
    description,
    alternates: {
      canonical,
      languages: {
        tr: trUrl,
        en: enUrl,
        'x-default': trUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'İzgeTour',
      type: 'website',
    },
  };
}

export default async function RotaLandingPage({ params }: Props) {
  const { locale, slug } = await params;
  const route = getRouteBySlug(slug);
  if (!route) notFound();

  const isTR = locale === 'tr';
  const title = (isTR ? route.titleTr : route.titleEn) ?? `${route.origin} - ${route.destination}`;
  const description = (isTR ? route.descriptionTr : route.descriptionEn) ?? title;

  // Cache'ten en yakın tarih snapshot'ı
  const snapshot = getNearestCachedFlights(route.id);
  const flights = [...snapshot.flights].sort((a, b) => a.price - b.price).slice(0, 10);
  const cheapest = cheapestFlight(snapshot.flights);
  const cheapestPrice = cheapest ? formatPrice(cheapest.price, 'TRY', locale) : null;

  // FAQ + JSON-LD
  const faq = buildFaq(route, snapshot.flights, locale);
  const jsonLd = buildRouteJsonLd(route, snapshot.flights, faq, locale);

  // "Son güncelleme" ibaresi
  const fetchedLabel = snapshot.fetchedAt
    ? new Date(snapshot.fetchedAt).toLocaleString(isTR ? 'tr-TR' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null;

  // İç linkleme: diğer popüler rotalar
  const otherRoutes = getEnabledRoutes()
    .filter((r) => r.slug && r.slug !== slug && r.popular)
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0066CC] to-[#004080] py-16 dark:from-[#003366] dark:to-[#002244]">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <Plane className="h-8 w-8 text-white/80" />
            <span className="text-sm font-semibold uppercase tracking-widest text-white/60">
              {isTR ? 'UÇAK BİLETİ' : 'FLIGHT TICKETS'}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/80">{description}</p>

          {cheapestPrice && (
            <div className="mt-6 inline-flex flex-col items-center rounded-2xl bg-white/10 px-6 py-4 backdrop-blur">
              <span className="text-xs uppercase tracking-wide text-white/60">
                {isTR ? 'Başlangıç fiyatı' : 'Starting from'}
              </span>
              <span className="text-3xl font-bold text-white">
                {cheapestPrice.display}
                {cheapestPrice.approximate && (
                  <span className="ml-1 align-middle text-xs font-normal text-white/60">
                    {isTR ? '(yaklaşık)' : '(approx.)'}
                  </span>
                )}
              </span>
              {fetchedLabel && (
                <span className="mt-1 text-[11px] text-white/50">
                  {isTR ? 'Son güncelleme: ' : 'Last updated: '}
                  {fetchedLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Flight Listings */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        {flights.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-700">
            <Plane className="mx-auto mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
              {isTR
                ? 'Bu rota için fiyatlar güncelleniyor. Lütfen kısa süre sonra tekrar deneyin.'
                : 'Prices for this route are being updated. Please check back shortly.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {isTR ? 'En Uygun Uçuşlar' : 'Best Flight Deals'}
              </h2>
              {snapshot.departDate && (
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {isTR ? 'Tarih: ' : 'Date: '}
                  {snapshot.departDate}
                </span>
              )}
            </div>
            <div className="space-y-4">
              {flights.map((flight) => {
                const price = formatPrice(flight.price, 'TRY', locale);
                return (
                  <div
                    key={flight.slug}
                    className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/80"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                          {flight.carrierCode || '✈'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                              {flight.airline || flight.carrierCode}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                flight.stops === 0
                                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                  : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                              }`}
                            >
                              {flight.stops === 0
                                ? isTR
                                  ? 'Direkt'
                                  : 'Non-stop'
                                : `${flight.stops} ${isTR ? 'aktarma' : 'stops'}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                            <span className="font-medium">{flight.departureCode}</span>
                            <ArrowRight className="h-3 w-3" />
                            <span className="font-medium">{flight.arrivalCode}</span>
                            {flight.bookingSource && (
                              <span className="ml-2 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                                {flight.bookingSource}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {flight.durationMinutes > 0 && (
                        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                          <Clock className="h-4 w-4" />
                          <span>
                            {Math.floor(flight.durationMinutes / 60)}s {flight.durationMinutes % 60}dk
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#0066CC] dark:text-[#3399ff]">
                            {price.display}
                          </div>
                          {price.approximate && (
                            <div className="text-[10px] text-zinc-400">
                              {isTR ? 'yaklaşık' : 'approx.'}
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/flights?from=${flight.departureCode}&to=${flight.arrivalCode}`}
                          className="rounded-lg bg-[#0066CC] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0052a3] dark:bg-[#3399ff] dark:hover:bg-[#1a8cff]"
                        >
                          {isTR ? 'Bileti Bul' : 'Find Ticket'}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fiyat teyit ibaresi */}
            <div className="mt-6 flex items-start gap-2 rounded-lg bg-zinc-50 p-4 text-xs text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                {isTR
                  ? 'Fiyatlar bilgilendirme amaçlıdır ve döviz kuru ile müsaitliğe göre değişebilir. Kesin fiyat için rezervasyon sayfasında teyit ediniz.'
                  : 'Prices are indicative and may vary based on exchange rate and availability. Please confirm the exact price on the booking page.'}
              </p>
            </div>
          </>
        )}
      </section>

      {/* SEO içerik bloğu */}
      <section className="bg-zinc-50 py-12 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white">
            {isTR
              ? `${route.origin} - ${route.destination} Uçuşları Hakkında`
              : `About ${route.origin} - ${route.destination} Flights`}
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {isTR
              ? `${route.origin} - ${route.destination} rotasında birçok havayolu düzenli sefer düzenlemektedir. İzgeTour ile güncel fiyatları karşılaştırabilir, size en uygun uçuşu bulabilirsiniz. Fiyatlar tarih, mevsim ve müsaitliğe göre değişkenlik gösterir; erken rezervasyon genellikle daha avantajlıdır.`
              : `Many airlines operate regular flights on the ${route.origin} - ${route.destination} route. With İzgeTour you can compare up-to-date prices and find the most suitable flight. Prices vary by date, season and availability; booking early is usually more advantageous.`}
          </p>

          {/* FAQ */}
          <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">
            {isTR ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
          </h3>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <details
                key={i}
                className="group rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <summary className="cursor-pointer text-sm font-semibold text-zinc-900 dark:text-white">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* İç linkleme: diğer popüler rotalar */}
      {otherRoutes.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">
            {isTR ? 'Popüler Rotalar' : 'Popular Routes'}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {otherRoutes.map((r) => (
              <Link
                key={r.id}
                href={`/ucak-bileti/rota/${r.slug}`}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:border-[#0066CC] hover:text-[#0066CC] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-[#3399ff] dark:hover:text-[#3399ff]"
              >
                {(isTR ? r.titleTr : r.titleEn) ?? `${r.origin} - ${r.destination}`}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
