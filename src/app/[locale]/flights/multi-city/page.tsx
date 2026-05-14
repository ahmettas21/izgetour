'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Plane,
  Users,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import MultiCitySearchForm from '@/components/Flight/MultiCitySearchForm';
import { useMultiCityLogic } from '@/components/Flight/useMultiCityLogic';
import { formatDisplayDate } from '@/utils/multiCityHelpers';
import MultiCityRouter from '@/components/MultiCityRouter';

export default function MultiCityPage() {
  const logic = useMultiCityLogic();
  const params = useParams();
  const LOCALE = (params?.locale as string) === 'en' ? 'en' as const : 'tr' as const;
  const t = (tr: string, en: string) => (LOCALE === 'tr' ? tr : en);

  const {
    legs,
    selections,
    phase,
    passengers,
    totalPrice,
    totalOriginal,
    totalStops,
    formattedDuration,
    allLegsSelected,
  } = logic;

  // Derive selected flights in leg order
  const orderedFlights = useMemo(
    () => legs.map((leg) => selections[leg.id]).filter(Boolean),
    [legs, selections]
  );

  const hasResults = phase === 'results';
  const priceDropped = totalOriginal > totalPrice;

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#0066CC] to-[#004d99] px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-1 flex items-center gap-2 text-blue-200">
            <Link
              href="/flights"
              className="flex items-center gap-1 text-sm hover:text-white"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              {t('Uçuşlar', 'Flights')}
            </Link>
            <span>/</span>
            <span className="text-sm font-medium text-white">
              {t('Çoklu Şehir', 'Multi-City')}
            </span>
          </div>
          <h1 className="mb-1 text-center text-2xl font-bold text-white">
            {t('Çoklu Şehir Uçuş Planlayıcı', 'Multi-City Flight Planner')}
          </h1>
          <p className="text-center text-sm text-blue-200">
            {t(
              'Birden fazla şehir arasında karmaşık rotaları kolayca planlayın',
              'Plan complex routes across multiple cities easily'
            )}
          </p>
        </div>
      </div>

      {/* ── MultiCityRouter widget ──────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-4 py-6">
        <MultiCityRouter locale={LOCALE} />
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left: Search form */}
          <div className="flex-1">
            <MultiCitySearchForm
              legs={legs}
              legResults={logic.legResults}
              selections={selections}
              dateErrors={logic.dateErrors}
              passengers={passengers}
              phase={phase}
              onAddLeg={logic.addLeg}
              onRemoveLeg={logic.removeLeg}
              onUpdateLeg={logic.updateLeg}
              onMoveLeg={logic.moveLeg}
              onSelectFlight={logic.selectFlight}
              onSearch={logic.searchAllLegs}
              onClearResults={logic.clearResults}
              onSetPassengers={logic.setPassengers}
              locale={LOCALE}
            />
          </div>

          {/* Right: Itinerary summary sidebar */}
          {hasResults && (
            <div className="w-full shrink-0 lg:w-72">
              <div className="sticky top-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <h2 className="mb-3 text-sm font-bold text-zinc-900">
                  {t('Seyahat Özeti', 'Itinerary Summary')}
                </h2>

                {orderedFlights.length === 0 ? (
                  <p className="text-sm text-zinc-400">
                    {t('Henüz seçim yapılmadı', 'No flights selected yet')}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {/* Leg summaries */}
                    {legs.map((leg, i) => {
                      const flight = selections[leg.id];
                      if (!flight) {
                        return (
                          <div
                            key={leg.id}
                            className="flex items-center gap-2 text-xs text-zinc-400"
                          >
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-[9px] font-bold text-zinc-500">
                              {i + 1}
                            </div>
                            <span>
                              {leg.origin || t('—', '—')} →{' '}
                              {leg.destination || t('—', '—')}
                            </span>
                          </div>
                        );
                      }
                      return (
                        <div key={leg.id} className="flex gap-2">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0066CC] text-[9px] font-bold text-white">
                            {i + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="truncate text-xs font-semibold text-zinc-800">
                                {flight.departureCode} → {flight.arrivalCode}
                              </span>
                              <span className="shrink-0 text-xs font-bold text-[#0066CC]">
                                ₺{flight.price.toLocaleString('tr-TR')}
                              </span>
                            </div>
                            <div className="text-[10px] text-zinc-400">
                              {flight.departureTime} → {flight.arrivalTime} ·{' '}
                              {flight.airline}
                            </div>
                            {leg.date && (
                              <div className="text-[10px] text-zinc-400">
                                {formatDisplayDate(leg.date, LOCALE)}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Divider */}
                    <div className="border-t border-zinc-100" />

                    {/* Totals */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {t('Toplam Süre', 'Total Duration')}
                        </span>
                        <span className="font-medium">{formattedDuration}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span>{t('Toplam Aktarma', 'Total Stops')}</span>
                        <span className="font-medium">
                          {totalStops === 0
                            ? t('Direkt', 'Direct')
                            : totalStops === 1
                              ? '1 ' + t('aktarma', 'stop')
                              : `${totalStops} ${t('aktarma', 'stops')}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {t('Yolcu', 'Passengers')}
                        </span>
                        <span className="font-medium">×{passengers}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="border-t border-zinc-100 pt-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-semibold text-zinc-700">
                          {t('Toplam Tutar', 'Total Price')}
                        </span>
                        <div className="text-right">
                          {priceDropped && (
                            <span className="mr-1 text-[10px] text-emerald-600">
                              ▼{' '}
                              {Math.round(
                                (1 - totalPrice / totalOriginal) * 100
                              )}
                              %
                            </span>
                          )}
                          <span
                            className={`text-lg font-bold ${priceDropped ? 'text-emerald-600' : 'text-[#0066CC]'}`}
                          >
                            ₺{totalPrice.toLocaleString('tr-TR')}
                          </span>
                        </div>
                      </div>
                      {passengers > 1 && (
                        <p className="text-center text-[10px] text-zinc-400">
                          {t('kişi başı', 'per person')} × {passengers}{' '}
                          {t('yolcu', 'passengers')}
                        </p>
                      )}
                    </div>

                    {/* Checkout button */}
                    {allLegsSelected ? (
                      <button
                        type="button"
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0066CC] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0052a3]"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {t('Rezervasyonu Tamamla', 'Complete Booking')}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <p className="mt-2 rounded-lg bg-amber-50 p-2 text-center text-xs text-amber-600">
                        {t(
                          'Tüm ayaklar için uçuş seçin',
                          'Select a flight for every leg'
                        )}
                      </p>
                    )}

                    {/* Refresh prices */}
                    <button
                      type="button"
                      onClick={logic.searchAllLegs}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-200 py-2 text-xs text-zinc-500 transition-colors hover:bg-zinc-50"
                    >
                      <RefreshCw className="h-3 w-3" />
                      {t('Fiyatları Yenile', 'Refresh Prices')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Visual route timeline (shown when results exist) ──────────── */}
        {hasResults && orderedFlights.length > 0 && (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4">
            <h3 className="mb-4 text-sm font-bold text-zinc-700">
              {t('Rota Detayı', 'Route Details')}
            </h3>
            <div className="flex items-start gap-0 overflow-x-auto pb-2">
              {legs.map((leg, i) => {
                const flight = selections[leg.id];
                return (
                  <div key={leg.id} className="flex items-center">
                    {/* Leg node */}
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0066CC] text-xs font-bold text-white">
                        {i + 1}
                      </div>
                      <div className="mt-1 text-center">
                        <div className="whitespace-nowrap text-xs font-semibold text-zinc-800">
                          {leg.originCode || '—'}
                        </div>
                        {leg.date && (
                          <div className="text-[10px] text-zinc-400">
                            {formatDisplayDate(leg.date, LOCALE)}
                          </div>
                        )}
                        {flight && (
                          <div className="mt-1 rounded bg-zinc-50 px-1.5 py-0.5 text-[10px] text-zinc-500">
                            {flight.departureTime}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Connector */}
                    {i < legs.length - 1 && (
                      <div className="relative mx-1 flex flex-col items-center">
                        <div className="flex h-8 w-16 items-center justify-center">
                          <Plane className="h-3.5 w-3.5 rotate-90 text-[#0066CC]" />
                        </div>
                        {flight && (
                          <div className="text-[10px] text-zinc-400">
                            {flight.duration}
                          </div>
                        )}
                        <div className="h-px w-16 bg-zinc-200" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Final destination dot */}
              <div className="ml-1 flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                  ✓
                </div>
                <div className="mt-1 text-center">
                  <div className="whitespace-nowrap text-xs font-semibold text-zinc-800">
                    {legs[legs.length - 1]?.destinationCode || '—'}
                  </div>
                </div>
              </div>
            </div>

            {/* Compact leg cards */}
            <div className="mt-4 space-y-2">
              {legs.map((leg, i) => {
                const flight = selections[leg.id];
                return (
                  <div
                    key={leg.id}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
                      flight
                        ? 'border-[#0066CC]/30 bg-[#0066CC]/5'
                        : 'border-zinc-200 bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0066CC] text-[9px] font-bold text-white">
                        {i + 1}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-zinc-800">
                          {leg.originCode || '—'} → {leg.destinationCode || '—'}
                        </span>
                        {flight && (
                          <span className="ml-2 text-xs text-zinc-400">
                            {flight.airline} · {flight.departureTime}–{flight.arrivalTime}
                          </span>
                        )}
                      </div>
                    </div>
                    {flight ? (
                      <span className="text-xs font-bold text-[#0066CC]">
                        ₺{flight.price.toLocaleString('tr-TR')}
                      </span>
                    ) : (
                      <span className="text-xs text-amber-500">
                        {t('Seçilmedi', 'Not selected')}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Info card when idle ────────────────────────────────────────── */}
        {!hasResults && (
          <div className="mt-6 rounded-2xl bg-blue-50 p-5">
            <h3 className="mb-2 text-sm font-semibold text-[#0066CC]">
              ✈️ {t('Çoklu Şehir Ne Zaman Kullanılır?', 'When to Use Multi-City?')}
            </h3>
            <ul className="space-y-1.5 text-sm text-zinc-600">
              <li>
                •{' '}
                {t(
                  'Birden fazla varış noktasını tek bir seyahatte ziyaret etmek istediğinizde',
                  'When you want to visit multiple destinations in one trip'
                )}
              </li>
              <li>
                •{' '}
                {t(
                  'Gidiş ve dönüş farklı şehirlerden olduğunda (open-jaw)',
                  'When your outbound and return are from different cities (open-jaw)'
                )}
              </li>
              <li>
                •{' '}
                {t(
                  'Aynı bilet ile 3–6 şehir arasında uçmak istediğinizde',
                  'When flying between 3–6 cities on a single ticket'
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
