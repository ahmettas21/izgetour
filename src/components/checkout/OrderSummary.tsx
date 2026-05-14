import React from 'react';
import { Receipt, Info, ArrowRight } from 'lucide-react';

type SummaryProps = {
  order: {
    items: {
      id: string;
      name: string;
      type: 'Tours' | 'Flights' | 'Hotels' | 'Extras';
      price: number;
    }[];
    subtotal: number;
    tax: number;
    discount?: number;
    total: number;
  };
};

export default function OrderSummary({ order }: SummaryProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden sticky top-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Receipt className="w-6 h-6 text-orange-400" />
          <h2 className="text-xl font-bold">Order Summary</h2>
        </div>
        <p className="text-sm text-gray-300">Detailed breakdown of your basket</p>
      </div>

      {/* Items */}
      <div className="p-6">
        <ul className="space-y-4">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between items-start text-sm group">
              <div className="flex flex-col max-w-[70%]">
                <span className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                  {item.name}
                </span>
                <span className="text-xs text-gray-500 font-medium px-2 py-0.5 bg-gray-100 rounded-md w-max mt-1">
                  {item.type}
                </span>
              </div>
              <span className="font-semibold text-gray-900 whitespace-nowrap">
                ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </li>
          ))}
        </ul>

        <div className="h-px bg-gray-100 my-6" />

        {/* Breakdown */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium text-gray-900">
              ${order.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span className="flex items-center gap-1">
              Taxes & Fees
              <Info className="w-3.5 h-3.5 text-gray-400" />
            </span>
            <span className="font-medium text-gray-900">
              ${order.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          {order.discount && order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Promo Discount</span>
              <span>-${order.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          )}
        </div>

        <div className="h-px bg-gray-100 my-6" />

        {/* Total */}
        <div className="flex items-end justify-between">
          <div>
            <span className="text-gray-500 text-sm block">Total Due</span>
            <span className="text-xs text-gray-400 block mt-0.5">Includes all taxes</span>
          </div>
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
            ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* CTA (optional usage within summary) */}
        <button className="w-full mt-8 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          Complete Booking
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
