import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export const metadata = (): Metadata => ({
  title: 'Hakkımızda',
  description: 'İzgetour hakkında bilgi edinin.',
});

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{t('title')}</h1>
        <p className="text-lg text-gray-700 mb-4">{t('description')}</p>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('feature1_title')}</h3>
            <p className="text-gray-600 text-sm">{t('feature1_desc')}</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('feature2_title')}</h3>
            <p className="text-gray-600 text-sm">{t('feature2_desc')}</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('feature3_title')}</h3>
            <p className="text-gray-600 text-sm">{t('feature3_desc')}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
