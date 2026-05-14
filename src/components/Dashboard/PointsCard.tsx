"use client";

import { useTranslations } from "next-intl";
import userProfile from "@/data/hubs/user_profile.json";
import { TrendingUp, Award } from "lucide-react";

export default function PointsCard() {
  const t = useTranslations("dashboard.points");
  const points = userProfile.points;

  return (
    <div className="bg-gradient-to-br from-amber-400 via-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-yellow-100">
            {t("totalPoints")}
          </p>
          <p className="text-4xl font-bold mt-1">
            {points.total.toLocaleString()}
          </p>
          <p className="text-sm text-yellow-100 mt-1">
            ≈ {points.tlValue.toLocaleString()} TL
          </p>
        </div>
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
          <Award className="w-7 h-7" />
        </div>
      </div>

      {/* Progress to next tier */}
      <div className="bg-white/15 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{t("nextTier")}</span>
          <span className="text-sm font-semibold">{points.nextTier}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{ width: `${(points.progress * 100).toFixed(0)}%` }}
          />
        </div>
        <p className="text-xs text-yellow-100 mt-2">
          {points.total.toLocaleString()} / {points.nextTierPoints.toLocaleString()}{" "}
          {t("points")}
        </p>
      </div>

      {/* Points History */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4" />
          <h3 className="text-sm font-semibold">{t("history")}</h3>
        </div>
        <div className="space-y-2">
          {points.history.slice(0, 4).map((entry, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium">{entry.action}</p>
                <p className="text-xs text-yellow-100">{entry.date}</p>
              </div>
              <span
                className={`font-semibold ${
                  entry.points > 0 ? "text-green-200" : "text-red-200"
                }`}
              >
                {entry.points > 0 ? "+" : ""}
                {entry.points.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
