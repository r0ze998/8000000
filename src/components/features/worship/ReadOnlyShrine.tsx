import React, { useState, useEffect } from 'react';
import './ReadOnlyShrine.css';

interface ReadOnlyShrineProps {
  className?: string;
}

const ReadOnlyShrine: React.FC<ReadOnlyShrineProps> = ({ className = '' }) => {
  const [shrineCanvas, setShrineCanvas] = useState<any[]>([]);

  useEffect(() => {
    // ローカルストレージから神社データを読み込み
    const savedCanvas = JSON.parse(localStorage.getItem('shrineCanvas') || '[]');
    setShrineCanvas(savedCanvas);
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
    return pixel;
  };

  return (
    <div className={`readonly-shrine ${className}`}>
      <div className="shrine-canvas-display">
        <h3>🏛️ あなたの神社</h3>
        <div className="pixel-canvas-readonly">
          {Array.from({ length: 12 }, (_, y) => (
            <div key={y} className="pixel-row">
              {Array.from({ length: 12 }, (_, x) => {
                const pixelData = getPixelData(x, y);
                return (
                  <div
                    key={`${x}-${y}`}
                    className="pixel readonly"
                    style={{ 
                      backgroundColor: pixelData?.color || 'rgba(255,255,255,0.1)',
                      border: pixelData ? `1px solid ${getRarityColor(pixelData.rarity || 'common')}` : '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    {pixelData?.pixelData && (
                      <span className="pixel-emoji">{pixelData.pixelData}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="shrine-info">
          <p>瞑想中、あなたの神社が心の支えとなります</p>
          <div className="shrine-stats">
            <span>配置済み: {shrineCanvas.length}個</span>
            <span>神力: {shrineCanvas.length * 10}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadOnlyShrine;