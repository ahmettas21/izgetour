'use client';

import { WifiOff, ClipboardList, Compass, Building2 } from 'lucide-react';
import Link from 'next/link';

const content = {
  tr: {
    heading: 'Çevrimdışı',
    description: 'İnternet bağlantısı yok gibi görünüyor. Bağlantı gelince tekrar deneyebilirsin.',
    savedBookings: 'Kaydedilen Rezervasyonlar',
    popularTours: 'Popüler Turlar',
    searchHotels: 'Otel Ara',
    retry: 'Tekrar Dene',
  },
  en: {
    heading: 'You are offline',
    description: 'It looks like you lost internet connection. Try again when you are back online.',
    savedBookings: 'Saved Bookings',
    popularTours: 'Popular Tours',
    searchHotels: 'Search Hotels',
    retry: 'Retry',
  },
};

export default function OfflinePage() {
  const isEn = navigator.language?.startsWith('en');
  const t = content[isEn ? 'en' : 'tr'];

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
        <WifiOff className="h-10 w-10 text-zinc-400" />
      </div>
      <h1 className="text-2xl font-bold text-zinc-900">{t.heading}</h1>
      <p className="mt-3 text-zinc-600">{t.description}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link href={`/${isEn ? 'en' : 'tr'}/dashboard`}
          className="rounded-xl border border-zinc-200 bg-white p-4 text-center shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50">
          <ClipboardList className="mx-auto h-7 w-7 text-[#0066CC]" />
          <p className="mt-2 text-sm font-medium text-zinc-900">{t.savedBookings}</p>
        </Link>
        <Link href={`/${isEn ? 'en' : 'tr'}/tours`}
          className="rounded-xl border border-zinc-200 bg-white p-4 text-center shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50">
          <Compass className="mx-auto h-7 w-7 text-[#0066CC]" />
          <p className="mt-2 text-sm font-medium text-zinc-900">{t.popularTours}</p>
        </Link>
        <Link href={`/${isEn ? 'en' : 'tr'}/hotels`}
          className="rounded-xl border border-zinc-200 bg-white p-4 text-center shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50">
          <Building2 className="mx-auto h-7 w-7 text-[#0066CC]" />
          <p className="mt-2 text-sm font-medium text-zinc-900">{t.searchHotels}</p>
        </Link>
      </div>

      <button onClick={() => location.reload()}
        className="mt-10 rounded-full bg-[#0066CC] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#0052a3]">
        {t.retry}
      </button>
    </div>
  );
}
