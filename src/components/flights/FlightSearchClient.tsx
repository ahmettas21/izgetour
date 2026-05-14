'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  Plane,
  RefreshCw,
  Columns2,
  WifiOff,
  Sparkles,
  Search,
} from 'lucide-react';
import { searchFlights } from '@/actions/searchFlights';
import type { FlightResult, SearchParams } from '@/components/flights/types';
import FilterPanel, { FilterState, DEFAULT_FILTERS } from '@/components/flights/FilterPanel';
import SortSelect, { SortOption } from '@/components/flights/SortSelect';
import FlightCard from '@/components/flights/FlightCard';
import FlightSearchForm from '@/components/flights/FlightSearchForm';

const FlightComparePanel = dynamic(
  () => import('@/components/FlightComparePanel'),
  { ssr: false }
);

// ─── Types ───────────────────────────────────────────────────────────────────

type SearchState = 'idle' | 'loading' | 'success' | 'error' | 'empty';
type ViewMode = 'list' | 'compare';

// ─── Loading Skeleton ───────────────────────────────────────────────────────

function FlightCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 animate-pulse dark:bg-surface-elevated dark:border-border">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-10 w-10 rounded-xl bg-muted" />
        <div className="space-y-1.5">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-3 w-16 rounded bg-muted" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="space-y-1">
          <div className="h-7 w-14 rounded bg-muted" />
          <div className="h-3 w-10 rounded bg-muted mx-auto" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-px w-full bg-muted" />
        </div>
        <div className="space-y-1">
          <div className="h-7 w-14 rounded bg-muted" />
          <div className="h-3 w-10 rounded bg-muted mx-auto" />
        </div>
        <div className="space-y-1 text-right">
          <div className="h-7 w-20 rounded bg-muted ml-auto" />
          <div className="h-3 w-12 rounded bg-muted ml-auto" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function FlightSearchClient() {
  const t = useTranslations('flights');
  const params = useParams();
  const locale = (params?.locale as string) ?? 'tr';

  // ── State ─────────────────────────────────────────────────────────────
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [results, setResults] = useState<FlightResult[]>([]);
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // ── Persist followed IDs ───────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('izgetour_followed_flights');
      if (saved) setFollowedIds(new Set(JSON.parse(saved)));
    } catch {
      // ignore
    }
  }, []);

  // ── Search ────────────────────────────────────────────────────────────
  const handleSearch = useCallback(async (searchParams: SearchParams) => {
    setSearchState('loading');
    setResults([]);
    setViewMode('list');
    setCompareIds([]);

    try {
      const response = await searchFlights(searchParams);

      if (response.success && response.data) {
        setResults(response.data);
        setSearchState(response.data.length === 0 ? 'empty' : 'success');
      } else {
        setSearchState('error');
      }
    } catch {
      setSearchState('error');
    }
  }, []);

  const handleReset = useCallback(() => {
    setSearchState('idle');
    setResults([]);
    setFilters(DEFAULT_FILTERS);
    setCompareIds([]);
    setViewMode('list');
  }, []);

  // ── Follow ────────────────────────────────────────────────────────────
  const toggleFollow = useCallback((id: string) => {
    setFollowedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem('izgetour_followed_flights', JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // ── Compare ──────────────────────────────────────────────────────────
  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }, []);

  // ── Filtered + sorted results ───────────────────────────────────────────
  const filteredFlights = useMemo(() => {
    const filtered = results.filter((f) => {
      if (filters.airlines.length && !filters.airlines.includes(f.carrierCode)) return false;
      if (filters.stops.length && !filters.stops.includes(f.stops)) return false;
      if (filters.refundable !== null && f.refundable !== filters.refundable) return false;
      if (f.price < filters.minPrice || f.price > filters.maxPrice) return false;
      const hour = new Date(f.departureTime).getHours();
      if (hour < filters.departureTimeRange[0] || hour >= filters.departureTimeRange[1]) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'duration': return a.durationMinutes - b.durationMinutes;
        case 'departure': return a.departureTime.localeCompare(b.departureTime);
        case 'arrival': return b.arrivalTime.localeCompare(a.arrivalTime);
        default: return 0;
      }
    });
  }, [results, filters, sortBy]);

  const priceRange = useMemo(() => ({
    min: results.length ? Math.min(...results.map((f) => f.price)) : 0,
    max: results.length ? Math.max(...results.map((f) => f.price)) : 99999,
  }), [results]);

  const compareFlights = results.filter((f) => compareIds.includes(f.id));

  // ── Handle flight select ───────────────────────────────────────────────
  const handleSelect = useCallback((flight: FlightResult) => {
    console.log('Selected flight:', flight.id);
    // TODO: navigate to booking or open detail modal
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden px-4 pb-10 pt-12"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/[0.04]" />
          <div className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-white/[0.04]" />
          <div className="absolute right-1/3 top-10 h-32 w-32 rounded-full bg-white/[0.03]" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <h1 className="mb-2 text-center text-3xl font-bold text-white tracking-tight">
            {t('searchTitle')}
          </h1>
          <p className="mb-8 text-center text-sm text-white/60">
            {t('searchSubtitle')}
          </p>

          {/* Search Card */}
          <div className="rounded-2xl bg-surface p-5 shadow-2xl dark:bg-surface-elevated">
            <FlightSearchForm onSearch={handleSearch} loading={searchState === 'loading'} />
          </div>
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* Loading */}
        {searchState === 'loading' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="h-5 w-48 rounded bg-muted animate-pulse" />
              <div className="h-8 w-32 rounded bg-muted animate-pulse" />
            </div>
            {[1, 2, 3, 4].map((i) => (
              <FlightCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {searchState === 'error' && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-error/20 bg-error/5 p-12 text-center animate-fade-in">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
              <WifiOff className="h-8 w-8 text-error" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">{t('errorTitle')}</h3>
            <p className="mb-4 max-w-sm text-sm text-muted-foreground">{t('errorDesc')}</p>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-full bg-error px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-error/90"
            >
              <RefreshCw className="h-4 w-4" /> {t('retry')}
            </button>
          </div>
        )}

        {/* Empty */}
        {searchState === 'empty' && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface p-12 text-center animate-fade-in dark:bg-surface-elevated dark:border-border">
            <div className="mb-4 text-5xl">🔍</div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">{t('noResultsTitle')}</h3>
            <p className="mb-4 max-w-sm text-sm text-muted-foreground">{t('noResultsDesc')}</p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted dark:border-border"
              >
                {t('newSearch')}
              </button>
              <button className="rounded-full bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary/20">
                <Sparkles className="mr-1 inline h-4 w-4" />
                {t('flexibleDates')}
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {searchState === 'success' && (
          <div className="animate-fade-in">
            {/* Results Header */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {results[0]?.departure ?? ''} → {results[0]?.arrival ?? ''}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredFlights.length} {t('results')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <SortSelect value={sortBy} onChange={setSortBy} />

                <button
                  onClick={() => {
                    if (viewMode === 'compare') {
                      setViewMode('list');
                      setCompareIds([]);
                    } else if (compareIds.length >= 2) {
                      setViewMode('compare');
                    }
                  }}
                  disabled={compareIds.length < 2}
                  className={`
                    flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors
                    ${viewMode === 'compare'
                      ? 'border-success bg-success text-white'
                      : compareIds.length >= 2
                        ? 'border-primary bg-primary text-white hover:bg-primary/90'
                        : 'border-border text-muted-foreground cursor-not-allowed dark:border-border'}
                  `}
                >
                  <Columns2 className="h-3.5 w-3.5" />
                  {t('compare')} ({compareIds.length})
                </button>

                {compareIds.length > 0 && viewMode !== 'compare' && (
                  <button
                    onClick={() => setCompareIds([])}
                    className="rounded-xl border border-border px-2.5 py-2 text-xs text-muted-foreground hover:bg-muted dark:border-border"
                  >
                    {t('clear')}
                  </button>
                )}
              </div>
            </div>

            {/* Main: Filters + Results */}
            <div className="flex flex-col gap-6 lg:flex-row">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                priceRange={priceRange}
              />

              <div className="flex-1 space-y-3">
                {filteredFlights.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-surface p-12 text-center shadow-sm dark:bg-surface-elevated">
                    <Search className="mb-3 h-12 w-12 text-muted" />
                    <h3 className="text-lg font-semibold text-foreground">{t('noMatchTitle')}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t('noMatchDesc')}</p>
                    <button
                      onClick={() => setFilters({ ...DEFAULT_FILTERS, minPrice: priceRange.min, maxPrice: priceRange.max })}
                      className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white"
                    >
                      {t('clearFilters')}
                    </button>
                  </div>
                ) : viewMode === 'compare' && compareFlights.length >= 2 ? (
                  <FlightComparePanel
                    flights={compareFlights}
                    locale={locale as 'tr' | 'en'}
                    onClose={() => { setViewMode('list'); setCompareIds([]); }}
                  />
                ) : (
                  filteredFlights.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      isFollowed={followedIds.has(flight.id)}
                      onToggleFollow={toggleFollow}
                      showCompareCheckbox
                      isCompareSelected={compareIds.includes(flight.id)}
                      onToggleCompare={toggleCompare}
                      onSelect={handleSelect}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Idle — placeholder */}
        {searchState === 'idle' && (
          <div className="animate-fade-in">
            <p className="text-center text-sm text-muted-foreground">
              {t('searchSubtitle')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
