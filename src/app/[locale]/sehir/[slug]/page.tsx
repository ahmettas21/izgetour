import { notFound } from 'next/navigation';
import { SEHIRLER, getSehir } from '@/data/sehirler';
import SehirMegaContent from '../../[slug]/SehirMegaContent';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const sehir of SEHIRLER) {
    params.push({ locale: 'tr', slug: sehir.slug });
    params.push({ locale: 'en', slug: sehir.slug });
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const sehir = getSehir(slug);
  if (!sehir) return { title: 'Sayfa Bulunamadı' };

  const isTR = locale === 'tr';
  const title = isTR
    ? `${sehir.name} | İzgeTour - Uçak Bileti, Oteller & Turlar`
    : `${sehir.name} | İzgeTour - Flights, Hotels & Tours`;
  const description = isTR
    ? `${sehir.name} için uçak bileti, otel ve tur fırsatları. ${sehir.name}'a seyahatinizi en uygun fiyatlarla planlayın, hemen rezervasyon yapın.`
    : `Flight tickets, hotels and tour deals for ${sehir.name}. Plan your trip to ${sehir.name} at the best prices, book now.`;

  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: sehir.image, width: 1200, height: 630 }] },
  };
}

export default async function SehirPage({ params }: Props) {
  const { locale, slug } = await params;
  const sehir = getSehir(slug);
  if (!sehir) notFound();
  return <SehirMegaContent params={{ locale, slug }} />;
}
