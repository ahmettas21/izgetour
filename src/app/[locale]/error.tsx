'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-50 via-orange-50 to-white px-4 dark:from-red-950/20 dark:via-orange-950/10 dark:to-zinc-950">
      <div className="text-center max-w-md">
        {/* Error icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] dark:text-white">
          Bir hata oluştu
        </h1>
        <p className="mt-3 text-[var(--muted)] dark:text-zinc-400 leading-relaxed">
          Sayfa yüklenirken beklenmeyen bir sorun oluştu. Lütfen tekrar deneyin veya ana sayfaya dönün.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-8 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[var(--brand-dark)] hover:shadow-md"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
            </svg>
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--brand)] px-8 py-3 font-semibold text-[var(--brand)] transition-all duration-200 hover:bg-[var(--brand)] hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Ana Sayfa
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 text-xs text-zinc-400 dark:text-zinc-600">
            Hata kodu: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
