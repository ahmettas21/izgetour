'use client';

import { useEffect, useMemo, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  }, []);

  const canShow = useMemo(() => Boolean(deferred) && !hidden, [deferred, hidden]);

  if (!canShow) return null;

  return (
    <div className="mx-auto mt-3 w-full max-w-5xl px-4">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
        <div className="text-sm text-zinc-800">
          <div className="font-medium">İzgetour’u ana ekrana ekle</div>
          <div className="text-zinc-600">Biletlerine daha hızlı eriş.</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
            onClick={async () => {
              if (!deferred) return;
              await deferred.prompt();
              try {
                await deferred.userChoice;
              } finally {
                setDeferred(null);
              }
            }}
          >
            Yükle
          </button>
          <button
            type="button"
            className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900"
            onClick={() => setHidden(true)}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
