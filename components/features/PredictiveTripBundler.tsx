import React, { useState } from 'react';
import { Sparkles, Plane, Hotel, Car, Globe, CreditCard, ChevronRight } from 'lucide-react';

interface BundleItem {
  id: string;
  type: 'flight' | 'hotel' | 'transfer' | 'experience';
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
}

const PredictiveTripBundler: React.FC = () => {
  const [isBundled, setIsBundled] = useState(false);

  const bundleData: BundleItem[] = [
    {
      id: 'f-1',
      type: 'flight',
      title: 'İzmir - Londra (LHR)',
      description: 'Lufthansa ile aktarmalı uçuş',
      originalPrice: 4200,
      discountedPrice: 3800,
    },
    {
      id: 'h-1',
      type: 'hotel',
      title: 'The Savoy Hotel',
      description: 'Nehir manzaralı Deluxe Oda',
      originalPrice: 12500,
      discountedPrice: 10500,
    },
    {
      id: 't-1',
      type: 'transfer',
      title: 'Özel Havalimanı Karşılaması',
      description: 'Mercedes E-Class ile VIP Transfer',
      originalPrice: 1200,
      discountedPrice: 850,
    }
  ];

  const totalOriginal = bundleData.reduce((acc, item) => acc + item.originalPrice, 0);
  const totalDiscounted = bundleData.reduce((acc, item) => acc + item.discountedPrice, 0);
  const savings = totalOriginal - totalDiscounted;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-50 rounded-3xl border border-slate-200 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="text-amber-500 fill-amber-500" />
            AI Predictive Trip Bundler
          </h2>
          <p className="text-slate-500 mt-1">Sizin için en uyumlu otel ve transfer seçeneklerini birleştirdik.</p>
        </div>
        <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 border border-amber-200">
          <Globe size={16} />
          Seçiminize Özel %15 Paket İndirimi
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {bundleData.map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 text-slate-100 group-hover:text-slate-200 transition-colors">
              {item.type === 'flight' && <Plane size={48} />}
              {item.type === 'hotel' && <Hotel size={48} />}
              {item.type === 'transfer' && <Car size={48} />}
            </div>
            
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">{item.type}</span>
              <h3 className="font-bold text-slate-800 line-clamp-1">{item.title}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 min-h-[32px]">{item.description}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-gray-400 line-through text-xs">₺{item.originalPrice.toLocaleString()}</span>
                  <div className="text-slate-900 font-bold">₺{item.discountedPrice.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <div className="text-center md:text-left">
            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">Toplam Liste Fiyatı</p>
            <p className="text-xl line-through text-slate-500 font-medium">₺{totalOriginal.toLocaleString()}</p>
          </div>
          <div className="w-px h-10 bg-slate-800 hidden md:block"></div>
          <div className="text-center md:text-left">
            <p className="text-amber-400 text-xs uppercase font-bold tracking-widest mb-1">Paket Tasarrufu</p>
            <p className="text-3xl font-black text-amber-500 tracking-tight">₺{savings.toLocaleString()}</p>
          </div>
        </div>

        <button 
          onClick={() => setIsBundled(true)}
          disabled={isBundled}
          className={`flex items-center gap-2 py-4 px-8 rounded-full font-bold transition-all transform active:scale-95 ${
            isBundled 
            ? 'bg-emerald-500 text-white cursor-default' 
            : 'bg-white text-slate-900 hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]'
          }`}
        >
          {isBundled ? (
            <>Rezervasyon Hazırlanıyor...</>
          ) : (
            <>
              Paketi Hemen Rezerve Et
              <ChevronRight size={20} />
            </>
          )}
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <CreditCard size={14} /> Taksit İmkanı
        </div>
        <div className="flex items-center gap-1.5">
          <Globe size={14} /> 7/24 Destek
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} /> AI Optimizasyonu
        </div>
      </div>
    </div>
  );
};

export default PredictiveTripBundler;
