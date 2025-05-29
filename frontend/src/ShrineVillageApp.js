import React, { useState, useEffect } from 'react';
import soundEffects from './utils/soundEffects';
import { BuildingComponents } from './components/ShrineGraphics';
import { ActivityIconComponents } from './components/ActivityIcons';
import { SakuraParticles, LightParticles } from './components/ParticleEffects';
import CulturalBelt, { getBeltRank } from './components/CulturalBelt';
import ShrineSelector from './components/ShrineSelector';
import GameCanvas from './components/GameCanvas';
import './App.css';
import './ShrineVillage.css';

// 文化活動のカテゴリー
const CULTURAL_ACTIVITIES = {
  shrine: { emoji: '⛩️', name: '神社参拝', exp: 50, building: 'torii' },
  temple: { emoji: '🏛️', name: '寺院参拝', exp: 50, building: 'pagoda' },
  festival: { emoji: '🎋', name: '祭り・伝統行事', exp: 70, building: 'yagura' },
  craft: { emoji: '🎨', name: '伝統工芸体験', exp: 60, building: 'workshop' },
  tea: { emoji: '🍵', name: '茶道・華道', exp: 40, building: 'teahouse' },
  garden: { emoji: '🌸', name: '庭園散策', exp: 30, building: 'garden' },
  history: { emoji: '📜', name: '歴史探訪', exp: 45, building: 'museum' },
  onsen: { emoji: '♨️', name: '温泉文化', exp: 35, building: 'bathhouse' }
};

// 建物のレベルと外観
const BUILDING_LEVELS = {
  torii: ['⛩️', '🏮⛩️', '🏮⛩️🏮', '✨⛩️✨'],
  pagoda: ['🏛️', '🏯', '🏯🌸', '🏯🌸✨'],
  yagura: ['🎪', '🎊🎪', '🎊🎪🎊', '🎆🎪🎆'],
  workshop: ['🏚️', '🏠', '🏡', '🏘️'],
  teahouse: ['🍵', '🏠🍵', '🏡🍵', '🏯🍵'],
  garden: ['🌱', '🌿', '🌸🌿', '🌸🌺🌿'],
  museum: ['📜', '🏛️📜', '🏛️📜🖼️', '🏛️✨📜✨'],
  bathhouse: ['♨️', '🏠♨️', '🏯♨️', '🏯♨️✨']
};

function ShrineVillageApp() {
  const [myShrine, setMyShrine] = useState({
    name: '',
    level: 1,
    buildings: {},
    culturalCapital: 0,
    visitors: 0,
    blessings: 0
  });
  
  const [activities, setActivities] = useState([]);
  const [villageMembers, setVillageMembers] = useState([
    { id: 1, name: '山田さん', shrine: '豊穣神社', level: 5, culturalCapital: 450 },
    { id: 2, name: '鈴木さん', shrine: '学問神社', level: 3, culturalCapital: 280 },
    { id: 3, name: '佐藤さん', shrine: '芸術神社', level: 4, culturalCapital: 380 }
  ]);
  
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityDetails, setActivityDetails] = useState({
    location: '',
    description: '',
    wisdom: '',
    blessing: ''
  });
  
  const [showNotification, setShowNotification] = useState(null);
  const [nftCollection, setNftCollection] = useState([]);
  const [sharedWisdom, setSharedWisdom] = useState([]);
  const [showShrineSetup, setShowShrineSetup] = useState(true);
  const [shrineName, setShrineName] = useState('');
  const [showShrineSelector, setShowShrineSelector] = useState(false);
  const [activeTab, setActiveTab] = useState('shrine'); // New state for tab navigation

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

  const createShrine = (e) => {
    e.preventDefault();
    setMyShrine({
      ...myShrine,
      name: shrineName
    });
    setShowShrineSetup(false);
    showTemporaryNotification(`⛩️ ${shrineName}が創建されました！`);
    playSound('achievement');
  };

  const handleActivitySubmit = (e) => {
    e.preventDefault();
    
    const activity = CULTURAL_ACTIVITIES[selectedActivity];
    const timestamp = Date.now();
    
    // NFTとして文化活動を記録
    const newNFT = {
      id: timestamp,
      type: selectedActivity,
      activity: activity.name,
      location: activityDetails.location,
      description: activityDetails.description,
      wisdom: activityDetails.wisdom,
      blessing: activityDetails.blessing,
      date: new Date().toLocaleDateString('ja-JP'),
      emoji: activity.emoji,
      exp: activity.exp,
      tokenId: `SHRINE-${timestamp}`,
      owner: myShrine.name
    };

    setNftCollection([...nftCollection, newNFT]);
    
    // 建物をアップグレード
    const buildingType = activity.building;
    const currentLevel = myShrine.buildings[buildingType] || 0;
    const newLevel = Math.min(currentLevel + 1, BUILDING_LEVELS[buildingType].length - 1);
    
    setMyShrine(prev => ({
      ...prev,
      buildings: {
        ...prev.buildings,
        [buildingType]: newLevel
      },
      culturalCapital: prev.culturalCapital + activity.exp,
      level: Math.floor((prev.culturalCapital + activity.exp) / 100) + 1,
      blessings: prev.blessings + 1
    }));

    // 知恵を共有プールに追加
    if (activityDetails.wisdom) {
      setSharedWisdom([...sharedWisdom, {
        id: timestamp,
        wisdom: activityDetails.wisdom,
        author: myShrine.name,
        activity: activity.name,
        likes: 0
      }]);
    }

    showTemporaryNotification(`⛩️ ${activity.name}を記録しました！`);
    playSound('treeGrow');
    
    setShowActivityModal(false);
    setActivityDetails({ location: '', description: '', wisdom: '', blessing: '' });
    setSelectedActivity(null);
  };

  const visitFriendShrine = (friend) => {
    setMyShrine(prev => ({
      ...prev,
      visitors: prev.visitors + 1
    }));
    showTemporaryNotification(`🎋 ${friend.name}の${friend.shrine}を訪問しました！`);
    playSound('complete');
  };

  const handleShrineVisit = (visitData) => {
    const { shrine, experience, timestamp } = visitData;
    const activity = shrine.type === 'shrine' ? CULTURAL_ACTIVITIES.shrine : CULTURAL_ACTIVITIES.temple;
    const buildingType = shrine.type === 'shrine' ? 'torii' : 'pagoda';
    
    // 建物のレベルアップ
    const currentLevel = myShrine.buildings[buildingType] || 0;
    const newLevel = Math.min(currentLevel + 1, 3);
    
    setMyShrine(prev => ({
      ...prev,
      buildings: {
        ...prev.buildings,
        [buildingType]: newLevel
      },
      culturalCapital: prev.culturalCapital + experience,
      level: Math.floor((prev.culturalCapital + experience) / 100) + 1,
      blessings: prev.blessings + 1
    }));

    // NFTとして記録
    setNftCollection(prev => [...prev, {
      id: timestamp,
      type: shrine.type,
      name: shrine.name,
      location: `${shrine.city}, ${shrine.prefecture}`,
      description: shrine.description,
      rarity: shrine.rarity,
      culturalValue: shrine.culturalValue,
      experience: experience,
      timestamp: timestamp,
      deity: shrine.deity || shrine.sect,
      benefits: shrine.benefits
    }]);

    showTemporaryNotification(`⛩️ ${shrine.name}への参拝を記録しました！ +${experience} 文化資本`);
    playSound('treeGrow');
  };

  const renderShrine = () => {
    return Object.entries(myShrine.buildings).map(([type, level]) => {
      const BuildingComponent = BuildingComponents[type];
      if (!BuildingComponent) return null;
      
      return (
        <div key={type} className="building">
          <BuildingComponent level={level + 1} size={120} />
        </div>
      );
    });
  };

  if (showShrineSetup) {
    return (
      <div className="App shrine-village">
        <div className="shrine-setup">
          <h1>⛩️ あなたの神社を創建しよう</h1>
          <form onSubmit={createShrine}>
            <input
              type="text"
              placeholder="神社の名前を入力（例：文化神社）"
              value={shrineName}
              onChange={(e) => setShrineName(e.target.value)}
              required
            />
            <button type="submit">創建する</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="App shrine-village">
      {/* パーティクルエフェクト */}
      <SakuraParticles count={15} />
      <LightParticles color="#FFD700" />
      
      <header className="App-header">
        <div className="village-header">
          <h1>⛩️ {myShrine.name}</h1>
          <div className="shrine-stats">
            <span>🏛️ レベル {myShrine.level}</span>
            <span>📚 文化資本 {myShrine.culturalCapital}</span>
            <span>🙏 ご利益 {myShrine.blessings}</span>
            <span>👥 参拝者 {myShrine.visitors}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'shrine' ? 'active' : ''}`}
            onClick={() => setActiveTab('shrine')}
          >
            ⛩️ 神社村
          </button>
          <button 
            className={`tab-button ${activeTab === 'game' ? 'active' : ''}`}
            onClick={() => setActiveTab('game')}
          >
            🎮 文化探索ゲーム
          </button>
        </div>

        {showNotification && (
          <div className="notification">
            {showNotification}
          </div>
        )}

        {/* 文化帯ランク */}
        <CulturalBelt culturalCapital={myShrine.culturalCapital} />

        {/* Tab Content */}
        {activeTab === 'shrine' ? (
          <>
            {/* 自分の神社エリア */}
            <div className="my-shrine-area">
              <h2>あなたの神社</h2>
              <div className="shrine-view">
                {renderShrine()}
                {Object.keys(myShrine.buildings).length === 0 && (
                  <p>文化活動を記録して神社を発展させましょう</p>
                )}
              </div>
            </div>

        {/* 文化活動記録ボタン */}
        <div className="activity-section">
          <h2>文化活動を記録</h2>
          
          {/* 神社・寺院データベースから選択 */}
          <div className="special-activity-section">
            <button
              className="shrine-database-btn"
              onClick={() => {
                setShowShrineSelector(true);
                playSound('click');
              }}
            >
              <div className="shrine-db-icon">⛩️🏛️</div>
              <span className="shrine-db-name">神社・寺院データベースから選択</span>
              <span className="shrine-db-desc">実在する神社・寺院への参拝を記録</span>
            </button>
          </div>

          <div className="activity-grid">
            {Object.entries(CULTURAL_ACTIVITIES).map(([key, activity]) => {
              const IconComponent = ActivityIconComponents[key];
              return (
                <button
                  key={key}
                  className="activity-btn"
                  onClick={() => {
                    setSelectedActivity(key);
                    setShowActivityModal(true);
                    playSound('click');
                  }}
                >
                  <div className="activity-icon">
                    {IconComponent ? <IconComponent size={60} /> : <span className="activity-emoji">{activity.emoji}</span>}
                  </div>
                  <span className="activity-name">{activity.name}</span>
                  <span className="activity-exp">+{activity.exp} 文化資本</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 村のメンバー */}
        <div className="village-section">
          <h2>🏘️ 文化村のメンバー</h2>
          <div className="village-grid">
            {villageMembers.map((member) => {
              const beltRank = getBeltRank(member.culturalCapital);
              return (
                <div key={member.id} className="member-card">
                  <h3>{member.shrine}</h3>
                  <p>管理者: {member.name}</p>
                  <div className="member-belt-info">
                    <div 
                      className="mini-belt"
                      style={{ 
                        background: beltRank.gradient,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        fontWeight: 'bold',
                        color: beltRank.level >= 8 ? '#fff' : '#333',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    >
                      {beltRank.name}
                    </div>
                  </div>
                  <p>レベル: {member.level}</p>
                  <p>文化資本: {member.culturalCapital}</p>
                  <button onClick={() => visitFriendShrine(member)}>
                    参拝する
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 共有された知恵 */}
        <div className="wisdom-section">
          <h2>📜 共有された知恵</h2>
          {sharedWisdom.length === 0 ? (
            <p>まだ知恵が共有されていません</p>
          ) : (
            <div className="wisdom-list">
              {sharedWisdom.map((item) => (
                <div key={item.id} className="wisdom-card">
                  <p className="wisdom-text">"{item.wisdom}"</p>
                  <div className="wisdom-meta">
                    <span>{item.author}</span>
                    <span>{item.activity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NFTコレクション */}
        <div className="nft-section">
          <h2>🎋 文化活動NFTコレクション</h2>
          {nftCollection.length === 0 ? (
            <p>まだ記録がありません</p>
          ) : (
            <div className="nft-grid">
              {nftCollection.map((nft) => (
                <div key={nft.id} className="nft-card">
                  <div className="nft-header">
                    <span className="nft-emoji">{nft.emoji}</span>
                    <span className="nft-id">#{nft.tokenId}</span>
                  </div>
                  <h4>{nft.activity}</h4>
                  <p>📍 {nft.location}</p>
                  <p>{nft.description}</p>
                  {nft.wisdom && (
                    <div className="nft-wisdom">
                      <span>📜</span>
                      <p>{nft.wisdom}</p>
                    </div>
                  )}
                  {nft.blessing && (
                    <div className="nft-blessing">
                      <span>🙏</span>
                      <p>{nft.blessing}</p>
                    </div>
                  )}
                  <div className="nft-footer">
                    <span>{nft.date}</span>
                    <span>+{nft.exp} 文化資本</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
          </>
        ) : (
          /* Game Tab Content */
          <div className="game-container">
            <GameCanvas 
              playerProfile={{
                name: myShrine.name,
                culturalCapital: myShrine.culturalCapital,
                level: myShrine.level,
                blessings: myShrine.blessings
              }}
              onCulturalActivity={(activityData) => {
                // Handle cultural activities from the game
                setMyShrine(prev => ({
                  ...prev,
                  culturalCapital: prev.culturalCapital + (activityData.exp || 10),
                  blessings: prev.blessings + 1
                }));
                showTemporaryNotification(`⛩️ ${activityData.message || '文化活動を完了しました！'}`);
                playSound('complete');
              }}
            />
          </div>
        )}

        {/* 文化活動入力モーダル */}
        {showActivityModal && (
          <div className="modal-overlay" onClick={() => setShowActivityModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{CULTURAL_ACTIVITIES[selectedActivity]?.emoji} {CULTURAL_ACTIVITIES[selectedActivity]?.name}</h2>
              <form onSubmit={handleActivitySubmit}>
                <input
                  type="text"
                  placeholder="場所（例：明治神宮）"
                  value={activityDetails.location}
                  onChange={(e) => setActivityDetails({...activityDetails, location: e.target.value})}
                  required
                />
                <textarea
                  placeholder="体験の詳細"
                  value={activityDetails.description}
                  onChange={(e) => setActivityDetails({...activityDetails, description: e.target.value})}
                  rows={3}
                  required
                />
                <textarea
                  placeholder="得た知恵・学び（村で共有されます）"
                  value={activityDetails.wisdom}
                  onChange={(e) => setActivityDetails({...activityDetails, wisdom: e.target.value})}
                  rows={2}
                />
                <input
                  type="text"
                  placeholder="願い事・祈り（オプション）"
                  value={activityDetails.blessing}
                  onChange={(e) => setActivityDetails({...activityDetails, blessing: e.target.value})}
                />
                <div className="modal-actions">
                  <button type="submit">NFTとして記録</button>
                  <button type="button" onClick={() => setShowActivityModal(false)}>キャンセル</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 神社・寺院選択モーダル */}
        {showShrineSelector && (
          <ShrineSelector
            onShrineSelect={handleShrineVisit}
            onClose={() => setShowShrineSelector(false)}
          />
        )}
      </header>
    </div>
  );
}

export default ShrineVillageApp;