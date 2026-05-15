import dynamic from 'next/dynamic';
import React from 'react';

const SupportBubble = dynamic(
  () => import('./Support/SupportBubble'),
  {
    loading: () => React.createElement('div', { className: 'fixed bottom-6 right-6 z-50' }, null),
  }
);

export default function LiveSupportWrapper() {
  return <SupportBubble />;
}
