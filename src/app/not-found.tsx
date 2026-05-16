import Link from 'next/link';
import { Home, Map, Hotel, Plane } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 text-center">
      <div className="mb-8">
        <div className="mb-6 text-[10rem] font-black leading-none text-[var(--brand)] opacity-10 sm:text-[12rem]">
          404
        </div>
        <div className="-mt-16">
          <h1 className="text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
            Sayfa Bulunamadı
          </h1>
          <p className="mt-3 max-w-md text-[var(--muted)]">
            Aradığın sayfa taşınmış, kaldırılmış veya hiç var olmamış olabilir.
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <Link
          href="/tours"
          className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-[var(--brand)] hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800"
        >
          <Map className="h-6 w-6 text-[var(--brand)]" />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Turlar</span>
        </Link>
        <Link
          href="/hotels"
          className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-[var(--brand)] hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800"
        >
          <Hotel className="h-6 w-6 text-[var(--brand)]" />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Oteller</span>
        </Link>
        <Link
          href="/flights"
          className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-[var(--brand)] hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800"
        >
          <Plane className="h-6 w-6 text-[var(--brand)]" />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Uçuşlar</span>
        </Link>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-8 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:brightness-110"
      >
        <Home className="h-4 w-4" />
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
