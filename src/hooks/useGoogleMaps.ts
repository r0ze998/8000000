import { useState, useEffect, useCallback, useRef } from 'react';
import { Shrine } from '../types';

interface UseGoogleMapsReturn {
  isLoaded: boolean;
  error: string | null;
  loadGoogleMapsScript: () => Promise<void>;
  initializeMap: (container: HTMLElement, userLocation?: { lat: number; lng: number }) => google.maps.Map | null;
  addMarkers: (map: google.maps.Map, shrines: Shrine[]) => void;
}

export const useGoogleMaps = (): UseGoogleMapsReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scriptLoadedRef = useRef(false);

  const loadGoogleMapsScript = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      // 既にAPIが読み込まれている場合
      if (scriptLoadedRef.current || (window.google && window.google.maps)) {
        setIsLoaded(true);
        resolve();
        return;
      }

      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        const errorMsg = 'Google Maps APIキーが設定されていません';
        setError(errorMsg);
        reject(new Error(errorMsg));
        return;
      }

      // 既存のスクリプトを確認（重複防止）
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          scriptLoadedRef.current = true;
          setIsLoaded(true);
          resolve();
        });
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        scriptLoadedRef.current = true;
        setIsLoaded(true);
        setError(null);
        resolve();
      };

      script.onerror = () => {
        const errorMsg = 'Google Maps APIの読み込みに失敗しました';
        setError(errorMsg);
        reject(new Error(errorMsg));
      };

      document.head.appendChild(script);
    });
  }, []);

  const initializeMap = useCallback((
    container: HTMLElement, 
    userLocation: { lat: number; lng: number } = { lat: 35.6812, lng: 139.7671 }
  ): google.maps.Map | null => {
    if (!window.google?.maps?.Map || !container) {
      setError('Google Maps APIが読み込まれていません');
      return null;
    }

    try {
      return new window.google.maps.Map(container, {
        center: userLocation,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
    } catch (err) {
      setError('地図の初期化に失敗しました');
      console.error('Map initialization error:', err);
      return null;
    }
  }, []);

  const addMarkers = useCallback((map: google.maps.Map, shrines: Shrine[]) => {
    if (!window.google?.maps?.marker?.AdvancedMarkerElement && !window.google?.maps?.Marker) return;

    shrines.forEach(shrine => {
      const position = shrine.position || { lat: shrine.lat, lng: shrine.lng };

      // Use AdvancedMarkerElement if available, fallback to Marker
      let marker: any;
      if (window.google?.maps?.marker?.AdvancedMarkerElement) {
        // Create custom marker content
        const markerElement = document.createElement('div');
        markerElement.style.cssText = `
          width: 32px;
          height: 32px;
          background: ${getRarityColor(shrine.rarity)};
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        markerElement.textContent = '⛩️';

        marker = new window.google.maps.marker.AdvancedMarkerElement({
          position,
          map,
          title: shrine.name,
          content: markerElement,
        });
      } else {
        // Fallback to deprecated Marker
        marker = new window.google.maps.Marker({
          position,
          map,
          title: shrine.name,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="${getRarityColor(shrine.rarity)}" stroke="white" stroke-width="2"/>
                <text x="16" y="20" text-anchor="middle" font-size="14" fill="white">⛩️</text>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(32, 32),
          },
        });
      }

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 8px 0; color: #333;">${shrine.name}</h3>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">${shrine.description}</p>
            <div style="color: ${getRarityColor(shrine.rarity)}; font-weight: bold; font-size: 12px;">
              ⭐ ${shrine.rarity}
            </div>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });
  }, []);

  useEffect(() => {
    loadGoogleMapsScript().catch(console.error);
  }, [loadGoogleMapsScript]);

  return {
    isLoaded,
    error,
    loadGoogleMapsScript,
    initializeMap,
    addMarkers,
  };
};

const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'legendary': return '#FFD700';
    case 'epic': return '#9F7AEA';
    case 'rare': return '#4299E1';
    case 'uncommon': return '#38A169';
    default: return '#68D391';
  }
};