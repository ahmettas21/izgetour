"use client";

import { useTranslations } from "next-intl";
import userProfile from "@/data/hubs/user_profile.json";
import { CheckCircle2, Clock, FileText } from "lucide-react";

const STEP_ICONS = {
  "Başvuru Alındı": <FileText className="w-4 h-4" />,
  "Evrak İncelemesi": <FileText className="w-4 h-4" />,
  Mülakat: <Clock className="w-4 h-4" />,
  "Karar Aşaması": <Clock className="w-4 h-4" />,
  Onaylandı: <CheckCircle2 className="w-4 h-4" />,
  Reddedildi: <CheckCircle2 className="w-4 h-4" />,
};

export default function VisaStatus() {
  const t = useTranslations("dashboard.visa");
  const visas = userProfile.visas;

  return (
    <div className="space-y-6">
      {visas.map((visa) => (
        <div
          key={visa.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">{visa.country}</h3>
              <p className="text-sm text-gray-500">
                {visa.type} · {t("applied")}: {visa.applicationDate}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {visa.status}
            </span>
          </div>

          {/* Timeline */}
          <div className="relative ml-2">
            {visa.steps.map((step, i) => (
              <div key={i} className="flex gap-4 pb-6 last:pb-0 relative">
                {/* Connector line */}
                {i < visa.steps.length - 1 && (
                  <div
                    className={`absolute left-[11px] top-6 w-0.5 h-full ${
                      step.completed ? "bg-green-400" : "bg-gray-200"
                    }`}
                  />
                )}
                {/* Step dot */}
                <div
                  className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                    step.completed
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {STEP_ICONS[step.label as keyof typeof STEP_ICONS] || (
                    <Clock className="w-4 h-4" />
                  )}
                </div>
                {/* Step content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      step.completed ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{step.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Documents */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
              {t("documents")}
            </p>
            <div className="flex flex-wrap gap-2">
              {visa.documents.uploaded.map((doc, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium"
                >
                  ✓ {doc}
                </span>
              ))}
              {visa.documents.pending.map((doc, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs font-medium"
                >
                  ⏳ {doc}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
