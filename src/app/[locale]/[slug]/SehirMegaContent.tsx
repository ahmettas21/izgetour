import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { SEHIRLER, getSehir } from '@/data/sehirler';
import { MOCK_FLIGHTS } from '@/data/flights';
import { hotels } from '@/data/hotels';
import { MOCK_TOURS } from '@/data/tours';
import SeoHizliLinkler from '@/components/SeoHizliLinkler';
import { Plane, Building2, Compass, MapPin, ArrowRight, Star, Clock } from 'lucide-react';

type Props = {
  params: { locale: string; slug: string };
};

function getTourLocations(sehirName: string): string[] {
  const map: Record<string, string[]> = {
    'İstanbul': ['İstanbul'],
    'Antalya': ['Antalya'],
    'İzmir': ['İzmir'],
    'Kapadokya': ['Nevşehir'],
    'Bodrum': ['Bodrum', 'Muğla'],
    'Marmaris': ['Marmaris', 'Muğla'],
    'Fethiye': ['Fethiye', 'Muğla'],
    'Pamukkale': ['Denizli'],
    'Trabzon': ['Trabzon'],
    'Efes': ['İzmir', 'Efes'],
  };
  return map[sehirName] || [sehirName];
}

export default function SehirMegaContent({ params }: Props) {
  const { locale, slug } = params;
  const sehir = getSehir(slug);
  if (!sehir) notFound();

  const isTR = locale === 'tr';
  const cityName = sehir.name;
  const sehirSlug = slug;

  const cityFlights = MOCK_FLIGHTS.filter((f) => f.arrival === cityName).slice(0, 3);
  const departureCities = [...new Set(MOCK_FLIGHTS.filter((f) => f.arrival === cityName).map((f) => f.departure))];
  const cityHotels = hotels.filter((h) => h.city === cityName).slice(0, 3);
  const locations = getTourLocations(cityName);
  const cityTours = MOCK_TOURS.filter((t) => locations.includes(t.location)).slice(0, 3);

  const hasFlights = cityFlights.length > 0;
  const hasHotels = cityHotels.length > 0;
  const hasTours = cityTours.length > 0;
  const hasBlog = !!sehir.blogSlug;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0066CC] via-[#004080] to-[#003366] py-20 dark:from-[#002244] dark:to-[#001122]">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            {isTR ? `${cityName}'a Hoş Geldiniz` : `Welcome to ${cityName}`}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/80">
            {isTR ? sehir.description : sehir.descriptionEn}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {hasFlights && (
              <Link
                href={`/ucak-bileti/${sehirSlug}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0066CC] shadow-lg transition-all hover:bg-zinc-100 dark:bg-zinc-800 dark:text-[#3399ff] dark:hover:bg-zinc-700"
              >
                <Plane className="h-4 w-4" />
                {isTR ? 'Uçak Bileti Bul' : 'Find Flights'}
              </Link>
            )}
            {hasHotels && (
              <Link
                href={`/${sehirSlug}-otelleri`}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/25"
              >
                <Building2 className="h-4 w-4" />
                {isTR ? 'Otelleri Gör' : 'View Hotels'}
              </Link>
            )}
            {hasTours && (
              <Link
                href={`/${sehirSlug}-turlari`}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/25"
              >
                <Compass className="h-4 w-4" />
                {isTR ? 'Turları Keşfet' : 'Explore Tours'}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Flights Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#0066CC] dark:text-[#3399ff]">
                <Plane className="h-4 w-4" />
                {isTR ? 'UÇAK BİLETİ' : 'FLIGHTS'}
              </div>
              <h2 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                {isTR ? `${cityName} Uçak Bileti` : `Flights to ${cityName}`}
              </h2>
            </div>
            {hasFlights && (
              <Link href={`/ucak-bileti/${sehirSlug}`} className="hidden items-center gap-1 text-sm font-semibold text-[#0066CC] hover:text-[#0052a3] sm:flex dark:text-[#3399ff]">
                {isTR ? 'Tüm Uçuşları Gör' : 'View All Flights'} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {hasFlights ? (
            <>
              <div className="mb-6 flex flex-wrap gap-2">
                {departureCities.slice(0, 6).map((city) => (
                  <Link key={city} href={`/ucak-bileti/${sehirSlug}`}
                    className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-all hover:border-[#0066CC] hover:text-[#0066CC] dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-[#3399ff] dark:hover:text-[#3399ff]">
                    {city} → {cityName}
                  </Link>
                ))}
              </div>
              <div className="space-y-3">
                {cityFlights.map((flight) => (
                  <div key={flight.id} className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-4 transition-all hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">{flight.airlineCode}</div>
                      <div>
                        <div className="text-sm font-semibold text-zinc-900 dark:text-white">{flight.airline}</div>
                        <div className="text-xs text-zinc-500">{flight.departureTime} → {flight.arrivalTime} · {flight.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#0066CC] dark:text-[#3399ff]">₺{flight.price.toLocaleString('tr-TR')}</div>
                        <div className="text-[10px] text-zinc-400">{flight.stops === 0 ? (isTR ? 'Direkt' : 'Non-stop') : `${flight.stops} ${isTR ? 'aktarma' : 'stop'}`}</div>
                      </div>
                      <Link href={`/flights/${flight.slug}`} className="rounded-lg bg-[#0066CC] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0052a3] dark:bg-[#3399ff]">{isTR ? 'Detay' : 'Detail'}</Link>
                    </div>
                  </div>
                ))}
              </div>
              <Link href={`/ucak-bileti/${sehirSlug}`} className="mt-4 flex items-center justify-center gap-1 text-sm font-semibold text-[#0066CC] sm:hidden dark:text-[#3399ff]">
                {isTR ? 'Tüm Uçuşları Gör' : 'View All Flights'} <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-700">
              <Plane className="mx-auto mb-2 h-8 w-8 text-zinc-300" />
              <p className="text-sm text-zinc-500">{isTR ? 'Henüz uçuş rotası eklenmedi.' : 'No flight routes added yet.'}</p>
            </div>
          )}
        </div>
      </section>

      {/* Hotels Section */}
      <section className="bg-zinc-50 py-16 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                <Building2 className="h-4 w-4" />
                {isTR ? 'OTELLER' : 'HOTELS'}
              </div>
              <h2 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">{isTR ? `${cityName} Otelleri` : `Hotels in ${cityName}`}</h2>
            </div>
            {hasHotels && (
              <Link href={`/${sehirSlug}-otelleri`} className="hidden items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 sm:flex dark:text-emerald-400">
                {isTR ? 'Tüm Otelleri Gör' : 'View All Hotels'} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {hasHotels ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cityHotels.map((hotel) => (
                  <div key={hotel.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-bold text-zinc-900 dark:text-white">{hotel.title}</h3>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="font-medium text-zinc-600">{hotel.rating}</span>
                      </div>
                    </div>
                    <p className="mb-3 text-xs leading-relaxed text-zinc-500 line-clamp-2">{isTR ? hotel.description : hotel.descriptionEn}</p>
                    <div className="mb-3 flex flex-wrap gap-1">
                      {hotel.amenities.slice(0, 3).map((a) => (
                        <span key={a} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-700">{a}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-700">
                      <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">₺{hotel.price.toLocaleString('tr-TR')}</div>
                      <Link href={`/hotels/${hotel.slug}`} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-500">{isTR ? 'İncele' : 'View'}</Link>
                    </div>
                  </div>
                ))}
              </div>
              <Link href={`/${sehirSlug}-otelleri`} className="mt-6 flex items-center justify-center gap-1 text-sm font-semibold text-emerald-600 sm:hidden dark:text-emerald-400">
                {isTR ? 'Tüm Otelleri Gör' : 'View All Hotels'} <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-700">
              <Building2 className="mx-auto mb-2 h-8 w-8 text-zinc-300" />
              <p className="text-sm text-zinc-500">{isTR ? 'Henüz otel kaydı eklenmedi.' : 'No hotel listings added yet.'}</p>
            </div>
          )}
        </div>
      </section>

      {/* Tours Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                <Compass className="h-4 w-4" />
                {isTR ? 'TURLAR' : 'TOURS'}
              </div>
              <h2 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">{isTR ? `${cityName} Turları` : `Tours in ${cityName}`}</h2>
            </div>
            {hasTours && (
              <Link href={`/${sehirSlug}-turlari`} className="hidden items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700 sm:flex dark:text-amber-400">
                {isTR ? 'Tüm Turları Gör' : 'View All Tours'} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {hasTours ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cityTours.map((tour) => (
                  <div key={tour.id} className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                    <div className="relative h-40 overflow-hidden bg-zinc-200 dark:bg-zinc-700">
                      <img src={tour.image} alt={isTR ? tour.title : tour.titleEn} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1 font-bold text-zinc-900 dark:text-white">{isTR ? tour.title : tour.titleEn}</h3>
                      <div className="mb-3 flex items-center gap-3 text-[11px] text-zinc-500">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{tour.location}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{tour.duration} {isTR ? 'gün' : 'day'}</span>
                        <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{tour.rating}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-amber-600 dark:text-amber-400">₺{tour.price.toLocaleString('tr-TR')}</div>
                        <Link href={`/tours/${tour.slug}`} className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 dark:bg-amber-500">{isTR ? 'İncele' : 'View'}</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href={`/${sehirSlug}-turlari`} className="mt-6 flex items-center justify-center gap-1 text-sm font-semibold text-amber-600 sm:hidden dark:text-amber-400">
                {isTR ? 'Tüm Turları Gör' : 'View All Tours'} <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-700">
              <Compass className="mx-auto mb-2 h-8 w-8 text-zinc-300" />
              <p className="text-sm text-zinc-500">{isTR ? 'Henüz tur kaydı eklenmedi.' : 'No tour listings added yet.'}</p>
            </div>
          )}
        </div>
      </section>

      {/* Blog Section */}
      {hasBlog && (
        <section className="bg-zinc-50 py-16 dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{isTR ? `${cityName}'da Gezilecek Yerler` : `Places to Visit in ${cityName}`}</h2>
              <p className="mt-2 text-sm text-zinc-500">{isTR ? `${cityName}'nın en güzel yerlerini keşfedin.` : `Discover the best places in ${cityName}.`}</p>
            </div>
            <div className="text-center">
              <Link href={`/blog/${sehir.blogSlug}`} className="inline-flex items-center gap-2 rounded-full bg-[#0066CC] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0052a3] dark:bg-[#3399ff]">
                <MapPin className="h-4 w-4" />
                {isTR ? 'Rehberi Oku' : 'Read Guide'}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="border-t border-zinc-100 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-4 text-center lg:grid-cols-4">
            <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
              <div className="text-2xl font-bold text-[#0066CC] dark:text-[#3399ff]">{departureCities.length}</div>
              <div className="text-xs text-zinc-500">{isTR ? 'Uçuş Rotası' : 'Flight Routes'}</div>
            </div>
            <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{cityHotels.length}</div>
              <div className="text-xs text-zinc-500">{isTR ? 'Otel Seçeneği' : 'Hotel Options'}</div>
            </div>
            <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{cityTours.length}</div>
              <div className="text-xs text-zinc-500">{isTR ? 'Tur Seçeneği' : 'Tour Options'}</div>
            </div>
            <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">★</div>
              <div className="text-xs text-zinc-500">{isTR ? 'Popüler Destinasyon' : 'Popular Destination'}</div>
            </div>
          </div>
        </div>
      </section>

      <SeoHizliLinkler locale={locale as 'tr' | 'en'} currentSlug={sehirSlug} />
    </div>
  );
}
