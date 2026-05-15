'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  Plane, Building2, Compass, ArrowRight, MapPin, Star, Hotel,
  Search, CalendarDays, Users, ChevronDown, X, Minus, Plus,
  DoorOpen,
} from 'lucide-react';
import FlightSearchForm from '@/components/flights/FlightSearchForm';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { SearchParams } from '@/components/flights/types';
import { MOCK_TOURS } from '@/data/tours';
import { hotels as MOCK_HOTELS } from '@/data/hotels';

type Tab = 'flights' | 'tours' | 'hotels';

// ─── TYPES ──────────────────────────────────────────────────────
type RoomConfig = { adults: number; children: { age: number }[] };
type GuestConfig = { rooms: RoomConfig[] };

// ─── DATA ────────────────────────────────────────────────────────
const CHILD_AGES = Array.from({ length: 18 }, (_, i) => ({
  label: String(i), value: i,
}));

const CITY_OPTIONS = [
  { label: 'İstanbul', value: 'istanbul' },
  { label: 'Antalya', value: 'antalya' },
  { label: 'Kapadokya', value: 'kapadokya' },
  { label: 'İzmir', value: 'izmir' },
  { label: 'Bodrum', value: 'bodrum' },
  { label: 'Marmaris', value: 'marmaris' },
  { label: 'Fethiye', value: 'fethiye' },
  { label: 'Pamukkale', value: 'pamukkale' },
  { label: 'Trabzon', value: 'trabzon' },
  { label: 'Efes', value: 'efes' },
];

const TOUR_CATEGORIES = [
  { value: '', labelTr: 'Tüm Turlar' },
  { value: 'kultur', labelTr: 'Kültür Turları' },
  { value: 'macera', labelTr: 'Macera Turları' },
  { value: 'deniz', labelTr: 'Deniz & Plaj' },
  { value: 'gastronomi', labelTr: 'Gastronomi' },
  { value: 'dogal', labelTr: 'Doğa & Kamp' },
];

// ─── HELPERS ────────────────────────────────────────────────────
function defaultGuestConfig(): GuestConfig {
  return { rooms: [{ adults: 2, children: [] }] };
}
function totalGuests(g: GuestConfig) {
  return g.rooms.reduce((s, r) => s + r.adults + r.children.length, 0);
}
function totalAdults(g: GuestConfig) {
  return g.rooms.reduce((s, r) => s + r.adults, 0);
}
function totalChildren(g: GuestConfig) {
  return g.rooms.reduce((s, r) => s + r.children.length, 0);
}
function guestSummary(g: GuestConfig): string {
  const rooms = g.rooms.length;
  const adults = totalAdults(g);
  const children = totalChildren(g);
  let s = `${rooms} oda, ${adults} yetişkin`;
  if (children > 0) s += `, ${children} çocuk`;
  return s;
}
function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}
function nextDayStr(date: string): string {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

// ─────────────────────────────────────────────────────────────────
// DATE INPUT
function DateInput({ value, onChange, placeholder, icon, min }: {
  value: string; onChange: (v: string) => void; placeholder: string; icon: React.ReactNode; min?: string;
}) {
  return (
    <div className="relative flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-3 transition-all focus-within:border-[var(--brand)] focus-within:ring-2 focus-within:ring-[var(--brand)]/10 dark:border-gray-600 dark:bg-gray-800/50">
      <span className="shrink-0 text-gray-400">{icon}</span>
      <input
        type="date" value={value} min={min ?? todayStr()}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-sm font-medium text-gray-800 outline-none [color-scheme:light] dark:text-gray-100 dark:[color-scheme:dark]"
      />
      {!value && (
        <span className="pointer-events-none absolute left-9 text-sm text-gray-400">{placeholder}</span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// LOCATION INPUT + DROPDOWN
function LocationInput({ value, onChange, placeholder, options }: {
  value: string; onChange: (v: string) => void; placeholder: string; options: { label: string; value: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const filtered = options.filter((o) => o.label.toLowerCase().includes(value.toLowerCase()));
  return (
    <div ref={ref} className="relative">
      <div className="relative flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-3 transition-all focus-within:border-[var(--brand)] focus-within:ring-2 focus-within:ring-[var(--brand)]/10 dark:border-gray-600 dark:bg-gray-800/50">
        <span className="shrink-0 text-gray-400"><MapPin className="h-4 w-4" /></span>
        <input type="text" value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)} placeholder={placeholder}
          className="flex-1 bg-transparent text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400 dark:text-gray-100" />
        {value && (
          <button onClick={() => { onChange(''); setOpen(false); }} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800">
          {filtered.map((opt) => (
            <li key={opt.value}>
              <button type="button"
                onClick={() => { onChange(opt.label); setOpen(false); }}
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

// ─────────────────────────────────────────────────────────────────
// ROOM-LEVEL GUEST PANEL (Booking.com / Expedia)
function RoomGuestPanel({ config, onChange }: { config: GuestConfig; onChange: (c: GuestConfig) => void }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const updateRoom = (i: number, patch: Partial<RoomConfig>) => {
    const rooms = [...config.rooms]; rooms[i] = { ...rooms[i], ...patch };
    onChange({ ...config, rooms });
  };
  const addRoom = () => {
    if (config.rooms.length >= 6) return;
    onChange({ ...config, rooms: [...config.rooms, { adults: 1, children: [] }] });
  };
  const removeRoom = (i: number) => {
    if (config.rooms.length <= 1) return;
    onChange({ ...config, rooms: config.rooms.filter((_, idx) => idx !== i) });
  };
  const addChildAge = (i: number) => {
    if (config.rooms[i].children.length >= 4) return;
    updateRoom(i, { children: [...config.rooms[i].children, { age: 3 }] });
  };
  const removeChildAge = (i: number, childIdx: number) => {
    updateRoom(i, { children: config.rooms[i].children.filter((_, ci) => ci !== childIdx) });
  };
  const setChildAge = (i: number, childIdx: number, age: number) => {
    const children = [...config.rooms[i].children]; children[childIdx] = { age };
    updateRoom(i, { children });
  };

  return (
    <div ref={panelRef} className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-3 text-left transition-all hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800/50">
        <Users className="h-4 w-4 shrink-0 text-[var(--brand)]" />
        <div className="min-w-0 flex-1"><span className="text-sm font-medium text-gray-800 dark:text-gray-100">{guestSummary(config)}</span></div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[340px] rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-600 dark:bg-gray-800">
          {config.rooms.map((room, ri) => (
            <div key={ri} className={ri > 0 ? 'mt-4 border-t border-gray-100 pt-4 dark:border-gray-700' : ''}>
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <DoorOpen className="h-3.5 w-3.5" /> Oda {ri + 1}
                </span>
                {config.rooms.length > 1 && (
                  <button type="button" onClick={() => removeRoom(ri)}
                    className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">👤 Yetişkin</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => updateRoom(ri, { adults: Math.max(1, room.adults - 1) })} disabled={room.adults <= 1}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-30 dark:border-gray-600"><Minus className="h-3 w-3" /></button>
                    <span className="w-6 text-center text-sm font-semibold text-gray-800 dark:text-gray-100">{room.adults}</span>
                    <button type="button" onClick={() => updateRoom(ri, { adults: Math.min(4, room.adults + 1) })} disabled={room.adults >= 4}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-30 dark:border-gray-600"><Plus className="h-3 w-3" /></button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">🧒 Çocuk</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => removeChildAge(ri, room.children.length - 1)} disabled={room.children.length <= 0}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-30 dark:border-gray-600"><Minus className="h-3 w-3" /></button>
                    <span className="w-6 text-center text-sm font-semibold text-gray-800 dark:text-gray-100">{room.children.length}</span>
                    <button type="button" onClick={() => addChildAge(ri)} disabled={room.children.length >= 4}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-30 dark:border-gray-600"><Plus className="h-3 w-3" /></button>
                  </div>
                </div>
                {room.children.length > 0 && (
                  <div className="ml-4 space-y-1.5">
                    {room.children.map((child, ci) => (
                      <div key={ci} className="flex items-center gap-2 text-sm">
                        <span className="w-20 text-xs text-gray-400">Çocuk {ci + 1} yaş:</span>
                        <select value={child.age} onChange={(e) => setChildAge(ri, ci, parseInt(e.target.value))}
                          className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
                          {CHILD_AGES.map((a) => (<option key={a.value} value={a.value}>{a.label} yaş</option>))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {config.rooms.length < 6 && (
            <button type="button" onClick={addRoom}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-gray-300 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)] dark:border-gray-600">
              <Plus className="h-4 w-4" /> Oda Ekle
            </button>
          )}
          <button type="button" onClick={() => setOpen(false)}
            className="mt-3 w-full rounded-xl bg-[var(--brand)] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand)]/90">Tamam</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TOUR GUEST SELECTOR (yetiskin + cocuk + bebek)
function TourGuestPanel({ adults, setAdults, childrenCount, setChildrenCount, infants, setInfants }: {
  adults: number; setAdults: (n: number) => void;
  childrenCount: number; setChildrenCount: (n: number) => void;
  infants: number; setInfants: (n: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const summary = `${adults} yetişkin${childrenCount ? `, ${childrenCount} çocuk` : ''}${infants ? `, ${infants} bebek` : ''}`;
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-3 text-left transition-all hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800/50">
        <Users className="h-4 w-4 shrink-0 text-[var(--brand)]" />
        <span className="min-w-0 flex-1 text-sm font-medium text-gray-800 dark:text-gray-100">{summary}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-600 dark:bg-gray-800">
          <CounterRow label="👤 Yetişkin" value={adults} min={1} max={20} onChange={setAdults} />
          <CounterRow label="🧒 Çocuk (3-12)" value={childrenCount} min={0} max={10} onChange={setChildrenCount} />
          <CounterRow label="👶 Bebek (0-2)" value={infants} min={0} max={5} onChange={setInfants} helper="Bebekler kucakta seyahat eder" />
          <button type="button" onClick={() => setOpen(false)} className="mt-3 w-full rounded-xl bg-[var(--brand)] py-2.5 text-sm font-semibold text-white">Tamam</button>
        </div>
      )}
    </div>
  );
}

function CounterRow({ label, value, min = 0, max, onChange, helper }: {
  label: string; value: number; min?: number; max: number; onChange: (n: number) => void; helper?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div>
        <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>
        {helper && <p className="text-[10px] text-gray-400">{helper}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-30 dark:border-gray-600"><Minus className="h-3 w-3" /></button>
        <span className="w-6 text-center text-sm font-semibold text-gray-800 dark:text-gray-100">{value}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-30 dark:border-gray-600"><Plus className="h-3 w-3" /></button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ANA COMPONENT
export default function SmartSearchContainer() {
  const t = useTranslations('flights');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('flights');
  const [promoCode, setPromoCode] = useState('');

  // --- TUR STATE ---
  const [tourDest, setTourDest] = useState('');
  const [tourDate, setTourDate] = useState('');
  const [tourDateEnd, setTourDateEnd] = useState('');
  const [tourCategory, setTourCategory] = useState('');
  const [tourAdults, setTourAdults] = useState(2);
  const [tourChildren, setTourChildren] = useState(0);
  const [tourInfants, setTourInfants] = useState(0);

  // --- OTEL STATE ---
  const [hotelDest, setHotelDest] = useState('');
  const [hotelCheckin, setHotelCheckin] = useState('');
  const [hotelCheckout, setHotelCheckout] = useState('');
  const [hotelGuests, setHotelGuests] = useState<GuestConfig>(defaultGuestConfig);

  // Otomatik checkout +1 gun
  useEffect(() => {
    if (hotelCheckin && (!hotelCheckout || hotelCheckout <= hotelCheckin)) {
      setHotelCheckout(nextDayStr(hotelCheckin));
    }
  }, [hotelCheckin]);

  const handleFlightSearch = async (_params: SearchParams) => { router.push('/flights'); };

  const filteredTours = MOCK_TOURS.filter((tour) => {
    const matchesDest = !tourDest || tour.title.toLowerCase().includes(tourDest.toLowerCase()) || tour.titleEn.toLowerCase().includes(tourDest.toLowerCase()) || tour.location.toLowerCase().includes(tourDest.toLowerCase());
    const matchesCat = !tourCategory || (tour.category && tour.category.toLowerCase() === tourCategory);
    return matchesDest && matchesCat;
  }).slice(0, 3);

  const filteredHotels = MOCK_HOTELS.filter((h) => {
    return !hotelDest || h.title.toLowerCase().includes(hotelDest.toLowerCase()) || h.titleEn.toLowerCase().includes(hotelDest.toLowerCase()) || h.city.toLowerCase().includes(hotelDest.toLowerCase());
  }).slice(0, 3);

  return (
    <div className="rounded-2xl bg-white/95 shadow-2xl backdrop-blur-sm dark:bg-gray-900/95">
      {/* Tab Bar */}
      <div className="border-b border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex gap-1">
            {([
              { key: 'flights' as Tab, icon: Plane, label: t('title') },
              { key: 'tours' as Tab, icon: Compass, label: t('toursTab') },
              { key: 'hotels' as Tab, icon: Building2, label: t('hotelsTab') },
            ] as const).map(({ key, icon: Icon, label }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === key ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FLIGHTS */}
      {activeTab === 'flights' && (
        <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
          <FlightSearchForm onSearch={handleFlightSearch} />
        </div>
      )}

      {/* TOURS */}
      {activeTab === 'tours' && (
        <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div className="sm:col-span-1">
              <LocationInput value={tourDest} onChange={setTourDest} placeholder="Nereye?" options={CITY_OPTIONS} />
            </div>
            <DateInput value={tourDate} onChange={setTourDate} placeholder="Başlangıç" icon={<CalendarDays className="h-4 w-4" />} />
            <DateInput value={tourDateEnd} onChange={setTourDateEnd} placeholder="Bitiş (isteğe bağlı)" icon={<CalendarDays className="h-4 w-4" />} min={tourDate || todayStr()} />
            <div className="relative">
              <select value={tourCategory} onChange={(e) => setTourCategory(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-3 text-sm font-medium text-gray-800 outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/10 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-100">
                {TOUR_CATEGORIES.map((cat) => (<option key={cat.value} value={cat.value}>{cat.labelTr}</option>))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-5">
            <div className="sm:col-span-3">
              <TourGuestPanel adults={tourAdults} setAdults={setTourAdults}
                childrenCount={tourChildren} setChildrenCount={setTourChildren}
                infants={tourInfants} setInfants={setTourInfants} />
            </div>
            <div className="sm:col-span-2">
              <Link href={`/tours?q=${encodeURIComponent(tourDest)}`}
                className="flex h-full w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[var(--brand)]/90 hover:shadow-md active:scale-[0.98]">
                <Search className="h-4 w-4" /> Tur Ara
              </Link>
            </div>
          </div>

          {/* Canli sonuclar */}
          {(tourDest || filteredTours.length > 0) && filteredTours.length > 0 && (
            <div className="mt-5 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{filteredTours.length} tur bulundu</p>
              {filteredTours.map((tour) => (
                <Link key={tour.id} href={`/tours/${tour.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-[var(--brand)] hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                    <Image src={tour.image} alt={tour.title} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand)]">
                      <MapPin className="h-3 w-3" /> {tour.location}
                    </span>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{tour.title}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{tour.rating}</div>
                      <span>{tour.duration} gün</span>
                      <span className="font-semibold text-[var(--brand)]">₺{tour.price.toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[var(--brand)]" />
                </Link>
              ))}
            </div>
          )}

          {!tourDest && !tourDate && filteredTours.length === 0 && (
            <div className="mt-6 text-center">
              <Link href="/tours" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:underline">
                Tüm Turları Keşfet <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* HOTELS */}
      {activeTab === 'hotels' && (
        <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <LocationInput value={hotelDest} onChange={setHotelDest} placeholder="Nereye gidiyorsunuz?" options={CITY_OPTIONS} />
            <DateInput value={hotelCheckin} onChange={setHotelCheckin} placeholder="Giriş" icon={<CalendarDays className="h-4 w-4" />} />
            <DateInput value={hotelCheckout} onChange={setHotelCheckout} placeholder="Çıkış" icon={<CalendarDays className="h-4 w-4" />} min={hotelCheckin || todayStr()} />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <RoomGuestPanel config={hotelGuests} onChange={setHotelGuests} />
            </div>
            <div className="sm:col-span-1">
              <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promosyon Kodu"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-3 text-sm font-medium text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/10 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-100" />
            </div>
            <div className="sm:col-span-1">
              <Link href={`/hotels?q=${encodeURIComponent(hotelDest)}`}
                className="flex h-full w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[var(--brand)]/90 hover:shadow-md active:scale-[0.98]">
                <Search className="h-4 w-4" /> Otel Ara
              </Link>
            </div>
          </div>

          {/* Canli sonuclar */}
          {filteredHotels.length > 0 && (
            <div className="mt-5 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{filteredHotels.length} otel bulundu</p>
              {filteredHotels.map((h) => (
                <Link key={h.id} href={`/hotels/${h.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-[var(--brand)] hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                    <Image src={h.image} alt={h.title} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand)]">
                      <Hotel className="h-3 w-3" /> {h.city}
                    </span>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{h.title}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{h.rating}</div>
                      <span className="font-semibold text-[var(--brand)]">₺{h.price.toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[var(--brand)]" />
                </Link>
              ))}
            </div>
          )}

          {!hotelDest && !hotelCheckin && filteredHotels.length === 0 && (
            <div className="mt-6 text-center">
              <Link href="/hotels" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:underline">
                Tüm Otelleri Keşfet <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
