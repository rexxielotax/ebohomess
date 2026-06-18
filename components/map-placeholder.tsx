'use client'

import { useEffect, useRef } from 'react'

interface MapPlaceholderProps {
  height?: string
  showPins?: boolean
  onPinClick?: (id: string) => void
  highlightedPin?: string
}

const PINS = [
  { id: '1', lat: 6.3249, lng: 8.1137, label: 'Abakaliki GRA' },
  { id: '2', lat: 6.3180, lng: 8.1050, label: 'Kpirikpiri' },
  { id: '3', lat: 6.3350, lng: 8.1200, label: 'EBSU Area' },
  { id: '4', lat: 6.3100, lng: 8.1080, label: 'Mile 50' },
  { id: '5', lat: 6.0600, lng: 8.0800, label: 'Onueke' },
  { id: '6', lat: 5.8930, lng: 7.9340, label: 'Afikpo' },
]

export function MapPlaceholder({
  height = 'h-96',
  onPinClick,
}: MapPlaceholderProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
useEffect(() => {
  if (!mapRef.current) return;

  // If map already exists, don't reinitialize
  if (mapInstanceRef.current) return;

  import('leaflet').then((L) => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([6.3249, 8.1137], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const icon = L.divIcon({
      className: '',
      html: <div style="width:24px;height:24px;background:#2D6A4F;border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;"></div>,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    PINS.forEach((pin) => {
      const marker = L.marker([pin.lat, pin.lng], { icon })
        .addTo(map)
        .bindTooltip(pin.label, { permanent: false });
      marker.on('click', () => onPinClick?.(pin.id));
    });

    mapInstanceRef.current = map;
  });

  return () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
  };
}, []);

  return (
    <div
      ref={mapRef}
      className={`${height} w-full rounded-lg overflow-hidden border border-border`}
    />
  )
}