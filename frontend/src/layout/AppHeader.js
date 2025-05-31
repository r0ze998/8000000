import React from 'react';
import WalletConnection from '../components/WalletConnection';
import AccountStatus from '../components/AccountStatus';
import PlayerStatus from '../components/PlayerStatus';
import CulturalBelt from '../components/CulturalBelt';
import { useShrine } from '../hooks/useShrine';
import { usePlayer } from '../contexts/PlayerContext';
import { useNotification } from '../hooks/useNotification';

const AppHeader = () => {
  const { shrine: myShrine } = useShrine();
  const { playerProfile, activeQuests } = usePlayer();
  const { notification } = useNotification();

  return (
    <>
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
      {notification && (
        <div className="notification">
          {notification}
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
    </>
  );
};

export default AppHeader;