'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Plane, X, Clock, SlidersHorizontal, ChevronDown } from 'lucide-react';

export interface FilterState {
  airlines: string[];
  stops: number[];
  maxPrice: number;
  minPrice: number;
  departureTimeRange: [number, number];
  refundable: boolean | null;
}

export const DEFAULT_FILTERS: FilterState = {
  airlines: [],
  stops: [],
  minPrice: 0,
  maxPrice: 999999,
  departureTimeRange: [0, 24],
  refundable: null,
};

const AIRLINE_CODES = ['TK', 'PC', 'XQ', 'LH', 'BA', 'AF', 'KL'];

const AIRLINE_NAMES: Record<string, string> = {
  TK: 'Turkish Airlines',
  PC: 'Pegasus',
  XQ: 'SunExpress',
  LH: 'Lufthansa',
  BA: 'British Airways',
  AF: 'Air France',
  KL: 'KLM',
};

const TIME_BANDS = [
  { label: '00–06', range: [0, 6] as [number, number] },
  { label: '06–12', range: [6, 12] as [number, number] },
  { label: '12–18', range: [12, 18] as [number, number] },
  { label: '18–24', range: [18, 24] as [number, number] },
];

interface FilterPanelProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  priceRange: { min: number; max: number };
  className?: string;
}

export default function FilterPanel({
  filters,
  onChange,
  priceRange,
  className = '',
}: FilterPanelProps) {
  const t = useTranslations('flights');
  const [isOpen, setIsOpen] = useState(false);

  const toggleAirline = (code: string) => {
    const next = filters.airlines.includes(code)
      ? filters.airlines.filter((c) => c !== code)
      : [...filters.airlines, code];
    onChange({ ...filters, airlines: next });
  };

  const toggleStop = (stop: number) => {
    const next = filters.stops.includes(stop)
      ? filters.stops.filter((s) => s !== stop)
      : [...filters.stops, stop];
    onChange({ ...filters, stops: next });
  };

  const isTimeBandActive = (range: [number, number]) =>
    filters.departureTimeRange[0] === range[0] &&
    filters.departureTimeRange[1] === range[1];

  const setTimeBand = (range: [number, number]) => {
    if (isTimeBandActive(range)) {
      onChange({ ...filters, departureTimeRange: [0, 24] });
    } else {
      onChange({ ...filters, departureTimeRange: range });
    }
  };

  const activeCount = useMemo(() => {
    let count = filters.airlines.length + filters.stops.length;
    if (filters.minPrice > priceRange.min) count++;
    if (filters.maxPrice < priceRange.max) count++;
    if (filters.refundable !== null) count++;
    if (filters.departureTimeRange[0] !== 0 || filters.departureTimeRange[1] !== 24) count++;
    return count;
  }, [filters, priceRange]);

  const clearAll = () => {
    onChange({
      ...DEFAULT_FILTERS,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });
  };

  const filterContent = (
    <div className="space-y-6">
      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-sm font-medium text-error hover:text-error/80"
        >
          <X className="h-3.5 w-3.5" />
          {t('clearAll')}
        </button>
      )}

      {/* Airlines */}
      <div>
        <h4 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Plane className="h-3.5 w-3.5" />
          {t('airline')}
        </h4>
        <div className="space-y-2">
          {AIRLINE_CODES.map((code) => (
            <label
              key={code}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground hover:text-primary"
            >
              <input
                type="checkbox"
                checked={filters.airlines.includes(code)}
                onChange={() => toggleAirline(code)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
              />
              <span className="font-mono text-xs font-bold">{code}</span>
              <span className="text-muted-foreground">({AIRLINE_NAMES[code]})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stops */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t('stops')}
        </h4>
        <div className="space-y-2">
          {[
            { value: 0, icon: '🛫', label: t('nonstop') },
            { value: 1, icon: '🔄', label: t('oneStop') },
            { value: 2, icon: '🔀', label: t('twoPlusStops') },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground hover:text-primary"
            >
              <input
                type="checkbox"
                checked={filters.stops.includes(opt.value)}
                onChange={() => toggleStop(opt.value)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
              />
              {opt.icon} {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t('priceRange')}
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) =>
              onChange({ ...filters, minPrice: Number(e.target.value) })
            }
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:bg-surface-elevated dark:border-border"
            placeholder={String(priceRange.min)}
          />
          <span className="text-muted-foreground">—</span>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) =>
              onChange({ ...filters, maxPrice: Number(e.target.value) })
            }
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:bg-surface-elevated dark:border-border"
            placeholder={String(priceRange.max)}
          />
        </div>
      </div>

      {/* Departure Time */}
      <div>
        <h4 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {t('departureTime')}
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {TIME_BANDS.map((band) => (
            <button
              key={band.label}
              onClick={() => setTimeBand(band.range)}
              className={`
                rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors
                ${
                  isTimeBandActive(band.range)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-border hover:text-foreground dark:border-border'
                }
              `}
            >
              {band.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cancellation */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t('cancellation')}
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            { value: null, label: t('all') },
            { value: true, label: t('refundable') },
            { value: false, label: t('nonRefundable') },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() =>
                onChange({ ...filters, refundable: opt.value as boolean | null })
              }
              className={`
                rounded-full border px-3 py-1.5 text-xs font-medium transition-colors
                ${
                  filters.refundable === opt.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-border hover:text-foreground dark:border-border'
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`mb-4 flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground lg:hidden dark:bg-surface-elevated dark:border-border ${className}`}
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          {t('filters')}
          {activeCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Mobile panel */}
      {isOpen && (
        <div className={`mb-4 rounded-xl border border-border bg-surface p-5 dark:bg-surface-elevated dark:border-border ${className}`}>
          {filterContent}
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={`hidden w-64 shrink-0 lg:block ${className}`}>
        <div className="sticky top-24 rounded-xl border border-border bg-surface p-5 dark:bg-surface-elevated dark:border-border">
          {filterContent}
        </div>
      </div>
    </>
  );
}
