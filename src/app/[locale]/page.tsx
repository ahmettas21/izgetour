import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import HeroBanner from '@/components/HeroBanner';
import SmartSearch from '@/components/SmartSearch';
import Features from '@/components/Features';
import MoodDestinationPickerClient from '@/components/MoodDestinationPickerClient';
import TourCard from '@/components/TourCard';
import { MOCK_TOURS } from '@/data/tours';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

export const metadata = (): Metadata => ({
  title: 'İzgetour – Türkiye Turizm Platformu',
  description: "Türkiye'nin önde gelen turizm platformu.",
});

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tTours = await getTranslations('tours');
  const tHome = await getTranslations('home');

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <HeroBanner locale={locale as 'tr' | 'en'} />

      {/* ── Search ───────────────────────────────────────── */}
      <SmartSearch />

      {/* ── Features ─────────────────────────────────────── */}
      <Features />

      {/* ── Mood Destination Picker ──────────────────────── */}
      <section className="bg-gradient-to-b from-amber-50 via-orange-50 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 sm:mb-12 text-center">
            <span className="mb-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700">
              {locale === 'tr' ? 'İlham Ver' : 'Get Inspired'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
              {locale === 'tr' ? 'Ruh Haline Göre Keşfet' : 'Explore by Mood'}
            </h2>
            <p className="mt-2 text-[var(--muted)]">{tHome('moodPicker.subtitle')}</p>
          </div>

          <MoodDestinationPickerClient locale={locale as 'tr' | 'en'} />
        </div>
      </section>

      {/* ── Popular Tours ─────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 sm:py-24">
        {/* Section header */}
        <div className="mb-8 sm:mb-14 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-2 inline-block rounded-full bg-[var(--brand-light)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--brand)]">
              {locale === 'tr' ? 'Öne Çıkanlar' : 'Featured'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
              {tTours('title')}
            </h2>
            <p className="mt-2 text-[var(--muted)]">{tTours('subtitle')}</p>
          </div>
          <Link
            href="/tours"
            className="flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:underline"
          >
            {tTours('viewAll')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Tour grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_TOURS.map((tour) => (
            <TourCard key={tour.id} tour={tour} locale={locale as 'tr' | 'en'} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 sm:mt-14 text-center">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--brand)] px-8 py-3 font-semibold text-[var(--brand)] transition-all duration-200 hover:bg-[var(--brand)] hover:text-white"
          >
            {tTours('viewAll')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
