'use client';

import { useTranslations } from 'next-intl';
import { ArrowLeft, Inbox } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import BookingDataTable from '@/components/Admin/BookingDataTable';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { ErrorState, OfflineState, EmptyState } from '@/components/ui/StateUI';
import { mockBookings } from '@/data/hubs/bookings';
import { useState, useEffect } from 'react';

export default function AdminBookingsPage() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!navigator.onLine) {
        setOfflineMode(true);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }, 600);

    const handleOnline = () => setOfflineMode(false);
    const handleOffline = () => { setOfflineMode(true); setIsLoading(false); };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setIsError(false);
    setOfflineMode(false);
    setTimeout(() => {
      if (!navigator.onLine) {
        setOfflineMode(true);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }, 600);
  };

  if (offlineMode) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/admin`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-800"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToDashboard')}
        </Link>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">{t('bookingManagement')}</h1>
        </div>
        <OfflineState onRetry={handleRetry} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/admin`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-800"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToDashboard')}
        </Link>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">{t('bookingManagement')}</h1>
        </div>
        <ErrorState onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href={`/${locale}/admin`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-800"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('backToDashboard')}
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">{t('bookingManagement')}</h1>
        {isLoading ? (
          <div className="mt-1 h-4 w-32 animate-pulse rounded bg-zinc-200" />
        ) : (
          <p className="mt-1 text-sm text-zinc-500">
            {t('totalBookings')}: {mockBookings.length}
          </p>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <SkeletonTable rows={5} cols={7} />
      ) : mockBookings.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-8 w-8" />}
          title={t('emptyBookings')}
          description={t('emptyBookingsDesc')}
        />
      ) : (
        <BookingDataTable bookings={mockBookings} />
      )}
    </div>
  );
}