export type Tour = {
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
  lat: number;
  lng: number;
  co2Emissions?: number;
  sustainabilityScore?: number;
};

export const MOCK_TOURS: Tour[] = [
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
    category: 'culture',
    lat: 38.6606,
    lng: 34.8263,
    co2Emissions: 35,
    sustainabilityScore: 88,
  },
  {
    id: '2',
    slug: 'efes-antik-kenti',
    title: 'Efes Antik Kenti Turu',
    titleEn: 'Ephesus Ancient City Tour',
    description: "Dünyanın en iyi korunmuş antik şehirlerinden biri",
    descriptionEn: 'One of the best preserved ancient cities in the world',
    price: 890,
    duration: 1,
    image: 'https://images.unsplash.com/photo-1568810032-2e0f6e4c0e7b?w=800&q=80',
    location: 'İzmir',
    rating: 4.8,
    category: 'culture',
    lat: 37.9395,
    lng: 27.3409,
    co2Emissions: 28,
    sustainabilityScore: 92,
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
    category: 'nature',
    lat: 37.9305,
    lng: 29.1203,
    co2Emissions: 25,
    sustainabilityScore: 94,
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
    category: 'city',
    lat: 41.0082,
    lng: 28.9784,
    co2Emissions: 45,
    sustainabilityScore: 75,
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
    category: 'sea',
    lat: 36.7726,
    lng: 30.5750,
    co2Emissions: 55,
    sustainabilityScore: 70,
  },
  {
    id: '6',
    slug: 'karadeniz-yaylalari',
    title: 'Karadeniz Yayla Turu',
    titleEn: 'Black Sea Highlands Tour',
    description: 'Yeşilin her tonu, yaylalar ve doğa harikaları',
    descriptionEn: 'Every shade of green, plateaus and natural wonders',
    price: 1800,
    duration: 3,
    image: 'https://images.unsplash.com/photo-1580734075808-8ee7d8c1a8b2?w=800&q=80',
    location: 'Trabzon',
    rating: 4.8,
    category: 'nature',
    lat: 40.9128,
    lng: 40.3023,
    co2Emissions: 30,
    sustainabilityScore: 90,
  },
];
