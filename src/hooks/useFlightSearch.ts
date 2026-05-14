'use client';

import { useState, useCallback } from 'react';
import {
  AirportInput,
  PassengerPanel,
  TripType,
  CabinClass,
  PassengerCounts,
  MultiCitySegment,
  searchFlightsAPI,
  MIN_DATE,
} from '@/components/FlightSearchParts';
import type { FlightResult } from '@/components/FlightSearchParts';

export type { FlightResult };

export type { TripType, CabinClass, PassengerCounts, MultiCitySegment };

// ─── Hook ──────────────────────────────────────────────────────────────────

export type SearchState = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export interface UseFlightSearchOptions {
  from: import('@/data/airports').Airport | null;
  to: import('@/data/airports').Airport | null;
  departDate: string;
  returnDate: string;
  passengers: PassengerCounts;
  cabinClass: CabinClass;
  tripType: TripType;
  segments: MultiCitySegment[];
}

export function useFlightSearch() {
  const [results, setResults] = useState<FlightResult[]>([]);
  const [state, setState] = useState<SearchState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'duration' | 'departure'>('price-asc');

  const search = useCallback(async (options: UseFlightSearchOptions) => {
    setState('loading');
    setResults([]);
    setErrorMsg('');

    try {
      const data = await searchFlightsAPI(options);
      if (data.length === 0) {
        setState('empty');
      } else {
        setResults(data);
        setState('success');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Arama sırasında bir hata oluştu');
      setState('error');
    }
  }, []);

  const toggleFollow = useCallback((id: string) => {
    setFollowedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem('izgetour_flight_followed', JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  const sorted = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return parseFloat(a.price) - parseFloat(b.price);
      case 'price-desc': return parseFloat(b.price) - parseFloat(a.price);
      case 'duration': return a.durationMinutes - b.durationMinutes;
      case 'departure': return a.departureAt.localeCompare(b.departureAt);
      default: return 0;
    }
  });

  const reset = () => {
    setState('idle');
    setResults([]);
    setErrorMsg('');
  };

  return {
    results: sorted,
    state,
    errorMsg,
    followedIds,
    sortBy,
    setSortBy,
    search,
    toggleFollow,
    reset,
  };
}
