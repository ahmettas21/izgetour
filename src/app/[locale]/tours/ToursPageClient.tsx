'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { Mic } from 'lucide-react';
import TourFiltersWrapper from './TourFiltersWrapper';
import SocialProofToast from '@/components/SocialProofToast';
import type { TourItem } from './page';

// ------------------------------------------------------------------ //
// ToursPageClient — Client wrapper that manages List / Map / Compare
// toggles.
// Map is lazy-loaded (client only, no SSR) to avoid leaflet SSR issues.
// ComparePanel wraps the Kayak-style split-view comparison table.
// ------------------------------------------------------------------ //

const TourMapView = dynamic(
  () => import('@/components/TourMapView'),
  { ssr: false, loading: () => <div className="flex h-[500px] items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400">Harita yükleniyor…</div> }
);

const ComparePanel = dynamic(
  () => import('@/components/ComparePanel'),
  { ssr: false }
);

const VoiceInteractiveMap = dynamic(
  () => import('@/components/VoiceInteractiveMap'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400">
        Sesli rehber haritası yükleniyor…
      </div>
    ),
  }
);

type ViewMode = 'list' | 'map' | 'compare';

interface ToursPageClientProps {
  tours: TourItem[];
  locale: 'tr' | 'en';
}

export default function ToursPageClient({ tours, locale }: ToursPageClientProps) {
  const t = useTranslations('tours');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [_hoveredTourId, setHoveredTourId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showVoiceMap, setShowVoiceMap] = useState(false);

  // Toggle a tour id in the compare selection (max 3)
  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, id];
    });
  }, []);

  const handleStartCompare = useCallback(() => {
    if (compareIds.length >= 2) setViewMode('compare');
  }, [compareIds]);

  const handleCloseCompare = useCallback(() => {
    setViewMode('list');
    setCompareIds([]);
  }, []);

  const compareTours = tours.filter((t) => compareIds.includes(t.id));

  return (
    <div>
      <SocialProofToast />

      {/* View Toggle + Compare Controls */}
      <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {/* View mode pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-[#0066CC] text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {t('map.listView') || 'Liste'}
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-[#0066CC] text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {t('map.mapView') || 'Harita'}
          </button>
        </div>

        {/* Compare toggle area */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (viewMode === 'compare') {
                handleCloseCompare();
              } else if (compareIds.length >= 2) {
                handleStartCompare();
              }
            }}
            disabled={compareIds.length < 2}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              viewMode === 'compare'
                ? 'bg-emerald-600 text-white shadow-sm'
                : compareIds.length >= 2
                  ? 'bg-[#0066CC] text-white shadow-sm hover:bg-[#0052a3]'
                  : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            }`}
          >
            {locale === 'tr'
              ? `Karşılaştır (${compareIds.length})`
              : `Compare (${compareIds.length})`}
          </button>
          {compareIds.length > 0 && viewMode !== 'compare' && (
            <button
              onClick={() => setCompareIds([])}
              className="rounded-full px-3 py-2 text-xs font-medium text-zinc-500 hover:bg-zinc-100 transition-colors"
            >
              {locale === 'tr' ? 'Temizle' : 'Clear'}
            </button>
          )}
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="mb-8 space-y-4">
          {/* Voice map / standard map toggle */}
          <div className="flex justify-center">
            <div className="inline-flex rounded-full border border-zinc-200 bg-white p-1 gap-1">
              <button
                onClick={() => setShowVoiceMap(false)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  !showVoiceMap
                    ? 'bg-[#0066CC] text-white'
                    : 'text-zinc-500 hover:bg-zinc-50'
                }`}
              >
                {locale === 'tr' ? 'Standart Harita' : 'Standard Map'}
              </button>
              <button
                onClick={() => setShowVoiceMap(true)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  showVoiceMap
                    ? 'bg-[#0066CC] text-white'
                    : 'text-zinc-500 hover:bg-zinc-50'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                {locale === 'tr' ? 'Sesli Rehber' : 'Voice Guide'}
              </button>
            </div>
          </div>

          {showVoiceMap ? (
            <VoiceInteractiveMap locale={locale} />
          ) : (
            <TourMapView onTourHover={(id) => setHoveredTourId(id)} />
          )}
        </div>
      )}

      {/* Compare View */}
      {viewMode === 'compare' && compareTours.length >= 2 && (
        <div className="mb-8">
          <ComparePanel
            tours={compareTours as any}
            locale={locale}
            onClose={handleCloseCompare}
          />
        </div>
      )}

      {/* List View — existing filterable grid */}
      {viewMode === 'list' && (
        <TourFiltersWrapper
          tours={tours}
          locale={locale}
          compareIds={compareIds}
          onToggleCompare={toggleCompare}
        />
      )}
    </div>
  );
}
