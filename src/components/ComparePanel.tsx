'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  X, Star, Clock, MapPin, CheckCircle, XCircle,
  Columns2,
} from 'lucide-react';
import type { Tour } from '@/data/tours';

interface Props {
  tours: Tour[];
  locale?: string;
  onClose?: () => void;
}

interface FeatureRow {
  label: string;
  labelEn: string;
  key: string;
}

const FEATURES: FeatureRow[] = [
  { label: 'Rehber Dahil', labelEn: 'Guide Included', key: 'guide' },
  { label: 'Yemek Dahil', labelEn: 'Meals Included', key: 'meals' },
  { label: 'Transfer Dahil', labelEn: 'Transfer Included', key: 'transfer' },
  { label: 'Ücretsiz İptal', labelEn: 'Free Cancellation', key: 'cancel' },
  { label: 'Grup Turu', labelEn: 'Group Tour', key: 'group' },
];

/* Simulated feature availability per tour index */
const FEATURE_MATRIX: Record<string, boolean[]> = {
  guide: [true, true, false],
  meals: [true, false, true],
  transfer: [true, true, true],
  cancel: [false, true, true],
  group: [true, false, false],
};

export default function ComparePanel({
  tours,
  locale = 'tr',
  onClose,
}: Props) {
  const [items, setItems] = useState<Tour[]>(tours.slice(0, 3));
  const isTr = locale === 'tr';

  const remove = (id: string) =>
    setItems((prev) => prev.filter((t) => t.id !== id));

  if (items.length === 0) return null;

  const bestPrice = Math.min(...items.map((t) => t.price));
  const bestRating = Math.max(...items.map((t) => t.rating));

  return (
    <div className="mx-auto max-w-5xl rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg sm:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <div className="flex items-center gap-2">
          <Columns2 className="h-5 w-5 text-[#0066CC]" />
          <h2 className="text-base font-bold text-zinc-900 sm:text-lg">
            {isTr ? 'Tur Karşılaştırma' : 'Tour Comparison'}
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

      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[500px] text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="w-28 px-2 py-2 text-left text-[10px] font-medium uppercase text-zinc-400 sm:w-36 sm:px-3 sm:py-3" />
              {items.map((tour) => (
                <th
                  key={tour.id}
                  className="min-w-[140px] px-2 py-2 text-center sm:min-w-[180px] sm:px-3 sm:py-3"
                >
                  <div className="relative">
                    <button
                      onClick={() => remove(tour.id)}
                      className="absolute -right-0.5 -top-0.5 rounded-full bg-zinc-100 p-0.5 text-zinc-400 hover:text-red-500 sm:-right-1 sm:-top-1"
                    >
                      <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </button>
                    <div className="relative mb-2 h-20 w-full overflow-hidden rounded-lg sm:h-28">
                      <Image
                        src={tour.image}
                        alt={isTr ? tour.title : tour.titleEn}
                        fill
                        className="object-cover"
                        sizes="(min-width: 640px) 180px, 140px"
                      />
                    </div>
                    <div className="font-semibold text-zinc-900 line-clamp-2 text-xs leading-tight sm:text-sm">
                      {isTr ? tour.title : tour.titleEn}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {/* Price */}
            <tr className="bg-zinc-50/50">
              <td className="px-2 py-2 text-[10px] font-semibold uppercase text-zinc-500 sm:px-3 sm:py-3">
                {isTr ? 'Fiyat' : 'Price'}
              </td>
              {items.map((tour) => (
                <td key={tour.id} className="px-2 py-2 text-center sm:px-3 sm:py-3">
                  <span
                    className={`text-sm font-bold sm:text-lg ${
                      tour.price === bestPrice
                        ? 'text-emerald-600'
                        : 'text-zinc-800'
                    }`}
                  >
                    ₺{tour.price.toLocaleString()}
                  </span>
                  {tour.price === bestPrice && (
                    <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 sm:ml-1.5 sm:text-[10px]">
                      {isTr ? 'En İyi' : 'Best'}
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr>
              <td className="px-2 py-2 text-[10px] font-semibold uppercase text-zinc-500 sm:px-3 sm:py-3">
                {isTr ? 'Puan' : 'Rating'}
              </td>
              {items.map((tour) => (
                <td key={tour.id} className="px-2 py-2 text-center sm:px-3 sm:py-3">
                  <div className="inline-flex items-center gap-0.5 sm:gap-1">
                    <Star
                      className={`h-3 w-3 sm:h-4 sm:w-4 ${
                        tour.rating === bestRating
                          ? 'text-amber-500'
                          : 'text-zinc-400'
                      }`}
                    />
                    <span className="font-semibold text-zinc-800 text-xs sm:text-sm">
                      {tour.rating}
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Duration */}
            <tr className="bg-zinc-50/50">
              <td className="px-2 py-2 text-[10px] font-semibold uppercase text-zinc-500 sm:px-3 sm:py-3">
                {isTr ? 'Süre' : 'Duration'}
              </td>
              {items.map((tour) => (
                <td key={tour.id} className="px-2 py-3 text-center sm:px-3 sm:py-3">
                  <div className="inline-flex items-center gap-1 text-zinc-700 text-xs sm:text-sm">
                    <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    {tour.duration} {isTr ? 'gün' : 'days'}
                  </div>
                </td>
              ))}
            </tr>

            {/* Location */}
            <tr>
              <td className="px-2 py-2 text-[10px] font-semibold uppercase text-zinc-500 sm:px-3 sm:py-3">
                {isTr ? 'Lokasyon' : 'Location'}
              </td>
              {items.map((tour) => (
                <td key={tour.id} className="px-2 py-2 text-center sm:px-3 sm:py-3">
                  <div className="inline-flex items-center gap-1 text-zinc-600 text-xs sm:text-sm">
                    <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {tour.location}
                  </div>
                </td>
              ))}
            </tr>

            {/* Feature rows */}
            {FEATURES.map((feat, fi) => {
              const matrix = FEATURE_MATRIX[feat.key] ?? [];
              return (
                <tr
                  key={feat.key}
                  className={fi % 2 === 0 ? 'bg-zinc-50/50' : ''}
                >
                  <td className="px-2 py-2 text-[10px] font-semibold uppercase text-zinc-500 sm:px-3 sm:py-3">
                    {isTr ? feat.label : feat.labelEn}
                  </td>
                  {items.map((tour, idx) => (
                    <td key={tour.id} className="px-2 py-2 text-center sm:px-3 sm:py-3">
                      {matrix[idx] ? (
                        <CheckCircle className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
                      ) : (
                        <XCircle className="mx-auto h-4 w-4 text-zinc-300 sm:h-5 sm:w-5" />
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CTA */}
      <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:justify-center sm:gap-3">
        {items.map((tour) => (
          <button
            key={tour.id}
            className="w-full rounded-xl bg-[#0066CC] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#0052a3] sm:w-auto sm:px-5 sm:py-2.5 sm:text-sm"
          >
            {isTr ? `${tour.title.slice(0, 18)}… Seç` : `Select ${tour.titleEn.slice(0, 18)}…`}
          </button>
        ))}
      </div>
    </div>
  );
}
