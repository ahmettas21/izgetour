import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { SEHIRLER, getSehir, slugToName } from '@/data/sehirler';
import { MOCK_FLIGHTS } from '@/data/flights';
import SeoHizliLinkler from '@/components/SeoHizliLinkler';
import { Plane, Clock, ArrowRight, Users, Luggage } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const sehir of SEHIRLER) {
    params.push({ locale: 'tr', slug: sehir.slug });
    params.push({ locale: 'en', slug: sehir.slug });
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const sehir = getSehir(slug);
  if (!sehir) return { title: 'Sayfa Bulunamadı' };

  const isTR = locale === 'tr';
  const title = isTR
    ? `${sehir.name} Uçak Bileti | İzgeTour`
    : `Flights to ${sehir.name} | İzgeTour`;
  const description = isTR
    ? `En uygun ${sehir.name} uçak bileti fiyatları. ${sehir.name}'a en ucuz uçuş fırsatlarını keşfedin, hemen rezervasyon yapın.`
    : `Find the best flight deals to ${sehir.name}. Discover cheap flights to ${sehir.name} and book now.`;

  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: sehir.image, width: 1200, height: 630 }] },
  };
}

export default async function UcakBiletiSehirPage({ params }: Props) {
  const { locale, slug } = await params;
  const sehir = getSehir(slug);
  if (!sehir) notFound();

  const isTR = locale === 'tr';
  const cityName = sehir.name;
  const sehirSlug = slug;

  // Filter flights arriving at this city
  const cityFlights = MOCK_FLIGHTS.filter((f) => f.arrival === cityName);

  // Group by departure city for display
  const departureCities = [...new Set(cityFlights.map((f) => f.departure))];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0066CC] to-[#004080] py-16 dark:from-[#003366] dark:to-[#002244]">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <Plane className="h-8 w-8 text-white/80" />
            <span className="text-sm font-semibold uppercase tracking-widest text-white/60">{isTR ? 'UÇAK BİLETİ' : 'FLIGHT TICKETS'}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {isTR ? `${cityName} Uçak Bileti Fiyatları` : `Flight Tickets to ${cityName}`}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/80">
            {isTR
              ? `En uygun ${cityName} uçak bileti fırsatları, güncel fiyatlar ve özel kampanyalar. ${cityName}'a seyahatinizi şimdi planlayın.`
              : `Best flight deals to ${cityName}, current prices and special campaigns. Plan your trip to ${cityName} now.`}
          </p>
        </div>
      </section>

      {/* Flight Listings */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        {departureCities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-700">
            <Plane className="mx-auto mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
              {isTR
                ? `Henüz ${cityName} için uçuş rotası bulunmamaktadır.`
                : `No flight routes to ${cityName} available yet.`}
            </p>
            <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
              {isTR ? 'Kısa süre içinde yeni rotalar eklenecektir.' : 'New routes will be added shortly.'}
            </p>
          </div>
        ) : (
          <>
            <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">
              {isTR ? `${cityName} Uçuş Rotaları` : `Flight Routes to ${cityName}`}
            </h2>
            <div className="space-y-4">
              {cityFlights.map((flight) => (
                <div
                  key={flight.id}
                  className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/80"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Departure → Arrival */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                        {flight.airlineCode}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-zinc-900 dark:text-white">{flight.airline}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${flight.stops === 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                            {flight.stops === 0
                              ? (isTR ? 'Direkt' : 'Non-stop')
                              : flight.stops === 1
                                ? `1 ${isTR ? 'aktarma' : 'stop'}`
                                : `${flight.stops} ${isTR ? 'aktarma' : 'stops'}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                          <span className="font-medium">{flight.departureCode}</span>
                          <ArrowRight className="h-3 w-3" />
                          <span className="font-medium">{flight.arrivalCode}</span>
                          <span className="ml-1">• {flight.departure} → {flight.arrival}</span>
                        </div>
                      </div>
                    </div>

                    {/* Time + Duration */}
                    <div className="flex items-center gap-3 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-zinc-900 dark:text-white">{flight.departureTime}</div>
                        <div className="text-[10px] text-zinc-400">{flight.departureCode}</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <Clock className="h-3 w-3 text-zinc-400" />
                        <span className="text-[10px] text-zinc-400">{flight.duration}</span>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-zinc-900 dark:text-white">{flight.arrivalTime}</div>
                        <div className="text-[10px] text-zinc-400">{flight.arrivalCode}</div>
                      </div>
                    </div>

                    {/* Price + Details */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#0066CC] dark:text-[#3399ff]">
                          ₺{flight.price.toLocaleString('tr-TR')}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                          <span className="flex items-center gap-0.5"><Users className="h-3 w-3" />{flight.availableSeats}</span>
                          <span className="flex items-center gap-0.5"><Luggage className="h-3 w-3" />{flight.baggage}</span>
                        </div>
                      </div>
                      <Link
                        href={`/flights/${flight.slug}`}
                        className="rounded-lg bg-[#0066CC] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0052a3] dark:bg-[#3399ff] dark:hover:bg-[#1a8cff]"
                      >
                        {isTR ? 'İncele' : 'Details'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Info Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Plane className="h-5 w-5" />
            </div>
            <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">
              {isTR ? 'En Ucuz Fiyat Garantisi' : 'Best Price Guarantee'}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {isTR
                ? `${cityName} uçak bileti için en uygun fiyatları karşılaştırın, en iyi teklifi bulun.`
                : `Compare the best prices for flights to ${cityName} and find the best deal.`}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">
              {isTR ? 'Hızlı & Kolay Rezervasyon' : 'Fast & Easy Booking'}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {isTR
                ? 'Birkaç tıklamayla rezervasyonunuzu tamamlayın, e-biletiniz anında gelsin.'
                : 'Complete your reservation in a few clicks, get your e-ticket instantly.'}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-6 sm:col-span-2 lg:col-span-1 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">
              {isTR ? '7/24 Müşteri Desteği' : '24/7 Customer Support'}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {isTR
                ? 'Seyahatinizle ilgili her konuda uzman ekibimiz size yardımcı olmaya hazır.'
                : 'Our expert team is ready to help you with anything about your trip.'}
            </p>
          </div>
        </div>
      </section>

      {/* Airport Info */}
      <section className="bg-zinc-50 py-12 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
            {isTR ? `${cityName} Havalimanları` : `Airports in ${cityName}`}
          </h2>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {isTR
                ? `${cityName} şehrine yapacağınız seyahat için en uygun uçak biletini İzgeTour ile bulun. İstanbul, Ankara, İzmir başta olmak üzere tüm Türkiye'den ${cityName} uçak bileti fırsatlarını karşılaştırın, en ucuz uçuşu yakalayın.`
                : `Find the best flight to ${cityName} with İzgeTour. Compare flight deals to ${cityName} from all major cities and catch the cheapest flight.`}
            </p>
          </div>
        </div>
      </section>

      {/* SEO Quick Links */}
      <SeoHizliLinkler locale={locale as 'tr' | 'en'} currentSlug={sehirSlug} />
    </div>
  );
}
