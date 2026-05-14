'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

// ------------------------------------------------------------------ //
// Micro-Adventure Generator
// 1-2 günlük, yakın mesafe, düşük bütçeli "kaçamak" önerileri.
// Gen-Z ve remote worker segmentine yönelik, lokasyon bazlı hızlı arama.
// Kayak "Explore" konseptine benzer, tek seferde fikir veren bir landing.
// ------------------------------------------------------------------ //

type Vibe = 'nature' | 'culture' | 'food' | 'adventure' | 'relax' | 'digital-detox';

interface MicroTrip {
  id: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  vibe: Vibe;
  duration: string;
  durationEn: string;
  budget: string;
  budgetEn: string;
  distance: string;
  emoji: string;
  highlights: string[];
  highlightsEn: string[];
  tags: string[];
}

const VIBE_LABELS_TR: Record<Vibe, string> = {
  nature: 'Doğa',
  culture: 'Kültür',
  food: 'Lezzet',
  adventure: 'Macera',
  relax: 'Dinlenme',
  'digital-detox': 'Dijital Detoks',
};

const VIBE_LABELS_EN: Record<Vibe, string> = {
  nature: 'Nature',
  culture: 'Culture',
  food: 'Food',
  adventure: 'Adventure',
  relax: 'Relax',
  'digital-detox': 'Digital Detox',
};

const STRINGS = {
  tr: {
    sectionLabel: 'İzgetour Micro',
    heading: "Hafta Sonu",
    headingHighlight: "Kaçamağı",
    subtitle1: "1-2 günlük, yakın mesafe, düşük bütçeli mikro maceralar.",
    subtitle2: "Şehirden kaç, doğaya, tarihe veya lezzete koş.",
    allLabel: "🎯 Tümü",
    resultLabel: "kaçamak bulundu",
    exploreLabel: "Keşfet →",
  },
  en: {
    sectionLabel: 'Izgetour Micro',
    heading: "Weekend",
    headingHighlight: "Getaway",
    subtitle1: "1-2 day, near distance, low-budget micro adventures.",
    subtitle2: "Escape the city, run to nature, history or flavors.",
    allLabel: "🎯 All",
    resultLabel: "getaways found",
    exploreLabel: "Explore →",
  },
};

const ALL_TRIPS: MicroTrip[] = [
  {
    id: '1',
    title: 'Sapanca Göl Kenarı Kaçamağı',
    titleEn: 'Sapanca Lake Side Getaway',
    subtitle: 'İstanbul\'a 1.5 saat, huzura 1 adım',
    subtitleEn: '1.5 hours from Istanbul, one step to serenity',
    vibe: 'nature',
    duration: '1 Gün',
    durationEn: '1 Day',
    budget: '₺800-1500',
    budgetEn: '₺800-1500',
    distance: '130 km',
    emoji: '🌲',
    highlights: ['Göl manzaralı kahvaltı', 'Doğa yürüyüşü', 'Lokanta keyfi', 'Fotoğraf rotası'],
    highlightsEn: ['Lake-view breakfast', 'Nature walk', 'Restaurant experience', 'Photo route'],
    tags: ['istanbul', 'marmara', 'doğa'],
  },
  {
    id: '2',
    title: 'Efes Antik Kent Günübirlik',
    titleEn: 'Ephesus Ancient City Day Trip',
    subtitle: 'Tarihin kalbinde bir gün',
    subtitleEn: 'A day in the heart of history',
    vibe: 'culture',
    duration: '1 Gün',
    durationEn: '1 Day',
    budget: '₺600-1200',
    budgetEn: '₺600-1200',
    distance: '80 km',
    emoji: '🏛️',
    highlights: ['Antik tiyatro', 'Celsus Kütüphanesi', 'Şirince köyü molası'],
    highlightsEn: ['Ancient theatre', 'Library of Celsus', 'Şirince village stop'],
    tags: ['izmir', 'ege', 'tarih'],
  },
  {
    id: '3',
    title: 'Gaziantep Sokak Lezzetleri Turu',
    titleEn: 'Gaziantep Street Food Tour',
    subtitle: 'Baklava ve kahve için 48 saat',
    subtitleEn: '48 hours for baklava and coffee',
    vibe: 'food',
    duration: '2 Gün 1 Gece',
    durationEn: '2 Days 1 Night',
    budget: '₺2000-3500',
    budgetEn: '₺2000-3500',
    distance: '200 km',
    emoji: '🍽️',
    highlights: ['Baklava atölyesi', 'Kahvaltı geleneği', 'Bakırcılar çarşısı', 'Gece turu'],
    highlightsEn: ['Baklava workshop', 'Breakfast tradition', 'Bakırcılar bazaar', 'Night tour'],
    tags: ['gaziantep', 'güneydoğu', 'yemek'],
  },
  {
    id: '4',
    title: 'Kız Kulesi\'ne Yüzme Macerası',
    titleEn: 'Swim to Maiden\'s Tower Adventure',
    subtitle: 'Boğaz\'da unutulmaz bir gün',
    subtitleEn: 'An unforgettable day on the Bosphorus',
    vibe: 'adventure',
    duration: '1 Gün',
    durationEn: '1 Day',
    budget: '₺1500-2500',
    budgetEn: '₺1500-2500',
    distance: '0 km (şehir içi)',
    emoji: '🏊',
    highlights: ['Kız Kulesi\'ne yüzüş', 'Boğaz manzarası', 'Özel eğitmen eşliğinde'],
    highlightsEn: ['Swim to Maiden\'s Tower', 'Bosphorus view', 'With private instructor'],
    tags: ['istanbul', 'marmara', 'spor'],
  },
  {
    id: '5',
    title: 'Karaburun Sakin Kaçamak',
    titleEn: 'Karaburun Peaceful Escape',
    subtitle: 'Deniz, zeytinlik ve sessizlik',
    subtitleEn: 'Sea, olive groves and silence',
    vibe: 'relax',
    duration: '2 Gün 1 Gece',
    durationEn: '2 Days 1 Night',
    budget: '₺1200-2000',
    budgetEn: '₺1200-2000',
    distance: '90 km',
    emoji: '🌿',
    highlights: ['Zeytinlikler arası yürüyüş', 'Köy kahvaltısı', 'Gün batımı izleme'],
    highlightsEn: ['Walk through olive groves', 'Village breakfast', 'Sunset watching'],
    tags: ['izmir', 'ege', 'huzur'],
  },
  {
    id: '6',
    title: 'Cunda Adası Tekne Kaçamağı',
    titleEn: 'Cunda Island Boat Escape',
    subtitle: 'Adalarda wifi yok, huzur var',
    subtitleEn: 'No wifi on islands, only peace',
    vibe: 'digital-detox',
    duration: '2 Gün 1 Gece',
    durationEn: '2 Days 1 Night',
    budget: '₺1000-1800',
    budgetEn: '₺1000-1800',
    distance: '170 km',
    emoji: '📵',
    highlights: ['Telefon kapama ritüeli', 'Tekne turu', 'Taş evlerde konaklama'],
    highlightsEn: ['Phone-off ritual', 'Boat tour', 'Stone house stay'],
    tags: ['balıkesir', 'ege', 'ada'],
  },
  {
    id: '7',
    title: 'Hattuşaş Antik Başkent',
    titleEn: 'Hattusa Ancient Capital',
    subtitle: 'Hititlerin izinde 24 saat',
    subtitleEn: '24 hours following the Hittites',
    vibe: 'culture',
    duration: '1 Gün',
    durationEn: '1 Day',
    budget: '₺700-1300',
    budgetEn: '₺700-1300',
    distance: '200 km',
    emoji: '🗿',
    highlights: ['Açık hava müzesi', 'Aslanlı Kapı', 'Yeraltı tünelleri'],
    highlightsEn: ['Open-air museum', 'Sphinx Gate', 'Underground tunnels'],
    tags: ['çorum', 'iç anadolu', 'tarih'],
  },
  {
    id: '8',
    title: 'Abant Gölü Doğa Kampı',
    titleEn: 'Abant Lake Nature Camp',
    subtitle: 'Şehirden uzak, doğaya yakın',
    subtitleEn: 'Far from city, close to nature',
    vibe: 'nature',
    duration: '2 Gün 1 Gece',
    durationEn: '2 Days 1 Night',
    budget: '₺1500-2500',
    budgetEn: '₺1500-2500',
    distance: '160 km',
    emoji: '⛺',
    highlights: ['Kamp kurulumu', 'Göl kenarında akşam yemeği', 'Yıldız gözlemi'],
    highlightsEn: ['Camp setup', 'Lakeside dinner', 'Stargazing'],
    tags: ['bolu', 'karadeniz', 'kamp'],
  },
];

function VibePill({ vibe, active, onClick, locale }: { vibe: Vibe; active: boolean; onClick: () => void; locale: 'tr' | 'en' }) {
  const vibeLabels = locale === 'tr' ? VIBE_LABELS_TR : VIBE_LABELS_EN;
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
        ${active
          ? 'bg-indigo-600 text-white shadow-lg scale-105'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
        }`}
      aria-pressed={active}
    >
      {vibe === 'digital-detox' ? '📵 ' : ''}{vibeLabels[vibe]}
    </button>
  );
}

function TripCard({ trip, locale }: { trip: MicroTrip; locale: 'tr' | 'en' }) {
  const isTr = locale === 'tr';
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700
      hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      {/* Emoji Hero */}
      <div className="h-36 flex items-center justify-center text-6xl bg-gradient-to-br from-indigo-50 to-purple-50
        dark:from-gray-700 dark:to-gray-800 group-hover:scale-110 transition-transform duration-500">
        {trip.emoji}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30
            px-2 py-1 rounded-full">{isTr ? trip.duration : trip.durationEn}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{trip.distance}</span>
        </div>

        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
          {isTr ? trip.title : trip.titleEn}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {isTr ? trip.subtitle : trip.subtitleEn}
        </p>

        {/* Highlights */}
        <div className="space-y-1 mb-4">
          {(isTr ? trip.highlights : trip.highlightsEn).map((h, i) => (
            <p key={i} className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-indigo-400 inline-block shrink-0" />
              {h}
            </p>
          ))}
        </div>

        {/* Budget + Tags */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {isTr ? trip.budget : trip.budgetEn}
          </span>
          <Link
            href={`/micro-adventure/${trip.id}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400
              group-hover:underline underline-offset-2"
          >
            {isTr ? 'Keşfet →' : 'Explore →'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MicroAdventurePage() {
  const locale = useLocale() as 'tr' | 'en';
  const isTr = locale === 'tr';
  const s = isTr ? STRINGS.tr : STRINGS.en;
  const vibeLabels = isTr ? VIBE_LABELS_TR : VIBE_LABELS_EN;
  const [activeVibe, setActiveVibe] = useState<Vibe | null>(null);

  const filtered = useMemo(() => {
    if (!activeVibe) return ALL_TRIPS;
    return ALL_TRIPS.filter((t) => t.vibe === activeVibe);
  }, [activeVibe]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center">
            <p className="text-sm font-medium text-indigo-200 mb-2 tracking-widest uppercase">{s.sectionLabel}</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {s.heading} <span className="text-yellow-300">{s.headingHighlight}</span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto">
              {s.subtitle1}
              <br className="hidden md:block" />
              {s.subtitle2}
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setActiveVibe(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${!activeVibe ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}
            >
              {s.allLabel}
            </button>
            {(Object.keys(vibeLabels) as Vibe[]).map((vibe) => (
              <VibePill
                key={vibe}
                vibe={vibe}
                active={activeVibe === vibe}
                onClick={() => setActiveVibe(activeVibe === vibe ? null : vibe)}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {filtered.length} {s.resultLabel}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((trip) => (
            <TripCard key={trip.id} trip={trip} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
