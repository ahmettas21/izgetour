'use client';

import { useTranslations } from 'next-intl';
import { Shield, Headphones, Award } from 'lucide-react';

const FEATURES = [
  {
    key: 'secure',
    icon: Shield,
    color: 'text-blue-500 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    key: 'support',
    icon: Headphones,
    color: 'text-emerald-500 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    key: 'quality',
    icon: Award,
    color: 'text-amber-500 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
];

export default function Features() {
  const t = useTranslations('features');

  return (
    <section className="bg-gray-50 py-14 sm:py-20 lg:py-24 dark:bg-gray-800/50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, icon: Icon, color, bg }) => (
            <div
              key={key}
              className="group rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-gray-900"
            >
              <div
                className={`mb-4 inline-flex rounded-xl p-3 ${bg} ${color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {t(`${key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {t(`${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
