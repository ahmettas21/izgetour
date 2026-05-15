import { notFound } from 'next/navigation';
import { SEHIRLER, getSehir } from '@/data/sehirler';
import OtelSehirContent from '../../[slug]/OtelSehirContent';
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
  const title = isTR ? `${sehir.name} Otelleri | İzgeTour` : `${sehir.name} Hotels | İzgeTour`;
  const description = isTR
    ? `${sehir.name} otelleri için en iyi fırsatlar. ${sehir.name}'daki en iyi otelleri karşılaştırın, uygun fiyatlarla rezervasyon yapın.`
    : `Best hotel deals in ${sehir.name}. Compare the best hotels in ${sehir.name} and book at affordable prices.`;

  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: sehir.image, width: 1200, height: 630 }] },
  };
}

export default async function OtellerSehirPage({ params }: Props) {
  const { locale, slug } = await params;
  const sehir = getSehir(slug);
  if (!sehir) notFound();
  return <OtelSehirContent params={{ locale, slug }} />;
}
