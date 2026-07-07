import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { Plane, Tag, Building2 } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  getRouteBySlug,
  getEnabledRoutes,
  getNearestCachedFlights,
} from '@/db/repository';
import {
  buildFaq,
  buildRouteJsonLd,
  formatPriceTRY,
  cheapestFlight,
  routeUrl,
  isValidPrice,
} from '@/lib/seo';
import { resolveAirline } from '@/lib/airlines';
import RouteFlightList from '@/components/flights/RouteFlightList';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

function SummaryStat({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 py-4 text-center sm:py-5">
      <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-400 sm:text-xs">
        {icon}
        {label}
      </span>
      <span
        className={`text-lg font-extrabold sm:text-xl ${
          highlight
            ? 'text-[#0066CC] dark:text-[#3399ff]'
            : 'text-zinc-900 dark:text-white'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

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

  // Cache'ten en yakın tarih snapshot'ı. Geçersiz fiyatlıları en baştan ele.
  const snapshot = getNearestCachedFlights(route.id);
  const validFlights = snapshot.flights.filter((f) => isValidPrice(f.price));
  const cheapest = cheapestFlight(validFlights);
  const cheapestPriceTRY = cheapest ? formatPriceTRY(cheapest.price) : null;

  // Özet bar metrikleri
  const flightCount = validFlights.length;
  const airlineCount = new Set(
    validFlights.map((f) => resolveAirline(f.carrierCode, f.airline).name),
  ).size;

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

          {cheapestPriceTRY && (
            <div className="mt-6 inline-flex flex-col items-center rounded-2xl bg-white/10 px-6 py-4 backdrop-blur">
              <span className="text-xs uppercase tracking-wide text-white/60">
                {isTR ? 'Başlangıç fiyatı' : 'Starting from'}
              </span>
              <span className="text-3xl font-bold text-white">
                {cheapestPriceTRY}
                <span className="ml-1 align-middle text-xs font-normal text-white/60">
                  {isTR ? '(yaklaşık)' : '(approx.)'}
                </span>
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

      {/* Özet bar */}
      {flightCount > 0 && (
        <section className="border-b border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-zinc-100 px-4 dark:divide-zinc-800">
            <SummaryStat
              icon={<Tag className="h-4 w-4" />}
              label={isTR ? 'En ucuz' : 'Cheapest'}
              value={cheapestPriceTRY ?? '—'}
              highlight
            />
            <SummaryStat
              icon={<Plane className="h-4 w-4" />}
              label={isTR ? 'Uçuş' : 'Flights'}
              value={String(flightCount)}
            />
            <SummaryStat
              icon={<Building2 className="h-4 w-4" />}
              label={isTR ? 'Havayolu' : 'Airlines'}
              value={String(airlineCount)}
            />
          </div>
        </section>
      )}

      {/* Flight Listings */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
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

        <RouteFlightList
          flights={validFlights}
          routeOrigin={route.origin}
          routeDestination={route.destination}
          departDate={snapshot.departDate}
          locale={locale}
        />
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
