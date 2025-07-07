import React from 'react';
import { UserStats as UserStatsType } from '../../../types';

interface UserStatsProps {
  stats: UserStatsType;
  isReady: boolean;
  onStartPrayer: () => void;
}

const UserStatsPanel: React.FC<UserStatsProps> = ({ stats, isReady, onStartPrayer }) => {
  return (
    <div className="prayer-section">
      <h2>🙏 参拝</h2>
      <div className="prayer-panel">
        <p className="prayer-description">
          心を落ち着け、神聖な時間を過ごしましょう
        </p>

        <button 
          className="start-prayer-btn"
          onClick={onStartPrayer}
          disabled={!isReady}
        >
          {isReady ? '🙏 祈りを捧げる' : '⏳ 準備中...'}
        </button>

        {/* 統計表示 */}
        <div className="stats-panel">
          <h4>参拝記録</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{stats.culturalCapital}</span>
              <span className="stat-label">文化資本</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.totalNFTs}</span>
              <span className="stat-label">NFT数</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.meditationStreak}</span>
              <span className="stat-label">連続日数</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.level}</span>
              <span className="stat-label">レベル</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatsPanel;