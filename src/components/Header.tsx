'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { Menu, X, Globe, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

// Strip locale prefix so pathname comparisons work correctly
function useLocalePathname() {
  const pathname = usePathname();
  return pathname.replace(/^\/(tr|en)/, '') || '/';
}

export default function Header() {
  const t = useTranslations('nav');
  const pathname = useLocalePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/', key: 'home' },
    { href: '/tours', key: 'tours' },
    { href: '/flights', key: 'flights' },
    { href: '/blog', key: 'blog' },
    { href: '/docs', key: 'docs' },
    { href: '/about', key: 'about' },
    { href: '/contact', key: 'contact' },
  ];

  const headerBase =
    'sticky top-0 z-50 transition-all duration-300';
  const headerScrolled =
    'bg-white/95 backdrop-blur-md shadow-[var(--shadow-header)] dark:bg-gray-900/95 dark:shadow-gray-900/50';
  const headerTop =
    'bg-transparent';

  const linkBase = 'text-sm font-medium transition-colors duration-150';
  const linkActive = scrolled ? 'text-[var(--brand)]' : 'text-white';
  const linkIdle = scrolled
    ? 'text-zinc-600 hover:text-[var(--brand)] dark:text-zinc-400 dark:hover:text-[var(--brand)]'
    : 'text-white/80 hover:text-white dark:text-white/70 dark:hover:text-white';

  const logoText = scrolled ? 'text-zinc-900 dark:text-white' : 'text-white';
  const logoIcon = scrolled ? 'text-[var(--brand)]' : 'text-white dark:text-white';

  return (
    <header className={`${headerBase} ${scrolled ? headerScrolled : headerTop}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Globe className={`h-8 w-8 transition-colors duration-300 ${logoIcon}`} />
          <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${logoText}`}>
            İzgetour
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map(({ href, key }) => (
            <Link
              key={key}
              href={href}
              className={`${linkBase} ${pathname === href ? linkActive : linkIdle}`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitcher />
          <Link
            href="/wishlist"
            className="relative flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200 md:inline-flex"
            style={scrolled
              ? { background: 'var(--brand-light)', color: 'var(--brand)' }
              : { background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(8px)' }
            }
          >
            <Heart className="h-4 w-4" />
            <span className="hidden md:inline">{t('wishlist')}</span>
          </Link>
          <Link
            href="/login"
            className={`hidden rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 md:inline-flex ${
              scrolled
                ? 'bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)]'
                : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 border border-white/30 dark:bg-white/10 dark:border-white/20'
            }`}
          >
            {t('login')}
          </Link>
          <button
            className={`rounded-md p-2 transition-colors md:hidden ${
              scrolled ? 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800' : 'text-white hover:bg-white/10 dark:hover:bg-white/5'
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-zinc-100/80 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-gray-900/95 px-4 pb-4 md:hidden">
          {links.map(({ href, key }) => (
            <Link
              key={key}
              href={href}
              className={`block py-3 text-base font-medium transition-colors ${
                pathname === href
                  ? 'text-[var(--brand)]'
                  : 'text-zinc-700 hover:text-[var(--brand)] dark:text-zinc-300 dark:hover:text-[var(--brand)]'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {t(key)}
            </Link>
          ))}
          <Link
            href="/login"
            className="mt-3 block rounded-full bg-[var(--brand)] px-5 py-2 text-center text-sm font-semibold text-white hover:bg-[var(--brand-dark)]"
            onClick={() => setMobileOpen(false)}
          >
            {t('login')}
          </Link>
        </div>
      )}
    </header>
  );
}
