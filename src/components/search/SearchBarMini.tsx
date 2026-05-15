'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Plane, Compass, Building2, MapPin, ArrowRight, Users, CalendarDays, Star, Hotel } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { MOCK_TOURS } from '@/data/tours';
import { hotels as MOCK_HOTELS } from '@/data/hotels';
import type { Tab, GuestConfig } from './shared';
import { CITY_OPTIONS, TOUR_CATEGORIES, defaultGuestConfig, guestSummary, todayStr, nextDayStr } from './shared';

// ─── Ortak alt bileşenler ───────────────────────────────────────
function DateInput({ value, onChange, placeholder, icon }: {
  value: string; onChange: (v: string) => void; placeholder: string; icon: React.ReactNode;
}) {
  return (
    <div className="relative flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-100/60 px-3 py-2.5 transition-all focus-within:border-[var(--brand)] focus-within:ring-2 focus-within:ring-[var(--brand)]/10 dark:border-gray-600 dark:bg-gray-800/50">
      <span className="shrink-0 text-gray-400">{icon}</span>
      <input type="date" value={value} min={todayStr()} onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-sm font-medium text-gray-800 outline-none [color-scheme:light] dark:text-gray-100 dark:[color-scheme:dark]" />
      {!value && <span className="pointer-events-none absolute left-9 text-sm text-gray-400">{placeholder}</span>}
    </div>
  );
}

function LocationInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const filtered = CITY_OPTIONS.filter((o) => o.label.toLowerCase().includes(value.toLowerCase()));
  return (
    <div ref={ref} className="relative">
      <div className="relative flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-100/60 px-3 py-2.5 transition-all focus-within:border-[var(--brand)] focus-within:ring-2 focus-within:ring-[var(--brand)]/10 dark:border-gray-600 dark:bg-gray-800/50">
        <span className="shrink-0 text-gray-400"><MapPin className="h-4 w-4" /></span>
        <input type="text" value={value} onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)} placeholder={placeholder}
          className="flex-1 bg-transparent text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400 dark:text-gray-100" />
        {value && <button onClick={() => { onChange(''); setOpen(false); }} className="text-gray-400"><X className="h-4 w-4" /></button>}
      </div>
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800">
          {filtered.map((opt) => (
            <li key={opt.value}>
              <button type="button" onClick={() => { onChange(opt.label); setOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700">
                <MapPin className="h-3.5 w-3.5 text-gray-400" /> {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── SearchBarMini: Header/Navbar icin ikon. Tiklayinca full modal ───
export default function SearchBarMini() {
  const t = useTranslations('flights');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('flights');

  // Tur state
  const [tourDest, setTourDest] = useState('');
  const [tourDate, setTourDate] = useState('');
  const [tourCategory, setTourCategory] = useState('');

  // Otel state
  const [hotelDest, setHotelDest] = useState('');
  const [hotelCheckin, setHotelCheckin] = useState('');
  const [hotelCheckout, setHotelCheckout] = useState('');

  useEffect(() => {
    if (hotelCheckin && (!hotelCheckout || hotelCheckout <= hotelCheckin)) {
      setHotelCheckout(nextDayStr(hotelCheckin));
    }
  }, [hotelCheckin]);

  const filteredTours = MOCK_TOURS.filter((tour) => {
    return !tourDest || tour.title.toLowerCase().includes(tourDest.toLowerCase()) || tour.titleEn.toLowerCase().includes(tourDest.toLowerCase()) || tour.location.toLowerCase().includes(tourDest.toLowerCase());
  }).slice(0, 3);

  const filteredHotels = MOCK_HOTELS.filter((h) => {
    return !hotelDest || h.title.toLowerCase().includes(hotelDest.toLowerCase()) || h.titleEn.toLowerCase().includes(hotelDest.toLowerCase()) || h.city.toLowerCase().includes(hotelDest.toLowerCase());
  }).slice(0, 3);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition-all hover:border-[var(--brand)] hover:text-[var(--brand)] hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
        <Search className="h-3.5 w-3.5" />
        Ara
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 pt-16 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="mx-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Hızlı Arama</h3>
          <button onClick={() => setOpen(false)} className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"><X className="h-5 w-5" /></button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-0 border-b border-gray-100 dark:border-gray-800">
          {([
            { key: 'flights' as Tab, icon: Plane },
            { key: 'tours' as Tab, icon: Compass },
            { key: 'hotels' as Tab, icon: Building2 },
          ]).map(({ key, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 py-3 text-xs font-semibold transition-colors ${activeTab === key ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-gray-400'}`}>
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>

        <div className="p-4">
          {/* Ucus */}
          {activeTab === 'flights' && (
            <div className="text-center text-sm text-gray-500">
              Uçuş aramak için{' '}
              <Link href="/flights" onClick={() => setOpen(false)} className="font-semibold text-[var(--brand)] hover:underline">
                uçuş sayfasına git
              </Link>
            </div>
          )}

          {/* Tur */}
          {activeTab === 'tours' && (
            <div className="space-y-3">
              <LocationInput value={tourDest} onChange={setTourDest} placeholder="Nereye?" />
              <DateInput value={tourDate} onChange={setTourDate} placeholder="Tarih" icon={<CalendarDays className="h-4 w-4" />} />
              <select value={tourCategory} onChange={(e) => setTourCategory(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-100/60 px-3 py-2.5 text-sm font-medium text-gray-800 outline-none dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-100">
                {TOUR_CATEGORIES.map((cat) => (<option key={cat.value} value={cat.value}>{cat.labelTr}</option>))}
              </select>
              <Link href={`/tours?q=${encodeURIComponent(tourDest)}`} onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[var(--brand)]/90 active:scale-[0.98]">
                <Search className="h-4 w-4" /> Tur Ara
              </Link>
            </div>
          )}

          {/* Otel */}
          {activeTab === 'hotels' && (
            <div className="space-y-3">
              <LocationInput value={hotelDest} onChange={setHotelDest} placeholder="Nereye gidiyorsunuz?" />
              <div className="grid grid-cols-2 gap-2">
                <DateInput value={hotelCheckin} onChange={setHotelCheckin} placeholder="Giriş" icon={<CalendarDays className="h-4 w-4" />} />
                <DateInput value={hotelCheckout} onChange={setHotelCheckout} placeholder="Çıkış" icon={<CalendarDays className="h-4 w-4" />} />
              </div>
              <Link href={`/hotels?q=${encodeURIComponent(hotelDest)}`} onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[var(--brand)]/90 active:scale-[0.98]">
                <Search className="h-4 w-4" /> Otel Ara
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
