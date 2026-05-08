import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export const metadata = (): Metadata => ({ title: 'Uçuşlar' });

export default async function FlightsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = await getTranslations('flights');

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-zinc-900">{t('title')}</h1>
      <p className="mt-4 text-lg text-zinc-600">{t('subtitle')}</p>
      <div className="mt-12 rounded-2xl bg-zinc-100 p-12">
        <p className="text-zinc-500">Uçuş arama özelliği yakında aktif.</p>
      </div>
    </div>
  );
}