import React, { useState, useEffect } from 'react';
import './RewardModal.css';

const RewardModal = ({ reward, onClose }) => {
  const [revealing, setRevealing] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    // Start reveal animation
    const timer = setTimeout(() => {
      setRevealing(false);
      setShowDetails(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!reward) return null;
  
  const getRarityClass = (rarity) => {
    return `rarity-${rarity}`;
  };
  
  const getRewardIcon = (type) => {
    switch (type) {
      case 'goshuin': return '📜';
      case 'prayer_card': return '🎴';
      case 'badge': return '🏅';
      case 'title': return '👑';
      default: return '🎁';
    }
  };
  
  return (
    <div className="reward-modal-overlay" onClick={onClose}>
      <div className="reward-modal" onClick={e => e.stopPropagation()}>
        {revealing ? (
          <div className="reward-revealing">
            <div className="reveal-animation">
              <div className="light-burst"></div>
              <div className="reward-container spinning">
                <span className="reward-mystery">?</span>
              </div>
            </div>
            <p className="revealing-text">報酬を開封中...</p>
          </div>
        ) : (
          <div className="reward-revealed">
            <h2 className="reward-title">🎉 報酬獲得！</h2>
            
            <div className="rewards-list">
              {reward.rewards.map((item, index) => (
                <div 
                  key={index} 
                  className={`reward-item ${getRarityClass(item.rarity)} ${showDetails ? 'show' : ''}`}
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  <div className="reward-icon-container">
                    <span className="reward-icon">{getRewardIcon(item.type)}</span>
                    {item.rarity && (
                      <div className={`rarity-glow ${item.rarity}`}></div>
                    )}
                  </div>
                  
                  <div className="reward-info">
                    <h3 className="reward-name">{item.name || item.shrineName}</h3>
                    {item.type === 'goshuin' && (
                      <>
                        <p className="reward-rarity">{item.rarity.toUpperCase()}</p>
                        {item.variant !== 'standard' && (
                          <p className="reward-variant">{item.variant} Edition</p>
                        )}
                        <p className="reward-blessing">{item.blessing}</p>
                      </>
                    )}
                    {item.type === 'prayer_card' && (
                      <>
                        <p className="reward-description">{item.description}</p>
                        <p className="reward-effect">{item.effect}</p>
                      </>
                    )}
                    {item.description && (
                      <p className="reward-description">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {reward.multiplier > 1 && (
              <div className="multiplier-bonus">
                <span className="multiplier-text">
                  ボーナス倍率: {reward.multiplier.toFixed(1)}x
                </span>
              </div>
            )}
            
            <div className="reward-actions">
              <button className="share-button" onClick={() => shareReward(reward)}>
                <span className="share-icon">📤</span>
                シェア
              </button>
              <button className="close-button" onClick={onClose}>
                閉じる
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const shareReward = (reward) => {
  const goshuin = reward.rewards.find(r => r.type === 'goshuin');
  const text = goshuin 
    ? `${goshuin.shrineName}で${goshuin.rarity}御朱印を獲得しました！ #8000000 #shrine`
    : '新しい報酬を獲得しました！ #8000000';
    
  if (navigator.share) {
    navigator.share({
      title: '8000000 - 報酬獲得',
      text: text
    });
  } else {
    // Fallback to copying to clipboard
    navigator.clipboard.writeText(text);
    alert('シェアテキストをコピーしました！');
  }
};

export default RewardModal;