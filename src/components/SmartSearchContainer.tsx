'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Plane, Building2, Compass, ArrowRight, MapPin, Star, Hotel } from 'lucide-react';
import FlightSearchForm from '@/components/flights/FlightSearchForm';
import TourSearchBar from '@/components/TourSearchBar';
import HotelSearchBar from '@/components/HotelSearchBar';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { SearchParams } from '@/components/flights/types';
import { MOCK_TOURS } from '@/data/tours';
import { hotels as MOCK_HOTELS } from '@/data/hotels';

type Tab = 'flights' | 'tours' | 'hotels';

export default function SmartSearchContainer() {
  const t = useTranslations('flights');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('flights');
  const [tourQuery, setTourQuery] = useState('');
  const [hotelQuery, setHotelQuery] = useState('');

  const handleFlightSearch = async (_params: SearchParams) => {
    router.push('/flights');
  };

  const filteredTours = MOCK_TOURS.filter(
    (tour) =>
      tour.title.toLowerCase().includes(tourQuery.toLowerCase()) ||
      tour.titleEn.toLowerCase().includes(tourQuery.toLowerCase()) ||
      tour.location.toLowerCase().includes(tourQuery.toLowerCase()),
  ).slice(0, 3);

  const filteredHotels = MOCK_HOTELS.filter(
    (hotel) =>
      hotel.title.toLowerCase().includes(hotelQuery.toLowerCase()) ||
      hotel.titleEn.toLowerCase().includes(hotelQuery.toLowerCase()) ||
      hotel.city.toLowerCase().includes(hotelQuery.toLowerCase()),
  ).slice(0, 3);

  return (
    <div className="rounded-2xl bg-white/95 shadow-2xl backdrop-blur-sm dark:bg-gray-900/95">
      {/* ── Tab Bar ── */}
      <div className="border-b border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex gap-1">
            {([
              { key: 'flights' as Tab, icon: Plane, label: t('title') },
              { key: 'tours' as Tab, icon: Compass, label: t('toursTab') },
              { key: 'hotels' as Tab, icon: Building2, label: t('hotelsTab') },
            ] as const).map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`
                  flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors
                  ${activeTab === key
                    ? 'border-[var(--brand)] text-[var(--brand)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}
                `}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'flights' && (
        <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
          <FlightSearchForm onSearch={handleFlightSearch} />
        </div>
      )}

      {activeTab === 'tours' && (
        <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
          <TourSearchBar
            value={tourQuery}
            onChange={setTourQuery}
            placeholderTr="Tur arayın (ör: Kapadokya, Ege, Kültür...)"
            placeholderEn="Search tours (e.g. Cappadocia, Aegean...)"
            locale="tr"
          />

          {tourQuery && (
            <div className="mt-4 space-y-3">
              {filteredTours.length > 0 ? (
                filteredTours.map((tour) => (
                  <Link
                    key={tour.id}
                    href={`/tours/${tour.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-[var(--brand)] hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                      <Image src={tour.image} alt={tour.title} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand)]">
                        <MapPin className="h-3 w-3" />
                        {tour.location}
                      </span>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{tour.title}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {tour.rating}
                        </div>
                        <span>₺{tour.price.toLocaleString('tr-TR')}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[var(--brand)]" />
                  </Link>
                ))
              ) : (
                <p className="py-6 text-center text-sm text-gray-400">{t('noResults') || 'Sonuç bulunamadı'}</p>
              )}
            </div>
          )}

          {/* Quick links */}
          {!tourQuery && (
            <div className="mt-6 text-center">
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:underline"
              >
                {t('viewAllTours') || 'Tüm Turları Keşfet'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'hotels' && (
        <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
          <HotelSearchBar
            value={hotelQuery}
            onChange={setHotelQuery}
            placeholderTr="Otel arayın (ör: İstanbul, Antalya, Bodrum...)"
            placeholderEn="Search hotels (e.g. Istanbul, Antalya...)"
            locale="tr"
          />

          {hotelQuery && (
            <div className="mt-4 space-y-3">
              {filteredHotels.length > 0 ? (
                filteredHotels.map((h) => (
                  <Link
                    key={h.id}
                    href={`/hotels/${h.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-[var(--brand)] hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                      <Image src={h.image} alt={h.title} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand)]">
                        <Hotel className="h-3 w-3" />
                        {h.city}
                      </span>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{h.title}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {h.rating}
                        </div>
                        <span>₺{h.price.toLocaleString('tr-TR')}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[var(--brand)]" />
                  </Link>
                ))
              ) : (
                <p className="py-6 text-center text-sm text-gray-400">{t('noResults') || 'Sonuç bulunamadı'}</p>
              )}
            </div>
          )}

          {/* Quick links */}
          {!hotelQuery && (
            <div className="mt-6 text-center">
              <Link
                href="/hotels"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:underline"
              >
                {t('viewAllHotels') || 'Tüm Otelleri Keşfet'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
