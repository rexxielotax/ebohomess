'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

interface MapPlaceholderProps {
  height?: string;
  lat?: number;
  lng?: number;
  listings?: { id: string; lat: number; lng: number; title?: string; price_monthly?: number }[];
  onSelect?: (lat: number, lng: number) => void;
}

export function MapPlaceholder({ height = 'h-80', lat = 6.3249, lng = 8.1137, listings, onSelect }: MapPlaceholderProps) {
  const [marker, setMarker] = useState({ lat, lng });

  return (
    <div className={height} style={{ width: '100%' }}>
      <MapContainer center={[marker.lat, marker.lng]} zoom={12} style={{ width: '100%', height: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {listings?.map((l) => (
          <Marker key={l.id} position={[l.lat, l.lng]}>
            <Popup><strong>{l.title}</strong><br />₦{l.price_monthly}/mo</Popup>
          </Marker>
        ))}
        {!listings && <Marker position={[marker.lat, marker.lng]} />}
      </MapContainer>
    </div>
  );
}