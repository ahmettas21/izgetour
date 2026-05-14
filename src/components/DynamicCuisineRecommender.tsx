'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Recommendation {
  id: string;
  name: string;
  type: string;
  rating: number;
  priceLevel: string;
  distance: string;
  image: string;
  description: string;
}

const TURKISH_DATA: Record<string, Recommendation[]> = {
  Antalya: [
    {
      id: '1',
      name: 'Şehzade Kebabı',
      type: 'Akdeniz Türk Mutfağı',
      rating: 4.8,
      priceLevel: '€€',
      distance: 'Merkezden 600m',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Antalya Lara\'da deniz manzaralı, orjinal döner kebapları ve taze mezeleriyle ünlü tarihi kebapçı.'
    },
    {
      id: '2',
      name: 'Köşk Genesis',
      type: 'Akdeniz & Organik',
      rating: 4.9,
      priceLevel: '€€€',
      distance: 'Kaleiçi\'nden 400m',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Tarihi Antalya köşkünde, yerel organik ürünlerden hazırlanan modern Akdeniz yemekleri ve şarap eşleştirmeleri.'
    },
    {
      id: '3',
      name: 'Tiyatro Börekçisi',
      type: 'Türk Kahvaltısı',
      rating: 4.7,
      priceLevel: '€',
      distance: 'Otelinizden 250m',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Sabah kahvaltınız için taze açık börek çeşitleri, kaymak ve kaşar peyniri ile eşsiz lezzetler.'
    },
  ],
  İzmir: [
    {
      id: '1',
      name: 'Kumrucu Şevki',
      type: 'İzmir Sokak Lezzeti',
      rating: 4.9,
      priceLevel: '€',
      distance: 'Kordon Boyu 350m',
      image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Alsancak\'ta 1960\'lardan beri hizmet veren, otantik İzmir kumrusu ve boyoz ile efsane lezzetler.'
    },
    {
      id: '2',
      name: 'Deniz Kızı Balıkçısı',
      type: 'Ege Deniz Ürünleri',
      rating: 4.8,
      priceLevel: '€€€',
      distance: 'İskele Meydanı 200m',
      image: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Ege\'nin taze balıkları, ahtapot salatası ve midye tava ile deniz kenarında muhteşem bir sofra.'
    },
    {
      id: '3',
      name: 'Mavi Soğan',
      type: 'Ege Mutfağı',
      rating: 4.6,
      priceLevel: '€€',
      distance: 'Kemeraltı Çarşısı 500m',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Kemeraltı\'nın kalbinde, Ege zeytinyağlıları, yaprak sarması ve lokma tatlısı ile eşsiz lezzetler.'
    },
  ],
  Istanbul: [
    {
      id: '1',
      name: 'Balıkçı Sabahattin',
      type: 'Balık & Deniz Ürünleri',
      rating: 4.9,
      priceLevel: '€€€',
      distance: 'Sirkeci 800m',
      image: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Boğaz\'ın eşsiz manzarasında, taze balık mezeleri ve balık ekmek ile Istanbul\'un en prestijli balık restoranı.'
    },
    {
      id: '2',
      name: 'Karaköy Lokantası',
      type: 'İstanbul Mutfağı',
      rating: 4.8,
      priceLevel: '€€',
      distance: 'Karaköy 300m',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Tersaneci sokağında, 100 yıllık tariflerle hazırlanan İskender, mantı ve mevsim mezeleri.'
    },
    {
      id: '3',
      name: 'Künefeci Şeker',
      type: 'Tatlı & Kahve',
      rating: 4.7,
      priceLevel: '€',
      distance: 'Sultanahmet 450m',
      image: 'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Sultanahmet\'te orjinal Antep fıstıklı künefesi ve Türk kahvesi ile tatlı bir mola için ideal.'
    },
  ],
  Kapadokya: [
    {
      id: '1',
      name: 'Testi Kebabı Aşçı Ahmet',
      type: 'Orta Anadolu Mutfağı',
      rating: 4.9,
      priceLevel: '€€',
      distance: 'Göreme Merkez 200m',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Göreme\'de toprağa gömülü testide pişirilen efsanevi testi kebabı ve taze sebze yemekleri.'
    },
    {
      id: '2',
      name: 'Kapadokya Mantıcısı',
      type: 'Anadolu Mantı',
      rating: 4.8,
      priceLevel: '€',
      distance: 'Ürgüp Merkez 350m',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Ürgüp\'te kaymaklı ve domates soslu ufak hamur mantıları ile eşsiz bir Anadolu lezzeti.'
    },
    {
      id: '3',
      name: 'Hafız 1900',
      type: 'Baklava & Tatlı',
      rating: 4.7,
      priceLevel: '€',
      distance: 'Avanos 1km',
      image: 'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Avanos\'ta el yapımı Antep fıstıklı baklava ve kaymak ile tatlı bir Kapadokya deneyimi.'
    },
  ],
  Bodrum: [
    {
      id: '1',
      name: 'Kıyı Balıkçısı',
      type: 'Ege Deniz Ürünleri',
      rating: 4.8,
      priceLevel: '€€€',
      distance: 'Bodrum Marina 150m',
      image: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Marina\'da günlük taze yakalanan balıklar, ahtapot ızgara ve deniz ürünleri salatası ile Ege\'nin en tazesı.'
    },
    {
      id: '2',
      name: 'Güveççi Hasan',
      type: 'Ege & Bodrum Mutfağı',
      rating: 4.9,
      priceLevel: '€€',
      distance: 'Merkez 400m',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Toprakta pişen güveç yemekleri, zeytinyağlılar ve Bodrum mantarı ile Ege mutfağının en iyileri.'
    },
    {
      id: '3',
      name: 'Kumsal Köfte',
      type: 'Türk Köftesi',
      rating: 4.6,
      priceLevel: '€',
      distance: 'Bitez Plajı 500m',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Bitez sahilinde, sucuklu köfte ve Adana kebabı ile plaj sonrası güzel bir yemek molası.'
    },
  ],
};

const DEFAULT_DATA: Recommendation[] = [
  {
    id: '1',
    name: 'Mardinli Konağı',
    type: 'Geleneksel Türk Mutfağı',
    rating: 4.7,
    priceLevel: '€€',
    distance: 'Şehir Merkezi 500m',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Geleneksel Türk evi atmosferinde, ev yapımı kebaplar, mezeler ve Türk tatlıları ile eşsiz bir deneyim.'
  },
  {
    id: '2',
    name: 'Sahil Restaurant',
    type: 'Türk Deniz Ürünleri',
    rating: 4.8,
    priceLevel: '€€€',
    distance: 'Şehir sahil bandı 300m',
    image: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Taze yakalanan balıklar, karides güveç ve midye tava ile deniz kenarında Ege mutfağının en iyileri.'
  },
  {
    id: '3',
    name: 'Çay Ocağı & Börek',
    type: 'Türk Kahvaltısı',
    rating: 4.5,
    priceLevel: '€',
    distance: 'Otelinizden 200m',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'Serpme kahvaltı, taze börek çeşitleri, bal kaymak ve Türk çayı ile güne güzel bir başlangıç.'
  },
];

interface Props {
  destination?: string;
  locale?: string;
}

export default function DynamicCuisineRecommender({ destination = '', locale = 'tr' }: Props) {
  const isTr = locale === 'tr';
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // Simulate API fetch based on destination
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const cityKey = Object.keys(TURKISH_DATA).find(
        (key) => destination?.toLowerCase().includes(key.toLowerCase())
      );
      setRecommendations(cityKey ? TURKISH_DATA[cityKey] : DEFAULT_DATA);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [destination]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-5 w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">
              {isTr ? 'Lokal Lezzet Rehberi' : 'Local Cuisine Guide'}{destination ? `: ${destination}` : ''}
            </h3>
            <p className="text-xs text-gray-500">
              {isTr ? 'Varış noktanızdaki en popüler gastronomi durakları' : 'Top gastronomy stops at your destination'}
            </p>
          </div>
        </div>
        <button className="text-orange-600 text-sm font-medium hover:text-orange-700 hover:underline">
          {isTr ? 'Tümünü Gör' : 'View All'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="group cursor-pointer rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-all">
              <div className="h-32 w-full relative overflow-hidden bg-gray-200">
                <Image 
                  src={rec.image} 
                  alt={rec.name} 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-800 flex items-center shadow-sm">
                  <svg className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {rec.rating}
                </div>
              </div>
              <div className="p-3">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{rec.name}</h4>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{rec.priceLevel}</span>
                </div>
                <p className="text-xs text-orange-600 mb-2 font-medium">{rec.type} • {rec.distance}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{rec.description}</p>
                <button className="mt-3 w-full border border-orange-200 text-orange-600 hover:bg-orange-50 text-xs font-semibold py-1.5 rounded transition-colors">
                  {isTr ? "Itinerary'e Ekle" : 'Add to Itinerary'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
