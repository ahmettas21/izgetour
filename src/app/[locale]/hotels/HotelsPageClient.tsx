'use client';

import HotelFiltersWrapper from './HotelFiltersWrapper';
import SocialProofToast from '@/components/SocialProofToast';
import type { Hotel } from '@/data/hotels';

type Props = {
  hotels: Hotel[];
  locale: 'tr' | 'en';
};

export default function HotelsPageClient({ hotels, locale }: Props) {
  return (
    <div>
      <SocialProofToast />
      <HotelFiltersWrapper hotels={hotels} locale={locale} />
    </div>
  );
}
