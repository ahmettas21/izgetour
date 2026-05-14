'use client';

import { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Check,
  X,
  ChevronDown,
  Plus,
  Minus,
  Users,
  AlertCircle,
  ArrowRight,
  Calendar,
  Plane,
  Clock,
  Shield,
  Bell,
  BellOff,
  Search,
  Sparkles,
} from 'lucide-react';
import { Airport, searchAirports } from '@/data/airports';

// ─── Types & Constants ────────────────────────────────────────────────────────

export type TripType = 'oneway' | 'roundtrip' | 'multicity';
export type CabinClass = 'economy' | 'business' | 'first';

export interface PassengerCounts {
  adult: number;
  child: number;
  infant: number;
}

export interface MultiCitySegment {
  from: Airport | null;
  to: Airport | null;
  date: string;
}

export const CABIN_LABELS: Record<CabinClass, string> = {
  economy: 'Economy',
  business: 'Business',
  first: 'First Class',
};

export const MAX_TOTAL = 9;

export const MIN_DATE = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
})();

// ─── API Contract (Amadeus format) ────────────────────────────────────────────

export interface SearchParams {
  tripType: TripType;
  from: Airport | null;
  to: Airport | null;
  departDate: string;
  returnDate: string;
  passengers: PassengerCounts;
  cabinClass: CabinClass;
  segments: MultiCitySegment[];
}

export interface AmadeusFlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: AmadeusItinerary[];
  price: AmadeusPrice;
  pricingOptions: AmadeusPricingOptions;
  travelerPricings: AmadeusTravelerPricing[];
}

export interface AmadeusItinerary {
  duration: string;
  segments: AmadeusSegment[];
}

export interface AmadeusSegment {
  departure: AmadeusEndpoint;
  arrival: AmadeusEndpoint;
  carrierCode: string;
  number: string;
  aircraft: { code: string };
  operating?: { carrierCode: string };
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

export interface AmadeusEndpoint {
  iataCode: string;
  terminal?: string;
  at: string;
}

export interface AmadeusPrice {
  currency: string;
  total: string;
  base: string;
  fees: AmadeusFee[];
  grandTotal: string;
}

export interface AmadeusFee {
  amount: string;
  type: string;
}

export interface AmadeusPricingOptions {
  fareType: string[];
  includedCheckedBagsOnly: boolean;
}

export interface AmadeusTravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: { currency: string; total: string };
  fareDetailsBySegment: AmadeusFareDetail[];
}

export interface AmadeusFareDetail {
  segmentId: string;
  cabin: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  fareBasis: string;
  class: string;
  includedCheckedBags: { weight?: number; weightUnit?: string; quantity?: number };
}

// ─── Normalized Flight Result ─────────────────────────────────────────────────

export interface FlightResult {
  id: string;
  carrierCode: string;
  airline: string;
  departure: string;
  arrival: string;
  departureCity: string;
  arrivalCity: string;
  /** ISO datetime "2026-06-15T06:30:00.000Z" */
  departureAt: string;
  arrivalAt: string;
  /** Total minutes for all legs */
  durationMinutes: number;
  stops: number;
  stopCities: string[];
  /** Minor currency string, e.g. "2849.00" */
  price: string;
  originalPrice: string;
  cabin: CabinClass;
  refundable: boolean;
  seatsLeft: number;
  baggage: string;
  /** Raw Amadeus offer for booking/detail pages */
  raw: AmadeusFlightOffer;
}

// ─── Airline Registry ────────────────────────────────────────────────────────

const AIRLINE_NAMES: Record<string, string> = {
  TK: 'Turkish Airlines',
  PC: 'Pegasus',
  XQ: 'SunExpress',
  LH: 'Lufthansa',
  BA: 'British Airways',
  AF: 'Air France',
  KL: 'KLM',
  SU: 'Aeroflot',
  EY: 'Etihad',
  QR: 'Qatar Airways',
  EK: 'Emirates',
  A3: 'Aegean Airlines',
  SK: 'SAS',
  IB: 'Iberia',
  VY: 'Vueling',
  TO: 'Transavia',
  FR: 'Ryanair',
  U2: 'EasyJet',
  W6: 'Wizz Air',
};

function getAirlineName(code: string): string {
  return AIRLINE_NAMES[code] ?? code;
}

// ─── Amadeus normalizer ───────────────────────────────────────────────────────

function parseISODuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  return parseInt(match[1] ?? '0', 10) * 60 + parseInt(match[2] ?? '0', 10);
}

function formatTimeFromISO(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function normalizeAmadeusOffer(
  offer: AmadeusFlightOffer,
  departureCity: string,
  arrivalCity: string,
): FlightResult {
  const firstSeg = offer.itineraries[0]?.segments[0];
  const lastSeg = offer.itineraries[0]?.segments.at(-1);
  const carrierCode = firstSeg?.carrierCode ?? 'TK';

  const stops = offer.itineraries.reduce(
    (acc, it) => acc + it.segments.reduce((s, seg) => s + seg.numberOfStops, 0),
    0,
  );

  const stopCities = offer.itineraries
    .flatMap((it) => it.segments.slice(0, -1))
    .map((seg) => seg.arrival.iataCode);

  const traveler = offer.travelerPricings[0];
  const segDetail = traveler?.fareDetailsBySegment[0];
  const cabinMap: Record<string, CabinClass> = {
    ECONOMY: 'economy',
    PREMIUM_ECONOMY: 'economy',
    BUSINESS: 'business',
    FIRST: 'first',
  };

  return {
    id: offer.id,
    carrierCode,
    airline: getAirlineName(carrierCode),
    departure: firstSeg?.departure.iataCode ?? 'IST',
    arrival: lastSeg?.arrival.iataCode ?? 'SAW',
    departureCity,
    arrivalCity,
    departureAt: firstSeg?.departure.at ?? '',
    arrivalAt: lastSeg?.arrival.at ?? '',
    durationMinutes: parseISODuration(offer.itineraries[0]?.duration ?? 'PT0H'),
    stops,
    stopCities,
    price: offer.price.total,
    originalPrice: offer.price.grandTotal,
    cabin: cabinMap[segDetail?.cabin ?? 'ECONOMY'] ?? 'economy',
    refundable: offer.pricingOptions.fareType.includes('REFUNDABLE'),
    seatsLeft: offer.numberOfBookableSeats,
    baggage:
      segDetail?.includedCheckedBags?.weight != null
        ? `${segDetail.includedCheckedBags.weight}${segDetail.includedCheckedBags.weightUnit?.toLowerCase() ?? 'kg'}`
        : 'Kabin',
    raw: offer,
  };
}

// ─── API / Mock ────────────────────────────────────────────────────────────────

export async function searchFlightsAPI(params: SearchParams): Promise<FlightResult[]> {
  // TODO: Replace with real Amadeus API call
  // const tokenRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //   body: `grant_type=client_credentials&client_id=${process.env.AMADEUS_CLIENT_ID}&client_secret=${process.env.AMADEUS_CLIENT_SECRET}`,
  // });
  // const { access_token } = await tokenRes.json();
  // const res = await fetch('https://test.api.amadeus.com/v2/shopping/flight-offers', {
  //   headers: { Authorization: `Bearer ${access_token}` },
  //   body: JSON.stringify({ ... }),
  // });
  // const { data } = await res.json();
  // return data.map((o: AmadeusFlightOffer) =>
  //   normalizeAmadeusOffer(o, params.from?.cityNative ?? '', params.to?.cityNative ?? ''),
  // );

  await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
  if (!params.from || !params.to) return [];

  return generateMockResults(
    params.from,
    params.to,
    params.cabinClass,
  );
}

function generateMockResults(
  from: Airport,
  to: Airport,
  cabin: CabinClass,
): FlightResult[] {
  const airlines = [
    { code: 'TK', name: 'Turkish Airlines' },
    { code: 'PC', name: 'Pegasus' },
    { code: 'XQ', name: 'SunExpress' },
    { code: 'LH', name: 'Lufthansa' },
    { code: 'BA', name: 'British Airways' },
    { code: 'AF', name: 'Air France' },
  ];

  const basePrices: Record<CabinClass, number> = { economy: 1500, business: 8500, first: 18000 };
  const multipliers: Record<CabinClass, number> = { economy: 1, business: 4.5, first: 9 };

  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + 3);

  return airlines.map((al, i) => {
    const dur = 150 + Math.floor(Math.random() * 180);
    const depH = 6 + i * 2;
    const depM = Math.floor(Math.random() * 60);
    const depD = new Date(baseDate);
    depD.setHours(depH, depM, 0, 0);
    const arrD = new Date(depD.getTime() + dur * 60 * 1000);

    const price = Math.round(basePrices[cabin] * (0.75 + Math.random() * 0.8) * multipliers[cabin]);
    const orig = Math.round(price * (1.1 + Math.random() * 0.4));
    const stops = i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2;
    const stopCodes = stops === 0 ? [] : stops === 1 ? ['FRA'] : ['FRA', 'VIE'];

    return {
      id: `${al.code}-${Date.now()}-${i}`,
      carrierCode: al.code,
      airline: al.name,
      departure: from.iata,
      arrival: to.iata,
      departureCity: from.cityNative,
      arrivalCity: to.cityNative,
      departureAt: depD.toISOString(),
      arrivalAt: arrD.toISOString(),
      durationMinutes: dur,
      stops,
      stopCities: stopCodes,
      price: String(price),
      originalPrice: String(orig),
      cabin,
      refundable: i % 2 === 0,
      seatsLeft: 2 + Math.floor(Math.random() * 9),
      baggage: cabin === 'economy' ? '1x23kg' : '2x32kg',
      raw: {} as AmadeusFlightOffer,
    };
  });
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}s ${m}d`;
}

// ─── FlightCard ────────────────────────────────────────────────────────────────

export function FlightCard({
  flight,
  isFollowed,
  onToggleFollow,
  onSelect,
}: {
  flight: FlightResult;
  isFollowed: boolean;
  onToggleFollow: (id: string) => void;
  onSelect?: (flight: FlightResult) => void;
}) {
  const hasDiscount = parseFloat(flight.price) < parseFloat(flight.originalPrice);
  const discountPct = hasDiscount
    ? Math.round((1 - parseFloat(flight.price) / parseFloat(flight.originalPrice)) * 100)
    : 0;

  return (
    <div
      className={`
        group flex flex-col gap-4 rounded-2xl border bg-white p-5
        transition-all hover:shadow-xl hover:-translate-y-0.5
        sm:flex-row sm:items-center sm:gap-6
        ${isFollowed ? 'border-turquoise-400 shadow-md ring-2 ring-turquoise-100' : 'border-slate-100'}
      `}
    >
      {/* Airline */}
      <div className="flex items-center gap-3 sm:w-36 sm:flex-col sm:items-start">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-turquoise-50 text-xs font-bold text-turquoise-700 border border-turquoise-100 sm:h-12 sm:w-12 sm:rounded-full">
          {flight.carrierCode}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-800 leading-tight">{flight.airline}</div>
          {flight.stops === 0 ? (
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 mt-0.5">
              <Plane className="h-3 w-3" /> Direkt
            </div>
          ) : (
            <div className="text-xs text-amber-600 font-medium mt-0.5">
              {flight.stops} aktarma
            </div>
          )}
        </div>
      </div>

      {/* Times */}
      <div className="flex items-center gap-4 flex-1">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900 leading-tight">
            {formatTimeFromISO(flight.departureAt)}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">{flight.departure}</div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-xs text-slate-400 justify-center">
            <Clock className="h-3 w-3" />
            {formatDuration(flight.durationMinutes)}
          </div>
          <div className="relative h-px bg-gradient-to-r from-turquoise-200 via-turquoise-400 to-turquoise-200 mt-1.5">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-turquoise-500 p-1">
              <Plane className="h-2.5 w-2.5 rotate-90 text-white" />
            </div>
          </div>
          {flight.stops > 0 && (
            <div className="text-center mt-1.5">
              <span className="rounded-full bg-amber-50 border border-amber-100 px-2 py-0.5 text-xs text-amber-700 font-medium whitespace-nowrap">
                {flight.stopCities.join(', ')}
              </span>
            </div>
          )}
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900 leading-tight">
            {formatTimeFromISO(flight.arrivalAt)}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">{flight.arrival}</div>
        </div>
      </div>

      {/* Price + Actions */}
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:w-36 sm:items-end sm:justify-center border-t border-slate-100 pt-4 sm:border-t-0 sm:pt-0">
        <div className="text-right">
          {hasDiscount && (
            <div className="flex items-center justify-end gap-1.5 mb-0.5">
              <span className="rounded-full bg-red-50 border border-red-100 px-1.5 py-0.5 text-xs font-bold text-red-600">
                -{discountPct}%
              </span>
              <span className="text-xs text-slate-400 line-through">
                ₺{parseFloat(flight.originalPrice).toLocaleString('tr-TR')}
              </span>
            </div>
          )}
          <div className={`text-2xl font-extrabold ${hasDiscount ? 'text-red-600' : 'text-turquoise-600'}`}>
            ₺{parseFloat(flight.price).toLocaleString('tr-TR')}
          </div>
          <div className="text-xs text-slate-400">kişi başı</div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <button
            onClick={() => onSelect?.(flight)}
            className="rounded-xl bg-gradient-to-r from-turquoise-500 to-turquoise-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-lg hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            Seç
          </button>
          <button
            onClick={() => onToggleFollow(flight.id)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              isFollowed
                ? 'border-turquoise-300 bg-turquoise-50 text-turquoise-600'
                : 'border-slate-200 text-slate-400 hover:border-turquoise-300 hover:text-turquoise-600'
            }`}
          >
            {isFollowed ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
            {isFollowed ? 'Takipte' : 'Takip'}
          </button>
        </div>
      </div>

      {/* Meta badges */}
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-50 pt-3 -mt-1 sm:border-t-0 sm:pt-0">
        {flight.refundable && (
          <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            <Shield className="h-3 w-3" /> İade var
          </span>
        )}
        {flight.seatsLeft <= 3 && (
          <span className="rounded-full bg-red-50 border border-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
            Son {flight.seatsLeft} koltuk!
          </span>
        )}
        <span className="text-xs text-slate-400">{flight.baggage} included</span>
      </div>
    </div>
  );
}

// ─── FlightCardSkeleton ──────────────────────────────────────────────────────

export function FlightCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 sm:flex-row sm:items-center sm:gap-6 animate-pulse">
      {/* Airline */}
      <div className="flex items-center gap-3 sm:w-36 sm:flex-col sm:items-start">
        <div className="h-10 w-10 rounded-xl bg-slate-100 sm:h-12 sm:w-12 sm:rounded-full" />
        <div className="space-y-1.5">
          <div className="h-4 w-24 rounded bg-slate-100" />
          <div className="h-3 w-16 rounded bg-slate-100" />
        </div>
      </div>

      {/* Times */}
      <div className="flex items-center gap-4 flex-1">
        <div className="space-y-1 text-center">
          <div className="h-7 w-14 rounded bg-slate-100" />
          <div className="h-3 w-10 rounded bg-slate-100 mx-auto" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="h-3 w-full rounded bg-slate-100 mx-auto" />
          <div className="h-px w-full bg-slate-100" />
        </div>
        <div className="space-y-1 text-center">
          <div className="h-7 w-14 rounded bg-slate-100" />
          <div className="h-3 w-10 rounded bg-slate-100 mx-auto" />
        </div>
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:w-36 sm:items-end sm:justify-center border-t border-slate-100 pt-4 sm:border-t-0 sm:pt-0">
        <div className="space-y-1 text-right">
          <div className="h-7 w-20 rounded bg-slate-100 ml-auto" />
          <div className="h-3 w-12 rounded bg-slate-100 ml-auto" />
        </div>
        <div className="h-9 w-full rounded-xl bg-slate-100 sm:w-20" />
      </div>
    </div>
  );
}

// ─── AirportInput ──────────────────────────────────────────────────────────────

export function AirportInput({
  value,
  onChange,
  label,
  showSwap,
  onSwap,
  placeholder = 'Havalimanı kodu',
}: {
  value: Airport | null;
  onChange: (a: Airport | null) => void;
  label?: string;
  showSwap?: boolean;
  onSwap?: () => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value ? `${value.cityNative} (${value.iata})` : '');
  const [results, setResults] = useState<Airport[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setResults(searchAirports(query));
  }, [query, open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const select = (a: Airport) => {
    onChange(a);
    setQuery(`${a.cityNative} (${a.iata})`);
    setOpen(false);
  };

  const clear = () => {
    onChange(null);
    setQuery('');
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="mb-1 block text-xs font-medium text-slate-400">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`
          flex w-full items-center gap-2 rounded-xl border bg-slate-50 px-3 py-3 text-left transition-all
          ${open
            ? 'border-turquoise-400 ring-2 ring-turquoise-100 shadow-md'
            : 'border-slate-200 hover:border-turquoise-300'}
        `}
      >
        <MapPin className="h-4 w-4 shrink-0 text-turquoise-500" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onClick={(e) => { e.stopPropagation(); setOpen(true); }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 min-w-0"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); clear(); }}
            className="shrink-0 rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
        {showSwap && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSwap?.(); }}
            className="shrink-0 rounded-full bg-slate-100 p-1 text-slate-400 hover:bg-turquoise-100 hover:text-turquoise-600 transition-colors"
          >
            <ArrowRight className="h-3 w-3 rotate-[-90deg]" />
          </button>
        )}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-xl animate-scale-in overflow-hidden">
          {results.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto py-1">
              {results.map((a) => (
                <li key={a.iata}>
                  <button
                    type="button"
                    onClick={() => select(a)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-turquoise-50 ${value?.iata === a.iata ? 'bg-turquoise-50' : ''}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-turquoise-50 border border-turquoise-100 text-xs font-bold text-turquoise-700">
                      {a.iata}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-slate-800 truncate">{a.cityNative}</div>
                      <div className="text-xs text-slate-400 truncate">{a.country}</div>
                    </div>
                    {value?.iata === a.iata && (
                      <Check className="h-4 w-4 shrink-0 text-turquoise-500" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="px-4 py-6 text-center text-sm text-slate-400">Sonuç bulunamadı</div>
          ) : (
            <div className="px-4 py-3 text-xs text-slate-400">En az 2 karakter girin</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PassengerPanel ────────────────────────────────────────────────────────────

export function PassengerPanel({
  passengers,
  onChange,
  cabin,
  onCabinChange,
}: {
  passengers: PassengerCounts;
  onChange: (p: PassengerCounts) => void;
  cabin: CabinClass;
  onCabinChange: (c: CabinClass) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const update = (key: keyof PassengerCounts, delta: number) => {
    const next: PassengerCounts = { ...passengers, [key]: Math.max(0, passengers[key] + delta) };
    if (next.infant > next.adult) next.infant = next.adult;
    if (next.adult === 0 && (next.child > 0 || next.infant > 0)) next.adult = 1;
    if (next.adult + next.child + next.infant > MAX_TOTAL) return;
    onChange(next);
  };

  const total = passengers.adult + passengers.child + passengers.infant;
  const label = `${passengers.adult} Yetişkin${passengers.child ? `, ${passengers.child} Çocuk` : ''}${passengers.infant ? `, ${passengers.infant} Bebek` : ''}`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          flex w-full items-center gap-2 rounded-xl border bg-slate-50 px-3 py-3 text-left transition-all
          ${open
            ? 'border-turquoise-400 ring-2 ring-turquoise-100 shadow-md'
            : 'border-slate-200 hover:border-turquoise-300'}
        `}
      >
        <Users className="h-4 w-4 shrink-0 text-turquoise-500" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-700 truncate">{label}</div>
          <div className="text-xs text-slate-400">{CABIN_LABELS[cabin]}</div>
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-72 rounded-xl border border-slate-200 bg-white shadow-xl animate-scale-in overflow-hidden">
          <div className="p-4 space-y-4">

            {(
              [
                { key: 'adult' as const, label: 'Yetişkin', sub: '12+ yaş', min: 1 },
                { key: 'child' as const, label: 'Çocuk', sub: '2–11 yaş', min: 0 },
                { key: 'infant' as const, label: 'Bebek', sub: '0–23 ay · Kucakta', min: 0 },
              ] as const
            ).map((item, idx) => (
              <div key={item.key}>
                {idx > 0 && <div className="h-px bg-slate-100" />}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium text-slate-800">{item.label}</div>
                    <div className="text-xs text-slate-400">{item.sub}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => update(item.key, -1)}
                      disabled={
                        item.key === 'adult'
                          ? passengers.adult <= 1
                          : passengers[item.key] <= 0
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-all hover:border-turquoise-300 hover:text-turquoise-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-slate-800">
                      {passengers[item.key]}
                    </span>
                    <button
                      type="button"
                      onClick={() => update(item.key, 1)}
                      disabled={
                        item.key === 'infant'
                          ? passengers.infant >= passengers.adult || total >= MAX_TOTAL
                          : total >= MAX_TOTAL
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-all hover:border-turquoise-300 hover:text-turquoise-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {passengers.infant < passengers.adult && passengers.infant > 0 && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-700">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                Her yetişkin en fazla 1 bebek bağlayabilir
              </div>
            )}

            <div className="h-px bg-slate-100" />

            <div>
              <div className="mb-2 text-xs font-medium text-slate-400">Kabin Sınıfı</div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['economy', 'business', 'first'] as CabinClass[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onCabinChange(c)}
                    className={`rounded-lg border py-2 px-1 text-center text-xs font-medium transition-all ${
                      cabin === c
                        ? 'border-turquoise-400 bg-turquoise-50 text-turquoise-700 font-semibold'
                        : 'border-slate-200 text-slate-400 hover:border-turquoise-300 hover:text-slate-600'
                    }`}
                  >
                    {CABIN_LABELS[c]}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-xl bg-turquoise-500 py-2.5 text-sm font-semibold text-white transition-all hover:bg-turquoise-600"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FlightSearchForm ────────────────────────────────────────────────────────

export interface FlightSearchFormProps {
  defaultFrom?: Airport | null;
  defaultTo?: Airport | null;
  defaultTripType?: TripType;
  onSearch: (params: {
    from: Airport | null;
    to: Airport | null;
    departDate: string;
    returnDate: string;
    passengers: PassengerCounts;
    cabinClass: CabinClass;
    tripType: TripType;
  }) => Promise<void> | void;
  loading?: boolean;
}

export function FlightSearchForm({
  defaultFrom = null,
  defaultTo = null,
  defaultTripType = 'roundtrip',
  onSearch,
  loading = false,
}: FlightSearchFormProps) {
  const [from, setFrom] = useState<Airport | null>(defaultFrom);
  const [to, setTo] = useState<Airport | null>(defaultTo);
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState<PassengerCounts>({ adult: 1, child: 0, infant: 0 });
  const [cabin, setCabin] = useState<CabinClass>('economy');
  const [tripType, setTripType] = useState<TripType>(defaultTripType);
  const [errors, setErrors] = useState<string[]>([]);

  const swap = () => { setFrom(to); setTo(from); };

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!from) errs.push('Nereden seçin');
    if (!to) errs.push('Nereye seçin');
    if (!departDate) errs.push('Gidiş tarihi seçin');
    if (tripType === 'roundtrip' && !returnDate) errs.push('Dönüş tarihi seçin');
    if (returnDate && departDate && returnDate < departDate) errs.push('Dönüş gidişten sonra olmalı');
    if (passengers.infant > passengers.adult) errs.push('Bebek sayısı yetişkin sayısını aşamaz');
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSearch({ from, to, departDate, returnDate, passengers, cabinClass: cabin, tripType });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Trip type */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 rounded-full bg-slate-100 p-1">
          {([
            { key: 'roundtrip' as TripType, label: 'Gidiş-Dönüş' },
            { key: 'oneway' as TripType, label: 'Tek Yön' },
          ]).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTripType(key)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                tripType === key
                  ? 'bg-white text-turquoise-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">
          {passengers.adult + passengers.child + passengers.infant} yolcu
        </span>
      </div>

      {/* Route + dates */}
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_auto] items-end">
        <AirportInput label="Nereden" value={from} onChange={setFrom} placeholder="IST / SAW" />

        <button
          type="button"
          onClick={swap}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-turquoise-400 to-turquoise-600 text-white shadow-md transition-all hover:scale-110 hover:shadow-lg mb-px"
        >
          <ArrowRight className="h-4 w-4 rotate-[-90deg]" />
        </button>

        <AirportInput label="Nereye" value={to} onChange={setTo} placeholder="Havalimanı kodu" />

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Gidiş</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 pointer-events-none z-10" />
            <input
              type="date"
              value={departDate}
              min={MIN_DATE}
              onChange={(e) => { setDepartDate(e.target.value); setErrors([]); }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-3 text-sm font-medium text-slate-700 transition-all hover:border-turquoise-300 focus:border-turquoise-500 focus:outline-none focus:ring-2 focus:ring-turquoise-100"
            />
          </div>
        </div>

        {tripType === 'roundtrip' && (
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Dönüş</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 pointer-events-none z-10" />
              <input
                type="date"
                value={returnDate}
                min={departDate || MIN_DATE}
                onChange={(e) => { setReturnDate(e.target.value); setErrors([]); }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-3 text-sm font-medium text-slate-700 transition-all hover:border-turquoise-300 focus:border-turquoise-500 focus:outline-none focus:ring-2 focus:ring-turquoise-100"
              />
            </div>
          </div>
        )}

        <div className={tripType === 'roundtrip' ? '' : 'md:col-span-1'}>
          <label className="mb-1 block text-xs font-medium text-slate-400">Yolcu</label>
          <PassengerPanel passengers={passengers} onChange={setPassengers} cabin={cabin} onCabinChange={setCabin} />
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 p-3 animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
          <ul className="text-xs text-red-600 space-y-0.5">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-turquoise-500 to-turquoise-600 py-4 text-sm font-bold text-white shadow-lg shadow-turquoise-500/30 transition-all hover:shadow-xl hover:shadow-turquoise-500/40 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 0h12a8 8 0 010 16z" /></svg> Aranıyor...</>
          ) : (
            <><Search className="h-4 w-4" /> Uçuş Ara</>
          )}
        </button>

        <button
          type="button"
          className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-xs font-medium text-slate-500 transition-all hover:border-turquoise-300 hover:text-turquoise-600 whitespace-nowrap"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Esnek Tarih
        </button>
      </div>
    </div>
  );
}
