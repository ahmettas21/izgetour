'use client';

import { useState, useMemo } from 'react';
import { SearchX } from 'lucide-react';
import HotelFilters from '@/components/HotelFilters';
import HotelSortSelect from '@/components/HotelSortSelect';
import HotelSearchBar from '@/components/HotelSearchBar';
import HotelActiveFilters from '@/components/HotelActiveFilters';
import HotelCard from '@/components/HotelCard';
import type { HotelFilterState } from '@/components/HotelFilters';
import type { HotelSortOption } from '@/components/HotelSortSelect';
import type { Hotel } from '@/data/hotels';

type Props = {
  hotels: Hotel[];
  locale: 'tr' | 'en';
};

const DEFAULT_FILTERS: HotelFilterState = {
  amenities: [],
  cities: [],
  minPrice: 0,
  maxPrice: 999999,
  minRating: 0,
};

export default function HotelFiltersWrapper({ hotels, locale }: Props) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<HotelSortOption>('recommended');
  const [filters, setFilters] = useState<HotelFilterState>(DEFAULT_FILTERS);

  // Extract available cities and amenities from hotels
  const { availableCities, availableAmenities, priceRange } = useMemo(() => {
    const cities = Array.from(new Set(hotels.map((h) => h.city))).sort();
    const amenitySet = new Set<string>();
    hotels.forEach((h) => h.amenities.forEach((a) => amenitySet.add(a)));
    const amenities = Array.from(amenitySet).sort();

    const prices = hotels.flatMap((h) => h.rooms.map((r) => r.price));
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return {
      availableCities: cities,
      availableAmenities: amenities,
      priceRange: { min, max },
    };
  }, [hotels]);

  const filtered = useMemo(() => {
    let result = [...hotels];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (h) =>
          (locale === 'tr' ? h.title : h.titleEn).toLowerCase().includes(q) ||
          (locale === 'tr' ? h.description : h.descriptionEn).toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q) ||
          h.amenities.some((a) => a.toLowerCase().includes(q))
      );
    }

    // City filter
    if (filters.cities.length > 0) {
      result = result.filter((h) => filters.cities.includes(h.city));
    }

    // Price range filter (based on cheapest room price)
    result = result.filter((h) => {
      const minPrice = Math.min(...h.rooms.map((r) => r.price));
      return minPrice >= filters.minPrice && minPrice <= filters.maxPrice;
    });

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter((h) => h.rating >= filters.minRating);
    }

    // Amenities filter (must have ALL selected amenities)
    if (filters.amenities.length > 0) {
      result = result.filter((h) =>
        filters.amenities.every((a) => h.amenities.includes(a))
      );
    }

    // Sort
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => {
          const aMin = Math.min(...a.rooms.map((r) => r.price));
          const bMin = Math.min(...b.rooms.map((r) => r.price));
          return aMin - bMin;
        });
        break;
      case 'price-desc':
        result.sort((a, b) => {
          const aMin = Math.min(...a.rooms.map((r) => r.price));
          const bMin = Math.min(...b.rooms.map((r) => r.price));
          return bMin - aMin;
        });
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // 'recommended' - keep original order
        break;
    }

    return result;
  }, [hotels, search, sort, filters, locale]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Filters sidebar */}
      <HotelFilters
        filters={filters}
        onChange={setFilters}
        priceRange={priceRange}
        availableCities={availableCities}
        availableAmenities={availableAmenities}
        locale={locale}
      />

      {/* Main content */}
      <div className="min-w-0 flex-1">
        {/* Search + Sort bar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <HotelSearchBar
              value={search}
              onChange={setSearch}
              placeholderTr="Otel adı, şehir veya özellik ara..."
              placeholderEn="Search hotel name, city or amenities..."
              locale={locale}
            />
          </div>
          <HotelSortSelect value={sort} onChange={setSort} locale={locale} />
        </div>

        {/* Active filter chips */}
        <HotelActiveFilters
          filters={filters}
          onChange={setFilters}
          locale={locale}
          priceRange={priceRange}
        />

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchX className="mb-4 h-12 w-12 text-zinc-300" />
            <h3 className="text-lg font-semibold text-zinc-700">
              {locale === 'tr' ? 'Sonuç bulunamadı' : 'No results found'}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              {locale === 'tr'
                ? 'Filtreleri değiştirmeyi veya aramanızı daraltmayı deneyin.'
                : 'Try changing filters or narrowing your search.'}
            </p>
            <button
              onClick={() => {
                setSearch('');
                setFilters(DEFAULT_FILTERS);
              }}
              className="mt-4 rounded-xl bg-[#0066CC] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0052a3]"
            >
              {locale === 'tr' ? 'Filtreleri Temizle' : 'Clear Filters'}
            </button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-zinc-500">
              {filtered.length} {locale === 'tr' ? 'otel bulundu' : 'hotels found'}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} locale={locale} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
