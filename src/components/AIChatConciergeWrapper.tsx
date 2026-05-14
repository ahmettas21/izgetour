import { Suspense, lazy } from 'react';

const AIChatConcierge = lazy(() => import('./AIChatConcierge'));

export default function AIChatConciergeWrapper({ locale }: { locale: 'tr' | 'en' }) {
  return (
    <Suspense fallback={null}>
      <AIChatConcierge locale={locale} />
    </Suspense>
  );
}
