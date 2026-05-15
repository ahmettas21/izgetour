import { Link } from '@/i18n/navigation';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-extrabold text-[var(--brand)] sm:text-8xl">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)] sm:text-2xl dark:text-zinc-100">
        Sayfa Bulunamadı
      </h2>
      <p className="mt-2 max-w-md text-[var(--muted)] dark:text-zinc-400">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow transition-all hover:bg-[var(--brand-dark)]"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
