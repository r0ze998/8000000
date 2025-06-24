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

      <style jsx>{`
        .shrine-selector-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .shrine-selector-modal {
          background: white;
          border-radius: 20px;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .shrine-selector-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
          color: white;
        }

        .shrine-selector-header h2 {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 32px;
          cursor: pointer;
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.3s ease;
        }

        .close-btn:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .search-filters {
          padding: 20px 30px;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .search-bar {
          margin-bottom: 15px;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #ddd;
          border-radius: 10px;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #ff6b6b;
        }

        .filter-row {
          display: flex;
          gap: 15px;
        }

        .prefecture-select,
        .type-select {
          flex: 1;
          padding: 10px 12px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          cursor: pointer;
          transition: border-color 0.3s ease;
        }

        .prefecture-select:focus,
        .type-select:focus {
          outline: none;
          border-color: #ff6b6b;
        }

        .shrine-results {
          flex: 1;
          overflow-y: auto;
          padding: 0 30px 30px;
        }

        .results-header {
          padding: 20px 0 15px;
          color: #666;
          font-size: 14px;
          border-bottom: 1px solid #e9ecef;
          margin-bottom: 20px;
        }

        .shrine-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .shrine-item {
          border: 2px solid #e9ecef;
          border-radius: 15px;
          padding: 20px;
          background: white;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .shrine-item:hover {
          border-color: #ff6b6b;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .shrine-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .shrine-name-section {
          flex: 1;
        }

        .shrine-name {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }

        .shrine-location {
          display: flex;
          gap: 10px;
          font-size: 14px;
          color: #666;
        }

        .prefecture {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 500;
        }

        .city {
          background: #f3e5f5;
          color: #7b1fa2;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 500;
        }

        .shrine-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .rarity-badge {
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .cultural-value {
          background: linear-gradient(45deg, #4caf50, #8bc34a);
          color: white;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 14px;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
        }

        .shrine-description {
          color: #555;
          line-height: 1.6;
          margin-bottom: 12px;
          font-size: 15px;
        }

        .shrine-benefits {
          color: #666;
          font-size: 14px;
          margin-bottom: 15px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .shrine-item-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .details-btn,
        .select-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .details-btn {
          background: #6c757d;
          color: white;
        }

        .details-btn:hover {
          background: #5a6268;
          transform: translateY(-1px);
        }

        .select-btn {
          background: linear-gradient(45deg, #ff6b6b, #ff8e53);
          color: white;
          font-weight: bold;
        }

        .select-btn:hover {
          background: linear-gradient(45deg, #ff5252, #ff7043);
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
        }

        .shrine-details {
          margin-top: 20px;
          padding: 20px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 10px;
          border-top: 3px solid #ff6b6b;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }

        .detail-item {
          font-size: 14px;
          line-height: 1.5;
        }

        .detail-item strong {
          color: #333;
          display: block;
          margin-bottom: 4px;
        }

        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .no-results p {
          margin: 10px 0;
          font-size: 16px;
        }

        /* レスポンシブデザイン */
        @media (max-width: 768px) {
          .shrine-selector-overlay {
            padding: 10px;
          }

          .shrine-selector-modal {
            width: 95%;
            max-height: 95vh;
          }

          .shrine-selector-header {
            padding: 15px 20px;
          }

          .shrine-selector-header h2 {
            font-size: 20px;
          }

          .search-filters {
            padding: 15px 20px;
          }

          .filter-row {
            flex-direction: column;
            gap: 10px;
          }

          .shrine-results {
            padding: 0 20px 20px;
          }

          .shrine-item {
            padding: 15px;
          }

          .shrine-item-header {
            flex-direction: column;
            gap: 15px;
          }

          .shrine-meta {
            align-items: flex-start;
            flex-direction: row;
            justify-content: space-between;
          }

          .shrine-item-actions {
            flex-direction: column;
            gap: 8px;
          }

          .details-btn,
          .select-btn {
            width: 100%;
            padding: 12px;
          }

          .details-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }

        /* ダークモード対応 */
        @media (prefers-color-scheme: dark) {
          .shrine-selector-modal {
            background: #2a2a2a;
            color: #f0f0f0;
          }

          .search-filters {
            background: #333;
            border-bottom-color: #444;
          }

          .search-input,
          .prefecture-select,
          .type-select {
            background: #444;
            border-color: #555;
            color: #f0f0f0;
          }

          .shrine-item {
            background: #333;
            border-color: #444;
          }

          .shrine-item:hover {
            border-color: #ff6b6b;
          }

          .shrine-benefits {
            background: #444;
          }

          .shrine-details {
            background: linear-gradient(135deg, #444 0%, #333 100%);
          }

          .results-header {
            color: #ccc;
            border-bottom-color: #444;
          }
        }
      `}</style>
    </div>
  );
};

export default ShrineSelector;