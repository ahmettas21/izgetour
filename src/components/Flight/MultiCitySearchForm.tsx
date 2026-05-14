'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plane,
  Calendar,
  ChevronDown,
  Search,
} from 'lucide-react';
import type { Flight } from '@/data/flights';
import type { FlightLeg, LegSearchResult } from '@/utils/multiCityHelpers';
import { searchCities } from '@/utils/multiCityHelpers';

type Props = {
  legs: FlightLeg[];
  legResults: LegSearchResult[];
  selections: Record<string, Flight>;
  dateErrors: { legId: string; message: string }[];
  passengers: number;
  phase: 'form' | 'searching' | 'results';
  onAddLeg: () => void;
  onRemoveLeg: (id: string) => void;
  onUpdateLeg: (id: string, patch: Partial<FlightLeg>) => void;
  onMoveLeg: (id: string, direction: 'up' | 'down') => void;
  onSelectFlight: (legId: string, flight: Flight) => void;
  onSearch: () => void;
  onClearResults: () => void;
  onSetPassengers: (n: number) => void;
  locale: 'tr' | 'en';
};

// ── City autocomplete ────────────────────────────────────────────────────────

function CityAutocomplete({
  value,
  onChange,
  onCode,
  placeholder,
  label,
  inputId,
  type,
  locale,
}: {
  value: string;
  onChange: (v: string, code: string) => void;
  onCode: (code: string) => void;
  placeholder: string;
  label: string;
  inputId: string;
  type: 'origin' | 'destination';
  locale: 'tr' | 'en';
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  const results = searchCities(query || value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const _lt = (tr: string, en: string) => (locale === 'tr' ? tr : en);

  const select = (city: (typeof results)[0]) => {
    setQuery(city.city);
    onChange(city.city, city.code);
    onCode(city.code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative flex-1">
      <label className="mb-1 block text-xs font-medium text-zinc-500">{label}</label>
      <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5">
        <Plane
          className={`h-4 w-4 shrink-0 text-[#0066CC] ${type === 'destination' ? 'rotate-90' : ''}`}
        />
        <input
          id={inputId}
          type="text"
          value={query || value}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value, '');
            onCode('');
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className="flex-1 bg-transparent text-sm font-medium text-zinc-900 outline-none placeholder:text-zinc-400"
        />
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
          {results.map((city) => (
            <li key={city.code}>
              <button
                type="button"
                onClick={() => select(city)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-zinc-50"
              >
                <span className="font-medium text-zinc-900">{city.city}</span>
                <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-semibold text-zinc-600">
                  {city.code}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Mini flight card (per-leg selection) ──────────────────────────────────────

function MiniFlightCard({
  flight,
  isSelected,
  onSelect,
  locale,
}: {
  flight: Flight;
  isSelected: boolean;
  onSelect: () => void;
  locale: 'tr' | 'en';
}) {
  const lt = (tr: string, en: string) => (locale === 'tr' ? tr : en);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border-2 p-3 text-left transition-all ${
        isSelected
          ? 'border-[#0066CC] bg-[#0066CC]/5 shadow-sm'
          : 'border-zinc-200 bg-white hover:border-zinc-300'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-700">
            {flight.airlineCode}
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-900">{flight.airline}</div>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400">
              <span>{flight.departureTime}</span>
              <span>→</span>
              <span>{flight.arrivalTime}</span>
              <span>·</span>
              <span>
                {flight.stops === 0
                  ? lt('Direkt', 'Non-stop')
                  : `${flight.stops} ${lt('aktarma', 'stop')}`}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-bold ${isSelected ? 'text-[#0066CC]' : 'text-zinc-900'}`}>
            ₺{flight.price.toLocaleString('tr-TR')}
          </div>
          {isSelected && (
            <span className="text-[10px] font-medium text-[#0066CC]">✓ {lt('Seçildi', 'Selected')}</span>
          )}
        </div>
      </div>
    </button>
  );
}

// ── Main form component ───────────────────────────────────────────────────────

export default function MultiCitySearchForm({
  legs,
  legResults,
  selections,
  dateErrors,
  passengers,
  phase,
  onAddLeg,
  onRemoveLeg,
  onUpdateLeg,
  onMoveLeg,
  onSelectFlight,
  onSearch,
  onClearResults,
  onSetPassengers,
  locale,
}: Props) {
  const lt = (tr: string, en: string) => (locale === 'tr' ? tr : en);
  const hasErrors = dateErrors.length > 0;
  const canAdd = legs.length < 6;
  const canRemove = legs.length > 2;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-3">
      {legs.map((leg, index) => {
        const err = dateErrors.find((e) => e.legId === leg.id);
        const result = legResults.find((r) => r.legId === leg.id);
        const flights = result?.flights ?? [];

        return (
          <div key={leg.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
            {/* Leg header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0066CC] text-[10px] font-bold text-white">
                  {index + 1}
                </div>
                <span className="text-sm font-semibold text-zinc-700">
                  {lt('Uçuş Ayağı', 'Flight Leg')} {index + 1}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onMoveLeg(leg.id, 'up')}
                  disabled={index === 0}
                  className="rounded p-1 text-zinc-400 hover:bg-zinc-100 disabled:opacity-30"
                  title={lt('Yukarı Taşı', 'Move Up')}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onMoveLeg(leg.id, 'down')}
                  disabled={index === legs.length - 1}
                  className="rounded p-1 text-zinc-400 hover:bg-zinc-100 disabled:opacity-30"
                  title={lt('Aşağı Taşı', 'Move Down')}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                {canRemove && (
                  <button
                    type="button"
                    onClick={() => onRemoveLeg(leg.id)}
                    className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500"
                    title={lt('Kaldır', 'Remove')}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Origin / Destination */}
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
              <CityAutocomplete
                value={leg.origin}
                onChange={(v) => onUpdateLeg(leg.id, { origin: v })}
                onCode={(c) => onUpdateLeg(leg.id, { originCode: c })}
                placeholder={lt('Kalkış şehri', 'Departure city')}
                label={lt('Nereden', 'From')}
                inputId={`origin-${leg.id}`}
                type="origin"
                locale={locale}
              />
              <div className="flex shrink-0 items-center justify-center py-2 sm:py-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100">
                  <Plane className="h-3.5 w-3.5 rotate-90 text-zinc-500" />
                </div>
              </div>
              <CityAutocomplete
                value={leg.destination}
                onChange={(v) => onUpdateLeg(leg.id, { destination: v })}
                onCode={(c) => onUpdateLeg(leg.id, { destinationCode: c })}
                placeholder={lt('Varış şehri', 'Arrival city')}
                label={lt('Nereye', 'To')}
                inputId={`dest-${leg.id}`}
                type="destination"
                locale={locale}
              />
            </div>

            {/* Date */}
            <div className="mb-2">
              <label className="mb-1 block text-xs font-medium text-zinc-500">
                {lt('Kalkış Tarihi', 'Departure Date')}
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5">
                <Calendar className="h-4 w-4 shrink-0 text-zinc-400" />
                <input
                  type="date"
                  value={leg.date}
                  min={today}
                  onChange={(e) => onUpdateLeg(leg.id, { date: e.target.value })}
                  className="flex-1 bg-transparent text-sm font-medium text-zinc-900 outline-none"
                />
              </div>
              {err && <p className="mt-1 text-xs text-red-500">{err.message}</p>}
            </div>

            {/* Per-leg flight results */}
            {phase === 'results' && (
              <div className="mt-3 space-y-1.5">
                <div className="text-xs font-medium text-zinc-400">
                  {lt('Bu ayak için uçuş seç:', 'Select flight for this leg:')}
                </div>
                {flights.length === 0 ? (
                  <p className="rounded-lg bg-zinc-50 p-3 text-center text-sm text-zinc-400">
                    {lt('Bu rotada uçuş bulunamadı', 'No flights found for this route')}
                  </p>
                ) : (
                  flights.slice(0, 4).map((flight) => (
                    <MiniFlightCard
                      key={flight.id}
                      flight={flight}
                      isSelected={selections[leg.id]?.id === flight.id}
                      onSelect={() => onSelectFlight(leg.id, flight)}
                      locale={locale}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Add leg */}
      {canAdd && (
        <button
          type="button"
          onClick={onAddLeg}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-300 py-3 text-sm font-medium text-zinc-500 transition-colors hover:border-[#0066CC] hover:text-[#0066CC]"
        >
          <Plus className="h-4 w-4" />
          {lt('Yeni Uçuş Ayağı Ekle', 'Add Flight Leg')}
          <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400">
            {legs.length}/6
          </span>
        </button>
      )}

      {/* Passengers */}
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3">
        <span className="text-sm font-medium text-zinc-700">{lt('Yolcu', 'Passengers')}</span>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSetPassengers(Math.max(1, passengers - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-sm font-bold text-zinc-600 hover:bg-zinc-50"
          >
            −
          </button>
          <span className="w-6 text-center text-sm font-semibold">{passengers}</span>
          <button
            type="button"
            onClick={() => onSetPassengers(Math.min(6, passengers + 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-sm font-bold text-zinc-600 hover:bg-zinc-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        {phase === 'results' ? (
          <>
            <button
              type="button"
              onClick={onClearResults}
              className="flex-1 rounded-xl border border-zinc-200 py-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
            >
              {lt('Yeniden Ara', 'New Search')}
            </button>
            <button
              type="button"
              onClick={onSearch}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0066CC] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0052a3]"
            >
              <Search className="h-4 w-4" />
              {lt('Fiyatları Yenile', 'Refresh Prices')}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onSearch}
            disabled={hasErrors || phase === 'searching'}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0066CC] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0052a3] disabled:opacity-50"
          >
            {phase === 'searching' ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {lt('Uçuşlar Aranıyor…', 'Searching flights…')}
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                {lt('Tüm Uçuşları Ara', 'Search All Flights')}
              </>
            )}
          </button>
        )}
      </div>

      {hasErrors && (
        <p className="text-center text-xs text-red-500">
          {lt(
            'Tarihleri düzeltin: Her uçuşun tarihi önceki uçuştan sonra olmalı.',
            'Fix dates: each leg must depart after the previous leg arrives.'
          )}
        </p>
      )}
    </div>
  );
}
