import { getTranslations } from 'next-intl/server';
import HotelsPageClient from './HotelsPageClient';
import { hotels } from '@/data/hotels';
import type { Metadata } from 'next';

export const metadata = (): Metadata => ({
  title: 'Oteller',
  description: 'Türkiye genelinde en iyi oteller.',
});

export default async function HotelsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('hotels');

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-zinc-900">{t('title')}</h1>
        <p className="mt-2 text-lg text-zinc-600">{t('subtitle')}</p>
      </div>
      <HotelsPageClient hotels={hotels} locale={locale as 'tr' | 'en'} />
    </div>
  );
}
