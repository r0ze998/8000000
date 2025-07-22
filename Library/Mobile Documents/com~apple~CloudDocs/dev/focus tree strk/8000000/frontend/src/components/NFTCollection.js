import React from 'react';

const NFTCollection = ({ 
  nftCollection, 
  onNFTSelect, 
  selectedNFT, 
  filterCategory, 
  setFilterCategory, 
  categories 
}) => {
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

  const getAnimationClass = (rarity) => {
    switch (rarity) {
      case 'rare':
        return 'pulse';
      case 'epic':
        return 'glow';
      case 'legendary':
        return 'sparkle';
      default:
        return '';
    }
  };

  return (
    <div>
      {/* Category Filter */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ 
          color: '#FFD700', 
          marginBottom: '1rem',
          fontSize: '1.1rem'
        }}>
          🏷️ カテゴリフィルター
        </h4>
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {categories.map(category => (
            <button
              key={category.key}
              className={`btn ${filterCategory === category.key ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterCategory(category.key)}
              style={{ 
                fontSize: '0.8rem',
                padding: '0.5rem 0.8rem'
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* NFT Grid */}
      <div>
        <h4 style={{ 
          color: '#FFD700', 
          marginBottom: '1rem',
          fontSize: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🎁 NFTコレクション
          <span style={{ 
            fontSize: '0.8rem', 
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 'normal'
          }}>
            ({nftCollection.length}個)
          </span>
        </h4>

        {nftCollection.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              NFTがありません
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              神社参拝や祈りを通してNFTを獲得しましょう
            </div>
          </div>
        ) : (
          <div className="grid grid-4" style={{ gap: '1rem' }}>
            {nftCollection.map(nft => (
              <div
                key={nft.id}
                className={`card rarity-${nft.rarity} ${selectedNFT?.id === nft.id ? 'selected' : ''}`}
                onClick={() => onNFTSelect(nft)}
                style={{
                  cursor: 'pointer',
                  border: selectedNFT?.id === nft.id 
                    ? `3px solid ${getRarityColor(nft.rarity)}` 
                    : `2px solid ${getRarityColor(nft.rarity)}40`,
                  position: 'relative',
                  textAlign: 'center',
                  padding: '1rem',
                  animation: getAnimationClass(nft.rarity) === 'sparkle' ? 'sparkle 2s infinite' : 
                             getAnimationClass(nft.rarity) === 'glow' ? 'glow 2s infinite' :
                             getAnimationClass(nft.rarity) === 'pulse' ? 'pulse 2s infinite' : 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                }}
              >
                {/* Placed indicator */}
                {nft.placed && (
                  <div style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: '#48BB78',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    ✓
                  </div>
                )}

                {/* NFT Preview */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: nft.color || getRarityColor(nft.rarity),
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  margin: '0 auto 0.5rem',
                  border: `2px solid ${getRarityColor(nft.rarity)}`,
                  boxShadow: `0 4px 15px ${getRarityColor(nft.rarity)}40`
                }}>
                  {nft.emoji}
                </div>

                {/* NFT Info */}
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>
                  {nft.name}
                </div>
                
                <div style={{ 
                  fontSize: '0.7rem',
                  color: getRarityColor(nft.rarity),
                  fontWeight: 'bold',
                  marginBottom: '0.3rem'
                }}>
                  {getRarityName(nft.rarity)}
                </div>

                <div style={{ 
                  fontSize: '0.65rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '0.5rem'
                }}>
                  {nft.type || 'prayer_artifact'}
                </div>

                {/* Status */}
                <div style={{
                  fontSize: '0.7rem',
                  color: nft.placed ? '#48BB78' : 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 'bold'
                }}>
                  {nft.placed ? '配置済み' : '未配置'}
                </div>

                {/* Selection indicator */}
                {selectedNFT?.id === nft.id && (
                  <div style={{
                    position: 'absolute',
                    inset: '-2px',
                    border: `3px solid ${getRarityColor(nft.rarity)}`,
                    borderRadius: '12px',
                    pointerEvents: 'none',
                    animation: 'glow 1.5s infinite'
                  }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        fontSize: '0.8rem',
        color: 'rgba(255, 255, 255, 0.7)',
        lineHeight: '1.4'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#FFD700' }}>
          💡 使い方
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
          <li>NFTをクリックして選択し、建設モードでキャンバスに配置できます</li>
          <li>配置済みのNFTをクリックするとキャンバスから削除されます</li>
          <li>レア度が高いNFTほど特殊な視覚効果があります</li>
        </ul>
      </div>
    </div>
  );
};

export default NFTCollection;