'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Clock, MapPin, Hotel, Plane } from 'lucide-react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

type Props = {
  locale?: 'tr' | 'en';
  limit?: number;
};

export default function RecentlyViewed({ locale = 'tr', limit = 5 }: Props) {
  const { recentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) return null;

  const items = recentlyViewed.slice(0, limit);

  const getHref = (item: (typeof items)[number]) => {
    switch (item.type) {
      case 'tour': return `/tours/${item.slug}`;
      case 'hotel': return `/hotels/${item.slug}`;
      case 'flight': return `/flights/${item.slug}`;
      default: return '#';
    }
  };

  const typeLabel = (item: (typeof items)[number]) => {
    if (locale === 'tr') {
      switch (item.type) {
        case 'tour': return 'Tur';
        case 'hotel': return 'Otel';
        case 'flight': return 'Ucus';
      }
    }
    switch (item.type) {
      case 'tour': return 'Tour';
      case 'hotel': return 'Hotel';
      case 'flight': return 'Flight';
    }
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'tour': return <MapPin className="h-3 w-3" />;
      case 'hotel': return <Hotel className="h-3 w-3" />;
      case 'flight': return <Plane className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <section className="py-8">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-4 w-4 text-zinc-400" />
        <h2 className="text-base font-semibold text-zinc-800">
          {locale === 'tr' ? 'Son Goruntuledikleriniz' : 'Recently Viewed'}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Link
            key={`${item.type}-${item.id}`}
            href={getHref(item)}
            className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition-all duration-200 hover:border-[var(--brand)] hover:shadow-md"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-light)] text-[var(--brand)]">
              {typeIcon(item.type)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-center gap-1">
                <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                  {typeLabel(item)}
                </span>
              </div>
              <p className="truncate text-sm font-medium text-zinc-900 group-hover:text-[var(--brand)]">
                {locale === 'tr' ? item.title : item.titleEn}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
