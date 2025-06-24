import React from 'react';
import HomeTab from '../components/HomeTab';
import VisitTab from '../components/tabs/VisitTab';
import ExploreTab from '../components/ExploreTab';
import LearnTab from '../components/LearnTab';
import ProfileTab from '../components/ProfileTab';
import { useUI } from '../contexts/UIContext';
import { usePlayer } from '../contexts/PlayerContext';
import { useVisit } from '../contexts/VisitContext';
import { useShrine } from '../hooks/useShrine';
import { useNotification } from '../hooks/useNotification';
import soundEffects from '../utils/soundEffects';

const TabContent = () => {
  const { activeTab, changeTab, openShrineSelector, openVerification } = useUI();
  const { playerProfile, updatePlayerExperience, updatePlayerStats, unlockAchievement, drawnOmikuji, addOmikuji } = usePlayer();
  const { recentVisits, nftCollection } = useVisit();
  const { shrine: myShrine } = useShrine();
  const { showNotification } = useNotification();

  switch (activeTab) {
    case 'home':
      return (
        <HomeTab
          userProfile={playerProfile}
          userLocation={{ lat: 35.6762, lng: 139.6503 }}
          onShrineSelect={(shrine) => {
            openVerification(shrine);
            openShrineSelector();
          }}
          onActivityStart={(activity, data) => {
            if (activity === 'camera_scan') {
              openShrineSelector();
            } else if (activity === 'learning') {
              changeTab('learn');
            } else if (activity === 'map_explore') {
              changeTab('explore');
            } else if (activity === 'community') {
              changeTab('profile');
            }
          }}
          onEventJoin={(event) => {
            showNotification(`🎉 ${event.name}に参加申込みしました！`);
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
          showTemporaryNotification={showNotification}
          updatePlayerExperience={updatePlayerExperience}
          onShrineSelect={(shrine) => {
            openVerification(shrine);
            openShrineSelector();
          }}
          onEventJoin={(eventId) => {
            showNotification(`🎉 イベントに参加申込みしました！`);
            soundEffects.playSound('bell');
            updatePlayerStats('eventsJoined');
          }}
        />
      );
    
    case 'visit':
      return (
        <VisitTab
          onShrineSelect={openShrineSelector}
          recentVisits={recentVisits}
          playerProfile={playerProfile}
          drawnOmikuji={drawnOmikuji}
          onOmikujiDrawn={addOmikuji}
          soundEffects={soundEffects}
          showTemporaryNotification={showNotification}
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
          showTemporaryNotification={showNotification}
          updatePlayerExperience={updatePlayerExperience}
          unlockAchievement={unlockAchievement}
        />
      );
    
    case 'profile':
      return (
        <ProfileTab
          userProfile={playerProfile}
          playerStats={playerProfile.stats}
          achievements={{}}
          nftCollection={nftCollection}
          drawnOmikuji={drawnOmikuji}
          recentVisits={recentVisits}
          myShrine={myShrine}
          soundEffects={soundEffects}
          showTemporaryNotification={showNotification}
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

export default TabContent;