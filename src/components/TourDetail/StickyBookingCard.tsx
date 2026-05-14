'use client';

import React, { useState, useMemo } from 'react';
import { FiMinus, FiPlus, FiAlertCircle, FiShield } from 'react-icons/fi';

interface StickyBookingCardProps {
  price: number;
  locale: string;
}

export default function StickyBookingCard({ price, locale }: StickyBookingCardProps) {
  const [checkIn, setCheckIn] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  // Sosyal kanıt: rastgele stok uyarısı
  const lowStock = useMemo(() => Math.random() < 0.4, []);
  const viewerCount = useMemo(() => Math.floor(Math.random() * 6) + 3, []);

  const totalPrice = price * adults + price * 0.5 * children;

  return (
    <>
      {/* Desktop - Sticky Sidebar */}
      <div className="hidden lg:sticky lg:top-24 lg:block">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg">
          <div className="mb-4">
            <p className="text-xs text-zinc-500">{locale === 'tr' ? 'Kişi Başı' : 'Per Person'}</p>
            <p className="text-2xl font-bold text-[#0066CC]">
              ₺{price.toLocaleString()}
            </p>
          </div>

          {/* Tarih Seçimi */}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">
              {locale === 'tr' ? 'Tarih Seçin' : 'Select Date'}
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-[#0066CC] focus:outline-none focus:ring-1 focus:ring-[#0066CC]/30"
            />
          </div>

          {/* Yetişkin Sayısı */}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-700">
              {locale === 'tr' ? 'Yetişkin' : 'Adults'}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-500 transition-colors hover:border-[#0066CC] hover:text-[#0066CC]"
              >
                <FiMinus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-semibold">{adults}</span>
              <button
                onClick={() => setAdults(Math.min(10, adults + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-500 transition-colors hover:border-[#0066CC] hover:text-[#0066CC]"
              >
                <FiPlus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Çocuk Sayısı */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-700">
              {locale === 'tr' ? 'Çocuk' : 'Children'}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-500 transition-colors hover:border-[#0066CC] hover:text-[#0066CC]"
              >
                <FiMinus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-semibold">{children}</span>
              <button
                onClick={() => setChildren(Math.min(6, children + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-500 transition-colors hover:border-[#0066CC] hover:text-[#0066CC]"
              >
                <FiPlus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Stok Uyarısı */}
          {lowStock && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
              <FiAlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
              <span>
                {locale === 'tr'
                  ? 'Acele edin, son 2 koltuk kaldı!'
                  : 'Hurry, only 2 spots left!'}
              </span>
            </div>
          )}

          {/* Toplam Fiyat */}
          <div className="mb-4 border-t border-zinc-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">
                {locale === 'tr' ? 'Toplam' : 'Total'}
              </span>
              <span className="text-xl font-bold text-zinc-900">
                ₺{totalPrice.toLocaleString()}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-zinc-400">
              ₺{children > 0 ? `${adults} yetişkin + ${children} çocuk` : `${adults} yetişkin`}
            </p>
          </div>

          <button className="w-full rounded-full bg-[#0066CC] py-3 text-sm font-semibold text-white transition-all hover:bg-[#0052a3] active:scale-[0.98]">
            {locale === 'tr' ? 'Rezervasyon Yap' : 'Book Now'}
          </button>

          {/* Güvenlik bildirimi */}
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-zinc-400">
            <FiShield className="h-3.5 w-3.5" />
            <span>{locale === 'tr' ? 'Güvenli ödeme' : 'Secure checkout'}</span>
            <span className="mx-1">·</span>
            <span>{locale === 'tr' ? `${viewerCount} kişi bakıyor` : `${viewerCount} viewing`}</span>
          </div>
        </div>
      </div>

      {/* Mobile - Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white px-4 py-3 shadow-lg lg:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-zinc-900">
              ₺{totalPrice.toLocaleString()}
            </p>
            <p className="text-xs text-zinc-500">
              {locale === 'tr' ? 'Toplam' : 'Total'} · {adults} {locale === 'tr' ? 'yet' : 'ad'}
              {children > 0 ? ` + ${children} ${locale === 'tr' ? 'çoc' : 'ch'}` : ''}
            </p>
          </div>
          <button className="rounded-full bg-[#0066CC] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0052a3]">
            {locale === 'tr' ? 'Rezervasyon Yap' : 'Book Now'}
          </button>
        </div>
      </div>
    </>
  );
}
