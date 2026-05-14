'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { MapPin, Star, Leaf, Users } from 'lucide-react';

type Hotel = {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  rating: number;
  image: string;
  city: string;
  amenities: string[];
  rooms: Array<{
    id: string;
    type: string;
    typeEn: string;
    price: number;
    board: string;
    boardEn: string;
    maxGuests: number;
  }>;
  sustainabilityScore?: number;
};

type Props = {
  hotel: Hotel;
  locale: 'tr' | 'en';
};

export default function HotelCard({ hotel, locale }: Props) {
  const title = locale === 'tr' ? hotel.title : hotel.titleEn;
  const description = locale === 'tr' ? hotel.description : hotel.descriptionEn;
  const minPrice = Math.min(...hotel.rooms.map((r) => r.price));

  return (
    <Link href={`/hotels/${hotel.slug}`} className="group block h-full">
      <article
        className="flex h-full flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300"
        style={{
          boxShadow: 'var(--shadow-card)',
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card-hover)')
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)')
        }
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={hotel.image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Sustainability badge */}
          {hotel.sustainabilityScore && (
            <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-emerald-50/90 px-2.5 py-1 text-xs font-medium text-emerald-700 shadow-sm backdrop-blur-sm">
              <Leaf className="h-3 w-3 text-emerald-500" />
              <span>{hotel.sustainabilityScore}</span>
            </div>
          )}

          {/* Rating badge */}
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-zinc-800 shadow-sm backdrop-blur-sm">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {hotel.rating.toFixed(1)}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          {/* City */}
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[var(--muted)]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--brand)]" />
            {hotel.city}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold leading-snug text-[var(--foreground)] transition-colors duration-150 group-hover:text-[var(--brand)] line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)] line-clamp-2">
            {description}
          </p>

          {/* Amenities preview */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {hotel.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600"
              >
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-500">
                +{hotel.amenities.length - 3}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="my-4 h-px bg-[var(--border)]" />

          {/* Info row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {hotel.rooms.length} {locale === 'tr' ? 'oda' : 'rooms'}
              </span>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
                {locale === 'tr' ? 'gecelik' : 'per night'}
              </div>
              <div className="text-xl font-extrabold text-[var(--brand)]">
                ₺{minPrice.toLocaleString('tr-TR')}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
