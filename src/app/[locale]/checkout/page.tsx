'use client';

// src/app/[locale]/checkout/page.tsx
import React from 'react';
import PaymentOptions from '@/components/checkout/PaymentOptions';
import CouponInput from '@/components/checkout/CouponInput';
import OrderSummary from '@/components/checkout/OrderSummary';
import AdvancedCart from '@/components/checkout/AdvancedCart';
import type { PaymentMethod } from '@/components/checkout/PaymentOptions';

export default function CheckoutPage() {
  // Placeholder state, replace with real logic
  const [selectedPayment, setSelectedPayment] = React.useState<PaymentMethod>('card');
  const order = {
    items: [
      { id: 't-istanbul', name: 'Tour Istanbul', type: 'Tours' as const, price: 120 },
      { id: 'h-deluxe', name: 'Hotel Deluxe', type: 'Hotels' as const, price: 200 },
    ],
    subtotal: 320,
    tax: 0,
    total: 320,
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    // TODO: validate coupon via API
    console.log('Applying coupon', code);
    // Demo: accept IZGE10
    return code === 'IZGE10';
  };

  const handlePaymentChange = (method: PaymentMethod) => {
    setSelectedPayment(method);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* Advanced multi-currency cart with quantity controls */}
      <div className="mb-6">
        <AdvancedCart />
      </div>

      {/* Legacy order summary (kept for reference) */}
      <div className="mb-6">
        <OrderSummary order={order} />
      </div>

      <CouponInput onApply={applyCoupon} />
      <PaymentOptions selected={selectedPayment} onChange={handlePaymentChange} />
      <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded">
        Confirm Payment
      </button>
    </div>
  );
}
