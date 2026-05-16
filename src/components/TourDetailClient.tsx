'use client';

import { RecentlyViewedTracker } from '@/components/RecentlyViewedTracker';
import RecentlyViewed from '@/components/ui/RecentlyViewed';
import type { RecentlyViewedItem } from '@/hooks/useRecentlyViewed';

type Props = {
  item: Omit<RecentlyViewedItem, 'id' | 'type' | 'title' | 'titleEn' | 'slug'> & {
    id: string;
    type: 'tour';
    title: string;
    titleEn: string;
    slug: string;
  };
  locale: string;
  children: React.ReactNode;
};

export default function TourDetailClient({ item, locale, children }: Props) {
  return (
    <>
      <RecentlyViewedTracker item={item} />
      {children}
      <RecentlyViewed locale={locale as 'tr' | 'en'} />
    </>
  );
}
