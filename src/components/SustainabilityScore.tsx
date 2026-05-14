'use client';

import React from 'react';

interface SustainabilityScoreProps {
  co2Emissions: number; // in kg
  averageEmissions?: number; // typical emissions for this route
  ecoFriendly?: boolean;
  variant?: 'card' | 'badge';
}

// Google Flights-inspired leaf SVG
function LeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M15.5 5.5C13.5 5.5 12 7 12 9c0-2-1.5-3.5-3.5-3.5C6.5 5.5 5 7 5 9c0 2 1.5 3.5 3.5 3.5H12v5l4-4-4-4v3H9c-2.5 0-4.5-2-4.5-4.5C4.5 6 6.5 4 9 4c1.5 0 2.8.7 3.6 1.8C13.2 4.7 14.5 4 16 4c2.5 0 4.5 2 4.5 4.5 0 .8-.2 1.6-.6 2.2C21.3 10.5 22 9 22 7.5 22 5.5 20 3.5 18 3.5c-.7 0-1.4.2-1.9.7-.4-.2-.9-.2-1.4-.2-1.7 0-3 1.3-3 3 0 .7.2 1.4.6 1.9.4.6.6 1.3.6 2.1z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function SustainabilityScore({
  co2Emissions,
  averageEmissions = 250,
  ecoFriendly = false,
  variant = 'card',
}: SustainabilityScoreProps) {
  const isBelowAverage = co2Emissions < averageEmissions;
  const isAboveAverage = co2Emissions > averageEmissions;
  const percentageLess = isBelowAverage
    ? Math.round(((averageEmissions - co2Emissions) / averageEmissions) * 100)
    : 0;
  const percentageMore = isAboveAverage
    ? Math.round(((co2Emissions - averageEmissions) / averageEmissions) * 100)
    : 0;

  // Bar fill ratio: 0 = best, 100 = worst, relative to 0.5x to 2x average range
  const barMin = averageEmissions * 0.4;
  const barMax = averageEmissions * 2.0;
  const fillRatio = Math.min(1, Math.max(0, (co2Emissions - barMin) / (barMax - barMin)));

  // Color logic
  const getColors = () => {
    if (ecoFriendly || isBelowAverage) {
      return {
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
        barColor: 'bg-emerald-500',
        barTrack: 'bg-zinc-100',
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-700',
        label: isBelowAverage ? 'Düşük Emisyon' : 'Eko-Seçim',
      };
    }
    return {
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      barColor: 'bg-amber-400',
      barTrack: 'bg-zinc-100',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-700',
      label: 'Yüksek Emisyon',
    };
  };

  const colors = getColors();

  // ─── BADGE VARIANT ────────────────────────────────────────────────────────
  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${colors.badgeBg}`}>
        <LeafIcon className={`h-3.5 w-3.5 ${colors.iconColor}`} />
        <span className="text-xs font-semibold text-zinc-700">{co2Emissions} kg</span>
        {ecoFriendly && (
          <span className={`text-xs font-medium ${colors.badgeText}`}>🌿</span>
        )}
        {isBelowAverage && !ecoFriendly && (
          <span className={`text-xs font-medium ${colors.badgeText}`}>↓%{percentageLess}</span>
        )}
        {isAboveAverage && (
          <span className={`text-xs font-medium ${colors.badgeText}`}>↑%{percentageMore}</span>
        )}
      </div>
    );
  }

  // ─── CARD VARIANT ────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        {/* Icon */}
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${colors.iconBg}`}>
          <LeafIcon className={`h-6 w-6 ${colors.iconColor}`} />
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-zinc-900">{co2Emissions} kg</span>
            <span className="text-sm text-zinc-500">CO₂</span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Uçuş başına yakılan karbon emisyonu
          </p>
        </div>

        {/* Badge */}
        {ecoFriendly ? (
          <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            🌿 Eko-Seçim
          </span>
        ) : isBelowAverage ? (
          <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Düşük Emisyon
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Yüksek Emisyon
          </span>
        )}
      </div>

      {/* Comparison Bar */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
          <span>Düşük emisyon</span>
          <span>Yüksek emisyon</span>
        </div>
        <div className={`relative h-2.5 w-full rounded-full ${colors.barTrack} overflow-hidden`}>
          <div
            className={`absolute left-0 top-0 h-full rounded-full transition-all ${colors.barColor}`}
            style={{ width: `${fillRatio * 100}%` }}
          />
          {/* Average marker */}
          <div
            className="absolute top-1/2 h-4 w-px -translate-y-1/2 bg-zinc-400"
            style={{ left: '50%' }}
            title="Ortalama"
          />
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          {isBelowAverage ? (
            <span className="text-emerald-600 font-medium">
              Ortalamadan %{percentageLess} daha az emisyon
            </span>
          ) : isAboveAverage ? (
            <span className="text-amber-600 font-medium">
              Ortalamadan %{percentageMore} daha fazla emisyon
            </span>
          ) : (
            <span>Ortalama emisyon seviyesi</span>
          )}
        </p>
      </div>
    </div>
  );
}
