import React, { useState, useEffect } from 'react';
import soundEffects from './utils/soundEffects';
import { SakuraParticles, LightParticles } from './components/ParticleEffects';
import CulturalBelt from './components/CulturalBelt';
import ShrineSelector from './components/ShrineSelector';
import VisitVerification from './components/VisitVerification';
import ShrineSetup from './components/ShrineSetup';
import ActivityModal from './components/ActivityModal';
import SimpleAudioToggle from './components/SimpleAudioToggle';
import WalletConnection from './components/WalletConnection';
import AccountStatus from './components/AccountStatus';
import PlayerStatus from './components/PlayerStatus';
import SeasonalEffects from './components/SeasonalEffects';
import BottomNavigation from './components/BottomNavigation';
import PrivacyInfo from './components/PrivacyInfo';
import HomeTab from './components/HomeTab';
import VisitTab from './components/VisitTab';
import ExploreTab from './components/ExploreTab';
import LearnTab from './components/LearnTab';
import ProfileTab from './components/ProfileTab';
import BGMController from './components/BGMController';
import BGMManager from './components/BGMManager';

// Services
import nftMintingService from './services/nftMinting';
import { drawOmikuji } from './data/omikujiDatabase';

// Hooks
import { useShrine } from './hooks/useShrine';
import { useNotification } from './hooks/useNotification';

// Constants
import { CULTURAL_ACTIVITIES } from './constants/culturalActivities';

// Styles
import './App.css';
import './ShrineVillage.css';
import './components/VisitTab.css';

function ShrineVillageApp() {
  // カスタムフック
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
  const [activeTab, setActiveTab] = useState('home');
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showShrineSelector, setShowShrineSelector] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [selectedShrineForVerification, setSelectedShrineForVerification] = useState(null);
  
  // データ状態
  const [nftCollection, setNftCollection] = useState([]);
  const [recentVisits, setRecentVisits] = useState([
    {
      shrine: { name: '明治神宮' },
      timestamp: new Date().toISOString(),
      verificationMethod: 'photo',
      photo: null
    },
    {
      shrine: { name: '伏見稲荷大社' },
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      verificationMethod: 'gps',
      photo: null
    }
  ]);
  
  // プレイヤープロファイル
  const [playerProfile, setPlayerProfile] = useState({
    name: '文化探求者',
    level: 1,
    experience: 0,
    nextLevelExp: 100,
    title: '初詣参拝者',
    rank: '白帯',
    culturalCapital: 100,
    beltColor: '#FFFFFF',
    stats: {
      totalVisits: 0,
      consecutiveDays: 0,
      uniqueShrines: 0
    }
  });

  // ゲーミフィケーション状態
  const [goshuinchoPage, setGoshuinchoPage] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [achievements] = useState({});
  const [drawnOmikuji, setDrawnOmikuji] = useState([]);
  const [activeQuests, setActiveQuests] = useState([
    {
      id: 'beginner-1',
      title: '初めての参拝',
      description: '神社を1箇所訪れて参拝しましょう',
      progress: 0,
      target: 1,
      reward: { experience: 100, culturalCapital: 50 },
      completed: false
    },
    {
      id: 'explorer-1',
      title: '神社探検家',
      description: '3つの異なる神社を訪れましょう',
      progress: 0,
      target: 3,
      reward: { experience: 300, culturalCapital: 150 },
      completed: false
    }
  ]);

  const [playerStats, setPlayerStats] = useState({
    consecutiveVisits: 0,
    fullMoonVisits: 0,
    legendaryShrineSVisits: 0
  });

  // エフェクト
  useEffect(() => {
    soundEffects.init();
  }, []);

  const handleTabChange = (newTab) => {
    console.log(`Tab change from ${activeTab} to ${newTab}`);
    setActiveTab(newTab);
  };

  // タブコンテンツのレンダリング
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeTab
            userProfile={playerProfile}
            userLocation={{ lat: 35.6762, lng: 139.6503 }}
            onShrineSelect={(shrine) => {
              setSelectedShrineForVerification(shrine);
              setShowShrineSelector(true);
            }}
            onActivityStart={(activity, data) => {
              if (activity === 'camera_scan') {
                setShowShrineSelector(true);
              } else if (activity === 'learning') {
                setActiveTab('learn');
              } else if (activity === 'map_explore') {
                setActiveTab('explore');
              } else if (activity === 'community') {
                setActiveTab('profile');
              }
            }}
            onEventJoin={(event) => {
              showTemporaryNotification(`🎉 ${event.name}に参加申込みしました！`);
              soundEffects.playSound('bell');
            }}
          />
        );
      
      case 'explore':
        return (
          <ExploreTab
            userLocation={{ lat: 35.6762, lng: 139.6503 }}
            userProfile={playerProfile}
            soundEffects={soundEffects}
            showTemporaryNotification={showTemporaryNotification}
            updatePlayerExperience={updatePlayerExperience}
            onShrineSelect={(shrine) => {
              setSelectedShrineForVerification(shrine);
              setShowShrineSelector(true);
            }}
            onEventJoin={(eventId) => {
              showTemporaryNotification(`🎉 イベントに参加申込みしました！`);
              soundEffects.playSound('bell');
              updatePlayerStats('eventsJoined');
            }}
          />
        );
      
      case 'visit':
        return (
          <VisitTab
            onShrineSelect={() => setShowShrineSelector(true)}
            recentVisits={recentVisits}
            playerProfile={playerProfile}
            drawnOmikuji={drawnOmikuji}
            onOmikujiDrawn={(omikuji) => {
              setDrawnOmikuji(prev => [...prev, {
                ...omikuji,
                timestamp: new Date().toISOString()
              }]);
            }}
            soundEffects={soundEffects}
            showTemporaryNotification={showTemporaryNotification}
            updatePlayerExperience={updatePlayerExperience}
            unlockAchievement={unlockAchievement}
            updatePlayerStats={updatePlayerStats}
          />
        );
      
      case 'learn':
        return (
          <LearnTab
            userProfile={playerProfile}
            soundEffects={soundEffects}
            showTemporaryNotification={showTemporaryNotification}
            updatePlayerExperience={updatePlayerExperience}
            unlockAchievement={unlockAchievement}
          />
        );
      
      case 'profile':
        return (
          <ProfileTab
            userProfile={playerProfile}
            playerStats={playerStats}
            achievements={achievements}
            nftCollection={nftCollection}
            drawnOmikuji={drawnOmikuji}
            recentVisits={recentVisits}
            myShrine={myShrine}
            soundEffects={soundEffects}
            showTemporaryNotification={showTemporaryNotification}
            onShareProfile={() => {
              console.log('プロフィールを共有');
            }}
            onExportData={() => {
              console.log('データをエクスポート');
            }}
          />
        );
      
      default:
        return null;
    }
  };

  // ヘルパー関数
  const updatePlayerExperience = (exp) => {
    setPlayerProfile(prev => {
      const newExp = prev.experience + exp;
      const newLevel = Math.floor(newExp / 100) + 1;
      
      if (newLevel > prev.level) {
        showTemporaryNotification(`🎉 レベルアップ！レベル ${newLevel} に到達しました！`);
        soundEffects.playSound('levelUp');
      }
      
      return {
        ...prev,
        experience: newExp,
        level: newLevel,
        nextLevelExp: newLevel * 100
      };
    });
  };

  const updatePlayerStats = (statKey) => {
    setPlayerStats(prev => ({
      ...prev,
      [statKey]: (prev[statKey] || 0) + 1
    }));
  };

  const unlockAchievement = (achievementId, achievementName) => {
    if (!unlockedAchievements.includes(achievementId)) {
      setUnlockedAchievements(prev => [...prev, achievementId]);
      showTemporaryNotification(`🏆 実績解除: ${achievementName}`);
      soundEffects.playSound('achievement');
    }
  };

  const handleActivitySubmit = async (activityData) => {
    if (activityData.verificationData) {
      await handleVerifiedActivity(selectedActivity, activityData);
    } else {
      await handleNormalActivity(selectedActivity, activityData);
    }
  };

  const handleNormalActivity = async (activityKey, details) => {
    const activity = CULTURAL_ACTIVITIES[activityKey];
    
    updatePlayerExperience(activity.baseExperience);
    addCulturalCapital(activity.culturalValue);
    addBlessings(10);
    
    showTemporaryNotification(`🎯 ${activity.name}を完了しました！ +${activity.baseExperience} EXP`);
    soundEffects.playSound('complete');
    
    setShowActivityModal(false);
    setSelectedActivity(null);
  };

  const handleVerifiedActivity = async (activityKey, details) => {
    const activity = CULTURAL_ACTIVITIES[activityKey];
    
    try {
      showTemporaryNotification('🔄 NFTを生成中...');
      
      const nftMetadata = nftMintingService.generateNFTMetadata(details.verificationData);
      const mintResult = await nftMintingService.mintNFT(nftMetadata, 'user-address');
      
      if (mintResult.success) {
        setNftCollection(prev => [...prev, mintResult.nft]);
        showTemporaryNotification('✨ NFTが生成されました！');
      }
      
      const experienceGain = activity.baseExperience * 2;
      updatePlayerExperience(experienceGain);
      
      const culturalValue = activity.culturalValue * 2;
      addCulturalCapital(culturalValue);
      addBlessings(20);
      
      setPlayerStats(prev => ({
        ...prev,
        consecutiveVisits: prev.consecutiveVisits + 1,
        fullMoonVisits: prev.fullMoonVisits + (isFullMoon() ? 1 : 0),
        legendaryShrineSVisits: prev.legendaryShrineSVisits + (activity.legendary ? 1 : 0)
      }));
      
      soundEffects.playSound('achievement');
      showTemporaryNotification(`🎊 認証済み参拝完了！ +${experienceGain} EXP, +${culturalValue} 文化資本`);
      
    } catch (error) {
      console.error('NFT生成エラー:', error);
      showTemporaryNotification('❌ NFT生成に失敗しました。もう一度お試しください。');
    } finally {
      setShowActivityModal(false);
      setSelectedActivity(null);
    }
  };

  const isFullMoon = () => {
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();
    if ((month === 0 && day === 15) || 
        (month === 3 && day === 15) || 
        (month === 7 && day === 15) || 
        (month === 10 && day === 15) ||
        (month === 2 && day === 3) ||
        (month === 4 && day === 5) ||
        (month === 7 && day === 7)) {
      return true;
    }
    return false;
  };

  const handleShrineVisit = (shrine) => {
    setSelectedShrineForVerification(shrine);
    setShowVerification(true);
  };

  const handleVerificationComplete = async (verificationData) => {
    const newVisit = {
      shrine: selectedShrineForVerification,
      timestamp: new Date().toISOString(),
      verificationMethod: verificationData.method,
      photo: verificationData.photo || null,
      nftId: null
    };

    try {
      const nftMetadata = nftMintingService.generateNFTMetadata({
        ...verificationData,
        shrine: selectedShrineForVerification
      });
      
      const mintResult = await nftMintingService.mintNFT(nftMetadata, 'user-address');
      
      if (mintResult.success) {
        newVisit.nftId = mintResult.nft.id;
        setNftCollection(prev => [...prev, mintResult.nft]);
        showTemporaryNotification('✨ 参拝証明NFTが発行されました！');
      }
    } catch (error) {
      console.error('NFTミントエラー:', error);
    }

    setRecentVisits(prev => [newVisit, ...prev]);
    updatePlayerExperience(50);
    addCulturalCapital(30);
    
    setPlayerStats(prev => ({
      ...prev,
      totalVisits: prev.totalVisits + 1,
      uniqueShrines: prev.uniqueShrines + 1
    }));

    if (activeQuests.some(q => q.id === 'beginner-1' && !q.completed)) {
      setActiveQuests(prev => prev.map(q => 
        q.id === 'beginner-1' 
          ? { ...q, progress: 1, completed: true }
          : q
      ));
      showTemporaryNotification('🎯 クエスト完了: 初めての参拝！');
    }

    showTemporaryNotification(`⛩️ ${selectedShrineForVerification.name}への参拝を記録しました！`);
    soundEffects.playSound('bell');
    
    setShowVerification(false);
    setSelectedShrineForVerification(null);
  };

  // 神社設定の初期表示処理
  if (showShrineSetup) {
    return (
      <ShrineSetup
        onShrineCreated={(shrineData) => {
          createShrine(shrineData);
          showTemporaryNotification('⛩️ 神社が作成されました！');
        }}
      />
    );
  }

  // メイン画面
  return (
    <div className="App shrine-village ios-app">
      {/* パーティクルエフェクト */}
      <SakuraParticles count={15} />
      <LightParticles color="#FFD700" />
      
      {/* 季節のエフェクト */}
      <SeasonalEffects />
      
      <header className="App-header">
        <div className="village-header">
          <div className="header-top">
            <h1>⛩️ {myShrine.name}</h1>
            <WalletConnection />
          </div>
          <div className="shrine-stats">
            <span>🏛️ レベル {myShrine.level}</span>
            <span>📚 文化資本 {myShrine.culturalCapital}</span>
            <span>🙏 ご利益 {myShrine.blessings}</span>
            <span>👥 参拝者 {myShrine.visitors}</span>
          </div>
        </div>

        {/* 通知 */}
        {showNotification && (
          <div className="notification">
            {showNotification}
          </div>
        )}

        {/* アカウント状態 */}
        <AccountStatus />

        {/* プレイヤーステータス */}
        <PlayerStatus
          level={playerProfile.level}
          experience={playerProfile.experience}
          nextLevelExp={playerProfile.nextLevelExp}
          title={playerProfile.title}
          rank={playerProfile.rank}
          stats={playerProfile.stats}
          activeQuests={activeQuests}
        />
        
        {/* 文化帯ランク */}
        <div style={{ width: '100%', maxWidth: '100%', padding: '0 15px', boxSizing: 'border-box' }}>
          <CulturalBelt 
            culturalCapital={myShrine.culturalCapital}
            level={myShrine.level}
            userName="プレイヤー"
          />
        </div>

        {/* タブコンテンツ */}
        {renderTabContent()}

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

      {/* オーディオトグル */}
      <SimpleAudioToggle />
      
      {/* BGM管理システム */}
      <BGMManager activeTab={activeTab} />
      
      {/* BGMコントローラー */}
      <BGMController />
      
      {/* ボトムナビゲーション */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      {/* プライバシー情報（開発・審査用） */}
      {process.env.NODE_ENV === 'development' && <PrivacyInfo />}
    </div>
  );
}

export default ShrineVillageApp;