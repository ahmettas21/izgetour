'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, X, Check } from 'lucide-react';
import { Airport, searchAirports } from '@/data/airports';

interface AirportAutocompleteProps {
  value: Airport | null;
  onChange: (a: Airport | null) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function AirportAutocomplete({
  value,
  onChange,
  label,
  placeholder,
  className = '',
}: AirportAutocompleteProps) {
  const t = useTranslations('flights');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(
    value ? `${value.cityNative} (${value.iata})` : '',
  );
  const [results, setResults] = useState<Airport[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback((q: string) => {
    setResults(searchAirports(q));
  }, []);

  useEffect(() => {
    if (open) {
      handleSearch(query);
    }
  }, [query, open, handleSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (airport: Airport) => {
    onChange(airport);
    setQuery(`${airport.cityNative} (${airport.iata})`);
    setOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery('');
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          {label}
        </label>
      )}

      <div
        className={`
          flex items-center gap-2 rounded-xl border bg-surface px-3.5 py-3 text-left transition-all cursor-text
          ${open
            ? 'border-primary ring-2 ring-primary/20 shadow-md'
            : 'border-border hover:border-primary/50'}
          dark:bg-surface-elevated dark:border-border
        `}
        onClick={() => {
          const input = containerRef.current?.querySelector('input');
          input?.focus();
        }}
      >
        <MapPin className="h-4 w-4 shrink-0 text-primary" />
        <input
          value={query}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder={placeholder ?? t('airportPlaceholder')}
          className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground min-w-0"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="shrink-0 rounded-full p-0.5 text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-surface shadow-xl animate-scale-in overflow-hidden dark:bg-surface-elevated dark:border-border">
          {results.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto py-1">
              {results.map((airport) => (
                <li key={airport.iata}>
                  <button
                    type="button"
                    onClick={() => handleSelect(airport)}
                    className={`
                      flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-primary-muted
                      ${value?.iata === airport.iata ? 'bg-primary-muted' : ''}
                    `}
                  >
                    <span className="flex h-8 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-primary-muted text-xs font-bold text-primary dark:bg-primary/10">
                      {airport.iata}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-foreground truncate">
                        {airport.cityNative}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {airport.country}
                      </div>
                    </div>
                    {value?.iata === airport.iata && (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              {t('noResults')}
            </div>
          ) : (
            <div className="px-4 py-3 text-xs text-muted-foreground">
              {t('minChars')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
