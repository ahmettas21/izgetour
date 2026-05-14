'use client';

import React, { useState } from 'react';
import { Mic, Volume2, MapPin } from 'lucide-react';

interface MapLocation {
  id: string;
  name: string;
  nameEn: string;
  desc: string;
  descEn: string;
  top: string;
  left: string;
  duration?: string; // optional voice guide duration
}

interface Props {
  locale?: string;
  destination?: string; // e.g. 'Nevşehir', 'İstanbul', 'Antalya'
}

/** Destination → map waypoints mapping */
const DESTINATION_MAP: Record<string, MapLocation[]> = {
  'Nevşehir': [
    { id: '1', name: 'Göreme Açık Hava Müzesi', nameEn: 'Göreme Open Air Museum', desc: 'UNESCO listesindeki kayalık kiliseler ve freskolar.', descEn: 'Rock-cut churches and frescoes on the UNESCO list.', top: '38%', left: '44%', duration: '3 dk' },
    { id: '2', name: 'Derinkuyu Yeraltı Şehri', nameEn: 'Derinkuyu Underground City', desc: '8 kata kadar inen devasa yeraltı şehri.', descEn: 'Massive underground city reaching up to 8 floors deep.', top: '41%', left: '46%', duration: '5 dk' },
    { id: '3', name: 'Uçhisar Kalesi', nameEn: 'Uçhisar Castle', desc: 'Kapadokya\'nın en yüksek noktasından panoramik manzara.', descEn: 'Panoramic views from the highest point in Cappadocia.', top: '39%', left: '43%', duration: '2 dk' },
    { id: '4', name: 'Avanos Çömlek Atölyesi', nameEn: 'Avanos Pottery Workshop', desc: 'Kırmızı kil ile geleneksel çömlek yapımı.', descEn: 'Traditional pottery making with red clay.', top: '42%', left: '47%', duration: '2 dk' },
  ],
  'İzmir': [
    { id: '1', name: 'Celsus Kütüphanesi', nameEn: 'Library of Celsus', desc: 'Roma döneminden kalma muhteşem korunmuş kütüphane.', descEn: 'Magnificently preserved library from the Roman period.', top: '58%', left: '19%', duration: '4 dk' },
    { id: '2', name: 'Antik Tiyatro', nameEn: 'Ancient Theatre', desc: '25.000 kişilik antik tiyatro, Roma döneminden.', descEn: '25,000-seat ancient theatre from the Roman era.', top: '59%', left: '20%', duration: '3 dk' },
    { id: '3', name: 'Meryem Ana Evi', nameEn: 'House of Virgin Mary', desc: 'Hristiyan hac mekanı olarak kabul edilen yapı.', descEn: 'Structure accepted as a Christian pilgrimage site.', top: '57%', left: '18%', duration: '2 dk' },
  ],
  'Denizli': [
    { id: '1', name: 'Pamukkale Travertenleri', nameEn: 'Pamukkale Travertines', desc: 'UNESCO Dünya Mirası beyaz travertenler.', descEn: 'UNESCO World Heritage white travertine terraces.', top: '64%', left: '29%', duration: '5 dk' },
    { id: '2', name: 'Hierapolis Antik Kenti', nameEn: 'Hierapolis Ancient City', desc: '2.000 yıllık antik kent kalıntıları.', descEn: '2,000-year-old ancient city ruins.', top: '63%', left: '30%', duration: '6 dk' },
    { id: '3', name: 'Kleopatra Havuzu', nameEn: 'Cleopatra Pool', desc: 'Antik dönemden kalma doğal termal havuz.', descEn: 'Natural thermal pool from ancient times.', top: '65%', left: '31%', duration: '3 dk' },
  ],
  'İstanbul': [
    { id: '1', name: 'Ayasofya', nameEn: 'Hagia Sophia', desc: 'Bizans ve Osmanlı mimarisinin başyapıtı.', descEn: 'Masterpiece of Byzantine and Ottoman architecture.', top: '28%', left: '43%', duration: '5 dk' },
    { id: '2', name: 'Sultanahmet Camii', nameEn: 'Sultan Ahmed Mosque', desc: 'Mavi İznik çinileriyle ünlü tarihi cami.', descEn: 'Historic mosque famous for its blue İznik tiles.', top: '29%', left: '44%', duration: '3 dk' },
    { id: '3', name: 'Kapalıçarşı', nameEn: 'Grand Bazaar', desc: 'Dünyanın en eski kapalı çarşılarından biri.', descEn: 'One of the oldest covered markets in the world.', top: '30%', left: '42%', duration: '4 dk' },
    { id: '4', name: 'Topkapı Sarayı', nameEn: 'Topkapi Palace', desc: 'Osmanlı İmparatorluğu\'nun yönetim merkezi.', descEn: 'Administrative center of the Ottoman Empire.', top: '28%', left: '45%', duration: '5 dk' },
  ],
  'Antalya': [
    { id: '1', name: 'Olympos Antik Kenti', nameEn: 'Olympos Ancient City', desc: 'Likya döneminden kalma antik liman şehri.', descEn: 'Ancient port city from the Lycian period.', top: '58%', left: '40%', duration: '4 dk' },
    { id: '2', name: 'Yanartaş (Chimaera)', nameEn: 'Yanartaş (Chimaera)', desc: 'Antik çağdan beri yanan doğal alevler.', descEn: 'Natural flames burning since ancient times.', top: '59%', left: '41%', duration: '2 dk' },
    { id: '3', name: 'Cirali Sahili', nameEn: 'Cirali Beach', desc: 'Koruma altındaki CAREZZA kaplumbağaları ile ünlü plaj.', descEn: 'Beach famous for protected CAREZZA turtles.', top: '60%', left: '40%', duration: '2 dk' },
  ],
  'Ankara': [
    { id: '1', name: 'Anıtkabir', nameEn: 'Anitkabir', desc: 'Mustafa Kemal Atatürk\'ün mozolesi ve anıt.', descEn: 'Mausoleum and monument of Mustafa Kemal Atatürk.', top: '36%', left: '51%', duration: '5 dk' },
    { id: '2', name: 'Anadolu Medeniyetleri Müzesi', nameEn: 'Museum of Anatolian Civilizations', desc: 'Hitit, Frig, Lidya dönemine ait eserler.', descEn: 'Artifacts from Hittite, Phrygian, Lydian periods.', top: '37%', left: '50%', duration: '4 dk' },
    { id: '3', name: 'Ankara Kalesi', nameEn: 'Ankara Castle', desc: 'Roma döneminden kalma tarihi kale.', descEn: 'Historic castle dating from the Roman period.', top: '36%', left: '52%', duration: '3 dk' },
  ],
};

/** Default Turkey map when no destination matches */
const DEFAULT_LOCATIONS: MapLocation[] = [
  { id: '1', name: 'Kapadokya', nameEn: 'Cappadocia', desc: 'Peri bacaları ve yeraltı şehirleri.', descEn: 'Fairy chimneys and underground cities.', top: '40%', left: '45%' },
  { id: '2', name: 'İstanbul', nameEn: 'Istanbul', desc: 'Doğu ile Batı\'nın kesiştiği şehir.', descEn: 'City where East meets West.', top: '28%', left: '43%' },
  { id: '3', name: 'Antalya', nameEn: 'Antalya', desc: 'Türkiye\'nin turizm başkenti.', descEn: 'Tourism capital of Turkey.', top: '58%', left: '40%' },
];

export default function VoiceInteractiveMap({ locale = 'tr', destination }: Props) {
  const isTr = locale === 'tr';
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  const locations = destination
    ? (DESTINATION_MAP[destination] ?? DESTINATION_MAP[destination.split(' ')[0]] ?? DEFAULT_LOCATIONS)
    : DEFAULT_LOCATIONS;

  const handleToggleVoice = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      setActiveLocation(locations[0]?.id ?? null);
    } else {
      setIsPlaying(false);
      setActiveLocation(null);
    }
  };

  const activeLoc = locations.find(l => l.id === activeLocation);

  return (
    <div className="relative w-full h-[400px] bg-blue-50 rounded-xl overflow-hidden border border-zinc-200">
      {/* Background map */}
      <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Turkey_location_map.svg/800px-Turkey_location_map.svg.png')] bg-cover bg-center opacity-40" />

      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-zinc-100 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#0066CC]" />
          <span className="text-sm font-semibold text-zinc-700">
            {isTr ? 'Sesli Rehber Haritası' : 'Voice-Guided Map'}
            {destination && <span className="ml-1 text-[#0066CC]"> — {destination}</span>}
          </span>
        </div>
        <span className="text-xs text-zinc-400">
          {locations.length} {isTr ? 'durak' : 'stops'}
        </span>
      </div>

      {/* Voice control */}
      <div className="absolute top-14 left-4 z-10">
        <button
          onClick={handleToggleVoice}
          className={`flex items-center gap-2 px-4 py-2 rounded-full shadow transition ${
            isPlaying
              ? 'bg-[#0066CC] text-white'
              : 'bg-white text-zinc-600 hover:bg-zinc-50 border border-zinc-200'
          }`}
        >
          {isPlaying ? (
            <><Volume2 className="h-4 w-4 animate-pulse" /> <span className="text-sm font-medium">{isTr ? 'Rehber Dinleniyor...' : 'Guide Playing...'}</span></>
          ) : (
            <><Mic className="h-4 w-4" /> <span className="text-sm font-medium">{isTr ? 'Sesli Rehberi Başlat' : 'Start Voice Guide'}</span></>
          )}
        </button>

        {/* Active location description */}
        {isPlaying && activeLoc && (
          <div className="mt-2 max-w-[220px] bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2.5 text-sm text-zinc-700 shadow-lg border border-zinc-100">
            <p className="font-semibold text-[#0066CC] mb-1">{isTr ? activeLoc.name : activeLoc.nameEn}</p>
            <p className="text-xs text-zinc-500 leading-relaxed">{isTr ? activeLoc.desc : activeLoc.descEn}</p>
            {activeLoc.duration && (
              <p className="mt-1 text-xs text-zinc-400 flex items-center gap-1">
                <Volume2 className="h-3 w-3" /> {activeLoc.duration}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Map markers */}
      {locations.map((loc) => (
        <div
          key={loc.id}
          className={`absolute flex flex-col items-center cursor-pointer transition-all ${
            activeLocation === loc.id ? 'scale-110 z-30' : 'scale-100 z-20'
          }`}
          style={{ top: loc.top, left: loc.left }}
          onClick={() => { setActiveLocation(loc.id); setIsPlaying(true); }}
        >
          {/* Label */}
          <div className={`px-2 py-1 rounded-lg text-xs font-bold shadow-md whitespace-nowrap border-2 ${
            activeLocation === loc.id
              ? 'bg-[#0066CC] text-white border-white'
              : 'bg-white text-zinc-700 border-zinc-100 hover:border-[#0066CC]'
          }`}>
            {isTr ? loc.name : loc.nameEn}
          </div>
          {/* Pin */}
          <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md mt-1 ${
            activeLocation === loc.id ? 'bg-orange-500 animate-bounce' : 'bg-[#0066CC]'
          }`} />

          {/* Audio wave indicator */}
          {isPlaying && activeLocation === loc.id && (
            <div className="absolute -bottom-7 flex items-end gap-1">
              {[2, 4, 3, 5, 2].map((h, i) => (
                <span key={i} className="w-1 bg-orange-500 rounded-t animate-pulse" style={{ height: `${h * 3}px`, animationDelay: `${i * 75}ms` }} />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Bottom badge */}
      <div className="absolute bottom-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-zinc-500 shadow border border-zinc-100 flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5" />
        {isTr ? 'Türkiye Tur Rotası' : 'Turkey Tour Route'}
      </div>
    </div>
  );
}
