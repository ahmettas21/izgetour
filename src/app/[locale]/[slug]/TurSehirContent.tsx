import { notFound } from 'next/navigation';
import { getSehir } from '@/data/sehirler';
import { MOCK_TOURS } from '@/data/tours';
import SeoHizliLinkler from '@/components/SeoHizliLinkler';
import { Compass, MapPin, Star, Clock, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type Props = {
  params: { locale: string; slug: string };
};

function getTourLocations(sehirName: string): string[] {
  const map: Record<string, string[]> = {
    'İstanbul': ['İstanbul'],
    'Antalya': ['Antalya'],
    'İzmir': ['İzmir'],
    'Kapadokya': ['Nevşehir'],
    'Bodrum': ['Bodrum', 'Muğla'],
    'Marmaris': ['Marmaris', 'Muğla'],
    'Fethiye': ['Fethiye', 'Muğla'],
    'Pamukkale': ['Denizli'],
    'Trabzon': ['Trabzon'],
    'Efes': ['İzmir', 'Efes'],
  };
  return map[sehirName] || [sehirName];
}

export default function TurSehirContent({ params }: Props) {
  const { locale, slug } = params;
  const sehir = getSehir(slug);
  if (!sehir) notFound();

  const isTR = locale === 'tr';
  const cityName = sehir.name;

  const locations = getTourLocations(cityName);
  const cityTours = MOCK_TOURS.filter((t) => locations.includes(t.location));

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <section className="relative bg-gradient-to-br from-amber-600 to-orange-700 py-16 dark:from-amber-900 dark:to-orange-950">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <Compass className="h-8 w-8 text-white/80" />
            <span className="text-sm font-semibold uppercase tracking-widest text-white/60">{isTR ? 'TURLAR' : 'TOURS'}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {isTR ? `${cityName} Turları ve Gezi Rehberi` : `${cityName} Tours & Travel Guide`}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/80">
            {isTR
              ? `${cityName}'nın en güzel yerlerini rehberli turlarla keşfedin. Kültür, doğa, tarih ve macera dolu turlar sizi bekliyor.`
              : `Explore the best places in ${cityName} with guided tours. Culture, nature, history and adventure-filled tours await you.`}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        {cityTours.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-700">
            <Compass className="mx-auto mb-4 h-12 w-12 text-zinc-300" />
            <p className="text-lg font-medium text-zinc-500">{isTR ? `Henüz ${cityName} için tur kaydı bulunmamaktadır.` : `No tour listings available for ${cityName} yet.`}</p>
            <p className="mt-2 text-sm text-zinc-400">{isTR ? 'Kısa süre içinde yeni turlar eklenecektir.' : 'New tours will be added shortly.'}</p>
          </div>
        ) : (
          <>
            <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">{isTR ? `${cityName} Tur Seçenekleri` : `${cityName} Tour Options`}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cityTours.map((tour) => (
                <div key={tour.id} className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                  <div className="relative h-48 overflow-hidden bg-zinc-200 dark:bg-zinc-700">
                    <img src={tour.image} alt={isTR ? tour.title : tour.titleEn} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-zinc-800 shadow-sm backdrop-blur-sm dark:bg-zinc-800/90 dark:text-white">
                        {tour.category === 'culture' ? (isTR ? 'Kültür' : 'Culture') :
                         tour.category === 'nature' ? (isTR ? 'Doğa' : 'Nature') :
                         tour.category === 'city' ? (isTR ? 'Şehir' : 'City') :
                         tour.category === 'sea' ? (isTR ? 'Deniz' : 'Sea') : tour.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 text-lg font-bold text-zinc-900 dark:text-white">{isTR ? tour.title : tour.titleEn}</h3>
                    <p className="mb-3 text-xs leading-relaxed text-zinc-500 line-clamp-2">{isTR ? tour.description : tour.descriptionEn}</p>
                    <div className="mb-4 flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{tour.location}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{tour.duration} {isTR ? 'gün' : 'day'}{tour.duration > 1 ? (isTR ? '' : 's') : ''}</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{tour.rating}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-700">
                      <div>
                        <div className="text-xl font-bold text-[#0066CC] dark:text-[#3399ff]">₺{tour.price.toLocaleString('tr-TR')}</div>
                        <div className="text-[10px] text-zinc-400">{isTR ? 'kişi başı' : 'per person'}</div>
                      </div>
                      <Link href={`/tours/${tour.slug}`} className="flex items-center gap-1.5 rounded-lg bg-[#0066CC] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0052a3] dark:bg-[#3399ff]">
                        {isTR ? 'İncele' : 'Details'} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="bg-zinc-50 py-12 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">{isTR ? `${cityName}'da Turistik Geziler` : `Tourist Trips in ${cityName}`}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">{isTR ? 'Rehberli Turlar' : 'Guided Tours'}</h3>
              <p className="text-sm text-zinc-500">{isTR ? `Profesyonel rehberler eşliğinde ${cityName}'nın en güzel yerlerini keşfedin.` : `Explore the best places in ${cityName} with professional guides.`}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">{isTR ? 'Özel Grup Turları' : 'Private Group Tours'}</h3>
              <p className="text-sm text-zinc-500">{isTR ? 'Kendi grubunuzla özel tur deneyimi için size özel programlar hazırlıyoruz.' : 'We prepare customized programs for a private tour experience with your group.'}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">{isTR ? 'Günübirlik Turlar' : 'Day Tours'}</h3>
              <p className="text-sm text-zinc-500">{isTR ? `${cityName}'da kısa sürede keşfedebileceğiniz günübirlik tur seçenekleri.` : `Day tour options you can explore in a short time in ${cityName}.`}</p>
            </div>
          </div>
        </div>
      </section>

      <SeoHizliLinkler locale={locale as 'tr' | 'en'} currentSlug={slug} />
    </div>
  );
}
