import { notFound } from 'next/navigation';
import { SEHIRLER, getSehir } from '@/data/sehirler';
import TurSehirContent from '../../[slug]/TurSehirContent';
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
  const title = isTR ? `${sehir.name} Turları | İzgeTour` : `${sehir.name} Tours | İzgeTour`;
  const description = isTR
    ? `${sehir.name} turları ve gezi rehberi. ${sehir.name}'daki en popüler turları keşfedin, rehberli turlarla unutulmaz bir deneyim yaşayın.`
    : `${sehir.name} tours and travel guide. Discover the most popular tours in ${sehir.name} and have an unforgettable experience with guided tours.`;

  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: sehir.image, width: 1200, height: 630 }] },
  };
}

export default async function TurlarSehirPage({ params }: Props) {
  const { locale, slug } = await params;
  const sehir = getSehir(slug);
  if (!sehir) notFound();
  return <TurSehirContent params={{ locale, slug }} />;
}
