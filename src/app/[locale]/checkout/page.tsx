'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import PaymentOptions from '@/components/checkout/PaymentOptions';
import CouponInput from '@/components/checkout/CouponInput';
import OrderSummary from '@/components/checkout/OrderSummary';
import AdvancedCart from '@/components/checkout/AdvancedCart';
import type { PaymentMethod } from '@/components/checkout/PaymentOptions';
import { Plane, ArrowRight } from 'lucide-react';

function formatTime(iso: string): string {
  if (iso.includes('T')) {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  return iso.substring(0, 5);
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [selectedPayment, setSelectedPayment] = React.useState<PaymentMethod>('card');

  // Read flight data from URL params
  const flightId = searchParams.get('flightId');
  const price = searchParams.get('price');
  const airline = searchParams.get('airline');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const departure = searchParams.get('departure');
  const arrival = searchParams.get('arrival');

  const hasFlight = !!(flightId && price && airline && from && to);

  const flightOrder = hasFlight
    ? {
        items: [
          {
            id: flightId!,
            name: `${airline} – ${from} → ${to}`,
            type: 'Flights' as const,
            price: Number(price),
          },
        ],
        subtotal: Number(price),
        tax: Math.round(Number(price) * 0.18),
        total: Math.round(Number(price) * 1.18),
      }
    : {
        items: [
          { id: 't-istanbul', name: 'Tour Istanbul', type: 'Tours' as const, price: 120 },
          { id: 'h-deluxe', name: 'Hotel Deluxe', type: 'Hotels' as const, price: 200 },
        ],
        subtotal: 320,
        tax: 0,
        total: 320,
      };

  const applyCoupon = async (code: string): Promise<boolean> => {
    console.log('Applying coupon', code);
    return code === 'IZGE10';
  };

  const handlePaymentChange = (method: PaymentMethod) => {
    setSelectedPayment(method);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* Flight summary card */}
      {hasFlight && (
        <div className="mb-6 rounded-2xl border border-border bg-gradient-to-r from-primary/5 to-primary/10 p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-primary/10">
            <Plane className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-foreground">{airline}</div>
            <div className="text-sm text-muted-foreground">
              {from} <ArrowRight className="inline h-3 w-3" /> {to}
            </div>
            {departure && <div className="text-xs text-muted-foreground">{formatTime(departure)} – {arrival ? formatTime(arrival) : '—'}</div>}
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-primary">₺{Number(price).toLocaleString('tr-TR')}</div>
            <div className="text-xs text-muted-foreground">+ KDV</div>
          </div>
        </div>
      )}

      {/* Advanced multi-currency cart */}
      <div className="mb-6">
        <AdvancedCart />
      </div>

      {/* Order summary */}
      <div className="mb-6">
        <OrderSummary order={flightOrder} />
      </div>

      <CouponInput onApply={applyCoupon} />
      <PaymentOptions selected={selectedPayment} onChange={handlePaymentChange} />
      <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded">
        Confirm Payment
      </button>
    </div>
  );
}
