import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import {
  Monitor,
  Smartphone,
  Search,
  Layout,
  Image,
  Menu,
  Star,
  Plane,
  Compass,
  Building2,
  MessageCircle,
  ChevronRight,
  MapPin,
  Heart,
  Clock,
  Shield,
  Headphones,
  Award,
} from 'lucide-react';

export const metadata = (): Metadata => ({
  title: 'Dokümantasyon / Tasarım Sistemi',
  description: 'İzgeTour tasarım sistemi ve component dokümantasyonu.',
});

// Component definition
type ComponentDoc = {
  id: string;
  name: string;
  descriptionTR: string;
  descriptionEN: string;
  icon: React.ReactNode;
  file: string;
  props: { name: string; type: string; default?: string; descTR: string }[];
  isClient: boolean;
  features: string[];
};

const COMPONENTS: ComponentDoc[] = [
  {
    id: 'hero-banner',
    name: 'HeroBanner',
    descriptionTR:
      'Ana sayfadaki hero slider. Arka planda dönen görseller, gradient overlay ve içinde SmartSearchContainer barındırır.',
    descriptionEN:
      'The hero slider on the homepage. Features rotating background images, gradient overlays, and includes SmartSearchContainer.',
    icon: <Image className="h-5 w-5" />,
    file: 'src/components/HeroBanner.tsx',
    isClient: true,
    features: [
      '6 saniyede bir dönen 3 adet hero görseli',
      'Gradient overlay (siyah/mavi)',
      'İçerisinde SmartSearchContainer',
      'Slide indicator noktaları',
      'Responsive (min-h-[600px] → min-h-[750px])',
      'Dark mode uyumlu gradient',
    ],
    props: [
      { name: 'locale', type: 'string', default: "'tr'", descTR: 'Dil: "tr" veya "en"' },
    ],
  },
  {
    id: 'smart-search',
    name: 'SmartSearchContainer',
    descriptionTR:
      'Hero banner altında veya sayfa içinde tam boyutlu arama formu. Uçuş, tur ve otel sekmelerini barındırır.',
    descriptionEN:
      'Full-size search form for hero banner or page sections. Includes flights, tours, and hotels tabs.',
    icon: <Search className="h-5 w-5" />,
    file: 'src/components/SmartSearchContainer.tsx',
    isClient: true,
    features: [
      '3 sekme: Uçuş, Tur, Otel',
      'Her sekmede kendi arama alanları',
      'Canlı sonuç önizlemesi',
      'Otel bölümünde oda/yetişkin/çocuk seçici',
      'Tur bölümünde kategori filtresi',
      'Mobil uyumlu responsive grid',
      'White/glass tasarım, shadow-2xl',
    ],
    props: [
      { name: '(yok)', type: '-', descTR: 'Props almaz, kendi state\'ini yönetir' },
    ],
  },
  {
    id: 'search-compact',
    name: 'SearchBarCompact',
    descriptionTR:
      'Mobil sidebar veya filter bar için kompakt arama formu. Tab bar + mini inputlardan oluşur.',
    descriptionEN:
      'Compact search form for mobile sidebar or filter bar. Tab bar with mini inputs.',
    icon: <Smartphone className="h-5 w-5" />,
    file: 'src/components/search/SearchBarCompact.tsx',
    isClient: true,
    features: [
      '3 sekme (Uçuş/Tur/Otel)',
      'Küçük boyutlu inputlar',
      'Mini tarih ve konum seçici',
      'Oda/yetişkin/çocuk paneli',
      'Mobil öncelikli tasarım',
      'Tam responsive',
    ],
    props: [
      { name: '(yok)', type: '-', descTR: 'Props almaz, kendi state\'ini yönetir' },
    ],
  },
  {
    id: 'search-mini',
    name: 'SearchBarMini',
    descriptionTR:
      'Header/Navbar için ikon olarak görünen, tıklandığında modal olarak açılan mini arama.',
    descriptionEN:
      'Icon-based search for header/navbar that opens as a modal on click.',
    icon: <Search className="h-5 w-5" />,
    file: 'src/components/search/SearchBarMini.tsx',
    isClient: true,
    features: [
      'Header\'da "Ara" butonu olarak görünür',
      'Tıklandığında full modal açar',
      'Arka plan blur overlay',
      '3 sekme (Uçuş/Tur/Otel)',
      'Mobile uygun',
      'Dark mode destekli',
    ],
    props: [
      { name: '(yok)', type: '-', descTR: 'Props almaz, kendi state\'ini yönetir' },
    ],
  },
  {
    id: 'header',
    name: 'Header',
    descriptionTR:
      'Sticky navigasyon başlığı. Logo, bağlantılar, tema değiştirici, dil seçici ve mobil menü.',
    descriptionEN:
      'Sticky navigation header. Logo, links, theme toggle, language switcher, and mobile menu.',
    icon: <Menu className="h-5 w-5" />,
    file: 'src/components/Header.tsx',
    isClient: true,
    features: [
      'Sticky header, scroll ile değişen stil',
      'Desktop: logo + nav + theme/lang + wishlist',
      'Mobile: hamburger menü',
      'Scroll durumuna göre transparan → beyaz',
      'Blur backdrop',
      'Dark mode tam uyumlu',
    ],
    props: [
      { name: '(yok)', type: '-', descTR: 'Props almaz, kendi state\'ini ve i18n\'i yönetir' },
    ],
  },
  {
    id: 'footer',
    name: 'Footer',
    descriptionTR:
      'Site alt bilgisi. Marka, hızlı linkler, iletişim, bülten, sosyal medya ve Recently Viewed.',
    descriptionEN:
      'Site footer with brand, quick links, contact, newsletter, social media, and Recently Viewed.',
    icon: <Layout className="h-5 w-5" />,
    file: 'src/components/Footer.tsx',
    isClient: true,
    features: [
      '4 grid bölüm: Marka, Linkler, İletişim, Bülten',
      'Recently Viewed (localStorage)',
      'Sosyal medya ikonları (Instagram, Twitter, Facebook)',
      'Gizlilik ve Kullanım Şartları linkleri',
      'Gradient üst çizgi',
      'Dark mode tam uyumlu',
    ],
    props: [
      { name: '(yok)', type: '-', descTR: 'Props almaz, i18n ve useRecentlyViewed kullanır' },
    ],
  },
  {
    id: 'tour-card',
    name: 'TourCard',
    descriptionTR:
      'Tur listeleme kartı. Görsel, rating, süre, fiyat ve wishlist butonu.',
    descriptionEN:
      'Tour listing card with image, rating, duration, price, and wishlist button.',
    icon: <Compass className="h-5 w-5" />,
    file: 'src/components/TourCard.tsx',
    isClient: true,
    features: [
      '16:10 aspect görsel, hover zoom',
      'Rating ve süre rozetleri',
      'Bookmark/wishlist butonu',
      'Lokasyon, başlık, açıklama',
      'Fiyat gösterimi',
      'Shadow card hover efekti',
    ],
    props: [
      { name: 'tour', type: 'Tour', descTR: 'Tur verisi (id, slug, title, price, image vb.)' },
      { name: 'locale', type: "'tr' | 'en'", descTR: 'Dil: "tr" veya "en"' },
    ],
  },
  {
    id: 'hotel-card',
    name: 'HotelCard',
    descriptionTR:
      'Otel listeleme kartı. Görsel, rating, sürdürülebilirlik skoru, olanaklar ve fiyat.',
    descriptionEN:
      'Hotel listing card with image, rating, sustainability score, amenities, and price.',
    icon: <Building2 className="h-5 w-5" />,
    file: 'src/components/HotelCard.tsx',
    isClient: true,
    features: [
      'Sürdürülebilirlik rozeti (Leaf icon)',
      'Rating rozeti',
      'Olanak etiketleri (max 3 + "more")',
      'Oda sayısı ve minimum fiyat',
      'Wishlist butonu',
      'Image fallback (onError)',
    ],
    props: [
      { name: 'hotel', type: 'Hotel', descTR: 'Otel verisi (id, slug, title, rooms, amenities vb.)' },
      { name: 'locale', type: "'tr' | 'en'", descTR: 'Dil: "tr" veya "en"' },
    ],
  },
  {
    id: 'flight-card',
    name: 'FlightCard',
    descriptionTR:
      'Uçuş listeleme kartı. Havayolu, gidiş/dönüş, aktarma noktaları, fiyat takibi.',
    descriptionEN:
      'Flight listing card with airline, departure/arrival, stopover points, price tracking.',
    icon: <Plane className="h-5 w-5" />,
    file: 'src/components/FlightCard.tsx (legacy) / src/components/flights/FlightCard.tsx',
    isClient: true,
    features: [
      'Havayolu logosu ve kodları',
      'Direkt/aktarmalı gösterimi',
      'Fiyat düşüş bildirimi (yeşil)',
      'Fiyat takip butonu (Bell)',
      'Son koltuk uyarısı',
      'Compare mod (checkbox)',
      'Wishlist butonu',
      'Bagaj, iade durumu, CO₂ skoru',
    ],
    props: [
      { name: 'flight', type: 'Flight | FlightResult', descTR: 'Uçuş verisi' },
      { name: 'isFollowed', type: 'boolean', descTR: 'Takip ediliyor mu?' },
      { name: 'onToggleFollow', type: '(id: string) => void', descTR: 'Takip durumunu değiştir' },
      { name: 'locale', type: "'tr' | 'en'", descTR: 'Dil' },
    ],
  },
  {
    id: 'features',
    name: 'Features',
    descriptionTR:
      'Güven, destek ve kalite vurgusu yapan 3 kartlı özellik bölümü.',
    descriptionEN:
      '3-card features section highlighting trust, support, and quality.',
    icon: <Award className="h-5 w-5" />,
    file: 'src/components/Features.tsx',
    isClient: true,
    features: [
      '3 feature: Güvenli Ödeme, 7/24 Destek, Kalite Garantisi',
      'Her kartta icon, başlık, açıklama',
      'Hover yükselme efekti',
      'Dark mode uyumlu',
    ],
    props: [
      { name: '(yok)', type: '-', descTR: 'Props almaz, next-intl ile çevirileri alır' },
    ],
  },
  {
    id: 'mood-picker',
    name: 'MoodDestinationPicker',
    descriptionTR:
      'Ruh haline göre destinasyon keşfi. Kullanıcı hissine göre öneri sunar.',
    descriptionEN:
      'Mood-based destination discovery. Suggests destinations based on user mood.',
    icon: <Star className="h-5 w-5" />,
    file: 'src/components/MoodDestinationPicker.tsx',
    isClient: true,
    features: [
      'Ruh hali seçenekleri (Macera, Romantik, Kültür vb.)',
      'Seçilen ruh haline göre filtreleme',
      'Canlı sonuç önizlemesi',
      'Animasyonlu geçiş',
      'Dark mode uyumlu',
    ],
    props: [
      { name: 'locale', type: "'tr' | 'en'", descTR: 'Dil' },
    ],
  },
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    descriptionTR:
      'Sayfa içi navigasyon çubuğu. Her sayfa için konum gösterir.',
    descriptionEN:
      'In-page navigation bar showing the current page location.',
    icon: <ChevronRight className="h-5 w-5" />,
    file: 'src/components/Breadcrumb.tsx',
    isClient: true,
    features: [
      'Home icon ile başlar',
      'Son öğe kalın yazılır (link değil)',
      'Maksimum 200px truncate',
      'Responsive (sr-only on mobile)',
    ],
    props: [
      { name: 'items', type: 'BreadcrumbItem[]', descTR: 'Breadcrumb öğeleri: { label, href? }' },
    ],
  },
  {
    id: 'support-bubble',
    name: 'SupportBubble',
    descriptionTR:
      'Sağ alt köşede canlı destek butonu. ChatWindow modal açar.',
    descriptionEN:
      'Live support button at bottom-right corner. Opens ChatWindow modal.',
    icon: <MessageCircle className="h-5 w-5" />,
    file: 'src/components/Support/SupportBubble.tsx',
    isClient: true,
    features: [
      'MessageCircle ikonu, açıkken X',
      'ChatWindow lazy loading (dynamic import)',
      'Spinner loading state',
      'Mobile overlay backdrop',
      'Hover scale ve active scale animasyonu',
    ],
    props: [
      { name: '(yok)', type: '-', descTR: 'Props almaz, useChatStore kullanır' },
    ],
  },
];

// ─── Preview Cards ──────────────────────────────────────────────
function getPreviewForComponent(id: string) {
  const previews: Record<string, React.ReactNode> = {
    'hero-banner': null,
    'smart-search': null,
    'search-compact': null,
    'search-mini': null,
    'tour-card': null,
    'hotel-card': null,
    'flight-card': null,
    'features': (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', label: 'Güvenli Ödeme' },
          { icon: Headphones, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', label: '7/24 Destek' },
          { icon: Award, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', label: 'Kalite Garantisi' },
        ].map(({ icon: Icon, color, bg, label }) => (
          <div key={label} className="rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
            <div className={`mb-3 inline-flex rounded-lg p-2.5 ${bg} ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{label}</h4>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Kısa açıklama metni buraya gelir.</p>
          </div>
        ))}
      </div>
    ),
    'header': null,
    'footer': null,
    'breadcrumb': (
      <nav className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white p-3 text-sm text-zinc-500 dark:border-gray-700 dark:bg-gray-800">
        <MapPin className="h-3.5 w-3.5" />
        <span className="text-zinc-400">Home</span>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
        <span className="text-zinc-400">Turlar</span>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
        <span className="font-medium text-zinc-800 dark:text-white">Tur Detay</span>
      </nav>
    ),
    'support-bubble': (
      <div className="flex items-center gap-4 p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-lg">
          <MessageCircle className="h-6 w-6" />
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Sağ alt köşede Canlı Destek butonu
        </div>
      </div>
    ),
    'mood-picker': null,
  };
  return previews[id] || null;
}

// ─── Page ───────────────────────────────────────────────────────
export default async function DocsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTR = locale === 'tr';

  const categories = [
    { label: isTR ? 'Arama Bileşenleri' : 'Search Components', ids: ['smart-search', 'search-compact', 'search-mini'] },
    { label: isTR ? 'Kart Bileşenleri' : 'Card Components', ids: ['tour-card', 'hotel-card', 'flight-card'] },
    { label: isTR ? 'Sayfa Yapısı' : 'Page Layout', ids: ['hero-banner', 'header', 'footer', 'features', 'breadcrumb'] },
    { label: isTR ? 'Diğer' : 'Other', ids: ['mood-picker', 'support-bubble'] },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--brand)]/10 via-white to-white py-16 dark:from-[var(--brand)]/5 dark:via-gray-950 dark:to-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block rounded-full bg-[var(--brand-light)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--brand)]">
              {isTR ? 'Tasarım Sistemi' : 'Design System'}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              {isTR ? 'Dokümantasyon' : 'Documentation'}
            </h1>
            <p className="mt-4 text-base text-gray-500 dark:text-gray-400 sm:text-lg">
              {isTR
                ? 'İzgeTour component kütüphanesi — her bileşenin açıklaması, props tablosu ve canlı önizlemesi'
                : 'İzgeTour component library — descriptions, props tables, and live previews for every component'}
            </p>
          </div>
        </div>
      </section>

      {/* Icons */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-2 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
          <Monitor className="h-3.5 w-3.5" /> {isTR ? 'Toplam' : 'Total'}{' '}
          <strong className="text-gray-600 dark:text-gray-400">{COMPONENTS.length}</strong>{' '}
          {isTR ? 'bileşen' : 'components'}
        </div>

        {/* Quick nav */}
        <div className="mb-10 flex flex-wrap gap-2">
          {COMPONENTS.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
            >
              {c.icon}
              {c.name}
            </a>
          ))}
        </div>

        {/* Grouped by category */}
        {categories.map((cat) => (
          <section key={cat.label} className="mb-12">
            <h2 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
              {cat.label}
            </h2>
            <div className="space-y-8">
              {cat.ids.map((id) => {
                const comp = COMPONENTS.find((c) => c.id === id);
                if (!comp) return null;
                return <ComponentDocBlock key={comp.id} comp={comp} isTR={isTR} locale={locale} />;
              })}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}

// ─── Component Doc Block ────────────────────────────────────────
function ComponentDocBlock({
  comp,
  isTR,
  locale,
}: {
  comp: ComponentDoc;
  isTR: boolean;
  locale: string;
}) {
  const preview = getPreviewForComponent(comp.id);

  return (
    <div
      id={comp.id}
      className="scroll-mt-20 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-gray-100 p-5 dark:border-gray-800">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-light)] text-[var(--brand)]">
            {comp.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                {comp.name}
              </h3>
              {comp.isClient && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  Client
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {isTR ? comp.descriptionTR : comp.descriptionEN}
            </p>
          </div>
        </div>
        <code className="hidden shrink-0 rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] text-gray-500 dark:bg-gray-800 dark:text-gray-400 sm:block">
          {comp.file}
        </code>
      </div>

      {/* Features */}
      <div className="border-b border-gray-100 p-5 dark:border-gray-800">
        <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {isTR ? 'Özellikler' : 'Features'}
        </h4>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {comp.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Props table */}
      <div className="border-b border-gray-100 p-5 dark:border-gray-800">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {isTR ? 'Props' : 'Props'}
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                <th className="py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                <th className="py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">
                  {isTR ? 'Varsayılan' : 'Default'}
                </th>
                <th className="py-2 font-semibold text-gray-700 dark:text-gray-300">
                  {isTR ? 'Açıklama' : 'Description'}
                </th>
              </tr>
            </thead>
            <tbody>
              {comp.props.map((prop, i) => (
                <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50">
                  <td className="py-2 pr-4 font-mono font-medium text-[var(--brand)]">
                    {prop.name}
                  </td>
                  <td className="py-2 pr-4">
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      {prop.type}
                    </code>
                  </td>
                  <td className="py-2 pr-4 text-gray-400">
                    {prop.default || '-'}
                  </td>
                  <td className="py-2 text-gray-500 dark:text-gray-400">
                    {prop.descTR}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview */}
      {preview && (
        <div className="p-5">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            {isTR ? 'Canlı Önizleme' : 'Live Preview'}
          </h4>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            {preview}
          </div>
        </div>
      )}

      {!preview && (
        <div className="p-5">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            {isTR ? 'Canlı Önizleme' : 'Live Preview'}
          </h4>
          <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 py-8 text-xs text-gray-400 dark:border-gray-700 dark:bg-gray-800/50">
            <div className="text-center">
              <Monitor className="mx-auto mb-2 h-6 w-6 text-gray-300" />
              {isTR
                ? 'Önizleme için bileşeni sayfaya ekleyin'
                : 'Add the component to a page to see it live'}
            </div>
          </div>
        </div>
      )}

      {/* Usage hint */}
      <div className="rounded-b-2xl bg-gray-50 p-5 dark:bg-gray-800/50">
        <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {isTR ? 'Kullanım' : 'Usage'}
        </h4>
        <code className="block rounded-lg bg-gray-100 p-3 text-[11px] text-gray-700 dark:bg-gray-800 dark:text-gray-300 overflow-x-auto">
          {`import ${comp.name} from '@/components/${comp.file.replace('src/components/', '').replace('.tsx', '')}';`}
        </code>
      </div>
    </div>
  );
}
