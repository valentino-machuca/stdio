import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { maplibreGL } from '@maplibre/maplibre-gl-leaflet';

// Fix for default Leaflet marker icons not showing up due to webpack issues
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const customUserIcon = L.divIcon({
  className: 'user-marker-icon',
  html: `
    <div class="pulse-container">
      <div class="pulse-ring"></div>
      <div class="pulse-dot"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

interface MapComponentProps {
  onLocationUpdate?: (lat: number, lng: number) => void;
}

const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
    // Force Leaflet to recalculate size, which fixes gray map issues in Ionic
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [center, map]);
  return null;
};

// Custom component to integrate maplibre into react-leaflet
const MapLibreLayer: React.FC<{ styleUrl: string }> = ({ styleUrl }) => {
  const map = useMap();
  useEffect(() => {
    const glLayer = maplibreGL({
      style: styleUrl,
    });
    glLayer.addTo(map);

    return () => {
      map.removeLayer(glLayer);
    };
  }, [map, styleUrl]);
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ onLocationUpdate }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Request geolocation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setPosition([lat, lng]);
          if (onLocationUpdate) {
            onLocationUpdate(lat, lng);
          }
        },
        (err) => {
          console.error("Error getting location:", err);
          // Fallback to a default location if denied (e.g. city center)
          setPosition([-34.6037, -58.3816]); // Buenos Aires as fallback
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setPosition([-34.6037, -58.3816]);
    }
  }, []);

  if (!position) {
    return <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>Obteniendo ubicación...</div>;
  }

  return (
    <MapContainer 
      center={position} 
      zoom={15} 
      zoomControl={false}
      style={{ height: '100%', width: '100%' }}
    >
      <MapLibreLayer styleUrl="https://tiles.openfreemap.org/styles/positron" />
      <MapController center={position} />
      <Marker position={position} icon={customUserIcon} />

    </MapContainer>
  );
};

export default MapComponent;
