import React, { useState, useEffect, useRef } from 'react';
import { useGoogleMaps } from '../../../hooks/useGoogleMaps';
import { shrines } from '../../../data/shrines';
import { Shrine } from '../../../types';
import PlaceholderMap from '../../common/PlaceholderMap';
import './Explore.css';

const Explore: React.FC = () => {
  const [selectedShrine, setSelectedShrine] = useState<Shrine | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const mapRef = useRef<HTMLDivElement>(null);
  const { isLoaded, error, addMarkers } = useGoogleMaps({ lat: 35.6762, lng: 139.6503 }, 15);

  const filteredShrines = shrines.filter(shrine =>
    shrine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shrine.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          setUserLocation({ lat: 35.6812, lng: 139.7671 });
        }
      );
    } else {
      setUserLocation({ lat: 35.6812, lng: 139.7671 });
    }
  }, []);

  useEffect(() => {
    if (isLoaded && mapRef.current && filteredShrines.length > 0) {
      addMarkers(filteredShrines);
    }
  }, [isLoaded, filteredShrines, addMarkers]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#FFD700';
      case 'rare': return '#9F7AEA';
      case 'uncommon': return '#4299E1';
      default: return '#48BB78';
    }
  };

  return (
    <div className="explore">
      <div className="explore-header">
        <h2>🗺️ 探索</h2>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="神社を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="map-container">
        {error && error.includes('API key not configured') ? (
          <PlaceholderMap 
            shrines={filteredShrines} 
            center={userLocation || undefined}
            className="explore-placeholder-map"
          />
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div ref={mapRef} className="google-map" />
            {!isLoaded && (
              <div className="loading-overlay">
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>地図を読み込み中...</p>
                </div>
              </div>
            )}
          </>
        )}

        {selectedShrine && (
          <div className="shrine-details">
            <button 
              className="close-button"
              onClick={() => setSelectedShrine(null)}
            >
              ×
            </button>
            <h3 className="shrine-name">{selectedShrine.name}</h3>
            <p 
              className="shrine-rarity"
              style={{ color: getRarityColor(selectedShrine.rarity) }}
            >
              {selectedShrine.rarity}
            </p>
            <p>{selectedShrine.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;