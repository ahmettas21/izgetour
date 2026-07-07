'use client';

/**
 * İzgeTour — Rota landing sayfası uçuş listesi (Enuygun/Turna tarzı).
 *
 * - Merkezi fiyat (TL) ve havayolu normalizasyonu kullanır.
 * - Client-side sıralama: En ucuz / En hızlı / En erken.
 * - "Aktarmasız" filtresi (nonstop only).
 * - En Ucuz / En Hızlı rozetleri.
 * - Harici logoya bağımlı olmadan renkli monogram badge.
 * - Mobilde tek kolon, taşmasız, dokunma hedefi ≥44px.
 */

import { useMemo, useState } from 'react';
import { Clock, Plane, Info, ArrowRight } from 'lucide-react';
import type { FlightResult } from './types';
import { resolveAirline } from '@/lib/airlines';
import {
  formatPriceTRY,
  displayTime,
  formatDuration,
  resolveDurationMinutes,
  isValidPrice,
} from '@/lib/seo';
import { buildGoLink } from '@/lib/go-link';

export interface RouteFlightItem {
  flight: FlightResult;
  goHref: string;
}

type SortKey = 'cheapest' | 'fastest' | 'earliest';

interface Props {
  flights: FlightResult[];
  routeOrigin: string;
  routeDestination: string;
  departDate: string | null;
  locale: string;
}

interface PreparedFlight {
  f: FlightResult;
  priceTRY: string | null;
  duration: number;
  departSort: number; // gün-içi kalkış dakikası (erken sıralama için)
  goHref: string;
  brand: ReturnType<typeof resolveAirline>;
}

/** "HH:mm" → gün içi dakika. Parse edilemezse büyük değer (en sona). */
function departMinutes(value: string | null | undefined): number {
  const hm = displayTime(value);
  const m = hm.match(/^(\d{2}):(\d{2})/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  return Number(m[1]) * 60 + Number(m[2]);
}

export default function RouteFlightList({
  flights,
  routeOrigin,
  routeDestination,
  departDate,
  locale,
}: Props) {
  const isTR = locale === 'tr';
  const [sort, setSort] = useState<SortKey>('cheapest');
  const [nonstopOnly, setNonstopOnly] = useState(false);

  // Geçersiz fiyatlıları ele, normalize et, süreyi düzelt.
  const prepared = useMemo<PreparedFlight[]>(() => {
    return flights
      .filter((f) => isValidPrice(f.price))
      .map((f) => {
        const duration = resolveDurationMinutes(
          f.durationMinutes,
          f.departureTime,
          f.arrivalTime,
        );
        return {
          f,
          priceTRY: formatPriceTRY(f.price),
          duration,
          departSort: departMinutes(f.departureTime),
          brand: resolveAirline(f.carrierCode, f.airline),
          goHref: buildGoLink({
            source: f.bookingSource,
            origin: f.departureCode || routeOrigin,
            destination: f.arrivalCode || routeDestination,
            date: departDate ?? undefined,
            price: f.price,
          }),
        };
      });
  }, [flights, routeOrigin, routeDestination, departDate]);

  // En ucuz / en hızlı referans değerleri (rozet için).
  const cheapestPrice = useMemo(
    () => (prepared.length ? Math.min(...prepared.map((p) => p.f.price)) : Infinity),
    [prepared],
  );
  const fastestDuration = useMemo(() => {
    const durs = prepared.map((p) => p.duration).filter((d) => d > 0);
    return durs.length ? Math.min(...durs) : Infinity;
  }, [prepared]);

  // "Aktarmasız" filtre — mevcut nonstop uçuş sayısı (toggle etkinliği için).
  const nonstopCount = useMemo(
    () => prepared.filter((p) => p.f.stops === 0).length,
    [prepared],
  );

  const sorted = useMemo(() => {
    let arr = [...prepared];
    if (nonstopOnly) {
      arr = arr.filter((p) => p.f.stops === 0);
    }
    if (sort === 'fastest') {
      arr.sort((a, b) => {
        const da = a.duration || Infinity;
        const db = b.duration || Infinity;
        if (da !== db) return da - db;
        return a.f.price - b.f.price;
      });
    } else if (sort === 'earliest') {
      arr.sort((a, b) => {
        if (a.departSort !== b.departSort) return a.departSort - b.departSort;
        return a.f.price - b.f.price;
      });
    } else {
      arr.sort((a, b) => a.f.price - b.f.price);
    }
    return arr.slice(0, 12);
  }, [prepared, sort, nonstopOnly]);

  if (prepared.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-700">
        <Plane className="mx-auto mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
        <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
          {isTR
            ? 'Bu rota için fiyatlar güncelleniyor. Lütfen kısa süre sonra tekrar deneyin.'
            : 'Prices for this route are being updated. Please check back shortly.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Sıralama + filtre kontrolleri */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        {/* Segmented sıralama sekmeleri */}
        <div
          className="inline-flex w-full overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 sm:w-auto"
          role="group"
          aria-label={isTR ? 'Uçuş sıralama' : 'Flight sorting'}
        >
          <SortButton
            active={sort === 'cheapest'}
            onClick={() => setSort('cheapest')}
            label={isTR ? 'En Ucuz' : 'Cheapest'}
          />
          <SortButton
            active={sort === 'fastest'}
            onClick={() => setSort('fastest')}
            label={isTR ? 'En Hızlı' : 'Fastest'}
          />
          <SortButton
            active={sort === 'earliest'}
            onClick={() => setSort('earliest')}
            label={isTR ? 'En Erken' : 'Earliest'}
          />
        </div>

        {/* Aktarmasız filtre */}
        <button
          type="button"
          onClick={() => setNonstopOnly((v) => !v)}
          aria-pressed={nonstopOnly}
          disabled={nonstopCount === 0}
          className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
            nonstopOnly
              ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
              : 'border-zinc-200 bg-white text-zinc-700 hover:border-emerald-400 hover:text-emerald-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
          }`}
        >
          <span
            className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
              nonstopOnly ? 'border-white bg-white' : 'border-zinc-300 dark:border-zinc-500'
            }`}
            aria-hidden="true"
          >
            {nonstopOnly && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
          </span>
          {isTR ? 'Aktarmasız' : 'Nonstop only'}
        </button>
      </div>

      {/* Sonuç sayısı */}
      <p className="mb-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {sorted.length}{' '}
        {isTR ? 'uçuş listeleniyor' : sorted.length === 1 ? 'flight shown' : 'flights shown'}
      </p>

      <ul className="space-y-3 sm:space-y-4">
        {sorted.map((p) => (
          <li key={p.f.slug || p.f.id}>
            <FlightRow
              p={p}
              isTR={isTR}
              isCheapest={p.f.price === cheapestPrice}
              isFastest={p.duration > 0 && p.duration === fastestDuration}
            />
          </li>
        ))}
      </ul>

      {/* Fiyat teyit ibaresi */}
      <div className="mt-6 flex items-start gap-2 rounded-lg bg-zinc-50 p-4 text-xs text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>
          {isTR
            ? 'Fiyatlar bilgilendirme amaçlıdır ve döviz kuru ile müsaitliğe göre değişebilir. Kesin fiyat için rezervasyon sayfasında teyit ediniz.'
            : 'Prices are indicative and may vary based on exchange rate and availability. Please confirm the exact price on the booking page.'}
        </p>
      </div>
    </div>
  );
}

function SortButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[40px] flex-1 whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-semibold transition-all sm:flex-none ${
        active
          ? 'bg-[#0066CC] text-white shadow-sm dark:bg-[#3399ff]'
          : 'text-zinc-600 hover:bg-zinc-50 hover:text-[#0066CC] dark:text-zinc-300 dark:hover:bg-zinc-700/50 dark:hover:text-[#3399ff]'
      }`}
    >
      {label}
    </button>
  );
}

function FlightRow({
  p,
  isTR,
  isCheapest,
  isFastest,
}: {
  p: PreparedFlight;
  isTR: boolean;
  isCheapest: boolean;
  isFastest: boolean;
}) {
  const { f, brand, priceTRY, duration, goHref } = p;
  const isDirect = f.stops === 0;
  const depTime = displayTime(f.departureTime);
  const arrTime = displayTime(f.arrivalTime);
  const durLabel = formatDuration(duration, isTR ? 'tr' : 'en');
  const stopsLabel = isDirect
    ? isTR
      ? 'Aktarmasız'
      : 'Nonstop'
    : `${f.stops} ${isTR ? 'aktarma' : f.stops === 1 ? 'stop' : 'stops'}`;

  const bookLabel = isTR ? 'Bileti Al' : 'Book Ticket';
  const aria = `${brand.name} ${f.departureCode} ${depTime} - ${f.arrivalCode} ${arrTime}, ${
    priceTRY ?? ''
  }, ${bookLabel}`;

  return (
    <div
      className={`group relative flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-200/60 dark:bg-zinc-800/80 dark:hover:shadow-black/30 sm:flex-row sm:items-center sm:gap-6 sm:p-5 ${
        isCheapest
          ? 'border-emerald-300 ring-1 ring-emerald-200 dark:border-emerald-700 dark:ring-emerald-900/40'
          : 'border-zinc-200 hover:border-[#0066CC]/40 dark:border-zinc-700'
      }`}
    >
      {/* SOL: Havayolu */}
      <div className="flex min-w-0 items-center gap-3 sm:w-44 sm:shrink-0">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-sm ring-1 ring-black/5"
          style={{ backgroundColor: brand.badge.bg, color: brand.badge.fg }}
          aria-hidden="true"
        >
          {brand.badge.label}
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
            {brand.name}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-1">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                isDirect
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
              }`}
            >
              {stopsLabel}
            </span>
          </div>
        </div>
      </div>

      {/* ORTA: Uçuş çizelgesi */}
      <div className="flex flex-1 items-center gap-3">
        <div className="text-center">
          <div className="text-lg font-bold leading-none text-zinc-900 dark:text-white sm:text-xl">
            {depTime || '--:--'}
          </div>
          <div className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {f.departureCode}
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center px-1">
          {durLabel && (
            <span className="mb-1 flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {durLabel}
            </span>
          )}
          <div className="flex w-full items-center gap-1" aria-hidden="true">
            <span className="h-px flex-1 bg-zinc-300 dark:bg-zinc-600" />
            <Plane className="h-3.5 w-3.5 rotate-90 text-zinc-400 dark:text-zinc-500" />
            <span className="h-px flex-1 bg-zinc-300 dark:bg-zinc-600" />
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold leading-none text-zinc-900 dark:text-white sm:text-xl">
            {arrTime || '--:--'}
          </div>
          <div className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {f.arrivalCode}
          </div>
        </div>
      </div>

      {/* SAĞ: Fiyat + buton */}
      <div className="flex flex-col gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-700 sm:w-52 sm:shrink-0 sm:items-end sm:justify-center sm:border-t-0 sm:pt-0">
        <div className="flex items-end justify-between sm:block sm:text-right">
          <div className="mb-0.5 flex flex-wrap items-center gap-1 sm:justify-end">
            {isCheapest && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                {isTR ? 'En Ucuz' : 'Cheapest'}
              </span>
            )}
            {isFastest && !isCheapest && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                {isTR ? 'En Hızlı' : 'Fastest'}
              </span>
            )}
          </div>
          <div className="text-2xl font-extrabold leading-tight text-[#0066CC] dark:text-[#3399ff] sm:text-[1.7rem]">
            {priceTRY}
          </div>
          <div className="text-[10px] text-zinc-400">
            {isTR ? 'kişi başı / gidiş' : 'per person / one-way'}
          </div>
        </div>
        <a
          href={goHref}
          target="_blank"
          rel="nofollow sponsored noopener"
          aria-label={aria}
          className="group/btn inline-flex min-h-[44px] w-full shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#0066CC] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0052a3] hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC] focus-visible:ring-offset-2 dark:bg-[#3399ff] dark:hover:bg-[#1a8cff]"
        >
          {bookLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
