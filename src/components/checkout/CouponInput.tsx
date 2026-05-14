'use client';

import React, { useState } from 'react';
import { Tag, CheckCircle2, Ticket } from 'lucide-react';

type CouponProps = {
  onApply: (code: string) => Promise<boolean>; // Returns true if valid, false if invalid
};

export default function CouponInput({ onApply }: CouponProps) {
  const [val, setVal] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleApply = async () => {
    if (!val.trim()) return;
    setStatus('loading');
    try {
      const isValid = await onApply(val.trim().toUpperCase());
      setStatus(isValid ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleApply();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 my-6 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-indigo-50 p-2 rounded-lg">
          <Tag className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Promo Code</h2>
          <p className="text-sm text-gray-500">Have a coupon? Enter it here.</p>
        </div>
      </div>

      <div className="relative flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Ticket className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={val}
            onChange={(e) => {
              setVal(e.target.value.toUpperCase());
              if (status !== 'idle') setStatus('idle');
            }}
            onKeyDown={handleKeyDown}
            disabled={status === 'success' || status === 'loading'}
            className={`
              block w-full pl-10 pr-3 py-3 border rounded-xl leading-5 bg-gray-50 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white sm:text-sm font-semibold uppercase tracking-wider transition-all
              ${status === 'error' ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'}
              ${status === 'success' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : ''}
            `}
            placeholder="ENTER CODE"
          />
        </div>
        
        <button
          onClick={handleApply}
          disabled={!val.trim() || status === 'loading' || status === 'success'}
          className={`
            min-w-[120px] inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white
            focus:outline-none transition-all active:scale-[0.98]
            ${status === 'success' 
              ? 'bg-emerald-600' 
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed'}
          `}
        >
          {status === 'loading' ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : status === 'success' ? (
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Applied</span>
          ) : (
            'Apply'
          )}
        </button>
      </div>

      {status === 'error' && (
        <p className="mt-2 text-sm text-red-600 font-medium animate-in fade-in slide-in-from-top-1">
          Invalid or expired promo code.
        </p>
      )}
      {status === 'success' && (
        <p className="mt-2 text-sm text-emerald-600 font-medium animate-in fade-in slide-in-from-top-1">
          Code applied successfully! Discount updated in summary.
        </p>
      )}
    </div>
  );
}
