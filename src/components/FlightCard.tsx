'use client';

import { Link } from '@/i18n/navigation';
import { Clock, ArrowRight, Bell, BellOff, Users, Heart } from 'lucide-react';
import type { Flight } from '@/data/flights';
import { useWishlist } from '@/hooks/useWishlist';
import SustainabilityScore from '@/components/SustainabilityScore';

type Props = {
  flight: Flight;
  isFollowed: boolean;
  onToggleFollow: (id: string) => void;
  locale: 'tr' | 'en';
  onSelect?: (flight: Flight) => void;
  // Compare mode
  isCompareSelected?: boolean;
  onToggleCompare?: (id: string) => void;
  showCompareCheckbox?: boolean;
};

export default function FlightCard({ flight, isFollowed, onToggleFollow, locale, onSelect: _onSelect, isCompareSelected, onToggleCompare, showCompareCheckbox }: Props) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const saved = isWishlisted(flight.id, 'flight');
  const t = (tr: string, en: string) => locale === 'tr' ? tr : en;
  const priceChanged = flight.price < flight.originalPrice;
  const formatPrice = (p: number) => p.toLocaleString('tr-TR');
  const isDirect = flight.stops === 0;
  const stopLabel = isDirect
    ? t('Direkt', 'Non-stop')
    : flight.stops === 1
      ? `1 ${t('aktarma', 'stop')}`
      : `${flight.stops} ${t('aktarma', 'stops')}`;

  return (
    <div className={`group rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-zinc-800/90 dark:shadow-zinc-900/50 dark:hover:shadow-zinc-800/70 ${
      isFollowed ? 'border-[#0066CC] ring-1 ring-[#0066CC]/20' : 'border-zinc-200 dark:border-zinc-700'
    }`}>
      {/* Header: Havayolu + Takip */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showCompareCheckbox && onToggleCompare && (
            <button
              onClick={() => onToggleCompare(flight.id)}
              className={`flex h-6 w-6 items-center justify-center rounded-md border-2 text-xs font-bold transition-all ${
                isCompareSelected
                  ? 'border-[#0066CC] bg-[#0066CC] text-white'
                  : 'border-zinc-300 text-transparent hover:border-[#0066CC]'
              }`}
            >
              {isCompareSelected ? '✓' : '·'}
            </button>
          )}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
            {flight.airlineCode}
          </div>
          <div>
            <span className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-white">
              {flight.airline}
              <span className={`text-xs font-semibold ${isDirect ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {isDirect ? '🟢' : '🟡'} {stopLabel}
              </span>
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">{flight.aircraft}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {flight.availableSeats <= 5 && (
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {t('Son Koltuklar', 'Last Seats')}
            </span>
          )}
          <button
            onClick={() => onToggleFollow(flight.id)}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors ${
              isFollowed
                ? 'bg-[#0066CC] text-white'
                : 'border border-zinc-200 text-zinc-500 hover:border-[#0066CC] hover:text-[#0066CC] dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-[#0066CC]'
            }`}
          >
            {isFollowed ? <Bell className="h-3 w-3" /> : <BellOff className="h-3 w-3" />}
            {isFollowed ? t('Takipte', 'Tracking') : t('Takip Et', 'Track')}
          </button>
          <button
            onClick={() => toggleWishlist({ id: flight.id, type: 'flight', title: `${flight.departureCode} → ${flight.arrivalCode}`, titleEn: `${flight.departureCode} → ${flight.arrivalCode}`, image: '', price: flight.price, slug: flight.slug || flight.id })}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition-all hover:scale-110 dark:border-zinc-700 dark:bg-zinc-800 dark:shadow-zinc-900/50"
            aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`h-3.5 w-3.5 transition-colors ${saved ? 'fill-red-500 text-red-500 dark:fill-red-500 dark:text-red-500' : 'text-zinc-400 dark:text-zinc-500'}`} />
          </button>
        </div>
      </div>

      {/* Ana Icerik: Gidis → Varis + Fiyat */}
      <div className="flex items-center gap-4">
        {/* Kalkis */}
        <div className="min-w-[80px] text-center">
          <div className="text-xl font-bold text-zinc-900 dark:text-white">{flight.departureTime}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">{flight.departureCode}</div>
          <div className="truncate text-[11px] text-zinc-400 dark:text-zinc-500">{flight.departure}</div>
        </div>

        {/* Zaman Cizelgesi */}
        <div className="flex flex-1 flex-col items-center px-2">
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500">
            <Clock className="h-3 w-3" />
            {flight.duration}
          </div>
          <div className="relative mt-1 flex w-full items-center">
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
            {/* Durak varsa nokta goster */}
            {flight.stopCities.map((city) => (
              <div key={city} className="relative mx-px">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">{city}</div>
                <div className="h-2 w-2 rounded-full border-2 border-amber-400 bg-white dark:border-amber-400 dark:bg-zinc-800" />
              </div>
            ))}
            <div className={`${isDirect ? 'mx-auto' : ''} rounded-full bg-[#0066CC] p-1`}>
              <ArrowRight className="h-3.5 w-3.5 rotate-90 text-white" />
            </div>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
          </div>
        </div>

        {/* Varis */}
        <div className="min-w-[80px] text-center">
          <div className="text-xl font-bold text-zinc-900 dark:text-white">{flight.arrivalTime}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">{flight.arrivalCode}</div>
          <div className="truncate text-[11px] text-zinc-400 dark:text-zinc-500">{flight.arrival}</div>
        </div>

        {/* Fiyat + Detay */}
        <div className="ml-auto w-[110px] text-right">
          {priceChanged && (
            <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              ▼ %{Math.round((1 - flight.price / flight.originalPrice) * 100)} {t('dustu', 'off')}
            </div>
          )}
          <div className={`text-2xl font-bold ${priceChanged ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#0066CC] dark:text-[#3399ff]'}`}>
            ₺{formatPrice(flight.price)}
          </div>
          <div className="text-[11px] text-zinc-400 dark:text-zinc-500">{t('kisi basi', 'per person')}</div>

          <div className="mt-2 flex items-center justify-end gap-1 text-[11px] text-zinc-400 dark:text-zinc-500">
            <Users className="h-3 w-3" />
            {flight.availableSeats} {t('koltuk', 'seats')}
          </div>

          {/* Detay Butonu */}
          <Link
            href={`/flights/${flight.slug}`}
            className="mt-2 inline-block rounded-lg bg-[#0066CC] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#0052a3]"
          >
            {t('Detay', 'Details')} →
          </Link>
        </div>
      </div>

      {/* Alt Bilgi: Bagaj + Iade */}
      <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-700">
        <div className="flex items-center gap-3 text-[11px] text-zinc-400 dark:text-zinc-500">
          <span className="dark:text-zinc-500">🧳 {flight.baggage}</span>
          <span>🛩️ {flight.aircraft}</span>
          <span>{flight.cabinClass === 'business' ? '💼 Business' : flight.cabinClass === 'premium' ? '✨ Premium' : '💺 Economy'}</span>
        </div>
        <div className="flex items-center gap-2">
          {flight.refundable ? (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              {t('Iade Edilebilir', 'Refundable')}
            </span>
          ) : (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-500 dark:bg-red-900/30 dark:text-red-400">
              {t('Iadesiz', 'Non-refundable')}
            </span>
          )}
          <SustainabilityScore
            co2Emissions={flight.co2Emissions}
            averageEmissions={320}
            ecoFriendly={isDirect}
            variant="badge"
          />
        </div>
      </div>
    </div>
  );
}
