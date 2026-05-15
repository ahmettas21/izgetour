'use client';

import { useState, useEffect, useCallback } from 'react';

export interface RecentlyViewedItem {
  id: string;
  type: 'tour' | 'hotel' | 'flight';
  title: string;
  titleEn: string;
  slug: string;
}

const STORAGE_KEY = 'izgetour-recently-viewed';
const MAX_ITEMS = 5;

function loadFromStorage(): RecentlyViewedItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: RecentlyViewedItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    setItems(loadFromStorage());
  }, []);

  const addItem = useCallback((item: Omit<RecentlyViewedItem, never>) => {
    setItems((prev) => {
      const filtered = prev.filter(
        (i) => !(i.id === item.id && i.type === item.type)
      );
      const next = [item, ...filtered].slice(0, MAX_ITEMS);
      saveToStorage(next);
      return next;
    });
  }, []);

  return { recentlyViewed: items, addItem };
}
