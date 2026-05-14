'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

// Reuse the same data — ideally extract to a shared data layer later
type Vibe = 'nature' | 'culture' | 'food' | 'adventure' | 'relax' | 'digital-detox';

interface MicroTrip {
  id: string;
  title: string;
  subtitle: string;
  vibe: Vibe;
  duration: string;
  budget: string;
  distance: string;
  emoji: string;
  highlights: string[];
  tags: string[];
}

const ALL_TRIPS: MicroTrip[] = [
  {
    id: '1', title: 'Sapanca Göl Kenarı Kaçamağı', subtitle: 'İstanbul\'a 1.5 saat, huzura 1 adım',
    vibe: 'nature', duration: '1 Gün', budget: '₺800-1500', distance: '130 km', emoji: '🌲',
    highlights: ['Göl manzaralı kahvaltı', 'Doğa yürüyüşü', 'Lokanta keyfi', 'Fotoğraf rotası'],
    tags: ['istanbul', 'marmara', 'doğa'],
  },
  {
    id: '2', title: 'Efes Antik Kent Günübirlik', subtitle: 'Tarihin kalbinde bir gün',
    vibe: 'culture', duration: '1 Gün', budget: '₺600-1200', distance: '80 km', emoji: '🏛️',
    highlights: ['Antik tiyatro', 'Celsus Kütüphanesi', 'Şirince köyü molası'],
    tags: ['izmir', 'ege', 'tarih'],
  },
  {
    id: '3', title: 'Gaziantep Sokak Lezzetleri Turu', subtitle: 'Baklava ve kahve için 48 saat',
    vibe: 'food', duration: '2 Gün 1 Gece', budget: '₺2000-3500', distance: '200 km', emoji: '🍽️',
    highlights: ['Baklava atölyesi', 'Kahvaltı geleneği', 'Bakırcılar çarşısı', 'Gece turu'],
    tags: ['gaziantep', 'güneydoğu', 'yemek'],
  },
  {
    id: '4', title: 'Kız Kulesi\'ne Yüzme Macerası', subtitle: 'Boğaz\'da unutulmaz bir gün',
    vibe: 'adventure', duration: '1 Gün', budget: '₺1500-2500', distance: '0 km (şehir içi)',
    emoji: '🏊', highlights: ['Kız Kulesi\'ne yüzüş', 'Boğaz manzarası', 'Özel eğitmen eşliğinde'],
    tags: ['istanbul', 'marmara', 'spor'],
  },
  {
    id: '5', title: 'Karaburun Sakin Kaçamak', subtitle: 'Deniz, zeytinlik ve sessizlik',
    vibe: 'relax', duration: '2 Gün 1 Gece', budget: '₺1200-2000', distance: '90 km', emoji: '🌿',
    highlights: ['Zeytinlikler arası yürüyüş', 'Köy kahvaltısı', 'Gün batımı izleme'],
    tags: ['izmir', 'ege', 'huzur'],
  },
  {
    id: '6', title: 'Cunda Adası Tekne Kaçamağı', subtitle: 'Adalarda wifi yok, huzur var',
    vibe: 'digital-detox', duration: '2 Gün 1 Gece', budget: '₺1000-1800', distance: '170 km',
    emoji: '📵', highlights: ['Telefon kapama ritüeli', 'Tekne turu', 'Taş evlerde konaklama'],
    tags: ['balıkesir', 'ege', 'ada'],
  },
  {
    id: '7', title: 'Hattuşaş Antik Başkent', subtitle: 'Hititlerin izinde 24 saat',
    vibe: 'culture', duration: '1 Gün', budget: '₺700-1300', distance: '200 km', emoji: '🗿',
    highlights: ['Açık hava müzesi', 'Aslanlı Kapı', 'Yer altı tünelleri'],
    tags: ['çorum', 'iç anadolu', 'tarih'],
  },
  {
    id: '8', title: 'Abant Gölü Doğa Kampı', subtitle: 'Şehirden uzak, doğaya yakın',
    vibe: 'nature', duration: '2 Gün 1 Gece', budget: '₺1500-2500', distance: '160 km', emoji: '⛺',
    highlights: ['Kamp kurulumu', 'Göl kenarında akşam yemeği', 'Yıldız gözlemi'],
    tags: ['bolu', 'karadeniz', 'kamp'],
  },
];

export default function MicroAdventureDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [saved, setSaved] = useState(false);

  const trip = ALL_TRIPS.find((t) => t.id === id);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Kaçamak Bulunamadı</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Aradığınız mikro macera listede yok.</p>
          <Link
            href="/micro-adventure"
            className="text-indigo-600 hover:text-indigo-700 font-medium underline underline-offset-2"
          >
            ← Tüm kaçamaklara dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 py-16">
          <Link
            href="/micro-adventure"
            className="text-sm text-indigo-200 hover:text-white mb-4 inline-flex items-center gap-1 transition-colors"
          >
            ← Tüm kaçamaklar
          </Link>
          <div className="text-7xl mb-4">{trip.emoji}</div>
          <h1 className="text-3xl md:text-5xl font-bold mb-2">{trip.title}</h1>
          <p className="text-lg text-indigo-100 mb-4">{trip.subtitle}</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">{trip.duration}</span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">{trip.distance}</span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">{trip.budget}</span>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-8">
            {/* Highlights */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Bu Kaçamakta Seni Neler Bekliyor</h2>
              <ul className="space-y-3">
                {trip.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                    <span className="mt-1 w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Tips */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">💡 Hızlı İpuçları</h2>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 shrink-0">🕐</span>
                  <span>En iyi seyahat zamanı: <strong className="text-gray-800 dark:text-gray-200">Hafta içi</strong> (daha sakin ve ucuz)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 shrink-0">🎒</span>
                  <span>Yanında <strong className="text-gray-800 dark:text-gray-200">sırt çantası</strong> yeterli — bavula gerek yok</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 shrink-0">🌤️</span>
                  <span>Hava durumunu kontrol et, mevsime göre hazırlan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 shrink-0">🚗</span>
                  <span>Kiralık araç veya <strong className="text-gray-800 dark:text-gray-200">toplu taşıma</strong> ile ulaşım mümkün</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Bu Kaçamak</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p><strong className="text-gray-800 dark:text-gray-200">Süre:</strong> {trip.duration}</p>
                <p><strong className="text-gray-800 dark:text-gray-200">Bütçe:</strong> {trip.budget}</p>
                <p><strong className="text-gray-800 dark:text-gray-200">Mesafe:</strong> {trip.distance}</p>
                <p><strong className="text-gray-800 dark:text-gray-200">Vibe:</strong> {trip.vibe === 'digital-detox' ? '📵 ' : ''}{trip.vibe}</p>
              </div>
            </div>

            <button
              onClick={() => setSaved(!saved)}
              className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 
                ${saved
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                }`}
            >
              {saved ? '✓ Kaydedildi' : '♡ Favorilere Ekle'}
            </button>

            <Link
              href={`/reservation?adventure=${trip.id}`}
              className="block w-full py-3 px-6 rounded-xl font-medium text-center 
                bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg 
                hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
            >
              Bu Kaçamağı Planla
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
