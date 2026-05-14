'use client';

import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { usePathname } from 'next/navigation';

const content = {
  tr: {
    offline: 'Çevrimdışı',
    description: 'İnternet bağlantısı yok gibi görünüyor. Bağlantı gelince tekrar deneyebilirsin.',
    savedBookings: 'Kaydedilen Rezervasyonlar',
    popularTours: 'Popüler Turlar',
    searchHotels: 'Otel Ara',
    retry: 'Tekrar Dene',
  },
  en: {
    offline: 'You are offline',
    description: 'It looks like you lost internet connection. Try again when you are back online.',
    savedBookings: 'Saved Bookings',
    popularTours: 'Popular Tours',
    searchHotels: 'Search Hotels',
    retry: 'Retry',
  },
};

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const pathname = usePathname() ?? '';
  const locale = pathname.startsWith('/en') ? 'en' : 'tr';
  const t = content[locale];

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-blue-50 px-4 py-2 text-sm text-blue-700">
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>{t.offline}</span>
    </div>
  );
}
