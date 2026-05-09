import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import SearchWidget from '@/components/SearchWidget';
import TourCard from '@/components/TourCard';
import type { Metadata } from 'next';
import { ArrowRight, Shield, Headphones, Award } from 'lucide-react';

export const metadata = (): Metadata => ({
  title: 'İzgetour – Türkiye Turizm Platformu',
  description: "Türkiye'nin önde gelen turizm platformu.",
});

const MOCK_TOURS = [
  {
    id: '1',
    slug: 'kapadokya-gunu-birakti',
    title: 'Kapadokya Günübirlik Turu',
    titleEn: 'Cappadocia Day Tour',
    description: 'Peri bacaları, yeraltı şehirleri ve balon turu',
    descriptionEn: 'Fairy chimneys, underground cities and balloon tour',
    price: 1250,
    duration: 1,
    image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=800&q=80',
    location: 'Nevşehir',
    rating: 4.9,
  },
  {
    id: '2',
    slug: 'efes-antik-kenti',
    title: 'Efes Antik Kenti Turu',
    titleEn: 'Ephesus Ancient City Tour',
    description: 'Dünyanın en iyi korunmuş antik şehirlerinden biri',
    descriptionEn: 'One of the best preserved ancient cities in the world',
    price: 890,
    duration: 1,
    image: 'https://images.unsplash.com/photo-1568810032-2e0f6e4c0e7b?w=800&q=80',
    location: 'İzmir',
    rating: 4.8,
  },
  {
    id: '3',
    slug: 'pamukkale-gunubirlik',
    title: 'Pamukkale Günübirlik Turu',
    titleEn: 'Pamukkale Day Tour',
    description: 'Beyaz travertenler ve Hierapolis antik kenti',
    descriptionEn: 'White travertines and Hierapolis ancient city',
    price: 750,
    duration: 1,
    image: 'https://images.unsplash.com/photo-1600520186981-bc7e14c9c4e3?w=800&q=80',
    location: 'Denizli',
    rating: 4.9,
  },
  {
    id: '4',
    slug: 'istanbul-bus-turu',
    title: 'İstanbul Bus Turu',
    titleEn: 'Istanbul Bus Tour',
    description: 'Tarihi yarımada, Boğaz ve ötesi',
    descriptionEn: 'Historic peninsula, Bosphorus and beyond',
    price: 650,
    duration: 1,
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
    location: 'İstanbul',
    rating: 4.7,
  },
  {
    id: '5',
    slug: 'antalya-kemer-turu',
    title: 'Antalya Kemer Turu',
    titleEn: 'Antalya Kemer Tour',
    description: 'Akdeniz sahilleri ve Olympos antik kenti',
    descriptionEn: 'Mediterranean coasts and Olympos ancient city',
    price: 950,
    duration: 1,
    image: 'https://images.unsplash.com/photo-1593352216840-1aee13f45818?w=800&q=80',
    location: 'Antalya',
    rating: 4.6,
  },
  {
    id: '6',
    slug: 'anitkabir-ankara',
    title: 'Anıtkabir & Ankara Turu',
    titleEn: 'Anitkabir & Ankara Tour',
    description: 'Başkentin tarihi ve kültürel mirası',
    descriptionEn: 'The historical and cultural heritage of the capital',
    price: 550,
    duration: 1,
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80',
    location: 'Ankara',
    rating: 4.5,
  },
];

const TRUST_ITEMS = [
  { icon: Shield, labelTr: 'Güvenli Ödeme', labelEn: 'Secure Payment' },
  { icon: Headphones, labelTr: '7/24 Destek', labelEn: '24/7 Support' },
  { icon: Award, labelTr: '10+ Yıl Deneyim', labelEn: '10+ Years Experience' },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('hero');
  const tTours = await getTranslations('tours');

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=1600&q=80')] bg-cover bg-center bg-no-repeat text-white">
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
          {/* Pill badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            {locale === 'tr' ? '1000+ Mutlu Gezgin' : '1000+ Happy Travelers'}
          </span>

          <h1 className="max-w-4xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            {t('title')}
          </h1>

          <p className="max-w-2xl text-lg text-white/80 sm:text-xl">
            {t('subtitle')}
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-200 hover:bg-[var(--brand-dark)] hover:shadow-xl hover:-translate-y-0.5"
            >
              {t('cta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
            >
              {locale === 'tr' ? 'Hakkımızda' : 'Learn More'}
            </Link>
          </div>
        </div>

        {/* Trust bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="mx-auto flex max-w-4xl items-center justify-center gap-8 px-4 py-4 sm:gap-16">
            {TRUST_ITEMS.map(({ icon: Icon, labelTr, labelEn }) => (
              <div key={labelTr} className="flex items-center gap-2 text-white/80">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium">
                  {locale === 'tr' ? labelTr : labelEn}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Search ───────────────────────────────────────── */}
      <section className="relative -mt-6 z-20 mx-auto max-w-4xl px-4 sm:px-6">
        <SearchWidget />
      </section>

      {/* ── Popular Tours ─────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-14 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-2 inline-block rounded-full bg-[var(--brand-light)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--brand)]">
              {locale === 'tr' ? 'Öne Çıkanlar' : 'Featured'}
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl">
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

        {/* Tour grid — equal-height cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_TOURS.map((tour) => (
            <TourCard key={tour.id} tour={tour} locale={locale as 'tr' | 'en'} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
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
