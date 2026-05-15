'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Plane, Building2, Compass } from 'lucide-react';
import FlightSearchForm from '@/components/flights/FlightSearchForm';
import type { SearchParams } from '@/components/flights/types';

type Tab = 'flights' | 'tours' | 'hotels';

export default function SmartSearchContainer() {
  const t = useTranslations('flights');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('flights');

  const handleFlightSearch = async (_params: SearchParams) => {
    router.push('/flights');
  };

  return (
    <div className="bg-background">
      {/* ── Tab Bar ── */}
      <div className="border-b border-border dark:border-white/20 bg-surface-elevated">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex gap-1">
            {([
              { key: 'flights' as Tab, icon: Plane, label: t('title') },
              { key: 'tours' as Tab, icon: Compass, label: t('toursTab') },
              { key: 'hotels' as Tab, icon: Building2, label: t('hotelsTab') },
            ] as const).map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`
                  flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors
                  ${activeTab === key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'}
                `}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'flights' && (
        <div className="mx-auto max-w-3xl px-4 py-8">
          <FlightSearchForm onSearch={handleFlightSearch} />
        </div>
      )}

      {activeTab === 'tours' && (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="text-6xl mb-6">🏛️</div>
          <h2 className="text-2xl font-bold text-foreground dark:text-foreground mb-2">{t('comingSoon')}</h2>
          <p className="text-muted-foreground dark:text-muted-foreground max-w-sm">{t('toursComingSoon')}</p>
        </div>
      )}

      {activeTab === 'hotels' && (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="text-6xl mb-6">🏨</div>
          <h2 className="text-2xl font-bold text-foreground dark:text-foreground mb-2">{t('comingSoon')}</h2>
          <p className="text-muted-foreground dark:text-muted-foreground max-w-sm">{t('hotelsComingSoon')}</p>
        </div>
      )}
    </div>
  );
}
