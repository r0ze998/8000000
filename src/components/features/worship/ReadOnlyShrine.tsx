
import React, { useState, useEffect } from 'react';
import './ReadOnlyShrine.css';
import { useShrineName } from '../../../hooks/useShrineName';

interface ReadOnlyShrineProps {
  className?: string;
}

const ReadOnlyShrine: React.FC<ReadOnlyShrineProps> = ({ className = '' }) => {
  const [shrineCanvas, setShrineCanvas] = useState<any[]>([]);
  const [shrineNFTs, setShrineNFTs] = useState<any[]>([]);
  const { shrineName } = useShrineName();

  useEffect(() => {
    // ローカルストレージから神社データを読み込み
    const savedCanvas = JSON.parse(localStorage.getItem('shrineCanvas') || '[]');
    const savedNFTs = JSON.parse(localStorage.getItem('shrineNFTs') || '[]');
    setShrineCanvas(savedCanvas);
    setShrineNFTs(savedNFTs);
  }, []);

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: '#94a3b8',
      uncommon: '#22d3ee', 
      rare: '#a855f7',
      epic: '#f59e0b',
      legendary: '#ef4444'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getPixelData = (x: number, y: number) => {
    const pixel = shrineCanvas.find((p: any) => p.x === x && p.y === y);
    return pixel || null;
  };

  const renderPixel = (x: number, y: number) => {
    const pixelData = getPixelData(x, y);
    
    if (pixelData && pixelData.nft) {
      return (
        <div
          key={`${x}-${y}`}
          className="pixel has-nft"
          style={{
            backgroundColor: getRarityColor(pixelData.nft.rarity),
            color: 'white',
            textShadow: '0 0 2px rgba(0,0,0,0.8)'
          }}
          title={`${pixelData.nft.name} (${pixelData.nft.rarity})`}
        >
          {pixelData.nft.emoji}
        </div>
      );
    }

    return (
      <div
        key={`${x}-${y}`}
        className="pixel"
      />
    );
  };

  const renderCanvas = () => {
    const canvas = [];
    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 20; x++) {
        canvas.push(renderPixel(x, y));
      }
    }
    return canvas;
  };

  const totalNFTs = shrineNFTs.length;
  const uniqueRarities = [...new Set(shrineNFTs.map(nft => nft.rarity))].length;
  const placedNFTs = shrineCanvas.filter(pixel => pixel.nft).length;

  return (
    <div className={`readonly-shrine ${className}`}>
      <div className="shrine-info">
        <h4>🏛️ {shrineName}</h4>
        <p>あなたの神聖な場所</p>
      </div>
      
      <div className="pixel-canvas-readonly">
        {renderCanvas()}
      </div>

      <div className="shrine-stats">
        <div className="shrine-stat">
          <span className="shrine-stat-value">{totalNFTs}</span>
          <span className="shrine-stat-label">所持NFT</span>
        </div>
        <div className="shrine-stat">
          <span className="shrine-stat-value">{placedNFTs}</span>
          <span className="shrine-stat-label">配置済み</span>
        </div>
        <div className="shrine-stat">
          <span className="shrine-stat-value">{uniqueRarities}</span>
          <span className="shrine-stat-label">レア度種類</span>
        </div>
      </div>
    </div>
  );
};

export default ReadOnlyShrine;
