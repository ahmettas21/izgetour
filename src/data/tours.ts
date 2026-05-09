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
  },
];
