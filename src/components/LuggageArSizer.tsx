'use client';

import { useState } from 'react';

interface Props {
  locale?: 'tr' | 'en';
}

const STRINGS = {
  tr: {
    title: 'Akıllı AR Bagaj Ölçer',
    description: 'Havalimanında sürpriz yaşamayın! Valizinizi telefonunuzun kamerasıyla tarayın ve hava yolu şirketinizin kabin sınırlarına (örn: 55x40x20 cm) uygunluğunu saniyeler içinde kontrol edin.',
    startButton: 'Taramayı Başlat',
    scanningText: "Valizinizin köşelerini çerçeveye oturtun...",
    calculating: 'Derinlik ve hacim hesaplanıyor',
    successTitle: 'Kabin Boyuna Uygun!',
    successDesc: '52 x 38 x 19 cm ölçüldü. Seçtiğiniz THY uçuşu için kabine alınabilir.',
    retryButton: 'Yeniden Ölç',
    cameraLabel: 'AR Kamerayı Aç',
  },
  en: {
    title: 'Smart AR Luggage Sizer',
    description: "Don't get surprised at the airport! Scan your suitcase with your phone camera and instantly check if it fits your airline's cabin size limits (e.g. 55x40x20 cm).",
    startButton: 'Start Scan',
    scanningText: 'Frame your suitcase corners...',
    calculating: 'Calculating depth and volume',
    successTitle: 'Cabin-Size Approved!',
    successDesc: 'Measured 52 x 38 x 19 cm. Suitable for carry-on on your selected THY flight.',
    retryButton: 'Measure Again',
    cameraLabel: 'Open AR Camera',
  },
};

export default function LuggageArSizer({ locale = 'tr' }: Props) {
  const s = STRINGS[locale];
  const [isActive, setIsActive] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');

  const startScan = () => {
    setIsActive(true);
    setScanStatus('scanning');
    setTimeout(() => {
      setScanStatus('success');
    }, 3000);
  };

  const reset = () => {
    setIsActive(false);
    setScanStatus('idle');
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-10 -right-10 w-40 h-40 border-4 border-indigo-100 rounded-full opacity-50" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 border-4 border-blue-100 rounded-full opacity-50" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/3 flex justify-center">
          {isActive ? (
            <div className={`relative w-48 h-48 rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center ${
              scanStatus === 'scanning' ? 'ring-4 ring-indigo-400 ring-opacity-50'
                : scanStatus === 'success' ? 'ring-4 ring-green-400'
                : 'ring-4 ring-slate-800'
            }`}>
              {/* Fake Camera Feed / Scanner Animation */}
              <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                <svg className="w-20 h-20 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>

              {scanStatus === 'scanning' && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent w-full h-full animate-[scan_2s_ease-in-out_infinite]" style={{ backgroundSize: '100% 200%' }}>
                  <div className="w-full h-0.5 bg-indigo-500 shadow-[0_0_8px_2px_rgba(99,102,241,0.5)]" />
                </div>
              )}

              {scanStatus === 'success' && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-12 h-12 text-green-500 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          ) : (
            <div className="w-48 h-48 rounded-2xl bg-white shadow-sm border border-indigo-50 flex flex-col items-center justify-center p-4">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-xs text-center text-slate-500 font-medium">{s.cameraLabel}</p>
            </div>
          )}
        </div>

        <div className="w-full md:w-2/3">
          <h3 className="text-xl font-bold text-slate-800 mb-2">{s.title}</h3>

          {scanStatus === 'idle' && (
            <>
              <p className="text-sm text-slate-600 mb-5">{s.description}</p>
              <button
                onClick={startScan}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {s.startButton}
              </button>
            </>
          )}

          {scanStatus === 'scanning' && (
            <div className="space-y-3">
              <p className="text-sm text-indigo-600 font-medium animate-pulse">{s.scanningText}</p>
              <div className="w-full bg-indigo-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full w-2/3 animate-[pulse_1s_ease-in-out_infinite]" />
              </div>
              <p className="text-xs text-slate-500">{s.calculating}</p>
            </div>
          )}

          {scanStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-bold text-green-800 mb-1 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {s.successTitle}
              </h4>
              <p className="text-sm text-green-700 mb-3">{s.successDesc}</p>
              <button
                onClick={reset}
                className="text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              >
                {s.retryButton}
              </button>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
      ` }} />
    </div>
  );
}
