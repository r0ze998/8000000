import React, { useState, useEffect } from 'react';
import './ExploreTab.css';
import TourismIntegration from './TourismIntegration';
import { shrineDatabase } from '../data/shrineDatabase';

const ExploreTab = ({
  userLocation,
  userProfile,
  soundEffects,
  showTemporaryNotification,
  updatePlayerExperience,
  onShrineSelect,
  onEventJoin
}) => {
  const [nearbySpots, setNearbySpots] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTourismDetails, setShowTourismDetails] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    // シミュレートされた近くの神社データ
    const simulatedNearby = [
      {
        id: 'meiji-jingu',
        name: '明治神宮',
        distance: '2.5km',
        category: 'famous',
        rating: 4.8,
        visitors: '3M+/年',
        features: ['大鳥居', '清正井', '宝物殿'],
        image: '🏛️'
      },
      {
        id: 'yasukuni',
        name: '靖国神社',
        distance: '3.8km',
        category: 'historic',
        rating: 4.5,
        visitors: '2M+/年',
        features: ['桜の名所', '遊就館', '茶室'],
        image: '⛩️'
      },
      {
        id: 'kanda-myojin',
        name: '神田明神',
        distance: '1.2km',
        category: 'local',
        rating: 4.6,
        visitors: '500K+/年',
        features: ['IT守護', 'アニメ聖地', '商売繁盛'],
        image: '🎌'
      }
    ];
    setNearbySpots(simulatedNearby);
  }, [userLocation]);

  const categories = [
    { id: 'all', label: 'すべて', icon: '🗾' },
    { id: 'famous', label: '有名神社', icon: '⭐' },
    { id: 'historic', label: '歴史的', icon: '🏛️' },
    { id: 'local', label: '地域の神社', icon: '🏘️' },
    { id: 'nature', label: '自然豊か', icon: '🌳' },
    { id: 'festival', label: 'お祭り', icon: '🎆' }
  ];

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    soundEffects.playSound('koto');
  };

  const handleShrineVisit = (shrine) => {
    onShrineSelect(shrine);
    showTemporaryNotification(`🗺️ ${shrine.name}へのルートを表示します`);
    soundEffects.playSound('bell');
  };

  const handleRouteOptimized = (routes) => {
    if (routes && routes.length > 0) {
      setSelectedRoute(routes[0]);
      showTemporaryNotification('🚶 最適なルートを見つけました！');
      updatePlayerExperience(50);
    }
  };

  const filteredSpots = selectedCategory === 'all' 
    ? nearbySpots 
    : nearbySpots.filter(spot => spot.category === selectedCategory);

  return (
    <div className="explore-tab">
      {/* ヘッダーセクション */}
      <div className="explore-header">
        <h2>🗺️ 神社を探索</h2>
        <p className="explore-description">
          近くの神社や寺院を発見し、文化的な旅を楽しみましょう
        </p>
      </div>

      {/* カテゴリー選択 */}
      <div className="category-selector">
        <div className="category-pills">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-pill ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-label">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 近くの神社スポット */}
      <div className="nearby-spots">
        <h3>📍 近くの神社・寺院</h3>
        <div className="spots-grid">
          {filteredSpots.map(spot => (
            <div key={spot.id} className="spot-card">
              <div className="spot-image">{spot.image}</div>
              <div className="spot-info">
                <h4>{spot.name}</h4>
                <div className="spot-meta">
                  <span className="distance">📏 {spot.distance}</span>
                  <span className="rating">⭐ {spot.rating}</span>
                  <span className="visitors">👥 {spot.visitors}</span>
                </div>
                <div className="spot-features">
                  {spot.features.map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                </div>
                <button 
                  className="visit-btn"
                  onClick={() => handleShrineVisit(spot)}
                >
                  訪問する
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 推奨ルート */}
      <div className="recommended-routes">
        <h3>🚶 おすすめ巡礼ルート</h3>
        <div className="route-cards">
          <div className="route-card">
            <div className="route-header">
              <h4>🌸 桜の名所巡り</h4>
              <span className="route-duration">半日コース</span>
            </div>
            <p className="route-description">
              春の時期に最適な、桜の美しい神社を巡るコース
            </p>
            <div className="route-stats">
              <span>🚶 5.2km</span>
              <span>⛩️ 3神社</span>
              <span>⏱️ 3-4時間</span>
            </div>
            <button 
              className="route-btn"
              onClick={() => {
                setShowTourismDetails(true);
                soundEffects.playSound('gong');
              }}
            >
              詳細を見る
            </button>
          </div>

          <div className="route-card">
            <div className="route-header">
              <h4>🏛️ 歴史探訪コース</h4>
              <span className="route-duration">1日コース</span>
            </div>
            <p className="route-description">
              江戸時代からの歴史ある神社を巡る文化体験コース
            </p>
            <div className="route-stats">
              <span>🚶 8.5km</span>
              <span>⛩️ 5神社</span>
              <span>⏱️ 6-7時間</span>
            </div>
            <button 
              className="route-btn"
              onClick={() => {
                setShowTourismDetails(true);
                soundEffects.playSound('gong');
              }}
            >
              詳細を見る
            </button>
          </div>

          <div className="route-card special">
            <div className="route-header">
              <h4>⚡ パワースポット巡り</h4>
              <span className="route-duration">週末コース</span>
            </div>
            <p className="route-description">
              関東最強のパワースポットを効率よく巡る特別コース
            </p>
            <div className="route-stats">
              <span>🚶 15km</span>
              <span>⛩️ 7神社</span>
              <span>⏱️ 2日間</span>
            </div>
            <button 
              className="route-btn special-btn"
              onClick={() => {
                setShowTourismDetails(true);
                soundEffects.playSound('gong');
                showTemporaryNotification('⚡ 特別なパワースポットコースです！');
              }}
            >
              詳細を見る
            </button>
          </div>
        </div>
      </div>

      {/* 季節のイベント */}
      <div className="seasonal-events">
        <h3>🎆 季節の祭り・イベント</h3>
        <div className="events-list">
          <div className="event-item">
            <div className="event-date">
              <span className="month">3月</span>
              <span className="day">15-17</span>
            </div>
            <div className="event-details">
              <h4>浅草寺 金龍の舞</h4>
              <p>春の訪れを祝う伝統的な龍の舞</p>
              <span className="event-tag">伝統芸能</span>
            </div>
            <button 
              className="event-btn"
              onClick={() => onEventJoin('kinryu-mai')}
            >
              参加
            </button>
          </div>

          <div className="event-item">
            <div className="event-date">
              <span className="month">5月</span>
              <span className="day">14-15</span>
            </div>
            <div className="event-details">
              <h4>神田祭</h4>
              <p>江戸三大祭の一つ、2年に1度の大祭</p>
              <span className="event-tag">大祭</span>
            </div>
            <button 
              className="event-btn"
              onClick={() => onEventJoin('kanda-matsuri')}
            >
              参加
            </button>
          </div>
        </div>
      </div>

      {/* 観光統合システム（詳細表示） */}
      {showTourismDetails && (
        <div className="tourism-overlay">
          <button 
            className="close-btn"
            onClick={() => setShowTourismDetails(false)}
          >
            ✕
          </button>
          <TourismIntegration
            userLocation={userLocation}
            userProfile={userProfile}
            onRouteOptimized={handleRouteOptimized}
            onEconomicImpact={(impact) => {
              console.log('経済効果:', impact);
            }}
          />
        </div>
      )}

      {/* エクスプローラー統計 */}
      <div className="explorer-stats">
        <h3>📊 あなたの探索統計</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{userProfile.shrinesVisited || 0}</span>
            <span className="stat-label">訪問神社数</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{userProfile.totalDistance || 0}km</span>
            <span className="stat-label">総移動距離</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{userProfile.eventsJoined || 0}</span>
            <span className="stat-label">参加イベント</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{userProfile.culturalCapital || 0}</span>
            <span className="stat-label">文化資本</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreTab;