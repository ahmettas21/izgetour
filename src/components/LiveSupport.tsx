import { Suspense, lazy } from 'react';

const SupportBubble = lazy(() => import('./Support/SupportBubble'));

export default function LiveSupportWrapper() {
  return (
    <Suspense fallback={null}>
      <SupportBubble />
    </Suspense>
  );
}
