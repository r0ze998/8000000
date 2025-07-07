import React, { useState, useEffect, useRef } from 'react';
import './MyShrine.css';
import { NFTItem } from '../../../types';
import { getRarityColor } from '../../../utils/nftUtils';
import { ENHANCED_NFT_PARTS } from '../../../data/nftParts';

interface ShrinePixel {
  x: number;
  y: number;
  color: string;
  nftId?: string;
  timestamp: number;
}

const MyShrine: React.FC = () => {
  const [nftCollection, setNftCollection] = useState<NFTItem[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);
  const [shrineCanvas, setShrineCanvas] = useState<ShrinePixel[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [shrineLevel, setShrineLevel] = useState(1);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [viewMode, setViewMode] = useState<'build' | 'collection' | 'stats'>('build');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [showPixelNFTModal, setShowPixelNFTModal] = useState(false);
  const [selectedPixelCoord, setSelectedPixelCoord] = useState<{x: number, y: number} | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 初期NFTとローカルストレージのNFTを結合
    const loadNFTCollection = () => {
      try {
        const savedNFTs = JSON.parse(localStorage.getItem('shrineNFTs') || '[]');
        const combinedNFTs = [...ENHANCED_NFT_PARTS, ...savedNFTs];
        setNftCollection(combinedNFTs);
      } catch (error) {
        console.error('NFT読み込みエラー:', error);
        setNftCollection(ENHANCED_NFT_PARTS);
      }
    };

    // 神社キャンバスを読み込み
    const loadShrineCanvas = () => {
      try {
        const savedCanvas = JSON.parse(localStorage.getItem('shrineCanvas') || '[]');
        setShrineCanvas(savedCanvas);
      } catch (error) {
        console.error('神社キャンバス読み込みエラー:', error);
        setShrineCanvas([]);
      }
    };

    loadNFTCollection();
    loadShrineCanvas();

    // 新しいNFTドロップのイベントリスナー
    const handleNewNFTDrop = (event: CustomEvent) => {
      const newNFT = event.detail;
      setNftCollection(prev => [...prev, newNFT]);

      // 新しいNFTドロップのアニメーション表示
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 3000);
    };

    window.addEventListener('newNFTDropped', handleNewNFTDrop as EventListener);

    return () => {
      window.removeEventListener('newNFTDropped', handleNewNFTDrop as EventListener);
    };
  }, []);

  const handlePixelPlace = (x: number, y: number) => {
    if (isBuilding && selectedNFT) {
      // Focus Tree風の配置制限チェック
      if (!canPlaceTile(x, y, selectedNFT)) {
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 2000);
        return;
      }

      // 建設モードでNFTが選択されている場合は直接配置
      const newPixel: ShrinePixel = {
        x,
        y,
        color: selectedNFT.color,
        nftId: selectedNFT.id,
        timestamp: Date.now()
      };

      setShrineCanvas(prev => {
        const filtered = prev.filter(pixel => !(pixel.x === x && pixel.y === y));
        const newCanvas = [...filtered, newPixel];
        
        // 自動保存
        localStorage.setItem('shrineCanvas', JSON.stringify(newCanvas));
        
        return newCanvas;
      });

      triggerPlaceAnimation(x, y);

      // Focus Tree風のエネルギー消費
      consumeTileEnergy(selectedNFT);
    } else {
      // 通常モードではNFT選択モーダルを表示
      setSelectedPixelCoord({x, y});
      setShowPixelNFTModal(true);
    }
  };

  const canPlaceTile = (x: number, y: number, nft: NFTItem): boolean => {
    // 隣接配置ルール（Focus Tree風）
    if (shrineCanvas.length === 0) return true; // 最初のタイルは自由配置

    const hasAdjacentTile = shrineCanvas.some(pixel => {
      const dx = Math.abs(pixel.x - x);
      const dy = Math.abs(pixel.y - y);
      return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    });

    return hasAdjacentTile;
  };

  const consumeTileEnergy = (nft: NFTItem) => {
    // タイル配置時のエネルギー消費（デモ版）
    console.log(`${nft.name}のエネルギーを消費しました`);
  };

  const handleNFTPlaceFromModal = (nft: NFTItem) => {
    if (!selectedPixelCoord) return;

    const newPixel: ShrinePixel = {
      x: selectedPixelCoord.x,
      y: selectedPixelCoord.y,
      color: nft.color,
      nftId: nft.id,
      timestamp: Date.now()
    };

    setShrineCanvas(prev => {
      const filtered = prev.filter(pixel => !(pixel.x === selectedPixelCoord.x && pixel.y === selectedPixelCoord.y));
      const newCanvas = [...filtered, newPixel];
      
      // 自動保存
      localStorage.setItem('shrineCanvas', JSON.stringify(newCanvas));
      
      return newCanvas;
    });

    triggerPlaceAnimation(selectedPixelCoord.x, selectedPixelCoord.y);
    setShowPixelNFTModal(false);
    setSelectedPixelCoord(null);
  };

  const triggerPlaceAnimation = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pixelElement = canvas.querySelector(`[data-coord="${x}-${y}"]`) as HTMLElement;
    if (pixelElement) {
      pixelElement.classList.add('pixel-placed');
      setTimeout(() => {
        pixelElement.classList.remove('pixel-placed');
      }, 600);
    }
  };

  const clearCanvas = () => {
    setShrineCanvas([]);
    // 自動保存
    localStorage.setItem('shrineCanvas', JSON.stringify([]));
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 2000);
  };

  

  const levelUpShrine = () => {
    if (shrineLevel < 10) {
      setShrineLevel(prev => prev + 1);
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 2000);
    }
  };



  const applyIslandPreset = () => {
    const islandLayout: ShrinePixel[] = [
      // 水辺の基盤
      { x: 0, y: 8, color: '#4682B4', nftId: 'water-1', timestamp: Date.now() },
      { x: 1, y: 8, color: '#4682B4', nftId: 'water-1', timestamp: Date.now() },
      { x: 2, y: 8, color: '#4682B4', nftId: 'water-1', timestamp: Date.now() },
      { x: 0, y: 9, color: '#4682B4', nftId: 'water-1', timestamp: Date.now() },
      { x: 1, y: 9, color: '#4682B4', nftId: 'water-1', timestamp: Date.now() },
      { x: 2, y: 9, color: '#4682B4', nftId: 'water-1', timestamp: Date.now() },
      { x: 0, y: 10, color: '#4682B4', nftId: 'water-1', timestamp: Date.now() },
      { x: 1, y: 10, color: '#4682B4', nftId: 'water-1', timestamp: Date.now() },
      { x: 2, y: 10, color: '#4682B4', nftId: 'water-1', timestamp: Date.now() },
      { x: 0, y: 11, color: '#4682B4', nftId: 'water-1', timestamp: Date.now() },
      { x: 1, y: 11, color: '#4682B4', nftId: 'water-1', timestamp: Date.now() },
      { x: 2, y: 11, color: '#4682B4', nftId: 'water-1', timestamp: Date.now() },

      // 砂浜
      { x: 3, y: 8, color: '#F4A460', nftId: 'sand-1', timestamp: Date.now() },
      { x: 3, y: 9, color: '#F4A460', nftId: 'sand-1', timestamp: Date.now() },
      { x: 3, y: 10, color: '#F4A460', nftId: 'sand-1', timestamp: Date.now() },
      { x: 3, y: 11, color: '#F4A460', nftId: 'sand-1', timestamp: Date.now() },

      // 草原メインエリア
      { x: 4, y: 5, color: '#90EE90', nftId: 'grass-1', timestamp: Date.now() },
      { x: 5, y: 5, color: '#90EE90', nftId: 'grass-1', timestamp: Date.now() },
      { x: 6, y: 5, color: '#90EE90', nftId: 'grass-1', timestamp: Date.now() },
      { x: 7, y: 5, color: '#90EE90', nftId: 'grass-1', timestamp: Date.now() },
      { x: 4, y: 6, color: '#90EE90', nftId: 'grass-1', timestamp: Date.now() },
      { x: 5, y: 6, color: '#90EE90', nftId: 'grass-1', timestamp: Date.now() },
      { x: 6, y: 6, color: '#90EE90', nftId: 'grass-1', timestamp: Date.now() },
      { x: 7, y: 6, color: '#90EE90', nftId: 'grass-1', timestamp: Date.now() },
      { x: 4, y: 7, color: '#90EE90', nftId: 'grass-1', timestamp: Date.now() },
      { x: 5, y: 7, color: '#90EE90', nftId: 'grass-1', timestamp: Date.now() },
      { x: 6, y: 7, color: '#90EE90', nftId: 'grass-1', timestamp: Date.now() },
      { x: 7, y: 7, color: '#90EE90', nftId: 'grass-1', timestamp: Date.now() },

      // 中央に神社
      { x: 5, y: 4, color: '#FFD700', nftId: 'torii-1', timestamp: Date.now() },
      { x: 6, y: 3, color: '#CD853F', nftId: 'shrine-1', timestamp: Date.now() },

      // 装飾
      { x: 4, y: 4, color: '#FF6B6B', nftId: 'lantern-1', timestamp: Date.now() },
      { x: 7, y: 4, color: '#FF6B6B', nftId: 'lantern-1', timestamp: Date.now() },
      { x: 3, y: 6, color: '#FFB6C1', nftId: 'sakura-1', timestamp: Date.now() },
      { x: 8, y: 6, color: '#228B22', nftId: 'pine-1', timestamp: Date.now() },

      // 守護動物
      { x: 4, y: 8, color: '#FF8C00', nftId: 'fox-1', timestamp: Date.now() },
      { x: 7, y: 8, color: '#FF8C00', nftId: 'fox-1', timestamp: Date.now() },

      // 山と岩
      { x: 2, y: 2, color: '#696969', nftId: 'mountain-1', timestamp: Date.now() },
      { x: 9, y: 3, color: '#8B7355', nftId: 'rock-1', timestamp: Date.now() },
      { x: 1, y: 7, color: '#8B7355', nftId: 'rock-1', timestamp: Date.now() }
    ];

    setShrineCanvas(islandLayout);
    // 自動保存
    localStorage.setItem('shrineCanvas', JSON.stringify(islandLayout));
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 2000);
  };

  const getFilteredNFTs = () => {
    if (selectedCategory === 'all') {
      return nftCollection.filter(nft => nft.isOwned);
    }
    return nftCollection.filter(nft => nft.isOwned && nft.type === selectedCategory);
  };

  const getUniqueCategories = (): string[] => {
    const uniqueTypes = new Set(nftCollection.map(nft => nft.type).filter(Boolean) as string[]);
    const categories: string[] = ['all', ...Array.from(uniqueTypes)];
    return categories;
  };

  const getPixelData = (x: number, y: number) => {
    const pixel = shrineCanvas.find(p => p.x === x && p.y === y);
    if (!pixel) return null;

    const nft = nftCollection.find(n => n.id === pixel.nftId);
    return { pixel, nft };
  };

  return (
    <div className="my-shrine mystical-entrance">
      {/* 祈りの光演出 */}
      <div className="prayer-light-effect"></div>

      {/* 成功アニメーション */}
      {showSuccessAnimation && (
        <div className="success-overlay">
          <div className="success-animation">
            <div className="success-icon">🙏</div>
            <div className="success-text">祈りが届きました</div>
            <div className="success-subtext">神聖な力を感じます</div>
          </div>
        </div>
      )}



      {/* ヘッダー */}
      <div className="shrine-header">
        <div className="header-content">
          <h2>⛩️ マイ神社</h2>
          <div className="header-stats">
            <div className="stat-bubble level">
              <span className="stat-icon">⭐</span>
              <span className="stat-value">Lv.{shrineLevel}</span>
            </div>
            <div className="stat-bubble power">
              <span className="stat-icon">⚡</span>
              <span className="stat-value">{shrineCanvas.length * 10}</span>
            </div>
          </div>
        </div>
      </div>

      {/* NFT選択モーダル */}
      {showPixelNFTModal && (
        <div className="nft-select-modal">
          <div className="modal-overlay" onClick={() => setShowPixelNFTModal(false)} />
          <div className="modal-content">
            <div className="modal-header">
              <h3>📦 NFTを選択</h3>
              <button 
                className="modal-close"
                onClick={() => setShowPixelNFTModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="pixel-info">
                位置: ({selectedPixelCoord?.x}, {selectedPixelCoord?.y})
              </div>
              <div className="nft-selection-grid">
                {getFilteredNFTs().map(nft => (
                  <div
                    key={nft.id}
                    className={`nft-selection-card ${nft.animation || ''}`}
                    onClick={() => handleNFTPlaceFromModal(nft)}
                  >
                    <div 
                      className="nft-preview-small"
                      style={{ 
                        backgroundColor: nft.color,
                        borderColor: getRarityColor(nft.rarity)
                      }}
                    >
                      <span className="nft-emoji-small">{nft.pixelData || nft.emoji}</span>
                    </div>
                    <div className="nft-name-small">{nft.name}</div>
                    <div 
                      className="nft-rarity-small"
                      style={{ color: getRarityColor(nft.rarity) }}
                    >
                      ⭐ {nft.rarity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* モード切り替えタブ */}
      <div className="mode-tabs">
        <button 
          className={`mode-tab ${viewMode === 'build' ? 'active' : ''}`}
          onClick={() => setViewMode('build')}
        >
          <span className="tab-icon">🏗️</span>
          <span className="tab-label">建設</span>
        </button>
        <button 
          className={`mode-tab ${viewMode === 'collection' ? 'active' : ''}`}
          onClick={() => setViewMode('collection')}
        >
          <span className="tab-icon">🎁</span>
          <span className="tab-label">コレクション</span>
        </button>
        <button 
          className={`mode-tab ${viewMode === 'stats' ? 'active' : ''}`}
          onClick={() => setViewMode('stats')}
        >
          <span className="tab-icon">📊</span>
          <span className="tab-label">統計</span>
        </button>
      </div>

      {/* コンテンツ */}
      <div className="shrine-content">
        {viewMode === 'build' && (
          <div className="build-view">
            {/* ピクセルキャンバス */}
            <div className="canvas-container">
              <div className="canvas-header">
                <h3>🎨 神社キャンバス</h3>
                <div className="canvas-controls">
                  <button 
                    className={`control-btn build-btn ${isBuilding ? 'active' : ''}`}
                    onClick={() => setIsBuilding(!isBuilding)}
                  >
                    <span className="btn-icon">{isBuilding ? '⏸️' : '▶️'}</span>
                    <span className="btn-text">{isBuilding ? '停止' : '開始'}</span>
                  </button>
                  <button className="control-btn clear-btn" onClick={clearCanvas}>
                    <span className="btn-icon">🗑️</span>
                    <span className="btn-text">クリア</span>
                  </button>
                  
                  <button className="control-btn preset-btn" onClick={applyIslandPreset}>
                    <span className="btn-icon">🏝️</span>
                    <span className="btn-text">島プリセット</span>
                  </button>
                </div>
              </div>

              <div className="pixel-canvas" ref={canvasRef}>
                {Array.from({ length: 12 }, (_, y) => (
                  <div key={y} className="pixel-row">
                    {Array.from({ length: 12 }, (_, x) => {
                      const data = getPixelData(x, y);
                      return (
                        <div
                          key={`${x}-${y}`}
                          data-coord={`${x}-${y}`}
                          className={`pixel ${isBuilding ? 'buildable' : 'selectable'} ${data?.nft?.animation || ''}`}
                          style={{ 
                            backgroundColor: data?.pixel?.color || 'transparent',
                            border: data?.pixel ? `1px solid ${getRarityColor(data?.nft?.rarity || 'common')}` : '1px solid rgba(255,255,255,0.1)'
                          }}
                          onClick={() => handlePixelPlace(x, y)}
                        >
                          {data?.nft?.pixelData && (
                            <span className="pixel-emoji">{data.nft.pixelData}</span>
                          )}
                          {!isBuilding && !data?.pixel && (
                            <div className="pixel-placeholder">+</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* NFT選択 */}
            {selectedNFT && (
              <div className="selected-nft-info">
                <div className="selected-nft-preview">
                  <div 
                    className="nft-icon"
                    style={{ backgroundColor: selectedNFT.color }}
                  >
                    {selectedNFT.pixelData}
                  </div>
                  <div className="nft-details">
                    <div className="nft-name">{selectedNFT.name}</div>
                    <div 
                      className="nft-rarity"
                      style={{ color: getRarityColor(selectedNFT.rarity) }}
                    >
                      ⭐ {selectedNFT.rarity}
                    </div>
                  </div>
                </div>
                <button 
                  className="deselect-btn"
                  onClick={() => setSelectedNFT(null)}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}

        {viewMode === 'collection' && (
          <div className="collection-view">
            <div className="collection-header">
              <h3>🎁 NFTコレクション</h3>
              <div className="collection-stats">
                {nftCollection.filter(nft => nft.isOwned).length}/{nftCollection.length} 所持
              </div>
            </div>

            {/* カテゴリフィルター */}
            <div className="category-filters">
              {getUniqueCategories().map(category => (
                <button
                  key={category}
                  className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? '🌍 全て' : 
                   category === 'terrain' ? '🌍 地形' :
                   category === 'structure' ? '🏛️ 建物' :
                   category === 'nature' ? '🌿 自然' :
                   category === 'decoration' ? '🎨 装飾' :
                   category === 'guardian' ? '🛡️ 守護' :
                   category === 'sacred' ? '✨ 神聖' : category}
                </button>
              ))}
            </div>

            <div className="nft-grid">
              {getFilteredNFTs().map(nft => (
                <div
                  key={nft.id}
                  className={`nft-card ${selectedNFT?.id === nft.id ? 'selected' : ''} ${nft.animation || ''}`}
                  onClick={() => setSelectedNFT(nft)}
                >
                  <div 
                    className="nft-preview"
                    style={{ 
                      backgroundColor: nft.color,
                      borderColor: getRarityColor(nft.rarity)
                    }}
                  >
                    <span className="nft-emoji">{nft.pixelData}</span>
                  </div>
                  <div className="nft-info">
                    <div className="nft-name">{nft.name}</div>
                    <div 
                      className="nft-rarity"
                      style={{ color: getRarityColor(nft.rarity) }}
                    >
                      ⭐ {nft.rarity}
                    </div>
                    <div className="nft-type">{nft.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'stats' && (
          <div className="stats-view">
            <div className="stats-header">
              <h3>📊 神社統計</h3>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🏗️</div>
                <div className="stat-content">
                  <div className="stat-label">配置済みピクセル</div>
                  <div className="stat-value">{shrineCanvas.length}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🎁</div>
                <div className="stat-content">
                  <div className="stat-label">所持NFT</div>
                  <div className="stat-value">{nftCollection.filter(nft => nft.isOwned).length}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <div className="stat-label">神社レベル</div>
                  <div className="stat-value">{shrineLevel}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <div className="stat-label">神力</div>
                  <div className="stat-value">{shrineCanvas.length * 10}</div>
                </div>
              </div>
            </div>

            <div className="level-up-section">
              <button 
                className="level-up-button"
                onClick={levelUpShrine}
                disabled={shrineLevel >= 10}
              >
                <span className="btn-icon">⬆️</span>
                <span className="btn-text">
                  {shrineLevel >= 10 ? '最大レベル達成！' : `レベル${shrineLevel + 1}にアップ`}
                </span>
              </button>
            </div>

            <div className="achievement-section">
              <h4>🏆 実績</h4>
              <div className="achievements">
                <div className={`achievement ${shrineCanvas.length >= 10 ? 'unlocked' : ''}`}>
                  <span className="achievement-icon">🎯</span>
                  <span className="achievement-text">初心者建築家</span>
                </div>
                <div className={`achievement ${shrineLevel >= 5 ? 'unlocked' : ''}`}>
                  <span className="achievement-icon">⭐</span>
                  <span className="achievement-text">レベルマスター</span>
                </div>
                <div className={`achievement ${nftCollection.filter(n => n.isOwned).length >= 5 ? 'unlocked' : ''}`}>
                  <span className="achievement-icon">🎁</span>
                  <span className="achievement-text">コレクター</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyShrine;