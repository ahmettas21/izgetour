'use client';

import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { MOCK_FLIGHTS } from '@/data/flights';
import { Plane, Clock, ShieldCheck, ChevronLeft, Info } from 'lucide-react';
import PredictiveTripBundler from '@/components/PredictiveTripBundler';
import PartyPlan from '@/components/PartyPlan';
import SmartItinerary from '@/components/SmartItinerary';
import DynamicPriceChart from '@/components/DynamicPriceChart';
import AncillaryManager from '@/components/Ancillary/AncillaryManager';
import DynamicCuisineRecommender from '@/components/DynamicCuisineRecommender';
import SustainabilityScore from '@/components/SustainabilityScore';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import FlightDetailClient from '@/components/FlightDetailClient';
import LuggageArSizer from '@/components/LuggageArSizer';

export default function FlightDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const locale = useLocale();
  const flight = MOCK_FLIGHTS.find(f => f.slug === slug);

  if (!flight) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <Plane className="mb-4 h-16 w-16 text-zinc-300" />
        <h2 className="text-2xl font-bold text-zinc-900">Uçuş bulunamadı</h2>
        <p className="mt-2 text-zinc-500">Aradığınız uçuş mevcut değil.</p>
        <Link href="/flights" className="mt-6 rounded-full bg-[#0066CC] px-6 py-2.5 font-semibold text-white">
          Uçuşlara Dön
        </Link>
      </div>
    );
  }

  const formatPrice = (p: number) => p.toLocaleString('tr-TR');
  const isDirect = flight.stops === 0;
  const flightTitle = `${flight.departureCode} → ${flight.arrivalCode}`;

  const priceHistoryData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(flight.departureDate);
    d.setDate(d.getDate() - 15 + i);
    const variance = Math.sin(i * 0.4) * 0.15 + Math.cos(i * 0.3) * 0.08;
    const price = Math.round(flight.price * (1 + variance));
    return {
      date: d.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', { month: 'short', day: 'numeric' }),
      price,
    };
  });

  return (
    <FlightDetailClient
      item={{
        id: flight.id,
        type: 'flight',
        title: flightTitle,
        titleEn: flightTitle,
        slug: flight.slug,
      }}
      locale={locale}
    >
      <BreadcrumbNav
        items={[
          { label: 'Uçuşlar', href: '/flights' },
          { label: flightTitle },
        ]}
      />
      <div className="min-h-screen bg-zinc-50">
        {/* Back Button */}
        <div className="mx-auto max-w-5xl px-4 pt-6">
          <Link href="/flights"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-[#0066CC]">
            <ChevronLeft className="h-4 w-4" />
            Uçuş Listesine Dön
          </Link>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main */}
            <div className="space-y-6 lg:col-span-2">
              {/* Flight Hero Card */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="bg-gradient-to-r from-[#0066CC] to-[#004d99] p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-200">{flight.airline}</span>
                        <span className="text-xs text-blue-200">• {flight.aircraft}</span>
                      </div>
                      <h1 className="mt-1 text-2xl font-bold">
                        {flight.departureCode} → {flight.arrivalCode}
                      </h1>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                      <Plane className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Times */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-zinc-900">{flight.departureTime}</div>
                      <div className="text-sm text-zinc-500">{flight.departureDate}</div>
                      <div className="text-xs text-zinc-400">{flight.departureCode} - {flight.departure}</div>
                    </div>

                    <div className="flex flex-1 flex-col items-center">
                      <div className="flex items-center gap-1 text-sm text-zinc-400">
                        <Clock className="h-4 w-4" />
                        {flight.duration}
                      </div>
                      <div className="relative mt-2 w-full">
                        <div className="h-0.5 w-full bg-zinc-200" />
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066CC] p-2">
                          <Plane className="h-4 w-4 rotate-90 text-white" />
                        </div>
                        {isDirect ? (
                          <div className="mt-1 text-center text-xs font-medium text-emerald-600">🟢 Direkt Uçuş</div>
                        ) : (
                          <div className="mt-1 text-center text-xs font-medium text-amber-600">
                            🟡 {flight.stops} Aktarma - {flight.stopCities.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-3xl font-bold text-zinc-900">{flight.arrivalTime}</div>
                      <div className="text-sm text-zinc-500">{flight.departureDate}</div>
                      <div className="text-xs text-zinc-400">{flight.arrivalCode} - {flight.arrival}</div>
                    </div>
                  </div>

                  {/* Quick Info Chips */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700">
                      💺 {flight.cabinClass === 'business' ? 'Business' : flight.cabinClass === 'premium' ? 'Premium Economy' : 'Economy'}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700">
                      🧳 {flight.baggage}
                    </span>
                    <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      flight.refundable ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                    }`}>
                      {flight.refundable ? '✅ İade Edilebilir' : '❌ İadesiz'}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700">
                      👥 {flight.availableSeats} koltuk kaldı
                    </span>
                  </div>
                </div>
              </div>

              {/* Karbon Ayak İzi */}
              <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
                <SustainabilityScore
                  co2Emissions={flight.co2Emissions}
                  averageEmissions={320}
                  ecoFriendly={isDirect}
                  variant="card"
                />
              </div>

              {/* AR Bagaj Ölçer */}
              <div className="rounded-2xl">
                <LuggageArSizer locale={locale as 'tr' | 'en'} />
              </div>

              {/* Flight Details */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
                  <Info className="h-5 w-5 text-[#0066CC]" />
                  Uçuş Detayları
                </h2>
                <div className="mt-4 space-y-4">
                  {[
                    { label: 'Havayolu', value: `${flight.airline} (${flight.airlineCode})` },
                    { label: 'Uçak Tipi', value: flight.aircraft },
                    { label: 'Kabin Sınıfı', value: flight.cabinClass === 'business' ? 'Business' : flight.cabinClass === 'premium' ? 'Premium Economy' : 'Economy' },
                    { label: 'Bagaj Hakkı', value: flight.baggage },
                    { label: 'Koltuk Durumu', value: `${flight.availableSeats} koltuk müsait` },
                    { label: 'İptal Koşulu', value: flight.refundable ? 'İade edilebilir bilet' : 'İadesiz bilet (iptal durumunda ücret iade edilmez)' },
                    { label: 'Uçuş Süresi', value: flight.duration },
                    { label: 'Durak', value: isDirect ? 'Aktarmasız (Direk)' : `${flight.stops} aktarma - ${flight.stopCities.join(', ')}` },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between border-b border-zinc-50 pb-3 text-sm">
                      <span className="text-zinc-500">{row.label}</span>
                      <span className="font-medium text-zinc-900">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sosyal Seyahat Grubu (Party Plan) */}
              <div className="rounded-2xl bg-white p-0 shadow-sm">
                <PartyPlan locale={locale as 'tr' | 'en'} />
              </div>

              {/* Predictive Trip Bundler */}
              <PredictiveTripBundler flight={flight} />

              {/* Lokal Lezzet Rehberi */}
              <div className="rounded-2xl bg-white shadow-sm">
                <DynamicCuisineRecommender destination={flight.arrival} />
              </div>

              {/* Ek Hizmetler */}
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <AncillaryManager flow="flight" />
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Price Card */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <div className="text-center">
                    <span className="text-xs uppercase tracking-wide text-zinc-400">Kişi Başı Fiyat</span>
                    <div className="mt-1">
                      <span className="text-4xl font-bold text-[#0066CC]">₺{formatPrice(flight.price)}</span>
                    </div>
                    {flight.price < flight.originalPrice && (
                      <div className="mt-1 text-sm text-emerald-600">
                        <span className="text-zinc-400 line-through">₺{formatPrice(flight.originalPrice)}</span>
                        {' '}%{Math.round((1 - flight.price / flight.originalPrice) * 100)} düştü
                      </div>
                    )}
                  </div>

                  <div className="my-5 h-px bg-zinc-100" />

                  {/* Booking form */}
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-600">Tarih</label>
                      <input type="date" defaultValue={flight.departureDate}
                        className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none ring-zinc-300 focus:ring-2 focus:ring-[#0066CC]/20" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-600">Yolcu Sayısı</label>
                      <select className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none ring-zinc-300 focus:ring-2 focus:ring-[#0066CC]/20">
                        {[1,2,3,4,5,6].map(n => <option key={n}>{n} Yetişkin</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-600">Kabin</label>
                      <select className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none ring-zinc-300 focus:ring-2 focus:ring-[#0066CC]/20">
                        <option>Economy</option>
                        <option>Business (+₺{formatPrice(Math.round(flight.price * 2.5))})</option>
                      </select>
                    </div>
                  </div>

                  <button className="mt-5 w-full rounded-full bg-[#0066CC] py-3 text-base font-semibold text-white transition-colors hover:bg-[#0052a3]">
                    Rezervasyon Yap
                  </button>

                  {/* Secure badge */}
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-zinc-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    %100 Güvenli Ödeme • SSL ile şifrelenir
                  </div>
                </div>

                {/* Fiyat Takip + Price Chart */}
                <div className="space-y-4">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-center text-sm text-zinc-500">
                    🔔 Fiyat değişikliklerini takip etmek için <span className="font-medium text-[#0066CC]">giriş yapın</span>
                  </div>
                  <DynamicPriceChart
                    data={priceHistoryData}
                    title="Fiyat Trendleri"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Smart Itinerary - full width below grid */}
          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
            <SmartItinerary locale={locale} />
          </div>
        </div>
      </div>
    </FlightDetailClient>
  );
}
