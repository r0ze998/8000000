import React, { useState, useMemo } from 'react';
import { 
  SHRINE_TEMPLE_DATABASE, 
  searchShrines,
  RARITY_MULTIPLIERS 
} from '../data/shrineDatabase';

const ShrineSelector = ({ onShrineSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrefecture, setSelectedPrefecture] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showDetails, setShowDetails] = useState(null);

  // 都道府県リストを取得
  const prefectures = useMemo(() => {
    const prefs = [...new Set(SHRINE_TEMPLE_DATABASE.map(shrine => shrine.prefecture))];
    return prefs.sort();
  }, []);

  // フィルタリングされた神社・寺院リスト
  const filteredShrines = useMemo(() => {
    let results = SHRINE_TEMPLE_DATABASE;

    // 検索クエリでフィルタ
    if (searchQuery) {
      results = searchShrines(searchQuery);
    }

    // 都道府県でフィルタ
    if (selectedPrefecture) {
      results = results.filter(shrine => shrine.prefecture === selectedPrefecture);
    }

    // タイプでフィルタ
    if (selectedType) {
      results = results.filter(shrine => shrine.type === selectedType);
    }

    return results.sort((a, b) => b.culturalValue - a.culturalValue);
  }, [searchQuery, selectedPrefecture, selectedType]);

  const handleShrineSelect = (shrine) => {
    const baseExp = 50; // 基本経験値
    const rarityMultiplier = RARITY_MULTIPLIERS[shrine.rarity] || 1.0;
    const experience = Math.floor(baseExp * rarityMultiplier);
    
    onShrineSelect({
      shrine,
      experience,
      timestamp: new Date().toISOString()
    });
    onClose();
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: '#808080',
      uncommon: '#00ff00',
      rare: '#0080ff',
      legendary: '#ff8000',
      mythical: '#ff0080'
    };
    return colors[rarity] || '#808080';
  };

  const getRarityName = (rarity) => {
    const names = {
      common: '一般',
      uncommon: '珍しい',
      rare: 'レア',
      legendary: '伝説',
      mythical: '神話級'
    };
    return names[rarity] || '一般';
  };

  return (
    <div className="shrine-selector-overlay">
      <div className="shrine-selector-modal">
        <div className="shrine-selector-header">
          <h2>神社・寺院を選択</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* 検索・フィルタ */}
        <div className="search-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="神社・寺院名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-row">
            <select
              value={selectedPrefecture}
              onChange={(e) => setSelectedPrefecture(e.target.value)}
              className="prefecture-select"
            >
              <option value="">すべての都道府県</option>
              {prefectures.map(pref => (
                <option key={pref} value={pref}>{pref}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="type-select"
            >
              <option value="">神社・寺院</option>
              <option value="shrine">神社のみ</option>
              <option value="temple">寺院のみ</option>
            </select>
          </div>
        </div>

        {/* 結果表示 */}
        <div className="shrine-results">
          <div className="results-header">
            <span>{filteredShrines.length}件の神社・寺院が見つかりました</span>
          </div>

          <div className="shrine-list">
            {filteredShrines.map(shrine => (
              <div key={shrine.id} className="shrine-item">
                <div className="shrine-item-header">
                  <div className="shrine-name-section">
                    <h3 className="shrine-name">{shrine.name}</h3>
                    <div className="shrine-location">
                      <span className="prefecture">{shrine.prefecture}</span>
                      <span className="city">{shrine.city}</span>
                    </div>
                  </div>
                  
                  <div className="shrine-meta">
                    <div 
                      className="rarity-badge"
                      style={{ backgroundColor: getRarityColor(shrine.rarity) }}
                    >
                      {getRarityName(shrine.rarity)}
                    </div>
                    <div className="cultural-value">
                      +{Math.floor(50 * (RARITY_MULTIPLIERS[shrine.rarity] || 1.0))} 文化資本
                    </div>
                  </div>
                </div>

                <div className="shrine-description">
                  {shrine.description}
                </div>

                <div className="shrine-benefits">
                  <strong>ご利益:</strong> {shrine.benefits.join('、')}
                </div>

                <div className="shrine-item-actions">
                  <button
                    className="details-btn"
                    onClick={() => setShowDetails(showDetails === shrine.id ? null : shrine.id)}
                  >
                    {showDetails === shrine.id ? '詳細を隠す' : '詳細を見る'}
                  </button>
                  <button
                    className="select-btn"
                    onClick={() => handleShrineSelect(shrine)}
                  >
                    参拝記録
                  </button>
                </div>

                {showDetails === shrine.id && (
                  <div className="shrine-details">
                    <div className="details-grid">
                      <div className="detail-item">
                        <strong>住所:</strong> {shrine.address}
                      </div>
                      <div className="detail-item">
                        <strong>創建:</strong> {shrine.founded}年
                      </div>
                      <div className="detail-item">
                        <strong>
                          {shrine.type === 'shrine' ? '御祭神:' : '宗派:'}
                        </strong> 
                        {shrine.deity || shrine.sect}
                      </div>
                      <div className="detail-item">
                        <strong>文化価値:</strong> {shrine.culturalValue}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredShrines.length === 0 && (
            <div className="no-results">
              <p>検索条件に合う神社・寺院が見つかりませんでした。</p>
              <p>検索条件を変更してお試しください。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShrineSelector;