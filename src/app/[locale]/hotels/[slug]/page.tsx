import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { hotels } from '@/data/hotels';
import { Check, MapPin, Star, Leaf } from 'lucide-react';
import PredictiveTripBundler from '@/components/PredictiveTripBundler';
import Breadcrumb from '@/components/Breadcrumb';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return hotels.map((hotel) => ({ slug: hotel.slug }));
}

export default async function HotelDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const hotel = hotels.find((h) => h.slug === slug);
  if (!hotel) notFound();

  const t = await getTranslations('hotels');
  const title = locale === 'tr' ? hotel.title : hotel.titleEn;
  const desc = locale === 'tr' ? hotel.description : hotel.descriptionEn;

  return (
    <>
      <Breadcrumb
        items={[
          { label: t('title'), href: '/hotels' },
          { label: title },
        ]}
        locale={locale as 'tr' | 'en'}
      />
      <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
        {/* Hero Image */}
        <div className="relative aspect-[21/9] overflow-hidden bg-zinc-100">
          <Image src={hotel.image} alt={title} fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <div className="mt-2 flex items-center gap-3 text-white/90">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {hotel.rating}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {locale === 'tr' ? 'Türkiye' : 'Turkey'}
              </span>
              {hotel.sustainabilityScore && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  <Leaf className="h-3.5 w-3.5 text-emerald-500" />
                  {hotel.sustainabilityScore}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-8 p-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <p className="text-lg leading-relaxed text-zinc-600">{desc}</p>

            {/* Amenities */}
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-bold text-zinc-900">{t('amenities')}</h2>
              <div className="flex flex-wrap gap-3">
                {hotel.amenities.map((amenity) => (
                  <span key={amenity} className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-4 py-2 text-sm text-zinc-700">
                    <Check className="h-4 w-4 text-emerald-500" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Room Selection */}
            <div className="mt-10">
              <h2 className="mb-6 text-xl font-bold text-zinc-900">{t('roomsAvailable')}</h2>
              <div className="divide-y divide-zinc-200 rounded-xl border border-zinc-200">
                {hotel.rooms.map((room) => {
                  const roomType = locale === 'tr' ? room.type : room.typeEn;
                  const board = locale === 'tr' ? room.board : room.boardEn;
                  return (
                    <div key={room.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-zinc-900">{roomType}</h3>
                        <div className="mt-1 flex flex-wrap gap-3 text-sm text-zinc-500">
                          <span>🧑 {room.maxGuests} {t('adults')}</span>
                          <span>🍽️ {board}</span>
</div>

            {/* Predictive Trip Bundler — hotel + transfer + tour bundle offers */}
            <div className="mt-10">
              <PredictiveTripBundler
                flight={{
                  id: hotel.id,
                  slug: hotel.slug,
                  airline: locale === 'tr' ? hotel.title : hotel.titleEn,
                  airlineCode: hotel.title.substring(0, 2).toUpperCase(),
                  departure: locale === 'tr' ? 'Havalimanı' : 'Airport',
                  departureCode: 'APT',
                  departureTime: '09:00',
                  arrival: hotel.city,
                  arrivalCode: hotel.city.substring(0, 3).toUpperCase(),
                  arrivalTime: '12:00',
                  price: hotel.price,
                  originalPrice: Math.round(hotel.price * 1.25),
                  duration: '3 saat',
                  durationMinutes: 180,
                  stops: 0,
                  stopCities: [],
                  aircraft: locale === 'tr' ? 'Konforlu Otel' : 'Comfortable Hotel',
                  cabinClass: 'economy',
                  departureDate: '2026-06-15',
                  baggage: locale === 'tr' ? 'Hersey Dahil' : 'All Inclusive',
                  refundable: true,
                  availableSeats: 10,
                  co2Emissions: 250,
                }}
                locale={locale as 'tr' | 'en'}
              />
            </div>
          </div>
                      <div className="flex shrink-0 items-center gap-4">
                        <div className="text-right">
                          <div className="text-xl font-bold text-[#0066CC]">₺{room.price.toLocaleString()}</div>
                          <div className="text-xs text-zinc-400">/{t('night')}</div>
                        </div>
                        <button className="rounded-full bg-[#0066CC] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0052a3]">
                          {t('bookNow')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="mb-5 text-center">
                <div className="text-sm text-zinc-500">{t('perNight')}</div>
                <div className="text-3xl font-bold text-[#0066CC]">
                  ₺{Math.min(...hotel.rooms.map((r) => r.price)).toLocaleString()}
                </div>
              </div>

              <div className="mb-4 space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">{t('checkIn')}</label>
                  <input type="date" className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none ring-zinc-300 focus:ring-2" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">{t('checkOut')}</label>
                  <input type="date" className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none ring-zinc-300 focus:ring-2" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">{t('adults')}</label>
                  <select className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none ring-zinc-300 focus:ring-2">
                    {[1, 2, 3, 4].map((n) => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <button className="w-full rounded-full bg-[#0066CC] py-3 font-semibold text-white transition-colors hover:bg-[#0052a3]">
                {t('bookNow')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
