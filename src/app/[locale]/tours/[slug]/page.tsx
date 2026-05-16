import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import ItineraryTimeline from '@/components/TourDetail/ItineraryTimeline';
import ServiceInclusion from '@/components/TourDetail/ServiceInclusion';
import StickyBookingCard from '@/components/TourDetail/StickyBookingCard';
import SocialProofToastWrapper from '@/components/SocialProofToastWrapper';
import PartyPlan from '@/components/PartyPlan';
import CollaborativeTripBoard from '@/components/CollaborativeTripBoard';
import AncillaryManager from '@/components/Ancillary/AncillaryManager';
import VoiceInteractiveMap from '@/components/VoiceInteractiveMap';
import DynamicCuisineRecommender from '@/components/DynamicCuisineRecommender';
import SustainabilityScore from '@/components/SustainabilityScore';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import TourDetailClient from '@/components/TourDetailClient';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

type DayItinerary = {
  day: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  activities: string[];
  activitiesEn: string[];
};

type TourData = {
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
  inclusions: string[];
  inclusionsEn: string[];
  exclusions: string[];
  exclusionsEn: string[];
  itinerary: DayItinerary[];
  co2Emissions?: number; // kg CO2 per person per tour
};

const TOUR_MAP: Record<string, TourData> = {
  'kapadokya-gunu-birakti': {
    id: '1', slug: 'kapadokya-gunu-birakti',
    title: 'Kapadokya Günübirlik Turu', titleEn: 'Cappadocia Day Tour',
    description: 'Peri bacaları, yeraltı şehirleri ve balon turu',
    descriptionEn: 'Fairy chimneys, underground cities and balloon tour',
    longDescription: 'Kapadokya\'nın büyüleyici manzaralarını keşfedin. Göreme Açık Hava Müzesi, Derinkuyu Yeraltı Şehri ve Uçhisar Kalesi\'ni ziyaret edin.',
    longDescriptionEn: 'Discover the enchanting landscapes of Cappadocia. Visit Göreme Open Air Museum, Derinkuyu Underground City and Uçhisar Castle.',
    price: 1250, duration: 1,
    image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=1600&q=80',
    location: 'Nevşehir', rating: 4.9, co2Emissions: 45,
    highlights: ['Göreme Açık Hava Müzesi', 'Derinkuyu Yeraltı Şehri', 'Uçhisar Kalesi', 'Avanos Çömlek Atölyesi'],
    highlightsEn: ['Göreme Open Air Museum', 'Derinkuyu Underground City', 'Uçhisar Castle', 'Avanos Pottery Workshop'],
    inclusions: ['Otel Konaklama', 'Kahvaltı', 'Rehberlik Hizmeti', 'Transfer', 'Müze Giriş Ücretleri'],
    inclusionsEn: ['Hotel Accommodation', 'Breakfast', 'Guide Service', 'Transfer', 'Museum Entry Fees'],
    exclusions: ['Kişisel Harcamalar', 'Bahşiş', 'Öğle Yemeği', 'Balon Turu Ücreti'],
    exclusionsEn: ['Personal Expenses', 'Tips', 'Lunch', 'Balloon Tour Fee'],
    itinerary: [
      { day: 1, title: 'Varış ve Peri Bacaları', titleEn: 'Arrival & Fairy Chimneys',
        description: 'Sabah erken saatte Nevşehir\'e varış. İlk durak Göreme Açık Hava Müzesi ve peri bacaları. Öğleden sonra Derinkuyu Yeraltı Şehri turu.',
        descriptionEn: 'Early morning arrival in Nevşehir. First stop: Göreme Open Air Museum and fairy chimneys. Afternoon tour of Derinkuyu Underground City.',
        activities: ['Göreme Açık Hava Müzesi', 'Peri Bacaları Fotoğraf Molası', 'Derinkuyu Yeraltı Şehri', 'Avanos Çömlek Atölyesi'],
        activitiesEn: ['Göreme Open Air Museum', 'Fairy Chimneys Photo Stop', 'Derinkuyu Underground City', 'Avanos Pottery Workshop'] },
    ],
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
    inclusions: ['Rehberlik Hizmeti', 'Müze Giriş Ücretleri', 'Öğle Yemeği', 'Konaklama'],
    inclusionsEn: ['Guide Service', 'Museum Entry Fees', 'Lunch', 'Accommodation'],
    exclusions: ['Kişisel Harcamalar', 'Bahşiş', 'Ekstra Geziler'],
    exclusionsEn: ['Personal Expenses', 'Tips', 'Extra Tours'],
    itinerary: [
      { day: 1, title: 'Efes Turu', titleEn: 'Ephesus Tour',
        description: 'Sabah Selçuk\'ta buluşma. Efes Antik Kenti\'nde Celsus Kütüphanesi ve antik tiyatro ziyareti. Meryem Ana Evi ve Artemis Tapınağı gezisi.',
        descriptionEn: 'Morning meeting in Selçuk. Visit Library of Celsus and ancient theatre in Ephesus. Tour of House of Virgin Mary and Temple of Artemis.',
        activities: ['Celsus Kütüphanesi', 'Antik Tiyatro', 'Meryem Ana Evi', 'Artemis Tapınağı'],
        activitiesEn: ['Library of Celsus', 'Ancient Theatre', 'House of Virgin Mary', 'Temple of Artemis'] },
    ],
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
    inclusions: ['Rehberlik Hizmeti', 'Müze Giriş Ücretleri', 'Öğle Yemeği', 'Kleopatra Havuzu Giriş'],
    inclusionsEn: ['Guide Service', 'Museum Entry Fees', 'Lunch', 'Cleopatra Pool Entry'],
    exclusions: ['Kişisel Harcamalar', 'Bahşiş', 'Fotoğraf Çekim Ücreti'],
    exclusionsEn: ['Personal Expenses', 'Tips', 'Photography Fee'],
    itinerary: [
      { day: 1, title: 'Pamukkale Deneyimi', titleEn: 'Pamukkale Experience',
        description: 'Sabah Pamukkale travertenlerinde yürüyüş. Hierapolis antik kenti ziyareti. Kleopatra Havuzu\'nda yüzme molası.',
        descriptionEn: 'Morning walk on Pamukkale travertines. Hierapolis ancient city visit. Swimming break at Cleopatra Pool.',
        activities: ['Traverten Yürüyüşü', 'Hierapolis Gezisi', 'Kleopatra Havuzu', 'Antik Tiyatro'],
        activitiesEn: ['Travertine Walk', 'Hierapolis Tour', 'Cleopatra Pool', 'Ancient Theatre'] },
    ],
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
    inclusions: ['Rehberlik Hizmeti', 'Müze Giriş Ücretleri', 'Öğle Yemeği', 'Boğaz Turu'],
    inclusionsEn: ['Guide Service', 'Museum Entry Fees', 'Lunch', 'Bosphorus Tour'],
    exclusions: ['Kişisel Harcamalar', 'Bahşiş', 'Alışveriş'],
    exclusionsEn: ['Personal Expenses', 'Tips', 'Shopping'],
    itinerary: [
      { day: 1, title: 'Tarihi Yarımada Turu', titleEn: 'Historic Peninsula Tour',
        description: 'Sultanahmet Meydanı\'nda buluşma. Ayasofya, Sultanahmet Camii ve Topkapı Sarayı ziyareti. Öğle yemeği sonrası Kapalıçarşı ve Boğaz turu.',
        descriptionEn: 'Meeting at Sultanahmet Square. Visit Hagia Sophia, Sultanahmet Mosque and Topkapi Palace. Afternoon Grand Bazaar and Bosphorus tour.',
        activities: ['Ayasofya', 'Sultanahmet Camii', 'Topkapı Sarayı', 'Kapalıçarşı & Boğaz'],
        activitiesEn: ['Hagia Sophia', 'Sultanahmet Mosque', 'Topkapi Palace', 'Grand Bazaar & Bosphorus'] },
    ],
  },
  'antalya-kemer-turu': {
    id: '5', slug: 'antalya-kemer-turu',
    title: 'Antalya Kemer Turu', titleEn: 'Antalya Kemer Tour',
    description: 'Akdeniz sahilleri ve Olympos antik kenti',
    descriptionEn: 'Mediterranean coasts and Olympos ancient city',
    longDescription: 'Antalya\'nın masmavi sahillerini ve antik Olympos kentini keşfedin. Yanartaş doğa harikası da sizi bekliyor.',
    longDescriptionEn: 'Discover the azure coasts of Antalya and ancient Olympos city. The natural wonder of Yanartaş also awaits you.',
    price: 950, duration: 2,
    image: 'https://images.unsplash.com/photo-1593352216840-1aee13f45818?w=1600&q=80',
    location: 'Antalya', rating: 4.6,
    highlights: ['Olympos Antik Kenti', 'Yanartaş (Chimaera)', 'Cirali Sahili', 'Tahtalı Dağı Manzarası'],
    highlightsEn: ['Olympos Ancient City', 'Yanartaş (Chimaera)', 'Cirali Beach', 'Tahtalı Mountain View'],
    inclusions: ['Otel Konaklama', 'Kahvaltı', 'Rehberlik Hizmeti', 'Transfer'],
    inclusionsEn: ['Hotel Accommodation', 'Breakfast', 'Guide Service', 'Transfer'],
    exclusions: ['Kişisel Harcamalar', 'Bahşiş', 'Öğle Yemeği', 'Teleferik Ücreti'],
    exclusionsEn: ['Personal Expenses', 'Tips', 'Lunch', 'Cable Car Fee'],
    itinerary: [
      { day: 1, title: 'Olympos ve Yanartaş', titleEn: 'Olympos & Chimaera',
        description: 'Sabah Olympos antik kenti ziyareti. Cirali sahili\'nde serbest zaman. Akşam Yanartaş\'ta gün batımı yürüyüşü.',
        descriptionEn: 'Morning visit to Olympos ancient city. Free time at Cirali Beach. Sunset hike at Chimaera.',
        activities: ['Olympos Antik Kenti', 'Cirali Sahili', 'Yanartaş Yürüyüşü', 'Gün Batımı Fotoğrafı'],
        activitiesEn: ['Olympos Ancient City', 'Cirali Beach', 'Chimaera Hike', 'Sunset Photography'] },
      { day: 2, title: 'Tahtalı Dağı ve Kemer', titleEn: 'Tahtalı Mountain & Kemer',
        description: 'Sabah Tahtalı Dağı teleferik turu. Öğleden sonra Kemer Marina\'da serbest zaman.',
        descriptionEn: 'Morning cable car tour to Tahtalı Mountain. Free afternoon at Kemer Marina.',
        activities: ['Tahtalı Dağı Teleferik', 'Kemer Marina', 'Lara Plajı', 'Dönüş Transferi'],
        activitiesEn: ['Tahtalı Cable Car', 'Kemer Marina', 'Lara Beach', 'Return Transfer'] },
    ],
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
    inclusions: ['Rehberlik Hizmeti', 'Müze Giriş Ücretleri', 'Öğle Yemeği', 'Transfer'],
    inclusionsEn: ['Guide Service', 'Museum Entry Fees', 'Lunch', 'Transfer'],
    exclusions: ['Kişisel Harcamalar', 'Bahşiş', 'Ekstra Geziler'],
    exclusionsEn: ['Personal Expenses', 'Tips', 'Extra Tours'],
    itinerary: [
      { day: 1, title: 'Ankara Turu', titleEn: 'Ankara Tour',
        description: 'Sabah Anıtkabir ziyareti. Anadolu Medeniyetleri Müzesi gezisi. Ankara Kalesi ve Ulus meydanı turu.',
        descriptionEn: 'Morning visit to Anitkabir. Museum of Anatolian Civilizations tour. Ankara Castle and Ulus Square tour.',
        activities: ['Anıtkabir Ziyareti', 'Anadolu Medeniyetleri Müzesi', 'Ankara Kalesi', 'Ulus Meydanı'],
        activitiesEn: ['Anitkabir Visit', 'Anatolian Civilizations Museum', 'Ankara Castle', 'Ulus Square'] },
    ],
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
    <TourDetailClient
      item={{
        id: tour.id,
        type: 'tour',
        title: tour.title,
        titleEn: tour.titleEn,
        slug: tour.slug,
      }}
      locale={locale}
    >
      {/* Breadcrumb */}
      <BreadcrumbNav
        items={[
          { label: t('title'), href: '/tours' },
          { label: title },
        ]}
      />
      <div className="mx-auto max-w-5xl px-4 py-8 pb-24 lg:pb-12">
        {/* Main content grid: content + sidebar */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left: Main Content (2/3) */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
              <div className="relative aspect-[16/7] overflow-hidden">
                <Image src={tour.image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
              </div>
              <div className="p-6 sm:p-8">
                <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">{title}</h1>
                <p className="mt-3 text-base leading-relaxed text-zinc-600 sm:text-lg">{longDesc}</p>

                {/* Info Cards */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                  {[
                    { label: locale === 'tr' ? 'Lokasyon' : 'Location', value: tour.location },
                    { label: locale === 'tr' ? 'Süre' : 'Duration', value: `${tour.duration} ${t('days')}` },
                    { label: locale === 'tr' ? 'Puan' : 'Rating', value: `⭐ ${tour.rating}` },
                    { label: locale === 'tr' ? 'Fiyat' : 'Price', value: `₺${tour.price.toLocaleString()}` },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-zinc-50 p-3 text-center sm:p-4">
                      <div className="text-xs text-zinc-500">{item.label}</div>
                      <div className="mt-1 text-sm font-semibold text-zinc-900 sm:text-base">{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Tour Highlights */}
                <div className="mt-8">
                  <h2 className="mb-4 text-lg font-bold text-zinc-900 sm:text-xl">
                    {locale === 'tr' ? 'Tur Özeti' : 'Tour Highlights'}
                  </h2>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm text-zinc-700 sm:text-base">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#0066CC]" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Itinerary Timeline */}
            <div className="mt-8">
              <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
                <h2 className="mb-6 text-lg font-bold text-zinc-900 sm:text-xl">
                  {locale === 'tr' ? 'Tur Programı' : 'Tour Itinerary'}
                </h2>
                <ItineraryTimeline itinerary={tour.itinerary} locale={locale} />
              </div>
            </div>

            {/* Service Inclusions */}
            <div className="mt-8">
              <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
                <h2 className="mb-6 text-lg font-bold text-zinc-900 sm:text-xl">
                  {locale === 'tr' ? 'Hizmet Detayları' : 'Service Details'}
                </h2>
                <ServiceInclusion
                  inclusions={locale === 'tr' ? tour.inclusions : tour.inclusionsEn}
                  exclusions={locale === 'tr' ? tour.exclusions : tour.exclusionsEn}
                  locale={locale}
                />
              </div>
            </div>

            {/* Karbon Ayak İzi */}
            <div className="mt-8">
              <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
                <h2 className="mb-4 text-lg font-bold text-zinc-900 sm:text-xl">
                  {locale === 'tr' ? 'Karbon Ayak İzi' : 'Carbon Footprint'}
                </h2>
                <SustainabilityScore
                  co2Emissions={tour.co2Emissions ?? 50}
                  averageEmissions={80}
                  ecoFriendly={(tour.co2Emissions ?? 50) < 60}
                  variant="card"
                />
              </div>
            </div>

            {/* Sesli Rehber Haritası */}
            <div className="mt-8">
              <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
                <h2 className="mb-4 text-lg font-bold text-zinc-900 sm:text-xl">
                  {locale === 'tr' ? 'Sesli Rehber Haritası' : 'Voice-Guided Map'}
                </h2>
                <p className="text-sm text-zinc-500 mb-4">
                  {locale === 'tr'
                    ? 'Haritadaki noktalara tıklayarak tur lokasyonları hakkında sesli bilgi alın.'
                    : 'Click on map markers to hear voice narration about tour locations.'}
                </p>
                <VoiceInteractiveMap locale={locale} />
              </div>
            </div>

            {/* Lokal Lezzet Rehberi */}
            <div className="mt-8">
              <DynamicCuisineRecommender destination={tour.location} locale={locale} />
            </div>

            {/* Sosyal Seyahat Grubu (Party Plan) */}
            <div className="mt-8">
              <PartyPlan locale={locale as 'tr' | 'en'} />
            </div>

            {/* Ortak Seyahat Panosu */}
            <div className="mt-8">
              <CollaborativeTripBoard locale={locale as 'tr' | 'en'} />
            </div>

            {/* Ek Hizmetler */}
            <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
              <AncillaryManager flow="tour" />
            </div>
          </div>

          {/* Right: Sticky Booking Sidebar (1/3) */}
          <div className="mt-6 lg:mt-0">
            <StickyBookingCard price={tour.price} locale={locale} />
          </div>
        </div>
      </div>

      {/* Social Proof Toast */}
      <SocialProofToastWrapper />
    </TourDetailClient>
  );
}
