'use client';

import dynamic from 'next/dynamic';

const MoodDestinationPicker = dynamic(
  () => import('./MoodDestinationPicker'),
  { ssr: false },
);

interface Props {
  locale: 'tr' | 'en';
}

export default function MoodDestinationPickerClient({ locale }: Props) {
  return <MoodDestinationPicker locale={locale} />;
}
