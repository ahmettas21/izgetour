'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search, Bell, BellOff, Trash2, Clock, TrendingDown,
  Plane, Hotel, MapPin,
} from 'lucide-react';

export interface SavedSearch {
  id: string;
  type: 'flight' | 'hotel' | 'tour';
  query: string;
  destination: string;
  dateRange: string;
  savedAt: number;
  lastPrice: number;
  currentPrice: number;
  currency: string;
  alertEnabled: boolean;
}

const STORAGE_KEY = 'izgetour_saved_searches';

const DEMO_SEARCHES: SavedSearch[] = [
  {
    id: '1', type: 'flight', query: 'İstanbul → Antalya',
    destination: 'Antalya', dateRange: '15-22 Haz',
    savedAt: Date.now() - 86400000 * 2, lastPrice: 2400,
    currentPrice: 2150, currency: '₺', alertEnabled: true,
  },
  {
    id: '2', type: 'hotel', query: 'Kapadokya Butik Otel',
    destination: 'Nevşehir', dateRange: '1-5 Tem',
    savedAt: Date.now() - 86400000, lastPrice: 3200,
    currentPrice: 3200, currency: '₺', alertEnabled: false,
  },
  {
    id: '3', type: 'tour', query: 'Ege Kıyıları 7 Gün',
    destination: 'İzmir', dateRange: '10-17 Ağu',
    savedAt: Date.now() - 3600000 * 5, lastPrice: 8500,
    currentPrice: 7900, currency: '₺', alertEnabled: true,
  },
];

const typeIcon = { flight: Plane, hotel: Hotel, tour: MapPin };
const typeColor = {
  flight: 'text-sky-500 bg-sky-50',
  hotel: 'text-purple-500 bg-purple-50',
  tour: 'text-emerald-500 bg-emerald-50',
};

interface Props { locale?: string; }

export default function SavedSearches({ locale = 'tr' }: Props) {
  const isTr = locale === 'tr';
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [filter, setFilter] = useState<'all' | 'flight' | 'hotel' | 'tour'>('all');

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    setSearches(raw ? JSON.parse(raw) : DEMO_SEARCHES);
  }, []);

  const persist = useCallback((next: SavedSearch[]) => {
    setSearches(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const toggleAlert = (id: string) => {
    persist(searches.map(s => s.id === id ? { ...s, alertEnabled: !s.alertEnabled } : s));
  };

  const remove = (id: string) => persist(searches.filter(s => s.id !== id));

  const filtered = filter === 'all' ? searches : searches.filter(s => s.type === filter);
  const alerts = searches.filter(s => s.alertEnabled && s.currentPrice < s.lastPrice);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-bold text-zinc-900">
            {isTr ? 'Kayıtlı Aramalarım' : 'My Saved Searches'}
          </h2>
        </div>
        {alerts.length > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            <TrendingDown className="h-3 w-3" />
            {alerts.length} {isTr ? 'fiyat düştü!' : 'price drop!'}
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex gap-2">
        {(['all', 'flight', 'hotel', 'tour'] as const).map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              filter === t ? 'bg-orange-500 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}>
            {t === 'all' ? (isTr ? 'Tümü' : 'All')
              : t === 'flight' ? (isTr ? 'Uçuş' : 'Flight')
              : t === 'hotel' ? 'Otel'
              : (isTr ? 'Tur' : 'Tour')}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-400">
          {isTr ? 'Henüz kayıtlı arama yok.' : 'No saved searches yet.'}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => {
            const Icon = typeIcon[s.type];
            const colors = typeColor[s.type];
            const priceDrop = s.currentPrice < s.lastPrice;
            return (
              <div key={s.id}
                className="flex items-center gap-4 rounded-xl border border-zinc-100 p-4 transition hover:border-zinc-200 hover:shadow-sm">
                <div className={`rounded-xl p-2.5 ${colors.split(' ')[1]}`}>
                  <Icon className={`h-5 w-5 ${colors.split(' ')[0]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-800 truncate">{s.query}</span>
                    {priceDrop && (
                      <span className="flex items-center gap-0.5 text-[11px] font-bold text-green-600">
                        <TrendingDown className="h-3 w-3" />
                        {s.currency}{s.lastPrice - s.currentPrice}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-400">
                    <Clock className="h-3 w-3" /> {s.dateRange}
                    <span>·</span> {s.destination}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${priceDrop ? 'text-green-600' : 'text-zinc-800'}`}>
                    {s.currency}{s.currentPrice.toLocaleString()}
                  </div>
                  {priceDrop && (
                    <div className="text-[11px] text-zinc-400 line-through">
                      {s.currency}{s.lastPrice.toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleAlert(s.id)}
                    className={`rounded-lg p-2 transition ${s.alertEnabled ? 'bg-orange-50 text-orange-500' : 'bg-zinc-50 text-zinc-400'} hover:bg-orange-100`}
                    title={s.alertEnabled ? (isTr ? 'Bildirimi kapat' : 'Disable alert') : (isTr ? 'Bildirim aç' : 'Enable alert')}>
                    {s.alertEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                  </button>
                  <button onClick={() => remove(s.id)}
                    className="rounded-lg p-2 text-zinc-400 transition hover:bg-red-50 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
