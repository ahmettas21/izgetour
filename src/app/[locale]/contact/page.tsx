import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export const metadata = (): Metadata => ({
  title: 'İletişim',
  description: 'İzgetour ile iletişime geçin.',
});

export default async function ContactPage() {
  const t = await getTranslations('contact');

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{t('title')}</h1>
        <p className="text-lg text-gray-700 mb-8">{t('description')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('form_title')}</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('message')}</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" />
              </div>
              <button type="submit" className="w-full bg-[#0066CC] text-white font-semibold py-3 rounded-lg hover:bg-[#0052a3] transition-colors">
                {t('submit')}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">{t('email_us')}</h3>
              <p className="text-gray-600">info@izgetour.com</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">{t('call_us')}</h3>
              <p className="text-gray-600">+90 212 555 0100</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">{t('address')}</h3>
              <p className="text-gray-600">İstanbul, Türkiye</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
