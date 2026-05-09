'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Plane, Building2, Compass, Calendar, Users } from 'lucide-react';

type Tab = 'tours' | 'flights' | 'hotels';

const TABS: { key: Tab; label: string; icon: typeof Compass }[] = [
  { key: 'tours', label: 'Tur', icon: Compass },
  { key: 'flights', label: 'Uçak', icon: Plane },
  { key: 'hotels', label: 'Otel', icon: Building2 },
];

export default function SmartSearch() {
  const t = useTranslations('search');
  const [activeTab, setActiveTab] = useState<Tab>('tours');

  return (
    <section className="relative z-20 -mt-16 px-4 pb-12">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex flex-1 items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${
                  activeTab === key
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <div className="p-6">
            {activeTab === 'tours' && <TourSearchForm />}
            {activeTab === 'flights' && <FlightSearchForm />}
            {activeTab === 'hotels' && <HotelSearchForm />}
          </div>
        </div>
      </div>
    </section>
  );
}

function TourSearchForm() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <InputField icon={Compass} placeholder="Nereye?" />
      <DateField placeholder="Gidiş Tarihi" />
      <GuestField />
      <SearchButton />
    </div>
  );
}

function FlightSearchForm() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <InputField icon={Plane} placeholder="Nereden?" />
      <InputField icon={Plane} placeholder="Nereye?" className="rotate-90" />
      <DateField placeholder="Gidiş Tarihi" />
      <DateField placeholder="Dönüş Tarihi" />
      <SearchButton />
    </div>
  );
}

function HotelSearchForm() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <InputField icon={Building2} placeholder="Şehir / Otel Adı" />
      <DateField placeholder="Giriş Tarihi" />
      <GuestField />
      <SearchButton />
    </div>
  );
}

function InputField({
  icon: Icon,
  placeholder,
  className,
}: {
  icon: typeof Compass;
  placeholder: string;
  className?: string;
}) {
  return (
    <div className="relative">
      <Icon
        className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 ${className || ''}`}
      />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800"
      />
    </div>
  );
}

function DateField({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative">
      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="date"
        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800"
        aria-label={placeholder}
      />
    </div>
  );
}

function GuestField() {
  return (
    <div className="relative">
      <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <select className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800">
        <option>1 Kişi</option>
        <option>2 Kişi</option>
        <option>3 Kişi</option>
        <option>4+ Kişi</option>
      </select>
    </div>
  );
}

function SearchButton() {
  const t = useTranslations('search');
  return (
    <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-medium text-white transition-all hover:bg-blue-700">
      <Search className="h-4 w-4" />
      {t('button') || 'Ara'}
    </button>
  );
}
