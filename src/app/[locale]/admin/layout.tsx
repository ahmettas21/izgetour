'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  PlusCircle,
  LogOut,
  X,
  Menu,
  MapPin,
} from 'lucide-react';

type SidebarItem = {
  key: 'dashboard' | 'bookings' | 'customers' | 'tours' | 'createTour';
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('admin');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const locale = pathname?.split('/')[1] || 'tr';

  const navItems: SidebarItem[] = [
    {
      key: 'dashboard',
      href: `/${locale}/admin`,
      icon: LayoutDashboard,
    },
    {
      key: 'bookings',
      href: `/${locale}/admin/bookings`,
      icon: ClipboardList,
    },
    {
      key: 'customers',
      href: `/${locale}/admin/customers`,
      icon: Users,
    },
    {
      key: 'tours',
      href: `/${locale}/admin/tours`,
      icon: MapPin,
    },
    {
      key: 'createTour',
      href: `/${locale}/admin/tours/new`,
      icon: PlusCircle,
    },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === `/${locale}/admin`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 flex flex-col
          transform bg-white border-r border-zinc-200 shadow-sm
          transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0 lg:shadow-none
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-100">
          <Link
            href={`/${locale}/admin`}
            className="flex items-center gap-2"
            onClick={closeMobile}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0066CC]">
              <span className="text-sm font-bold text-white">İ</span>
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900 leading-none">İzge Tour</div>
              <div className="text-[10px] text-zinc-400 leading-none mt-0.5">Admin Panel</div>
            </div>
          </Link>
          <button
            onClick={closeMobile}
            className="lg:hidden text-zinc-400 hover:text-zinc-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={closeMobile}
                className={`
                  flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                  transition-colors duration-150
                  ${
                    active
                      ? 'bg-[#0066CC]/10 text-[#0066CC]'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  }
                `}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    active ? 'text-[#0066CC]' : 'text-zinc-400'
                  }`}
                />
                {t(`sidebar.${item.key}`)}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-zinc-100">
          <button
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
              text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {t('sidebar.logout')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="flex h-14 items-center gap-3 border-b border-zinc-200 bg-white px-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-zinc-500 hover:text-zinc-700"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-sm font-semibold text-zinc-900">İzge Tour</div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
