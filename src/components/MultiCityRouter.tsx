'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Plane, Trash2, Plus, Search, X } from 'lucide-react';

interface Leg {
  id: string;
  from: string;
  to: string;
  date: string;
  fromCode?: string;
  toCode?: string;
}

interface Props {
  locale?: 'tr' | 'en';
}

const POPULAR_CITIES = [
  { code: 'IST', name: 'İstanbul', nameEn: 'Istanbul' },
  { code: 'SAW', name: 'Sabiha Gökçen', nameEn: 'Sabiha Gokcen' },
  { code: 'ESB', name: 'Ankara Esenboğa', nameEn: 'Ankara Esenboga' },
  { code: 'ADB', name: 'İzmir Adnan Menderes', nameEn: 'Izmir Adnan Menderes' },
  { code: 'AYT', name: 'Antalya', nameEn: 'Antalya' },
  { code: 'BJV', name: 'Bodrum Milas', nameEn: 'Bodrum Milas' },
  { code: 'DLM', name: 'Dalaman', nameEn: 'Dalaman' },
  { code: 'TZX', name: 'Trabzon', nameEn: 'Trabzon' },
  { code: 'ADA', name: 'Adana', nameEn: 'Adana' },
  { code: 'LHR', name: 'Londra Heathrow', nameEn: 'London Heathrow' },
  { code: 'CDG', name: 'Paris CDG', nameEn: 'Paris CDG' },
  { code: 'FRA', name: 'Frankfurt', nameEn: 'Frankfurt' },
  { code: 'AMS', name: 'Amsterdam Schiphol', nameEn: 'Amsterdam Schiphol' },
  { code: 'FCO', name: 'Roma Fiumicino', nameEn: 'Rome Fiumicino' },
  { code: 'BCN', name: 'Barcelona', nameEn: 'Barcelona' },
  { code: 'VIE', name: 'Viyana', nameEn: 'Vienna' },
  { code: 'DXB', name: 'Dubai', nameEn: 'Dubai' },
];

const T = (locale: 'tr' | 'en') => ({
  title: locale === 'tr' ? 'Çoklu Uçuş Planlayıcı' : 'Multi-City Flight Planner',
  subtitle: locale === 'tr'
    ? 'Birden fazla şehri kapsayan rotaları planlayın'
    : 'Plan routes covering multiple cities',
  from: locale === 'tr' ? 'Kalkış' : 'Departure',
  to: locale === 'tr' ? 'Varış' : 'Arrival',
  date: locale === 'tr' ? 'Tarih' : 'Date',
  addFlight: locale === 'tr' ? 'Uçuş Ekle' : 'Add Flight',
  search: locale === 'tr' ? 'Rotaları Ara' : 'Search Routes',
  totalPrice: locale === 'tr' ? 'Toplam Tahmini Fiyat' : 'Total Estimated Price',
  dateError: locale === 'tr' ? 'Tarih önceki uçuştan sonra olmalı' : 'Date must be after previous flight',
  maxLegs: locale === 'tr' ? 'Maksimum 6 uçuş' : 'Maximum 6 flights',
  remove: locale === 'tr' ? 'Sil' : 'Remove',
  perPerson: locale === 'tr' ? 'kişi başı' : 'per person',
  selectCity: locale === 'tr' ? 'Şehir seçin...' : 'Select city...',
  searching: locale === 'tr' ? 'Aranıyor...' : 'Searching...',
});

function mockLegPrice(): number {
  return Math.round(1500 + Math.random() * 3500);
}

function CityInput({
  value, onChange, onSelect, placeholder, label, id,
}: {
  value: string; onChange: (v: string) => void; onSelect: (name: string, code: string) => void;
  placeholder: string; label: string; id: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = query.length < 1 ? POPULAR_CITIES : POPULAR_CITIES.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(query.toLowerCase()) ||
    c.code.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={ref} className="relative w-full flex-1">
      <label className="mb-1 block text-xs font-semibold text-slate-500">{label}</label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-8 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
        {query && (
          <button onClick={() => { setQuery(''); onChange(''); }} className="absolute right-8 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <Plane className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {filtered.slice(0, 8).map(city => (
            <li key={city.code}>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-blue-50"
                onMouseDown={() => {
                  setQuery(city.name);
                  onChange(city.name);
                  onSelect(city.name, city.code);
                  setOpen(false);
                }}
              >
                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-mono font-bold text-blue-700">{city.code}</span>
                <span className="text-gray-700">{city.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function MultiCityRouter({ locale = 'tr' }: Props) {
  const t = T(locale);

  const [legs, setLegs] = useState<Leg[]>([
    { id: '1', from: '', to: '', date: '', fromCode: '', toCode: '' },
    { id: '2', from: '', to: '', date: '', fromCode: '', toCode: '' },
  ]);
  const [searching, setSearching] = useState(false);

  const addLeg = () => {
    if (legs.length >= 6) return;
    setLegs([...legs, { id: Date.now().toString(), from: '', to: '', date: '', fromCode: '', toCode: '' }]);
  };

  const removeLeg = (id: string) => {
    if (legs.length <= 2) return;
    setLegs(legs.filter(l => l.id !== id));
  };

  const updateLeg = (id: string, field: keyof Leg, value: string) => {
    setLegs(legs.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const dateErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    for (let i = 1; i < legs.length; i++) {
      if (legs[i - 1].date && legs[i].date && legs[i].date <= legs[i - 1].date) {
        errors[legs[i].id] = t.dateError;
      }
    }
    return errors;
  }, [legs, t.dateError]);

  const hasDateErrors = Object.keys(dateErrors).length > 0;

  const { totalPrice, perLegPrices } = useMemo(() => {
    const filled = legs.filter(l => l.from && l.to && l.date);
    if (filled.length === 0) return { totalPrice: 0, perLegPrices: [] as number[] };
    const prices = filled.map(() => mockLegPrice());
    return { totalPrice: prices.reduce((a, b) => a + b, 0), perLegPrices: prices };
  }, [legs]);

  const handleSearch = () => {
    setSearching(true);
    setTimeout(() => setSearching(false), 1500);
  };

  return (
    <div className="mx-auto w-full max-w-4xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 text-sm font-semibold text-blue-700">
          <Plane className="h-4 w-4" />
          {legs.length}/6
        </div>
      </div>

      {/* Legs */}
      <div className="space-y-4">
        {legs.map((leg, index) => (
          <div key={leg.id} className="relative flex flex-col items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:border-blue-100 md:flex-row">
            <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-blue-600 text-xs font-bold text-white shadow-sm">
              {index + 1}
            </span>

            <CityInput
              id={`from-${leg.id}`}
              label={t.from}
              value={leg.from}
              onChange={v => updateLeg(leg.id, 'from', v)}
              onSelect={(name, code) => updateLeg(leg.id, 'fromCode', code)}
              placeholder={locale === 'tr' ? 'Örn. İstanbul' : 'E.g. Istanbul'}
            />

            <CityInput
              id={`to-${leg.id}`}
              label={t.to}
              value={leg.to}
              onChange={v => updateLeg(leg.id, 'to', v)}
              onSelect={(name, code) => updateLeg(leg.id, 'toCode', code)}
              placeholder={locale === 'tr' ? 'Örn. Antalya' : 'E.g. Antalya'}
            />

            <div className="relative w-full flex-1">
              <label className="mb-1 block text-xs font-semibold text-slate-500">{t.date}</label>
              <input
                type="date"
                className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 ${
                  dateErrors[leg.id]
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                value={leg.date}
                onChange={e => updateLeg(leg.id, 'date', e.target.value)}
              />
              {dateErrors[leg.id] && (
                <p className="mt-1 text-xs text-red-500">{dateErrors[leg.id]}</p>
              )}
            </div>

            {legs.length > 2 && (
              <button
                onClick={() => removeLeg(leg.id)}
                className="mt-5 rounded-lg bg-red-50 p-2.5 text-red-500 transition-colors hover:bg-red-100"
                title={t.remove}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Price summary */}
      {totalPrice > 0 && !hasDateErrors && (
        <div className="mt-4 space-y-1 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
          <p className="text-xs font-semibold text-blue-600">{t.totalPrice}</p>
          {legs.map((leg, i) => {
            if (!leg.from || !leg.to || !leg.date) return null;
            return (
              <div key={leg.id} className="flex items-center justify-between text-sm">
                <span className="text-blue-700">{leg.from} → {leg.to}</span>
                <span className="font-semibold text-blue-800">₺{(perLegPrices[i] ?? 0).toLocaleString()}</span>
              </div>
            );
          })}
          <div className="mt-2 flex items-center justify-between border-t border-blue-200 pt-2">
            <span className="font-bold text-blue-900">{locale === 'tr' ? 'Toplam' : 'Total'}</span>
            <span className="text-lg font-bold text-blue-700">₺{totalPrice.toLocaleString()} <span className="text-xs font-normal text-blue-500">({t.perPerson})</span></span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-4 md:flex-row">
        <button
          onClick={addLeg}
          disabled={legs.length >= 6}
          className={`flex items-center rounded-lg px-4 py-2 font-medium transition-all ${
            legs.length >= 6
              ? 'cursor-not-allowed bg-gray-100 text-gray-400'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          }`}
        >
          <Plus className="mr-1.5 h-5 w-5" />
          {t.addFlight} {legs.length >= 6 && `(${t.maxLegs})`}
        </button>

        <button
          onClick={handleSearch}
          disabled={hasDateErrors || legs.filter(l => l.from && l.to && l.date).length === 0}
          className={`flex items-center rounded-xl px-8 py-3 font-bold shadow-md transition-all md:w-auto ${
            hasDateErrors || legs.filter(l => l.from && l.to && l.date).length === 0
              ? 'cursor-not-allowed bg-gray-300 text-gray-500'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5'
          }`}
        >
          {searching ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {locale === 'tr' ? 'Aranıyor...' : 'Searching...'}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {t.search}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
