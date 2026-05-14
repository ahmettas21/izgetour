'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

type Currency = 'USD' | 'EUR' | 'TRY';

interface CartItem {
  id: string;
  title: string;
  type: 'flight' | 'hotel' | 'tour';
  basePrice: number; // always in USD for calculation
  quantity: number;
}

const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  TRY: 32.5,
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  TRY: '₺',
};

const MOCK_ITEMS: CartItem[] = [
  { id: '1', title: 'Istanbul Historical Tour', type: 'tour', basePrice: 120, quantity: 2 },
  { id: '2', title: 'NYC to IST Flight', type: 'flight', basePrice: 850, quantity: 1 },
];

export default function AdvancedCart() {
  const _t = useTranslations('Checkout');
  const [items, setItems] = useState<CartItem[]>(MOCK_ITEMS);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [taxRate] = useState(0.18); // 18% VAT

  const handleUpdateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const { subtotal, tax, total } = useMemo(() => {
    const rawSubtotal = items.reduce((acc, item) => acc + item.basePrice * item.quantity, 0);
    const convertedSubtotal = rawSubtotal * EXCHANGE_RATES[currency];
    const convertedTax = convertedSubtotal * taxRate;
    return {
      subtotal: convertedSubtotal,
      tax: convertedTax,
      total: convertedSubtotal + convertedTax,
    };
  }, [items, currency, taxRate]);

  const formatPrice = (amount: number) => {
    return `${CURRENCY_SYMBOLS[currency]}${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-auto border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Your Cart</h2>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as Currency)}
          className="p-2 border rounded-md text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="TRY">TRY (₺)</option>
        </select>
      </div>

      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
        {items.length === 0 ? (
          <p className="text-slate-500 text-center py-4">Your cart is empty.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">{item.title}</h3>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">{item.type}</span>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-md px-2 py-1">
                  <button onClick={() => handleUpdateQuantity(item.id, -1)} className="text-slate-500 hover:text-slate-800">-</button>
                  <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.id, 1)} className="text-slate-500 hover:text-slate-800">+</button>
                </div>
                <div className="font-bold text-slate-800">
                  {formatPrice(item.basePrice * item.quantity * EXCHANGE_RATES[currency])}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex justify-between text-slate-600 text-sm">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-600 text-sm">
          <span>Tax (18%)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg text-slate-900 pt-2 border-t border-slate-200">
          <span>Total</span>
          <span className="text-blue-600">{formatPrice(total)}</span>
        </div>
      </div>

      <button
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={items.length === 0}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
