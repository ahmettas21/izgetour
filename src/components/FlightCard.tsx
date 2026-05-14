'use client';

import { Link } from '@/i18n/navigation';
import { Clock, ArrowRight, Bell, BellOff, Users } from 'lucide-react';
import type { Flight } from '@/data/flights';
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
    <div className={`group rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
      isFollowed ? 'border-[#0066CC] ring-1 ring-[#0066CC]/20' : 'border-zinc-200'
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
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-700">
            {flight.airlineCode}
          </div>
          <div>
            <span className="flex items-center gap-2 text-sm font-medium text-zinc-900">
              {flight.airline}
              <span className={`text-xs font-semibold ${isDirect ? 'text-emerald-600' : 'text-amber-600'}`}>
                {isDirect ? '🟢' : '🟡'} {stopLabel}
              </span>
            </span>
            <span className="text-xs text-zinc-400">{flight.aircraft}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {flight.availableSeats <= 5 && (
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-medium text-red-600">
              {t('Son Koltuklar', 'Last Seats')}
            </span>
          )}
          <button
            onClick={() => onToggleFollow(flight.id)}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors ${
              isFollowed
                ? 'bg-[#0066CC] text-white'
                : 'border border-zinc-200 text-zinc-500 hover:border-[#0066CC] hover:text-[#0066CC]'
            }`}
          >
            {isFollowed ? <Bell className="h-3 w-3" /> : <BellOff className="h-3 w-3" />}
            {isFollowed ? t('Takipte', 'Tracking') : t('Takip Et', 'Track')}
          </button>
        </div>
      </div>

      {/* Ana İçerik: Gidiş → Varış + Fiyat */}
      <div className="flex items-center gap-4">
        {/* Kalkış */}
        <div className="min-w-[80px] text-center">
          <div className="text-xl font-bold text-zinc-900">{flight.departureTime}</div>
          <div className="text-xs text-zinc-500">{flight.departureCode}</div>
          <div className="truncate text-[11px] text-zinc-400">{flight.departure}</div>
        </div>

        {/* Zaman Çizelgesi */}
        <div className="flex flex-1 flex-col items-center px-2">
          <div className="flex items-center gap-1 text-[11px] text-zinc-400">
            <Clock className="h-3 w-3" />
            {flight.duration}
          </div>
          <div className="relative mt-1 flex w-full items-center">
            <div className="h-px flex-1 bg-zinc-200" />
            {/* Durak varsa nokta göster */}
            {flight.stopCities.map((city) => (
              <div key={city} className="relative mx-px">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-600">{city}</div>
                <div className="h-2 w-2 rounded-full border-2 border-amber-400 bg-white" />
              </div>
            ))}
            <div className={`${isDirect ? 'mx-auto' : ''} rounded-full bg-[#0066CC] p-1`}>
              <ArrowRight className="h-3.5 w-3.5 rotate-90 text-white" />
            </div>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>
        </div>

        {/* Varış */}
        <div className="min-w-[80px] text-center">
          <div className="text-xl font-bold text-zinc-900">{flight.arrivalTime}</div>
          <div className="text-xs text-zinc-500">{flight.arrivalCode}</div>
          <div className="truncate text-[11px] text-zinc-400">{flight.arrival}</div>
        </div>

        {/* Fiyat + Detay */}
        <div className="ml-auto w-[110px] text-right">
          {priceChanged && (
            <div className="text-[11px] font-medium text-emerald-600">
              ▼ %{Math.round((1 - flight.price / flight.originalPrice) * 100)} {t('düştü', 'off')}
            </div>
          )}
          <div className={`text-2xl font-bold ${priceChanged ? 'text-emerald-600' : 'text-[#0066CC]'}`}>
            ₺{formatPrice(flight.price)}
          </div>
          <div className="text-[11px] text-zinc-400">{t('kişi başı', 'per person')}</div>

          <div className="mt-2 flex items-center justify-end gap-1 text-[11px] text-zinc-400">
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

      {/* Alt Bilgi: Bagaj + İade */}
      <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
        <div className="flex items-center gap-3 text-[11px] text-zinc-400">
          <span>🧳 {flight.baggage}</span>
          <span>🛩️ {flight.aircraft}</span>
          <span>{flight.cabinClass === 'business' ? '💼 Business' : flight.cabinClass === 'premium' ? '✨ Premium' : '💺 Economy'}</span>
        </div>
        <div className="flex items-center gap-2">
          {flight.refundable ? (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
              {t('İade Edilebilir', 'Refundable')}
            </span>
          ) : (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-500">
              {t('İadesiz', 'Non-refundable')}
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
