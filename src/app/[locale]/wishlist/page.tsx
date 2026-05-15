'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Heart, Trash2, Plane, MapPin, Hotel, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';

type Props = {
  params: Promise<{ locale: string }>;
};

export default function WishlistPage({ params }: Props) {
  const { locale } = { locale: 'tr' as const };
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
          <div className="flex flex-col items-center justify-center py-20 text-center">
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
            <Link
              href="/tours"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-dark)]"
            >
              {locale === 'tr' ? 'Turları Keşfet' : 'Explore Tours'}
              <ArrowRight className="h-4 w-4" />
            </Link>
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