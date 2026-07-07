import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getEnabledRoutes } from '@/db/repository';
import { routeUrl } from '@/lib/seo';

const BASE_URL = 'https://izgetour.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
  const sitemapEntries: MetadataRoute.Sitemap = [...staticPages];

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

  // ─── Dinamik rota landing sayfaları (programmatic SEO) ────────────────────
  // localePrefix: 'as-needed' → TR prefix'siz, EN prefix'li (routeUrl helper).
  const routes = await getEnabledRoutes();
  for (const route of routes) {
    if (!route.slug) continue;
    for (const locale of localesFlat) {
      sitemapEntries.push({
        url: routeUrl(route.slug, locale),
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route.popular ? 0.9 : 0.7,
      });
    }
  }

  return sitemapEntries;
}
