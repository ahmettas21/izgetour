import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

const BASE_URL = 'https://izgetour.com';

export default async function sitemap() {
  const { locales } = routing;
  
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${BASE_URL}/tours`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${BASE_URL}/flights`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.5 },
  ];

  const tourSlugs = [
    'kapadokya-gunu-birakti',
    'efes-antik-kenti',
    'pamukkale-gunubirlik',
    'istanbul-bus-turu',
    'akdeniz-gemi-turu',
    'antalya-sahil-turu',
  ];

  const localesFlat = [...locales];
  const sitemapEntries = [...staticPages];

  for (const locale of localesFlat) {
    for (const tour of tourSlugs) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/tours/${tour}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      });
    }
  }

  return sitemapEntries;
}
