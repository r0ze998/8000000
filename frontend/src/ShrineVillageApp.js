import React, { useState, useEffect } from 'react';
import soundEffects from './utils/soundEffects';
import { SakuraParticles, LightParticles } from './components/ParticleEffects';
import CulturalBelt from './components/CulturalBelt';
import ShrineSelector from './components/ShrineSelector';
import GameCanvas from './components/GameCanvas';
import VisitVerification from './components/VisitVerification';
import ShrineSetup from './components/ShrineSetup';
import ShrineView from './components/ShrineView';
import ActivityButtons from './components/ActivityButtons';
import ActivityModal from './components/ActivityModal';
import NFTCollection from './components/NFTCollection';
import VillageMembersSection from './components/VillageMembersSection';

// Hooks
import { useShrine } from './hooks/useShrine';
import { useNotification } from './hooks/useNotification';

// Constants
import { CULTURAL_ACTIVITIES } from './constants/culturalActivities';

// Styles
import './App.css';
import './ShrineVillage.css';

function ShrineVillageApp() {
  // カスタムフック使用
  const {
    shrine: myShrine,
    showShrineSetup,
    createShrine,
    updateBuilding,
    addCulturalCapital,
    addBlessings
  } = useShrine();
  
  const { notification: showNotification, showNotification: showTemporaryNotification } = useNotification();
  
  // UI状態
  const [activeTab, setActiveTab] = useState('shrine');
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showShrineSelector, setShowShrineSelector] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [selectedShrineForVerification, setSelectedShrineForVerification] = useState(null);
  
  // データ状態
  const [nftCollection, setNftCollection] = useState([]);
  const [villageMembers] = useState([
    { id: 1, name: '山田さん', shrine: '豊穣神社', level: 5, culturalCapital: 450 },
    { id: 2, name: '鈴木さん', shrine: '学問神社', level: 3, culturalCapital: 280 },
    { id: 3, name: '佐藤さん', shrine: '芸術神社', level: 4, culturalCapital: 380 }
  ]);
  
  // プレイヤープロファイル（ゲーム用）
  const [playerProfile] = useState({
    name: '文化探求者',
    level: 1,
    culturalCapital: 100,
    beltColor: '#FFFFFF'
  });

  useEffect(() => {
    soundEffects.init();
  }, []);

  // ハンドラー関数
  const handleActivitySelect = (activityKey) => {
    setSelectedActivity(activityKey);
    setShowActivityModal(true);
  };

  const handleActivitySubmit = (activityKey, details) => {
    const activity = CULTURAL_ACTIVITIES[activityKey];
    
    // 建物のレベルアップ
    const currentLevel = myShrine.buildings[activity.building] || 0;
    const newLevel = Math.min(currentLevel + 1, 3);
    updateBuilding(activity.building, newLevel);
    
    // 文化資本とご利益を追加
    addCulturalCapital(activity.exp);
    addBlessings(10);
    
    // NFTとして記録
    setNftCollection(prev => [...prev, {
      id: Date.now(),
      ...activity,
      ...details,
      timestamp: new Date().toISOString()
    }]);
    
    showTemporaryNotification(`✨ ${activity.name}を記録しました！ +${activity.exp} 文化資本`);
    soundEffects.play('treeGrow');
    
    setShowActivityModal(false);
    setSelectedActivity(null);
  };

  const handleShrineVisit = (shrine) => {
    setSelectedShrineForVerification(shrine);
    setShowVerification(true);
    setShowShrineSelector(false);
  };

  const handleVerificationComplete = (verificationData) => {
    const shrine = selectedShrineForVerification;
    const experience = 50;
    const buildingType = shrine.type === 'shrine' ? 'torii' : 'pagoda';
    
    // 建物のレベルアップ
    const currentLevel = myShrine.buildings[buildingType] || 0;
    const newLevel = Math.min(currentLevel + 1, 3);
    updateBuilding(buildingType, newLevel);
    
    // 文化資本とご利益を追加
    addCulturalCapital(experience);
    addBlessings(1);
    
    // NFTとして記録
    setNftCollection(prev => [...prev, {
      id: verificationData.timestamp,
      type: shrine.type,
      name: shrine.name,
      verificationMethod: verificationData.method,
      verificationData: verificationData,
      location: `${shrine.city}, ${shrine.prefecture}`,
      description: shrine.description,
      rarity: shrine.rarity,
      culturalValue: shrine.culturalValue,
      experience: experience,
      timestamp: verificationData.timestamp,
      deity: shrine.deity || shrine.sect,
      benefits: shrine.benefits
    }]);

    showTemporaryNotification(`⛩️ ${shrine.name}への参拝を記録しました！ +${experience} 文化資本`);
    soundEffects.play('treeGrow');
    
    setShowVerification(false);
    setSelectedShrineForVerification(null);
  };

  const handleVisitFriend = (friend) => {
    addCulturalCapital(20);
    showTemporaryNotification(`🎋 ${friend.name}の${friend.shrine}を訪問しました！`);
    soundEffects.play('complete');
  };

  const handleGameActivity = (activityData) => {
    const { type, culturalCapital } = activityData;
    addCulturalCapital(culturalCapital);
    showTemporaryNotification(`🎮 ${type}で +${culturalCapital} 文化資本を獲得！`);
  };

  // セットアップ画面
  if (showShrineSetup) {
    return (
      <div className="App shrine-village">
        <ShrineSetup onCreateShrine={createShrine} />
      </div>
    );
  }

  // メイン画面
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

        {/* タブナビゲーション */}
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

        {/* 通知 */}
        {showNotification && (
          <div className="notification">
            {showNotification}
          </div>
        )}

        {/* 文化帯ランク */}
        <CulturalBelt culturalCapital={myShrine.culturalCapital} />

        {/* タブコンテンツ */}
        {activeTab === 'shrine' ? (
          <>
            {/* 神社ビュー */}
            <div className="my-shrine-area">
              <h2>あなたの神社</h2>
              <ShrineView buildings={myShrine.buildings} />
            </div>

            {/* 文化活動ボタン */}
            <ActivityButtons
              onActivitySelect={handleActivitySelect}
              onShrineSelect={() => setShowShrineSelector(true)}
            />

            {/* NFTコレクション */}
            <NFTCollection collection={nftCollection} />

            {/* 村のメンバー */}
            <VillageMembersSection
              members={villageMembers}
              playerShrine={myShrine}
              onVisitFriend={handleVisitFriend}
            />
          </>
        ) : (
          // ゲームタブ
          <GameCanvas 
            userProfile={playerProfile}
            onCulturalActivity={handleGameActivity}
          />
        )}

        {/* モーダル */}
        {showActivityModal && (
          <ActivityModal
            activity={selectedActivity}
            onClose={() => {
              setShowActivityModal(false);
              setSelectedActivity(null);
            }}
            onSubmit={handleActivitySubmit}
          />
        )}

        {/* 神社選択モーダル */}
        {showShrineSelector && (
          <ShrineSelector
            onShrineSelect={handleShrineVisit}
            onClose={() => setShowShrineSelector(false)}
          />
        )}

        {/* 参拝証明モーダル */}
        {showVerification && selectedShrineForVerification && (
          <VisitVerification
            shrine={selectedShrineForVerification}
            onVerified={handleVerificationComplete}
            onCancel={() => {
              setShowVerification(false);
              setSelectedShrineForVerification(null);
            }}
          />
        )}
      </header>
    </div>
  );
}

export default ShrineVillageApp;