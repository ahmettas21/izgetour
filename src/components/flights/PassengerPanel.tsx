'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Users, Minus, Plus, ChevronDown } from 'lucide-react';
import type { CabinClass } from './types';

export interface PassengerCounts {
  adult: number;
  child: number;
  infant: number;
}

interface PassengerPanelProps {
  passengers: PassengerCounts;
  onChange: (p: PassengerCounts) => void;
  cabin: CabinClass;
  onCabinChange: (c: CabinClass) => void;
  className?: string;
}

const MAX_TOTAL = 9;

const CABIN_OPTIONS: CabinClass[] = ['economy', 'business', 'premium'];

export default function PassengerPanel({
  passengers,
  onChange,
  cabin,
  onCabinChange,
  className = '',
}: PassengerPanelProps) {
  const t = useTranslations('flights');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const update = (key: keyof PassengerCounts, delta: number) => {
    const next: PassengerCounts = {
      ...passengers,
      [key]: Math.max(0, passengers[key] + delta),
    };
    if (next.infant > next.adult) next.infant = next.adult;
    if (next.adult === 0 && (next.child > 0 || next.infant > 0)) next.adult = 1;
    if (next.adult + next.child + next.infant > MAX_TOTAL) return;
    onChange(next);
  };

  const total = passengers.adult + passengers.child + passengers.infant;

  const labelParts: string[] = [`${passengers.adult} ${t('adult')}`];
  if (passengers.child > 0) labelParts.push(`${passengers.child} ${t('child')}`);
  if (passengers.infant > 0) labelParts.push(`${passengers.infant} ${t('infant')}`);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          flex w-full items-center gap-2 rounded-xl border bg-surface px-3.5 py-3 text-left transition-all
          ${open ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'border-border hover:border-primary/50'}
          dark:bg-surface-elevated dark:border-border
        `}
      >
        <Users className="h-4 w-4 shrink-0 text-primary" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground truncate">
            {labelParts.join(', ')}
          </div>
          <div className="text-xs text-muted-foreground">
            {t(`cabin_${cabin}`)}
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-72 rounded-xl border border-border bg-surface shadow-xl animate-scale-in overflow-hidden dark:bg-surface-elevated dark:border-border">
          <div className="p-4 space-y-4">
            {/* Passenger types */}
            {(
              [
                { key: 'adult' as const, label: t('adult'), sub: '12+', min: 1 },
                { key: 'child' as const, label: t('child'), sub: '2–11', min: 0 },
                { key: 'infant' as const, label: t('infant'), sub: '0–23 ay', min: 0 },
              ] as const
            ).map((item, idx) => (
              <div key={item.key}>
                {idx > 0 && <div className="h-px bg-border" />}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.sub}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => update(item.key, -1)}
                      disabled={
                        item.key === 'adult'
                          ? passengers.adult <= 1
                          : passengers[item.key] <= 0
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed dark:bg-surface-elevated dark:border-border"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-foreground">
                      {passengers[item.key]}
                    </span>
                    <button
                      type="button"
                      onClick={() => update(item.key, 1)}
                      disabled={
                        item.key === 'infant'
                          ? passengers.infant >= passengers.adult || total >= MAX_TOTAL
                          : total >= MAX_TOTAL
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed dark:bg-surface-elevated dark:border-border"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Cabin class */}
            <div className="h-px bg-border" />
            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">
                {t('cabinClass')}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {CABIN_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onCabinChange(c)}
                    className={`
                      rounded-lg border py-2 px-1 text-center text-xs font-medium transition-all
                      ${
                        cabin === c
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground dark:border-border'
                      }
                    `}
                  >
                    {t(`cabin_${c}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Done */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90"
            >
              {t('done')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
