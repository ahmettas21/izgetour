'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Globe } from 'lucide-react';

// Strip locale prefix from pathname so router.replace works correctly
function useLocalePathname() {
  const pathname = usePathname();
  // remove leading locale segment (e.g. "/tr/tours" -> "/tours")
  return pathname.replace(/^\/(tr|en)/, '') || '/';
}

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = useLocalePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="relative">
      <button
        onClick={() => switchLocale(locale === 'tr' ? 'en' : 'tr')}
        className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-[#0066CC] hover:text-[#0066CC]"
        title={locale === 'tr' ? 'English' : 'Türkçe'}
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{locale}</span>
      </button>
    </div>
  );
}