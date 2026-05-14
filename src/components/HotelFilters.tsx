'use client';

import { useState, useMemo } from 'react';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';

export type HotelFilterState = {
  amenities: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  cities: string[];
};

type Props = {
  filters: HotelFilterState;
  onChange: (filters: HotelFilterState) => void;
  priceRange: { min: number; max: number };
  availableCities: string[];
  availableAmenities: string[];
  locale: 'tr' | 'en';
};

export default function HotelFilters({ filters, onChange, priceRange, availableCities, availableAmenities, locale }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAmenity = (amenity: string) => {
    const next = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onChange({ ...filters, amenities: next });
  };

  const toggleCity = (city: string) => {
    const next = filters.cities.includes(city)
      ? filters.cities.filter((c) => c !== city)
      : [...filters.cities, city];
    onChange({ ...filters, cities: next });
  };

  const activeCount = useMemo(() => {
    let count = filters.amenities.length + filters.cities.length;
    if (filters.minPrice > priceRange.min) count++;
    if (filters.maxPrice < priceRange.max) count++;
    if (filters.minRating > 0) count++;
    return count;
  }, [filters, priceRange]);

  const clearAll = () => {
    onChange({
      amenities: [],
      cities: [],
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      minRating: 0,
    });
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Clear all */}
      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600"
        >
          <X className="h-3.5 w-3.5" />
          {locale === 'tr' ? 'Temizle' : 'Clear All'}
        </button>
      )}

      {/* Şehir */}
      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          {locale === 'tr' ? 'Şehir' : 'City'}
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {availableCities.map((city) => (
            <label
              key={city}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-700 hover:text-zinc-900"
            >
              <input
                type="checkbox"
                checked={filters.cities.includes(city)}
                onChange={() => toggleCity(city)}
                className="h-4 w-4 rounded border-zinc-300 text-[#0066CC] focus:ring-[#0066CC]/20"
              />
              {city}
            </label>
          ))}
        </div>
      </div>

      {/* Fiyat Aralığı */}
      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          {locale === 'tr' ? 'Fiyat Aralığı' : 'Price Range'}
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) =>
              onChange({ ...filters, minPrice: Number(e.target.value) })
            }
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-[#0066CC] focus:outline-none focus:ring-2 focus:ring-[#0066CC]/10"
            placeholder={String(priceRange.min)}
          />
          <span className="text-zinc-400">—</span>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) =>
              onChange({ ...filters, maxPrice: Number(e.target.value) })
            }
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-[#0066CC] focus:outline-none focus:ring-2 focus:ring-[#0066CC]/10"
            placeholder={String(priceRange.max)}
          />
        </div>
      </div>

      {/* Yıldız / Puan */}
      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          {locale === 'tr' ? 'Minimum Puan' : 'Minimum Rating'}
        </h4>
        <div className="flex flex-wrap items-center gap-2">
          {[0, 4.0, 4.5, 4.8].map((rating) => (
            <button
              key={rating}
              onClick={() => onChange({ ...filters, minRating: rating })}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                filters.minRating === rating
                  ? 'border-[#0066CC] bg-[#0066CC]/10 text-[#0066CC]'
                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
              }`}
            >
              {rating === 0 ? (locale === 'tr' ? 'Hepsi' : 'All') : `⭐ ${rating}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Olanaklar */}
      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          {locale === 'tr' ? 'Olanaklar' : 'Amenities'}
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {availableAmenities.map((amenity) => (
            <label
              key={amenity}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-700 hover:text-zinc-900"
            >
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="h-4 w-4 rounded border-zinc-300 text-[#0066CC] focus:ring-[#0066CC]/20"
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-4 flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 lg:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          {locale === 'tr' ? 'Filtrele' : 'Filters'}
          {activeCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0066CC] text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5 lg:hidden">
          {filterContent}
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden w-64 shrink-0 lg:block">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">{filterContent}</div>
      </div>
    </>
  );
}
