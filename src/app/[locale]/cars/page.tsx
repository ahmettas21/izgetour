import { getTranslations } from 'next-intl/server';
import { cars } from '@/data/cars';
import { Car, Users, Gauge, Snowflake, ArrowRight } from 'lucide-react';

export default async function CarsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('cars');

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-zinc-900">{t('title')}</h1>
        <p className="mt-3 text-lg text-zinc-600">{t('subtitle')}</p>
      </div>

      {/* Search Form */}
      <div className="mb-12 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">{t('pickupLocation')}</label>
            <select className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none ring-zinc-300 focus:ring-2">
              <option>Antalya Havalimanı</option>
              <option>İstanbul Havalimanı</option>
              <option>İzmir Adnan Menderes</option>
              <option>Ankara Esenboğa</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">{t('dropoffLocation')}</label>
            <select className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none ring-zinc-300 focus:ring-2">
              <option>{t('pickupLocation')}</option>
              <option>Antalya Merkez</option>
              <option>Kemer</option>
              <option>Belek</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">{t('pickupDate')}</label>
            <input type="date" className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none ring-zinc-300 focus:ring-2" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">{t('dropoffDate')}</label>
            <input type="date" className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none ring-zinc-300 focus:ring-2" />
          </div>
          <div className="flex items-end">
            <button className="w-full rounded-full bg-[#0066CC] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0052a3]">
              {t('searchCar')}
            </button>
          </div>
        </div>
      </div>

      {/* Car Listings */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <div key={car.id} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100 transition-all hover:shadow-md">
            <div className="relative h-48 overflow-hidden bg-zinc-100">
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-200">
                <Car className="h-24 w-24 text-zinc-400" />
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-zinc-900">{car.name}</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                <span className="flex items-center gap-1 rounded-full bg-zinc-50 px-3 py-1 text-xs text-zinc-600">
                  <Users className="h-3 w-3" /> {car.seats} {t('seats')}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-zinc-50 px-3 py-1 text-xs text-zinc-600">
                  <Gauge className="h-3 w-3" /> {car.transmission === 'automatic' ? t('automatic') : t('manual')}
                </span>
                {car.ac && (
                  <span className="flex items-center gap-1 rounded-full bg-zinc-50 px-3 py-1 text-xs text-zinc-600">
                    <Snowflake className="h-3 w-3" /> {t('ac')}
                  </span>
                )}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
                <div>
                  <span className="text-2xl font-bold text-[#0066CC]">₺{car.pricePerDay.toLocaleString()}</span>
                  <span className="ml-1 text-sm text-zinc-400">/{t('perDay')}</span>
                </div>
                <button className="rounded-full bg-[#0066CC] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0052a3]">
                  {t('rentNow')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Airport Transfer Section */}
      <div className="mt-16 rounded-2xl bg-gradient-to-br from-[#0066CC] to-[#004d99] p-8 text-white sm:p-12">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{t('airportTransfer')}</h2>
            <p className="mt-2 text-white/80">{t('airportTransferDesc')}</p>
          </div>
          <div className="shrink-0 text-center">
            <div className="text-3xl font-bold">₺250</div>
            <div className="text-sm text-white/80">{t('transferFrom')}</div>
          </div>
          <button className="flex shrink-0 items-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-[#0066CC] transition-colors hover:bg-zinc-100">
            {t('contactUs')}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
