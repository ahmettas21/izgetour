import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Globe, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-zinc-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Globe className="h-7 w-7 text-[#0066CC]" />
              <span className="text-xl font-bold text-white">İzgetour</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{t('tagline')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2">
              {(['home', 'tours', 'flights', 'about', 'contact'] as const).map((key) => (
                <li key={key}>
                  <Link
                    href={key === 'home' ? '/' : `/${key}`}
                    className="text-sm hover:text-[#0066CC]"
                  >
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {t('contactUs')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-[#0066CC]" />
                <a href={`mailto:${t('email')}`} className="hover:text-[#0066CC]">
                  {t('email')}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-[#0066CC]" />
                <a href={`tel:${t('phone')}`} className="hover:text-[#0066CC]">
                  {t('phone')}
                </a>
              </li>
            </ul>
          </div>

          {/* Social placeholder */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Sosyal Medya
            </h3>
            <div className="flex gap-3">
              {['Instagram', 'Twitter', 'Facebook'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-zinc-400 transition-colors hover:bg-[#0066CC] hover:text-white"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-6 text-center text-sm text-zinc-500">
          © {year} İzgetour. {t('rights')}
        </div>
      </div>
    </footer>
  );
}
