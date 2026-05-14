"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import userProfile from "@/data/hubs/user_profile.json";
import { Plane, Building2, Compass, Eye, Download, X, Clock } from "lucide-react";

const EN_MONTHS: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};
const TR_MONTHS: Record<string, string> = {
  Oca: "01", Şub: "02", Mar: "03", Nis: "04", May: "05", Haz: "06",
  Tem: "07", Ağu: "08", Eyl: "09", Eki: "10", Kas: "11", Ara: "12",
};
const MONTH_MAP = { ...EN_MONTHS, ...TR_MONTHS };

function parseBookingDate(dateStr: string): string {
  // e.g. "15 Jun 2026" or "15 Haz 2026"
  const parts = dateStr.trim().split(" ");
  if (parts.length !== 3) return "";
  const day = parts[0].padStart(2, "0");
  const month = MONTH_MAP[parts[1]] ?? parts[1];
  return `${parts[2]}-${month}-${day}`;
}

function CountdownBadge({ dateStr }: { dateStr: string }) {
  const parsed = parseBookingDate(dateStr);
  const { days, hours, minutes, expired } = useCountdown(parsed);
  if (expired) return null;
  return (
    <div className="flex items-center gap-1 bg-blue-50 border border-blue-100 rounded-lg px-2 py-1 shrink-0">
      <Clock className="w-3 h-3 text-blue-500" />
      <span className="text-xs font-semibold text-blue-600">
        {days}d {hours.toString().padStart(2, "0")}h {minutes.toString().padStart(2, "0")}m
      </span>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  Bekliyor: "bg-yellow-100 text-yellow-800",
  Tamamlandı: "bg-green-100 text-green-800",
  "İptal Edildi": "bg-red-100 text-red-800",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  flight: <Plane className="w-5 h-5 text-blue-600" />,
  hotel: <Building2 className="w-5 h-5 text-purple-600" />,
  tour: <Compass className="w-5 h-5 text-orange-600" />,
};

function useCountdown(targetDateStr: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, expired: false });

  useEffect(() => {
    const target = new Date(targetDateStr + "T09:00:00").getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, expired: true }); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        expired: false,
      });
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [targetDateStr]);

  return timeLeft;
}

export default function BookingHistory() {
  const t = useTranslations("dashboard.bookings");
  const bookings = userProfile.bookings;
  const [selectedBooking, setSelectedBooking] = useState<
    (typeof bookings)[0] | null
  >(null);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {t("title")}
      </h2>

      <div className="space-y-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
              {TYPE_ICONS[booking.type] || <Compass className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">
                {booking.title}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-gray-500">
                  {booking.date} — {booking.passengers}{" "}
                  {booking.passengers > 1 ? t("passengers") : t("passenger")}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    STATUS_STYLES[booking.status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
            <CountdownBadge dateStr={booking.date} />
            <div className="text-right">
              <p className="font-semibold text-gray-900 text-sm">
                {booking.amount.toLocaleString()} {booking.currency}
              </p>
              <div className="flex gap-1 mt-1">
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  {t("details")}
                </button>
                <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded transition-colors">
                  <Download className="w-3 h-3" />
                  {t("download")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                {selectedBooking.title}
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3 mb-6 text-sm text-gray-600">
              <p>
                {t("bookingId")}: {selectedBooking.id}
              </p>
              <p>
                {t("date")}: {selectedBooking.date}
              </p>
              <p>
                {t("status")}:{" "}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    STATUS_STYLES[selectedBooking.status] || ""
                  }`}
                >
                  {selectedBooking.status}
                </span>
              </p>
              <p>
                {t("amount")}: {selectedBooking.amount.toLocaleString()}{" "}
                {selectedBooking.currency}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                {t("resendTicket")}
              </button>
              <button className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                {t("downloadInvoice")}
              </button>
              <button className="w-full px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
                {t("cancelRequest")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
