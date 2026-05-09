export interface Room {
  id: string;
  type: string;
  typeEn: string;
  price: number;
  board: string;
  boardEn: string;
  maxGuests: number;
}

export interface Hotel {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  rating: number;
  image: string;
  amenities: string[];
  rooms: Room[];
}

export const hotels: Hotel[] = [
  {
    id: "1",
    slug: "grand-palace-antalya",
    title: "Grand Palace Antalya",
    titleEn: "Grand Palace Antalya",
    description: "Beş yıldızlı lüks otel, özel plaj, sonsuzluk havuzu ve dünya mutfağı sunan restoranlarıyla hizmetinizde.",
    descriptionEn: "Five-star luxury hotel with private beach, infinity pool, and world cuisine restaurants.",
    price: 3500,
    rating: 4.8,
    image: "/images/grand-palace.jpg",
    amenities: ["Özel Plaj", "Sonsuzluk Havuzu", "SPA & Wellness", "Fitness Center"],
    rooms: [
      { id: "gp-1", type: "Standart Oda", typeEn: "Standard Room", price: 2500, board: "Kahvaltı Dahil", boardEn: "Breakfast Included", maxGuests: 2 },
      { id: "gp-2", type: "Süit Oda", typeEn: "Suite Room", price: 4500, board: "Her Şey Dahil", boardEn: "All Inclusive", maxGuests: 3 },
      { id: "gp-3", type: "Aile Süiti", typeEn: "Family Suite", price: 6000, board: "Her Şey Dahil", boardEn: "All Inclusive", maxGuests: 4 },
    ],
  },
  {
    id: "2",
    slug: "olympos-bungalov",
    title: "Olympos Bungalov",
    titleEn: "Olympos Bungalow",
    description: "Doğayla iç içe, özel bungalovlar, sabah kahvaltısı ve eşsiz Olympos manzarası.",
    descriptionEn: "Nature-inspired bungalows with complimentary breakfast and unique Olympos views.",
    price: 1800,
    rating: 4.5,
    image: "/images/olympos-bungalov.jpg",
    amenities: ["Doğa Manzarası", "Ücretsiz Kahvaltı", "Ücretsiz WiFi", "Otopark"],
    rooms: [
      { id: "ob-1", type: "Standart Bungalov", typeEn: "Standard Bungalow", price: 1500, board: "Kahvaltı Dahil", boardEn: "Breakfast Included", maxGuests: 2 },
      { id: "ob-2", type: "Deluxe Bungalov", typeEn: "Deluxe Bungalow", price: 2200, board: "Kahvaltı Dahil", boardEn: "Breakfast Included", maxGuests: 3 },
    ],
  },
  {
    id: "3",
    slug: "istanbul-bosphorus-hotel",
    title: "İstanbul Boğaz Oteli",
    titleEn: "Istanbul Bosphorus Hotel",
    description: "Tarihi yarımadada, boğaz manzaralı butik otel. Kapalıçarşı ve Ayasofya'ya yürüme mesafesi.",
    descriptionEn: "Boutique hotel on the historic peninsula with Bosphorus views. Walking distance to Grand Bazaar and Hagia Sophia.",
    price: 2800,
    rating: 4.6,
    image: "/images/bosphorus-hotel.jpg",
    amenities: ["Boğaz Manzaralı", "Merkezi Konum", "Restoran", "Oda Servisi"],
    rooms: [
      { id: "ib-1", type: "Standart Oda", typeEn: "Standard Room", price: 2200, board: "Kahvaltı Dahil", boardEn: "Breakfast Included", maxGuests: 2 },
      { id: "ib-2", type: "Manzaralı Oda", typeEn: "Room with View", price: 3500, board: "Kahvaltı Dahil", boardEn: "Breakfast Included", maxGuests: 2 },
    ],
  },
  {
    id: "4",
    slug: "pamukkale-termal",
    title: "Pamukkale Termal Resort",
    titleEn: "Pamukkale Thermal Resort",
    description: "Termal sularla şifa bulun, travertenlere sıfır konumda lüks tatil.",
    descriptionEn: "Healing thermal waters and luxury vacation right next to the travertines.",
    price: 2200,
    rating: 4.4,
    image: "/images/pamukkale-termal.jpg",
    amenities: ["Termal Havuz", "SPA", "Traverten Manzarası", "Hamam"],
    rooms: [
      { id: "pt-1", type: "Standart Oda", typeEn: "Standard Room", price: 1800, board: "Kahvaltı Dahil", boardEn: "Breakfast Included", maxGuests: 2 },
      { id: "pt-2", type: "Termal Süit", typeEn: "Thermal Suite", price: 3000, board: "Her Şey Dahil", boardEn: "All Inclusive", maxGuests: 3 },
    ],
  },
  {
    id: "5",
    slug: "cappadocia-cave-hotel",
    title: "Kapadokya Mağara Oteli",
    titleEn: "Cappadocia Cave Hotel",
    description: "Tarihi mağara odalar, sıcak hava balonu manzarası ve eşsiz peri bacaları deneyimi.",
    descriptionEn: "Historic cave rooms, hot air balloon views, and unique fairy chimney experience.",
    price: 3200,
    rating: 4.7,
    image: "/images/cappadocia-cave.jpg",
    amenities: ["Mağara Oda", "Balon Manzarası", "Şarap Mahzeni", "Teras"],
    rooms: [
      { id: "cc-1", type: "Mağara Oda", typeEn: "Cave Room", price: 2800, board: "Kahvaltı Dahil", boardEn: "Breakfast Included", maxGuests: 2 },
      { id: "cc-2", type: "Süit Mağara", typeEn: "Cave Suite", price: 4200, board: "Kahvaltı Dahil", boardEn: "Breakfast Included", maxGuests: 2 },
    ],
  },
];
