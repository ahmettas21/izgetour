'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Star,
  ArrowLeft,
  MapPin,
  Clock,
} from 'lucide-react';
import { MOCK_TOURS, type Tour } from '@/data/tours';
import { useLocale } from 'next-intl';

const PAGE_SIZE = 10;

type FilterStatus = 'all' | 'active' | 'inactive';

const CATEGORY_LABELS_TR: Record<string, string> = {
  culture: 'Kültür',
  nature: 'Doğa',
  sea: 'Deniz',
  city: 'Şehir',
};

const CATEGORY_LABELS_EN: Record<string, string> = {
  culture: 'Culture',
  nature: 'Nature',
  sea: 'Sea',
  city: 'City',
};

const STATUS_LABELS_TR: Record<string, string> = {
  active: 'Aktif',
  inactive: 'Pasif',
};

const STATUS_LABELS_EN: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
};

const CATEGORY_BG: Record<string, string> = {
  culture: 'bg-violet-50 text-violet-700',
  nature: 'bg-emerald-50 text-emerald-700',
  sea: 'bg-blue-50 text-blue-700',
  city: 'bg-amber-50 text-amber-700',
};

const STATUS_BG: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  inactive: 'bg-zinc-100 text-zinc-500',
};

interface EditingTour {
  tour: Tour;
  index: number;
}

export default function AdminToursPage() {
  const t = useTranslations('admin.tours.list');
  const locale = useLocale();
  const isEn = locale === 'en';

  const [tours, setTours] = useState<Tour[]>(MOCK_TOURS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Tour | null>(null);
  const [editTarget, setEditTarget] = useState<EditingTour | null>(null);
  const [editForm, setEditForm] = useState<Partial<Tour>>({});

  const filtered = useMemo(() => {
    return tours.filter((tour) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        tour.title.toLowerCase().includes(q) ||
        tour.titleEn.toLowerCase().includes(q) ||
        tour.location.toLowerCase().includes(q);
      const matchFilter = filter === 'all' || (filter === 'active' ? tour.rating >= 4.7 : tour.rating < 4.7);
      return matchSearch && matchFilter;
    });
  }, [tours, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const formatTRY = (n: number) => `₺${n.toLocaleString('tr-TR')}`;

  const catLabel = (cat?: string) => {
    if (!cat) return '—';
    return isEn ? (CATEGORY_LABELS_EN[cat] ?? cat) : (CATEGORY_LABELS_TR[cat] ?? cat);
  };

  const statusLabel = (s: boolean) => {
    const key = s ? 'active' : 'inactive';
    return isEn ? STATUS_LABELS_EN[key] : STATUS_LABELS_TR[key];
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setTours((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleEditOpen = (tour: Tour, index: number) => {
    setEditTarget({ tour, index });
    setEditForm({ ...tour });
  };

  const handleEditSave = () => {
    if (!editTarget) return;
    setTours((prev) =>
      prev.map((t) => (t.id === editTarget.tour.id ? { ...t, ...editForm } as Tour : t))
    );
    setEditTarget(null);
    setEditForm({});
  };

  const getStatus = (tour: Tour) => tour.rating >= 4.7;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href={`/${locale}/admin`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-800"
      >
        <ArrowLeft className="h-4 w-4" />
        {useTranslations('admin')('backToDashboard')}
      </Link>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{t('title')}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t('subtitle')}</p>
        </div>
        <Link
          href={`/${locale}/admin/tours/new`}
          className="flex items-center gap-2 rounded-xl bg-[#0066CC] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0052a3]"
        >
          <Plus className="h-4 w-4" />
          {t('addNewTour')}
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={t('searchPlaceholder')}
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#0066CC] focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                filter === f
                  ? 'bg-[#0066CC] text-white'
                  : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {t(`filter${f.charAt(0).toUpperCase() + f.slice(1)}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Table (desktop) */}
      <div className="hidden overflow-hidden rounded-2xl border border-zinc-200 bg-white sm:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 w-20">
                {t('colImage')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {t('colTitle')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {t('colLocation')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {t('colCategory')}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-zinc-400 w-20">
                {t('colDuration')}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {t('colPrice')}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-zinc-400 w-20">
                {t('colRating')}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {t('colStatus')}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {t('colActions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-sm text-zinc-400">
                  {t('noResults')}
                </td>
              </tr>
            ) : (
              paginated.map((tour) => {
                const isActive = getStatus(tour);
                return (
                  <tr
                    key={tour.id}
                    className="hover:bg-zinc-50/50 transition-colors duration-100"
                  >
                    <td className="px-4 py-3">
                      <div className="relative h-12 w-20 overflow-hidden rounded-lg bg-zinc-100">
                        <Image
                          src={tour.image}
                          alt={tour.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-zinc-900 max-w-[200px] truncate">
                        {isEn ? tour.titleEn : tour.title}
                      </div>
                      <div className="text-xs text-zinc-400">{tour.id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-zinc-600">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-zinc-400" />
                        {tour.location}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {tour.category && (
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_BG[tour.category] ?? 'bg-zinc-100 text-zinc-600'}`}>
                          {catLabel(tour.category)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-zinc-600">
                        <Clock className="h-3.5 w-3.5 text-zinc-400" />
                        {tour.duration}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-zinc-900">
                      {formatTRY(tour.price)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-0.5 text-sm">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-medium text-zinc-700">{tour.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BG[isActive ? 'active' : 'inactive']}`}>
                        {statusLabel(isActive)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            const idx = tours.findIndex((t) => t.id === tour.id);
                            handleEditOpen(tour, idx);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title={t('editTour')}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(tour)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title={t('deleteTour')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <div className="grid gap-4 sm:hidden">
        {paginated.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-12 text-center text-sm text-zinc-400">
            {t('noResults')}
          </div>
        ) : (
          paginated.map((tour) => {
            const isActive = getStatus(tour);
            return (
              <div key={tour.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                    <Image src={tour.image} alt={tour.title} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-zinc-900 truncate">
                      {isEn ? tour.titleEn : tour.title}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500">
                      <MapPin className="h-3 w-3" /> {tour.location}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BG[isActive ? 'active' : 'inactive']}`}>
                        {statusLabel(isActive)}
                      </span>
                      <span className="text-sm font-semibold text-zinc-900">{formatTRY(tour.price)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => { const idx = tours.findIndex((t) => t.id === tour.id); handleEditOpen(tour, idx); }}
                    className="flex-1 rounded-xl border border-[#0066CC] py-2 text-xs font-semibold text-[#0066CC] hover:bg-blue-50 transition-colors"
                  >
                    {t('editTour')}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(tour)}
                    className="flex-1 rounded-xl border border-red-200 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    {t('deleteTour')}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-zinc-500">
            {t('showing', {
              count: (currentPage - 1) * PAGE_SIZE + 1,
              end: Math.min(currentPage * PAGE_SIZE, filtered.length),
              total: filtered.length,
            })}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex h-9 min-w-[2.25rem] items-center justify-center rounded-xl text-sm font-medium transition-colors ${
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
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-zinc-200 bg-white shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <h2 className="text-base font-bold text-zinc-900">{t('deleteConfirmTitle')}</h2>
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-zinc-600">
                {t('deleteConfirmDesc', { title: isEn ? deleteTarget.titleEn : deleteTarget.title })}
              </p>
            </div>
            <div className="flex gap-3 px-6 pb-5">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditTarget(null)} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <h2 className="text-base font-bold text-zinc-900">{t('modalEditTitle')}</h2>
              <button
                onClick={() => setEditTarget(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              {/* Title TR */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">{t('colTitle')} (TR)</label>
                <input
                  type="text"
                  value={editForm.title ?? ''}
                  onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#0066CC] focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
                />
              </div>
              {/* Title EN */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">{t('colTitle')} (EN)</label>
                <input
                  type="text"
                  value={editForm.titleEn ?? ''}
                  onChange={(e) => setEditForm((f) => ({ ...f, titleEn: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#0066CC] focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
                />
              </div>
              {/* Location */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">{t('colLocation')}</label>
                <input
                  type="text"
                  value={editForm.location ?? ''}
                  onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#0066CC] focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
                />
              </div>
              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-500">{t('colPrice')} (TRY)</label>
                  <input
                    type="number"
                    value={editForm.price ?? 0}
                    onChange={(e) => setEditForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-[#0066CC] focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-500">{t('colRating')}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editForm.rating ?? 0}
                    onChange={(e) => setEditForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-[#0066CC] focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-5 border-t border-zinc-100 pt-4">
              <button
                onClick={() => setEditTarget(null)}
                className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleEditSave}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#0066CC] py-2.5 text-sm font-semibold text-white hover:bg-[#0052a3] transition-colors"
              >
                <Check className="h-4 w-4" />
                {t('colActions')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
