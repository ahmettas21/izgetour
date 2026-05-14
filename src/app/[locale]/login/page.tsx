import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata = (): Metadata => ({
  title: 'Giriş Yap',
  description: 'İzgetour hesabınıza giriş yapın.',
});

export default async function LoginPage() {
  const t = await getTranslations('login');

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-2">{t('subtitle')}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
              <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
              <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <button type="submit" className="w-full bg-[#0066CC] text-white font-semibold py-3 rounded-lg hover:bg-[#0052a3] transition-colors">
              {t('submit')}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">{t('no_account')}</span>
            <Link href="/register" className="text-[#0066CC] font-medium hover:underline ml-1">{t('register')}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
