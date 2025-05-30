import React, { useState } from 'react';
import { RESOURCES } from '../constants/villageBuilding';
import './ResourcePanel.css';

const ResourcePanel = ({ resources, onResourceGain, showResourceGather = true }) => {
  const [gatheredToday, setGatheredToday] = useState({});
  const [gatherCooldowns, setGatherCooldowns] = useState({});

  // リソース収集
  const gatherResource = (resourceType) => {
    if (gatherCooldowns[resourceType]) return;

    // クールダウン設定（リソースタイプによって異なる）
    const cooldownTime = getCooldownTime(resourceType);
    setGatherCooldowns(prev => ({
      ...prev,
      [resourceType]: true
    }));

    setTimeout(() => {
      setGatherCooldowns(prev => ({
        ...prev,
        [resourceType]: false
      }));
    }, cooldownTime);

    // リソース増加
    const gainAmount = getGatherAmount(resourceType);
    setGatheredToday(prev => ({
      ...prev,
      [resourceType]: (prev[resourceType] || 0) + gainAmount
    }));

    if (onResourceGain) {
      onResourceGain(resourceType, gainAmount);
    }
  };

  // リソース別のクールダウン時間
  const getCooldownTime = (resourceType) => {
    const cooldowns = {
      wood: 5000, // 5秒
      stone: 8000, // 8秒
      bamboo: 10000, // 10秒
      water: 3000, // 3秒
      plants: 4000, // 4秒
      faith: 15000, // 15秒
      bronze: 20000, // 20秒
      gold: 30000, // 30秒
      cloth: 12000, // 12秒
      paper: 6000, // 6秒
      oil: 7000, // 7秒
      asphalt: 15000, // 15秒
      gravel: 4000 // 4秒
    };
    return cooldowns[resourceType] || 10000;
  };

  // リソース別の収集量
  const getGatherAmount = (resourceType) => {
    const amounts = {
      wood: 3,
      stone: 2,
      bamboo: 1,
      water: 5,
      plants: 2,
      faith: 1,
      bronze: 1,
      gold: 1,
      cloth: 1,
      paper: 2,
      oil: 1,
      asphalt: 2,
      gravel: 3
    };
    return amounts[resourceType] || 1;
  };

  // リソースの重要度による並び順
  const getResourcePriority = (resourceType) => {
    const priorities = {
      faith: 1,
      gold: 2,
      bronze: 3,
      wood: 4,
      stone: 5,
      bamboo: 6,
      water: 7,
      plants: 8,
      cloth: 9,
      paper: 10,
      oil: 11,
      gravel: 12,
      asphalt: 13
    };
    return priorities[resourceType] || 99;
  };

  // リソースをカテゴリ別に分類
  const categorizeResources = () => {
    const categories = {
      spiritual: ['faith'],
      precious: ['gold', 'bronze'],
      natural: ['wood', 'stone', 'bamboo', 'water', 'plants'],
      crafted: ['cloth', 'paper', 'oil'],
      modern: ['asphalt', 'gravel']
    };

    const categorized = {};
    Object.entries(categories).forEach(([category, resourceTypes]) => {
      categorized[category] = resourceTypes
        .filter(type => RESOURCES[type])
        .sort((a, b) => getResourcePriority(a) - getResourcePriority(b));
    });

    return categorized;
  };

  const resourceCategories = categorizeResources();

  const categoryNames = {
    spiritual: '精神的資源',
    precious: '貴重資源',
    natural: '自然資源',
    crafted: '工芸資源',
    modern: '現代資源'
  };

  return (
    <div className="resource-panel">
      <h3>📦 リソース管理</h3>
      
      {/* 総リソース表示 */}
      <div className="total-resources">
        <h4>保有リソース</h4>
        {Object.entries(resourceCategories).map(([category, resourceTypes]) => (
          <div key={category} className="resource-category">
            <h5>{categoryNames[category]}</h5>
            <div className="resource-list">
              {resourceTypes.map(resourceType => {
                const resourceInfo = RESOURCES[resourceType];
                const amount = resources[resourceType] || 0;
                const gathered = gatheredToday[resourceType] || 0;
                const isOnCooldown = gatherCooldowns[resourceType];
                
                return (
                  <div 
                    key={resourceType} 
                    className={`resource-item ${amount === 0 ? 'empty' : ''}`}
                  >
                    <div className="resource-info">
                      <span className="resource-icon">{resourceInfo.icon}</span>
                      <div className="resource-details">
                        <span className="resource-name">{resourceInfo.name}</span>
                        <span className="resource-amount">{amount}</span>
                        {gathered > 0 && (
                          <span className="gathered-today">
                            +{gathered} 今日
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* リソース収集ボタン */}
                    {showResourceGather && (
                      <button
                        className={`gather-button ${isOnCooldown ? 'cooldown' : ''}`}
                        onClick={() => gatherResource(resourceType)}
                        disabled={isOnCooldown}
                        title={`${resourceInfo.description} (${getGatherAmount(resourceType)}獲得)`}
                      >
                        {isOnCooldown ? '⏳' : '⛏️'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* リソース獲得のヒント */}
      <div className="resource-tips">
        <h4>💡 リソース獲得のコツ</h4>
        <div className="tips-list">
          <div className="tip-item">
            <span className="tip-icon">⛩️</span>
            <span className="tip-text">神社参拝で信仰心を獲得</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🏛️</span>
            <span className="tip-text">寺院参拝で精神力を高める</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🎯</span>
            <span className="tip-text">特別イベントで希少資源を入手</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">⏰</span>
            <span className="tip-text">毎日の参拝でボーナス獲得</span>
          </div>
        </div>
      </div>

      {/* デイリー収集状況 */}
      <div className="daily-summary">
        <h4>📊 今日の収集状況</h4>
        <div className="daily-stats">
          {Object.entries(gatheredToday).length === 0 ? (
            <p className="no-gathering">まだリソースを収集していません</p>
          ) : (
            Object.entries(gatheredToday).map(([resourceType, amount]) => (
              <div key={resourceType} className="daily-stat">
                <span className="stat-icon">{RESOURCES[resourceType]?.icon}</span>
                <span className="stat-amount">+{amount}</span>
                <span className="stat-name">{RESOURCES[resourceType]?.name}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* クラフト提案 */}
      <div className="craft-suggestions">
        <h4>🔨 建築可能な建物</h4>
        <div className="suggestions-list">
          {getCraftableSuggestions(resources).map(suggestion => (
            <div key={suggestion.type} className="craft-suggestion">
              <span className="suggestion-icon">{suggestion.icon}</span>
              <span className="suggestion-name">{suggestion.name}</span>
              <span className="suggestion-status">{suggestion.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 建築可能な建物の提案を生成
const getCraftableSuggestions = (resources) => {
  const suggestions = [];
  
  // 基本的な建物チェック
  if ((resources.wood || 0) >= 10 && (resources.stone || 0) >= 5) {
    suggestions.push({
      type: 'torii',
      name: '鳥居',
      icon: '⛩️',
      status: '建築可能'
    });
  }
  
  if ((resources.faith || 0) >= 50) {
    suggestions.push({
      type: 'worship',
      name: '拝殿',
      icon: '🙏',
      status: '建築可能'
    });
  }
  
  if ((resources.wood || 0) >= 30 && (resources.gold || 0) >= 10) {
    suggestions.push({
      type: 'mainHall',
      name: '本殿',
      icon: '🏛️',
      status: '建築可能'
    });
  }
  
  // リソース不足の場合の提案
  if (suggestions.length === 0) {
    if ((resources.wood || 0) < 10) {
      suggestions.push({
        type: 'gather',
        name: '木材収集',
        icon: '🪵',
        status: `あと${10 - (resources.wood || 0)}必要`
      });
    }
  }
  
  return suggestions.slice(0, 3); // 最大3つまで表示
};

export default ResourcePanel;