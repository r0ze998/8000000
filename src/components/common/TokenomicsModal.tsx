
import React from 'react';
import { 
  getCurrentSeasonalEvent, 
  getDailyMissionRewards, 
  getCulturalRank,
  calculateNFTStakingRewards 
} from '../../utils';
import './TokenomicsModal.css';

interface TokenomicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: {
    culturalCapital: number;
    consecutiveDays: number;
    totalVisits: number;
    uniqueShrines: number;
  };
}

const TokenomicsModal: React.FC<TokenomicsModalProps> = ({ isOpen, onClose, userStats }) => {
  if (!isOpen) return null;

  const currentRank = getCulturalRank(userStats.culturalCapital);
  const seasonalEvent = getCurrentSeasonalEvent();
  const dailyMissions = [
    {
      id: 'daily-prayer',
      title: '日次参拝',
      description: '1回参拝を完了する',
      reward: getDailyMissionRewards('worship'),
      type: 'daily'
    },
    {
      id: 'shrine-visit',
      title: '神社訪問',
      description: '新しい神社を訪問する',
      reward: getDailyMissionRewards('explore'),
      type: 'exploration'
    },
    {
      id: 'meditation-time',
      title: '瞑想時間',
      description: '10分以上瞑想する',
      reward: getDailyMissionRewards('cultural'),
      type: 'meditation'
    }
  ];
  const stakedNFTs = JSON.parse(localStorage.getItem('stakedNFTs') || '[]');
  const stakingRewards = stakedNFTs.length * 10; // Simple calculation for now
  
  // Enhance seasonal event with additional data
  const enhancedSeasonalEvent = seasonalEvent ? {
    name: seasonalEvent.name,
    description: `${seasonalEvent.name} イベント開催中`,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    icon: seasonalEvent.icon,
    multiplier: seasonalEvent.multiplier
  } : null;

  return (
    <div className="tokenomics-overlay" onClick={onClose}>
      <div className="tokenomics-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tokenomics-header">
          <h2>💎 トークノミクス詳細</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="tokenomics-content">
          {/* 現在のランク情報 */}
          <div className="rank-section">
            <h3>🏅 現在のランク</h3>
            <div 
              className="rank-display"
              style={{ 
                background: currentRank.gradient,
                boxShadow: currentRank.glow 
              }}
            >
              <span className="rank-icon">{currentRank.icon}</span>
              <div className="rank-info">
                <div className="rank-name">{currentRank.name}</div>
                <div className="rank-perks">
                  <span className="perk-tag">特典準備中</span>
                </div>
              </div>
            </div>
            <div className="rank-rewards">
              <div className="reward-item">
                <span>📅 デイリーステーキング: 0pt</span>
              </div>
              <div className="reward-item">
                <span>📊 ウィークリーボーナス: 0pt</span>
              </div>
            </div>
          </div>

          {/* 季節イベント */}
          {enhancedSeasonalEvent && (
            <div className="seasonal-section">
              <h3>🎊 季節イベント</h3>
              <div className="seasonal-event">
                <div className="event-header">
                  <span className="event-icon">{enhancedSeasonalEvent.icon}</span>
                  <div className="event-info">
                    <div className="event-name">{enhancedSeasonalEvent.description}</div>
                    <div className="event-multiplier">
                      報酬倍率: {enhancedSeasonalEvent.multiplier}x
                    </div>
                  </div>
                </div>
                <div className="event-timer">
                  終了まで: {Math.ceil((enhancedSeasonalEvent.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 1000))}日
                </div>
              </div>
            </div>
          )}

          {/* NFTステーキング */}
          <div className="staking-section">
            <h3>⚡ NFTステーキング</h3>
            <div className="staking-info">
              <div className="staking-stats">
                <div className="stat-item">
                  <span className="stat-label">配置中NFT:</span>
                  <span className="stat-value">{stakedNFTs.length}個</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">デイリー収益:</span>
                  <span className="stat-value">{stakingRewards}pt/日</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">ランクボーナス:</span>
                  <span className="stat-value">+0pt/日</span>
                </div>
              </div>
            </div>
          </div>

          {/* デイリーミッション */}
          <div className="missions-section">
            <h3>🎯 デイリーミッション</h3>
            <div className="missions-list">
              {dailyMissions.map((mission: any) => (
                <div key={mission.id} className="mission-item easy">
                  <div className="mission-header">
                    <span className="mission-title">{mission.title}</span>
                    <span className="mission-reward">+{mission.reward}pt</span>
                  </div>
                  <div className="mission-description">{mission.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ボーナス倍率表 */}
          <div className="multipliers-section">
            <h3>📈 ボーナス倍率表</h3>
            <div className="multipliers-grid">
              <div className="multiplier-category">
                <h4>⏰ 時間ボーナス</h4>
                <div className="multiplier-list">
                  <div className="multiplier-item">朝 (5-12時): 1.5x</div>
                  <div className="multiplier-item">昼 (12-17時): 1.0x</div>
                  <div className="multiplier-item">夕 (17-21時): 1.2x</div>
                  <div className="multiplier-item">夜 (21-5時): 0.8x</div>
                </div>
              </div>
              
              <div className="multiplier-category">
                <h4>🌤️ 天候ボーナス</h4>
                <div className="multiplier-list">
                  <div className="multiplier-item">☀️ 晴れ: 1.2x</div>
                  <div className="multiplier-item">🌧️ 雨: 1.5x</div>
                  <div className="multiplier-item">❄️ 雪: 2.0x</div>
                </div>
              </div>

              <div className="multiplier-category">
                <h4>🔥 連続ボーナス</h4>
                <div className="multiplier-list">
                  <div className="multiplier-item">3日: 1.5x</div>
                  <div className="multiplier-item">7日: 2.0x</div>
                  <div className="multiplier-item">14日: 2.5x</div>
                  <div className="multiplier-item">30日: 3.0x</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenomicsModal;
