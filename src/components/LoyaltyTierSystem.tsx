'use client';

import { useState } from 'react';
import {
  Crown, Star, Shield, Gem, ChevronRight,
  Plane, Percent, Armchair, Headphones, Gift,
  Trophy, TrendingUp,
} from 'lucide-react';

interface Tier {
  id: string;
  name: string;
  nameEn: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  gradient: string;
  ringColor: string;
  minPoints: number;
  perks: Perk[];
}

interface Perk {
  label: string;
  labelEn: string;
  icon: React.ElementType;
}

const TIERS: Tier[] = [
  {
    id: 'bronze', name: 'Bronz', nameEn: 'Bronze',
    icon: Shield, color: 'text-amber-700', bg: 'bg-amber-50',
    gradient: 'from-amber-600 to-amber-800', ringColor: 'ring-amber-300',
    minPoints: 0,
    perks: [
      { label: 'Temel destek', labelEn: 'Basic support', icon: Headphones },
      { label: '%3 puan kazanım', labelEn: '3% point earn', icon: Percent },
    ],
  },
  {
    id: 'silver', name: 'Gümüş', nameEn: 'Silver',
    icon: Star, color: 'text-slate-500', bg: 'bg-slate-50',
    gradient: 'from-slate-400 to-slate-600', ringColor: 'ring-slate-300',
    minPoints: 5000,
    perks: [
      { label: 'Öncelikli destek', labelEn: 'Priority support', icon: Headphones },
      { label: '%5 puan kazanım', labelEn: '5% point earn', icon: Percent },
      { label: 'Ücretsiz iptal', labelEn: 'Free cancellation', icon: Gift },
    ],
  },
  {
    id: 'gold', name: 'Altın', nameEn: 'Gold',
    icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-50',
    gradient: 'from-yellow-400 to-amber-500', ringColor: 'ring-yellow-300',
    minPoints: 15000,
    perks: [
      { label: 'VIP destek', labelEn: 'VIP support', icon: Headphones },
      { label: '%8 puan kazanım', labelEn: '8% point earn', icon: Percent },
      { label: 'Lounge erişimi', labelEn: 'Lounge access', icon: Armchair },
      { label: 'Ücretsiz upgrade', labelEn: 'Free upgrade', icon: Plane },
    ],
  },
  {
    id: 'platinum', name: 'Platin', nameEn: 'Platinum',
    icon: Gem, color: 'text-violet-500', bg: 'bg-violet-50',
    gradient: 'from-violet-500 to-purple-700', ringColor: 'ring-violet-300',
    minPoints: 50000,
    perks: [
      { label: 'Kişisel seyahat danışmanı', labelEn: 'Personal travel advisor', icon: Headphones },
      { label: '%12 puan kazanım', labelEn: '12% point earn', icon: Percent },
      { label: 'Lounge & fast-track', labelEn: 'Lounge & fast-track', icon: Armchair },
      { label: 'Garantili upgrade', labelEn: 'Guaranteed upgrade', icon: Plane },
      { label: 'Özel indirimler', labelEn: 'Exclusive discounts', icon: Gift },
    ],
  },
];

interface Props {
  locale?: string;
  currentPoints?: number;
  totalTrips?: number;
}

export default function LoyaltyTierSystem({
  locale = 'tr', currentPoints = 8200, totalTrips = 7,
}: Props) {
  const isTr = locale === 'tr';
  const [expanded, setExpanded] = useState<string | null>(null);

  // Determine current tier
  const currentTier = [...TIERS].reverse().find(t => currentPoints >= t.minPoints) ?? TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];
  const progress = nextTier
    ? ((currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  const CurrentIcon = currentTier.icon;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-orange-500" />
        <h2 className="text-lg font-bold text-zinc-900">
          {isTr ? 'Sadakat Seviyem' : 'My Loyalty Tier'}
        </h2>
      </div>

      {/* Current tier hero */}
      <div className={`mb-6 rounded-2xl bg-gradient-to-br ${currentTier.gradient} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider opacity-80">
              {isTr ? 'Mevcut Seviye' : 'Current Tier'}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <CurrentIcon className="h-7 w-7" />
              <span className="text-2xl font-bold">{isTr ? currentTier.name : currentTier.nameEn}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{currentPoints.toLocaleString()}</div>
            <div className="text-xs opacity-80">{isTr ? 'İzge Puan' : 'İzge Points'}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-6">
          <div>
            <div className="text-lg font-bold">{totalTrips}</div>
            <div className="text-xs opacity-80">{isTr ? 'Seyahat' : 'Trips'}</div>
          </div>
          <div>
            <div className="text-lg font-bold">{currentTier.perks.length}</div>
            <div className="text-xs opacity-80">{isTr ? 'Ayrıcalık' : 'Perks'}</div>
          </div>
        </div>

        {/* Progress to next tier */}
        {nextTier && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs opacity-80">
              <span>{isTr ? `Sonraki: ${nextTier.name}` : `Next: ${nextTier.nameEn}`}</span>
              <span>{nextTier.minPoints.toLocaleString()} {isTr ? 'puan' : 'pts'}</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs opacity-80">
              <TrendingUp className="h-3 w-3" />
              {(nextTier.minPoints - currentPoints).toLocaleString()} {isTr ? 'puan kaldı' : 'points to go'}
            </div>
          </div>
        )}
      </div>

      {/* All tiers */}
      <div className="space-y-2">
        {TIERS.map(tier => {
          const Icon = tier.icon;
          const isCurrent = tier.id === currentTier.id;
          const isLocked = currentPoints < tier.minPoints;
          const isOpen = expanded === tier.id;

          return (
            <div key={tier.id}>
              <button onClick={() => setExpanded(isOpen ? null : tier.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                  isCurrent ? `border-2 ${tier.ringColor} bg-white shadow-sm` : 'border-zinc-100 hover:border-zinc-200'
                }`}>
                <div className={`rounded-xl p-2 ${isLocked ? 'bg-zinc-100' : tier.bg}`}>
                  <Icon className={`h-5 w-5 ${isLocked ? 'text-zinc-400' : tier.color}`} />
                </div>
                <div className="flex-1">
                  <span className={`text-sm font-semibold ${isLocked ? 'text-zinc-400' : 'text-zinc-800'}`}>
                    {isTr ? tier.name : tier.nameEn}
                  </span>
                  <span className="ml-2 text-xs text-zinc-400">
                    {tier.minPoints.toLocaleString()}+ {isTr ? 'puan' : 'pts'}
                  </span>
                </div>
                {isCurrent && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                    {isTr ? 'AKTİF' : 'ACTIVE'}
                  </span>
                )}
                <ChevronRight className={`h-4 w-4 text-zinc-300 transition ${isOpen ? 'rotate-90' : ''}`} />
              </button>

              {isOpen && (
                <div className="ml-12 mt-2 mb-1 space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                  {tier.perks.map(p => {
                    const PerkIcon = p.icon;
                    return (
                      <div key={p.label} className="flex items-center gap-2 text-xs text-zinc-600">
                        <PerkIcon className={`h-3.5 w-3.5 ${isLocked ? 'text-zinc-300' : tier.color}`} />
                        {isTr ? p.label : p.labelEn}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
