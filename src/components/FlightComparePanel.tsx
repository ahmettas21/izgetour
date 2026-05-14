'use client';

import { useState } from 'react';
import {
  X, Star, Clock, Plane, CheckCircle, XCircle,
  ArrowRight, Columns2, Leaf,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Flight } from '@/data/flights';
import type { FlightOffer } from '@/actions/searchFlights';
import SustainabilityScore from '@/components/SustainabilityScore';

interface Props {
  flights: Flight[] | FlightOffer[];
  locale?: 'tr' | 'en';
  onClose?: () => void;
}

const FEATURES = [
  { key: 'baggage', labelTr: 'Bagaj', labelEn: 'Baggage', field: 'baggage' as const },
  { key: 'refundable', labelTr: 'İade', labelEn: 'Refund', field: 'refundable' as const },
  { key: 'direct', labelTr: 'Direkt', labelEn: 'Direct', field: 'stops' as const },
  { key: 'eco', labelTr: 'Çevre Skoru', labelEn: 'Eco Score', field: 'co2Emissions' as const },
] as const;

export default function FlightComparePanel({ flights, locale = 'tr', onClose }: Props) {
  const [items, setItems] = useState<(Flight | FlightOffer)[]>(flights.slice(0, 3));
  const isTr = locale === 'tr';

  const remove = (id: string) =>
    setItems((prev) => prev.filter((f) => f.id !== id));

  if (items.length === 0) return null;

  const prices = items.map((f) => 'price' in f ? f.price : (f as FlightOffer).price).filter(Boolean);
  const durations = items.map((f) => 'durationMinutes' in f ? f.durationMinutes : (f as FlightOffer).durationMinutes).filter(Boolean);
  const ecos = items.map((f) => 'co2Emissions' in f ? f.co2Emissions : 0).filter(Boolean);

  const bestPrice = prices.length ? Math.min(...prices) : 0;
  const bestDuration = durations.length ? Math.min(...durations) : 0;
  const bestEco = ecos.length ? Math.min(...ecos) : 0;

  const getFieldValue = (f: Flight | FlightOffer, key: string) => {
    switch (key) {
      case 'baggage': return f.baggage;
      case 'refundable': return f.refundable ? (isTr ? 'İade Edilir' : 'Refundable') : (isTr ? 'İadesiz' : 'Non-refund');
      case 'direct': return f.stops === 0 ? (isTr ? 'Direkt' : 'Direct') : `${f.stops} ${isTr ? 'aktarma' : 'stop(s)'}`;
      case 'co2Emissions': return `${f.co2Emissions} kg CO₂`;
      default: return '';
    }
  };

  return (
    <div className="mx-auto max-w-5xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Columns2 className="h-5 w-5 text-[#0066CC]" />
          <h2 className="text-lg font-bold text-zinc-900">
            {isTr ? 'Uçuş Karşılaştırma' : 'Flight Comparison'}
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="w-32 px-3 py-3 text-left text-xs font-medium uppercase text-zinc-400" />
              {items.map((f) => (
                <th key={f.id} className="min-w-[200px] px-3 py-3 text-center">
                  <div className="relative">
                    <button
                      onClick={() => remove(f.id)}
                      className="absolute -right-1 -top-1 rounded-full bg-zinc-100 p-0.5 text-zinc-400 hover:text-red-500"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>

                    {/* Airline badge */}
                    <div className="mb-2 flex justify-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0066CC]/10 text-sm font-bold text-[#0066CC]">
                        {f.carrierCode}
                      </div>
                    </div>
                    <div className="mb-1 text-xs font-semibold text-zinc-500">{f.airline}</div>

                    {/* Route */}
                    <div className="mb-2 flex items-center justify-center gap-1 text-xs text-zinc-600">
                      <span className="font-bold">{f.departureCode}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span className="font-bold">{f.arrivalCode}</span>
                    </div>

                    {/* Time */}
                    <div className="mb-1 flex items-center justify-center gap-2 text-xs text-zinc-500">
                      <span>{f.departureTime}</span>
                      <ArrowRight className="h-3 w-3 rotate-90" />
                      <span>{f.arrivalTime}</span>
                    </div>

                    <Link
                      href={`/flights/${f.slug}`}
                      className="mt-1 inline-block rounded-lg bg-[#0066CC] px-3 py-1 text-xs font-semibold text-white hover:bg-[#0052a3]"
                    >
                      {isTr ? 'Detay →' : 'Details →'}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {/* Price */}
            <tr className="bg-zinc-50/50">
              <td className="px-3 py-3 text-xs font-semibold uppercase text-zinc-500">
                {isTr ? 'Fiyat' : 'Price'}
              </td>
              {items.map((f) => (
                <td key={f.id} className="px-3 py-3 text-center">
                  <span className={`text-lg font-bold ${f.price === bestPrice ? 'text-emerald-600' : 'text-zinc-800'}`}>
                    ₺{f.price.toLocaleString('tr-TR')}
                  </span>
                  {f.price === bestPrice && (
                    <span className="ml-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      {isTr ? 'En İyi' : 'Best'}
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Original price (if changed) */}
            {items.some((f) => f.price < f.originalPrice) && (
              <tr>
                <td className="px-3 py-3 text-xs font-semibold uppercase text-zinc-500">
                  {isTr ? 'Normal Fiyat' : 'Original Price'}
                </td>
                {items.map((f) => (
                  <td key={f.id} className="px-3 py-3 text-center">
                    <span className="text-sm text-zinc-400 line-through">
                      ₺{f.originalPrice.toLocaleString('tr-TR')}
                    </span>
                  </td>
                ))}
              </tr>
            )}

            {/* Rating */}
            <tr>
              <td className="px-3 py-3 text-xs font-semibold uppercase text-zinc-500">
                {isTr ? 'Puan' : 'Rating'}
              </td>
              {items.map((f) => (
                <td key={f.id} className="px-3 py-3 text-center">
                  <div className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-400" />
                    <span className="font-semibold text-zinc-800">
                      {(f as any).availableSeats > 10 ? '4.8' : (f as any).availableSeats > 5 ? '4.5' : '4.2'}
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Duration */}
            <tr className="bg-zinc-50/50">
              <td className="px-3 py-3 text-xs font-semibold uppercase text-zinc-500">
                {isTr ? 'Süre' : 'Duration'}
              </td>
              {items.map((f) => (
                <td key={f.id} className="px-3 py-3 text-center">
                  <div className={`inline-flex items-center gap-1 font-medium ${f.durationMinutes === bestDuration ? 'text-emerald-600' : 'text-zinc-700'}`}>
                    <Clock className="h-3.5 w-3.5" />
                    {f.duration}
                    {f.durationMinutes === bestDuration && (
                      <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                        {isTr ? 'En Kısa' : 'Shortest'}
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Available Seats */}
            <tr>
              <td className="px-3 py-3 text-xs font-semibold uppercase text-zinc-500">
                {isTr ? 'Koltuk' : 'Seats'}
              </td>
              {items.map((f) => (
                <td key={f.id} className="px-3 py-3 text-center">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    (f as any).availableSeats <= 5
                      ? 'bg-red-50 text-red-600'
                      : (f as any).availableSeats <= 15
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {(f as any).availableSeats} {isTr ? 'koltuk' : 'seats'}
                  </span>
                </td>
              ))}
            </tr>

            {/* Feature rows */}
            {FEATURES.map((feat, fi) => (
              <tr
                key={feat.key}
                className={fi % 2 === 0 ? 'bg-zinc-50/50' : ''}
              >
                <td className="px-3 py-3 text-xs font-semibold uppercase text-zinc-500">
                  {feat.labelTr}
                </td>
                {items.map((f) => (
                  <td key={f.id} className="px-3 py-3 text-center">
                    {feat.key === 'eco' ? (
                      <SustainabilityScore
                        co2Emissions={f.co2Emissions}
                        averageEmissions={320}
                        ecoFriendly={f.stops === 0}
                        variant="badge"
                      />
                    ) : feat.key === 'refundable' ? (
                      f.refundable
                        ? <CheckCircle className="mx-auto h-5 w-5 text-emerald-500" />
                        : <XCircle className="mx-auto h-5 w-5 text-zinc-300" />
                    ) : feat.key === 'direct' ? (
                      <span className={`text-xs font-medium ${f.stops === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {getFieldValue(f, feat.key)}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-600">{getFieldValue(f, feat.key)}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {/* CO2 Row */}
            <tr className="bg-zinc-50/50">
              <td className="px-3 py-3 text-xs font-semibold uppercase text-zinc-500">
                <span className="flex items-center gap-1">
                  <Leaf className="h-3.5 w-3.5 text-emerald-500" />
                  CO₂
                </span>
              </td>
              {items.map((f) => (
                <td key={f.id} className="px-3 py-3 text-center">
                  <span className={`text-xs font-medium ${f.co2Emissions === bestEco ? 'text-emerald-600' : 'text-zinc-600'}`}>
                    {f.co2Emissions} kg
                    {f.co2Emissions === bestEco && (
                      <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                        {isTr ? 'En Temiz' : 'Cleanest'}
                      </span>
                    )}
                  </span>
                </td>
              ))}
            </tr>

            {/* Aircraft */}
            <tr>
              <td className="px-3 py-3 text-xs font-semibold uppercase text-zinc-500">
                {isTr ? 'Uçak Tipi' : 'Aircraft'}
              </td>
              {items.map((f) => (
                <td key={f.id} className="px-3 py-3 text-center text-xs text-zinc-600">
                  <div className="flex items-center justify-center gap-1">
                    <Plane className="h-3 w-3 text-zinc-400" />
                    {f.aircraft}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* CTA */}
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        {items.map((f) => (
          <button
            key={f.id}
            className="rounded-xl bg-[#0066CC] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0052a3]"
          >
            {isTr ? 'Bu Uçuşu Seç' : 'Select This Flight'}
            <span className="ml-1 text-xs opacity-80">₺{f.price.toLocaleString('tr-TR')}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
