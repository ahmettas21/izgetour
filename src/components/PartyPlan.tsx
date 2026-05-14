'use client';

import React, { useState } from 'react';

/* ------------------------------------------------------------------ */
/*  PartyPlan — Sosyal Seyahat Grubu Oylama Paneli                    */
/*  Arkadaşlarla seyahat seçeneklerini oylamak için interaktif kart  */
/* ------------------------------------------------------------------ */

export type VoteItemType = 'Tour' | 'Hotel' | 'Flight';

export interface VoteItem {
  id: string;
  title: string;
  titleEn: string;
  type: VoteItemType;
  price: number;
  upvotes: number;
  downvotes: number;
  myVote: 'up' | 'down' | null;
}

interface PartyPlanProps {
  locale?: 'tr' | 'en';
  initialItems?: VoteItem[];
  onAddItem?: (item: VoteItem) => void;
}

const DEFAULT_ITEMS: VoteItem[] = [
  {
    id: 'p1',
    title: 'Kapadokya Balon Turu & Peribacaları',
    titleEn: 'Cappadocia Balloon Tour & Fairy Chimneys',
    type: 'Tour',
    price: 4500,
    upvotes: 5,
    downvotes: 1,
    myVote: null,
  },
  {
    id: 'p2',
    title: 'Antalya Kemer Otel Paketi (Her Şey Dahil)',
    titleEn: 'Antalya Kemer All-Inclusive Hotel Package',
    type: 'Hotel',
    price: 8000,
    upvotes: 3,
    downvotes: 0,
    myVote: null,
  },
  {
    id: 'p3',
    title: 'İstanbul Boğaz Turu & Akşam Yemeği',
    titleEn: 'Istanbul Bosphorus Tour & Dinner',
    type: 'Tour',
    price: 2500,
    upvotes: 2,
    downvotes: 1,
    myVote: null,
  },
  {
    id: 'p4',
    title: 'Bursa Uludağ Kayak & Konaklama Paketi',
    titleEn: 'Bursa Uludag Ski & Stay Package',
    type: 'Tour',
    price: 6000,
    upvotes: 1,
    downvotes: 3,
    myVote: null,
  },
];

const TYPE_BADGE: Record<VoteItemType, string> = {
  Tour: '🎯 Tur',
  Hotel: '🏨 Otel',
  Flight: '✈️ Uçuş',
};

export default function PartyPlan({ locale = 'tr', initialItems }: PartyPlanProps) {
  const isTr = locale === 'tr';
  const [items, setItems] = useState<VoteItem[]>(initialItems ?? DEFAULT_ITEMS);
  const [copied, setCopied] = useState(false);
  const [groupMemberCount] = useState(4);

  const handleVote = (id: string, vote: 'up' | 'down') => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        let { upvotes, downvotes, myVote } = item;

        // Toggle: if same vote clicked, remove it
        if (myVote === vote) {
          return {
            ...item,
            myVote: null,
            upvotes: vote === 'up' ? upvotes - 1 : upvotes,
            downvotes: vote === 'down' ? downvotes - 1 : downvotes,
          };
        }

        // Remove previous vote if any
        if (myVote === 'up') upvotes -= 1;
        if (myVote === 'down') downvotes -= 1;

        return {
          ...item,
          myVote: vote,
          upvotes: vote === 'up' ? upvotes + 1 : upvotes,
          downvotes: vote === 'down' ? downvotes + 1 : downvotes,
        };
      })
    );
  };

  const shareLink = 'https://izgetour.com/party/xp-9f8a';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPrice = (price: number) => {
    if (isTr) return `₺${price.toLocaleString('tr-TR')}`;
    return `$${price.toLocaleString('en-US')}`;
  };

  const totalVotes = items.reduce((s, i) => s + i.upvotes + i.downvotes, 0);
  const topItem = items.reduce((best, i) => (i.upvotes > (best?.upvotes ?? 0) ? i : best), items[0]);
  const topItemTitle = isTr ? topItem?.title : topItem?.titleEn;

  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
            🎉 {isTr ? 'Sosyal Seyahat Grubu' : 'Social Travel Group'}
          </h2>
          <p className="mt-0.5 text-sm text-zinc-500">
            {isTr
              ? 'Arkadaşlarını davet et, birlikte oylayın!'
              : 'Invite your friends and vote together!'}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <input
            type="text"
            readOnly
            value={shareLink}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-500 outline-none select-all sm:w-48"
          />
          <button
            onClick={handleCopy}
            className="whitespace-nowrap rounded-lg bg-pink-500 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-pink-600 active:scale-95"
          >
            {copied
              ? isTr
                ? '✅ Kopyalandı!'
                : '✅ Copied!'
              : isTr
                ? '🔗 Paylaş'
                : '🔗 Share'}
          </button>
        </div>
      </div>

      {/* Vote Items */}
      <div className="space-y-3">
        {items.map((item) => {
          const title = isTr ? item.title : item.titleEn;
          const nTotal = item.upvotes + item.downvotes || 1;
          const upPct = Math.round((item.upvotes / nTotal) * 100);
          const isTop = item.id === topItem?.id;

          return (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-xl border p-4 transition-all ${
                item.myVote
                  ? 'border-pink-200 bg-pink-50/50 shadow-sm'
                  : 'border-zinc-100 bg-zinc-50 hover:border-pink-100'
              } ${isTop && item.upvotes > 1 ? 'ring-1 ring-pink-300' : ''}`}
            >
              {/* Popularity bar */}
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-pink-300 to-pink-500 transition-all"
                style={{ width: `${upPct}%` }} />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-zinc-200/70 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-600">
                      {TYPE_BADGE[item.type]}
                    </span>
                    {isTop && item.upvotes > 1 && (
                      <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-[11px] font-semibold text-pink-600">
                        ⭐ {isTr ? 'Popüler' : 'Popular'}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 font-semibold text-zinc-800">{title}</p>
                  <p className="mt-0.5 text-sm font-bold text-pink-600">{formatPrice(item.price)}</p>
                </div>

                {/* Vote buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote(item.id, 'up')}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all active:scale-90 ${
                      item.myVote === 'up'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-emerald-200 hover:bg-emerald-50'
                    }`}
                  >
                    👍 <span>{item.upvotes}</span>
                  </button>
                  <button
                    onClick={() => handleVote(item.id, 'down')}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all active:scale-90 ${
                      item.myVote === 'down'
                        ? 'border-red-300 bg-red-50 text-red-700'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-red-200 hover:bg-red-50'
                    }`}
                  >
                    👎 <span>{item.downvotes}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-col gap-3 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          {isTr ? (
            <>
              👥 Grupta <span className="font-bold text-zinc-700">{groupMemberCount}</span> kişi · Toplam{' '}
              <span className="font-bold text-zinc-700">{totalVotes}</span> oy
              {topItemTitle && (
                <span className="ml-1">
                  · Lider: <span className="font-medium text-pink-600">{topItemTitle}</span>
                </span>
              )}
            </>
          ) : (
            <>
              👥 <span className="font-bold text-zinc-700">{groupMemberCount}</span> members ·{' '}
              <span className="font-bold text-zinc-700">{totalVotes}</span> total votes
              {topItemTitle && (
                <span className="ml-1">
                  · Leading: <span className="font-medium text-pink-600">{topItemTitle}</span>
                </span>
              )}
            </>
          )}
        </p>
        <button className="rounded-full bg-pink-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-pink-600 active:scale-95">
          {isTr ? '✅ Seçimi Onayla ve Öde' : '✅ Confirm & Pay'}
        </button>
      </div>
    </div>
  );
}
