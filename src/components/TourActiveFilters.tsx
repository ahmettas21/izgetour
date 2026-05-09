'use client';

import { X } from 'lucide-react';
import type { FilterState } from './TourFilters';

type Props = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  locale: 'tr' | 'en';
  priceRange: { min: number; max: number };
};

export default function TourActiveFilters({ filters, onChange, locale, priceRange }: Props) {
  const chips: { label: string; onRemove: () => void }[] = [];

  // Category chips
  filters.category.forEach((cat) => {
    const label = cat === 'culture'
      ? (locale === 'tr' ? 'Kültür' : 'Culture')
      : cat === 'nature'
      ? (locale === 'tr' ? 'Doğa' : 'Nature')
      : cat === 'city'
      ? (locale === 'tr' ? 'Şehir' : 'City')
      : (locale === 'tr' ? 'Deniz' : 'Sea');
    chips.push({
      label,
      onRemove: () =>
        onChange({ ...filters, category: filters.category.filter((c) => c !== cat) }),
    });
  });

  // Duration chips
  filters.duration.forEach((d) => {
    chips.push({
      label: d === 3 ? (locale === 'tr' ? '3+ Gün' : '3+ Days') : `${d} ${locale === 'tr' ? 'Gün' : 'Day'}`,
      onRemove: () =>
        onChange({ ...filters, duration: filters.duration.filter((v) => v !== d) }),
    });
  });

  // Price chips
  if (filters.minPrice > priceRange.min || filters.maxPrice < priceRange.max) {
    chips.push({
      label: `₺${filters.minPrice} - ₺${filters.maxPrice}`,
      onRemove: () =>
        onChange({ ...filters, minPrice: priceRange.min, maxPrice: priceRange.max }),
    });
  }

  // Rating chip
  if (filters.minRating > 0) {
    chips.push({
      label: `⭐ ${filters.minRating}+`,
      onRemove: () => onChange({ ...filters, minRating: 0 }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {chips.map((chip, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#0066CC]/20 bg-[#0066CC]/5 px-3 py-1.5 text-xs font-medium text-[#0066CC]"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="ml-0.5 rounded-full p-0.5 text-[#0066CC]/60 hover:bg-[#0066CC]/10 hover:text-[#0066CC]"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
