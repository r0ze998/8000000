import React, { useState, useEffect } from 'react';
import ForestView from './ForestView';
import AchievementBadges from './AchievementBadges';
import soundEffects from './utils/soundEffects';
import './App.css';
import './CulturalForest.css';

// 文化活動のカテゴリー
const CULTURAL_ACTIVITIES = {
  museum: { emoji: '🖼️', name: '美術館・博物館', exp: 50, nftType: 'art' },
  reading: { emoji: '📚', name: '読書', exp: 30, nftType: 'literature' },
  music: { emoji: '🎵', name: '音楽鑑賞・演奏', exp: 40, nftType: 'music' },
  theater: { emoji: '🎭', name: '演劇・映画', exp: 45, nftType: 'performance' },
  create: { emoji: '🎨', name: '創作活動', exp: 60, nftType: 'creation' },
  temple: { emoji: '⛩️', name: '神社仏閣・歴史', exp: 35, nftType: 'heritage' },
  travel: { emoji: '🗾', name: '文化的旅行', exp: 70, nftType: 'journey' },
  tea: { emoji: '🍵', name: '茶道・華道', exp: 40, nftType: 'tradition' }
};

// 特別な木のタイプ（文化活動に応じて）
const CULTURAL_TREES = {
  art: { emoji: '🎨', name: '芸術の木' },
  literature: { emoji: '📖', name: '文学の木' },
  music: { emoji: '🎼', name: '音楽の木' },
  performance: { emoji: '🎭', name: '演劇の木' },
  creation: { emoji: '✨', name: '創造の木' },
  heritage: { emoji: '⛩️', name: '伝統の木' },
  journey: { emoji: '🗾', name: '旅の木' },
  tradition: { emoji: '🍵', name: '礼の木' }
};

function CulturalForestApp() {
  const [culturalActivities, setCulturalActivities] = useState([]);
  const [userStats, setUserStats] = useState({ 
    trees: 0, 
    culturalCapital: 0,
    inspirationPoints: 0,
    nftCount: 0 
  });
  const [gameStats, setGameStats] = useState({ 
    level: 1, 
    experience: 0, 
    forestSize: 25,
    culturalLevel: '文化初心者' 
  });
  const [specialTrees, setSpecialTrees] = useState({});
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityDetails, setActivityDetails] = useState({
    title: '',
    location: '',
    description: '',
    inspiration: ''
  });
  const [showNotification, setShowNotification] = useState(null);
  const [nftGallery, setNftGallery] = useState([]);

  useEffect(() => {
    soundEffects.init();
  }, []);

  const showTemporaryNotification = (message) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(null), 3000);
  };

  const playSound = (type) => {
    soundEffects.playSound(type);
  };

  const calculateCulturalLevel = (capital) => {
    if (capital < 100) return '文化初心者';
    if (capital < 300) return '文化愛好家';
    if (capital < 600) return '文化通';
    if (capital < 1000) return '文化人';
    if (capital < 2000) return '文化の守護者';
    return '文化の賢者';
  };

  const handleActivitySubmit = (e) => {
    e.preventDefault();
    
    const activity = CULTURAL_ACTIVITIES[selectedActivity];
    const newNFT = {
      id: Date.now(),
      type: activity.nftType,
      activity: activity.name,
      title: activityDetails.title,
      location: activityDetails.location,
      description: activityDetails.description,
      inspiration: activityDetails.inspiration,
      date: new Date().toLocaleDateString('ja-JP'),
      emoji: activity.emoji,
      rarity: Math.random() > 0.8 ? 'rare' : 'common'
    };

    // NFTとして記録
    setNftGallery([...nftGallery, newNFT]);
    
    // 文化活動を追加
    setCulturalActivities([...culturalActivities, {
      ...newNFT,
      exp: activity.exp
    }]);

    // 統計を更新
    setUserStats(prev => ({
      ...prev,
      culturalCapital: prev.culturalCapital + activity.exp,
      inspirationPoints: prev.inspirationPoints + (newNFT.rarity === 'rare' ? 20 : 10),
      nftCount: prev.nftCount + 1,
      trees: prev.trees + 1
    }));

    // 経験値とレベルを更新
    setGameStats(prev => {
      const newExp = prev.experience + activity.exp;
      const newLevel = Math.floor(newExp / 100) + 1;
      const newCapital = prev.culturalCapital || 0 + activity.exp;
      
      return {
        ...prev,
        experience: newExp,
        level: newLevel,
        forestSize: 25 + (newLevel - 1) * 10,
        culturalLevel: calculateCulturalLevel(newCapital)
      };
    });

    // 特別な木を追加
    setSpecialTrees(prev => ({
      ...prev,
      [activity.nftType]: (prev[activity.nftType] || 0) + 1
    }));

    showTemporaryNotification(`🎨 ${activity.name}をNFTとして記録しました！`);
    playSound('achievement');
    
    // モーダルを閉じる
    setShowActivityModal(false);
    setActivityDetails({ title: '', location: '', description: '', inspiration: '' });
    setSelectedActivity(null);
  };

  return (
    <div className="App cultural-forest">
      <header className="App-header">
        <div className="cultural-header">
          <h1>🎨 Cultural Forest - 文化資本の森</h1>
          <div className="header-stats">
            <span>📚 文化資本: {userStats.culturalCapital}</span>
            <span>✨ インスピレーション: {userStats.inspirationPoints}</span>
            <span>🖼️ NFT: {userStats.nftCount}</span>
          </div>
        </div>

        {showNotification && (
          <div className="notification">
            {showNotification}
          </div>
        )}

        <div className="cultural-status">
          <div className="status-card">
            <h3>🎭 {gameStats.culturalLevel}</h3>
            <p>レベル {gameStats.level} - {gameStats.experience} EXP</p>
          </div>
        </div>

        <ForestView 
          trees={userStats.trees}
          level={gameStats.level}
          forestSize={gameStats.forestSize}
          specialTrees={specialTrees}
        />

        {/* 文化活動記録ボタン */}
        <div className="activity-buttons">
          <h2>今日の文化活動を記録</h2>
          <div className="activity-grid">
            {Object.entries(CULTURAL_ACTIVITIES).map(([key, activity]) => (
              <button
                key={key}
                className="activity-btn"
                onClick={() => {
                  setSelectedActivity(key);
                  setShowActivityModal(true);
                  playSound('click');
                }}
              >
                <span className="activity-emoji">{activity.emoji}</span>
                <span className="activity-name">{activity.name}</span>
                <span className="activity-exp">+{activity.exp} EXP</span>
              </button>
            ))}
          </div>
        </div>

        {/* NFTギャラリー */}
        <div className="nft-gallery">
          <h2>🖼️ あなたの文化NFTコレクション</h2>
          {nftGallery.length === 0 ? (
            <p>まだ文化活動が記録されていません</p>
          ) : (
            <div className="nft-grid">
              {nftGallery.map((nft) => (
                <div key={nft.id} className={`nft-card ${nft.rarity}`}>
                  <div className="nft-header">
                    <span className="nft-emoji">{nft.emoji}</span>
                    <span className="nft-date">{nft.date}</span>
                  </div>
                  <h4>{nft.title}</h4>
                  <p className="nft-location">📍 {nft.location}</p>
                  <p className="nft-description">{nft.description}</p>
                  <div className="nft-inspiration">
                    <span>💡</span>
                    <p>{nft.inspiration}</p>
                  </div>
                  {nft.rarity === 'rare' && (
                    <div className="rarity-badge">✨ レア</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 文化活動入力モーダル */}
        {showActivityModal && (
          <div className="modal-overlay" onClick={() => setShowActivityModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{CULTURAL_ACTIVITIES[selectedActivity]?.emoji} {CULTURAL_ACTIVITIES[selectedActivity]?.name}</h2>
              <form onSubmit={handleActivitySubmit}>
                <input
                  type="text"
                  placeholder="タイトル（例：モネ展）"
                  value={activityDetails.title}
                  onChange={(e) => setActivityDetails({...activityDetails, title: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="場所（例：国立西洋美術館）"
                  value={activityDetails.location}
                  onChange={(e) => setActivityDetails({...activityDetails, location: e.target.value})}
                  required
                />
                <textarea
                  placeholder="体験の説明"
                  value={activityDetails.description}
                  onChange={(e) => setActivityDetails({...activityDetails, description: e.target.value})}
                  rows={3}
                  required
                />
                <textarea
                  placeholder="得たインスピレーション"
                  value={activityDetails.inspiration}
                  onChange={(e) => setActivityDetails({...activityDetails, inspiration: e.target.value})}
                  rows={2}
                  required
                />
                <div className="modal-actions">
                  <button type="submit">NFTとして記録</button>
                  <button type="button" onClick={() => setShowActivityModal(false)}>キャンセル</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ブロックチェーン特有の機能説明 */}
        <div className="blockchain-features">
          <h3>⛓️ ブロックチェーンだからできること</h3>
          <div className="feature-grid">
            <div className="feature-card">
              <span>🏛️</span>
              <h4>文化活動の永続的記録</h4>
              <p>あなたの文化体験がNFTとして永久に記録されます</p>
            </div>
            <div className="feature-card">
              <span>🤝</span>
              <h4>文化体験の共有と交換</h4>
              <p>他のユーザーと文化体験NFTを交換できます</p>
            </div>
            <div className="feature-card">
              <span>🎖️</span>
              <h4>文化貢献の証明</h4>
              <p>文化施設への訪問証明として使用可能</p>
            </div>
            <div className="feature-card">
              <span>💎</span>
              <h4>レアな体験の価値化</h4>
              <p>特別な文化体験はレアNFTとして価値を持ちます</p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default CulturalForestApp;