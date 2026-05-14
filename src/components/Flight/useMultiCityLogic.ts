'use client';

import { useState, useCallback, useMemo } from 'react';
import type { Flight } from '@/data/flights';
import {
  type FlightLeg,
  type LegSearchResult,
  validateLegDates,
  queryAllLegs,
  aggregateItineraryPrice,
  getCheapestPerLeg,
  countStops,
  totalDurationMinutes,
  formatDuration,
} from '@/utils/multiCityHelpers';

export type MultiCityPhase =
  | 'form'      // building / editing legs
  | 'searching' // Promise.all in-flight
  | 'results';  // showing per-leg options

export type UseMultiCityLogicReturn = {
  // Data
  legs: FlightLeg[];
  legResults: LegSearchResult[];
  selections: Record<string, Flight>;

  // UI state
  phase: MultiCityPhase;
  dateErrors: ReturnType<typeof validateLegDates>;
  passengers: number;

  // Summary derived
  totalPrice: number;
  totalOriginal: number;
  totalStops: number;
  totalMinutes: number;
  formattedDuration: string;
  allLegsSelected: boolean;

  // Leg CRUD
  addLeg: () => void;
  removeLeg: (id: string) => void;
  updateLeg: (id: string, patch: Partial<FlightLeg>) => void;
  moveLeg: (id: string, direction: 'up' | 'down') => void;

  // Search & select
  searchAllLegs: () => Promise<void>;
  selectFlight: (legId: string, flight: Flight) => void;
  clearResults: () => void;

  // Passengers
  setPassengers: (n: number) => void;
};

let _legCounter = 0;
function newLegId(): string {
  return `leg_${Date.now()}_${++_legCounter}`;
}

function makeLeg(_index: number): FlightLeg {
  return {
    id: newLegId(),
    origin: '',
    originCode: '',
    destination: '',
    destinationCode: '',
    date: '',
  };
}

export function useMultiCityLogic(): UseMultiCityLogicReturn {
  const [legs, setLegs] = useState<FlightLeg[]>(() => [makeLeg(0), makeLeg(1)]);
  const [legResults, setLegResults] = useState<LegSearchResult[]>([]);
  const [selections, setSelections] = useState<Record<string, Flight>>({});
  const [phase, setPhase] = useState<MultiCityPhase>('form');
  const [passengers, setPassengers] = useState(1);

  // ── Derived: date errors ────────────────────────────────────────────────
  const dateErrors = useMemo(() => validateLegDates(legs), [legs]);

  // ── Derived: summary ───────────────────────────────────────────────────
  const { totalPrice, totalOriginal, totalStops, totalMinutes, formattedDuration } =
    useMemo(() => {
      const flights = Object.values(selections);
      if (flights.length === 0)
        return { totalPrice: 0, totalOriginal: 0, totalStops: 0, totalMinutes: 0, formattedDuration: '0s 0d' };
      const agg = aggregateItineraryPrice(selections);
      return {
        totalPrice: agg.total,
        totalOriginal: agg.originalTotal,
        totalStops: countStops(flights),
        totalMinutes: totalDurationMinutes(flights),
        formattedDuration: formatDuration(totalDurationMinutes(flights)),
      };
    }, [selections]);

  const allLegsSelected = useMemo(
    () => legs.length > 0 && legs.every((l) => selections[l.id] != null),
    [legs, selections]
  );

  // ── Leg CRUD ───────────────────────────────────────────────────────────
  const addLeg = useCallback(() => {
    setLegs((prev) => {
      if (prev.length >= 6) return prev;
      return [...prev, makeLeg(prev.length)];
    });
  }, []);

  const removeLeg = useCallback((id: string) => {
    setLegs((prev) => {
      if (prev.length <= 2) return prev;
      return prev.filter((l) => l.id !== id);
    });
    // Clear any selection for this leg
    setSelections((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const updateLeg = useCallback((id: string, patch: Partial<FlightLeg>) => {
    setLegs((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }, []);

  const moveLeg = useCallback((id: string, direction: 'up' | 'down') => {
    setLegs((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx < 0) return prev;
      const nextIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[nextIdx]] = [next[nextIdx], next[idx]];
      return next;
    });
  }, []);

  // ── Search ─────────────────────────────────────────────────────────────
  const searchAllLegs = useCallback(async () => {
    const errors = validateLegDates(legs);
    if (errors.length > 0) return;

    const validLegs = legs.filter(
      (l) => l.originCode && l.destinationCode && l.date
    );
    if (validLegs.length === 0) return;

    setPhase('searching');
    setSelections({});

    try {
      const results = await queryAllLegs(validLegs);
      setLegResults(results);

      // Pre-select cheapest per leg
      const cheapest = getCheapestPerLeg(results);
      setSelections(cheapest);
      setPhase('results');
    } catch {
      setPhase('form');
    }
  }, [legs]);

  // ── Select flight per leg ───────────────────────────────────────────────
  const selectFlight = useCallback((legId: string, flight: Flight) => {
    setSelections((prev) => ({ ...prev, [legId]: flight }));
  }, []);

  // ── Clear results & go back to form ────────────────────────────────────
  const clearResults = useCallback(() => {
    setLegResults([]);
    setSelections({});
    setPhase('form');
  }, []);

  return {
    legs,
    legResults,
    selections,
    phase,
    dateErrors,
    passengers,
    totalPrice,
    totalOriginal,
    totalStops,
    totalMinutes,
    formattedDuration,
    allLegsSelected,
    addLeg,
    removeLeg,
    updateLeg,
    moveLeg,
    searchAllLegs,
    selectFlight,
    clearResults,
    setPassengers,
  };
}
