'use client';

import { useState, useMemo } from 'react';
import {
  Calendar, ChevronLeft, ChevronRight, Plane,
  TrendingDown, Info,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Flexible Date Calendar Heatmap — Kayak-style cheapest-day finder  */
/* ------------------------------------------------------------------ */

interface DayPrice {
  date: string;      // YYYY-MM-DD
  price: number | null;
  available: boolean;
}

/* Generate mock price data for a month */
function generateMonthPrices(year: number, month: number): DayPrice[] {
  const days: DayPrice[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateStr = date.toISOString().split('T')[0];
    const isPast = date < today;
    if (isPast) {
      days.push({ date: dateStr, price: null, available: false });
      continue;
    }
    const dow = date.getDay();
    const base = 800 + Math.round(Math.sin(d * 0.5) * 300) + (dow === 0 || dow === 6 ? 400 : 0);
    const jitter = Math.round(Math.random() * 200 - 100);
    const price = Math.max(400, base + jitter);
    days.push({ date: dateStr, price, available: true });
  }
  return days;
}

function getPriceLevel(price: number, min: number, max: number): 'cheap' | 'mid' | 'pricey' | 'expensive' {
  const range = max - min || 1;
  const ratio = (price - min) / range;
  if (ratio < 0.25) return 'cheap';
  if (ratio < 0.5) return 'mid';
  if (ratio < 0.75) return 'pricey';
  return 'expensive';
}

const LEVEL_COLORS = {
  cheap: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 ring-emerald-400',
  mid: 'bg-amber-50 text-amber-800 hover:bg-amber-100 ring-amber-400',
  pricey: 'bg-orange-100 text-orange-800 hover:bg-orange-200 ring-orange-400',
  expensive: 'bg-red-100 text-red-800 hover:bg-red-200 ring-red-400',
};

const DAY_LABELS_TR = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const DAY_LABELS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MONTH_NAMES_TR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const MONTH_NAMES_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];

interface Props {
  locale?: string;
  route?: string;
  onSelectDate?: (date: string, price: number) => void;
}

export default function FlexibleDateCalendar({ locale = 'tr', route, onSelectDate }: Props) {
  const isTr = locale === 'tr';
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [selected, setSelected] = useState<string | null>(null);

  const days = useMemo(() => generateMonthPrices(viewYear, viewMonth), [viewYear, viewMonth]);
  const prices = days.map(d => d.price).filter((p): p is number => p !== null);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const cheapestDay = days.find(d => d.price === minPrice);

  /* Calendar grid padding */
  const firstDow = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Monday=0

  const goMonth = (delta: number) => {
    let m = viewMonth + delta, y = viewYear;
    if (m > 11) { m = 0; y++; } else if (m < 0) { m = 11; y--; }
    setViewMonth(m); setViewYear(y);
  };

  const handleSelect = (d: DayPrice) => {
    if (!d.available || d.price == null) return;
    setSelected(d.date);
    onSelectDate?.(d.date, d.price);
  };

  const dayLabels = isTr ? DAY_LABELS_TR : DAY_LABELS_EN;
  const monthNames = isTr ? MONTH_NAMES_TR : MONTH_NAMES_EN;

  return (
    <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-cyan-500 px-6 py-5 text-white">
        <div className="flex items-center gap-3 mb-1">
          <Calendar className="w-5 h-5" />
          <h2 className="text-lg font-bold">{isTr ? 'Esnek Tarih Takvimi' : 'Flexible Date Calendar'}</h2>
        </div>
        {route && <p className="text-sky-100 text-sm flex items-center gap-1"><Plane className="w-4 h-4" /> {route}</p>}
        {cheapestDay && (
          <p className="text-sm mt-2 bg-white/15 rounded-lg px-3 py-1.5 inline-flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-300" />
            {isTr ? 'En ucuz gün:' : 'Cheapest:'} <strong>{cheapestDay.date.split('-')[2]}/{+cheapestDay.date.split('-')[1]}</strong> — {minPrice.toLocaleString('tr-TR')}₺
          </p>
        )}
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
        <button onClick={() => goMonth(-1)} className="p-1.5 rounded-lg hover:bg-gray-100 transition"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
        <span className="font-semibold text-gray-700">{monthNames[viewMonth]} {viewYear}</span>
        <button onClick={() => goMonth(1)} className="p-1.5 rounded-lg hover:bg-gray-100 transition"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
      </div>

      {/* Calendar Grid */}
      <div className="px-4 py-3">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayLabels.map(dl => (
            <div key={dl} className="text-center text-xs font-medium text-gray-400 py-1">{dl}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {Array.from({ length: firstDow }).map((_, i) => <div key={`e-${i}`} />)}
          {days.map(d => {
            const day = parseInt(d.date.split('-')[2]);
            if (!d.available || d.price == null) {
              return (
                <div key={d.date} className="aspect-square flex flex-col items-center justify-center rounded-lg bg-gray-50 text-gray-300 text-xs">
                  <span>{day}</span>
                </div>
              );
            }
            const level = getPriceLevel(d.price, minPrice, maxPrice);
            const isSelected = selected === d.date;
            return (
              <button key={d.date} onClick={() => handleSelect(d)}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs transition cursor-pointer ${LEVEL_COLORS[level]} ${isSelected ? 'ring-2 ring-offset-1 scale-105 font-bold' : ''}`}>
                <span className="font-medium">{day}</span>
                <span className="text-[10px] opacity-80">{d.price >= 1000 ? `${(d.price / 1000).toFixed(1)}k` : d.price}₺</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500 bg-gray-50">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-200" />{isTr ? 'Ucuz' : 'Cheap'}</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-100" />{isTr ? 'Orta' : 'Medium'}</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-200" />{isTr ? 'Pahalı' : 'Pricey'}</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-200" />{isTr ? 'Yüksek' : 'High'}</div>
      </div>

      {/* Selected day info */}
      {selected && (
        <div className="px-6 py-3 border-t border-gray-100 bg-indigo-50 flex items-center justify-between">
          <span className="text-sm text-indigo-800 flex items-center gap-2">
            <Info className="w-4 h-4" />
            {isTr ? 'Seçilen tarih:' : 'Selected:'} <strong>{selected}</strong>
          </span>
          <span className="text-sm font-bold text-indigo-600">
            {days.find(d => d.date === selected)?.price?.toLocaleString('tr-TR')}₺
          </span>
        </div>
      )}
    </section>
  );
}
