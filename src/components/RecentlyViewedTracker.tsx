'use client';

import { useEffect } from 'react';
import { useRecentlyViewed, RecentlyViewedItem } from '@/hooks/useRecentlyViewed';

type Props = {
  item: Omit<RecentlyViewedItem, never>;
};

export function RecentlyViewedTracker({ item }: Props) {
  const { addItem } = useRecentlyViewed();

  useEffect(() => {
    addItem(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
