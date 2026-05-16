'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Heart, Trash2, Plane, MapPin, Hotel, ArrowRight, Star } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { MOCK_TOURS } from '@/data/tours';
import { hotels as MOCK_HOTELS } from '@/data/hotels';
import { MOCK_FLIGHTS } from '@/data/flights';
import { useParams } from 'next/navigation';

export default function WishlistPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'tr';
  const t = useTranslations('wishlist');
  const { wishlist, toggleWishlist } = useWishlist();

  const typeLabel = (type: string) => {
    switch (type) {
      case 'tour': return locale === 'tr' ? 'Tur' : 'Tour';
      case 'hotel': return locale === 'tr' ? 'Otel' : 'Hotel';
      case 'flight': return locale === 'tr' ? 'Uçuş' : 'Flight';
      default: return type;
    }
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'tour': return <MapPin className="h-4 w-4" />;
      case 'hotel': return <Hotel className="h-4 w-4" />;
      case 'flight': return <Plane className="h-4 w-4" />;
      default: return null;
    }
  };

  const href = (item: { type: string; slug: string }) => {
    switch (item.type) {
      case 'tour': return `/tours/${item.slug}`;
      case 'hotel': return `/hotels/${item.slug}`;
      case 'flight': return `/flights/${item.slug}`;
      default: return '#';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand)] text-white shadow-lg">
              <Heart className="h-6 w-6 fill-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
                {locale === 'tr' ? 'Favorilerim' : 'My Wishlist'}
              </h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {wishlist.length} {locale === 'tr' ? 'kayıtlı öğe' : 'saved items'}
              </p>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
              <Heart className="h-8 w-8 text-zinc-300" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              {locale === 'tr' ? 'Henüz favorin yok' : 'No favorites yet'}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-[var(--muted)]">
              {locale === 'tr'
                ? 'Beğendiğin turları, otelleri veya uçuşları buraya kaydet.'
                : 'Save tours, hotels, or flights you like here.'}
            </p>

            {/* Suggested items from mock data */}
            <div className="mt-10 w-full">
              <h3 className="mb-4 text-left text-lg font-bold text-[var(--foreground)]">
                {locale === 'tr' ? 'Önerilen Turlar' : 'Suggested Tours'}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {MOCK_TOURS.slice(0, 3).map((tour) => {
                  const title = locale === 'tr' ? tour.title : tour.titleEn;
                  return (
                    <Link
                      key={tour.id}
                      href={`/tours/${tour.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                      <div className="relative h-36 w-full overflow-hidden">
                        <Image
                          src={tour.image}
                          alt={title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="300px"
                        />
                        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {tour.rating}
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-[var(--brand-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand)]">
                          <MapPin className="h-3 w-3" />
                          {tour.location}
                        </span>
                        <h4 className="text-sm font-semibold text-[var(--foreground)]">{title}</h4>
                        <p className="mt-2 text-lg font-extrabold text-[var(--brand)]">
                          ₺{tour.price.toLocaleString('tr-TR')}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <h3 className="mb-4 mt-8 text-left text-lg font-bold text-[var(--foreground)]">
                {locale === 'tr' ? 'Önerilen Oteller' : 'Suggested Hotels'}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {MOCK_HOTELS.slice(0, 3).map((hotel) => {
                  const title = locale === 'tr' ? hotel.title : hotel.titleEn;
                  return (
                    <Link
                      key={hotel.id}
                      href={`/hotels/${hotel.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                      <div className="relative h-36 w-full overflow-hidden">
                        <Image
                          src={hotel.image}
                          alt={title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="300px"
                        />
                        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {hotel.rating}
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-[var(--brand-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand)]">
                          <Hotel className="h-3 w-3" />
                          {hotel.city}
                        </span>
                        <h4 className="text-sm font-semibold text-[var(--foreground)]">{title}</h4>
                        <p className="mt-2 text-lg font-extrabold text-[var(--brand)]">
                          ₺{hotel.price.toLocaleString('tr-TR')}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <h3 className="mb-4 mt-8 text-left text-lg font-bold text-[var(--foreground)]">
                {locale === 'tr' ? 'Önerilen Uçuşlar' : 'Suggested Flights'}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {MOCK_FLIGHTS.slice(0, 3).map((flight) => {
                  const title = `${flight.departure} → ${flight.arrival}`;
                  return (
                    <Link
                      key={flight.id}
                      href={`/flights/${flight.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand)]">
                          <Plane className="h-3 w-3" />
                          {flight.airline}
                        </span>
                        <span className="text-xs text-[var(--muted)]">{flight.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-center">
                          <p className="text-lg font-bold text-[var(--foreground)]">{flight.departureTime}</p>
                          <p className="text-xs text-[var(--muted)]">{flight.departureCode}</p>
                        </div>
                        <div className="flex flex-1 flex-col items-center">
                          <span className="text-[10px] text-[var(--muted)]">{flight.stops === 0 ? 'Direkt' : `${flight.stops} aktarma`}</span>
                          <div className="w-full border-t border-dashed border-[var(--border)]" />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-[var(--foreground)]">{flight.arrivalTime}</p>
                          <p className="text-xs text-[var(--muted)]">{flight.arrivalCode}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-lg font-extrabold text-[var(--brand)]">
                        ₺{flight.price.toLocaleString('tr-TR')}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map((item) => {
              const title = locale === 'tr' ? item.title : (item.titleEn || item.title);
              return (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Image */}
                  {item.image ? (
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={item.image}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-light)]">
                      {typeIcon(item.type)}
                    </div>
                  )}

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand)]">
                        {typeIcon(item.type)}
                        {typeLabel(item.type)}
                      </span>
                    </div>
                    <h3 className="truncate text-sm font-semibold text-[var(--foreground)]">{title}</h3>
                    <p className="mt-0.5 text-lg font-extrabold text-[var(--brand)]">
                      ₺{item.price.toLocaleString('tr-TR')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 flex-col gap-2">
                    <Link
                      href={href(item)}
                      className="flex items-center gap-1.5 rounded-lg bg-[var(--brand)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--brand-dark)]"
                    >
                      {locale === 'tr' ? 'Görüntüle' : 'View'}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    <button
                      onClick={() => toggleWishlist(item)}
                      className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:border-red-300 hover:text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                      {locale === 'tr' ? 'Kaldır' : 'Remove'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}