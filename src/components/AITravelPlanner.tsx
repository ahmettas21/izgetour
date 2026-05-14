'use client';

import React, { useState } from 'react';

type PlannerState = 'idle' | 'planning' | 'done';

interface Props {
  locale?: 'tr' | 'en';
}

const STRINGS = {
  tr: {
    title: 'AI Seyahat Planlayıcı',
    subtitle: 'Hayalinizdeki rotayı bütçenize göre tasarlayalım.',
    budgetLabel: 'Toplam Bütçe ($)',
    budgetPlaceholder: 'Örn: 1500',
    interestsLabel: 'İlgi Alanları',
    interestsPlaceholder: 'Antik kentler, deniz, yerel lezzetler...',
    planButton: 'Planla ✈️',
    planningText: 'Bütçenize uygun uçak, otel ve rota taranıyor...',
    planReady: 'Planınız Hazır!',
    optimal: 'Optimum:',
    addToCart: 'Sepete Ekle',
    regenerate: 'Yeniden Oluştur',
    flight: 'Gidiş-Dönüş (Pegasus - 09:00 Aktarmasız)',
    hotel: '4 Gece Konaklama (Boutique Cave Hotel)',
    tour: '3 Günlük Rehberli Kültür ve Lezzet Turu',
  },
  en: {
    title: 'AI Travel Planner',
    subtitle: "Let's design your dream route based on your budget.",
    budgetLabel: 'Total Budget ($)',
    budgetPlaceholder: 'E.g. 1500',
    interestsLabel: 'Interests',
    interestsPlaceholder: 'Ancient cities, beaches, local cuisine...',
    planButton: 'Plan ✈️',
    planningText: 'Searching flights, hotels and routes within your budget...',
    planReady: 'Your Plan is Ready!',
    optimal: 'Optimal:',
    addToCart: 'Add to Cart',
    regenerate: 'Regenerate',
    flight: 'Round-trip (Pegasus - 09:00 Direct)',
    hotel: '4 Nights Stay (Boutique Cave Hotel)',
    tour: '3-Day Guided Culture & Cuisine Tour',
  },
};

export default function AITravelPlanner({ locale = 'tr' }: Props) {
  const s = STRINGS[locale];
  const [budget, setBudget] = useState('');
  const [interests, setInterests] = useState('');
  const [state, setState] = useState<PlannerState>('idle');

  const handlePlan = () => {
    setState('planning');
    setTimeout(() => setState('done'), 2500);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{s.title}</h2>
          <p className="text-sm text-gray-500">{s.subtitle}</p>
        </div>
      </div>

      {state === 'idle' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{s.budgetLabel}</label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={s.budgetPlaceholder}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{s.interestsLabel}</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={s.interestsPlaceholder}
              rows={3}
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </div>
          <button
            onClick={handlePlan}
            disabled={!budget || !interests}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {s.planButton}
          </button>
        </div>
      )}

      {state === 'planning' && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <p className="text-gray-600 font-medium">{s.planningText}</p>
        </div>
      )}

      {state === 'done' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-green-800 mb-2">
              {s.planReady} ({s.optimal} ${parseInt(budget) - 150})
            </h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex items-center gap-2">🛫 {s.flight}</li>
              <li className="flex items-center gap-2">🏨 {s.hotel}</li>
              <li className="flex items-center gap-2">🗺️ {s.tour}</li>
            </ul>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors">
              {s.addToCart}
            </button>
            <button
              onClick={() => setState('idle')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition-colors"
            >
              {s.regenerate}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
