'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Plane, ArrowRight, Calendar, Plus, X, AlertCircle } from 'lucide-react';
import AirportAutocomplete from './AirportAutocomplete';
import PassengerPanel from './PassengerPanel';
import type { Airport } from '@/data/airports';
import type { SearchParams, CabinClass } from './types';

type TripType = 'oneway' | 'roundtrip' | 'multicity';

interface MultiCitySegment {
  from: Airport | null;
  to: Airport | null;
  date: string;
}

interface FlightSearchFormProps {
  onSearch: (params: SearchParams) => Promise<void>;
  loading?: boolean;
  className?: string;
}

const MIN_DATE = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
})();

export default function FlightSearchForm({
  onSearch,
  loading = false,
  className = '',
}: FlightSearchFormProps) {
  const t = useTranslations('flights');

  const [tripType, setTripType] = useState<TripType>('roundtrip');
  const [from, setFrom] = useState<Airport | null>(null);
  const [to, setTo] = useState<Airport | null>(null);
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState({ adult: 1, child: 0, infant: 0 });
  const [cabin, setCabin] = useState<CabinClass>('economy');
  const [segments, setSegments] = useState<MultiCitySegment[]>([
    { from: null, to: null, date: '' },
    { from: null, to: null, date: '' },
  ]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSwap = useCallback(() => {
    setFrom(to);
    setTo(from);
  }, [from, to]);

  const validate = useCallback((): boolean => {
    const errs: string[] = [];

    if (tripType === 'multicity') {
      segments.forEach((seg, i) => {
        if (!seg.from) errs.push(`${t('segment')} ${i + 1}: ${t('selectFrom')}`);
        if (!seg.to) errs.push(`${t('segment')} ${i + 1}: ${t('selectTo')}`);
        if (!seg.date) errs.push(`${t('segment')} ${i + 1}: ${t('selectDate')}`);
      });
    } else {
      if (!from) errs.push(t('selectFrom'));
      if (!to) errs.push(t('selectTo'));
      if (!departDate) errs.push(t('selectDepartDate'));
      if (tripType === 'roundtrip' && !returnDate) errs.push(t('selectReturnDate'));
    }

    if (passengers.infant > passengers.adult) {
      errs.push(t('infantError'));
    }

    setErrors(errs);
    return errs.length === 0;
  }, [tripType, segments, from, to, departDate, returnDate, passengers, t]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    const params: SearchParams = {
      tripType,
      from,
      to,
      departDate,
      returnDate,
      passengers,
      cabinClass: cabin,
      segments: tripType === 'multicity' ? segments : [],
    };

    await onSearch(params);
  }, [tripType, from, to, departDate, returnDate, passengers, cabin, segments, validate, onSearch]);

  const addSegment = () => {
    if (segments.length < 6) {
      setSegments([...segments, { from: null, to: null, date: '' }]);
    }
  };

  const removeSegment = (idx: number) => {
    if (segments.length > 2) {
      setSegments(segments.filter((_, i) => i !== idx));
    }
  };

  const updateSegment = (
    idx: number,
    field: 'from' | 'to' | 'date',
    value: Airport | string | null,
  ) => {
    const next = [...segments];
    if (field === 'from' || field === 'to') {
      next[idx] = { ...next[idx], [field]: value as Airport | null };
    } else {
      next[idx] = { ...next[idx], [field]: value as string };
    }
    setSegments(next);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* ── Trip Type Tabs ─────────────────────────────────────── */}
      <div className="flex items-center gap-1 rounded-full bg-white/10 p-1 backdrop-blur-sm w-fit mx-auto">
        {([
          { key: 'oneway' as TripType, label: t('oneWay') },
          { key: 'roundtrip' as TripType, label: t('roundTrip') },
          { key: 'multicity' as TripType, label: t('multiCity') },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setTripType(key);
              setErrors([]);
            }}
            className={`
              rounded-full px-5 py-2 text-sm font-medium transition-all whitespace-nowrap
              ${tripType === key
                ? 'bg-white text-slate-800 shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'}
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── One-way / Round-trip Form ──────────────────────────── */}
      {tripType !== 'multicity' && (
        <>
          <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-end">
            <AirportAutocomplete
              label={t('from')}
              value={from}
              onChange={setFrom}
              placeholder={t('airportPlaceholder')}
            />

            <div className="flex items-end pb-1 justify-center">
              <button
                type="button"
                onClick={handleSwap}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all hover:bg-primary/20 hover:scale-110"
              >
                <ArrowRight className="h-4 w-4 rotate-[-90deg]" />
              </button>
            </div>

            <AirportAutocomplete
              label={t('to')}
              value={to}
              onChange={setTo}
              placeholder={t('airportPlaceholder')}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {t('departureDate')}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
                <input
                  type="date"
                  value={departDate}
                  min={MIN_DATE}
                  onChange={(e) => {
                    setDepartDate(e.target.value);
                    setErrors([]);
                  }}
                  className="w-full rounded-xl border border-border bg-surface py-3 pl-9 pr-3 text-sm font-medium text-foreground transition-all hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:bg-surface-elevated dark:border-border"
                />
              </div>
            </div>

            {tripType === 'roundtrip' && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {t('returnDate')}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
                  <input
                    type="date"
                    value={returnDate}
                    min={departDate || MIN_DATE}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface py-3 pl-9 pr-3 text-sm font-medium text-foreground transition-all hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:bg-surface-elevated dark:border-border"
                  />
                </div>
              </div>
            )}

            <PassengerPanel
              passengers={passengers}
              onChange={setPassengers}
              cabin={cabin}
              onCabinChange={setCabin}
            />
            {tripType === 'roundtrip' && <div />}
          </div>
        </>
      )}

      {/* ── Multi-city Form ──────────────────────────────────── */}
      {tripType === 'multicity' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/70">{t('maxLegs')}</p>
            {segments.length < 6 && (
              <button
                type="button"
                onClick={addSegment}
                className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-all hover:bg-primary/20"
              >
                <Plus className="h-3.5 w-3.5" />
                {t('addFlight')}
              </button>
            )}
          </div>

          {segments.map((seg, idx) => (
            <div
              key={idx}
              className="relative rounded-xl border border-border/50 bg-white/5 p-4 dark:bg-white/5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  {t('segment')} {idx + 1}
                </span>
                {segments.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeSegment(idx)}
                    className="flex items-center gap-1 text-xs text-error/80 hover:underline"
                  >
                    <X className="h-3 w-3" />
                    {t('remove')}
                  </button>
                )}
              </div>

              <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-end">
                <AirportAutocomplete
                  label={t('from')}
                  value={seg.from}
                  onChange={(a) => updateSegment(idx, 'from', a)}
                />
                <div className="flex items-end pb-1 justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/40">
                    <ArrowRight className="h-4 w-4 rotate-[-90deg]" />
                  </div>
                </div>
                <AirportAutocomplete
                  label={t('to')}
                  value={seg.to}
                  onChange={(a) => updateSegment(idx, 'to', a)}
                />
              </div>

              <div className="mt-3">
                <label className="mb-1.5 block text-xs font-medium text-white/60">
                  {t('date')}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 pointer-events-none z-10" />
                  <input
                    type="date"
                    value={seg.date}
                    min={MIN_DATE}
                    onChange={(e) => updateSegment(idx, 'date', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-9 pr-3 text-sm font-medium text-white placeholder:text-white/30 transition-all hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>
            </div>
          ))}

          <PassengerPanel
            passengers={passengers}
            onChange={setPassengers}
            cabin={cabin}
            onCabinChange={setCabin}
          />
        </div>
      )}

      {/* ── Validation Errors ─────────────────────────────────── */}
      {errors.length > 0 && (
        <div className="flex items-start gap-2 rounded-xl border border-error/20 bg-error/5 p-3 animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 text-error mt-0.5" />
          <ul className="text-sm text-error space-y-0.5">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Submit CTA ──────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary py-4 text-base font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg
              className="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 0h12a8 8 0 010 16z"
              />
            </svg>
            {t('searching')}...
          </>
        ) : (
          <>
            <Plane className="h-5 w-5" />
            {t('searchFlights')}
          </>
        )}
      </button>
    </div>
  );
}
