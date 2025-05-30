import React, { useState, useMemo } from 'react';
import { BUILDING_TYPES, RESOURCES } from '../constants/villageBuilding';
import './BuildingPalette.css';

const BuildingPalette = ({ onSelectBuilding, selectedBuilding, playerResources, playerLevel = 1 }) => {
  const [activeCategory, setActiveCategory] = useState('shrine');
  const [showVariants, setShowVariants] = useState(false);
  const [selectedBaseBuilding, setSelectedBaseBuilding] = useState(null);

  // レベルに応じて利用可能な建物をフィルタ
  const availableBuildings = useMemo(() => {
    const filtered = {};
    
    Object.entries(BUILDING_TYPES).forEach(([category, buildings]) => {
      filtered[category] = {};
      Object.entries(buildings).forEach(([type, buildingInfo]) => {
        if (buildingInfo.unlockLevel <= playerLevel) {
          filtered[category][type] = buildingInfo;
        }
      });
    });
    
    return filtered;
  }, [playerLevel]);

  // リソース不足チェック
  const canAfford = (cost) => {
    return Object.entries(cost).every(([resource, amount]) => {
      return (playerResources[resource] || 0) >= amount;
    });
  };

  // 建物選択ハンドラ
  const handleBuildingSelect = (category, type, buildingInfo) => {
    if (buildingInfo.variants && buildingInfo.variants.length > 1) {
      setSelectedBaseBuilding({ category, type, ...buildingInfo });
      setShowVariants(true);
    } else {
      onSelectBuilding({
        category,
        type,
        variant: buildingInfo.variants?.[0] || 'default'
      });
    }
  };

  // バリアント選択ハンドラ
  const handleVariantSelect = (variant) => {
    onSelectBuilding({
      category: selectedBaseBuilding.category,
      type: selectedBaseBuilding.type,
      variant
    });
    setShowVariants(false);
    setSelectedBaseBuilding(null);
  };

  const categories = [
    { key: 'shrine', name: '神社', icon: '⛩️' },
    { key: 'temple', name: '寺院', icon: '🏛️' },
    { key: 'decoration', name: '装飾', icon: '🌸' },
    { key: 'infrastructure', name: 'インフラ', icon: '🏗️' }
  ];

  return (
    <div className="building-palette">
      {/* カテゴリタブ */}
      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.key}
            className={`category-tab ${activeCategory === category.key ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.key)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      {/* 建物リスト */}
      <div className="building-list">
        {availableBuildings[activeCategory] && 
         Object.entries(availableBuildings[activeCategory]).map(([type, buildingInfo]) => {
          const isSelected = selectedBuilding?.type === type && selectedBuilding?.category === activeCategory;
          const affordable = canAfford(buildingInfo.cost);
          
          return (
            <div
              key={type}
              className={`building-item ${isSelected ? 'selected' : ''} ${!affordable ? 'unaffordable' : ''}`}
              onClick={() => handleBuildingSelect(activeCategory, type, buildingInfo)}
            >
              {/* 建物アイコン/プレビュー */}
              <div className="building-icon">
                {getBuildingEmoji(activeCategory, type)}
              </div>
              
              {/* 建物情報 */}
              <div className="building-info">
                <h4 className="building-name">{buildingInfo.name}</h4>
                <p className="building-description">{buildingInfo.description}</p>
                
                {/* コスト表示 */}
                <div className="building-cost">
                  {Object.entries(buildingInfo.cost).map(([resource, amount]) => {
                    const hasEnough = (playerResources[resource] || 0) >= amount;
                    return (
                      <span 
                        key={resource} 
                        className={`cost-item ${!hasEnough ? 'insufficient' : ''}`}
                      >
                        {RESOURCES[resource]?.icon} {amount}
                      </span>
                    );
                  })}
                </div>
                
                {/* サイズ表示 */}
                <div className="building-size">
                  📐 {buildingInfo.size.width}×{buildingInfo.size.height}
                </div>
                
                {/* バリアント数表示 */}
                {buildingInfo.variants && buildingInfo.variants.length > 1 && (
                  <div className="variant-count">
                    🎨 {buildingInfo.variants.length}種類
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* バリアント選択モーダル */}
      {showVariants && selectedBaseBuilding && (
        <div className="variant-modal">
          <div className="modal-content">
            <h3>{selectedBaseBuilding.name} - スタイル選択</h3>
            <div className="variant-grid">
              {selectedBaseBuilding.variants.map(variant => (
                <div
                  key={variant}
                  className="variant-item"
                  onClick={() => handleVariantSelect(variant)}
                >
                  <div className="variant-preview">
                    {getBuildingEmoji(selectedBaseBuilding.category, selectedBaseBuilding.type, variant)}
                  </div>
                  <span className="variant-name">{getVariantName(variant)}</span>
                </div>
              ))}
            </div>
            <button 
              className="close-button"
              onClick={() => setShowVariants(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 選択中の建物情報 */}
      {selectedBuilding && (
        <div className="selected-building-info">
          <h3>選択中: {BUILDING_TYPES[selectedBuilding.category]?.[selectedBuilding.type]?.name}</h3>
          <p>バリアント: {getVariantName(selectedBuilding.variant)}</p>
          <p className="build-hint">マップをクリックして建設</p>
        </div>
      )}
    </div>
  );
};

// 建物のEmoji取得
const getBuildingEmoji = (category, type, variant = 'default') => {
  const emojiMap = {
    shrine: {
      torii: { default: '⛩️', classic: '⛩️', vermillion: '🔴⛩️', golden: '🟡⛩️', ancient: '🟤⛩️' },
      mainHall: { default: '🏛️', traditional: '🏛️', imperial: '👑🏛️', mountain: '🏔️🏛️', sea: '🌊🏛️' },
      worship: { default: '🙏', simple: '🙏', decorated: '✨🙏', modern: '🏢🙏' },
      kagura: { default: '💃', open: '💃', covered: '🏠💃', festival: '🎭💃' }
    },
    temple: {
      gate: { default: '🚪', nio: '👹🚪', simple: '🚪', decorated: '✨🚪' },
      mainHall: { default: '🏯', zen: '🧘🏯', pure_land: '🌸🏯', nichiren: '🪷🏯' },
      pagoda: { default: '🗼', three_story: '3️⃣🗼', five_story: '5️⃣🗼', ancient: '🟤🗼' },
      bell: { default: '🔔', traditional: '🔔', modern: '🔊🔔', artistic: '🎨🔔' }
    },
    decoration: {
      lantern: { default: '🏮', stone: '🪨🏮', bronze: '🥉🏮', paper: '📜🏮', electric: '💡🏮' },
      garden: { default: '🌿', rock: '🪨🌿', pond: '🪻🌿', zen: '🧘🌿', tea: '🍵🌿' },
      bridge: { default: '🌉', wooden: '🪵🌉', stone: '🪨🌉', vermillion: '🔴🌉' },
      statue: { default: '🦁', classic: '🦁', fierce: '😤🦁', cute: '😊🦁', golden: '🟡🦁' }
    },
    infrastructure: {
      path: { default: '🛤️', gravel: '◽🛤️', stone: '🪨🛤️', wooden: '🪵🛤️', modern: '🏢🛤️' },
      water: { default: '⛲', traditional: '⛲', modern: '🚿⛲', artistic: '🎨⛲' },
      office: { default: '🏢', traditional: '🏛️🏢', modern: '🏢' },
      parking: { default: '🅿️', gravel: '◽🅿️', paved: '⬛🅿️', covered: '🏠🅿️' }
    }
  };

  return emojiMap[category]?.[type]?.[variant] || emojiMap[category]?.[type]?.default || '🏗️';
};

// バリアント名の取得
const getVariantName = (variant) => {
  const variantNames = {
    classic: 'クラシック',
    vermillion: '朱色',
    golden: '金色',
    ancient: '古式',
    traditional: '伝統的',
    imperial: '皇室風',
    mountain: '山岳風',
    sea: '海辺風',
    simple: 'シンプル',
    decorated: '装飾',
    modern: 'モダン',
    open: 'オープン',
    covered: '屋根付き',
    festival: '祭り用',
    nio: '仁王門',
    zen: '禅宗',
    pure_land: '浄土宗',
    nichiren: '日蓮宗',
    three_story: '三重塔',
    five_story: '五重塔',
    stone: '石造',
    bronze: '青銅',
    paper: '和紙',
    electric: '電気',
    rock: '枯山水',
    pond: '池泉',
    tea: '茶庭',
    wooden: '木造',
    fierce: '威嚇',
    cute: '愛嬌',
    gravel: '砂利',
    paved: '舗装',
    artistic: '芸術的'
  };

  return variantNames[variant] || variant;
};

export default BuildingPalette;