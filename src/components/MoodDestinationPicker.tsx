'use client';

import { useState } from 'react';
import {
  Mountain, Heart, Palmtree, Landmark, Sparkles,
  Tent, Wine, Camera, ChevronRight,
} from 'lucide-react';

interface Mood {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  gradient: string;
  destinations: Destination[];
}

interface Destination {
  name: string;
  nameEn: string;
  image: string;
  tagline: string;
  taglineEn: string;
  match: number; // 0-100
}

const MOODS: Mood[] = [
  {
    id: 'adventure', name: 'Macera', nameEn: 'Adventure',
    emoji: '🏔️', icon: Mountain, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/30',
    gradient: 'from-orange-500 to-amber-500',
    destinations: [
      { name: 'Kapadokya', nameEn: 'Cappadocia', image: '/images/cappadocia.jpg',
        tagline: 'Balon, vadi, macera!', taglineEn: 'Balloons, valleys, adventure!', match: 97 },
      { name: 'Kaçkar Dağları', nameEn: 'Kaçkar Mountains', image: '/images/kackar.jpg',
        tagline: 'Doğanın zirvesi', taglineEn: 'Peak of nature', match: 92 },
    ],
  },
  {
    id: 'romantic', name: 'Romantik', nameEn: 'Romantic',
    emoji: '💕', icon: Heart, color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/30',
    gradient: 'from-rose-500 to-pink-500',
    destinations: [
      { name: 'Santorini', nameEn: 'Santorini', image: '/images/santorini.jpg',
        tagline: 'Gün batımı cennet', taglineEn: 'Sunset paradise', match: 98 },
      { name: 'Safranbolu', nameEn: 'Safranbolu', image: '/images/safranbolu.jpg',
        tagline: 'Osmanlı romantizmi', taglineEn: 'Ottoman romance', match: 88 },
    ],
  },
  {
    id: 'relax', name: 'Huzur', nameEn: 'Relaxation',
    emoji: '🌴', icon: Palmtree, color: 'text-teal-500 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-900/30',
    gradient: 'from-teal-500 to-cyan-500',
    destinations: [
      { name: 'Maldivler', nameEn: 'Maldives', image: '/images/maldives.jpg',
        tagline: 'Turkuaz huzuru', taglineEn: 'Turquoise tranquility', match: 99 },
      { name: 'Ölüdeniz', nameEn: 'Ölüdeniz', image: '/images/oludeniz.jpg',
        tagline: 'Mavi lagün keyfi', taglineEn: 'Blue lagoon bliss', match: 94 },
    ],
  },
  {
    id: 'culture', name: 'Kültür', nameEn: 'Culture',
    emoji: '🏛️', icon: Landmark, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30',
    gradient: 'from-purple-500 to-indigo-500',
    destinations: [
      { name: 'Roma', nameEn: 'Rome', image: '/images/rome.jpg',
        tagline: 'Tarihin başkenti', taglineEn: 'Capital of history', match: 96 },
      { name: 'Efes', nameEn: 'Ephesus', image: '/images/ephesus.jpg',
        tagline: 'Antik dünyaya yolculuk', taglineEn: 'Journey to the ancient world', match: 91 },
    ],
  },
  {
    id: 'gastro', name: 'Gastronomi', nameEn: 'Gastronomy',
    emoji: '🍷', icon: Wine, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/30',
    gradient: 'from-red-500 to-rose-500',
    destinations: [
      { name: 'Gaziantep', nameEn: 'Gaziantep', image: '/images/gaziantep.jpg',
        tagline: 'Lezzet başkenti', taglineEn: 'Capital of flavors', match: 99 },
      { name: 'Toscana', nameEn: 'Tuscany', image: '/images/tuscany.jpg',
        tagline: 'Şarap ve güneş', taglineEn: 'Wine and sunshine', match: 93 },
    ],
  },
  {
    id: 'wild', name: 'Doğa & Kamp', nameEn: 'Nature & Camp',
    emoji: '⛺', icon: Tent, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/30',
    gradient: 'from-green-500 to-emerald-500',
    destinations: [
      { name: 'Olympos', nameEn: 'Olympos', image: '/images/olympos.jpg',
        tagline: 'Ağaç evler & deniz', taglineEn: 'Treehouses & sea', match: 95 },
      { name: 'Bolu Yedigöller', nameEn: 'Bolu Seven Lakes', image: '/images/yedigoller.jpg',
        tagline: 'Yedi göl, bin renk', taglineEn: 'Seven lakes, a thousand colors', match: 90 },
    ],
  },
];

interface Props { locale?: string; }

export default function MoodDestinationPicker({ locale = 'tr' }: Props) {
  const isTr = locale === 'tr';
  const [activeMood, setActiveMood] = useState<Mood | null>(null);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header */}
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-orange-500 dark:text-orange-400" />
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
          {isTr ? 'Moduna Göre Keşfet' : 'Discover by Mood'}
        </h2>
      </div>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        {isTr ? 'Nasıl hissediyorsun? Sana en uygun destinasyonu bulalım.' : "How do you feel? Let's find the perfect destination."}
      </p>

      {/* Mood Grid */}
      <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {MOODS.map(m => {
          const active = activeMood?.id === m.id;
          return (
            <button key={m.id} onClick={() => setActiveMood(active ? null : m)}
              className={`group flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                active ? `border-transparent bg-gradient-to-br ${m.gradient} text-white shadow-lg scale-105`
                  : 'border-zinc-100 dark:border-zinc-700 hover:border-zinc-200 dark:hover:border-zinc-600 hover:shadow-sm'}`}>
              <span className="text-2xl">{m.emoji}</span>
              <span className={`text-xs font-semibold ${active ? 'text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>
                {isTr ? m.name : m.nameEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* Destination Results */}
      {activeMood && (
        <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
          <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {isTr ? `${activeMood.emoji} ${activeMood.name} için öneriler` : `${activeMood.emoji} Picks for ${activeMood.nameEn}`}
          </h3>
          {activeMood.destinations.map(d => (
            <button key={d.name}
              className="flex w-full items-center gap-4 rounded-xl border border-zinc-100 dark:border-zinc-700 p-4 text-left transition hover:border-zinc-200 dark:hover:border-zinc-600 hover:shadow-sm">
              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-700">
                <Camera className="m-auto mt-4 h-6 w-6 text-zinc-300 dark:text-zinc-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{isTr ? d.name : d.nameEn}</div>
                <div className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">{isTr ? d.tagline : d.taglineEn}</div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold bg-gradient-to-r ${activeMood.gradient} bg-clip-text text-transparent`}>
                  %{d.match}
                </div>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500">{isTr ? 'eşleşme' : 'match'}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
