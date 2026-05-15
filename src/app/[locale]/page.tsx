import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import HeroBanner from '@/components/HeroBanner';
import SmartSearch from '@/components/SmartSearch';
import Features from '@/components/Features';
import MoodDestinationPickerClient from '@/components/MoodDestinationPickerClient';
import TourCard from '@/components/TourCard';
import HotelCard from '@/components/HotelCard';
import FlightCard from '@/components/flights/FlightCard';
import type { FlightResult } from '@/components/flights/types';
import { MOCK_TOURS } from '@/data/tours';
import { hotels as MOCK_HOTELS } from '@/data/hotels';
import { MOCK_FLIGHTS, type Flight } from '@/data/flights';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

export const metadata = (): Metadata => ({
  title: 'İzgetour – Türkiye Turizm Platformu',
  description: "Türkiye'nin önde gelen turizm platformu.",
});

/** Adapt Flight (legacy mock) → FlightResult (unified) */
function toFlightResult(f: Flight): FlightResult {
  return {
    ...f,
    carrierCode: f.airlineCode,
    cabin: f.cabinClass as FlightResult['cabin'],
  };
}

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

      {/* ── Hero → Search transition ────────────────────── */}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/10 to-transparent pointer-events-none -mt-32" />
        <section className="py-14 sm:py-20 lg:py-24">
          <SmartSearch />
        </section>
      </div>

      {/* ── Features ─────────────────────────────────────── */}
      <Features />

      {/* ── Mood Destination Picker ──────────────────────── */}
      <section className="bg-gradient-to-b from-[var(--brand-light)] via-white to-white py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 sm:mb-12 text-center">
            <span className="mb-2 inline-block rounded-full bg-[var(--brand-light)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--brand)]">
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
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
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

      {/* ── Popular Hotels ────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        {/* Section header */}
        <div className="mb-8 sm:mb-14 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-2 inline-block rounded-full bg-[var(--brand-light)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--brand)]">
              {locale === 'tr' ? 'Konaklama' : 'Accommodation'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
              {locale === 'tr' ? 'Popüler Oteller' : 'Popular Hotels'}
            </h2>
            <p className="mt-2 text-[var(--muted)]">
              {locale === 'tr' ? 'En iyi otellerde unutulmaz konaklama deneyimi' : 'Unforgettable stays at the best hotels'}
            </p>
          </div>
          <Link
            href="/hotels"
            className="flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:underline"
          >
            {locale === 'tr' ? 'Tümünü Gör' : 'View All'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Hotel grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_HOTELS.slice(0, 3).map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} locale={locale as 'tr' | 'en'} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 sm:mt-14 text-center">
          <Link
            href="/hotels"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--brand)] px-8 py-3 font-semibold text-[var(--brand)] transition-all duration-200 hover:bg-[var(--brand)] hover:text-white"
          >
            {locale === 'tr' ? 'Tümünü Gör' : 'View All Hotels'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Popular Flights ──────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        {/* Section header */}
        <div className="mb-8 sm:mb-14 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-2 inline-block rounded-full bg-[var(--brand-light)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--brand)]">
              {locale === 'tr' ? 'Uçuşlar' : 'Flights'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
              {locale === 'tr' ? 'Popüler Uçuşlar' : 'Popular Flights'}
            </h2>
            <p className="mt-2 text-[var(--muted)]">
              {locale === 'tr' ? 'En uygun fiyatlarla dünyaya uçun' : 'Fly worldwide at the best prices'}
            </p>
          </div>
          <Link
            href="/flights"
            className="flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:underline"
          >
            {locale === 'tr' ? 'Tümünü Gör' : 'View All'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Flight grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_FLIGHTS.slice(0, 3).map((flight) => {
              const adapted = toFlightResult(flight);
              return <FlightCard key={flight.id} flight={adapted} />;
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 sm:mt-14 text-center">
          <Link
            href="/flights"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--brand)] px-8 py-3 font-semibold text-[var(--brand)] transition-all duration-200 hover:bg-[var(--brand)] hover:text-white"
          >
            {locale === 'tr' ? 'Tümünü Gör' : 'View All Flights'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
