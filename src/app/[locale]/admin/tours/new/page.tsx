'use client';

import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import TourEditor from '@/components/Admin/TourEditor';

export default function AdminNewTourPage() {
  const t = useTranslations('admin');
  const locale = useLocale();

  const handleSave = (tour: { title: string }) => {
    // In a real app, save to backend
     
    console.log('Tour saved:', tour);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href={`/${locale}/admin`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-800"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('backToDashboard')}
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">{t('createNewTour')}</h1>
        <p className="mt-1 text-sm text-zinc-500">{t('createNewTourDesc')}</p>
      </div>

      {/* Editor */}
      <TourEditor onSave={handleSave} />
    </div>
  );
}
