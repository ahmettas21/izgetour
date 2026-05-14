export interface AncillaryService {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  details: string;
  detailsEn: string;
  icon: string;
  price: number;
  currency: string;
  flow: 'flight' | 'hotel' | 'tour' | 'all';
  category: 'baggage' | 'insurance' | 'transfer' | 'meal' | 'room' | 'entertainment' | 'concierge';
  requiresDetails: boolean;
  detailsLabel?: string;
  detailsLabelEn?: string;
  legalText?: string;
  legalTextEn?: string;
}

export const ANCILLARY_SERVICES: AncillaryService[] = [
  {
    id: 'extra-baggage',
    name: 'Ek Bagaj',
    nameEn: 'Extra Baggage',
    description: '+15 kg ek bagaj hakkı',
    descriptionEn: '+15 kg additional baggage allowance',
    details: 'Ek bagaj hakkı, rezervasyon başına bir kişi için geçerlidir. Online satın alımda %20 indirimlidir. Havalimanında satın alım %50 daha pahalıdır.',
    detailsEn: 'Extra baggage allowance is valid per person per reservation. 20% discount when purchased online. Airport purchase is 50% more expensive.',
    icon: 'Baggage',
    price: 350,
    currency: 'TRY',
    flow: 'flight',
    category: 'baggage',
    requiresDetails: false,
  },
  {
    id: 'extra-baggage-plus',
    name: 'Ek Bagaj +20 kg',
    nameEn: 'Extra Baggage +20 kg',
    description: '+20 kg ek bagaj hakkı',
    descriptionEn: '+20 kg additional baggage allowance',
    details: 'Ek bagaj hakkı, rezervasyon başına bir kişi için geçerlidir. Online satın alımda %20 indirimlidir.',
    detailsEn: 'Extra baggage allowance is valid per person per reservation. 20% discount when purchased online.',
    icon: 'Baggage',
    price: 500,
    currency: 'TRY',
    flow: 'flight',
    category: 'baggage',
    requiresDetails: false,
  },
  {
    id: 'travel-insurance',
    name: 'Seyahat Sigortası',
    nameEn: 'Travel Insurance',
    description: 'Kapsamlı seyahat sigortası (sağlık + iptal + bagaj)',
    descriptionEn: 'Comprehensive travel insurance (health + cancellation + baggage)',
    details: 'Seyahat sağlık sigortası, iptal koruması, bagaj gecikmesi ve kaybı teminatlarını içerir. Yurt dışı seyahatlerinizde zorunludur.',
    detailsEn: 'Includes travel health insurance, cancellation protection, baggage delay and loss coverage. Mandatory for international travel.',
    icon: 'Shield',
    price: 189,
    currency: 'TRY',
    flow: 'all',
    category: 'insurance',
    requiresDetails: false,
    legalText: 'Seyahat sigortası, acil sağlık masraflarını, kişi başı 50.000 EUR\'ya kadar karşılar. İptal teminatı, seyahat bedelinin %100\'ünü kapsar. Detaylı bilgi için poliçe genel şartlarını inceleyiniz.',
    legalTextEn: 'Travel insurance covers emergency medical expenses up to EUR 50,000 per person. Cancellation coverage is 100% of the travel cost. See policy terms for details.',
  },
  {
    id: 'premium-insurance',
    name: 'Premium Seyahat Sigortası',
    nameEn: 'Premium Travel Insurance',
    description: 'VIP kapsamlı sigorta (sağlık + iptal + bagaj + kişisel kaza)',
    descriptionEn: 'VIP comprehensive insurance (health + cancellation + baggage + personal accident)',
    details: 'Temel sigortaya ek olarak kişisel kaza, hukuki yardım, pandemi teminatı ve VIP acil yardım hattı.',
    detailsEn: 'Includes personal accident, legal assistance, pandemic coverage, and VIP emergency helpline in addition to basic coverage.',
    icon: 'Shield',
    price: 399,
    currency: 'TRY',
    flow: 'all',
    category: 'insurance',
    requiresDetails: false,
    legalText: 'Premium sigorta, kişi başı 100.000 EUR\'ya kadar acil sağlık, 20.000 EUR\'ya kadar kişisel kaza teminatı içerir. Pandemi teminatı seyahat öncesi ve sırasında COVID-19 dahil tüm salgın hastalıkları kapsar.',
    legalTextEn: 'Premium insurance covers up to EUR 100,000 per person for emergency health and EUR 20,000 for personal accident. Pandemic coverage includes all epidemic diseases including COVID-19.',
  },
  {
    id: 'vip-transfer',
    name: 'VIP Transfer',
    nameEn: 'VIP Transfer',
    description: 'Lüks araç ile havalimanı - otel arası VIP transfer',
    descriptionEn: 'Luxury airport-hotel VIP transfer',
    details: 'Mercedes E-Class veya benzeri lüks araç, profesyonel şoför, kapıda karşılama, bekleme süresi dahil. 4 kişiye kadar.',
    detailsEn: 'Mercedes E-Class or similar luxury vehicle, professional driver, meet-and-greet, waiting time included. Up to 4 people.',
    icon: 'Car',
    price: 1200,
    currency: 'TRY',
    flow: 'all',
    category: 'transfer',
    requiresDetails: true,
    detailsLabel: 'Varış noktası (otel adresi)',
    detailsLabelEn: 'Drop-off location (hotel address)',
  },
  {
    id: 'shared-transfer',
    name: 'Paylaşımlı Transfer',
    nameEn: 'Shared Transfer',
    description: 'Ekonomik paylaşımlı havalimanı transferi',
    descriptionEn: 'Economy shared airport transfer',
    details: 'Havalimanı - otel arası paylaşımlı servis. Kişi başı fiyat, maksimum 30dk bekleme.',
    detailsEn: 'Shared shuttle service between airport and hotel. Per person price, max 30 min waiting time.',
    icon: 'Bus',
    price: 250,
    currency: 'TRY',
    flow: 'flight',
    category: 'transfer',
    requiresDetails: true,
    detailsLabel: 'Varış noktası',
    detailsLabelEn: 'Drop-off location',
  },
  {
    id: 'early-checkin',
    name: 'Erken Giriş',
    nameEn: 'Early Check-in',
    description: '11:00\'de erken odaya giriş garantisi',
    descriptionEn: 'Guaranteed early check-in at 11:00 AM',
    details: 'Standart check-in 14:00\'dir. Erken giriş ile odanız saat 11:00\'de hazır olur. Müsaitlik durumuna bağlıdır.',
    detailsEn: 'Standard check-in is 14:00. With early check-in, your room is ready by 11:00 AM. Subject to availability.',
    icon: 'Clock',
    price: 450,
    currency: 'TRY',
    flow: 'hotel',
    category: 'room',
    requiresDetails: false,
  },
  {
    id: 'late-checkout',
    name: 'Geç Çıkış',
    nameEn: 'Late Check-out',
    description: '16:00\'ya kadar geç çıkış',
    descriptionEn: 'Late check-out until 16:00',
    details: 'Standart check-out 11:00\'dir. Geç çıkış ile odanızı 16:00\'ya kadar kullanabilirsiniz.',
    detailsEn: 'Standard check-out is 11:00 AM. With late check-out, use your room until 16:00.',
    icon: 'Clock',
    price: 350,
    currency: 'TRY',
    flow: 'hotel',
    category: 'room',
    requiresDetails: false,
  },
  {
    id: 'room-upgrade',
    name: 'Oda Yükseltme',
    nameEn: 'Room Upgrade',
    description: 'Bir üst kategori odaya ücretsiz yükseltme',
    descriptionEn: 'Free upgrade to next room category',
    details: 'Müsaitlik durumunda bir üst oda kategorisine yükseltme. Örn: Standart oda → Deniz Manzaralı oda.',
    detailsEn: 'Upgrade to the next room category subject to availability. E.g., Standard Room → Sea View Room.',
    icon: 'Star',
    price: 750,
    currency: 'TRY',
    flow: 'hotel',
    category: 'room',
    requiresDetails: false,
  },
  {
    id: 'airport-lounge',
    name: 'Havalimanı Lounge',
    nameEn: 'Airport Lounge',
    description: 'Havalimanı business lounge erişimi (2 saat)',
    descriptionEn: 'Airport business lounge access (2 hours)',
    details: 'İçecek, atıştırmalık, Wi-Fi ve çalışma alanı dahildir. Türkiye\'deki tüm havalimanlarında geçerlidir.',
    detailsEn: 'Includes beverages, snacks, Wi-Fi and work area. Valid at all airports in Turkey.',
    icon: 'Coffee',
    price: 299,
    currency: 'TRY',
    flow: 'flight',
    category: 'entertainment',
    requiresDetails: false,
  },
  {
    id: 'special-meal',
    name: 'Özel Yemek',
    nameEn: 'Special Meal',
    description: 'Vejetaryen, vegan veya glütensiz özel yemek',
    descriptionEn: 'Vegetarian, vegan or gluten-free special meal',
    details: 'Uçuş öncesi özel yemek tercihi. Vejetaryen, vegan, glütensiz, diyabetik ve çocuk menüsü seçenekleri mevcuttur.',
    detailsEn: 'Special meal preference for your flight. Vegetarian, vegan, gluten-free, diabetic, and children\'s menu options available.',
    icon: 'Utensils',
    price: 85,
    currency: 'TRY',
    flow: 'flight',
    category: 'meal',
    requiresDetails: true,
    detailsLabel: 'Yemek tercihi',
    detailsLabelEn: 'Meal preference',
  },
  {
    id: 'concierge',
    name: 'Kişisel Danışman',
    nameEn: 'Personal Concierge',
    description: '7/24 kişisel seyahat danışmanı desteği',
    descriptionEn: '24/7 personal travel concierge support',
    details: 'WhatsApp üzerinden 7/24 kişisel danışman. Restoran rezervasyonu, aktivite planlama, acil durum desteği.',
    detailsEn: '24/7 personal concierge via WhatsApp. Restaurant reservations, activity planning, emergency support.',
    icon: 'Headphones',
    price: 1990,
    currency: 'TRY',
    flow: 'all',
    category: 'concierge',
    requiresDetails: false,
  },
];

export const SERVICE_FLOWS: Record<string, string[]> = {
  flight: ['extra-baggage', 'extra-baggage-plus', 'travel-insurance', 'premium-insurance', 'vip-transfer', 'shared-transfer', 'airport-lounge', 'special-meal', 'concierge'],
  hotel: ['travel-insurance', 'premium-insurance', 'vip-transfer', 'early-checkin', 'late-checkout', 'room-upgrade', 'concierge'],
  tour: ['travel-insurance', 'premium-insurance', 'vip-transfer', 'concierge'],
};

export function getServicesForFlow(flow: string): AncillaryService[] {
  const ids = SERVICE_FLOWS[flow] || SERVICE_FLOWS.all || [];
  return ANCILLARY_SERVICES.filter((s) => s.flow === 'all' || (ids.includes(s.id)));
}

export function calculateTotal(
  basePrice: number,
  selectedServiceIds: string[],
): { subtotal: number; servicesTotal: number; vat: number; grandTotal: number } {
  const servicesTotal = ANCILLARY_SERVICES
    .filter((s) => selectedServiceIds.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);
  const subtotal = basePrice + servicesTotal;
  const vat = Math.round(subtotal * 0.08);
  const grandTotal = subtotal + vat;
  return { subtotal, servicesTotal, vat, grandTotal };
}
