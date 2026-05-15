import { notFound } from 'next/navigation';
import { getSehir } from '@/data/sehirler';
import { hotels } from '@/data/hotels';
import SeoHizliLinkler from '@/components/SeoHizliLinkler';
import { Building2, MapPin, Star, Wifi, Waves, Coffee, Car, Dumbbell, Sparkles, Utensils } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type Props = {
  params: { locale: string; slug: string };
};

const amenityIcons: Record<string, React.ReactNode> = {
  'Özel Plaj': <Waves className="h-4 w-4" />,
  'Sonsuzluk Havuzu': <Sparkles className="h-4 w-4" />,
  'SPA & Wellness': <Sparkles className="h-4 w-4" />,
  'Fitness Center': <Dumbbell className="h-4 w-4" />,
  'Doğa Manzarası': <MapPin className="h-4 w-4" />,
  'Ücretsiz Kahvaltı': <Coffee className="h-4 w-4" />,
  'Ücretsiz WiFi': <Wifi className="h-4 w-4" />,
  'Otopark': <Car className="h-4 w-4" />,
  'Boğaz Manzaralı': <MapPin className="h-4 w-4" />,
  'Merkezi Konum': <MapPin className="h-4 w-4" />,
  'Restoran': <Utensils className="h-4 w-4" />,
  'Oda Servisi': <Coffee className="h-4 w-4" />,
  'Termal Havuz': <Waves className="h-4 w-4" />,
  'SPA': <Sparkles className="h-4 w-4" />,
  'Traverten Manzarası': <MapPin className="h-4 w-4" />,
  'Hamam': <Sparkles className="h-4 w-4" />,
  'Mağara Oda': <Building2 className="h-4 w-4" />,
  'Balon Manzarası': <MapPin className="h-4 w-4" />,
  'Şarap Mahzeni': <Coffee className="h-4 w-4" />,
  'Teras': <MapPin className="h-4 w-4" />,
};

function getAmenityIcon(name: string): React.ReactNode {
  return amenityIcons[name] || <Sparkles className="h-4 w-4" />;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`h-3.5 w-3.5 ${star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-zinc-200 text-zinc-200 dark:fill-zinc-600 dark:text-zinc-600'}`} />
      ))}
      <span className="ml-1 text-xs font-medium text-zinc-500">{rating}</span>
    </div>
  );
}

export default function OtelSehirContent({ params }: Props) {
  const { locale, slug } = params;
  const sehir = getSehir(slug);
  if (!sehir) notFound();

  const isTR = locale === 'tr';
  const cityName = sehir.name;
  const cityHotels = hotels.filter((h) => h.city === cityName);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <section className="relative bg-gradient-to-br from-emerald-600 to-teal-700 py-16 dark:from-emerald-900 dark:to-teal-950">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <Building2 className="h-8 w-8 text-white/80" />
            <span className="text-sm font-semibold uppercase tracking-widest text-white/60">{isTR ? 'OTELLER' : 'HOTELS'}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {isTR ? `${cityName} Otelleri - En İyi Fırsatlar` : `${cityName} Hotels - Best Deals`}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/80">
            {isTR
              ? `${cityName}'daki en iyi otel fırsatlarını keşfedin. Lüks resortlardan butik otellere, her bütçeye uygun konaklama seçenekleri.`
              : `Discover the best hotel deals in ${cityName}. From luxury resorts to boutique hotels, accommodation options for every budget.`}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        {cityHotels.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-700">
            <Building2 className="mx-auto mb-4 h-12 w-12 text-zinc-300" />
            <p className="text-lg font-medium text-zinc-500">{isTR ? `Henüz ${cityName} için otel kaydı bulunmamaktadır.` : `No hotel listings available for ${cityName} yet.`}</p>
            <p className="mt-2 text-sm text-zinc-400">{isTR ? 'Kısa süre içinde yeni oteller eklenecektir.' : 'New hotels will be added shortly.'}</p>
          </div>
        ) : (
          <>
            <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">{isTR ? `${cityName} Otel Seçenekleri` : `${cityName} Hotel Options`}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cityHotels.map((hotel) => (
                <div key={hotel.id} className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                  <div className="relative h-48 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-600">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-zinc-400" />
                    </div>
                    <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold shadow-sm dark:bg-zinc-800/90 dark:text-white">
                      <StarRating rating={hotel.rating} />
                    </div>
                    <div className="absolute left-3 top-3 rounded-full bg-[#0066CC] px-3 py-1 text-xs font-bold text-white shadow-sm dark:bg-[#3399ff]">
                      ₺{hotel.price.toLocaleString('tr-TR')}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 text-lg font-bold text-zinc-900 dark:text-white">{hotel.title}</h3>
                    <p className="mb-3 text-xs leading-relaxed text-zinc-500 line-clamp-2">{isTR ? hotel.description : hotel.descriptionEn}</p>
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {hotel.amenities.slice(0, 4).map((amenity) => (
                        <span key={amenity} className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">{getAmenityIcon(amenity)}{amenity}</span>
                      ))}
                    </div>
                    <div className="mb-4 space-y-1">
                      {hotel.rooms.slice(0, 2).map((room) => (
                        <div key={room.id} className="flex items-center justify-between text-xs">
                          <span className="text-zinc-600 dark:text-zinc-400">{isTR ? room.type : room.typeEn}</span>
                          <span className="font-semibold text-zinc-900 dark:text-white">₺{room.price.toLocaleString('tr-TR')}</span>
                        </div>
                      ))}
                    </div>
                    <Link href={`/hotels/${hotel.slug}`} className="mt-2 block w-full rounded-lg bg-[#0066CC] py-2.5 text-center text-sm font-semibold text-white hover:bg-[#0052a3] dark:bg-[#3399ff]">
                      {isTR ? 'Detaylı İncele' : 'View Details'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="bg-zinc-50 py-12 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">{isTR ? `${cityName}'da Otel Konaklaması` : `Hotel Accommodation in ${cityName}`}</h2>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-sm leading-relaxed text-zinc-600">{isTR
              ? `${cityName}'da konaklama için en iyi otel seçeneklerini İzgeTour ile keşfedin. Lüks tatil köylerinden butik otellere, her zevke ve bütçeye uygun ${cityName} otelleri için hemen rezervasyon yapın.`
              : `Discover the best hotel options for accommodation in ${cityName} with İzgeTour. From luxury resorts to boutique hotels, book ${cityName} hotels for every taste and budget now.`}</p>
          </div>
        </div>
      </section>

      <SeoHizliLinkler locale={locale as 'tr' | 'en'} currentSlug={slug} />
    </div>
  );
}
