'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { MapPin, Star, Clock, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useWishlist } from '@/hooks/useWishlist';

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
  const { isWishlisted, toggleWishlist } = useWishlist();
  const title = locale === 'tr' ? tour.title : tour.titleEn;
  const description = locale === 'tr' ? tour.description : tour.descriptionEn;
  const saved = isWishlisted(tour.id, 'tour');

  return (
    <Link href={`/tours/${tour.slug}`} className="group block h-full">
      <article
        className="flex h-full flex-col overflow-hidden rounded-2xl bg-[var(--surface)] transition-all duration-300"
        style={{
          boxShadow: 'var(--shadow-card)',
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.boxShadow =
            'var(--shadow-card-hover)')
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.boxShadow =
            'var(--shadow-card)')
        }
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={tour.image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Rating badge */}
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-zinc-800 shadow-sm backdrop-blur-sm dark:bg-zinc-800/95 dark:text-zinc-200">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {tour.rating.toFixed(1)}
          </div>

          {/* Duration badge */}
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            {tour.duration} {t('days')}
          </div>

          {/* Wishlist button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist({ id: tour.id, type: 'tour', title: tour.title, titleEn: tour.titleEn, image: tour.image, price: tour.price, slug: tour.slug });
            }}
            className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110 dark:bg-zinc-800/90"
            aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`h-4 w-4 transition-colors ${saved ? 'fill-red-500 text-red-500' : 'text-zinc-400 dark:text-zinc-500'}`} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          {/* Location */}
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[var(--muted)]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--brand)]" />
            {tour.location}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold leading-snug text-[var(--foreground)] transition-colors duration-150 group-hover:text-[var(--brand)] line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)] line-clamp-2">
            {description}
          </p>

          {/* Divider */}
          <div className="my-4 h-px bg-[var(--border)]" />

          {/* Price row */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
                {t('perPerson')}
              </span>
              <span className="text-xl font-extrabold text-[var(--brand)]">
                ₺{tour.price.toLocaleString('tr-TR')}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 group-hover:bg-[var(--brand-dark)]">
              {t('bookNow') ?? 'Rezervasyon'}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
