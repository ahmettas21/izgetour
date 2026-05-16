'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 text-center">
      <div className="max-w-md">
        <div className="mb-6 text-6xl">😕</div>
        <h1 className="mb-3 text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
          Bir Şeyler Ters Gitti
        </h1>
        <p className="mb-2 text-[var(--muted)]">
          Beklenmedik bir hata oluştu. Lütfen tekrar dene.
        </p>
        {error.digest && (
          <p className="mb-6 text-xs text-[var(--muted-foreground)]">
            Hata kodu: <code className="rounded bg-[var(--border)] px-1.5 py-0.5">{error.digest}</code>
          </p>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-8 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:brightness-110"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  );
}
