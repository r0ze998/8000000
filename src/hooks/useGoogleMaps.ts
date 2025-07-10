import { useState, useEffect, useRef } from 'react';
import { Shrine } from '../types';

interface GoogleMapsHookReturn {
  map: google.maps.Map | null;
  isLoaded: boolean;
  error: string | null;
  addMarkers: (shrines: Shrine[]) => void;
  clearMarkers: () => void;
}

export function useGoogleMaps(center: { lat: number; lng: number }, zoom: number = 15) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        if (!window.google) {
          throw new Error('Google Maps API not loaded');
        }

        if (!mapRef.current) {
          throw new Error('Map container not found');
        }

        const mapInstance = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        setMap(mapInstance);
        setIsLoaded(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    initializeMap();
  }, [center.lat, center.lng, zoom]);

  const addMarkers = (shrines: Shrine[]) => {
    if (!map) return;

    // Clear existing markers
    clearMarkers();

    shrines.forEach(shrine => {
      const position = { lat: shrine.location.lat, lng: shrine.location.lng };

      // Use AdvancedMarkerElement if available, fallback to Marker
      let marker: any;

      if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
        marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position,
          title: shrine.name,
        });
      } else {
        marker = new google.maps.Marker({
          map,
          position,
          title: shrine.name,
        });
      }

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h3 style="margin: 0 0 5px 0;">${shrine.name}</h3>
            <p style="margin: 0; color: #666;">${shrine.description}</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">${shrine.location.address}</p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });
  };

  const clearMarkers = () => {
    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = [];
  };

  return {
    map,
    isLoaded,
    error,
    addMarkers,
    clearMarkers,
  };
}

export default useGoogleMaps;