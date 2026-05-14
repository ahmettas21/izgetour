'use client';

import { useTranslations } from 'next-intl';
import { ArrowUpDown } from 'lucide-react';

export type SortOption =
  | 'price-asc'
  | 'price-desc'
  | 'duration'
  | 'departure'
  | 'arrival';

interface SortSelectProps {
  value: SortOption;
  onChange: (v: SortOption) => void;
  className?: string;
}

export default function SortSelect({
  value,
  onChange,
  className = '',
}: SortSelectProps) {
  const t = useTranslations('flights');

  const OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'price-asc', label: t('sortCheapest') },
    { value: 'price-desc', label: t('sortExpensive') },
    { value: 'duration', label: t('sortShortest') },
    { value: 'departure', label: t('sortDeparture') },
    { value: 'arrival', label: t('sortArrival') },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:bg-surface-elevated dark:border-border"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}