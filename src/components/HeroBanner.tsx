'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import SmartSearchContainer from '@/components/SmartSearchContainer';

interface HeroBannerProps {
  locale?: string;
}

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1920&q=80',
  'https://images.unsplash.com/photo-1593352216840-1aee13f45818?w=1920&q=80',
  'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=1920&q=80',
];

export default function HeroBanner({ locale = 'tr' }: HeroBannerProps) {
  const t = useTranslations('hero');
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[600px] overflow-hidden sm:min-h-[700px] lg:min-h-[750px]">
      {/* Background images */}
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${src})` }}
          />
        </div>
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 dark:from-black/90 dark:via-black/70 dark:to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent dark:from-blue-900/40" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[600px] flex-col items-center justify-center px-4 sm:min-h-[700px] lg:min-h-[750px]">
        {/* Text */}
        <div className="mb-8 text-center sm:mb-10">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {t('title')}
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/80 md:text-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* Search form — hero'nun göbeğinde */}
        <div className="w-full max-w-4xl">
          <SmartSearchContainer />
        </div>

        {/* Slide indicators — search'in altına */}
        <div className="mt-10 flex gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
