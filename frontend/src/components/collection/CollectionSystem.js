import React, { useState, useEffect } from 'react';
import { COLLECTIBLE_ITEMS } from '../constants/villageBuilding';
import './CollectionSystem.css';

const CollectionSystem = ({ 
  playerCollection = {}, 
  onCollectionUpdate,
  playerStats = {},
  recentVisits = []
}) => {
  const [activeTab, setActiveTab] = useState('architectural');
  const [showItemDetail, setShowItemDetail] = useState(null);
  const [newItems, setNewItems] = useState([]);

  // 新しいアイテム獲得をチェック
  useEffect(() => {
    checkForNewItems();
  }, [recentVisits, playerStats]);

  // 新しいアイテムの獲得判定
  const checkForNewItems = () => {
    const newlyUnlocked = [];

    // アーキテクチャアイテムのチェック
    Object.entries(COLLECTIBLE_ITEMS.architectural).forEach(([itemId, item]) => {
      if (!playerCollection[itemId] && checkUnlockCondition(item.unlockCondition)) {
        newlyUnlocked.push({ itemId, ...item, category: 'architectural' });
      }
    });

    // 装飾アイテムのチェック
    Object.entries(COLLECTIBLE_ITEMS.decorative).forEach(([itemId, item]) => {
      if (!playerCollection[itemId] && checkSeasonalCondition(itemId)) {
        newlyUnlocked.push({ itemId, ...item, category: 'decorative' });
      }
    });

    // 特殊アイテムのチェック
    Object.entries(COLLECTIBLE_ITEMS.special).forEach(([itemId, item]) => {
      if (!playerCollection[itemId] && checkSpecialCondition(itemId)) {
        newlyUnlocked.push({ itemId, ...item, category: 'special' });
      }
    });

    if (newlyUnlocked.length > 0) {
      setNewItems(newlyUnlocked);
      // コレクション更新
      const updatedCollection = { ...playerCollection };
      newlyUnlocked.forEach(item => {
        updatedCollection[item.itemId] = {
          unlocked: true,
          unlockedAt: new Date(),
          rarity: item.rarity
        };
      });
      onCollectionUpdate(updatedCollection);
    }
  };

  // アンロック条件のチェック
  const checkUnlockCondition = (condition) => {
    switch (condition) {
      case '100回連続参拝':
        return (playerStats.consecutiveVisits || 0) >= 100;
      case '満月参拝10回':
        return (playerStats.fullMoonVisits || 0) >= 10;
      default:
        return false;
    }
  };

  // 季節条件のチェック
  const checkSeasonalCondition = (itemId) => {
    const now = new Date();
    const month = now.getMonth() + 1;

    switch (itemId) {
      case 'sakura_petals':
        return month >= 3 && month <= 5 && hasRecentVisit();
      case 'autumn_leaves':
        return month >= 9 && month <= 11 && hasRecentVisit();
      default:
        return false;
    }
  };

  // 特殊条件のチェック
  const checkSpecialCondition = (itemId) => {
    switch (itemId) {
      case 'dragon_guardian':
        return (playerStats.legendaryShrineSVisits || 0) >= 1;
      default:
        return false;
    }
  };

  // 最近の参拝チェック
  const hasRecentVisit = () => {
    return recentVisits.some(visit => {
      const visitDate = new Date(visit.date);
      const today = new Date();
      return (today - visitDate) < 24 * 60 * 60 * 1000; // 24時間以内
    });
  };

  // レアリティの色取得
  const getRarityColor = (rarity) => {
    const colors = {
      common: '#95a5a6',
      uncommon: '#27ae60',
      rare: '#3498db',
      epic: '#9b59b6',
      legendary: '#f39c12',
      mythical: '#e74c3c'
    };
    return colors[rarity] || '#95a5a6';
  };

  // レアリティの星数
  const getRarityStars = (rarity) => {
    const stars = {
      common: 1,
      uncommon: 2,
      rare: 3,
      epic: 4,
      legendary: 5,
      mythical: 6
    };
    return '⭐'.repeat(stars[rarity] || 1);
  };

  // タブデータ
  const tabs = [
    { key: 'architectural', name: '建築パーツ', icon: '🏗️' },
    { key: 'decorative', name: '装飾アイテム', icon: '🎨' },
    { key: 'special', name: '特殊アイテム', icon: '✨' }
  ];

  // コレクション統計
  const getCollectionStats = () => {
    const total = Object.keys(COLLECTIBLE_ITEMS).reduce((sum, category) => {
      return sum + Object.keys(COLLECTIBLE_ITEMS[category]).length;
    }, 0);
    
    const collected = Object.keys(playerCollection).length;
    const completionRate = total > 0 ? (collected / total * 100).toFixed(1) : 0;
    
    return { total, collected, completionRate };
  };

  const stats = getCollectionStats();

  return (
    <div className="collection-system">
      {/* ヘッダー */}
      <div className="collection-header">
        <h2>🏆 コレクション</h2>
        <div className="collection-stats">
          <span className="completion-rate">{stats.completionRate}% 完成</span>
          <span className="item-count">{stats.collected}/{stats.total}</span>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="collection-progress">
        <div 
          className="progress-bar"
          style={{ width: `${stats.completionRate}%` }}
        />
      </div>

      {/* タブナビゲーション */}
      <div className="collection-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-name">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* アイテムグリッド */}
      <div className="items-grid">
        {COLLECTIBLE_ITEMS[activeTab] && 
         Object.entries(COLLECTIBLE_ITEMS[activeTab]).map(([itemId, item]) => {
          const isUnlocked = playerCollection[itemId]?.unlocked;
          const isNew = newItems.some(newItem => newItem.itemId === itemId);
          
          return (
            <div
              key={itemId}
              className={`collection-item ${isUnlocked ? 'unlocked' : 'locked'} ${isNew ? 'new' : ''}`}
              onClick={() => setShowItemDetail({ itemId, ...item })}
              style={{ borderColor: isUnlocked ? getRarityColor(item.rarity) : '#ddd' }}
            >
              {/* NEW バッジ */}
              {isNew && <div className="new-badge">NEW!</div>}
              
              {/* アイテムアイコン */}
              <div className="item-icon">
                {isUnlocked ? getItemIcon(itemId) : '❓'}
              </div>
              
              {/* アイテム情報 */}
              <div className="item-info">
                <h4 className="item-name">
                  {isUnlocked ? item.name : '？？？'}
                </h4>
                <div className="item-rarity">
                  {getRarityStars(item.rarity)}
                </div>
                {isUnlocked && (
                  <p className="item-description">{item.description}</p>
                )}
                {!isUnlocked && (
                  <p className="unlock-hint">{item.unlockCondition}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* アイテム詳細モーダル */}
      {showItemDetail && (
        <div className="item-detail-modal">
          <div className="modal-content">
            <h3>{showItemDetail.name}</h3>
            <div 
              className="item-large-icon"
              style={{ color: getRarityColor(showItemDetail.rarity) }}
            >
              {getItemIcon(showItemDetail.itemId)}
            </div>
            <div className="item-rarity-display">
              {getRarityStars(showItemDetail.rarity)} {showItemDetail.rarity.toUpperCase()}
            </div>
            <p className="item-full-description">{showItemDetail.description}</p>
            
            {showItemDetail.effect && (
              <div className="item-effect">
                <h4>効果:</h4>
                <p>{showItemDetail.effect}</p>
              </div>
            )}
            
            {playerCollection[showItemDetail.itemId] && (
              <div className="unlock-info">
                <p>獲得日時: {new Date(playerCollection[showItemDetail.itemId].unlockedAt).toLocaleDateString()}</p>
              </div>
            )}
            
            <button 
              className="close-button"
              onClick={() => setShowItemDetail(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 新アイテム獲得通知 */}
      {newItems.length > 0 && (
        <div className="new-items-notification">
          <h3>🎉 新しいアイテムを獲得しました！</h3>
          <div className="new-items-list">
            {newItems.map(item => (
              <div key={item.itemId} className="new-item">
                <span className="new-item-icon">{getItemIcon(item.itemId)}</span>
                <span className="new-item-name">{item.name}</span>
                <span className="new-item-rarity">{getRarityStars(item.rarity)}</span>
              </div>
            ))}
          </div>
          <button 
            className="dismiss-button"
            onClick={() => setNewItems([])}
          >
            確認
          </button>
        </div>
      )}

      {/* コレクションのヒント */}
      <div className="collection-hints">
        <h4>💡 コレクション獲得のヒント</h4>
        <div className="hints-list">
          <div className="hint-item">
            <span className="hint-icon">🔄</span>
            <span className="hint-text">継続的な参拝で特別なアイテムを獲得</span>
          </div>
          <div className="hint-item">
            <span className="hint-icon">🌙</span>
            <span className="hint-text">満月の夜の参拝で限定アイテム</span>
          </div>
          <div className="hint-item">
            <span className="hint-icon">🎎</span>
            <span className="hint-text">季節イベント参加で装飾アイテム</span>
          </div>
          <div className="hint-item">
            <span className="hint-icon">🏔️</span>
            <span className="hint-text">伝説の神社訪問で神話級アイテム</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// アイテムアイコンの取得
const getItemIcon = (itemId) => {
  const iconMap = {
    golden_torii: '🌟⛩️',
    crystal_lantern: '💎🏮',
    sakura_petals: '🌸',
    autumn_leaves: '🍁',
    dragon_guardian: '🐉',
    sacred_bell: '🔔',
    moon_stone: '🌙',
    fire_charm: '🔥',
    water_blessing: '💧',
    wind_feather: '🪶'
  };
  return iconMap[itemId] || '🎁';
};

export default CollectionSystem;