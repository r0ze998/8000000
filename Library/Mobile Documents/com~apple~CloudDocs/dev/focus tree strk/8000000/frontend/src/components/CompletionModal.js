import React, { useEffect, useState } from 'react';

const CompletionModal = ({ result, onClose }) => {
  const [showReward, setShowReward] = useState(false);
  const [showNFT, setShowNFT] = useState(false);

  useEffect(() => {
    // Staggered animation effect
    setTimeout(() => setShowReward(true), 500);
    setTimeout(() => setShowNFT(true), 1000);
  }, []);

  const getOmikujiColor = (result) => {
    const colors = {
      '大吉': '#FFD700',
      '中吉': '#FFA500', 
      '吉': '#48BB78',
      '小吉': '#4299E1',
      '末吉': '#9F7AEA',
      '凶': '#FF6B6B'
    };
    return colors[result] || '#FFD700';
  };

  const getOmikujiMessage = (result) => {
    const messages = {
      '大吉': '素晴らしい運気です！願いが叶う日が近いでしょう。',
      '中吉': '良い運気に恵まれています。努力が実を結びます。',
      '吉': '穏やかな幸運が訪れます。感謝の心を忘れずに。',
      '小吉': 'ささやかな幸せが見つかるでしょう。',
      '末吉': '忍耐が必要ですが、やがて良いことがあります。',
      '凶': '今は耐える時。きっと良い方向に向かいます。'
    };
    return messages[result] || '';
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: '#48BB78',
      rare: '#9F7AEA',
      epic: '#4299E1', 
      legendary: '#FFD700'
    };
    return colors[rarity] || '#48BB78';
  };

  const getRarityName = (rarity) => {
    const names = {
      common: 'コモン',
      rare: 'レア',
      epic: 'エピック',
      legendary: 'レジェンダリー'
    };
    return names[rarity] || 'コモン';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()}
        style={{ 
          maxWidth: '450px', 
          textAlign: 'center',
          animation: 'fadeInUp 0.6s ease'
        }}
      >
        {/* Success Animation */}
        <div style={{ 
          fontSize: '4rem', 
          marginBottom: '1rem',
          animation: 'pulse 1.5s infinite'
        }}>
          🙏
        </div>

        <h2 style={{ 
          color: '#FFD700', 
          marginBottom: '0.5rem',
          fontSize: '1.8rem'
        }}>
          祈りが届きました
        </h2>

        <p style={{ 
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '2rem',
          fontSize: '1.1rem'
        }}>
          神聖な力を感じます
        </p>

        {/* Omikuji Result */}
        <div style={{
          background: `linear-gradient(135deg, ${getOmikujiColor(result.omikujiResult)}20, ${getOmikujiColor(result.omikujiResult)}10)`,
          border: `2px solid ${getOmikujiColor(result.omikujiResult)}40`,
          borderRadius: '15px',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ 
            fontSize: '2.5rem', 
            marginBottom: '0.5rem'
          }}>
            🎋
          </div>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold',
            color: getOmikujiColor(result.omikujiResult),
            marginBottom: '0.5rem'
          }}>
            {result.omikujiResult}
          </div>
          <div style={{ 
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: '1.4'
          }}>
            {getOmikujiMessage(result.omikujiResult)}
          </div>
        </div>

        {/* Rewards */}
        {showReward && (
          <div style={{
            background: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            animation: 'fadeInUp 0.5s ease'
          }}>
            <h4 style={{ 
              color: '#FFD700', 
              marginBottom: '1rem',
              fontSize: '1.2rem'
            }}>
              ✨ 獲得報酬
            </h4>
            
            <div className="grid grid-3" style={{ gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>⚡</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#FFD700' }}>
                  +{result.culturalCapital}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  文化資本
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>🎯</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#4299E1' }}>
                  +{result.experience}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  経験値
                </div>
              </div>

              {result.bonus && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>🎁</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#FF8C00' }}>
                    ×2
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    ボーナス
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* NFT Drop */}
        {showNFT && result.nftDrop && (
          <div style={{
            background: `linear-gradient(135deg, ${getRarityColor(result.nftDrop.rarity)}20, ${getRarityColor(result.nftDrop.rarity)}10)`,
            border: `2px solid ${getRarityColor(result.nftDrop.rarity)}40`,
            borderRadius: '15px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            animation: 'fadeInUp 0.5s ease, glow 2s infinite'
          }}>
            <h4 style={{ 
              color: getRarityColor(result.nftDrop.rarity), 
              marginBottom: '1rem',
              fontSize: '1.2rem'
            }}>
              🎁 NFT獲得！
            </h4>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{ 
                fontSize: '3rem',
                background: result.nftDrop.color || getRarityColor(result.nftDrop.rarity),
                width: '80px',
                height: '80px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${getRarityColor(result.nftDrop.rarity)}`
              }}>
                {result.nftDrop.emoji}
              </div>
              
              <div style={{ textAlign: 'left' }}>
                <div style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold',
                  marginBottom: '0.3rem'
                }}>
                  {result.nftDrop.name}
                </div>
                <div style={{ 
                  fontSize: '0.9rem',
                  color: getRarityColor(result.nftDrop.rarity),
                  fontWeight: 'bold'
                }}>
                  {getRarityName(result.nftDrop.rarity)}
                </div>
                <div style={{ 
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  祈りの証
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          className="btn btn-primary"
          onClick={onClose}
          style={{ 
            width: '100%',
            fontSize: '1.1rem',
            padding: '1rem'
          }}
        >
          ✨ 続ける
        </button>

        {/* Footer Message */}
        <div style={{
          marginTop: '1rem',
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.6)',
          fontStyle: 'italic'
        }}>
          あなたの祈りは永遠にブロックチェーンに記録されました
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;