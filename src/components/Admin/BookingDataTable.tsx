'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Search, XCircle, Eye, Mail, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import type { Booking } from '@/data/hubs/bookings';

type Props = {
  bookings: Booking[];
};

type SortKey = keyof Booking;
type SortDir = 'asc' | 'desc';

const paymentStatusStyles: Record<string, string> = {
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  refunded: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  cancelled: 'bg-zinc-50 text-zinc-500 ring-zinc-600/20',
};

export default function BookingDataTable({ bookings }: Props) {
  const t = useTranslations('admin');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [confirmAction, setConfirmAction] = useState<{
    action: string;
    bookingId: string;
  } | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return bookings.filter(
      (b) =>
        b.id.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.pnr.toLowerCase().includes(q) ||
        b.paymentStatus.toLowerCase().includes(q)
    );
  }, [bookings, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const va = String(a[sortKey] ?? '');
      const vb = String(b[sortKey] ?? '');
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleAction = (action: string, bookingId: string) => {
    setConfirmAction({ action, bookingId });
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white">
      {/* Search */}
      <div className="border-b border-zinc-100 p-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchBookings')}
            className="w-full rounded-xl border border-zinc-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-100 text-xs font-medium uppercase tracking-wide text-zinc-500">
              {(['id', 'customerName', 'paymentStatus', 'totalAmountTRY', 'pnr', 'createdAt'] as SortKey[]).map(
                (key) => (
                  <th
                    key={key}
                    className="cursor-pointer px-4 py-3 hover:text-zinc-800"
                    onClick={() => toggleSort(key)}
                  >
                    <div className="inline-flex items-center gap-1">
                      {t(key)}
                      {sortKey === key ? (
                        sortDir === 'asc' ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-40" />
                      )}
                    </div>
                  </th>
                )
              )}
              <th className="px-4 py-3 text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((booking) => (
              <tr
                key={booking.id}
                className="border-b border-zinc-50 transition-colors hover:bg-zinc-50/50"
              >
                <td className="px-4 py-3 font-mono text-xs font-medium text-zinc-800">
                  {booking.id}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-zinc-900">{booking.customerName}</div>
                  <div className="text-xs text-zinc-400">{booking.customerEmail}</div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                      paymentStatusStyles[booking.paymentStatus] ?? ''
                    }`}
                  >
                    {t(booking.paymentStatus)}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-sm font-medium text-zinc-900">
                  ₺{booking.totalAmountTRY.toLocaleString('tr-TR')}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500">{booking.pnr}</td>
                <td className="px-4 py-3 text-zinc-500">{booking.createdAt}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <button
                      onClick={() => handleAction('cancel', booking.id)}
                      className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      title={t('cancelBooking')}
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleAction('view', booking.id)}
                      className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      title={t('viewPdf')}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleAction('email', booking.id)}
                      className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-violet-50 hover:text-violet-600"
                      title={t('emailCustomer')}
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sorted.length === 0 && (
        <div className="flex flex-col items-center py-12">
          <Search className="mb-2 h-8 w-8 text-zinc-300" />
          <p className="text-sm text-zinc-400">{t('noBookingsFound')}</p>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-zinc-900">
              {t(`${confirmAction.action}ConfirmTitle`)}
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              {t(`${confirmAction.action}ConfirmDesc`, { id: confirmAction.bookingId })}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                className="rounded-xl bg-[#0066CC] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0052a3]"
              >
                {t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
