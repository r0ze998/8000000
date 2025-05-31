import React, { useEffect } from 'react';
import soundEffects from './utils/soundEffects';
import { SakuraParticles, LightParticles } from './components/ParticleEffects';
import SeasonalEffects from './components/SeasonalEffects';
import BottomNavigation from './components/BottomNavigation';
import PrivacyInfo from './components/PrivacyInfo';
import SimpleAudioToggle from './components/SimpleAudioToggle';
import BGMController from './components/BGMController';
import BGMManager from './components/BGMManager';
import ShrineSetup from './components/ShrineSetup';
import ActivityModal from './components/ActivityModal';
import ShrineSelector from './components/ShrineSelector';
import VisitVerification from './components/VisitVerification';

// Layout Components
import AppHeader from './layout/AppHeader';
import TabContent from './layout/TabContent';

// Contexts
import { AppProvider } from './contexts/AppProvider';
import { useShrine } from './hooks/useShrine';
import { useNotification } from './hooks/useNotification';
import { useUI } from './contexts/UIContext';
import { usePlayer } from './contexts/PlayerContext';
import { useVisit } from './contexts/VisitContext';

// Constants
import { CULTURAL_ACTIVITIES } from './constants/culturalActivities';

// Services
import nftMintingService from './services/nftMinting';

// Styles
import './App.css';
import './ShrineVillage.css';

function ShrineVillageContent() {
  const { shrine, showShrineSetup, createShrine, addCulturalCapital, addBlessings } = useShrine();
  const { showNotification } = useNotification();
  const { 
    activeTab, 
    changeTab,
    showActivityModal,
    selectedActivity,
    closeActivityModal,
    showShrineSelector,
    closeShrineSelector,
    showVerification,
    selectedShrineForVerification,
    closeVerification
  } = useUI();
  const { updatePlayerExperience, updatePlayerStats, updateQuest } = usePlayer();
  const { addVisit, mintVisitNFT } = useVisit();

  // 初期化
  useEffect(() => {
    soundEffects.init();
  }, []);

  // アクティビティハンドラー
  const handleActivitySubmit = async (activityData) => {
    const activity = CULTURAL_ACTIVITIES[selectedActivity];
    
    try {
      if (activityData.verificationData) {
        // 認証済みアクティビティ
        const nft = await mintVisitNFT(activityData.verificationData);
        const experienceGain = activity.baseExperience * 2;
        const culturalValue = activity.culturalValue * 2;
        
        updatePlayerExperience(experienceGain);
        addCulturalCapital(culturalValue);
        addBlessings(20);
        
        showNotification(`🎊 認証済み参拝完了！ +${experienceGain} EXP, +${culturalValue} 文化資本`);
        soundEffects.playSound('achievement');
      } else {
        // 通常アクティビティ
        updatePlayerExperience(activity.baseExperience);
        addCulturalCapital(activity.culturalValue);
        addBlessings(10);
        
        showNotification(`🎯 ${activity.name}を完了しました！ +${activity.baseExperience} EXP`);
        soundEffects.playSound('complete');
      }
    } catch (error) {
      console.error('アクティビティエラー:', error);
      showNotification('❌ エラーが発生しました。');
    } finally {
      closeActivityModal();
    }
  };

  // 参拝認証完了ハンドラー
  const handleVerificationComplete = async (verificationData) => {
    try {
      const visit = await addVisit(selectedShrineForVerification, verificationData);
      
      updatePlayerExperience(50);
      addCulturalCapital(30);
      
      updatePlayerStats('totalVisits');
      updatePlayerStats('uniqueShrines');
      
      // クエスト更新
      updateQuest('beginner-1', 1);
      
    } catch (error) {
      console.error('参拝記録エラー:', error);
    } finally {
      closeVerification();
    }
  };

  // 神社設定画面
  if (showShrineSetup) {
    return (
      <ShrineSetup
        onShrineCreated={(shrineData) => {
          createShrine(shrineData);
          showNotification('⛩️ 神社が作成されました！');
        }}
      />
    );
  }

  // メイン画面
  return (
    <div className="App shrine-village ios-app">
      {/* エフェクト */}
      <SakuraParticles count={15} />
      <LightParticles color="#FFD700" />
      <SeasonalEffects />
      
      <header className="App-header">
        <AppHeader />
        <TabContent />
      </header>

      {/* モーダル */}
      {showActivityModal && (
        <ActivityModal
          activity={selectedActivity}
          onClose={closeActivityModal}
          onSubmit={handleActivitySubmit}
        />
      )}

      {showShrineSelector && (
        <ShrineSelector
          onShrineSelect={(shrine) => {
            closeVerification();
            closeVerification(shrine);
          }}
          onClose={closeShrineSelector}
        />
      )}

      {showVerification && selectedShrineForVerification && (
        <VisitVerification
          shrine={selectedShrineForVerification}
          onVerified={handleVerificationComplete}
          onCancel={closeVerification}
        />
      )}

      {/* UI要素 */}
      <SimpleAudioToggle />
      <BGMManager activeTab={activeTab} />
      <BGMController />
      
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={changeTab}
      />
      
      {process.env.NODE_ENV === 'development' && <PrivacyInfo />}
    </div>
  );
}

// メインコンポーネント
function App() {
  return (
    <AppProvider>
      <ShrineVillageContent />
    </AppProvider>
  );
}

export default App;