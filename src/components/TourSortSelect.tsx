'use client';

import { useTranslations } from 'next-intl';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'rating-desc' | 'duration-asc';

type Props = {
  value: SortOption;
  onChange: (value: SortOption) => void;
  locale: 'tr' | 'en';
};

const OPTIONS: { value: SortOption; tr: string; en: string }[] = [
  { value: 'recommended', tr: 'Önerilen', en: 'Recommended' },
  { value: 'price-asc', tr: 'En Düşük Fiyat', en: 'Lowest Price' },
  { value: 'price-desc', tr: 'En Yüksek Fiyat', en: 'Highest Price' },
  { value: 'rating-desc', tr: 'En Yüksek Puan', en: 'Highest Rating' },
  { value: 'duration-asc', tr: 'En Kısa Süre', en: 'Shortest Duration' },
];

export default function TourSortSelect({ value, onChange, locale }: Props) {
  const t = useTranslations('tours');

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-zinc-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
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
