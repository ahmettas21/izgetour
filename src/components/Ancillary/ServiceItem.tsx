'use client';

import { Check, Plus, Minus, Info, Shield, Luggage, Car, Bus, Clock, Star, Coffee, Utensils, Headphones } from 'lucide-react';
import type { AncillaryService } from '@/data/ancillary';
import { useState } from 'react';

const iconMap: Record<string, React.ReactNode> = {
  Baggage: <Luggage className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Car: <Car className="w-5 h-5" />,
  Bus: <Bus className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  Star: <Star className="w-5 h-5" />,
  Coffee: <Coffee className="w-5 h-5" />,
  Utensils: <Utensils className="w-5 h-5" />,
  Headphones: <Headphones className="w-5 h-5" />,
};

interface ServiceItemProps {
  service: AncillaryService;
  selected: boolean;
  onToggle: (id: string) => void;
  locale: string;
}

export default function ServiceItem({ service, selected, onToggle, locale }: ServiceItemProps) {
  const [showDetails, setShowDetails] = useState(false);
  const isEn = locale === 'en';

  return (
    <div
      className={`relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
        selected
          ? 'border-blue-500 bg-blue-50/50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={() => {
        if (!service.requiresDetails) onToggle(service.id);
      }}
    >
      {/* Check icon for selected state */}
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
        selected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
      }`}>
        {iconMap[service.icon] || <Info className="w-5 h-5" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h4 className="text-sm font-medium text-gray-900">{isEn ? service.nameEn : service.name}</h4>
          <button
            onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
            className="p-0.5 text-gray-400 hover:text-blue-500 transition-colors"
            aria-label="Detay"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{isEn ? service.descriptionEn : service.description}</p>

        {showDetails && (
          <div className="mt-2 p-2.5 bg-gray-50 rounded-lg text-xs text-gray-600 space-y-1.5">
            <p>{isEn ? service.detailsEn : service.details}</p>
            {service.legalText && (
              <p className="text-gray-400 italic border-t border-gray-200 pt-1.5 mt-1.5">
                ℹ️ {isEn ? service.legalTextEn : service.legalText}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Price + Toggle */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
          {service.price.toLocaleString()} ₺
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(service.id); }}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            selected
              ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-200'
              : 'bg-blue-50 text-blue-500 hover:bg-blue-100 border border-blue-200'
          }`}
          aria-label={selected ? 'Çıkar' : 'Ekle'}
        >
          {selected ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
