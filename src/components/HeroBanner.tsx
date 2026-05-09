'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Search, Phone, ChevronDown } from 'lucide-react';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1920&q=80',
  'https://images.unsplash.com/photo-1593352216840-1aee13f45818?w=1920&q=80',
  'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=1920&q=80',
];

export default function HeroBanner() {
  const t = useTranslations('hero');
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
          {t('title')}
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-white/80 md:text-xl">
          {t('subtitle')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/tours"
            className="group flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
          >
            <Search className="h-5 w-5" />
            <span>{t('ctaTours')}</span>
          </Link>
          <a
            href="tel:+905555555555"
            className="flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-8 py-3 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <Phone className="h-5 w-5" />
            <span>{t('ctaCall')}</span>
          </a>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 flex gap-2">
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

      {/* Scroll indicator */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-white/60" />
      </div>
    </section>
  );
}
