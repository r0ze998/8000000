import React from 'react';
import { Shrine } from '../../types';
import './PlaceholderMap.css';

interface PlaceholderMapProps {
  shrines?: Shrine[];
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

const PlaceholderMap: React.FC<PlaceholderMapProps> = ({
  shrines = [],
  center = { lat: 35.6762, lng: 139.6503 },
  zoom = 15,
  className = ''
}) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#FFD700';
      case 'rare': return '#9F7AEA';
      case 'uncommon': return '#4299E1';
      default: return '#48BB78';
    }
  };

  return (
    <div className={`placeholder-map ${className}`}>
      <div className="placeholder-map-overlay">
        <div className="map-header">
          <h3>🗾 神社マップ</h3>
          <div className="map-notice">
            <p>📍 Google Maps API設定で実際の地図を表示できます</p>
            <p>開発用プレースホルダーマップ</p>
          </div>
        </div>
        
        <div className="map-content">
          <div className="map-grid">
            {/* 仮想的な地図グリッド */}
            <div className="map-area">
              <div className="terrain-layer">
                <div className="terrain water"></div>
                <div className="terrain mountain"></div>
                <div className="terrain forest"></div>
                <div className="terrain city"></div>
              </div>
              
              {/* 神社マーカー */}
              <div className="shrine-markers">
                {shrines.slice(0, 8).map((shrine, index) => (
                  <div
                    key={shrine.id}
                    className="shrine-marker"
                    style={{
                      left: `${20 + (index % 4) * 20}%`,
                      top: `${20 + Math.floor(index / 4) * 30}%`,
                      borderColor: getRarityColor(shrine.rarity)
                    }}
                    title={shrine.name}
                  >
                    <div className="marker-icon">⛩️</div>
                    <div className="marker-label">{shrine.name}</div>
                  </div>
                ))}
              </div>

              {/* 現在地マーカー */}
              <div className="current-location">
                <div className="location-pulse"></div>
                <div className="location-marker">📍</div>
              </div>
            </div>
          </div>
        </div>

        <div className="map-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#FFD700' }}></span>
            <span>伝説級</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#9F7AEA' }}></span>
            <span>希少級</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#4299E1' }}></span>
            <span>一般級</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#48BB78' }}></span>
            <span>基本級</span>
          </div>
        </div>

        <div className="map-stats">
          <div className="stat-item">
            <span className="stat-icon">⛩️</span>
            <span className="stat-text">{shrines.length} 神社</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📍</span>
            <span className="stat-text">現在地: 東京</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🔍</span>
            <span className="stat-text">ズーム: {zoom}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderMap;