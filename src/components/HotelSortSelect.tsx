'use client';

import { ArrowUpDown } from 'lucide-react';

export type HotelSortOption = 'recommended' | 'price-asc' | 'price-desc' | 'rating-desc';

type Props = {
  value: HotelSortOption;
  onChange: (value: HotelSortOption) => void;
  locale: 'tr' | 'en';
};

const OPTIONS: { value: HotelSortOption; tr: string; en: string }[] = [
  { value: 'recommended', tr: 'Önerilen', en: 'Recommended' },
  { value: 'price-asc', tr: 'En Düşük Fiyat', en: 'Lowest Price' },
  { value: 'price-desc', tr: 'En Yüksek Fiyat', en: 'Highest Price' },
  { value: 'rating-desc', tr: 'En Yüksek Puan', en: 'Highest Rating' },
];

export default function HotelSortSelect({ value, onChange, locale }: Props) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-zinc-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as HotelSortOption)}
        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 focus:border-[#0066CC] focus:outline-none focus:ring-2 focus:ring-[#0066CC]/10"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {locale === 'tr' ? opt.tr : opt.en}
          </option>
        ))}
      </select>
    </div>
  );
}
