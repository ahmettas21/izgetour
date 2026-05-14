'use client';

import { useState } from 'react';
import {
  CloudSun, Cloud, Sun, Wind, Thermometer,
  Calendar, MapPin, Music, ChevronDown, ChevronUp,
} from 'lucide-react';

interface WeatherDay {
  date: string;
  label: string;
  icon: React.ElementType;
  tempHigh: number;
  tempLow: number;
  condition: string;
  conditionEn: string;
}

interface LocalEvent {
  name: string;
  nameEn: string;
  date: string;
  type: 'festival' | 'concert' | 'market' | 'exhibit';
  location: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  weather: WeatherDay;
  events: LocalEvent[];
}

const MOCK_ITINERARY: ItineraryDay[] = [
  {
    day: 1, title: 'Varış & Şehir Turu', titleEn: 'Arrival & City Tour',
    description: 'Havalimanı transferi, otel check-in, tarihi merkez yürüyüşü',
    descriptionEn: 'Airport transfer, hotel check-in, historic center walking tour',
    weather: {
      date: '2026-07-10', label: 'Perşembe', icon: Sun,
      tempHigh: 32, tempLow: 22, condition: 'Güneşli', conditionEn: 'Sunny',
    },
    events: [
      { name: 'Antalya Caz Festivali', nameEn: 'Antalya Jazz Festival',
        date: '2026-07-10', type: 'festival', location: 'Kaleiçi' },
    ],
  },
  {
    day: 2, title: 'Antik Kent Gezisi', titleEn: 'Ancient City Visit',
    description: 'Perge, Aspendos antik tiyatro ve Kurşunlu Şelalesi',
    descriptionEn: 'Perge, Aspendos ancient theater and Kurşunlu Waterfall',
    weather: {
      date: '2026-07-11', label: 'Cuma', icon: CloudSun,
      tempHigh: 30, tempLow: 21, condition: 'Parçalı bulutlu', conditionEn: 'Partly cloudy',
    },
    events: [
      { name: 'Yerel Pazar Günü', nameEn: 'Local Market Day',
        date: '2026-07-11', type: 'market', location: 'Aspendos Köyü' },
    ],
  },
  {
    day: 3, title: 'Tekne Turu & Serbest', titleEn: 'Boat Tour & Free Time',
    description: '12 ada tekne turu, yüzme, akşam serbest gezi ve alışveriş',
    descriptionEn: '12 islands boat tour, swimming, evening free & shopping',
    weather: {
      date: '2026-07-12', label: 'Cumartesi', icon: Cloud,
      tempHigh: 28, tempLow: 20, condition: 'Bulutlu', conditionEn: 'Cloudy',
    },
    events: [
      { name: 'Gece Müzik Konseri', nameEn: 'Night Music Concert',
        date: '2026-07-12', type: 'concert', location: 'Marina' },
    ],
  },
];

const EVENT_COLORS: Record<string, string> = {
  festival: 'bg-purple-100 text-purple-700',
  concert: 'bg-rose-100 text-rose-700',
  market: 'bg-emerald-100 text-emerald-700',
  exhibit: 'bg-blue-100 text-blue-700',
};

const EVENT_ICONS: Record<string, React.ElementType> = {
  festival: Music,
  concert: Music,
  market: MapPin,
  exhibit: Calendar,
};

interface Props {
  locale?: string;
}

export default function SmartItinerary({ locale = 'tr' }: Props) {
  const [expanded, setExpanded] = useState<number | null>(0);
  const isTr = locale === 'tr';

  const toggle = (day: number) =>
    setExpanded((prev) => (prev === day ? null : day));

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-zinc-900">
          {isTr ? '🗓️ Akıllı Seyahat Planı' : '🗓️ Smart Itinerary'}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          {isTr
            ? 'Hava durumu ve yerel etkinlikler entegre edildi'
            : 'Weather forecasts & local events integrated'}
        </p>
      </div>

      <div className="space-y-3">
        {MOCK_ITINERARY.map((item) => {
          const isOpen = expanded === item.day;
          const WeatherIcon = item.weather.icon;
          return (
            <div
              key={item.day}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow hover:shadow-sm"
            >
              {/* Header */}
              <button
                onClick={() => toggle(item.day)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0066CC] text-sm font-bold text-white">
                  {item.day}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-zinc-900">
                    {isTr ? item.title : item.titleEn}
                  </div>
                  <div className="mt-0.5 text-xs text-zinc-400">
                    {item.weather.date} — {item.weather.label}
                  </div>
                </div>
                {/* Mini weather badge */}
                <div className="flex items-center gap-1.5 rounded-lg bg-zinc-50 px-2.5 py-1.5">
                  <WeatherIcon className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-medium text-zinc-700">
                    {item.weather.tempHigh}°
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                )}
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t border-zinc-100 px-5 pb-5 pt-4">
                  <p className="mb-4 text-sm text-zinc-600">
                    {isTr ? item.description : item.descriptionEn}
                  </p>

                  {/* Weather card */}
                  <div className="mb-4 flex items-center gap-4 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 p-4">
                    <WeatherIcon className="h-8 w-8 text-sky-500" />
                    <div>
                      <div className="text-sm font-semibold text-zinc-800">
                        {isTr ? item.weather.condition : item.weather.conditionEn}
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Thermometer className="h-3 w-3" />
                          {item.weather.tempHigh}° / {item.weather.tempLow}°
                        </span>
                        <span className="flex items-center gap-1">
                          <Wind className="h-3 w-3" /> 12 km/h
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Local events */}
                  {item.events.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase text-zinc-400">
                        {isTr ? 'Yakındaki Etkinlikler' : 'Nearby Events'}
                      </h4>
                      <div className="space-y-2">
                        {item.events.map((ev) => {
                          const EvIcon = EVENT_ICONS[ev.type] ?? Calendar;
                          return (
                            <div
                              key={ev.name}
                              className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3"
                            >
                              <div className={`rounded-lg p-1.5 ${EVENT_COLORS[ev.type]}`}>
                                <EvIcon className="h-3.5 w-3.5" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-zinc-700">
                                  {isTr ? ev.name : ev.nameEn}
                                </div>
                                <div className="text-xs text-zinc-400">
                                  📍 {ev.location}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
