import React, { useEffect, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapLibre, UserTrackingMode } from '@capawesome/capacitor-maplibre'

interface MapComponentProps {
  onLocationUpdate?: (lat: number, lng: number) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onLocationUpdate }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const mapInitialized = useRef(false);

  useEffect(() => {
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
          setPosition([-34.6037, -58.3816]);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      setPosition([-34.6037, -58.3816]);
    }
  }, []);

  useEffect(() => {

    if (!position || mapInitialized.current) return;

    async function createMap() {
      await MapLibre.createMap({
        mapId: 'map',
        styleUrl: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        elementId: 'my-map',
        center: { latitude: -34.6037, longitude: -58.3816 },
        zoom: 14,
      });

      mapInitialized.current = true;
    
      let status = await MapLibre.checkPermissions();
      if (status.location === 'prompt') {
        status = await MapLibre.requestPermissions();
      }

      if (status.location !== 'granted') {
        return;
      }

      await MapLibre.enableUserLocation({
        mapId: 'map',
        trackingMode: UserTrackingMode.Follow,
      });

    }

    createMap();

    return () => {
      if (mapInitialized.current) {
        MapLibre.destroyMap({ mapId: 'map' }).catch(console.error);
        mapInitialized.current = false;
      }
    };
  }, [position]);

  if (!position) {
    return <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>Obteniendo ubicación...</div>;
  }

  return (
    <div id="my-map" style={{ width: '100%', height: '100%' }}></div>
  );
};

export default MapComponent;
