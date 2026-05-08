import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import SearchWidget from '@/components/SearchWidget';
import TourCard from '@/components/TourCard';
import type { Metadata } from 'next';

export const metadata = (): Metadata => ({
  title: 'İzgetour – Türkiye Turizm Platformu',
  description: 'Türkiye\'nin önde gelen turizm platformu.',
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
    slug: 'istanbul-bus turu',
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
      {/* Hero */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center bg-[url('https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=1600&q=80')] bg-cover bg-center bg-no-repeat text-white">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">{t('title')}</h1>
          <p className="max-w-2xl text-xl text-zinc-200">{t('subtitle')}</p>
          <Link
            href="/tours"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#0066CC] px-8 py-4 text-lg font-semibold transition-colors hover:bg-[#0052a3]"
          >
            {t('cta')}
          </Link>
        </div>
      </section>

      {/* Search */}
      <section className="relative -mt-8 z-20 mx-auto max-w-4xl px-4">
        <SearchWidget />
      </section>

      {/* Popular Tours */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-zinc-900">{tTours('title')}</h2>
          <p className="mt-2 text-zinc-600">{tTours('subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_TOURS.map((tour) => (
            <TourCard key={tour.id} tour={tour} locale={locale as 'tr' | 'en'} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#0066CC] px-8 py-3 font-semibold text-[#0066CC] transition-colors hover:bg-[#0066CC] hover:text-white"
          >
            {tTours('viewAll')}
          </Link>
        </div>
      </section>
    </>
  );
}
