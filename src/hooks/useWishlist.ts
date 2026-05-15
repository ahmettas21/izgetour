'use client';

import { useState, useEffect, useCallback } from 'react';

export type WishlistItemType = 'tour' | 'hotel' | 'flight';

export interface WishlistItem {
  id: string;
  type: WishlistItemType;
  title: string;
  titleEn: string;
  image?: string;
  price: number;
  slug: string;
}

const STORAGE_KEY = 'izgetour-wishlist';

function loadFromStorage(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: WishlistItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    setItems(loadFromStorage());
  }, []);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id && i.type === item.type);
      const next = exists
        ? prev.filter((i) => !(i.id === item.id && i.type === item.type))
        : [...prev, item];
      saveToStorage(next);
      return next;
    });
  }, []);

  const isWishlisted = useCallback(
    (id: string, type?: WishlistItemType) =>
      items.some((i) => i.id === id && (type ? i.type === type : true)),
    [items]
  );

  return { wishlist: items, toggleWishlist, isWishlisted };
}
