'use client';

import { ChevronRight, Home } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
  className?: string;
};

export default function BreadcrumbNav({ items, className = '' }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 ${className}`}
    >
      <ol className="flex items-center gap-1.5 text-sm text-zinc-500">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[var(--brand)] transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Ana Sayfa</span>
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-[var(--brand)] transition-colors truncate max-w-[200px]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-zinc-800 font-medium truncate max-w-[200px]">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
