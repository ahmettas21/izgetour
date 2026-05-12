'use client';

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';

const EXTRAS = [
  { id: 'insurance', price: 250 },
  { id: 'guide', price: 400 },
  { id: 'transfer', price: 350 },
];

type FormState = { [key: string]: string } & { name: string; email: string; phone: string };

interface StepFormProps {
  step: number;
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  selectedExtras: string[];
  toggleExtra: (id: string) => void;
  t: (key: string) => string;
}

function StepForm({ step, form, setForm, selectedExtras, toggleExtra, t }: StepFormProps) {
  if (step === 1) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-6 text-xl font-bold text-zinc-900">{t('passengerInfo')}</h2>
        <div className="space-y-4">
          {(['name', 'email', 'phone'] as (keyof FormState)[]).map((f) => (
            <div key={f}>
              <label className="mb-1 block text-sm font-medium text-zinc-700">{t(f as string)}</label>
              <input
                value={form[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none ring-zinc-300 focus:ring-2"
                placeholder={f === 'name' ? 'Ahmet Yılmaz' : f === 'email' ? 'ornek@email.com' : '+90 532 123 45 67'}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-6 text-xl font-bold text-zinc-900">{t('extras')}</h2>
        <div className="space-y-3">
          {EXTRAS.map((extra) => {
            const checked = selectedExtras.includes(extra.id);
            return (
              <button key={extra.id} onClick={() => toggleExtra(extra.id)}
                className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-all ${
                  checked ? 'border-[#0066CC] bg-[#0066CC]/5' : 'border-zinc-200 hover:border-zinc-300'
                }`}>
                <div>
                  <div className="font-semibold text-zinc-900">{t(extra.id)}</div>
                  <div className="text-sm text-zinc-500">{t(`${extra.id}Desc`)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#0066CC]">₺{extra.price}</span>
                  <div className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                    checked ? 'border-[#0066CC] bg-[#0066CC]' : 'border-zinc-300'
                  }`}>{checked && <Check className="h-3 w-3 text-white" />}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
}

function SummaryCard({ subtotal, extrasTotal, discount, total, t }: any) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <h2 className="mb-6 text-xl font-bold text-zinc-900">{t('paymentSummary')}</h2>
      <div className="space-y-3">
        <div className="flex justify-between text-zinc-600"><span>{t('subtotal')}</span><span>₺{subtotal.toLocaleString()}</span></div>
        {extrasTotal > 0 && <div className="flex justify-between text-zinc-600"><span>{t('extrasTotal')}</span><span>₺{extrasTotal.toLocaleString()}</span></div>}
        {discount > 0 && <div className="flex justify-between text-emerald-600"><span>{t('discount')}</span><span>-₺{discount.toLocaleString()}</span></div>}
        <div className="border-t border-zinc-200 pt-3">
          <div className="flex justify-between text-lg font-bold text-zinc-900">
            <span>{t('total')}</span>
            <span className="text-[#0066CC]">₺{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReservationPage() {
  const t = useTranslations('reservation');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const subtotal = 5400;
  const extrasTotal = selectedExtras.reduce((sum, id) => sum + (EXTRAS.find((e) => e.id === id)?.price ?? 0), 0);
  const discount = subtotal > 3000 ? 500 : 0;
  const total = subtotal + extrasTotal - discount;

  const toggleExtra = (id: string) => setSelectedExtras((prev) =>
    prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
  );

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <Check className="h-10 w-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">{t('paymentSuccess')}</h1>
        <p className="mt-3 text-zinc-500">{t('paymentSuccessDesc')}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-zinc-900">{t('title')}</h1>
        <p className="mt-3 text-lg text-zinc-600">{t('subtitle')}</p>
      </div>

      <div className="mb-10 flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
              step >= s ? 'bg-[#0066CC] text-white' : 'bg-zinc-100 text-zinc-400'
            }`}>{step > s ? <Check className="h-4 w-4" /> : s}</div>
            <span className={`hidden text-sm sm:inline ${step >= s ? 'text-zinc-800' : 'text-zinc-400'}`}>
              {s === 1 ? t('passengerInfo') : s === 2 ? t('extras') : t('paymentSummary')}
            </span>
            {s < 3 && <div className="mx-1 h-px w-8 bg-zinc-200" />}
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <StepForm step={step} form={form} setForm={setForm} selectedExtras={selectedExtras} toggleExtra={toggleExtra} t={t} />
          {step === 3 && <SummaryCard {...{ subtotal, extrasTotal, discount, total, t }} />}

          <div className="mt-6 flex justify-between">
            {step > 1
              ? <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 rounded-full border border-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50">
                  <ArrowLeft className="h-4 w-4" /> {step === 2 ? t('passengerInfo') : t('extras')}
                </button>
              : <div />}
            {step < 3
              ? <button onClick={() => setStep(step + 1)} className="flex items-center gap-2 rounded-full bg-[#0066CC] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0052a3]">
                  {step === 1 ? t('extras') : t('paymentSummary')} <ArrowRight className="h-4 w-4" />
                </button>
              : <button onClick={handleSubmit} disabled={loading}
                  className="flex items-center gap-2 rounded-full bg-[#0066CC] px-8 py-2.5 font-semibold text-white transition-colors hover:bg-[#0052a3] disabled:opacity-60">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('processing')}</> : t('completePayment')}
                </button>}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <SummaryCard {...{ subtotal, extrasTotal, discount, total, t }} />
          </div>
        </div>
      </div>
    </div>
  );
}
