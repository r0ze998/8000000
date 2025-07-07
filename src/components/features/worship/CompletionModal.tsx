import React from 'react';

interface CompletionRewards {
  culturalCapital: number;
  experience: number;
  totalCulturalCapital: number;
  omikujiResult: string;
  droppedNFT?: any;
  mintResult?: any;
  bonus: {
    seasonal: number;
    weather: number;
    timeOfDay: number;
  };
}

interface CompletionModalProps {
  isOpen: boolean;
  rewards: CompletionRewards | null;
  onClose: () => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ 
  isOpen, 
  rewards, 
  onClose 
}) => {
  if (!isOpen || !rewards) return null;

  return (
    <div className="completion-overlay">
      <div className="completion-modal">
        <div className="completion-header">
          <h2>🎉 参拝完了！</h2>
          <button 
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="completion-content">
          <div className="omikuji-result">
            <h3>おみくじ結果</h3>
            <div className={`omikuji-card ${rewards.omikujiResult}`}>
              {rewards.omikujiResult}
            </div>
          </div>

          <div className="rewards-summary">
            <h3>獲得報酬</h3>
            <div className="reward-item">
              <span>文化資本: +{rewards.totalCulturalCapital}</span>
            </div>
            <div className="reward-item">
              <span>経験値: +{rewards.experience}</span>
            </div>
          </div>

          {rewards.droppedNFT && (
            <div className="nft-drop">
              <h3>🎁 NFTドロップ！</h3>
              <div className="dropped-nft">
                <div 
                  className="nft-icon"
                  style={{ backgroundColor: rewards.droppedNFT.color }}
                >
                  {rewards.droppedNFT.emoji}
                </div>
                <div className="nft-info">
                  <h4>{rewards.droppedNFT.name}</h4>
                  <p className={`rarity ${rewards.droppedNFT.rarity}`}>
                    {rewards.droppedNFT.rarity}
                  </p>
                  <p className="power">⚡ {rewards.droppedNFT.power}</p>
                </div>
              </div>

              {rewards.mintResult && (
                <div className="mint-success">
                  ✅ ブロックチェーンに記録されました！
                </div>
              )}
            </div>
          )}

          <button 
            className="continue-btn"
            onClick={onClose}
          >
            続ける
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;