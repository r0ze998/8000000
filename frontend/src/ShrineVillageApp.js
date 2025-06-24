import React, { useState, useEffect } from 'react';
import soundEffects from './utils/soundEffects';
import { SakuraParticles, LightParticles } from './components/gamification/ParticleEffects';
import CulturalBelt from './components/gamification/CulturalBelt';
import ShrineSelector from './components/shrine/ShrineSelector';
import VisitVerification from './components/visit/VisitVerification';
import ShrineSetup from './components/shrine/ShrineSetup';
import ActivityModal from './components/ui/ActivityModal';
import SimpleAudioToggle from './components/audio/SimpleAudioToggle';
import WalletConnection from './components/integration/WalletConnection';
import AccountStatus from './components/player/AccountStatus';
import PlayerStatus from './components/player/PlayerStatus';
import SeasonalEffects from './components/gamification/SeasonalEffects';
import BottomNavigation from './components/ui/BottomNavigation';
import PrivacyInfo from './components/ui/PrivacyInfo';
import HomeTab from './components/HomeTab';
import VisitTab from './components/tabs/VisitTab';
import ExploreTab from './components/ExploreTab';
import LearnTab from './components/LearnTab';
import ProfileTab from './components/ProfileTab';
import BGMManager from './components/audio/BGMManager';

// スタイル
import './components/tabs/VisitTab.css';
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
  const [activeTab, setActiveTab] = useState('home');
  
  const handleTabChange = (newTab) => {
    console.log(`Tab change from ${activeTab} to ${newTab}`);
    setActiveTab(newTab);
  };
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
  // const [villageMembers] = useState([
  //   { id: 1, name: '山田さん', shrine: '豊穣神社', level: 5, culturalCapital: 450 },
  //   { id: 2, name: '鈴木さん', shrine: '学問神社', level: 3, culturalCapital: 280 },
  //   { id: 3, name: '佐藤さん', shrine: '芸術神社', level: 4, culturalCapital: 380 }
  // ]);
  
  // プレイヤープロファイル（ゲーム用）
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
      uniqueShrines: 0,
      collectedOmamori: 0,
      seasonalEvents: 0
    }
  });
  
  // ゲーミフィケーション用の状態
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
      description: '異なる神社を5箇所訪れましょう',
      progress: 0,
      target: 5,
      reward: { experience: 500, culturalCapital: 200, title: '神社探検家' },
      completed: false
    },
    {
      id: 'seasonal-1',
      title: '季節の巡礼者',
      description: '春の季節イベントに参加しましょう',
      progress: 0,
      target: 1,
      reward: { experience: 300, item: '桜の御守り' },
      completed: false
    }
  ]);

  // 村建設システム用の状態
  // const [playerResources, setPlayerResources] = useState({
  //   wood: 50,
  //   stone: 30,
  //   bamboo: 10,
  //   water: 20,
  //   plants: 15,
  //   faith: 100,
  //   bronze: 5,
  //   gold: 2,
  //   cloth: 8,
  //   paper: 12,
  //   oil: 3,
  //   asphalt: 0,
  //   gravel: 25
  // });
  
  // const [villageLayout, setVillageLayout] = useState([]);
  // const [playerCollection, setPlayerCollection] = useState({});
  const [playerStats, setPlayerStats] = useState({
    consecutiveVisits: 0,
    fullMoonVisits: 0,
    legendaryShrineSVisits: 0
  });

  useEffect(() => {
    soundEffects.init();
    nftMintingService.initialize();
  }, []);

  // 経験値更新関数
  const updatePlayerExperience = (expGained) => {
    setPlayerProfile(prev => {
      let newExp = prev.experience + expGained;
      let newLevel = prev.level;
      let newNextLevelExp = prev.nextLevelExp;
      let newTitle = prev.title;
      let newRank = prev.rank;
      
      // レベルアップチェック
      while (newExp >= newNextLevelExp) {
        newExp -= newNextLevelExp;
        newLevel++;
        newNextLevelExp = Math.floor(newNextLevelExp * 1.5);
        
        // レベルアップサウンド
        soundEffects.playSound('levelUp');
        soundEffects.playSound('gong');
        
        // タイトル更新
        if (newLevel >= 50) {
          newTitle = '神々の使者';
          newRank = '金帯';
        } else if (newLevel >= 40) {
          newTitle = '伝説の参拝者';
          newRank = '紅帯';
        } else if (newLevel >= 30) {
          newTitle = '神社マスター';
          newRank = '黒帯';
        } else if (newLevel >= 25) {
          newTitle = '御朱印収集家';
          newRank = '茶帯';
        } else if (newLevel >= 20) {
          newTitle = '神社巡礼者';
          newRank = '紫帯';
        } else if (newLevel >= 15) {
          newTitle = '熟練参拝者';
          newRank = '青帯';
        } else if (newLevel >= 10) {
          newTitle = '中級参拝者';
          newRank = '緑帯';
        } else if (newLevel >= 5) {
          newTitle = '見習い参拝者';
          newRank = '橙帯';
        } else if (newLevel >= 3) {
          newTitle = '初級参拝者';
          newRank = '黄帯';
        }
      }
      
      return {
        ...prev,
        experience: newExp,
        level: newLevel,
        nextLevelExp: newNextLevelExp,
        title: newTitle,
        rank: newRank
      };
    });
  };

  // プレイヤーステータス更新関数
  const updatePlayerStats = (statType, increment = 1) => {
    setPlayerProfile(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statType]: prev.stats[statType] + increment
      }
    }));
    
    // クエスト進行チェック
    checkQuestProgress(statType);
  };
  
  // クエスト進行をチェック
  const checkQuestProgress = (action) => {
    setActiveQuests(prev => prev.map(quest => {
      if (quest.completed) return quest;
      
      let shouldProgress = false;
      if (quest.id === 'beginner-1' && action === 'totalVisits') {
        shouldProgress = true;
      } else if (quest.id === 'explorer-1' && action === 'uniqueShrines') {
        shouldProgress = true;
      } else if (quest.id === 'seasonal-1' && action === 'seasonalEvents') {
        shouldProgress = true;
      }
      
      if (shouldProgress) {
        const newProgress = quest.progress + 1;
        if (newProgress >= quest.target) {
          // クエスト完了
          completeQuest(quest);
          return { ...quest, progress: newProgress, completed: true };
        }
        return { ...quest, progress: newProgress };
      }
      
      return quest;
    }));
  };
  
  // クエスト完了処理
  const completeQuest = (quest) => {
    const { reward } = quest;
    
    // 報酬を付与
    if (reward.experience) {
      updatePlayerExperience(reward.experience);
    }
    if (reward.culturalCapital) {
      addCulturalCapital(reward.culturalCapital);
    }
    if (reward.title) {
      setPlayerProfile(prev => ({ ...prev, title: reward.title }));
    }
    
    // 完了サウンドと通知
    soundEffects.playSound('levelUp');
    soundEffects.playSound('gong');
    showTemporaryNotification(
      `🎊 クエスト「${quest.title}」完了！\n` +
      `報酬: ${reward.experience ? `経験値 +${reward.experience}` : ''} ${reward.culturalCapital ? `文化資本 +${reward.culturalCapital}` : ''}`
    );
  };
  
  // アチーブメント解除
  const unlockAchievement = (achievementId, achievementName) => {
    if (!unlockedAchievements.includes(achievementId)) {
      setUnlockedAchievements(prev => [...prev, achievementId]);
      soundEffects.playSound('taiko');
      soundEffects.playSound('koto');
      showTemporaryNotification(`🏅 アチーブメント「${achievementName}」を解除しました！`);
    }
  };

  // 村建設システム用のハンドラー
  // const handleResourceUpdate = (newResources) => {
  //   setPlayerResources(newResources);
  // };

  // const handleResourceGain = (resourceType, amount) => {
  //   setPlayerResources(prev => ({
  //     ...prev,
  //     [resourceType]: (prev[resourceType] || 0) + amount
  //   }));
  //   showTemporaryNotification(`🎁 ${resourceType} +${amount} を獲得しました！`);
  // };

  // const handleVillageSave = (layout) => {
  //   setVillageLayout(layout);
  //   showTemporaryNotification('🏗️ レイアウトを保存しました！');
  // };

  // const handleCollectionUpdate = (collection) => {
  //   setPlayerCollection(collection);
  // };

  // ハンドラー関数
  const handleActivitySelect = (activityKey) => {
    setSelectedActivity(activityKey);
    setShowActivityModal(true);
    soundEffects.playSound('bell');
  };

  const handleActivitySubmit = async (activityKey, details) => {
    const activity = CULTURAL_ACTIVITIES[activityKey];
    
    // 認証データがある場合（新システム）
    if (details.verified && details.verificationData) {
      await handleVerifiedActivity(activityKey, details);
      return;
    }
    
    // 従来のシステム（認証なし）は廃止
    showTemporaryNotification('⚠️ 参拝記録には写真またはGPS認証が必要です');
  };

  // 認証済み参拝の処理
  const handleVerifiedActivity = async (activityKey, details) => {
    const activity = CULTURAL_ACTIVITIES[activityKey];
    
    try {
      // setIsVerifying(true);
      showTemporaryNotification('🔄 NFTを生成中...');
      
      // NFTメタデータ生成
      const nftMetadata = nftMintingService.generateNFTMetadata(details.verificationData);
      
      // NFTミント（ここではローカル保存）
      const mintResult = await nftMintingService.mintNFT(nftMetadata, 'user-address');
      
      // ローカルに保存
      await nftMintingService.saveNFTLocally(mintResult, 'user-address');
      
      // おみくじを引く
      const omikujiResult = drawOmikuji({
        shrineType: details.shrine?.type || 'general',
        season: getCurrentSeason(),
        isSpecialDay: isSpecialDay(),
        previousDraws: drawnOmikuji.length
      });
      
      // おみくじを履歴に追加
      setDrawnOmikuji(prev => [...prev, {
        ...omikujiResult,
        shrineVisitId: mintResult.tokenId,
        shrineName: details.shrine?.name,
        timestamp: new Date().toISOString()
      }]);
      
      // おみくじレア度による追加報酬
      const omikujiBonus = getOmikujiBonus(omikujiResult.rarity);
      
      // ゲーム内リワード適用
      const rewards = nftMetadata.gameAttributes.resourceRewards;
      const culturalValue = nftMetadata.gameAttributes.culturalValue;
      
      // 建物のレベルアップ
      const currentLevel = myShrine.buildings[activity.building] || 0;
      const newLevel = Math.min(currentLevel + 1, 3);
      updateBuilding(activity.building, newLevel);
      
      // 文化資本とご利益を追加
      addCulturalCapital(culturalValue);
      addBlessings(20); // 認証済みは通常の2倍
      
      // リソース獲得（認証による豪華報酬）
      // Object.entries(rewards).forEach(([resource, amount]) => {
      //   handleResourceGain(resource, amount);
      // });
      
      // 参拝統計を更新
      setPlayerStats(prev => ({
        ...prev,
        consecutiveVisits: prev.consecutiveVisits + 1,
        fullMoonVisits: prev.fullMoonVisits + (isFullMoon() ? 1 : 0),
        legendaryShrineSVisits: prev.legendaryShrineSVisits + (details.shrine?.rarity === 'legendary' ? 1 : 0)
      }));
      
      // 最近の参拝記録を追加
      setRecentVisits(prev => [...prev, {
        shrine: details.shrine?.name || details.location,
        date: new Date(),
        type: activity.name,
        verified: true,
        photo: details.verificationData.photo,
        nftId: mintResult.tokenId
      }].slice(-10));
      
      // NFTコレクションに追加
      setNftCollection(prev => [...prev, {
        id: mintResult.tokenId,
        ...activity,
        ...details,
        nftData: mintResult,
        timestamp: new Date().toISOString(),
        verified: true
      }]);
      
      // コレクションアイテムをチェック
      const unlocks = nftMetadata.gameAttributes.buildingUnlocks;
      if (unlocks.length > 0) {
        showTemporaryNotification(`🎉 新しい建築要素がアンロックされました！`);
      }
      
      showTemporaryNotification(
        `✨ ${details.shrine?.name}の参拝NFTを獲得しました！\n` +
        `🎁 文化資本 +${culturalValue}\n` +
        `🏗️ 建設リソースも獲得！\n` +
        `🎋 おみくじ: ${omikujiResult.rarity} - ${omikujiResult.shortMessage}`
      );
      
      soundEffects.playSound('treeGrow');
      soundEffects.playSound('koto');
      
    } catch (error) {
      console.error('NFT生成エラー:', error);
      showTemporaryNotification('❌ NFT生成に失敗しました。もう一度お試しください。');
    } finally {
      // setIsVerifying(false);
      setShowActivityModal(false);
      setSelectedActivity(null);
    }
  };

  // 満月判定
  const isFullMoon = () => {
    // 簡易的な満月判定
    const now = new Date();
    const day = now.getDate();
    return day >= 14 && day <= 16; // 毎月14-16日を満月とする
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
    soundEffects.playSound('bell');
    
    // プレイヤーの経験値とステータスを更新
    updatePlayerExperience(experience);
    updatePlayerStats('totalVisits');
    
    // ユニークな神社の場合
    if (!recentVisits.find(v => v.shrine?.name === shrine.name)) {
      updatePlayerStats('uniqueShrines');
      
      // アチーブメントチェック
      if (playerProfile.stats.uniqueShrines + 1 >= 10) {
        unlockAchievement('explorer-10', '10社巡礼達成');
      }
      if (playerProfile.stats.uniqueShrines + 1 >= 50) {
        unlockAchievement('explorer-50', '50社巡礼マスター');
      }
    }
    
    // 特殊な神社でのアチーブメント
    if (shrine.rarity === 'legendary') {
      unlockAchievement('legendary-visitor', '伝説の神社参拝者');
    }
    
    setShowVerification(false);
    setSelectedShrineForVerification(null);
  };

  const handleVisitFriend = (friend) => {
    addCulturalCapital(20);
    showTemporaryNotification(`🎋 ${friend.name}の${friend.shrine}を訪問しました！`);
    soundEffects.playSound('complete');
    soundEffects.playSound('shakuhachi');
  };

  const handleGameActivity = (activityData) => {
    const { type, culturalCapital } = activityData;
    addCulturalCapital(culturalCapital);
    showTemporaryNotification(`🎮 ${type}で +${culturalCapital} 文化資本を獲得！`);
  };

  // iOS最適化のためのviewport設定
  useEffect(() => {
    // viewport meta tagを動的に設定
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
    }
    
    // iOS用のスクロール最適化
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // ステータスバーのスタイル設定
    const statusBarMeta = document.createElement('meta');
    statusBarMeta.name = 'apple-mobile-web-app-status-bar-style';
    statusBarMeta.content = 'black-translucent';
    document.head.appendChild(statusBarMeta);
  }, []);
  
  // セットアップ画面
  if (showShrineSetup) {
    return (
      <div className="App shrine-village ios-app">
        <ShrineSetup onCreateShrine={createShrine} />
      </div>
    );
  }
  
  // おみくじボーナス計算
  const getOmikujiBonus = (rarity) => {
    const bonuses = {
      '大吉': 100,
      '中吉': 50,
      '小吉': 30,
      '吉': 20,
      '末吉': 10,
      '凶': 5,
      '大凶': 1
    };
    return bonuses[rarity] || 10;
  };
  
  // 現在の季節を取得
  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  };
  
  // 特別な日かどうか
  const isSpecialDay = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 正月、節分、七夕など
    if ((month === 1 && day <= 7) || 
        (month === 2 && day === 3) ||
        (month === 7 && day === 7)) {
      return true;
    }
    return false;
  };

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
        {activeTab === 'home' ? (
          // ホームタブ
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
        ) : activeTab === 'explore' ? (
          // 探索タブ
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
        ) : activeTab === 'visit' ? (
          // 参拝タブ
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
        ) : activeTab === 'learn' ? (
          // 学びタブ
          <LearnTab
            userProfile={playerProfile}
            soundEffects={soundEffects}
            showTemporaryNotification={showTemporaryNotification}
            updatePlayerExperience={updatePlayerExperience}
            unlockAchievement={unlockAchievement}
          />
        ) : activeTab === 'profile' ? (
          // プロフィールタブ
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
            goshuinchoPage={goshuinchoPage}
            onPageChange={setGoshuinchoPage}
          />
        ) : null}

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