'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Search, ChevronLeft, ChevronRight, X, Phone, Mail, Calendar } from 'lucide-react';
import { mockCustomers, getCustomerRecentBookings, type Customer } from '@/data/hubs/customers';
import { useLocale } from 'next-intl';

const PAGE_SIZE = 10;

type FilterStatus = 'all' | 'active' | 'inactive';

export default function AdminCustomersPage() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = useMemo(() => {
    return mockCustomers.filter((c) => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search);
      const matchFilter =
        filter === 'all' || c.status === filter;
      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleFilter = (val: FilterStatus) => {
    setFilter(val);
    setPage(1);
  };

  const formatTRY = (n: number) =>
    `₺${n.toLocaleString('tr-TR')}`;

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">{t('customers.title')}</h1>
        <p className="mt-1 text-sm text-zinc-500">{t('customers.subtitle')}</p>
      </div>

      {/* Search & Filter */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t('customers.searchPlaceholder')}
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-4 text-sm
              text-zinc-900 placeholder:text-zinc-400 focus:border-[#0066CC] focus:outline-none
              focus:ring-1 focus:ring-[#0066CC]"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-150
                ${
                  filter === f
                    ? 'bg-[#0066CC] text-white'
                    : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                }`}
            >
              {t(`customers.filter${f.charAt(0).toUpperCase() + f.slice(1)}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Table (desktop) */}
      <div className="hidden rounded-2xl border border-zinc-200 bg-white overflow-hidden sm:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {t('customers.colName')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {t('customers.colEmail')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {t('customers.colPhone')}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {t('customers.colBookings')}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {t('customers.colSpent')}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {t('customers.colStatus')}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-zinc-400">
                  {t('customers.noResults')}
                </td>
              </tr>
            ) : (
              paginated.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-zinc-50/50 transition-colors duration-100"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#0066CC]/10 text-[#0066CC] text-sm font-semibold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-900">{customer.name}</div>
                        <div className="text-xs text-zinc-400">{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600">{customer.email}</td>
                  <td className="px-4 py-3 text-sm text-zinc-600">{customer.phone}</td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-zinc-700">
                    {customer.totalBookings}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-zinc-900">
                    {formatTRY(customer.totalSpentTRY)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${
                          customer.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-zinc-100 text-zinc-500'
                        }`}
                    >
                      {t(`customers.status${customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#0066CC]
                        hover:bg-[#0066CC]/10 transition-colors duration-150"
                    >
                      {t('customers.viewDetails')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <div className="grid gap-4 sm:hidden">
        {paginated.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-12 text-center text-sm text-zinc-400">
            {t('customers.noResults')}
          </div>
        ) : (
          paginated.map((customer) => (
            <div
              key={customer.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0066CC]/10 text-[#0066CC] text-base font-semibold">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">{customer.name}</div>
                    <div className="text-xs text-zinc-400">{customer.email}</div>
                  </div>
                </div>
                <span
                  className={`inline-flex flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${customer.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-zinc-100 text-zinc-500'}`}
                >
                  {t(`customers.status${customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}`)}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-zinc-50 p-3">
                  <div className="text-xs text-zinc-400">{t('customers.colBookings')}</div>
                  <div className="mt-0.5 text-sm font-semibold text-zinc-900">{customer.totalBookings}</div>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3">
                  <div className="text-xs text-zinc-400">{t('customers.colSpent')}</div>
                  <div className="mt-0.5 text-sm font-semibold text-zinc-900 truncate">
                    {formatTRY(customer.totalSpentTRY)}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setSelectedCustomer(customer)}
                  className="flex-1 rounded-xl border border-[#0066CC] py-2 text-xs font-semibold
                    text-[#0066CC] hover:bg-[#0066CC]/5 transition-colors duration-150"
                >
                  {t('customers.viewDetails')}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-zinc-500">
            {t('customers.showing', {
              count: (currentPage - 1) * PAGE_SIZE + 1,
              end: Math.min(currentPage * PAGE_SIZE, filtered.length),
              total: filtered.length,
            })}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200
                bg-white text-zinc-500 hover:bg-zinc-50 disabled:cursor-not-allowed
                disabled:opacity-40 transition-colors duration-150"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex h-9 min-w-[2.25rem] items-center justify-center rounded-xl
                  text-sm font-medium transition-colors duration-150
                  ${
                    p === currentPage
                      ? 'bg-[#0066CC] text-white'
                      : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                  }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200
                bg-white text-zinc-500 hover:bg-zinc-50 disabled:cursor-not-allowed
                disabled:opacity-40 transition-colors duration-150"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedCustomer(null)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <div>
                <h2 className="text-base font-bold text-zinc-900">{t('customers.detailTitle')}</h2>
                <p className="mt-0.5 text-xs text-zinc-400">{selectedCustomer.id}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400
                  hover:bg-zinc-100 hover:text-zinc-600 transition-colors duration-150"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Customer info */}
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0066CC]/10
                  text-[#0066CC] text-lg font-bold"
                >
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <div className="text-base font-semibold text-zinc-900">{selectedCustomer.name}</div>
                  <div
                    className={`mt-0.5 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${selectedCustomer.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-zinc-100 text-zinc-500'}`}
                  >
                    {t(`customers.status${selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}`)}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-sm text-zinc-600">
                  <Mail className="h-4 w-4 flex-shrink-0 text-zinc-400" />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-600">
                  <Phone className="h-4 w-4 flex-shrink-0 text-zinc-400" />
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-600">
                  <Calendar className="h-4 w-4 flex-shrink-0 text-zinc-400" />
                  <span>
                    {t('customers.lastBooking')}: {formatDate(selectedCustomer.lastBookingDate)}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-zinc-50 p-3">
                  <div className="text-xs text-zinc-400">{t('customers.colBookings')}</div>
                  <div className="mt-0.5 text-lg font-bold text-zinc-900">
                    {selectedCustomer.totalBookings}
                  </div>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3">
                  <div className="text-xs text-zinc-400">{t('customers.totalSpent')}</div>
                  <div className="mt-0.5 text-lg font-bold text-zinc-900 truncate">
                    {formatTRY(selectedCustomer.totalSpentTRY)}
                  </div>
                </div>
              </div>

              {/* Recent bookings */}
              <div>
                <div className="mb-2 text-sm font-semibold text-zinc-900">
                  {t('customers.recentBookings')}
                </div>
                <div className="space-y-2">
                  {(() => {
                    const recentBookings = getCustomerRecentBookings(selectedCustomer.id);
                    if (recentBookings.length === 0) {
                      return (
                        <p className="py-3 text-sm text-zinc-400">{t('customers.noRecentBookings')}</p>
                      );
                    }
                    return recentBookings.map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between rounded-xl border border-zinc-100
                          bg-zinc-50/50 px-3 py-2.5"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-zinc-800 truncate">
                            {locale === 'tr' ? b.tour : b.tourEn}
                          </div>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-400">
                            <span>{b.pnr}</span>
                            <span>·</span>
                            <span>{formatDate(b.travelDate)}</span>
                          </div>
                        </div>
                        <div className="ml-3 flex flex-shrink-0 items-center gap-2">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium
                              ${b.paymentStatus === 'paid'
                                ? 'bg-emerald-50 text-emerald-700'
                                : b.paymentStatus === 'pending'
                                ? 'bg-amber-50 text-amber-700'
                                : b.paymentStatus === 'refunded'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-zinc-100 text-zinc-500'}`}
                          >
                            {t(b.paymentStatus)}
                          </span>
                          <span className="text-sm font-semibold text-zinc-700">
                            {formatTRY(b.totalAmountTRY)}
                          </span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
