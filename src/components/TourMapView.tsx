'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { MOCK_TOURS } from '@/data/tours';

// ------------------------------------------------------------------ //
// TourMapView — Leaflet-based interactive map for tour listing.
// Shows all tours as color-coded markers with popups.
// Requires leaflet CSS to be imported in the parent or layout.
// ------------------------------------------------------------------ //

interface TourMapViewProps {
  onTourHover?: (tourId: string | null) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  culture: '#8B5CF6',
  nature: '#10B981',
  city: '#F59E0B',
  sea: '#3B82F6',
  adventure: '#EF4444',
};

function getCategoryColor(category?: string): string {
  return category ? CATEGORY_COLORS[category] ?? '#6366F1' : '#6366F1';
}

export default function TourMapView({ onTourHover }: TourMapViewProps) {
  const t = useTranslations('tours');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersLayer = useRef<any>(null);
  const [leaflet, setLeaflet] = useState<any>(null);

  // Dynamic import of leaflet to avoid SSR issues
  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      const L = await import('leaflet');

      // Fix default icon path issue with bundlers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (cancelled) return;
      setLeaflet(L);
    }

    initMap();
    return () => { cancelled = true; };
  }, []);

  // Initialize map once leaflet is loaded
  useEffect(() => {
    if (!leaflet || !mapRef.current || mapInstance.current) return;

    const map = leaflet.map(mapRef.current, {
      center: [39.5, 35.5], // Center of Turkey
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    leaflet
      .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      })
      .addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [leaflet]);

  // Add markers when map and leaflet are ready
  useEffect(() => {
    if (!leaflet || !mapInstance.current) return;

    const map = mapInstance.current;

    // Remove old markers layer if exists
    if (markersLayer.current) {
      map.removeLayer(markersLayer.current);
    }

    markersLayer.current = leaflet.layerGroup().addTo(map);

    MOCK_TOURS.forEach((tour) => {
      if (!tour.lat || !tour.lng) return;

      const color = getCategoryColor(tour.category);
      const markerHtml = `<div style="
        width: 16px; height: 16px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
      "></div>`;

      const icon = leaflet.divIcon({
        html: markerHtml,
        className: 'tour-marker',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -10],
      });

      const marker = leaflet
        .marker([tour.lat, tour.lng], { icon })
        .addTo(markersLayer.current);

      const popupContent = `
        <div style="min-width: 200px; font-family: system-ui, sans-serif;">
          ${
            tour.image
              ? `<img src="${tour.image}" alt="${tour.title}" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />`
              : ''
          }
          <h3 style="margin:0 0 4px;font-size:14px;font-weight:600;">${tour.title}</h3>
          <div style="display:flex;gap:8px;font-size:12px;color:#666;margin-bottom:6px;">
            <span>⭐ ${tour.rating}</span>
            <span>📅 ${tour.duration} ${tour.duration === 1 ? 'Gün' : 'Gün'}</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:16px;font-weight:700;color:#0066CC;">
              ₺${tour.price.toLocaleString()}
            </span>
            <a href="/tours/${tour.slug}"
               style="display:inline-flex;align-items:center;gap:4px;padding:4px 12px;border-radius:9999px;background:#0066CC;color:white;font-size:12px;font-weight:600;text-decoration:none;">
              ${t('map.viewDetail') ?? 'Detay'}
              →
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 260, className: 'tour-popup' });

      marker.on('mouseover', () => {
        onTourHover?.(tour.id);
      });
      marker.on('mouseout', () => {
        onTourHover?.(null);
      });
    });

    // Fit bounds to all markers
    const bounds = leaflet.latLngBounds(
      MOCK_TOURS.filter((t) => t.lat && t.lng).map((t) => [t.lat, t.lng])
    );
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
    }
  }, [leaflet, onTourHover, t]);

  return (
    <div
      ref={mapRef}
      className="h-[500px] w-full rounded-xl border border-zinc-200 shadow-sm sm:h-[600px]"
      style={{ zIndex: 1 }}
    />
  );
}
