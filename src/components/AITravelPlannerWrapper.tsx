'use client';

import dynamic from 'next/dynamic';

const AITravelPlannerContent = dynamic(
  () => import('@/components/AITravelPlanner'),
  { ssr: false }
);

interface Props {
  locale?: 'tr' | 'en';
}

export default function AITravelPlannerWrapper({ locale = 'tr' }: Props) {
  return <AITravelPlannerContent locale={locale} />;
}
