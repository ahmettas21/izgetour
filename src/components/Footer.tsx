'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Globe, Mail, Phone, AtSign, Share2, Users, Clock } from 'lucide-react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useParams } from 'next/navigation';

const SOCIAL = [
  {
    label: 'Instagram',
    icon: AtSign,
    href: 'https://www.instagram.com/izgetour',
  },
  {
    label: 'Twitter',
    icon: Share2,
    href: 'https://twitter.com/izgetour',
  },
  {
    label: 'Facebook',
    icon: Users,
    href: 'https://www.facebook.com/izgetour',
  },
];

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const { recentlyViewed } = useRecentlyViewed();
  const locale = useParams().locale as string;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-zinc-50 text-zinc-600 dark:bg-zinc-950 dark:text-zinc-400">
      {/* Top wave separator */}
      <div
        className="h-1 w-full"
        style={{
          background:
            'linear-gradient(90deg, var(--brand) 0%, #00a8ff 50%, var(--brand) 100%)',
        }}
      />

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* ── Brand ─────────────────────────────────── */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Globe className="h-7 w-7 text-[var(--brand)]" />
              <span className="text-xl font-bold tracking-tight text-white">
                İzgetour
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              {t('tagline')}
            </p>

            {/* Social icons */}
            <div className="mt-6 flex gap-3">
              {SOCIAL.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-all duration-200 hover:border-[var(--brand)] hover:bg-[var(--brand)] hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ───────────────────────────── */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-white">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-3">
              {(['home', 'tours', 'flights', 'about', 'contact'] as const).map(
                (key) => (
                  <li key={key}>
                    <Link
                      href={key === 'home' ? '/' : `/${key}`}
                      className="group flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
                    >
                      <span className="h-px w-4 bg-zinc-700 transition-all group-hover:w-6 group-hover:bg-[var(--brand)]" />
                      {tNav(key)}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* ── Contact ───────────────────────────────── */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              {t('contactUs')}
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${t('email')}`}
                  className="group flex items-start gap-3 text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                  <span>{t('email')}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${t('phone')}`}
                  className="group flex items-start gap-3 text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                  <span>{t('phone')}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* ── Newsletter ────────────────────────────── */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              Bülten
            </h3>
            <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
              Yeni turlar ve fırsatlardan haberdar olun.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-2"
            >
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[var(--brand)]"
              />
              <button
                type="submit"
                className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-dark)]"
              >
                Abone Ol
              </button>
            </form>
          </div>
        {/* ── Recently Viewed ────────────────────────── */}
          <div>
            <h3 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              <Clock className="h-3.5 w-3.5 text-[var(--brand)]" />
              {t('recentlyViewed')}
            </h3>
            {recentlyViewed.length === 0 ? (
              <p className="text-xs text-zinc-400 dark:text-zinc-500">{t('noRecent')}</p>
            ) : (
              <ul className="space-y-2">
                {recentlyViewed.map((item) => {
                  const title = locale === 'tr' ? item.title : (item.titleEn || item.title);
                  const href =
                    item.type === 'tour' ? `/tours/${item.slug}` :
                    item.type === 'hotel' ? `/hotels/${item.slug}` :
                    `/flights/${item.slug}`;
                  return (
                    <li key={`${item.type}-${item.id}`}>
                      <Link
                        href={href}
                        className="block truncate text-xs text-zinc-500 dark:text-zinc-400 transition-colors hover:text-[var(--brand)]"
                      >
                        <span className="mr-1.5 text-[var(--muted)]">•</span>
                        {title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-6 sm:flex-row sm:justify-between">
          <p className="text-sm text-zinc-500">
            © {year} İzgetour. {t('rights')}
          </p>
          <div className="flex gap-5 text-xs text-zinc-500 dark:text-zinc-400">
            <Link href={`/${locale}/privacy`} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
