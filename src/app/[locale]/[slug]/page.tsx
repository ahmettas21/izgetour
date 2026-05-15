import { notFound } from 'next/navigation';
import { SEHIRLER, getSehir } from '@/data/sehirler';
import SehirMegaContent from './SehirMegaContent';
import OtelSehirContent from './OtelSehirContent';
import TurSehirContent from './TurSehirContent';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const sehir of SEHIRLER) {
    // /{sehir}
    params.push({ locale: 'tr', slug: sehir.slug });
    params.push({ locale: 'en', slug: sehir.slug });
    // /{sehir}-otelleri
    params.push({ locale: 'tr', slug: `${sehir.slug}-otelleri` });
    params.push({ locale: 'en', slug: `${sehir.slug}-otelleri` });
    // /{sehir}-turlari
    params.push({ locale: 'tr', slug: `${sehir.slug}-turlari` });
    params.push({ locale: 'en', slug: `${sehir.slug}-turlari` });
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const isTR = locale === 'tr';

  // {sehir}-otelleri
  const otelMatch = slug.match(/^(.+)-otelleri$/);
  if (otelMatch) {
    const sehir = getSehir(otelMatch[1]);
    if (!sehir) return { title: 'Sayfa Bulunamadı' };
    return {
      title: isTR ? `${sehir.name} Otelleri | İzgeTour` : `${sehir.name} Hotels | İzgeTour`,
      description: isTR ? `${sehir.name} otelleri için en iyi fırsatlar.` : `Best hotel deals in ${sehir.name}.`,
      openGraph: { title: isTR ? `${sehir.name} Otelleri | İzgeTour` : `${sehir.name} Hotels | İzgeTour`, images: [{ url: sehir.image }] },
    };
  }

  // {sehir}-turlari
  const turMatch = slug.match(/^(.+)-turlari$/);
  if (turMatch) {
    const sehir = getSehir(turMatch[1]);
    if (!sehir) return { title: 'Sayfa Bulunamadı' };
    return {
      title: isTR ? `${sehir.name} Turları | İzgeTour` : `${sehir.name} Tours | İzgeTour`,
      description: isTR ? `${sehir.name} turları ve gezi rehberi.` : `${sehir.name} tours and travel guide.`,
      openGraph: { title: isTR ? `${sehir.name} Turları | İzgeTour` : `${sehir.name} Tours | İzgeTour`, images: [{ url: sehir.image }] },
    };
  }

  // {sehir} — mega page
  const sehir = getSehir(slug);
  if (!sehir) return { title: 'Sayfa Bulunamadı' };
  return {
    title: isTR ? `${sehir.name} | İzgeTour - Uçak Bileti, Oteller & Turlar` : `${sehir.name} | İzgeTour - Flights, Hotels & Tours`,
    description: isTR ? sehir.description : sehir.descriptionEn,
    openGraph: { title: isTR ? `${sehir.name} | İzgeTour` : `${sehir.name} | İzgeTour`, description: isTR ? sehir.description : sehir.descriptionEn, images: [{ url: sehir.image }] },
  };
}

export default async function SlugPage({ params }: Props) {
  const { locale, slug } = await params;

  // {sehir}-otelleri pattern
  const otelMatch = slug.match(/^(.+)-otelleri$/);
  if (otelMatch) {
    const sehir = getSehir(otelMatch[1]);
    if (!sehir) notFound();
    return <OtelSehirContent params={{ locale, slug: sehir.slug }} />;
  }

  // {sehir}-turlari pattern
  const turMatch = slug.match(/^(.+)-turlari$/);
  if (turMatch) {
    const sehir = getSehir(turMatch[1]);
    if (!sehir) notFound();
    return <TurSehirContent params={{ locale, slug: sehir.slug }} />;
  }

  // {sehir} — mega page
  const sehir = getSehir(slug);
  if (!sehir) notFound();
  return <SehirMegaContent params={{ locale, slug }} />;
}
