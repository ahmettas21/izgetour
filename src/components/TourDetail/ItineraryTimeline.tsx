'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiMapPin, FiSunrise, FiCamera, FiCoffee } from 'react-icons/fi';

type DayItinerary = {
  day: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  activities: string[];
  activitiesEn: string[];
};

interface ItineraryTimelineProps {
  itinerary: DayItinerary[];
  locale: string;
}

const activityIcons = [FiSunrise, FiMapPin, FiCamera, FiCoffee];

export default function ItineraryTimeline({ itinerary, locale }: ItineraryTimelineProps) {
  const [openDay, setOpenDay] = useState<number>(1);

  if (!itinerary || itinerary.length === 0) return null;

  return (
    <div className="relative">
      {/* Timeline vertical line */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-[#0066CC]/20" />

      <div className="space-y-6">
        {itinerary.map((day) => {
          const isOpen = openDay === day.day;
          const title = locale === 'tr' ? day.title : day.titleEn;
          const description = locale === 'tr' ? day.description : day.descriptionEn;
          const activities = locale === 'tr' ? day.activities : day.activitiesEn;

          return (
            <div key={day.day} className="relative pl-12">
              {/* Timeline dot */}
              <div
                className={`absolute left-2.5 top-1.5 z-10 h-3.5 w-3.5 rounded-full border-2 transition-colors ${
                  isOpen
                    ? 'border-[#0066CC] bg-[#0066CC]'
                    : 'border-zinc-300 bg-white hover:border-[#0066CC]/50'
                }`}
              />

              {/* Content card */}
              <div
                className={`cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
                  isOpen ? 'border-[#0066CC]/30 shadow-md' : 'border-zinc-100'
                }`}
                onClick={() => setOpenDay(isOpen ? -1 : day.day)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0066CC]/10 text-sm font-bold text-[#0066CC]">
                      {day.day}
                    </span>
                    <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiChevronDown className="h-5 w-5 text-zinc-400" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                        {description}
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {activities.map((activity, idx) => {
                          const Icon = activityIcons[idx % activityIcons.length];
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-2 rounded-lg bg-zinc-50 p-2.5 text-xs text-zinc-700"
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0 text-[#0066CC]/70" />
                              <span>{activity}</span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
