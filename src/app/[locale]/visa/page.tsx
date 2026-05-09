'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { visaCountries } from '@/data/visa';
import { CheckCircle, Clock, FileText, ArrowRight } from 'lucide-react';

export default function VisaPage() {
  const t = useTranslations('visa');
  const [selectedId, setSelectedId] = useState(visaCountries[0].id);

  const country = visaCountries.find((c) => c.id === selectedId) ?? visaCountries[0];
  const steps = [t('step1'), t('step2'), t('step3'), t('step4'), t('step5')];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-zinc-900">{t('title')}</h1>
        <p className="mt-3 text-lg text-zinc-600">{t('subtitle')}</p>
      </div>

      {/* Country Selector */}
      <div className="mb-10">
        <label className="mb-3 block text-sm font-medium text-zinc-700">{t('selectCountry')}</label>
        <div className="flex flex-wrap gap-3">
          {visaCountries.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`rounded-xl border-2 px-5 py-3 text-sm font-medium transition-all ${
                selectedId === c.id
                  ? 'border-[#0066CC] bg-[#0066CC]/5 text-[#0066CC]'
                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
              }`}
            >
              <span className="mr-2">{c.flag}</span>
              {c.country}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Document Requirements */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-1 text-xl font-bold text-zinc-900">
              <FileText className="mr-2 inline-block h-5 w-5 text-[#0066CC]" />
              {t('documentChecklist')}
            </h2>
            <p className="mb-5 text-sm text-zinc-500">{country.country}</p>
            <ul className="space-y-3">
              {country.requirements.map((req) => (
                <li key={req} className="flex items-start gap-3 text-zinc-700">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-6 text-xl font-bold text-zinc-900">
              <Clock className="mr-2 inline-block h-5 w-5 text-[#0066CC]" />
              {t('timeline')}
            </h2>
            <div className="space-y-0">
              {steps.map((step, i) => (
                <div key={step} className="relative flex gap-4 pb-8 last:pb-0">
                  {i < steps.length - 1 && (
                    <div className="absolute left-[11px] top-7 h-full w-0.5 bg-zinc-200" />
                  )}
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0066CC] text-xs font-bold text-white">
                    {i + 1}
                  </div>
                  <div className="pt-0.5">
                    <p className="font-medium text-zinc-800">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price & CTA Sidebar */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6">
            <div className="mb-5 text-center">
              <div className="text-sm text-zinc-500">{t('processingTime')}</div>
              <div className="mt-1 text-lg font-semibold text-zinc-800">{country.processingTime}</div>
            </div>
            <div className="mb-6 text-center">
              <div className="text-sm text-zinc-500">{t('price')}</div>
              <div className="mt-1 text-3xl font-bold text-[#0066CC]">₺{country.price.toLocaleString()}</div>
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0066CC] py-3 font-semibold text-white transition-colors hover:bg-[#0052a3]">
              {t('apply')}
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-4 text-center text-xs text-zinc-400">{t('info')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
