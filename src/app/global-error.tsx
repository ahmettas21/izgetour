'use client';

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-zinc-900 mb-4">Bir hata oluştu</h1>
            <p className="text-zinc-600 mb-8">Bir sorun oluştu. Lütfen sayfayı yenileyin.</p>
            <button
              onClick={reset}
              className="rounded-full bg-[#0066CC] px-8 py-3 font-semibold text-white hover:bg-[#0052a3]"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
