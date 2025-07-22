import React, { useState, useEffect } from 'react';
import PixelCanvas from './PixelCanvas';
import NFTCollection from './NFTCollection';

const MyShrineScreen = ({ playerData, updatePlayerData, addNFT }) => {
  const [activeMode, setActiveMode] = useState('build');
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [
    { key: 'all', name: '🌍 全て', emoji: '🌍' },
    { key: 'terrain', name: '🌍 地形', emoji: '🌍' },
    { key: 'building', name: '🏛️ 建物', emoji: '🏛️' },
    { key: 'nature', name: '🌿 自然', emoji: '🌿' },
    { key: 'decoration', name: '🎨 装飾', emoji: '🎨' },
    { key: 'guardian', name: '🛡️ 守護', emoji: '🛡️' },
    { key: 'sacred', name: '✨ 神聖', emoji: '✨' }
  ];

  // Calculate shrine level based on placed NFTs
  const placedNFTs = playerData.nftCollection.filter(nft => nft.placed);
  const shrineLevel = Math.floor(placedNFTs.length / 10) + 1;
  const godPower = placedNFTs.length * 10;

  const handlePixelClick = (index) => {
    if (!selectedNFT || !isBuilding) return;

    // Check if pixel is already occupied
    const existingNFT = playerData.nftCollection.find(nft => nft.placed && nft.position === index);
    if (existingNFT) {
      alert('このピクセルは既に使用されています');
      return;
    }

    // Place NFT
    const updatedCollection = playerData.nftCollection.map(nft =>
      nft.id === selectedNFT.id
        ? { ...nft, placed: true, position: index }
        : nft
    );

    updatePlayerData({ 
      nftCollection: updatedCollection,
      shrineLevel: Math.floor(updatedCollection.filter(n => n.placed).length / 10) + 1,
      godPower: updatedCollection.filter(n => n.placed).length * 10
    });

    setSelectedNFT(null);
    setIsBuilding(false);
  };

  const handleNFTSelect = (nft) => {
    if (nft.placed) {
      // Remove NFT from canvas
      const updatedCollection = playerData.nftCollection.map(n =>
        n.id === nft.id
          ? { ...n, placed: false, position: null }
          : n
      );
      updatePlayerData({ 
        nftCollection: updatedCollection,
        shrineLevel: Math.floor(updatedCollection.filter(n => n.placed).length / 10) + 1,
        godPower: updatedCollection.filter(n => n.placed).length * 10
      });
    } else {
      setSelectedNFT(nft);
      setIsBuilding(true);
      setActiveMode('build');
    }
  };

  const handleClearCanvas = () => {
    if (window.confirm('本当に全てのピクセルをクリアしますか？')) {
      const updatedCollection = playerData.nftCollection.map(nft => ({
        ...nft,
        placed: false,
        position: null
      }));
      updatePlayerData({ 
        nftCollection: updatedCollection,
        shrineLevel: 1,
        godPower: 0
      });
    }
  };

  const handleIslandPreset = () => {
    // Create a simple island preset pattern
    const presetPositions = [
      { row: 5, col: 5 }, { row: 5, col: 6 }, { row: 5, col: 7 },
      { row: 6, col: 4 }, { row: 6, col: 5 }, { row: 6, col: 6 }, { row: 6, col: 7 }, { row: 6, col: 8 },
      { row: 7, col: 3 }, { row: 7, col: 4 }, { row: 7, col: 5 }, { row: 7, col: 6 }, { row: 7, col: 7 }, { row: 7, col: 8 }, { row: 7, col: 9 }
    ];

    const availableNFTs = playerData.nftCollection.filter(nft => !nft.placed).slice(0, presetPositions.length);
    
    if (availableNFTs.length === 0) {
      alert('配置可能なNFTがありません');
      return;
    }

    const updatedCollection = playerData.nftCollection.map(nft => {
      const nftIndex = availableNFTs.findIndex(available => available.id === nft.id);
      if (nftIndex !== -1 && nftIndex < presetPositions.length) {
        const position = presetPositions[nftIndex];
        const pixelIndex = position.row * 12 + position.col;
        return { ...nft, placed: true, position: pixelIndex };
      }
      return nft;
    });

    updatePlayerData({ 
      nftCollection: updatedCollection,
      shrineLevel: Math.floor(updatedCollection.filter(n => n.placed).length / 10) + 1,
      godPower: updatedCollection.filter(n => n.placed).length * 10
    });
  };

  const levelUp = () => {
    if (shrineLevel >= 10) {
      alert('既に最大レベルに達しています！');
      return;
    }

    const requiredNFTs = shrineLevel * 10;
    if (placedNFTs.length < requiredNFTs) {
      alert(`レベルアップには${requiredNFTs}個のNFTを配置する必要があります`);
      return;
    }

    updatePlayerData({
      shrineLevel: shrineLevel + 1
    });
    alert(`神社がレベル${shrineLevel + 1}にアップしました！`);
  };

  const filteredNFTs = filterCategory === 'all' 
    ? playerData.nftCollection 
    : playerData.nftCollection.filter(nft => nft.category === filterCategory);

  const renderModeContent = () => {
    switch (activeMode) {
      case 'build':
        return (
          <div>
            {/* Pixel Canvas */}
            <div style={{ marginBottom: '1.5rem' }}>
              <PixelCanvas
                nftCollection={playerData.nftCollection}
                onPixelClick={handlePixelClick}
                selectedNFT={selectedNFT}
                isBuilding={isBuilding}
              />
            </div>

            {/* Canvas Controls */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginBottom: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <button
                className={`btn ${isBuilding ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setIsBuilding(!isBuilding)}
                disabled={!selectedNFT}
              >
                {isBuilding ? '⏸️ 停止' : '▶️ 建設開始'}
              </button>
              
              <button
                className="btn btn-secondary"
                onClick={handleClearCanvas}
                style={{ 
                  background: 'rgba(255, 107, 107, 0.2)',
                  borderColor: 'rgba(255, 107, 107, 0.4)',
                  color: '#FF6B6B'
                }}
              >
                🗑️ クリア
              </button>
              
              <button
                className="btn btn-secondary"
                onClick={handleIslandPreset}
              >
                🏝️ 島プリセット
              </button>
            </div>

            {/* Selected NFT Display */}
            {selectedNFT && (
              <div style={{
                background: 'rgba(255, 215, 0, 0.1)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{ 
                  color: '#FFD700', 
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  選択中のNFT
                  <button
                    onClick={() => {
                      setSelectedNFT(null);
                      setIsBuilding(false);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.6)',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    ✕
                  </button>
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: selectedNFT.color || '#FFD700',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    {selectedNFT.emoji}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{selectedNFT.name}</div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: 'rgba(255, 255, 255, 0.7)' 
                    }}>
                      {selectedNFT.rarity}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'collection':
        return (
          <NFTCollection
            nftCollection={filteredNFTs}
            onNFTSelect={handleNFTSelect}
            selectedNFT={selectedNFT}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            categories={categories}
          />
        );

      case 'stats':
        return (
          <div>
            {/* Main Stats */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
              <div className="stat-item">
                <span className="stat-icon">🏗️</span>
                <div className="stat-value">{placedNFTs.length}</div>
                <div className="stat-label">配置済みピクセル</div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🎁</span>
                <div className="stat-value">{playerData.nftCollection.length}</div>
                <div className="stat-label">所持NFT</div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⭐</span>
                <div className="stat-value">{shrineLevel}</div>
                <div className="stat-label">神社レベル</div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⚡</span>
                <div className="stat-value">{godPower}</div>
                <div className="stat-label">神力</div>
              </div>
            </div>

            {/* Level Up Section */}
            <div className="section">
              <h4 className="section-title">⬆️ レベルアップ</h4>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>
                    現在レベル: {shrineLevel}
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: 'rgba(255, 255, 255, 0.7)' 
                  }}>
                    次のレベルまで: {(shrineLevel * 10) - placedNFTs.length} NFT
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={levelUp}
                  disabled={shrineLevel >= 10 || placedNFTs.length < shrineLevel * 10}
                >
                  ⬆️ レベルアップ
                </button>
              </div>
              
              <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min((placedNFTs.length / (shrineLevel * 10)) * 100, 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* Achievements */}
            <div className="section">
              <h4 className="section-title">🏆 実績</h4>
              <div className="grid grid-3" style={{ gap: '1rem' }}>
                <div className={`card ${placedNFTs.length >= 1 ? 'rarity-common' : ''}`}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>
                      初心者建築家
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                      最初のピクセルを配置
                    </div>
                    {placedNFTs.length >= 1 && (
                      <div style={{ 
                        marginTop: '0.5rem', 
                        color: '#48BB78', 
                        fontWeight: 'bold' 
                      }}>
                        ✓ 達成
                      </div>
                    )}
                  </div>
                </div>

                <div className={`card ${shrineLevel >= 5 ? 'rarity-rare' : ''}`}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>
                      レベルマスター
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                      レベル5に到達
                    </div>
                    {shrineLevel >= 5 && (
                      <div style={{ 
                        marginTop: '0.5rem', 
                        color: '#9F7AEA', 
                        fontWeight: 'bold' 
                      }}>
                        ✓ 達成
                      </div>
                    )}
                  </div>
                </div>

                <div className={`card ${playerData.nftCollection.length >= 20 ? 'rarity-legendary' : ''}`}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>
                      コレクター
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                      20個のNFTを収集
                    </div>
                    {playerData.nftCollection.length >= 20 && (
                      <div style={{ 
                        marginTop: '0.5rem', 
                        color: '#FFD700', 
                        fontWeight: 'bold' 
                      }}>
                        ✓ 達成
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="section">
        <h2 className="section-title">⛩️ マイ神社</h2>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            padding: '0.5rem 1rem',
            background: 'rgba(255, 215, 0, 0.2)',
            border: '1px solid rgba(255, 215, 0, 0.4)',
            borderRadius: '20px',
            fontSize: '0.9rem',
            color: '#FFD700'
          }}>
            ⭐ Lv.{shrineLevel}
          </div>
          <div style={{
            padding: '0.5rem 1rem',
            background: 'rgba(66, 153, 225, 0.2)',
            border: '1px solid rgba(66, 153, 225, 0.4)',
            borderRadius: '20px',
            fontSize: '0.9rem',
            color: '#4299E1'
          }}>
            ⚡ {godPower}
          </div>
        </div>
      </div>

      {/* Mode Toggle Tabs */}
      <div className="section">
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '1.5rem',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '0.5rem',
          borderRadius: '12px'
        }}>
          <button
            className={`btn ${activeMode === 'build' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveMode('build')}
            style={{ flex: 1 }}
          >
            🏗️ 建設
          </button>
          <button
            className={`btn ${activeMode === 'collection' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveMode('collection')}
            style={{ flex: 1 }}
          >
            🎁 コレクション
          </button>
          <button
            className={`btn ${activeMode === 'stats' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveMode('stats')}
            style={{ flex: 1 }}
          >
            📊 統計
          </button>
        </div>

        {renderModeContent()}
      </div>
    </div>
  );
};

export default MyShrineScreen;