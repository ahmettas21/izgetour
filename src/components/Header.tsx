'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/', key: 'home' },
    { href: '/tours', key: 'tours' },
    { href: '/flights', key: 'flights' },
    { href: '/about', key: 'about' },
    { href: '/contact', key: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Globe className="h-8 w-8 text-[#0066CC]" />
          <span className="text-xl font-bold text-zinc-900">İzgetour</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map(({ href, key }) => (
            <Link
              key={key}
              href={href}
              className={`text-sm font-medium transition-colors ${
                pathname === href
                  ? 'text-[#0066CC]'
                  : 'text-zinc-600 hover:text-[#0066CC]'
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="hidden rounded-full bg-[#0066CC] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0052a3] md:inline-flex"
          >
            {t('login')}
          </Link>
          <button
            className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-zinc-100 bg-white px-4 pb-4 md:hidden">
          {links.map(({ href, key }) => (
            <Link
              key={key}
              href={href}
              className="block py-3 text-base font-medium text-zinc-700 hover:text-[#0066CC]"
              onClick={() => setMobileOpen(false)}
            >
              {t(key)}
            </Link>
          ))}
          <Link
            href="/login"
            className="mt-3 block rounded-full bg-[#0066CC] px-5 py-2 text-center text-sm font-semibold text-white"
            onClick={() => setMobileOpen(false)}
          >
            {t('login')}
          </Link>
        </div>
      )}
    </header>
  );
}
