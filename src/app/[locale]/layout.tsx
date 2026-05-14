import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import ServiceWorkerRegister from '@/components/pwa/ServiceWorkerRegister';
import OfflineBanner from '@/components/OfflineBanner';
import ThemeProvider from '@/components/ThemeProvider';
import AIChatConciergeWrapper from '@/components/AIChatConciergeWrapper';
import LiveSupport from '@/components/LiveSupport';
import type { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    template: '%s | İzgetour',
    default: 'İzgetour – Türkiye Turizm Platformu',
  },
  manifest: '/manifest.webmanifest',
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'tr' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <ServiceWorkerRegister />
        <OfflineBanner />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <InstallPrompt />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <AIChatConciergeWrapper locale={locale as 'tr' | 'en'} />
            <LiveSupport />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
