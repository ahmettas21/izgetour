'use client';

import { Link } from '@/i18n/navigation';
import { SEHIRLER } from '@/data/sehirler';
import { Plane, Building2, Compass, Map } from 'lucide-react';

type Props = {
  locale: 'tr' | 'en';
  currentSlug?: string;
};

const linkGroups = [
  { icon: Plane, label: 'uçak_bileti', labelEn: 'Flight', getPath: (slug: string) => `/ucak-bileti/${slug}` },
  { icon: Building2, label: 'oteller', labelEn: 'Hotels', getPath: (slug: string) => `/${slug}-otelleri` },
  { icon: Compass, label: 'turlar', labelEn: 'Tours', getPath: (slug: string) => `/${slug}-turlari` },
  { icon: Map, label: 'gezilecek_yerler', labelEn: 'Places', getPath: (slug: string) => `/blog/${slug}-gezilecek-yerler` },
];

export default function SeoHizliLinkler({ locale, currentSlug }: Props) {
  const t = (tr: string, en: string) => (locale === 'tr' ? tr : en);

  return (
    <section className="border-t border-zinc-100 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-center text-xl font-bold text-zinc-900 dark:text-white">
          {t('Hızlı Bağlantılar', 'Quick Links')}
        </h2>

        {/* Şehirler arası linkler */}
        <div className="mb-10">
          <h3 className="mb-4 text-center text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {t('Popüler Şehirler', 'Popular Cities')}
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {SEHIRLER.map((sehir) => {
              const isActive = sehir.slug === currentSlug;
              return (
                <Link
                  key={sehir.slug}
                  href={`/${sehir.slug}`}
                  className={`rounded-lg px-3 py-2 text-center text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#0066CC] text-white shadow-sm dark:bg-[#3399ff]'
                      : 'bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  }`}
                >
                  {sehir.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Kategori bazlı linkler */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {linkGroups.map((group) => (
            <div key={group.label} className="rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-800">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0066CC]/10 dark:bg-[#3399ff]/20">
                  <group.icon className="h-4 w-4 text-[#0066CC] dark:text-[#3399ff]" />
                </div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {t(group.label, group.labelEn)}
                </h4>
              </div>
              <div className="space-y-1.5">
                {SEHIRLER.map((sehir) => (
                  <Link
                    key={sehir.slug}
                    href={group.getPath(sehir.slug)}
                    className="block text-xs text-zinc-500 transition-colors hover:text-[#0066CC] dark:text-zinc-400 dark:hover:text-[#3399ff]"
                  >
                    {sehir.name} {t(group.label, group.labelEn).toLowerCase()}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
