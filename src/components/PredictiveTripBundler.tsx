'use client';

import { useState, useEffect } from 'react';
import { Package, MapPin, Clock, Star, Car, Camera, ShoppingCart, Sparkles, ChevronDown } from 'lucide-react';
import type { Flight } from '@/data/flights';
import type { Transfer } from '@/data/transfers';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BundleTier = 'smart' | 'premium' | 'ultimate';

export interface BundleItem {
  id: string;
  tier: BundleTier;
  label: string;
  labelEn: string;
  hotelName: string;
  hotelNameEn: string;
  hotelStars: number;
  hotelLocation: string;
  hotelLocationEn: string;
  hotelPrice: number;
  transfer: Transfer;
  tourName: string;
  tourNameEn: string;
  tourDuration: number;
  tourPrice: number;
  originalTotal: number;
  bundlePrice: number;
  savingsPercent: number;
  badge: string;
  badgeEn: string;
  recommended?: boolean;
}

interface Props {
  flight: Flight;
  locale?: 'tr' | 'en';
}

// ─── Mock Transfer Data ───────────────────────────────────────────────────────

const TRANSFERS: Transfer[] = [
  {
    id: 't1',
    type: 'private',
    vehicle: 'Özel Araç (Mercedes E)',
    vehicleEn: 'Private Car (Mercedes E)',
    pricePerPerson: 850,
    totalPrice: 850,
    duration: 45,
    description: 'Havalimanı → Otel özel transfer',
    descriptionEn: 'Airport → Hotel private transfer',
  },
  {
    id: 't2',
    type: 'vip',
    vehicle: 'VIP Minibüs',
    vehicleEn: 'VIP Minibus',
    pricePerPerson: 1200,
    totalPrice: 1200,
    duration: 40,
    description: 'Havalimanı → Otel VIP transfer',
    descriptionEn: 'Airport → Hotel VIP transfer',
  },
  {
    id: 't3',
    type: 'shared',
    vehicle: 'Paylaşımlı Transfer',
    vehicleEn: 'Shared Transfer',
    pricePerPerson: 350,
    totalPrice: 350,
    duration: 60,
    description: 'Havalimanı → Otel paylaşımlı transfer',
    descriptionEn: 'Airport → Hotel shared transfer',
  },
];

// ─── Mock Bundle Generation ───────────────────────────────────────────────────

function generateBundles(flight: Flight): BundleItem[] {
  const arrivalCity = flight.arrival;

  const hotelMap: Record<string, { name: string; nameEn: string; stars: number; loc: string; locEn: string; price: number }> = {
    Londra:   { name: 'Grand Hyatt London',    nameEn: 'Grand Hyatt London',    stars: 5, loc: 'Mayfair, Londra',      locEn: 'Mayfair, London',        price: 4800 },
    Dubai:    { name: 'Burj Al Arab Jumeirah',  nameEn: 'Burj Al Arab Jumeirah',  stars: 5, loc: 'Jumeirah, Dubai',       locEn: 'Jumeirah, Dubai',         price: 12000 },
    'New York': { name: 'The Plaza Hotel',       nameEn: 'The Plaza Hotel',        stars: 5, loc: '5th Ave, New York',     locEn: '5th Ave, New York',       price: 9500 },
    Berlin:   { name: 'Hotel Adlon Kempinski',   nameEn: 'Hotel Adlon Kempinski',  stars: 5, loc: 'Unter den Linden',       locEn: 'Unter den Linden, Berlin', price: 5500 },
  };

  const defaultHotel = {
    name: 'Lakeside Convention Hotel',
    nameEn: 'Lakeside Convention Hotel',
    stars: 4,
    loc: `${arrivalCity} Merkez`,
    locEn: `${arrivalCity} City Center`,
    price: 2200,
  };

  const hotel = hotelMap[arrivalCity] ?? defaultHotel;

  const tourMap: Record<string, { name: string; nameEn: string; dur: number; price: number }> = {
    Londra:   { name: 'Londra Şehir Turu',       nameEn: 'London City Tour',         dur: 1, price: 950  },
    Dubai:    { name: 'Dubai Safari & Souk Turu', nameEn: 'Dubai Safari & Souk Tour',  dur: 1, price: 1400 },
    'New York': { name: 'NYC Manhattan Turu',      nameEn: 'NYC Manhattan Tour',        dur: 1, price: 1100 },
    Berlin:   { name: 'Berlin Tarih Turu',        nameEn: 'Berlin Historical Tour',   dur: 1, price: 750  },
  };

  const defaultTour = {
    name: `${arrivalCity} Şehir Turu`,
    nameEn: `${arrivalCity} City Tour`,
    dur: 1,
    price: 650,
  };

  const tour = tourMap[arrivalCity] ?? defaultTour;

  const flightPrice = flight.price;
  const hotelPrice = hotel.price;
  const transfer = TRANSFERS[0];
  const tourPrice = tour.price;
  const totalSep = flightPrice + hotelPrice + transfer.totalPrice + tourPrice;

  return [
    {
      id: 'b1',
      tier: 'smart',
      label: 'Akıllı Paket',
      labelEn: 'Smart Bundle',
      hotelName: hotel.name,
      hotelNameEn: hotel.nameEn,
      hotelStars: hotel.stars,
      hotelLocation: hotel.loc,
      hotelLocationEn: hotel.locEn,
      hotelPrice: hotel.price,
      transfer,
      tourName: tour.name,
      tourNameEn: tour.nameEn,
      tourDuration: tour.dur,
      tourPrice: tour.price,
      originalTotal: Math.round(totalSep * 1.25),
      bundlePrice: totalSep,
      savingsPercent: 20,
      badge: 'En Çok Satan',
      badgeEn: 'Best Seller',
      recommended: true,
    },
    {
      id: 'b2',
      tier: 'premium',
      label: 'Premium Paket',
      labelEn: 'Premium Bundle',
      hotelName: hotel.name,
      hotelNameEn: hotel.nameEn,
      hotelStars: hotel.stars,
      hotelLocation: hotel.loc,
      hotelLocationEn: hotel.locEn,
      hotelPrice: hotel.price,
      transfer: TRANSFERS[1],
      tourName: tour.name,
      tourNameEn: tour.nameEn,
      tourDuration: tour.dur,
      tourPrice: tour.price,
      originalTotal: Math.round((flightPrice + hotelPrice + TRANSFERS[1].totalPrice + tourPrice) * 1.22),
      bundlePrice: flightPrice + hotelPrice + TRANSFERS[1].totalPrice + tourPrice,
      savingsPercent: 18,
      badge: 'Premium Tercih',
      badgeEn: 'Premium Choice',
    },
    {
      id: 'b3',
      tier: 'ultimate',
      label: 'Ultimate Paket',
      labelEn: 'Ultimate Bundle',
      hotelName: hotel.name,
      hotelNameEn: hotel.nameEn,
      hotelStars: hotel.stars,
      hotelLocation: hotel.loc,
      hotelLocationEn: hotel.locEn,
      hotelPrice: Math.round(hotel.price * 1.4),
      transfer: TRANSFERS[2],
      tourName: `${tour.name} + Özel Rehber`,
      tourNameEn: `${tour.nameEn} + Private Guide`,
      tourDuration: tour.dur + 1,
      tourPrice: Math.round(tour.price * 1.8),
      originalTotal: Math.round((flightPrice + Math.round(hotel.price * 1.4) + TRANSFERS[2].totalPrice + Math.round(tour.price * 1.8)) * 1.15),
      bundlePrice: flightPrice + Math.round(hotel.price * 1.4) + TRANSFERS[2].totalPrice + Math.round(tour.price * 1.8),
      savingsPercent: 13,
      badge: 'En Kapsamlı',
      badgeEn: 'Most Complete',
    },
  ];
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < count ? 'fill-amber-400 text-amber-400' : 'fill-zinc-200 text-zinc-200'}`}
        />
      ))}
    </div>
  );
}

// ─── Transfer Icon ────────────────────────────────────────────────────────────

function TransferBadge({ type }: { type: Transfer['type'] }) {
  const config = {
    private: { label: 'Özel', labelEn: 'Private', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
    vip:     { label: 'VIP',   labelEn: 'VIP',     color: 'bg-purple-50 text-purple-600', dot: 'bg-purple-500' },
    shared:  { label: 'Paylaşımlı', labelEn: 'Shared', color: 'bg-green-50 text-green-600', dot: 'bg-green-500' },
  }[type];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

// ─── Tier Badge ───────────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: BundleTier }) {
  const config = {
    smart:    { label: 'Akıllı Paket',  labelEn: 'Smart Bundle',    bg: 'bg-blue-500', text: 'text-white' },
    premium:  { label: 'Premium Paket',  labelEn: 'Premium Bundle',  bg: 'bg-purple-500', text: 'text-white' },
    ultimate: { label: 'Ultimate Paket',  labelEn: 'Ultimate Bundle', bg: 'bg-gradient-to-r from-amber-500 to-orange-500', text: 'text-white' },
  }[tier];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
      <Sparkles className="h-3 w-3" />
      {config.label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PredictiveTripBundler({ flight, locale = 'tr' }: Props) {
  const isTr = locale === 'tr';
  const [bundles, setBundles] = useState<BundleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate AI processing delay (800–1400ms)
    const timer = setTimeout(() => {
      setBundles(generateBundles(flight));
      setLoading(false);
    }, 900 + Math.random() * 400);
    return () => clearTimeout(timer);
  }, [flight]);

  const handleAddToCart = (id: string) => {
    setAddedIds(prev => new Set([...prev, id]));
  };

  const formatPrice = (p: number) => p.toLocaleString('tr-TR');

  // ─── Loading Skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
            <Package className="h-5 w-5 text-[#0066CC]" />
          </div>
          <div>
            <div className="h-5 w-56 animate-pulse rounded-lg bg-zinc-200" />
            <div className="mt-1.5 h-3.5 w-80 animate-pulse rounded bg-zinc-100" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-3 rounded-xl border border-zinc-100 p-4">
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
              <div className="h-5 w-40 animate-pulse rounded bg-zinc-100" />
              <div className="h-3 w-32 animate-pulse rounded bg-zinc-100" />
              <div className="h-20 w-full animate-pulse rounded-lg bg-zinc-50" />
              <div className="h-9 w-full animate-pulse rounded-lg bg-zinc-100" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ─── Empty State ────────────────────────────────────────────────────────────
  if (bundles.length === 0) {
    return (
      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Package className="h-12 w-12 text-zinc-200" />
          <p className="mt-3 text-sm font-medium text-zinc-500">
            {isTr ? 'Bu uçuş için henüz paket önerisi bulunmuyor.' : 'No package suggestions available for this flight yet.'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0066CC] to-[#004d99]">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900">
              {isTr ? 'Bu Uçuşa Özel Paket Fırsatları' : 'Package Deals For This Flight'}
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              {isTr
                ? 'AI destekli otomatik paketleme ile %20\'ye varan tasarruf edin'
                : 'Save up to 20% with AI-powered automatic bundling'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600">
          <Sparkles className="h-3.5 w-3.5" />
          {isTr ? 'AI tarafından önerildi' : 'AI Recommended'}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bundles.map((bundle, idx) => {
          const isAdded = addedIds.has(bundle.id);
          const isExpanded = expandedId === bundle.id;

          return (
            <div
              key={bundle.id}
              className={`
                relative flex flex-col rounded-2xl border bg-white transition-all duration-300
                ${bundle.recommended
                  ? 'border-[#0066CC] shadow-md ring-2 ring-[#0066CC]/10'
                  : 'border-zinc-200 shadow-sm hover:border-zinc-300 hover:shadow-md'
                }
              `}
              style={{ animationDelay: `${idx * 120}ms` }}
            >
              {/* Recommended ribbon */}
              {bundle.recommended && (
                <div className="absolute -top-px left-5 right-5 rounded-b-xl bg-gradient-to-r from-[#0066CC] to-[#004d99] px-3 py-1.5 text-center text-xs font-semibold text-white shadow-sm">
                  {isTr ? '✦ Önerilen Paket' : '✦ Recommended Bundle'}
                </div>
              )}

              <div className="flex flex-1 flex-col gap-3 p-4 pt-5">
                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-2">
                  <TierBadge tier={bundle.tier} />
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    bundle.tier === 'ultimate'
                      ? 'bg-amber-50 text-amber-600'
                      : bundle.tier === 'premium'
                      ? 'bg-purple-50 text-purple-600'
                      : 'bg-blue-50 text-blue-600'
                  }`}>
                    {isTr ? bundle.badge : bundle.badgeEn}
                  </span>
                </div>

                {/* Price block */}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#0066CC]">
                      ₺{formatPrice(bundle.bundlePrice)}
                    </span>
                    <span className="text-sm text-zinc-400 line-through">
                      ₺{formatPrice(bundle.originalTotal)}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-600">
                      %{bundle.savingsPercent} {isTr ? 'tasarruf' : 'off'}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {isTr ? 'paket indirimi' : 'bundle discount'}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-zinc-100" />

                {/* Hotel */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                    {isTr ? 'Otel' : 'Hotel'}
                  </p>
                  <div className="flex items-start justify-between gap-1">
                    <p className="font-semibold text-zinc-900 leading-tight">
                      {isTr ? bundle.hotelName : bundle.hotelNameEn}
                    </p>
                    <StarRating count={bundle.hotelStars} />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <MapPin className="h-3 w-3 shrink-0 text-zinc-400" />
                    <span>{isTr ? bundle.hotelLocation : bundle.hotelLocationEn}</span>
                  </div>
                </div>

                {/* Transfer */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                    {isTr ? 'Transfer' : 'Transfer'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Car className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="text-sm font-medium text-zinc-800">
                        {isTr ? bundle.transfer.vehicle : bundle.transfer.vehicleEn}
                      </span>
                    </div>
                    <TransferBadge type={bundle.transfer.type} />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Clock className="h-3 w-3 text-zinc-400" />
                    <span>{bundle.transfer.duration} {isTr ? 'dk' : 'min'}</span>
                    <span className="mx-1 text-zinc-300">•</span>
                    <span>₺{formatPrice(bundle.transfer.totalPrice)}</span>
                  </div>
                </div>

                {/* Tour */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                    {isTr ? 'Tur' : 'Tour'}
                  </p>
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-start gap-1.5">
                      <Camera className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" />
                      <span className="text-sm font-medium text-zinc-800 leading-tight">
                        {isTr ? bundle.tourName : bundle.tourNameEn}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Clock className="h-3 w-3 text-zinc-400" />
                    <span>{bundle.tourDuration} {isTr ? 'gün' : 'day(s)'}</span>
                    <span className="mx-1 text-zinc-300">•</span>
                    <span>₺{formatPrice(bundle.tourPrice)}</span>
                  </div>
                </div>

                {/* Expand / Collapse */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : bundle.id)}
                  className="flex items-center justify-center gap-1 text-xs text-zinc-400 hover:text-[#0066CC] transition-colors"
                >
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  {isExpanded
                    ? isTr ? 'Detayları gizle' : 'Hide details'
                    : isTr ? 'Fiyat detaylarını gör' : 'View price breakdown'}
                </button>

                {/* Expanded: price breakdown */}
                {isExpanded && (
                  <div className="rounded-xl bg-zinc-50 p-3 text-xs space-y-1.5">
                    <div className="flex justify-between text-zinc-600">
                      <span>{isTr ? 'Uçuş (kişi başı)' : 'Flight (per person)'}</span>
                      <span className="font-medium">₺{formatPrice(flight.price)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>{isTr ? 'Otel' : 'Hotel'}</span>
                      <span className="font-medium">₺{formatPrice(bundle.hotelPrice)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>{isTr ? 'Transfer' : 'Transfer'}</span>
                      <span className="font-medium">₺{formatPrice(bundle.transfer.totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>{isTr ? 'Tur' : 'Tour'}</span>
                      <span className="font-medium">₺{formatPrice(bundle.tourPrice)}</span>
                    </div>
                    <div className="h-px bg-zinc-200 my-1" />
                    <div className="flex justify-between font-semibold text-zinc-900">
                      <span>{isTr ? 'Normal Toplam' : 'Normal Total'}</span>
                      <span className="line-through">₺{formatPrice(bundle.originalTotal)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>{isTr ? 'Paket Fiyatı' : 'Bundle Price'}</span>
                      <span>₺{formatPrice(bundle.bundlePrice)}</span>
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={() => handleAddToCart(bundle.id)}
                  className={`mt-auto flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isAdded
                      ? 'bg-emerald-100 text-emerald-700'
                      : bundle.recommended
                      ? 'bg-[#0066CC] text-white shadow-md hover:bg-[#0052a3] hover:shadow-lg active:scale-95'
                      : 'bg-zinc-900 text-white hover:bg-zinc-700 active:scale-95'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {isTr ? 'Sepete Eklendi' : 'Added to Cart'}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      {isTr ? 'Sepete Ekle' : 'Add to Cart'}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="mt-4 text-center text-xs text-zinc-400">
        {isTr
          ? '💡 Paketler otomatik oluşturulur. Uçuş + otel + transfer + tur kombinasyonları değişiklik gösterebilir.'
          : '💡 Packages are auto-generated. Flight + hotel + transfer + tour combinations may vary.'}
      </p>
    </section>
  );
}
