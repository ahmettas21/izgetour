'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, ClipboardList, PlusCircle } from 'lucide-react';
import StatsCards from '@/components/Admin/StatsCards';
import SalesTrendChart from '@/components/Admin/SalesTrendChart';
import { SkeletonStatsGrid, SkeletonChart } from '@/components/ui/Skeleton';
import { ErrorState, OfflineState } from '@/components/ui/StateUI';
import { mockDashboardStats, mockWeeklySales } from '@/data/hubs/admins';
import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';

export default function AdminDashboardPage() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  const popularTourLabel =
    locale === 'tr' ? mockDashboardStats.mostPopularTour : mockDashboardStats.mostPopularTourEn;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!navigator.onLine) {
        setOfflineMode(true);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }, 800);

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
    }, 800);
  };

  if (offlineMode) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">{t('adminDashboard')}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t('adminDashboardDesc')}</p>
        </div>
        <OfflineState onRetry={handleRetry} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">{t('adminDashboard')}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t('adminDashboardDesc')}</p>
        </div>
        <ErrorState onRetry={handleRetry} showBackHome />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">{t('adminDashboard')}</h1>
        <p className="mt-1 text-sm text-zinc-500">{t('adminDashboardDesc')}</p>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <SkeletonStatsGrid count={6} />
      ) : (
        <StatsCards
          stats={{
            ...mockDashboardStats,
            mostPopularTour: popularTourLabel,
          }}
        />
      )}

      {/* Quick Actions & Chart */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <SkeletonChart />
          ) : (
            <SalesTrendChart data={mockWeeklySales} />
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-zinc-900">{t('quickActions')}</h3>

          <Link
            href={`/${locale}/admin/tours/new`}
            className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-[#0066CC] hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <PlusCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-900">{t('newTour')}</div>
                <div className="text-xs text-zinc-400">{t('newTourDesc')}</div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-300 hidden sm:block" />
          </Link>

          <Link
            href={`/${locale}/admin/bookings`}
            className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-[#0066CC] hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-900">{t('viewBookings')}</div>
                <div className="text-xs text-zinc-400">{t('viewBookingsDesc')}</div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-300 hidden sm:block" />
          </Link>

          {/* Status summary */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              {t('systemStatus')}
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">{t('mockData')}</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  {t('active')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">{t('dbStatus')}</span>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                  {t('simulated')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
