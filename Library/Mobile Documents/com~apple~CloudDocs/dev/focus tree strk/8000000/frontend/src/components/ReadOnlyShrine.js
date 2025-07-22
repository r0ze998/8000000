import React from 'react';

const ReadOnlyShrine = ({ nftCollection = [], shrineLevel = 1 }) => {
  const GRID_WIDTH = 15;
  const GRID_HEIGHT = 20;

  const renderPixel = (row, col) => {
    const index = row * GRID_WIDTH + col;
    const placedNFT = nftCollection.find(nft => nft.placed && nft.position === index);

    return (
      <div
        key={`${row}-${col}`}
        style={{
          width: '12px',
          height: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: placedNFT 
            ? placedNFT.color || '#FFD700'
            : 'rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '8px',
          position: 'relative'
        }}
      >
        {placedNFT && placedNFT.emoji}
      </div>
    );
  };

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_WIDTH}, 12px)`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, 12px)`,
          gap: '1px',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {Array.from({ length: GRID_HEIGHT }, (_, row) =>
          Array.from({ length: GRID_WIDTH }, (_, col) => renderPixel(row, col))
        )}
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '0.5rem', 
        fontSize: '0.8rem',
        color: 'rgba(255, 255, 255, 0.7)'
      }}>
        {GRID_WIDTH} × {GRID_HEIGHT} ピクセル神社 (レベル {shrineLevel})
      </div>
    </div>
  );
};

export default ReadOnlyShrine;