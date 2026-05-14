'use client';

import { useState } from 'react';
import {
  Trophy, Plane, MapPin, Mountain, Palmtree, Compass,
  Star, Lock, Sparkles, ChevronRight,
} from 'lucide-react';

export interface Badge {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  earned: boolean;
  progress: number;       // 0‒100
  requirement: string;
  requirementEn: string;
}

const BADGES: Badge[] = [
  {
    id: 'first-flight', name: 'İlk Kanat', nameEn: 'First Wing',
    description: 'İlk uçak biletini satın al', descriptionEn: 'Purchase your first flight',
    icon: Plane, color: 'text-sky-500', bg: 'bg-sky-50',
    earned: true, progress: 100,
    requirement: '1 uçuş rezervasyonu', requirementEn: '1 flight booking',
  },
  {
    id: 'explorer', name: 'Kaşif', nameEn: 'Explorer',
    description: '3 farklı şehir ziyaret et', descriptionEn: 'Visit 3 different cities',
    icon: Compass, color: 'text-emerald-500', bg: 'bg-emerald-50',
    earned: true, progress: 100,
    requirement: '3 farklı destinasyon', requirementEn: '3 different destinations',
  },
  {
    id: 'peak-seeker', name: 'Zirve Avcısı', nameEn: 'Peak Seeker',
    description: 'Bir doğa/dağ turuna katıl', descriptionEn: 'Join a nature/mountain tour',
    icon: Mountain, color: 'text-amber-600', bg: 'bg-amber-50',
    earned: false, progress: 60,
    requirement: '1 doğa turu', requirementEn: '1 nature tour',
  },
  {
    id: 'beach-lover', name: 'Sahil Rüzgarı', nameEn: 'Beach Breeze',
    description: 'Sahil otelinde 3 gece konaklama', descriptionEn: '3 nights at a beach hotel',
    icon: Palmtree, color: 'text-teal-500', bg: 'bg-teal-50',
    earned: false, progress: 33,
    requirement: '3 gece sahil otel', requirementEn: '3 nights beach hotel',
  },
  {
    id: 'culture-guru', name: 'Tarih Meraklısı', nameEn: 'Culture Guru',
    description: '5 kültürel tur tamamla', descriptionEn: 'Complete 5 cultural tours',
    icon: MapPin, color: 'text-purple-500', bg: 'bg-purple-50',
    earned: false, progress: 20,
    requirement: '5 kültürel tur', requirementEn: '5 cultural tours',
  },
  {
    id: 'vip', name: 'VIP Gezgin', nameEn: 'VIP Traveler',
    description: '10.000 İzge Puan topla', descriptionEn: 'Collect 10,000 İzge Points',
    icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50',
    earned: false, progress: 45,
    requirement: '10.000 puan', requirementEn: '10,000 points',
  },
];

interface Props {
  locale?: string;
}

export default function GamificationBadges({ locale = 'tr' }: Props) {
  const [selected, setSelected] = useState<Badge | null>(null);
  const earned = BADGES.filter((b) => b.earned);
  const locked = BADGES.filter((b) => !b.earned);
  const isTr = locale === 'tr';

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-bold text-zinc-900">
            {isTr ? 'Rozetlerim' : 'My Badges'}
          </h2>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          {earned.length}/{BADGES.length}
        </span>
      </div>

      {/* Earned */}
      <div className="mb-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {earned.map((b) => {
          const Icon = b.icon;
          return (
            <button
              key={b.id}
              onClick={() => setSelected(b)}
              className="group flex flex-col items-center gap-1.5 rounded-xl border border-zinc-100 p-3 transition hover:border-amber-200 hover:shadow-sm"
            >
              <div className={`rounded-xl p-2.5 ${b.bg}`}>
                <Icon className={`h-5 w-5 ${b.color}`} />
              </div>
              <span className="text-[11px] font-medium text-zinc-700">
                {isTr ? b.name : b.nameEn}
              </span>
              <Sparkles className="h-3 w-3 text-amber-400" />
            </button>
          );
        })}
      </div>

      {/* Locked / In-progress */}
      <h3 className="mb-3 text-sm font-semibold text-zinc-500">
        {isTr ? 'Kilit Açılmamış' : 'Locked'}
      </h3>
      <div className="space-y-3">
        {locked.map((b) => {
          const _Icon = b.icon as React.ComponentType<{ className?: string }>;
          return (
            <button
              key={b.id}
              onClick={() => setSelected(b)}
              className="flex w-full items-center gap-4 rounded-xl border border-zinc-100 p-3 text-left transition hover:border-zinc-200 hover:shadow-sm"
            >
              <div className="rounded-xl bg-zinc-100 p-2.5">
                <Lock className="h-5 w-5 text-zinc-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-zinc-700">
                  {isTr ? b.name : b.nameEn}
                </div>
                <div className="mt-0.5 text-xs text-zinc-400">
                  {isTr ? b.requirement : b.requirementEn}
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all"
                    style={{ width: `${b.progress}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-semibold text-zinc-400">
                %{b.progress}
              </span>
              <ChevronRight className="h-4 w-4 text-zinc-300" />
            </button>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex justify-center">
              <div className={`rounded-2xl p-4 ${selected.bg}`}>
                <selected.icon className={`h-8 w-8 ${selected.color}`} />
              </div>
            </div>
            <h3 className="text-center text-lg font-bold text-zinc-900">
              {isTr ? selected.name : selected.nameEn}
            </h3>
            <p className="mt-1 text-center text-sm text-zinc-500">
              {isTr ? selected.description : selected.descriptionEn}
            </p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
                style={{ width: `${selected.progress}%` }}
              />
            </div>
            <p className="mt-2 text-center text-xs text-zinc-400">
              {selected.earned
                ? isTr ? '✅ Kazanıldı!' : '✅ Earned!'
                : `${selected.progress}% — ${isTr ? selected.requirement : selected.requirementEn}`}
            </p>
            <button
              onClick={() => setSelected(null)}
              className="mt-5 w-full rounded-xl bg-zinc-100 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-200"
            >
              {isTr ? 'Kapat' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
