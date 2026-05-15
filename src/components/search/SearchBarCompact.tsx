'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Plane, Compass, Building2, MapPin, ArrowRight, Star, Hotel, Users, CalendarDays, ChevronDown, Minus, Plus, DoorOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { MOCK_TOURS } from '@/data/tours';
import { hotels as MOCK_HOTELS } from '@/data/hotels';
import type { Tab, GuestConfig } from './shared';
import { CITY_OPTIONS, TOUR_CATEGORIES, CHILD_AGES, defaultGuestConfig, guestSummary, todayStr, nextDayStr } from './shared';

// ─── Mini Date Input ───
function MiniDateInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div className="relative flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-xs transition-all focus-within:border-[var(--brand)] dark:border-gray-600 dark:bg-gray-800/50">
      <CalendarDays className="h-3 w-3 shrink-0 text-gray-400" />
      <input type="date" value={value} min={todayStr()} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-xs font-medium text-gray-800 outline-none [color-scheme:light] dark:text-gray-100 dark:[color-scheme:dark]" />
      {!value && <span className="pointer-events-none absolute left-7 text-xs text-gray-400">{placeholder}</span>}
    </div>
  );
}

// ─── Mini Location Input ───
function MiniLocationInput({ value, onChange, placeholder }: {
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
      <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-xs transition-all focus-within:border-[var(--brand)] dark:border-gray-600 dark:bg-gray-800/50">
        <MapPin className="h-3 w-3 shrink-0 text-gray-400" />
        <input type="text" value={value} onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)} placeholder={placeholder}
          className="w-full bg-transparent text-xs font-medium text-gray-800 outline-none placeholder:text-gray-400 dark:text-gray-100" />
        {value && <button onClick={() => { onChange(''); setOpen(false); }} className="text-gray-400"><X className="h-3 w-3" /></button>}
      </div>
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-0.5 w-full rounded-lg border border-gray-200 bg-white py-0.5 shadow-lg dark:border-gray-600 dark:bg-gray-800">
          {filtered.map((opt) => (
            <li key={opt.value}>
              <button type="button" onClick={() => { onChange(opt.label); setOpen(false); }}
                className="flex w-full items-center gap-1.5 px-2 py-1.5 text-left text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700">
                <MapPin className="h-3 w-3 text-gray-400" /> {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Mini Guest Panel ───
function MiniGuestPanel({ config, onChange }: {
  config: GuestConfig; onChange: (c: GuestConfig) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const updateRoom = (i: number, patch: Partial<typeof config.rooms[0]>) => {
    const rooms = [...config.rooms]; rooms[i] = { ...rooms[i], ...patch };
    onChange({ ...config, rooms });
  };
  const addChild = (i: number) => {
    if (config.rooms[i].children.length >= 4) return;
    updateRoom(i, { children: [...config.rooms[i].children, { age: 3 }] });
  };
  const remChild = (i: number, ci: number) => {
    updateRoom(i, { children: config.rooms[i].children.filter((_, idx) => idx !== ci) });
  };
  const addRoom = () => {
    if (config.rooms.length >= 6) return;
    onChange({ ...config, rooms: [...config.rooms, { adults: 1, children: [] }] });
  };

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-xs transition-all hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800/50">
        <Users className="h-3 w-3 shrink-0 text-[var(--brand)]" />
        <span className="flex-1 truncate text-xs font-medium text-gray-800 dark:text-gray-100">{guestSummary(config)}</span>
        <ChevronDown className={`h-3 w-3 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-0.5 w-72 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-600 dark:bg-gray-800">
          {config.rooms.map((room, ri) => (
            <div key={ri} className={ri > 0 ? 'mt-2 border-t border-gray-100 pt-2 dark:border-gray-700' : ''}>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Oda {ri + 1}</span>
              <div className="mt-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-300">Yetişkin</span>
                  <div className="flex items-center gap-1">
                    <MiniBtn onClick={() => updateRoom(ri, { adults: Math.max(1, room.adults - 1) })} disabled={room.adults <= 1} icon={<Minus className="h-3 w-3" />} />
                    <span className="w-5 text-center text-xs font-semibold">{room.adults}</span>
                    <MiniBtn onClick={() => updateRoom(ri, { adults: Math.min(4, room.adults + 1) })} disabled={room.adults >= 4} icon={<Plus className="h-3 w-3" />} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-300">Çocuk</span>
                  <div className="flex items-center gap-1">
                    <MiniBtn onClick={() => remChild(ri, room.children.length - 1)} disabled={room.children.length <= 0} icon={<Minus className="h-3 w-3" />} />
                    <span className="w-5 text-center text-xs font-semibold">{room.children.length}</span>
                    <MiniBtn onClick={() => addChild(ri)} disabled={room.children.length >= 4} icon={<Plus className="h-3 w-3" />} />
                  </div>
                </div>
                {room.children.map((child, ci) => (
                  <div key={ci} className="flex items-center gap-1.5 text-xs">
                    <span className="text-gray-400">Çocuk {ci + 1}:</span>
                    <select value={child.age} onChange={(e) => {
                      const children = [...room.children]; children[ci] = { age: parseInt(e.target.value) };
                      updateRoom(ri, { children });
                    }}
                      className="rounded border border-gray-200 bg-white px-1 py-0.5 text-xs dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
                      {CHILD_AGES.map((a) => (<option key={a.value} value={a.value}>{a.label}</option>))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {config.rooms.length < 6 && (
            <button type="button" onClick={addRoom}
              className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 py-1.5 text-xs font-medium text-gray-500 hover:border-[var(--brand)] hover:text-[var(--brand)] dark:border-gray-600">
              <Plus className="h-3 w-3" /> Oda Ekle
            </button>
          )}
          <button type="button" onClick={() => setOpen(false)}
            className="mt-2 w-full rounded-lg bg-[var(--brand)] py-1.5 text-xs font-semibold text-white">Tamam</button>
        </div>
      )}
    </div>
  );
}

function MiniBtn({ onClick, disabled, icon }: { onClick: () => void; disabled: boolean; icon: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-30 dark:border-gray-600">
      {icon}
    </button>
  );
}

// ─── SearchBarCompact: mobil sidebar / filter bar icin ──────────
export default function SearchBarCompact() {
  const t = useTranslations('flights');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('flights');

  const [tourDest, setTourDest] = useState('');
  const [tourDate, setTourDate] = useState('');
  const [tourCategory, setTourCategory] = useState('');

  const [hotelDest, setHotelDest] = useState('');
  const [hotelCheckin, setHotelCheckin] = useState('');
  const [hotelCheckout, setHotelCheckout] = useState('');
  const [hotelGuests, setHotelGuests] = useState<GuestConfig>(defaultGuestConfig);

  useEffect(() => {
    if (hotelCheckin && (!hotelCheckout || hotelCheckout <= hotelCheckin)) {
      setHotelCheckout(nextDayStr(hotelCheckin));
    }
  }, [hotelCheckin]);

  const filteredTours = MOCK_TOURS.filter((t) => {
    return !tourDest || t.title.toLowerCase().includes(tourDest.toLowerCase()) || t.titleEn.toLowerCase().includes(tourDest.toLowerCase()) || t.location.toLowerCase().includes(tourDest.toLowerCase());
  }).slice(0, 3);
  const filteredHotels = MOCK_HOTELS.filter((h) => {
    return !hotelDest || h.title.toLowerCase().includes(hotelDest.toLowerCase()) || h.titleEn.toLowerCase().includes(hotelDest.toLowerCase()) || h.city.toLowerCase().includes(hotelDest.toLowerCase());
  }).slice(0, 3);

  return (
    <div className="rounded-xl bg-white shadow-md dark:bg-gray-900">
      {/* Tab bar */}
      <div className="flex border-b border-gray-100 dark:border-gray-800">
        {([
          { key: 'flights' as Tab, icon: Plane, label: t('title') },
          { key: 'tours' as Tab, icon: Compass, label: t('toursTab') },
          { key: 'hotels' as Tab, icon: Building2, label: t('hotelsTab') },
        ]).map(({ key, icon: Icon, label }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex flex-1 items-center justify-center gap-1 border-b-2 py-2.5 text-[10px] font-semibold transition-colors ${activeTab === key ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-gray-400'}`}>
            <Icon className="h-3 w-3" /> {label}
          </button>
        ))}
      </div>

      <div className="space-y-2 p-2.5">
        {/* Ucus */}
        {activeTab === 'flights' && (
          <Link href="/flights"
            className="flex items-center gap-2 rounded-lg bg-[var(--brand)]/10 px-3 py-2 text-xs font-semibold text-[var(--brand)] transition-colors hover:bg-[var(--brand)]/20">
            <Plane className="h-4 w-4" /> Uçuş Ara <ArrowRight className="ml-auto h-3 w-3" />
          </Link>
        )}

        {/* Tur */}
        {activeTab === 'tours' && (
          <div className="space-y-1.5">
            <MiniLocationInput value={tourDest} onChange={setTourDest} placeholder="Nereye?" />
            <MiniDateInput value={tourDate} onChange={setTourDate} placeholder="Tarih" />
            <select value={tourCategory} onChange={(e) => setTourCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-xs font-medium text-gray-800 outline-none dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-100">
              {TOUR_CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.labelTr}</option>))}
            </select>
            <Link href={`/tours?q=${encodeURIComponent(tourDest)}`}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-[var(--brand)] py-2 text-xs font-bold text-white transition-all hover:bg-[var(--brand)]/90">
              <Search className="h-3 w-3" /> Tur Ara
            </Link>
          </div>
        )}

        {/* Otel */}
        {activeTab === 'hotels' && (
          <div className="space-y-1.5">
            <MiniLocationInput value={hotelDest} onChange={setHotelDest} placeholder="Nereye?" />
            <div className="grid grid-cols-2 gap-1.5">
              <MiniDateInput value={hotelCheckin} onChange={setHotelCheckin} placeholder="Giriş" />
              <MiniDateInput value={hotelCheckout} onChange={setHotelCheckout} placeholder="Çıkış" />
            </div>
            <MiniGuestPanel config={hotelGuests} onChange={setHotelGuests} />
            <Link href={`/hotels?q=${encodeURIComponent(hotelDest)}`}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-[var(--brand)] py-2 text-xs font-bold text-white transition-all hover:bg-[var(--brand)]/90">
              <Search className="h-3 w-3" /> Otel Ara
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
