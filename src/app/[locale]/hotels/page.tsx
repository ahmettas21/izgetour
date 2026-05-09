import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { hotels } from '@/data/hotels';
import { MapPin, Star } from 'lucide-react';

export default async function HotelsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('hotels');

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-zinc-900">{t('title')}</h1>
        <p className="mt-3 text-lg text-zinc-600">{t('subtitle')}</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filter Sidebar */}
        <aside className="w-full shrink-0 lg:w-72">
          <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-zinc-900">{t('filterTitle')}</h3>
            <div className="mb-4">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none ring-zinc-300 focus:ring-2"
              />
            </div>
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">{t('sortBy')}</label>
              <select className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none ring-zinc-300 focus:ring-2">
                <option>{t('priceLow')}</option>
                <option>{t('priceHigh')}</option>
                <option>{t('rating')}</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">{t('amenities')}</label>
              <div className="space-y-2">
                {['Özel Plaj', 'SPA & Wellness', 'Havuz', 'Ücretsiz WiFi'].map((a) => (
                  <label key={a} className="flex items-center gap-2 text-sm text-zinc-600">
                    <input type="checkbox" className="rounded border-zinc-300 text-[#0066CC] accent-[#0066CC]" />
                    {a}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Hotel Cards */}
        <div className="flex-1 space-y-6">
          {hotels.map((hotel) => {
            const title = locale === 'tr' ? hotel.title : hotel.titleEn;
            const desc = locale === 'tr' ? hotel.description : hotel.descriptionEn;
            const minPrice = Math.min(...hotel.rooms.map((r) => r.price));

            return (
              <Link
                key={hotel.id}
                href={`/${locale}/hotels/${hotel.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100 transition-all hover:shadow-md sm:flex-row"
              >
                <div className="relative h-48 shrink-0 sm:h-auto sm:w-64">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent sm:bg-none" />
                  <img
                    src={hotel.image}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-bold text-zinc-900 group-hover:text-[#0066CC]">{title}</h3>
                      <span className="flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-0.5 text-sm font-medium text-yellow-700">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {hotel.rating}
                      </span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm text-zinc-500">{desc}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="flex items-center gap-1 text-xs text-zinc-400">
                        <MapPin className="h-3 w-3" />
                        {locale === 'tr' ? 'Türkiye' : 'Turkey'}
                      </span>
                      {hotel.amenities.slice(0, 3).map((a) => (
                        <span key={a} className="rounded-full bg-zinc-50 px-2.5 py-0.5 text-xs text-zinc-500">{a}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
                    <span className="text-sm text-zinc-500">{t('rooms')}: {hotel.rooms.length}</span>
                    <div className="text-right">
                      <span className="text-xl font-bold text-[#0066CC]">₺{minPrice.toLocaleString()}</span>
                      <span className="ml-1 text-sm text-zinc-400">/{t('night')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
