import React, { useState, useEffect } from 'react';

const MOCK_SHRINES = [
  {
    id: 1,
    name: '明治神宮',
    rarity: 'legendary',
    description: '東京都渋谷区にある神社。明治天皇と昭憲皇太后を祭神とする。',
    city: '東京',
    prefecture: '東京都',
    distance: '2.5km',
    culturalValue: 100,
    benefits: ['縁結び', '商売繁盛', '学業成就'],
    coordinates: { lat: 35.6762, lng: 139.6993 }
  },
  {
    id: 2,
    name: '浅草寺',
    rarity: 'epic',
    description: '東京都台東区にある東京都内最古の寺。観音菩薩を祭る。',
    city: '台東区',
    prefecture: '東京都',
    distance: '5.2km',
    culturalValue: 85,
    benefits: ['厄除け', '開運', '健康祈願'],
    coordinates: { lat: 35.7148, lng: 139.7967 }
  },
  {
    id: 3,
    name: '靖国神社',
    rarity: 'rare',
    description: '東京都千代田区にある神社。戦没者を祀る。',
    city: '千代田区',
    prefecture: '東京都',
    distance: '3.8km',
    culturalValue: 90,
    benefits: ['平和祈願', '国家安泰'],
    coordinates: { lat: 35.6938, lng: 139.7444 }
  },
  {
    id: 4,
    name: '伏見稲荷大社',
    rarity: 'legendary',
    description: '京都市伏見区にある神社。千本鳥居で有名。',
    city: '京都市',
    prefecture: '京都府',
    distance: '450km',
    culturalValue: 120,
    benefits: ['商売繁盛', '五穀豊穣'],
    coordinates: { lat: 34.9671, lng: 135.7727 }
  },
  {
    id: 5,
    name: '厳島神社',
    rarity: 'legendary',
    description: '広島県廿日市市にある神社。海上に建つ鳥居で有名。',
    city: '廿日市市',
    prefecture: '広島県',
    distance: '800km',
    culturalValue: 110,
    benefits: ['交通安全', '海上安全'],
    coordinates: { lat: 34.2957, lng: 132.3194 }
  }
];

const ExploreScreen = ({ playerData, addCulturalCapital, addNFT }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShrine, setSelectedShrine] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [filteredShrines, setFilteredShrines] = useState(MOCK_SHRINES);

  useEffect(() => {
    // Simulate map loading
    setTimeout(() => setMapLoading(false), 2000);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = MOCK_SHRINES.filter(shrine =>
        shrine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shrine.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredShrines(filtered);
    } else {
      setFilteredShrines(MOCK_SHRINES);
    }
  }, [searchQuery]);

  const getRarityColor = (rarity) => {
    const colors = {
      common: '#48BB78',
      rare: '#9F7AEA',
      epic: '#4299E1',
      legendary: '#FFD700'
    };
    return colors[rarity] || '#48BB78';
  };

  const getRarityName = (rarity) => {
    const names = {
      common: 'コモン',
      rare: 'レア', 
      epic: 'エピック',
      legendary: 'レジェンダリー'
    };
    return names[rarity] || 'コモン';
  };

  const handleShrineVisit = (shrine) => {
    const reward = shrine.culturalValue;
    addCulturalCapital(reward);

    // 20% chance to get NFT
    if (Math.random() < 0.2) {
      const nft = {
        type: 'shrine_visit',
        name: `${shrine.name}の御朱印`,
        emoji: shrine.rarity === 'legendary' ? '⛩️' : '🏛️',
        rarity: shrine.rarity,
        color: getRarityColor(shrine.rarity),
        shrineId: shrine.id,
        shrineName: shrine.name
      };
      addNFT(nft);
    }

    setSelectedShrine(null);
    alert(`${shrine.name}を参拝しました！ +${reward} 文化資本`);
  };

  return (
    <div>
      {/* Header */}
      <div className="section">
        <h2 className="section-title">🗺️ 探索</h2>
        <p className="section-subtitle">近くの神社と寺院を探して参拝しましょう</p>

        {/* Search Bar */}
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="神社名や説明で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '25px',
              color: 'white',
              fontSize: '1rem'
            }}
          />
        </div>
      </div>

      {/* Map Section */}
      <div className="section">
        <h3 className="section-title">🗺️ 地図</h3>
        <div style={{
          height: '300px',
          background: mapLoading 
            ? 'rgba(255, 255, 255, 0.05)'
            : 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {mapLoading ? (
            <div className="loading">
              <div className="spinner"></div>
              <span style={{ marginLeft: '1rem' }}>地図を読み込み中...</span>
            </div>
          ) : (
            <>
              <div style={{
                fontSize: '4rem',
                opacity: 0.3,
                marginBottom: '1rem'
              }}>
                🗺️
              </div>
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                fontSize: '0.8rem',
                color: 'rgba(255, 255, 255, 0.5)'
              }}>
                Google Maps統合は開発中です
              </div>
            </>
          )}
        </div>
      </div>

      {/* Shrine List */}
      <div className="section">
        <h3 className="section-title">⛩️ 神社・寺院リスト</h3>
        <div className="grid grid-1" style={{ gap: '1rem' }}>
          {filteredShrines.map(shrine => (
            <div
              key={shrine.id}
              className={`card rarity-${shrine.rarity}`}
              style={{
                cursor: 'pointer',
                border: `2px solid ${getRarityColor(shrine.rarity)}40`
              }}
              onClick={() => setSelectedShrine(shrine)}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div>
                  <h4 style={{ 
                    color: getRarityColor(shrine.rarity), 
                    marginBottom: '0.5rem',
                    fontSize: '1.2rem'
                  }}>
                    {shrine.rarity === 'legendary' ? '⛩️' : '🏛️'} {shrine.name}
                  </h4>
                  <div style={{ 
                    fontSize: '0.8rem',
                    color: getRarityColor(shrine.rarity),
                    fontWeight: 'bold',
                    marginBottom: '0.5rem'
                  }}>
                    {getRarityName(shrine.rarity)}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  📍 {shrine.distance}
                </div>
              </div>

              <p style={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '1rem',
                lineHeight: '1.4',
                fontSize: '0.9rem'
              }}>
                {shrine.description}
              </p>

              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '0.9rem' }}>
                  <span style={{ color: '#FFD700' }}>⚡ {shrine.culturalValue}</span>
                  <span style={{ 
                    marginLeft: '1rem', 
                    color: 'rgba(255, 255, 255, 0.7)' 
                  }}>
                    📍 {shrine.city}, {shrine.prefecture}
                  </span>
                </div>
              </div>

              <div style={{ 
                marginTop: '1rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                {shrine.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.2rem 0.6rem',
                      background: `${getRarityColor(shrine.rarity)}20`,
                      border: `1px solid ${getRarityColor(shrine.rarity)}40`,
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      color: getRarityColor(shrine.rarity)
                    }}
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shrine Detail Modal */}
      {selectedShrine && (
        <div className="modal-overlay" onClick={() => setSelectedShrine(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedShrine.name}</h3>
              <button className="close-btn" onClick={() => setSelectedShrine(null)}>✕</button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '1rem',
                color: getRarityColor(selectedShrine.rarity)
              }}>
                {selectedShrine.rarity === 'legendary' ? '⛩️' : '🏛️'}
              </div>
              <div style={{ 
                fontSize: '0.9rem',
                color: getRarityColor(selectedShrine.rarity),
                fontWeight: 'bold',
                marginBottom: '0.5rem'
              }}>
                {getRarityName(selectedShrine.rarity)}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.5',
                marginBottom: '1rem'
              }}>
                {selectedShrine.description}
              </p>

              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-icon">⚡</span>
                  <div className="stat-value">{selectedShrine.culturalValue}</div>
                  <div className="stat-label">文化資本</div>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">📍</span>
                  <div className="stat-value">{selectedShrine.distance}</div>
                  <div className="stat-label">距離</div>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">🎭</span>
                  <div className="stat-value">{selectedShrine.benefits.length}</div>
                  <div className="stat-label">ご利益</div>
                </div>
              </div>

              <div style={{ margin: '1.5rem 0' }}>
                <h4 style={{ 
                  color: '#FFD700', 
                  marginBottom: '1rem',
                  fontSize: '1.1rem'
                }}>
                  🙏 ご利益
                </h4>
                <div style={{ 
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {selectedShrine.benefits.map((benefit, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '0.5rem 1rem',
                        background: `${getRarityColor(selectedShrine.rarity)}20`,
                        border: `1px solid ${getRarityColor(selectedShrine.rarity)}40`,
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        color: getRarityColor(selectedShrine.rarity)
                      }}
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => handleShrineVisit(selectedShrine)}
              style={{ 
                width: '100%',
                fontSize: '1.1rem',
                padding: '1rem'
              }}
            >
              🙏 参拝する (+{selectedShrine.culturalValue} 文化資本)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreScreen;