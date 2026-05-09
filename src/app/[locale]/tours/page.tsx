import { getTranslations } from 'next-intl/server';
import TourCard from '@/components/TourCard';
import TourFiltersWrapper from './TourFiltersWrapper';
import type { Metadata } from 'next';

export const metadata = (): Metadata => ({
  title: 'Turlar',
  description: 'Türkiye genelinde popüler turlar.',
});

export type TourItem = {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  duration: number;
  image: string;
  location: string;
  rating: number;
  category?: string;
};

export const ALL_TOURS: TourItem[] = [
  { id: '1', slug: 'kapadokya-gunu-birakti', title: 'Kapadokya Günübirlik Turu', titleEn: 'Cappadocia Day Tour', description: 'Peri bacaları, yeraltı şehirleri ve balon turu', descriptionEn: 'Fairy chimneys, underground cities and balloon tour', price: 1250, duration: 1, image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=800&q=80', location: 'Nevşehir', rating: 4.9, category: 'culture' },
  { id: '2', slug: 'efes-antik-kenti', title: 'Efes Antik Kenti Turu', titleEn: 'Ephesus Ancient City Tour', description: 'Dünyanın en iyi korunmuş antik şehirlerinden biri', descriptionEn: 'One of the best preserved ancient cities in the world', price: 890, duration: 1, image: 'https://images.unsplash.com/photo-1568810032-2e0f6e4c0e7b?w=800&q=80', location: 'İzmir', rating: 4.8, category: 'culture' },
  { id: '3', slug: 'pamukkale-gunubirlik', title: 'Pamukkale Günübirlik Turu', titleEn: 'Pamukkale Day Tour', description: 'Beyaz travertenler ve Hierapolis antik kenti', descriptionEn: 'White travertines and Hierapolis ancient city', price: 750, duration: 1, image: 'https://images.unsplash.com/photo-1600520186981-bc7e14c9c4e3?w=800&q=80', location: 'Denizli', rating: 4.9, category: 'nature' },
  { id: '4', slug: 'istanbul-bus-turu', title: 'İstanbul Bus Turu', titleEn: 'Istanbul Bus Tour', description: 'Tarihi yarımada, Boğaz ve ötesi', descriptionEn: 'Historic peninsula, Bosphorus and beyond', price: 650, duration: 1, image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80', location: 'İstanbul', rating: 4.7, category: 'city' },
  { id: '5', slug: 'antalya-kemer-turu', title: 'Antalya Kemer Turu', titleEn: 'Antalya Kemer Tour', description: 'Akdeniz sahilleri ve Olympos antik kenti', descriptionEn: 'Mediterranean coasts and Olympos ancient city', price: 950, duration: 1, image: 'https://images.unsplash.com/photo-1593352216840-1aee13f45818?w=800&q=80', location: 'Antalya', rating: 4.6, category: 'sea' },
  { id: '6', slug: 'anitkabir-ankara', title: 'Anıtkabir & Ankara Turu', titleEn: 'Anitkabir & Ankara Tour', description: 'Başkentin tarihi ve kültürel mirası', descriptionEn: 'The historical and cultural heritage of the capital', price: 550, duration: 1, image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80', location: 'Ankara', rating: 4.5, category: 'city' },
  { id: '7', slug: 'karadeniz-yaylalari', title: 'Karadeniz Yayla Turu', titleEn: 'Black Sea Highlands Tour', description: 'Yeşilin her tonu, yaylalar ve doğa harikaları', descriptionEn: 'Every shade of green, plateaus and natural wonders', price: 1800, duration: 3, image: 'https://images.unsplash.com/photo-1580734075808-8ee7d8c1a8b2?w=800&q=80', location: 'Trabzon', rating: 4.8, category: 'nature' },
  { id: '8', slug: 'bursa-uludag-turu', title: 'Bursa & Uludağ Turu', titleEn: 'Bursa & Uludag Tour', description: 'Osmanlı mirası ve doğa harikası Uludağ', descriptionEn: 'Ottoman heritage and natural wonder Uludag', price: 700, duration: 2, image: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=800&q=80', location: 'Bursa', rating: 4.7, category: 'nature' },
  { id: '9', slug: 'mardin-turu', title: 'Mardin Turu', titleEn: 'Mardin Tour', description: 'Taş sokaklar, tarihi hanlar ve eşsiz manzara', descriptionEn: 'Stone streets, historic inns and unique scenery', price: 1300, duration: 2, image: 'https://images.unsplash.com/photo-1580418827491-f2b22c0a68d2?w=800&q=80', location: 'Mardin', rating: 4.6, category: 'culture' },
];

export default async function ToursPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('tours');

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-zinc-900">{t('title')}</h1>
        <p className="mt-2 text-lg text-zinc-600">{t('subtitle')}</p>
      </div>
      <TourFiltersWrapper tours={ALL_TOURS} locale={locale as 'tr' | 'en'} />
    </div>
  );
}
