'use client';

import { useTranslations } from 'next-intl';
import { Bell, BellOff, Clock, Shield, Users, ArrowRight, ShoppingCart, Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import type { FlightResult } from './types';

interface FlightCardProps {
  flight: FlightResult;
  isFollowed: boolean;
  onToggleFollow: (id: string) => void;
  isCompareSelected?: boolean;
  onToggleCompare?: (id: string) => void;
  showCompareCheckbox?: boolean;
  onSelect?: (flight: FlightResult) => void;
  className?: string;
}

/** Parse ISO datetime string to HH:mm display */
function formatTime(iso: string): string {
  // Handle both ISO strings and "HH:mm" strings
  if (iso.includes('T')) {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  return iso.substring(0, 5);
}

/** Format minutes to "Xh Ym" */
function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export default function FlightCard({
  flight,
  isFollowed,
  onToggleFollow,
  isCompareSelected,
  onToggleCompare,
  showCompareCheckbox,
  onSelect,
  className = '',
}: FlightCardProps) {
  const t = useTranslations('flights');
  const { isWishlisted, toggleWishlist } = useWishlist();
  const hasDiscount = flight.price < flight.originalPrice;
  const isDirect = flight.stops === 0;
  const saved = isWishlisted(flight.id, 'flight');

  return (
    <div
      className={`
        group flex flex-col gap-4 rounded-2xl border bg-surface p-5 transition-all hover:shadow-xl hover:-translate-y-0.5
        ${isFollowed ? 'border-primary shadow-md ring-2 ring-primary/10' : 'border-border'}
        ${className}
        dark:bg-surface-elevated dark:border-border
      `}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Compare checkbox */}
          {showCompareCheckbox && onToggleCompare && (
            <button
              onClick={() => onToggleCompare(flight.id)}
              className={`
                flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-xs font-bold transition-all
                ${isCompareSelected
                  ? 'border-primary bg-primary text-white'
                  : 'border-border text-transparent hover:border-primary'}
              `}
            >
              {isCompareSelected ? '✓' : '·'}
            </button>
          )}

          {/* Airline logo */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-primary/10 text-xs font-bold text-primary dark:bg-primary/20">
            {flight.carrierCode}
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              {flight.airline}
              <span
                className={`text-xs font-semibold ${isDirect ? 'text-success' : 'text-warning'}`}
              >
                {isDirect ? '🛫' : '🛬'}{' '}
                {isDirect ? t('nonstop') : `${flight.stops} ${t('stop')}`}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">{flight.aircraft}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Last seats badge */}
          {flight.availableSeats <= 5 && (
            <span className="rounded-full bg-error/10 px-2.5 py-0.5 text-[11px] font-semibold text-error">
              {t('lastSeats', { count: flight.availableSeats })}
            </span>
          )}

          {/* Track button */}
          <button
            onClick={() => onToggleFollow(flight.id)}
            className={`
              flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors
              ${isFollowed
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary hover:text-primary dark:border-border'}
            `}
          >
            {isFollowed ? (
              <Bell className="h-3.5 w-3.5" />
            ) : (
              <BellOff className="h-3.5 w-3.5" />
            )}
            {isFollowed ? t('tracking') : t('track')}
          </button>

          {/* Wishlist button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist({
                id: flight.id,
                type: 'flight',
                title: `${flight.departureCode} → ${flight.arrivalCode}`,
                titleEn: `${flight.departureCode} → ${flight.arrivalCode}`,
                price: flight.price,
                slug: flight.slug,
              });
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-all hover:scale-110 dark:bg-zinc-800"
            aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`h-4 w-4 transition-colors ${saved ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
          </button>
        </div>
      </div>

      {/* ── Route ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Departure */}
        <div className="min-w-[80px] text-center">
          <div className="text-2xl font-bold text-foreground">
            {formatTime(flight.departureTime)}
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            {flight.departureCode}
          </div>
          <div className="truncate text-[11px] text-muted-foreground">
            {flight.departure}
          </div>
        </div>

        {/* Timeline */}
        <div className="flex flex-1 flex-col items-center px-2">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDuration(flight.durationMinutes)}
          </div>
          <div className="relative mt-1 flex w-full items-center">
            <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-primary/30" />

            {/* Stop markers */}
            {flight.stopCities.map((city) => (
              <div key={city} className="relative mx-px">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-warning/10 px-1.5 py-0.5 text-[10px] text-warning">
                  {city}
                </div>
                <div className="h-2 w-2 rounded-full border-2 border-warning bg-white" />
              </div>
            ))}

            {/* Arrow */}
            <div className={`${isDirect ? 'mx-auto' : ''} rounded-full bg-primary p-1`}>
              <ArrowRight className="h-3 w-3 rotate-90 text-white" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-primary/30" />
          </div>
        </div>

        {/* Arrival */}
        <div className="min-w-[80px] text-center">
          <div className="text-2xl font-bold text-foreground">
            {formatTime(flight.arrivalTime)}
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            {flight.arrivalCode}
          </div>
          <div className="truncate text-[11px] text-muted-foreground">
            {flight.arrival}
          </div>
        </div>

        {/* Price */}
        <div className="ml-auto w-[120px] text-right">
          {hasDiscount && (
            <div className="text-[11px] font-medium text-success">
              ▼ %{Math.round((1 - flight.price / flight.originalPrice) * 100)}{' '}
              {t('off')}
            </div>
          )}
          <div
            className={`text-2xl font-extrabold ${hasDiscount ? 'text-success' : 'text-primary'}`}
          >
            ₺{flight.price.toLocaleString('tr-TR')}
          </div>
          <div className="text-[11px] text-muted-foreground">{t('perPerson')}</div>
          <div className="mt-2 flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
            <Users className="h-3 w-3" />
            {flight.availableSeats} {t('seats')}
          </div>
          <button
            onClick={() => onSelect?.(flight)}
            className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--brand)] to-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {t('select')} →
          </button>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
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
