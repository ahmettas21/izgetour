'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Users, Clock, Plane, Activity } from 'lucide-react';

interface ActivityItem {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  textKey: string;
  getCount: () => number;
}

const activities: ActivityItem[] = [
  {
    icon: Users,
    textKey: 'liveViewers',
    getCount: () => Math.floor(Math.random() * 120) + 45, // 45-165
  },
  {
    icon: Clock,
    textKey: 'todayBookings',
    getCount: () => Math.floor(Math.random() * 30) + 12, // 12-42
  },
  {
    icon: Plane,
    textKey: 'searchingFlights',
    getCount: () => Math.floor(Math.random() * 50) + 18, // 18-68
  },
  {
    icon: Activity,
    textKey: 'activeTrips',
    getCount: () => Math.floor(Math.random() * 15) + 5, // 5-20
  },
];

export default function LiveActivityFeed() {
  const t = useTranslations('home');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [counts, setCounts] = useState<number[]>([]);

  useEffect(() => {
    // Initialize random counts
    setCounts(activities.map((a) => a.getCount()));

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const next = (prev + 1) % activities.length;
          return next;
        });
        setCounts(activities.map((a) => a.getCount()));
        setVisible(true);
      }, 400); // wait for fade-out
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  if (counts.length === 0) return null;

  const current = activities[currentIndex];
  const Icon = current.icon;

  return (
    <div className="mx-auto mt-3 max-w-4xl px-4 sm:px-6">
      <div
        className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 px-4 py-1.5 text-xs text-emerald-700 shadow-sm ring-1 ring-emerald-200/60 transition-all duration-400 ${
          visible
            ? 'translate-y-0 opacity-100'
            : 'translate-y-1 opacity-0'
        }`}
      >
        {/* Live dot */}
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>

        <Icon className="h-3.5 w-3.5 text-emerald-500" size={14} />

        <span className="font-medium">
          {current.textKey === 'liveViewers' && t('socialProof.liveViewers', { count: counts[currentIndex] })}
          {current.textKey === 'todayBookings' && t('socialProof.todayBookings', { count: counts[currentIndex] })}
          {current.textKey === 'searchingFlights' && t('socialProof.searchingFlights', { count: counts[currentIndex] })}
          {current.textKey === 'activeTrips' && t('socialProof.activeTrips', { count: counts[currentIndex] })}
        </span>
      </div>
    </div>
  );
}
