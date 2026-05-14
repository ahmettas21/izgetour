'use client';

import React from 'react';
import { CreditCard, Smartphone, ShieldCheck, Wallet } from 'lucide-react';

export type PaymentMethod = 'card' | 'apple' | 'google';

type PaymentProps = {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
};

export default function PaymentOptions({ selected, onChange }: PaymentProps) {
  const options = [
    {
      id: 'card',
      title: 'Credit / Debit Card',
      desc: 'Secure payment via Stripe',
      icon: <CreditCard className="w-6 h-6 text-gray-700" />,
      badges: ['Visa', 'Mastercard']
    },
    {
      id: 'apple',
      title: 'Apple Pay',
      desc: 'Quick checkout via your Apple Wallet',
      icon: <Smartphone className="w-6 h-6 text-gray-700" />,
      badges: ['Apple']
    },
    {
      id: 'google',
      title: 'Google Pay',
      desc: 'Secure and fast via Google Wallet',
      icon: <Wallet className="w-6 h-6 text-gray-700" />,
      badges: ['Google']
    }
  ] as const;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 my-6 transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-100 p-2 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Payment Options</h2>
          <p className="text-sm text-gray-500">100% Secure Checkout</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {options.map((opt) => (
          <label
            key={opt.id}
            className={`
              relative flex cursor-pointer rounded-xl border p-4 hover:bg-gray-50 transition-colors
              ${selected === opt.id ? 'border-orange-500 bg-orange-50/20 shadow-sm' : 'border-gray-200'}
            `}
          >
            <div className="flex items-center w-full gap-4">
              {/* Radio Circle */}
              <div
                className={`
                  flex h-5 w-5 shrink-0 items-center justify-center rounded-full border
                  ${selected === opt.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}
                `}
              >
                {selected === opt.id && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>

              {/* Icon */}
              <div className="bg-white p-2 rounded-full border border-gray-100 shadow-sm">
                {opt.icon}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1">
                <span className="font-semibold text-gray-900">{opt.title}</span>
                <span className="text-xs text-gray-500">{opt.desc}</span>
              </div>

              {/* Badges */}
              <div className="hidden sm:flex gap-2">
                {opt.badges.map((badge) => (
                  <span key={badge} className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <input
              type="radio"
              name="paymentMethod"
              value={opt.id}
              className="sr-only"
              onChange={() => onChange(opt.id as PaymentMethod)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
