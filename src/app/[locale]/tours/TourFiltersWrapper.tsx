'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import TourCard from '@/components/TourCard';
import TourFilters from '@/components/TourFilters';
import TourSortSelect from '@/components/TourSortSelect';
import TourSearchBar from '@/components/TourSearchBar';
import TourActiveFilters from '@/components/TourActiveFilters';
import type { FilterState } from '@/components/TourFilters';
import type { SortOption } from '@/components/TourSortSelect';
import type { TourItem } from './page';
import { SearchX } from 'lucide-react';

type Props = {
  tours: TourItem[];
  locale: 'tr' | 'en';
};

const DEFAULT_FILTERS: FilterState = {
  category: [],
  minPrice: 0,
  maxPrice: 99999,
  duration: [],
  minRating: 0,
};

export default function TourFiltersWrapper({ tours, locale }: Props) {
  const t = useTranslations('tours');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('recommended');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const priceRange = useMemo(() => {
    const prices = tours.map((t) => t.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [tours]);

  const filtered = useMemo(() => {
    let result = [...tours];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          (locale === 'tr' ? t.title : t.titleEn).toLowerCase().includes(q) ||
          (locale === 'tr' ? t.description : t.descriptionEn).toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.category.length > 0) {
      result = result.filter((t) => t.category && filters.category.includes(t.category));
    }

    // Price range filter
    result = result.filter((t) => t.price >= filters.minPrice && t.price <= filters.maxPrice);

    // Duration filter
    if (filters.duration.length > 0) {
      result = result.filter((t) => {
        return filters.duration.some((d) => {
          if (d === 3) return t.duration >= 3;
          return t.duration === d;
        });
      });
    }

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter((t) => t.rating >= filters.minRating);
    }

    // Sort
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration-asc':
        result.sort((a, b) => a.duration - b.duration);
        break;
      default:
        // 'recommended' - keep original order
        break;
    }

    return result;
  }, [tours, search, sort, filters, locale]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Filters sidebar */}
      <TourFilters
        filters={filters}
        onChange={setFilters}
        priceRange={priceRange}
        locale={locale}
      />

      {/* Main content */}
      <div className="min-w-0 flex-1">
        {/* Search + Sort bar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <TourSearchBar
              value={search}
              onChange={setSearch}
              placeholderTr="Tur adı, lokasyon veya açıklama ara..."
              placeholderEn="Search tour name, location or description..."
              locale={locale}
            />
          </div>
          <TourSortSelect value={sort} onChange={setSort} locale={locale} />
        </div>

        {/* Active filter chips */}
        <TourActiveFilters
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
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-zinc-500">
              {filtered.length} {locale === 'tr' ? 'tur bulundu' : 'tours found'}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((tour) => (
                <TourCard key={tour.id} tour={tour} locale={locale} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
