'use client';

import { useTranslations } from 'next-intl';
import { Bell, BellOff, Clock, Shield, Users, ArrowRight } from 'lucide-react';
import type { FlightOffer } from '@/actions/searchFlights';

interface FlightCardClientProps {
  flight: FlightOffer;
  isFollowed: boolean;
  onToggleFollow: (id: string) => void;
  isCompareSelected?: boolean;
  onToggleCompare?: (id: string) => void;
  showCompareCheckbox?: boolean;
  onSelect?: (flight: FlightOffer) => void;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export default function FlightCardClient({
  flight,
  isFollowed,
  onToggleFollow,
  isCompareSelected,
  onToggleCompare,
  showCompareCheckbox,
  onSelect,
}: FlightCardClientProps) {
  const t = useTranslations('flights');
  const priceChanged = flight.price < flight.originalPrice;
  const formatPrice = (p: number) => p.toLocaleString('tr-TR');
  const isDirect = flight.stops === 0;

  return (
    <div
      className={`
        group flex flex-col gap-4 rounded-2xl border bg-surface p-5 transition-all hover:shadow-xl hover:-translate-y-0.5
        ${isFollowed ? 'border-primary shadow-md ring-2 ring-primary/10' : 'border-border'}
        dark:bg-surface-elevated dark:border-border
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showCompareCheckbox && onToggleCompare && (
            <button
              onClick={() => onToggleCompare(flight.id)}
              className={`
                flex h-6 w-6 items-center justify-center rounded-md border-2 text-xs font-bold transition-all
                ${isCompareSelected
                  ? 'border-primary bg-primary text-white'
                  : 'border-border text-transparent hover:border-primary'}
              `}
            >
              {isCompareSelected ? '✓' : '·'}
            </button>
          )}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-primary/10 text-xs font-bold text-primary dark:bg-primary/20">
            {flight.carrierCode}
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              {flight.airline}
              <span className={`text-xs font-semibold ${isDirect ? 'text-success' : 'text-warning'}`}>
                {isDirect ? '🛫' : '🛬'}{' '}
                {isDirect ? t('nonstop') : `${flight.stops} ${t('stop')}`}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">{flight.aircraft}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {flight.seatsLeft <= 5 && (
            <span className="rounded-full bg-error/10 px-2.5 py-0.5 text-[11px] font-semibold text-error">
              {t('lastSeats', { count: flight.seatsLeft })}
            </span>
          )}
          <button
            onClick={() => onToggleFollow(flight.id)}
            className={`
              flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors
              ${isFollowed
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary hover:text-primary dark:border-border'}
            `}
          >
            {isFollowed ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
            {isFollowed ? t('tracking') : t('track')}
          </button>
        </div>
      </div>

      {/* Route */}
      <div className="flex items-center gap-4">
        <div className="min-w-[80px] text-center">
          <div className="text-2xl font-bold text-foreground">
            {formatTime(flight.departureAt)}
          </div>
          <div className="text-xs font-semibold text-muted-foreground">{flight.departureCode}</div>
          <div className="truncate text-[11px] text-muted-foreground">{flight.departure}</div>
        </div>

        <div className="flex flex-1 flex-col items-center px-2">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDuration(flight.durationMinutes)}
          </div>
          <div className="relative mt-1 flex w-full items-center">
            <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-primary/30" />
            {flight.stopCities.map((city) => (
              <div key={city} className="relative mx-px">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-warning/10 px-1.5 py-0.5 text-[10px] text-warning">
                  {city}
                </div>
                <div className="h-2 w-2 rounded-full border-2 border-warning bg-white" />
              </div>
            ))}
            <div className={`${isDirect ? 'mx-auto' : ''} rounded-full bg-primary p-1`}>
              <ArrowRight className="h-3 w-3 rotate-90 text-white" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-primary/30" />
          </div>
        </div>

        <div className="min-w-[80px] text-center">
          <div className="text-2xl font-bold text-foreground">
            {formatTime(flight.arrivalAt)}
          </div>
          <div className="text-xs font-semibold text-muted-foreground">{flight.arrivalCode}</div>
          <div className="truncate text-[11px] text-muted-foreground">{flight.arrival}</div>
        </div>

        {/* Price */}
        <div className="ml-auto w-[120px] text-right">
          {priceChanged && (
            <div className="text-[11px] font-medium text-success">
              ▼ %{Math.round((1 - flight.price / flight.originalPrice) * 100)} {t('off')}
            </div>
          )}
          <div className={`text-2xl font-extrabold ${priceChanged ? 'text-success' : 'text-primary'}`}>
            ₺{formatPrice(flight.price)}
          </div>
          <div className="text-[11px] text-muted-foreground">{t('perPerson')}</div>
          <div className="mt-2 flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
            <Users className="h-3 w-3" />
            {flight.seatsLeft} {t('seats')}
          </div>
          <button
            onClick={() => onSelect?.(flight)}
            className="mt-2 inline-block w-full rounded-xl bg-gradient-to-r from-primary to-primary/90 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-lg hover:scale-105 active:scale-95"
          >
            {t('select')} →
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border pt-3 dark:border-border">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>🧳 {flight.baggage}</span>
          <span>🛩️ {flight.aircraft}</span>
          <span>
            {flight.cabin === 'business'
              ? '💼 Business'
              : flight.cabin === 'premium'
                ? '✨ Premium'
                : '💺 Economy'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {flight.refundable ? (
            <span className="flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
              <Shield className="h-3 w-3" /> {t('refundable')}
            </span>
          ) : (
            <span className="rounded-full border border-error/20 bg-error/10 px-2 py-0.5 text-[11px] font-medium text-error">
              {t('nonRefundable')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
