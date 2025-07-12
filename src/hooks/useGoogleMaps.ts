import { useState, useEffect, useRef } from 'react';
import { Shrine } from '../types';
import { googleMapsLoader } from '../utils/googleMapsLoader';

interface GoogleMapsHookReturn {
  map: google.maps.Map | null;
  isLoaded: boolean;
  error: string | null;
  addMarkers: (shrines: Shrine[]) => void;
  clearMarkers: () => void;
}

export const useGoogleMaps = (
  center: { lat: number; lng: number },
  zoom: number = 15
): GoogleMapsHookReturn => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Load Google Maps API
        await googleMapsLoader.load();

        // Check if Google Maps is available
        if (!googleMapsLoader.isGoogleMapsLoaded()) {
          // Development fallback - show placeholder
          setError('Google Maps API key not configured. Showing placeholder map.');
          setIsLoaded(true);
          return;
        }

        if (!window.google) {
          throw new Error('Google Maps API not loaded');
        }

        const mapContainer = document.querySelector('.google-map');
        if (!mapContainer) {
          throw new Error('Map container not found');
        }

        const mapInstance = new google.maps.Map(mapContainer as HTMLElement, {
          center,
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'poi.place_of_worship',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }]
            }
          ]
        });

        setMap(mapInstance);
        setIsLoaded(true);
      } catch (err) {
        console.error('Google Maps initialization error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoaded(true); // Allow the app to continue even if maps fail
      }
    };

    initializeMap();
  }, [center.lat, center.lng, zoom]);

  const addMarkers = (shrines: Shrine[]) => {
    if (!map || !window.google) {
      console.log('Map not available, skipping marker placement');
      return;
    }

    // Clear existing markers
    clearMarkers();

    shrines.forEach(shrine => {
      const position = { lat: shrine.location.lat, lng: shrine.location.lng };

      // Create marker
      const marker = new google.maps.Marker({
        map,
        position,
        title: shrine.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <text x="12" y="16" font-size="16" text-anchor="middle" fill="#ff6b6b">⛩️</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24)
        }
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">${shrine.name}</h3>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${shrine.description}</p>
            <p style="margin: 0; font-size: 12px; color: #999;">${shrine.location.address}</p>
            <div style="margin-top: 8px; padding: 4px 8px; background: #f8f9fa; border-radius: 4px; font-size: 12px;">
              <span style="color: #007bff;">📍 ${shrine.rarity}</span>
            </div>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers
    if (markersRef.current.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markersRef.current.forEach(marker => {
        const position = marker.getPosition();
        if (position) {
          bounds.extend(position);
        }
      });
      map.fitBounds(bounds);
    }
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
};