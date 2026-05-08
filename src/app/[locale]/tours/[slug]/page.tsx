import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const TOUR_MAP: Record<string, {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  longDescription: string;
  longDescriptionEn: string;
  price: number;
  duration: number;
  image: string;
  location: string;
  rating: number;
  highlights: string[];
  highlightsEn: string[];
}> = {
  'kapadokya-gunu-birakti': {
    id: '1', slug: 'kapadokya-gunu-birakti',
    title: 'Kapadokya Günübirlik Turu', titleEn: 'Cappadocia Day Tour',
    description: 'Peri bacaları, yeraltı şehirleri ve balon turu',
    descriptionEn: 'Fairy chimneys, underground cities and balloon tour',
    longDescription: 'Kapadokya\'nın büyüleyici manzaralarını keşfedin. Göreme Açık Hava Müzesi, Derinkuyu Yeraltı Şehri ve Uçhisar Kalesi\'ni ziyaret edin.',
    longDescriptionEn: 'Discover the enchanting landscapes of Cappadocia. Visit Göreme Open Air Museum, Derinkuyu Underground City and Uçhisar Castle.',
    price: 1250, duration: 1,
    image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=1600&q=80',
    location: 'Nevşehir', rating: 4.9,
    highlights: ['Göreme Açık Hava Müzesi', 'Derinkuyu Yeraltı Şehri', 'Uçhisar Kalesi', 'Avanos Çömlek Atölyesi'],
    highlightsEn: ['Göreme Open Air Museum', 'Derinkuyu Underground City', 'Uçhisar Castle', 'Avanos Pottery Workshop'],
  },
  'efes-antik-kenti': {
    id: '2', slug: 'efes-antik-kenti',
    title: 'Efes Antik Kenti Turu', titleEn: 'Ephesus Ancient City Tour',
    description: 'Dünyanın en iyi korunmuş antik şehirlerinden biri',
    descriptionEn: 'One of the best preserved ancient cities in the world',
    longDescription: 'Roma döneminin en görkemli şehirlerinden birini keşfedin. Celsus Kütüphanesi, antik tiyatro ve Meryem Ana Evi sizi bekliyor.',
    longDescriptionEn: 'Discover one of the most magnificent cities of the Roman period. The Library of Celsus, ancient theater and House of Virgin Mary await you.',
    price: 890, duration: 1,
    image: 'https://images.unsplash.com/photo-1568810032-2e0f6e4c0e7b?w=1600&q=80',
    location: 'İzmir', rating: 4.8,
    highlights: ['Celsus Kütüphanesi', 'Antik Tiyatro', 'Meryem Ana Evi', 'Artemis Tapınağı'],
    highlightsEn: ['Library of Celsus', 'Ancient Theatre', 'House of Virgin Mary', 'Temple of Artemis'],
  },
  'pamukkale-gunubirlik': {
    id: '3', slug: 'pamukkale-gunubirlik',
    title: 'Pamukkale Günübirlik Turu', titleEn: 'Pamukkale Day Tour',
    description: 'Beyaz travertenler ve Hierapolis antik kenti',
    descriptionEn: 'White travertines and Hierapolis ancient city',
    longDescription: 'UNESCO Dünya Mirası listesindeki Pamukkale travertenlerini ve antik Hierapolis kentini ziyaret edin.',
    longDescriptionEn: 'Visit the UNESCO World Heritage listed Pamukkale travertines and ancient Hierapolis city.',
    price: 750, duration: 1,
    image: 'https://images.unsplash.com/photo-1600520186981-bc7e14c9c4e3?w=1600&q=80',
    location: 'Denizli', rating: 4.9,
    highlights: ['Pamukkale Travertenleri', 'Hierapolis Antik Kenti', 'Kleopatra Havuzu', 'Antik Tiyatro'],
    highlightsEn: ['Pamukkale Travertines', 'Hierapolis Ancient City', 'Cleopatra Pool', 'Ancient Theatre'],
  },
  'istanbul-bus-turu': {
    id: '4', slug: 'istanbul-bus-turu',
    title: 'İstanbul Bus Turu', titleEn: 'Istanbul Bus Tour',
    description: 'Tarihi yarımada, Boğaz ve ötesi',
    descriptionEn: 'Historic peninsula, Bosphorus and beyond',
    longDescription: 'İstanbul\'un eşsiz güzelliklerini konforlu bir şehir turuyla keşfedin. Ayasofya, Topkapı Sarayı ve Sultanahmet Camii.',
    longDescriptionEn: 'Discover the unique beauty of Istanbul with a comfortable city tour. Hagia Sophia, Topkapi Palace and Sultanahmet Mosque.',
    price: 650, duration: 1,
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&q=80',
    location: 'İstanbul', rating: 4.7,
    highlights: ['Ayasofya', 'Sultanahmet Camii', 'Topkapı Sarayı', 'Kapalıçarşı'],
    highlightsEn: ['Hagia Sophia', 'Sultanahmet Mosque', 'Topkapi Palace', 'Grand Bazaar'],
  },
  'antalya-kemer-turu': {
    id: '5', slug: 'antalya-kemer-turu',
    title: 'Antalya Kemer Turu', titleEn: 'Antalya Kemer Tour',
    description: 'Akdeniz sahilleri ve Olympos antik kenti',
    descriptionEn: 'Mediterranean coasts and Olympos ancient city',
    longDescription: 'Antalya\'nın masmavi sahillerini ve antik Olympos kentini keşfedin. Yanartaş doğa harikası da sizi bekliyor.',
    longDescriptionEn: 'Discover the azure coasts of Antalya and ancient Olympos city. The natural wonder of Yanartaş also awaits you.',
    price: 950, duration: 1,
    image: 'https://images.unsplash.com/photo-1593352216840-1aee13f45818?w=1600&q=80',
    location: 'Antalya', rating: 4.6,
    highlights: ['Olympos Antik Kenti', 'Yanartaş (Chimaera)', 'Cirali Sahili', 'Tahtalı Dağı Manzarası'],
    highlightsEn: ['Olympos Ancient City', 'Yanartaş (Chimaera)', 'Cirali Beach', 'Tahtalı Mountain View'],
  },
  'anitkabir-ankara': {
    id: '6', slug: 'anitkabir-ankara',
    title: 'Anıtkabir & Ankara Turu', titleEn: 'Anitkabir & Ankara Tour',
    description: 'Başkentin tarihi ve kültürel mirası',
    descriptionEn: 'The historical and cultural heritage of the capital',
    longDescription: 'Türkiye\'nin başkentinin en önemli tarihi ve kültürel noktalarını ziyaret edin.',
    longDescriptionEn: 'Visit the most important historical and cultural landmarks of Turkey\'s capital.',
    price: 550, duration: 1,
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1600&q=80',
    location: 'Ankara', rating: 4.5,
    highlights: ['Anıtkabir', 'Anadolu Medeniyetleri Müzesi', 'Kalesite', 'Ulus Meydanı'],
    highlightsEn: ['Anitkabir', 'Museum of Anatolian Civilizations', 'Kalesite', 'Ulus Square'],
  },
};

export async function generateStaticParams() {
  return Object.values(TOUR_MAP).map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const tour = TOUR_MAP[slug];
  if (!tour) return {};
  const title = locale === 'tr' ? tour.title : tour.titleEn;
  return { title, description: locale === 'tr' ? tour.description : tour.descriptionEn };
}

export default async function TourDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const tour = TOUR_MAP[slug];
  if (!tour) notFound();

  const t = await getTranslations('tours');
  const title = locale === 'tr' ? tour.title : tour.titleEn;
  const longDesc = locale === 'tr' ? tour.longDescription : tour.longDescriptionEn;
  const highlights = locale === 'tr' ? tour.highlights : tour.highlightsEn;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="relative aspect-[16/7] overflow-hidden">
          <Image src={tour.image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
        </div>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-zinc-900">{title}</h1>
          <p className="mt-3 text-lg text-zinc-600">{longDesc}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: locale === 'tr' ? 'Lokasyon' : 'Location', value: tour.location },
              { label: locale === 'tr' ? 'Süre' : 'Duration', value: `${tour.duration} ${t('days')}` },
              { label: locale === 'tr' ? 'Puan' : 'Rating', value: `⭐ ${tour.rating}` },
              { label: locale === 'tr' ? 'Fiyat' : 'Price', value: `₺${tour.price.toLocaleString()}` },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-zinc-50 p-4 text-center">
                <div className="text-xs text-zinc-500">{item.label}</div>
                <div className="mt-1 font-semibold text-zinc-900">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-zinc-900">{locale === 'tr' ? 'Tur Özeti' : 'Tour Highlights'}</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-zinc-700">
                  <span className="h-2 w-2 rounded-full bg-[#0066CC]" />{h}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex items-center justify-between rounded-xl bg-[#0066CC]/5 p-6">
            <div>
              <div className="text-sm text-zinc-500">{t('perPerson')}</div>
              <div className="text-2xl font-bold text-[#0066CC]">₺{tour.price.toLocaleString()}</div>
            </div>
            <button className="rounded-full bg-[#0066CC] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#0052a3]">
              {locale === 'tr' ? 'Rezervasyon Yap' : 'Make Reservation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
