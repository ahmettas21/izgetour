'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Plane, Building2, Compass, ArrowRight, MapPin, Star, Hotel, Search, CalendarDays, Users, ChevronDown, X, Minus, Plus } from 'lucide-react';
import FlightSearchForm from '@/components/flights/FlightSearchForm';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { SearchParams } from '@/components/flights/types';
import { MOCK_TOURS } from '@/data/tours';
import { hotels as MOCK_HOTELS } from '@/data/hotels';

type Tab = 'flights' | 'tours' | 'hotels';

// ─── Ortak bileşen: özel date input ────────────────────────────────
function DateInput({ value, onChange, placeholder, icon }: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-3 transition-all focus-within:border-[var(--brand)] focus-within:ring-2 focus-within:ring-[var(--brand)]/10 dark:border-gray-600 dark:bg-gray-800/50">
      <span className="shrink-0 text-gray-400">{icon}</span>
      <input
        type="date"
        value={value}
        min={new Date().toISOString().split('T')[0]}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-sm font-medium text-gray-800 outline-none [color-scheme:light] dark:text-gray-100 dark:[color-scheme:dark]"
      />
      {!value && (
        <span className="pointer-events-none absolute left-9 text-sm text-gray-400">{placeholder}</span>
      )}
    </div>
  );
}

// ─── Ortak bileşen: yolcu/kişi sayısı seçici ──────────────────────
function GuestSelector({ value, onChange, min = 1, max = 10, labelTr, labelEn }: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  labelTr: string;
  labelEn: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-2.5 dark:border-gray-600 dark:bg-gray-800/50">
      <span className="text-sm text-gray-500 dark:text-gray-400">👤 {labelTr}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-30 dark:border-gray-600"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-6 text-center text-sm font-semibold text-gray-800 dark:text-gray-100">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:opacity-30 dark:border-gray-600"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

// ─── Ortak bileşen: şehir/destinasyon input + dropdown ────────────
function LocationInput({ value, onChange, placeholder, options }: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { label: string; value: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = options.filter(
    (o) => o.label.toLowerCase().includes(value.toLowerCase()),
  );

  return (
    <div ref={ref} className="relative">
      <div className="relative flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-3 transition-all focus-within:border-[var(--brand)] focus-within:ring-2 focus-within:ring-[var(--brand)]/10 dark:border-gray-600 dark:bg-gray-800/50">
        <span className="shrink-0 text-gray-400"><MapPin className="h-4 w-4" /></span>
        <input
          type="text"
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400 dark:text-gray-100"
        />
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
              <button
                type="button"
                onClick={() => { onChange(opt.label); setOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Tur arama opsiyonları ────────────────────────────────────────
const TOUR_CATEGORIES = [
  { value: '', labelTr: 'Tüm Turlar', labelEn: 'All Tours' },
  { value: 'kultur', labelTr: 'Kültür Turları', labelEn: 'Culture Tours' },
  { value: 'macera', labelTr: 'Macera Turları', labelEn: 'Adventure Tours' },
  { value: 'deniz', labelTr: 'Deniz & Plaj', labelEn: 'Sea & Beach' },
  { value: 'gastronomi', labelTr: 'Gastronomi Turları', labelEn: 'Food Tours' },
  { value: 'dogal', labelTr: 'Doğa & Kamp', labelEn: 'Nature & Camping' },
];

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

// ═══════════════════════════════════════════════════════════════════
// ANA COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function SmartSearchContainer() {
  const t = useTranslations('flights');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('flights');

  // ─── TUR STATE ────────────────────────────────────────────────
  const [tourDest, setTourDest] = useState('');
  const [tourDate, setTourDate] = useState('');
  const [tourGuests, setTourGuests] = useState(2);
  const [tourCategory, setTourCategory] = useState('');

  // ─── OTEL STATE ───────────────────────────────────────────────
  const [hotelDest, setHotelDest] = useState('');
  const [hotelCheckin, setHotelCheckin] = useState('');
  const [hotelCheckout, setHotelCheckout] = useState('');
  const [hotelGuests, setHotelGuests] = useState(2);

  const handleFlightSearch = async (_params: SearchParams) => {
    router.push('/flights');
  };

  // ─── Filtreleme ──────────────────────────────────────────────
  const filteredTours = MOCK_TOURS.filter((tour) => {
    const matchesDest =
      !tourDest ||
      tour.title.toLowerCase().includes(tourDest.toLowerCase()) ||
      tour.titleEn.toLowerCase().includes(tourDest.toLowerCase()) ||
      tour.location.toLowerCase().includes(tourDest.toLowerCase());
    const matchesCat =
      !tourCategory ||
      (tour.category && tour.category.toLowerCase() === tourCategory);
    return matchesDest && matchesCat;
  }).slice(0, 3);

  const filteredHotels = MOCK_HOTELS.filter((h) => {
    return (
      !hotelDest ||
      h.title.toLowerCase().includes(hotelDest.toLowerCase()) ||
      h.titleEn.toLowerCase().includes(hotelDest.toLowerCase()) ||
      h.city.toLowerCase().includes(hotelDest.toLowerCase())
    );
  }).slice(0, 3);

  // ─── Tab içeriği render helper ───────────────────────────────
  const activeLabel = (() => {
    if (activeTab === 'flights') return t('title');
    if (activeTab === 'tours') return t('toursTab');
    return t('hotelsTab');
  })();

  return (
    <div className="rounded-2xl bg-white/95 shadow-2xl backdrop-blur-sm dark:bg-gray-900/95">
      {/* ── Tab Bar ── */}
      <div className="border-b border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex gap-1">
            {([
              { key: 'flights' as Tab, icon: Plane, label: t('title') },
              { key: 'tours' as Tab, icon: Compass, label: t('toursTab') },
              { key: 'hotels' as Tab, icon: Building2, label: t('hotelsTab') },
            ] as const).map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`
                  flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors
                  ${activeTab === key
                    ? 'border-[var(--brand)] text-[var(--brand)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}
                `}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          FLIGHTS TAB (mevcut)
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'flights' && (
        <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
          <FlightSearchForm onSearch={handleFlightSearch} />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TOURS TAB — GetYourGuide / Viator tarzı
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'tours' && (
        <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
          {/* 3 sütunlu form: nereye + tarih + kategori */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <LocationInput
              value={tourDest}
              onChange={setTourDest}
              placeholder="Nereye?"
              options={CITY_OPTIONS}
            />
            <DateInput
              value={tourDate}
              onChange={setTourDate}
              placeholder="Tarih seçin"
              icon={<CalendarDays className="h-4 w-4" />}
            />
            {/* Kategori seçici */}
            <div className="relative">
              <select
                value={tourCategory}
                onChange={(e) => setTourCategory(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-3 text-sm font-medium text-gray-800 outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/10 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-100"
              >
                {TOUR_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.labelTr}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Kişi sayısı */}
          <div className="mt-3 sm:mt-4">
            <GuestSelector
              value={tourGuests}
              onChange={setTourGuests}
              min={1}
              max={20}
              labelTr="Kişi Sayısı"
              labelEn="Guests"
            />
          </div>

          {/* Ara butonu */}
          <div className="mt-4 sm:mt-5">
            <Link
              href={`/tours?q=${encodeURIComponent(tourDest)}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[var(--brand)]/90 hover:shadow-md active:scale-[0.98]"
            >
              <Search className="h-4 w-4" />
              Tur Ara
            </Link>
          </div>

          {/* Canlı sonuçlar — yazınca anında çıksın */}
          {filteredTours.length > 0 && (
            <div className="mt-5 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {filteredTours.length} tur bulundu
              </p>
              {filteredTours.map((tour) => (
                <Link
                  key={tour.id}
                  href={`/tours/${tour.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-[var(--brand)] hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                    <Image src={tour.image} alt={tour.title} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand)]">
                      <MapPin className="h-3 w-3" />
                      {tour.location}
                    </span>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{tour.title}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {tour.rating}
                      </div>
                      <span>{tour.duration} {tour.duration === 1 ? 'gün' : 'gün'}</span>
                      <span className="font-semibold text-[var(--brand)]">₺{tour.price.toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[var(--brand)]" />
                </Link>
              ))}
            </div>
          )}

          {/* Quick link — boşken */}
          {!tourDest && !tourDate && (
            <div className="mt-6 text-center">
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:underline"
              >
                Tüm Turları Keşfet
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          HOTELS TAB — Booking.com / Expedia tarzı
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'hotels' && (
        <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
          {/* 2 sütun üst: nereye + giriş tarihi */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <LocationInput
                value={hotelDest}
                onChange={setHotelDest}
                placeholder="Nereye gidiyorsunuz?"
                options={CITY_OPTIONS}
              />
            </div>
            <DateInput
              value={hotelCheckin}
              onChange={setHotelCheckin}
              placeholder="Giriş"
              icon={<CalendarDays className="h-4 w-4" />}
            />
            <DateInput
              value={hotelCheckout}
              onChange={(v) => {
                setHotelCheckout(v);
                if (!v && hotelCheckin) {
                  const next = new Date(hotelCheckin);
                  next.setDate(next.getDate() + 1);
                  setHotelCheckout(next.toISOString().split('T')[0]);
                }
              }}
              placeholder="Çıkış"
              icon={<CalendarDays className="h-4 w-4" />}
            />
          </div>

          {/* Kişi sayısı */}
          <div className="mt-3 sm:mt-4">
            <GuestSelector
              value={hotelGuests}
              onChange={setHotelGuests}
              min={1}
              max={10}
              labelTr="Misafir Sayısı"
              labelEn="Guests"
            />
          </div>

          {/* Ara butonu */}
          <div className="mt-4 sm:mt-5">
            <Link
              href={`/hotels?q=${encodeURIComponent(hotelDest)}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[var(--brand)]/90 hover:shadow-md active:scale-[0.98]"
            >
              <Search className="h-4 w-4" />
              Otel Ara
            </Link>
          </div>

          {/* Canlı sonuçlar */}
          {filteredHotels.length > 0 && (
            <div className="mt-5 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {filteredHotels.length} otel bulundu
              </p>
              {filteredHotels.map((h) => (
                <Link
                  key={h.id}
                  href={`/hotels/${h.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-[var(--brand)] hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                    <Image src={h.image} alt={h.title} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand)]">
                      <Hotel className="h-3 w-3" />
                      {h.city}
                    </span>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{h.title}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {h.rating}
                      </div>
                      <span className="font-semibold text-[var(--brand)]">₺{h.price.toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[var(--brand)]" />
                </Link>
              ))}
            </div>
          )}

          {/* Quick link — boşken */}
          {!hotelDest && !hotelCheckin && (
            <div className="mt-6 text-center">
              <Link
                href="/hotels"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:underline"
              >
                Tüm Otelleri Keşfet
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
