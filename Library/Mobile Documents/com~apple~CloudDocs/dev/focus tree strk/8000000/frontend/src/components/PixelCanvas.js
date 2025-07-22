import React from 'react';

const PixelCanvas = ({ nftCollection, onPixelClick, selectedNFT, isBuilding }) => {
  const GRID_WIDTH = 12;
  const GRID_HEIGHT = 12;
  const TOTAL_PIXELS = GRID_WIDTH * GRID_HEIGHT;

  const renderPixel = (row, col) => {
    const index = row * GRID_WIDTH + col;
    const placedNFT = nftCollection.find(nft => nft.placed && nft.position === index);
    const isEmpty = !placedNFT;
    const canPlace = isBuilding && selectedNFT && isEmpty;

    return (
      <div
        key={`${row}-${col}`}
        style={{
          width: '25px',
          height: '25px',
          border: canPlace 
            ? '2px solid #FFD700' 
            : '1px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: placedNFT 
            ? (placedNFT.color || '#FFD700')
            : (canPlace ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          cursor: canPlace ? 'pointer' : (placedNFT ? 'pointer' : 'default'),
          position: 'relative',
          borderRadius: '3px',
          transition: 'all 0.2s ease',
          boxShadow: canPlace ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none'
        }}
        onClick={() => onPixelClick(index)}
        onMouseEnter={(e) => {
          if (canPlace) {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (canPlace) {
            e.target.style.transform = 'scale(1)';
            e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
          }
        }}
        title={placedNFT ? placedNFT.name : (canPlace ? 'クリックして配置' : '')}
      >
        {placedNFT ? (
          placedNFT.emoji
        ) : (
          canPlace && (
            <span style={{ 
              color: '#FFD700', 
              fontWeight: 'bold',
              animation: 'pulse 1s infinite'
            }}>
              +
            </span>
          )
        )}
      </div>
    );
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_WIDTH}, 25px)`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, 25px)`,
          gap: '2px',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '15px',
          borderRadius: '12px',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {Array.from({ length: GRID_HEIGHT }, (_, row) =>
          Array.from({ length: GRID_WIDTH }, (_, col) => renderPixel(row, col))
        )}
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '1rem', 
        fontSize: '0.9rem',
        color: 'rgba(255, 255, 255, 0.7)'
      }}>
        <div>
          {GRID_WIDTH} × {GRID_HEIGHT} ピクセルキャンバス
        </div>
        <div style={{ fontSize: '0.8rem', marginTop: '0.3rem' }}>
          配置済み: {nftCollection.filter(nft => nft.placed).length}/{TOTAL_PIXELS}
        </div>
        {isBuilding && selectedNFT && (
          <div style={{ 
            fontSize: '0.8rem', 
            marginTop: '0.5rem',
            color: '#FFD700',
            fontWeight: 'bold'
          }}>
            💡 配置したい場所をクリックしてください
          </div>
        )}
      </div>
    </div>
  );
};

export default PixelCanvas;