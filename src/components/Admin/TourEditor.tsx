'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Plus, Trash2, GripVertical, ChevronLeft, ChevronRight, Check, Upload } from 'lucide-react';

type Step = 'details' | 'route' | 'pricing' | 'gallery';
const steps: Step[] = ['details', 'route', 'pricing', 'gallery'];

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string[];
}

interface TourForm {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  duration: number;
  maxParticipants: number;
  category: string;
  itinerary: ItineraryDay[];
  priceAdult: number;
  priceChild: number;
  currency: string;
  images: string[];
}

const defaultForm: TourForm = {
  title: '',
  titleEn: '',
  description: '',
  descriptionEn: '',
  duration: 1,
  maxParticipants: 20,
  category: 'culture',
  itinerary: [{ day: 1, title: '', description: '', meals: [''] }],
  priceAdult: 0,
  priceChild: 0,
  currency: 'TRY',
  images: [],
};

type Props = {
  onSave?: (tour: TourForm) => void;
  initialData?: Partial<TourForm>;
};

export default function TourEditor({ onSave, initialData }: Props) {
  const t = useTranslations('admin');
  const [step, setStep] = useState<number>(0);
  const [form, setForm] = useState<TourForm>({ ...defaultForm, ...initialData });

  const update = <K extends keyof TourForm>(key: K, value: TourForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addItineraryDay = () => {
    setForm((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, title: '', description: '', meals: [''] },
      ],
    }));
  };

  const updateItineraryDay = (index: number, field: keyof ItineraryDay, value: string | number) => {
    setForm((prev) => {
      const updated = [...prev.itinerary];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, itinerary: updated };
    });
  };

  const removeItineraryDay = (index: number) => {
    setForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 })),
    }));
  };

  const handleSave = () => {
    onSave?.(form);
  };

  const isStepValid = (s: number): boolean => {
    switch (steps[s]) {
      case 'details':
        return form.title.length > 0 && form.description.length > 0;
      case 'route':
        return form.itinerary.every((d) => d.title.length > 0);
      case 'pricing':
        return form.priceAdult > 0;
      case 'gallery':
        return true;
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white">
      {/* Step indicator */}
      <div className="border-b border-zinc-100 px-6 py-4">
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  i <= step
                    ? 'bg-[#0066CC] text-white'
                    : 'bg-zinc-100 text-zinc-400'
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-sm font-medium ${i <= step ? 'text-zinc-900' : 'text-zinc-400'}`}
              >
                {t(s)}
              </span>
              {i < steps.length - 1 && <div className="mx-2 h-px w-8 bg-zinc-200" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="p-6">
        {/* Step 0: Details */}
        {steps[step] === 'details' && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">{t('tourTitle')}</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-[#0066CC]"
                placeholder={t('tourTitlePlaceholder')}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">{t('tourTitleEn')}</label>
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => update('titleEn', e.target.value)}
                className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-[#0066CC]"
                placeholder="Tour title (English)"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">{t('description')}</label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-[#0066CC]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">{t('duration')}</label>
                <input
                  type="number"
                  min={1}
                  value={form.duration}
                  onChange={(e) => update('duration', Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-[#0066CC]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">{t('maxParticipants')}</label>
                <input
                  type="number"
                  min={1}
                  value={form.maxParticipants}
                  onChange={(e) => update('maxParticipants', Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-[#0066CC]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Route / Itinerary */}
        {steps[step] === 'route' && (
          <div className="space-y-4">
            {form.itinerary.map((day, i) => (
              <div
                key={i}
                className="relative rounded-xl border border-zinc-100 bg-zinc-50/50 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-zinc-300" />
                    <span className="text-sm font-semibold text-zinc-700">
                      {t('day')} {day.day}
                    </span>
                  </div>
                  {form.itinerary.length > 1 && (
                    <button
                      onClick={() => removeItineraryDay(i)}
                      className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={day.title}
                    onChange={(e) => updateItineraryDay(i, 'title', e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm outline-none focus:border-[#0066CC]"
                    placeholder={t('dayTitlePlaceholder')}
                  />
                  <textarea
                    value={day.description}
                    onChange={(e) => updateItineraryDay(i, 'description', e.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-xl border border-zinc-200 px-4 py-2 text-sm outline-none focus:border-[#0066CC]"
                    placeholder={t('dayDescPlaceholder')}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addItineraryDay}
              className="inline-flex items-center gap-2 rounded-xl border border-dashed border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:border-[#0066CC] hover:text-[#0066CC]"
            >
              <Plus className="h-4 w-4" />
              {t('addDay')}
            </button>
          </div>
        )}

        {/* Step 2: Pricing */}
        {steps[step] === 'pricing' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">{t('priceAdult')}</label>
                <input
                  type="number"
                  min={0}
                  value={form.priceAdult}
                  onChange={(e) => update('priceAdult', Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-[#0066CC]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">{t('priceChild')}</label>
                <input
                  type="number"
                  min={0}
                  value={form.priceChild}
                  onChange={(e) => update('priceChild', Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-[#0066CC]"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">{t('currency')}</label>
              <select
                value={form.currency}
                onChange={(e) => update('currency', e.target.value)}
                className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-[#0066CC]"
              >
                <option value="TRY">TRY</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Gallery */}
        {steps[step] === 'gallery' && (
          <div>
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-12">
              <div className="text-center">
                <Upload className="mx-auto mb-2 h-8 w-8 text-zinc-300" />
                <p className="text-sm text-zinc-500">{t('dragDropImages')}</p>
                <button className="mt-3 rounded-xl bg-[#0066CC] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0052a3]">
                  {t('uploadImages')}
                </button>
              </div>
            </div>
            {form.images.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative aspect-video rounded-lg bg-zinc-100">
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <button
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, idx) => idx !== i),
                        }))
                      }
                      className="absolute right-1 top-1 rounded-full bg-white/80 p-1 shadow-sm transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-4">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('previous')}
        </button>
        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
            disabled={!isStepValid(step)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0066CC] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0052a3] disabled:opacity-40"
          >
            {t('next')}
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <Check className="h-4 w-4" />
            {t('saveTour')}
          </button>
        )}
      </div>
    </div>
  );
}
