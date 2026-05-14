'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface TripCountdownWidgetProps {
  destination: string;
  tripDate: string; // ISO date string e.g., '2026-06-15T00:00:00Z'
  imageUrl?: string;
}

export const TripCountdownWidget: React.FC<TripCountdownWidgetProps> = ({
  destination,
  tripDate,
  imageUrl = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const targetDate = new Date(tripDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // update every minute
    return () => clearInterval(interval);
  }, [tripDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-lg group border border-gray-100 bg-white"
    >
      <div className="h-40 w-full relative">
        <Image
          src={imageUrl}
          alt={`Trip to ${destination}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, 384px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-sm font-medium uppercase tracking-wider opacity-80">Next Trip</p>
          <h3 className="text-2xl font-bold">{destination}</h3>
        </div>
      </div>

      <div className="p-5 flex justify-between items-center bg-white">
        <div className="text-center">
          <span className="block text-3xl font-bold text-blue-600">{timeLeft.days}</span>
          <span className="text-xs text-gray-500 uppercase font-semibold">Gün</span>
        </div>
        <div className="text-2xl text-gray-300 font-light">:</div>
        <div className="text-center">
          <span className="block text-3xl font-bold text-blue-600">{timeLeft.hours.toString().padStart(2, '0')}</span>
          <span className="text-xs text-gray-500 uppercase font-semibold">Saat</span>
        </div>
        <div className="text-2xl text-gray-300 font-light">:</div>
        <div className="text-center">
          <span className="block text-3xl font-bold text-blue-600">{timeLeft.minutes.toString().padStart(2, '0')}</span>
          <span className="text-xs text-gray-500 uppercase font-semibold">Dakika</span>
        </div>
      </div>
      <div className="px-5 pb-5">
        <button className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200">
          Seyahat Detayları
        </button>
      </div>
    </motion.div>
  );
};

export default TripCountdownWidget;
