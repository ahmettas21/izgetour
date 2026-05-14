'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import ServiceItem from './ServiceItem';
import { getServicesForFlow, calculateTotal } from '@/data/ancillary';

interface AncillaryManagerProps {
  flow: 'flight' | 'hotel' | 'tour';
  basePrice?: number;
  className?: string;
}

export default function AncillaryManager({ flow, basePrice = 0, className = '' }: AncillaryManagerProps) {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'tr';
  const isEn = locale === 'en';
  const _t = useTranslations('ancillary');

  const services = getServicesForFlow(flow);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const toggleService = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
    setShowSummary(true);
  };

  const totals = basePrice > 0 ? calculateTotal(basePrice, selectedIds) : null;

  if (services.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">
          {isEn ? 'Add Extra Services' : 'Ek Hizmetler'}
        </h3>
        {selectedIds.length > 0 && (
          <span className="text-xs text-blue-600 font-medium">
            {selectedIds.length} {isEn ? 'selected' : 'seçildi'}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {services.map((service) => (
          <ServiceItem
            key={service.id}
            service={service}
            selected={selectedIds.includes(service.id)}
            onToggle={toggleService}
            locale={locale}
          />
        ))}
      </div>

      {/* Summary Bar */}
      {showSummary && totals && selectedIds.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{isEn ? 'Services total' : 'Ek hizmetler toplamı'}</span>
            <span className="font-semibold text-gray-900">{totals.servicesTotal.toLocaleString()} ₺</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">KDV (%8)</span>
            <span className="text-gray-700">{totals.vat.toLocaleString()} ₺</span>
          </div>
          <div className="flex justify-between text-base font-bold border-t border-blue-200 pt-2">
            <span>{isEn ? 'Grand total' : 'Genel toplam'}</span>
            <span className="text-blue-600">{totals.grandTotal.toLocaleString()} ₺</span>
          </div>
        </div>
      )}

      {selectedIds.length === 0 && showSummary && (
        <p className="text-sm text-gray-400 text-center py-2">
          {isEn ? 'No services selected' : 'Henüz hizmet seçilmedi'}
        </p>
      )}
    </div>
  );
}
