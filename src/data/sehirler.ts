// Şehir verileri — SEO landing sayfaları için
// Her şehir: slug, ad, açıklama, görsel, koordinatlar

export type Sehir = {
  slug: string;
  name: string;
  description: string;
  descriptionEn: string;
  image: string;
  heroTitle: string;
  heroTitleEn: string;
  lat: number;
  lng: number;
  blogSlug?: string;
};

export const SEHIRLER: Sehir[] = [
  {
    slug: 'istanbul',
    name: 'İstanbul',
    description: 'Tarih ve modernitenin buluştuğu eşsiz şehir. Boğaz manzaraları, tarihi yarımada, Kapalıçarşı ve daha fazlası sizi bekliyor.',
    descriptionEn: 'The unique city where history meets modernity. Bosphorus views, historic peninsula, Grand Bazaar and more await you.',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
    heroTitle: 'İstanbul\'a Hoş Geldiniz',
    heroTitleEn: 'Welcome to Istanbul',
    lat: 41.0082,
    lng: 28.9784,
    blogSlug: 'istanbul-3-gunluk-rota',
  },
  {
    slug: 'antalya',
    name: 'Antalya',
    description: 'Akdeniz\'in incisi, mavi bayraklı plajları, tarihi limanı ve lüks tatil köyleriyle ünlü tatil cenneti.',
    descriptionEn: 'The pearl of the Mediterranean, famous for its blue flag beaches, historic harbor and luxury resorts.',
    image: 'https://images.unsplash.com/photo-1593352216840-1aee13f45818?w=800&q=80',
    heroTitle: 'Antalya\'ya Hoş Geldiniz',
    heroTitleEn: 'Welcome to Antalya',
    lat: 36.8969,
    lng: 30.7133,
    blogSlug: 'antalya-plaj-rehberi',
  },
  {
    slug: 'izmir',
    name: 'İzmir',
    description: 'Ege\'nin incisi, antik kentleri, enfes mutfağı ve masmavi kıyılarıyla keşfedilmeyi bekleyen şehir.',
    descriptionEn: 'The pearl of the Aegean, a city waiting to be discovered with its ancient cities, exquisite cuisine and blue coasts.',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80',
    heroTitle: 'İzmir\'e Hoş Geldiniz',
    heroTitleEn: 'Welcome to Izmir',
    lat: 38.4192,
    lng: 27.1287,
  },
  {
    slug: 'kapadokya',
    name: 'Kapadokya',
    description: 'Peri bacaları, yeraltı şehirleri ve sıcak hava balonlarıyla ünlü masalsı bölge.',
    descriptionEn: 'A fairy-tale region famous for its fairy chimneys, underground cities and hot air balloons.',
    image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=800&q=80',
    heroTitle: 'Kapadokya\'ya Hoş Geldiniz',
    heroTitleEn: 'Welcome to Cappadocia',
    lat: 38.6606,
    lng: 34.8263,
    blogSlug: 'sirt-cantasiyla-kapadokya',
  },
  {
    slug: 'bodrum',
    name: 'Bodrum',
    description: 'Beyaz badanalı evleri, marina yaşamı ve eşsiz gece hayatıyla Ege\'nin gözde tatil beldesi.',
    descriptionEn: 'The Aegean\'s favorite resort town with whitewashed houses, marina life and unique nightlife.',
    image: 'https://images.unsplash.com/photo-1593476550610-1ba7d0f7e17c?w=800&q=80',
    heroTitle: 'Bodrum\'a Hoş Geldiniz',
    heroTitleEn: 'Welcome to Bodrum',
    lat: 37.0344,
    lng: 27.4306,
  },
  {
    slug: 'marmaris',
    name: 'Marmaris',
    description: 'Çam ormanlarıyla çevrili koyları, marinası ve doğal güzellikleriyle ünlü tatil cenneti.',
    descriptionEn: 'A holiday paradise famous for its pine-forested bays, marina and natural beauty.',
    image: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=800&q=80',
    heroTitle: 'Marmaris\'e Hoş Geldiniz',
    heroTitleEn: 'Welcome to Marmaris',
    lat: 36.8542,
    lng: 28.2702,
  },
  {
    slug: 'fethiye',
    name: 'Fethiye',
    description: 'Ölüdeniz, Kelebekler Vadisi ve Babadağ\'dan yamaç paraşütüyle eşsiz bir doğa deneyimi.',
    descriptionEn: 'A unique nature experience with Ölüdeniz, Butterfly Valley and paragliding from Mount Babadağ.',
    image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&q=80',
    heroTitle: 'Fethiye\'ye Hoş Geldiniz',
    heroTitleEn: 'Welcome to Fethiye',
    lat: 36.6545,
    lng: 29.1253,
  },
  {
    slug: 'pamukkale',
    name: 'Pamukkale',
    description: 'Beyaz travertenleri, antik Hierapolis kenti ve termal sularıyla doğa harikası.',
    descriptionEn: 'A natural wonder with white travertines, ancient Hierapolis and thermal waters.',
    image: 'https://images.unsplash.com/photo-1600520186981-bc7e14c9c4e3?w=800&q=80',
    heroTitle: 'Pamukkale\'ye Hoş Geldiniz',
    heroTitleEn: 'Welcome to Pamukkale',
    lat: 37.9305,
    lng: 29.1203,
  },
  {
    slug: 'trabzon',
    name: 'Trabzon',
    description: 'Sümela Manastırı, yaylaları ve Karadeniz\'in eşsiz yeşil doğasıyla büyüleyici şehir.',
    descriptionEn: 'A fascinating city with Sumela Monastery, plateaus and the unique green nature of the Black Sea.',
    image: 'https://images.unsplash.com/photo-1580734075808-8ee7d8c1a8b2?w=800&q=80',
    heroTitle: 'Trabzon\'a Hoş Geldiniz',
    heroTitleEn: 'Welcome to Trabzon',
    lat: 41.0019,
    lng: 39.7176,
  },
  {
    slug: 'efes',
    name: 'Efes',
    description: 'Antik dünyanın en önemli kentlerinden biri, Celsus Kütüphanesi ve Artemis Tapınağı\'na ev sahipliği.',
    descriptionEn: 'One of the most important cities of the ancient world, home to the Library of Celsus and the Temple of Artemis.',
    image: 'https://images.unsplash.com/photo-1568810032-2e0f6e4c0e7b?w=800&q=80',
    heroTitle: 'Efes\'e Hoş Geldiniz',
    heroTitleEn: 'Welcome to Ephesus',
    lat: 37.9395,
    lng: 27.3409,
  },
];

export function getSehir(slug: string): Sehir | undefined {
  return SEHIRLER.find((s) => s.slug === slug);
}

/** Slug → city name için mapping (küçük harf → normal) */
export function slugToName(slug: string): string {
  const map: Record<string, string> = {
    istanbul: 'İstanbul',
    antalya: 'Antalya',
    izmir: 'İzmir',
    kapadokya: 'Kapadokya',
    bodrum: 'Bodrum',
    marmaris: 'Marmaris',
    fethiye: 'Fethiye',
    pamukkale: 'Pamukkale',
    trabzon: 'Trabzon',
    efes: 'Efes',
  };
  return map[slug] || slug;
}

/** Name → slug mapping */
export function nameToSlug(name: string): string {
  const map: Record<string, string> = {
    'İstanbul': 'istanbul',
    'Antalya': 'antalya',
    'İzmir': 'izmir',
    'Kapadokya': 'kapadokya',
    'Bodrum': 'bodrum',
    'Marmaris': 'marmaris',
    'Fethiye': 'fethiye',
    'Pamukkale': 'pamukkale',
    'Trabzon': 'trabzon',
    'Efes': 'efes',
    'Nevşehir': 'kapadokya',
    'Denizli': 'pamukkale',
    'Muğla': 'bodrum',
  };
  return map[name] || name.toLowerCase().replace(/ı/g, 'i').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/ş/g, 's').replace(/ğ/g, 'g');
}
