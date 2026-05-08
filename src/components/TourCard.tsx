import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { MapPin, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Tour = {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  duration: number;
  image: string;
  location: string;
  rating: number;
};

type Props = {
  tour: Tour;
  locale: 'tr' | 'en';
};

export default function TourCard({ tour, locale }: Props) {
  const t = useTranslations('tours');
  const title = locale === 'tr' ? tour.title : tour.titleEn;
  const description = locale === 'tr' ? tour.description : tour.descriptionEn;

  return (
    <Link href={`/tours/${tour.slug}`} className="group block">
      <article className="overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={tour.image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-zinc-800">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {tour.rating}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2 flex items-center gap-1 text-xs text-zinc-500">
            <MapPin className="h-3 w-3" />
            {tour.location}
          </div>
          <h3 className="font-semibold text-zinc-900 group-hover:text-[#0066CC]">{title}</h3>
          <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{description}</p>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-[#0066CC]">₺{tour.price.toLocaleString()}</span>
              <span className="ml-1 text-xs text-zinc-400">{t('perPerson')}</span>
            </div>
            <span className="text-xs text-zinc-400">
              {tour.duration} {t('days')}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
