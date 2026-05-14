'use client';

import { X } from 'lucide-react';
import type { HotelFilterState } from './HotelFilters';

type Props = {
  filters: HotelFilterState;
  onChange: (filters: HotelFilterState) => void;
  locale: 'tr' | 'en';
  priceRange: { min: number; max: number };
};

export default function HotelActiveFilters({ filters, onChange, locale, priceRange }: Props) {
  const chips: { label: string; onRemove: () => void }[] = [];

  // City chips
  filters.cities.forEach((city) => {
    chips.push({
      label: city,
      onRemove: () =>
        onChange({ ...filters, cities: filters.cities.filter((c) => c !== city) }),
    });
  });

  // Amenity chips
  filters.amenities.forEach((amenity) => {
    chips.push({
      label: amenity,
      onRemove: () =>
        onChange({ ...filters, amenities: filters.amenities.filter((a) => a !== amenity) }),
    });
  });

  // Price chips
  if (filters.minPrice > priceRange.min || filters.maxPrice < priceRange.max) {
    chips.push({
      label: `₺${filters.minPrice.toLocaleString()} - ₺${filters.maxPrice.toLocaleString()}`,
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
