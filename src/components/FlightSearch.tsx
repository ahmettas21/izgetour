'use client';

import { useState, useEffect } from 'react';
import { Plane, ArrowRight, Clock, RefreshCw, Bell, BellOff, Users, Calendar } from 'lucide-react';

type Flight = {
  id: string;
  airline: string;
  airlineCode: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopCities: string[];
  price: number;
  originalPrice: number;
};

type SavedSearch = {
  id: string;
  from: string;
  to: string;
  date: string;
  returnDate: string;
  passengers: number;
  followed: boolean;
  savedAt: string;
};

const MOCK_FLIGHTS: Flight[] = [
  {
    id: '1',
    airline: 'Turkish Airlines',
    airlineCode: 'TK',
    departure: 'İstanbul',
    arrival: 'Londra',
    departureTime: '06:30',
    arrivalTime: '09:45',
    duration: '4s 15d',
    stops: 0,
    stopCities: [],
    price: 2849,
    originalPrice: 3200,
  },
  {
    id: '2',
    airline: 'Pegasus',
    airlineCode: 'PC',
    departure: 'İstanbul',
    arrival: 'Londra',
    departureTime: '08:15',
    arrivalTime: '11:30',
    duration: '4s 15d',
    stops: 0,
    stopCities: [],
    price: 1849,
    originalPrice: 2100,
  },
  {
    id: '3',
    airline: 'SunExpress',
    airlineCode: 'XQ',
    departure: 'İstanbul',
    arrival: 'Londra',
    departureTime: '11:00',
    arrivalTime: '15:30',
    duration: '5s 30d',
    stops: 1,
    stopCities: ['Frankfurt'],
    price: 2199,
    originalPrice: 2199,
  },
  {
    id: '4',
    airline: 'British Airways',
    airlineCode: 'BA',
    departure: 'İstanbul',
    arrival: 'Londra',
    departureTime: '14:20',
    arrivalTime: '17:00',
    duration: '4s 40d',
    stops: 0,
    stopCities: [],
    price: 3499,
    originalPrice: 3800,
  },
  {
    id: '5',
    airline: 'Lufthansa',
    airlineCode: 'LH',
    departure: 'İstanbul',
    arrival: 'Londra',
    departureTime: '18:45',
    arrivalTime: '23:10',
    duration: '6s 25d',
    stops: 1,
    stopCities: ['Münih'],
    price: 2599,
    originalPrice: 2599,
  },
];

const POPULAR_ROUTES = [
  { from: 'İstanbul', to: 'Londra', icon: '🇬🇧' },
  { from: 'İstanbul', to: 'Dubai', icon: '🇦🇪' },
  { from: 'İstanbul', to: 'Paris', icon: '🇫🇷' },
  { from: 'Ankara', to: 'Berlin', icon: '🇩🇪' },
  { from: 'İstanbul', to: 'New York', icon: '🇺🇸' },
];

export default function FlightSearch() {
  const [from, setFrom] = useState('İstanbul');
  const [to, setTo] = useState('');
  const [departure, setDeparture] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [searched, setSearched] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [followedFlights, setFollowedFlights] = useState<Set<string>>(new Set());
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('izgetour_followed_flights');
    if (saved) {
      const parsed = JSON.parse(saved);
      setFollowedFlights(new Set(parsed));
    }
    const searches = localStorage.getItem('izgetour_flight_searches');
    if (searches) {
      setSavedSearches(JSON.parse(searches));
    }
  }, []);

  const toggleFollow = (flightId: string, flight: Flight) => {
    const newFollowed = new Set(followedFlights);
    if (newFollowed.has(flightId)) {
      newFollowed.delete(flightId);
    } else {
      newFollowed.add(flightId);
      // Save search
      const search: SavedSearch = {
        id: `${Date.now()}`,
        from,
        to,
        date: departure,
        returnDate,
        passengers,
        followed: true,
        savedAt: new Date().toISOString(),
      };
      const updated = [search, ...savedSearches].slice(0, 10);
      setSavedSearches(updated);
      localStorage.setItem('izgetour_flight_searches', JSON.stringify(updated));
    }
    setFollowedFlights(newFollowed);
    localStorage.setItem('izgetour_followed_flights', JSON.stringify([...newFollowed]));
  };

  const handleSearch = () => {
    if (!from || !to || !departure) return;
    setSearched(true);
    // Simulate price variation
    const varied = MOCK_FLIGHTS.map(f => ({
      ...f,
      price: Math.round(f.price * (0.9 + Math.random() * 0.2)),
    }));
    setFlights(varied);
  };

  const simulatePriceChange = () => {
    const varied = flights.map(f => ({
      ...f,
      price: Math.round(f.price * (0.85 + Math.random() * 0.3)),
    }));
    setFlights(varied);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('tr-TR');
  };

  if (showSaved && savedSearches.length > 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900">Takip Ettiğim Uçuşlar</h2>
          <button
            onClick={() => setShowSaved(false)}
            className="text-sm text-[#0066CC] hover:underline"
          >
            ← Arama Yap
          </button>
        </div>
        <div className="space-y-4">
          {savedSearches.map((s) => (
            <div key={s.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold text-zinc-900">
                    {s.from}
                    <ArrowRight className="h-4 w-4 text-zinc-400" />
                    {s.to}
                  </div>
                  <div className="mt-1 flex gap-4 text-sm text-zinc-500">
                    <span>Gidiş: {s.date}</span>
                    {s.returnDate && <span>Dönüş: {s.returnDate}</span>}
                    <span>{s.passengers} yolcu</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    ✨ Fiyat takipte
                  </span>
                  <button
                    onClick={() => {
                      const updated = savedSearches.filter(x => x.id !== s.id);
                      setSavedSearches(updated);
                      localStorage.setItem('izgetour_flight_searches', JSON.stringify(updated));
                    }}
                    className="text-xs text-zinc-400 hover:text-red-500"
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero Search */}
      <div className="bg-[#0066CC] px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-center text-3xl font-bold text-white">
            Ucuz Uçuş Bul, Fiyatı Takip Et
          </h1>

          {/* Trip Type */}
          <div className="mb-4 flex gap-4">
            {(['roundtrip', 'oneway'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTripType(type)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  tripType === type
                    ? 'bg-white text-[#0066CC]'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {type === 'roundtrip' ? 'Gidiş-Dönüş' : 'Tek Yön'}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="rounded-2xl bg-white p-4 shadow-xl">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
              {/* From */}
              <div className="md:col-span-2 flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3">
                <Plane className="h-4 w-4 shrink-0 text-[#0066CC]" />
                <div className="flex-1">
                  <label className="block text-xs font-medium text-zinc-500">Nereden</label>
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Şehir veya havaalanı"
                    className="w-full bg-transparent text-sm font-medium text-zinc-900 outline-none placeholder:text-zinc-400"
                  />
                </div>
              </div>

              {/* Swap button */}
              <div className="flex items-center justify-center">
                <button className="rounded-full bg-zinc-100 p-2 text-zinc-500 hover:bg-zinc-200">
                  <ArrowRight className="h-4 w-4 rotate-90" />
                </button>
              </div>

              {/* To */}
              <div className="md:col-span-2 flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3">
                <Plane className="h-4 w-4 rotate-90 shrink-0 text-[#0066CC]" />
                <div className="flex-1">
                  <label className="block text-xs font-medium text-zinc-500">Nereye</label>
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Şehir veya havaalanı"
                    className="w-full bg-transparent text-sm font-medium text-zinc-900 outline-none placeholder:text-zinc-400"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSearch}
                className="rounded-xl bg-[#0066CC] py-3 font-semibold text-white transition-colors hover:bg-[#0052a3]"
              >
                Ara
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              {/* Departure */}
              <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5">
                <Calendar className="h-4 w-4 shrink-0 text-zinc-400" />
                <div className="flex-1">
                  <label className="block text-xs text-zinc-500">Gidiş</label>
                  <input
                    type="date"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-zinc-900 outline-none"
                  />
                </div>
              </div>

              {/* Return */}
              {tripType === 'roundtrip' && (
                <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5">
                  <Calendar className="h-4 w-4 shrink-0 text-zinc-400" />
                  <div className="flex-1">
                    <label className="block text-xs text-zinc-500">Dönüş</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-zinc-900 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Passengers */}
              <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5">
                <Users className="h-4 w-4 shrink-0 text-zinc-400" />
                <div className="flex-1">
                  <label className="block text-xs text-zinc-500">Yolcu</label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-medium text-zinc-900 outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n} Yetişkin</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        {searched && (
          <>
            {/* Action Bar */}
            <div className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Plane className="h-4 w-4" />
                <span>{from}</span>
                <ArrowRight className="h-3 w-3" />
                <span className="font-medium">{to}</span>
                <span className="text-zinc-400">• {departure}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={simulatePriceChange}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Fiyat Yenile
                </button>
                {savedSearches.length > 0 && (
                  <button
                    onClick={() => setShowSaved(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50"
                  >
                    <Bell className="h-3.5 w-3.5" />
                    Takip Ettiklerim ({savedSearches.length})
                  </button>
                )}
              </div>
            </div>

            {/* Flight List */}
            <div className="space-y-3">
              {flights.map((flight) => {
                const isFollowed = followedFlights.has(flight.id);
                const priceChanged = flight.price < flight.originalPrice;

                return (
                  <div
                    key={flight.id}
                    className={`rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
                      isFollowed ? 'border-[#0066CC] ring-1 ring-[#0066CC]/20' : 'border-zinc-200'
                    }`}
                  >
                    {/* Airline + Follow */}
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-700">
                          {flight.airlineCode}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-900">{flight.airline}</span>
                          {flight.stops === 0 ? (
                            <span className="ml-2 text-xs text-green-600 font-medium">Direct</span>
                          ) : (
                            <span className="ml-2 text-xs text-amber-600 font-medium">
                              {flight.stops} stop • {flight.stopCities.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFollow(flight.id, flight)}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                          isFollowed
                            ? 'bg-[#0066CC] text-white'
                            : 'border border-zinc-200 text-zinc-600 hover:border-[#0066CC] hover:text-[#0066CC]'
                        }`}
                      >
                        {isFollowed ? (
                          <>
                            <Bell className="h-3.5 w-3.5" />
                            Takipte
                          </>
                        ) : (
                          <>
                            <BellOff className="h-3.5 w-3.5" />
                            Takip Et
                          </>
                        )}
                      </button>
                    </div>

                    {/* Times */}
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-zinc-900">{flight.departureTime}</div>
                        <div className="text-xs text-zinc-500">{flight.departure}</div>
                      </div>

                      <div className="flex flex-1 flex-col items-center">
                        <div className="flex items-center gap-1 text-xs text-zinc-400">
                          <Clock className="h-3 w-3" />
                          {flight.duration}
                        </div>
                        <div className="relative mt-1 w-full">
                          <div className="h-px w-full bg-zinc-200" />
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-[#0066CC] p-1">
                            <Plane className="h-2.5 w-2.5 rotate-90 text-white" />
                          </div>
                        </div>
                        {flight.stops > 0 && (
                          <div className="mt-1 rounded bg-amber-50 px-1.5 py-0.5 text-xs text-amber-600">
                            {flight.stopCities[0]}
                          </div>
                        )}
                      </div>

                      <div className="text-center">
                        <div className="text-xl font-bold text-zinc-900">{flight.arrivalTime}</div>
                        <div className="text-xs text-zinc-500">{flight.arrival}</div>
                      </div>

                      {/* Price */}
                      <div className="ml-auto text-right">
                        {priceChanged && (
                          <div className="text-xs text-green-600 font-medium mb-0.5">
                            ▼ Fiyat düştü!
                          </div>
                        )}
                        <div className={`text-xl font-bold ${priceChanged ? 'text-green-600' : 'text-[#0066CC]'}`}>
                          ₺{formatPrice(flight.price)}
                        </div>
                        <div className="text-xs text-zinc-400">kişi başı</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!searched && (
          <>
            {/* Popular Routes */}
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900">Popüler Rotalar</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {POPULAR_ROUTES.map((route) => (
                  <button
                    key={`${route.from}-${route.to}`}
                    onClick={() => {
                      setFrom(route.from);
                      setTo(route.to);
                    }}
                    className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3 text-left transition-all hover:border-[#0066CC] hover:shadow-md"
                  >
                    <span className="text-2xl">{route.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-zinc-900">{route.from}</div>
                      <div className="flex items-center gap-1 text-xs text-zinc-500">
                        <ArrowRight className="h-3 w-3" />
                        {route.to}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="rounded-2xl bg-blue-50 p-6">
              <h3 className="mb-2 font-semibold text-[#0066CC]">✈️ Fiyat Takibi Nasıl Çalışır?</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Beğendiğin bir uçuşu "Takip Et" butonuyla kaydedin. Fiyat değişikliklerinde 
                anında haberdar olun. Gerçek fiyat takibi için hesap oluşturun — email ile 
                bildirim gönderilir.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
