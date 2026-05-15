'use client';

import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';

export default function SearchWidget() {
  const t = useTranslations('search');
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/tours?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-xl ring-1 ring-border"
    >
      <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('placeholder')}
        className="flex-1 bg-transparent py-2 text-foreground outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
      >
        {t('button')}
      </button>
    </form>
  );
}
