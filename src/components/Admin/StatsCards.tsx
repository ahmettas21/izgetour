'use client';

import { useTranslations } from 'next-intl';
import { Wallet, CalendarCheck, RefreshCcw, TrendingUp, Users, UserPlus } from 'lucide-react';
import type { DashboardStats } from '@/data/hubs/admins';

type Props = {
  stats: DashboardStats;
};

export default function StatsCards({ stats }: Props) {
  const t = useTranslations('admin');

  const cards = [
    {
      label: t('totalSales'),
      value: `₺${stats.totalSalesTRY.toLocaleString('tr-TR')}`,
      icon: Wallet,
      color: 'text-emerald-600 bg-emerald-50',
      sub: 'TRY',
    },
    {
      label: t('activeBookings'),
      value: stats.activeBookings.toLocaleString('tr-TR'),
      icon: CalendarCheck,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: t('pendingRefunds'),
      value: stats.pendingRefunds.toLocaleString('tr-TR'),
      icon: RefreshCcw,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: t('mostPopularTour'),
      value: stats.mostPopularTour,
      icon: TrendingUp,
      color: 'text-violet-600 bg-violet-50',
      truncate: true,
    },
    {
      label: t('totalCustomers'),
      value: stats.totalCustomers.toLocaleString('tr-TR'),
      icon: Users,
      color: 'text-cyan-600 bg-cyan-50',
    },
    {
      label: t('newThisMonth'),
      value: stats.newCustomersThisMonth.toLocaleString('tr-TR'),
      icon: UserPlus,
      color: 'text-rose-600 bg-rose-50',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-2xl border border-zinc-200 bg-white p-5"
          >
            <div className={`mb-3 inline-flex rounded-xl p-2.5 ${card.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="mt-3 text-2xl font-bold text-zinc-900 truncate">
              {card.value}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500">
              <span>{card.label}</span>
              {card.sub && (
                <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-500">
                  {card.sub}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
