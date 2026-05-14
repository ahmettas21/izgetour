'use client';

import type { Flight } from '@/data/flights';
import type { FlightLeg, LegSearchResult } from '@/utils/multiCityHelpers';
import { formatDisplayDate } from '@/utils/multiCityHelpers';

type Props = {
  legs: FlightLeg[];
  legResults: LegSearchResult[];
  selections: Record<string, Flight>;
  totalPrice: number;
  totalOriginal: number;
  totalStops: number;
  formattedDuration: string;
  allLegsSelected: boolean;
  passengers: number;
  locale: string;
  onSelectFlight: (legId: string, flight: Flight) => void;
  onBack: () => void;
};

export default function MultiCityResults({
  legs,
  legResults,
  selections,
  totalPrice,
  totalOriginal,
  totalStops,
  formattedDuration,
  allLegsSelected,
  passengers,
  locale,
  onSelectFlight,
  onBack,
}: Props) {
  const savings = totalOriginal - totalPrice;
  const savingsPercent = totalOriginal > 0 ? Math.round((savings / totalOriginal) * 100) : 0;

  // Group results by leg (selectedFlights for future use)

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Aramayı Düzenle
      </button>

      {/* Itinerary summary */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
          Rota Özeti
        </h3>
        <div className="space-y-2">
          {legs.map((leg, idx) => (
            <div key={leg.id} className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300 font-mono">
                {idx + 1}
              </span>
              <span className="text-gray-200 font-medium">
                {leg.originCode || leg.origin}
              </span>
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span className="text-gray-200 font-medium">
                {leg.destinationCode || leg.destination}
              </span>
              {leg.date && (
                <span className="text-gray-500 ml-auto text-xs">
                  {formatDisplayDate(leg.date, locale as 'tr' | 'en')}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-3" />

        {/* Aggregate stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Toplam Süre</span>
            <p className="text-gray-100 font-semibold">{formattedDuration}</p>
          </div>
          <div>
            <span className="text-gray-400">Toplam Aktarma</span>
            <p className="text-gray-100 font-semibold">{totalStops}</p>
          </div>
          <div>
            <span className="text-gray-400">Yolcu Sayısı</span>
            <p className="text-gray-100 font-semibold">{passengers}</p>
          </div>
          <div>
            <span className="text-gray-400">Bacak Sayısı</span>
            <p className="text-gray-100 font-semibold">{legs.length}</p>
          </div>
        </div>
      </div>

      {/* Price summary */}
      <div className="bg-emerald-900/30 border border-emerald-700/40 rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-400">Toplam (tüm bacaklar)</p>
            <p className="text-3xl font-bold text-emerald-400">
              ₺{totalPrice.toLocaleString('tr-TR')}
            </p>
            {savings > 0 && (
              <p className="text-xs text-emerald-500 mt-1">
                %{savingsPercent} tasarruf • Normalde ₺{totalOriginal.toLocaleString('tr-TR')}
              </p>
            )}
          </div>
          <button
            disabled={!allLegsSelected}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-colors"
          >
            Sepete Ekle
          </button>
        </div>
      </div>

      {/* Per-leg results */}
      <div className="space-y-6">
        {legResults.map((result, idx) => {
          const leg = legs.find((l) => l.id === result.legId);
          if (!leg) return null;

          return (
            <LegResultsSection
              key={result.legId}
              leg={leg}
              legIndex={idx}
              flights={result.flights}
              selectedFlightId={selections[result.legId]?.id}
              onSelect={(f) => onSelectFlight(result.legId, f)}
            />
          );
        })}
      </div>
    </div>
  );
}

// ── Per-leg flight results section ─────────────────────────────────────────────

function LegResultsSection({
  leg,
  legIndex,
  flights,
  selectedFlightId,
  onSelect,
}: {
  leg: FlightLeg;
  legIndex: number;
  flights: Flight[];
  selectedFlightId?: string;
  onSelect: (f: Flight) => void;
}) {
  const sorted = [...flights].sort((a, b) => a.price - b.price);

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-xs text-white font-mono">
          {legIndex + 1}
        </span>
        <div>
          <h3 className="font-semibold text-gray-100">
            {leg.originCode || leg.origin} → {leg.destinationCode || leg.destination}
          </h3>
          {leg.date && (
            <p className="text-xs text-gray-500">
              {leg.date}
            </p>
          )}
        </div>
        <span className="ml-auto text-xs text-gray-500">
          {sorted.length} sefer bulundu
        </span>
      </div>

      <div className="space-y-2">
        {sorted.map((flight) => (
          <div
            key={flight.id}
            className={`relative rounded-xl border transition-all cursor-pointer ${
              selectedFlightId === flight.id
                ? 'border-emerald-500 bg-emerald-900/20 ring-1 ring-emerald-500'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}
            onClick={() => onSelect(flight)}
          >
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold text-gray-100">{flight.airline}</p>
                    <p className="text-xs text-gray-500">{flight.airlineCode} • {flight.aircraft}</p>
                  </div>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                    {flight.stops === 0 ? 'Aktarmasız' : `${flight.stops} Aktarma`}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-100">₺{flight.price.toLocaleString('tr-TR')}</p>
                  {flight.originalPrice > flight.price && (
                    <p className="text-xs text-gray-500 line-through">
                      ₺{flight.originalPrice.toLocaleString('tr-TR')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                <span>{flight.departureTime}</span>
                <span className="text-gray-600">→</span>
                <span>{flight.arrivalTime}</span>
                <span className="text-gray-600">•</span>
                <span>{flight.duration}</span>
                {flight.refundable && (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className="text-emerald-400 text-xs">İade Edilebilir</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
