'use client';

import { Search, X } from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholderTr: string;
  placeholderEn: string;
  locale: 'tr' | 'en';
};

export default function TourSearchBar({ value, onChange, placeholderTr, placeholderEn, locale }: Props) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={locale === 'tr' ? placeholderTr : placeholderEn}
        className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-10 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-[#0066CC] focus:outline-none focus:ring-2 focus:ring-[#0066CC]/10"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
