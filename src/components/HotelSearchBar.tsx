'use client';

import { Search, X } from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholderTr: string;
  placeholderEn: string;
  locale: 'tr' | 'en';
};

export default function HotelSearchBar({ value, onChange, placeholderTr, placeholderEn, locale }: Props) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={locale === 'tr' ? placeholderTr : placeholderEn}
        className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
