import React, { useState, useEffect, useRef } from 'react';

const NFTHakoniwa = ({ userNFTs = [], userSBTs = [], userLevel, onHakoniwaSave }) => {
  const containerRef = useRef(null);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [placedItems, setPlacedItems] = useState([]);
  const [hakoType, setHakoType] = useState('shrine'); // shrine, garden, city, fantasy
  const [hakoName, setHakoName] = useState('my箱庭');
  const [isPlacing, setIsPlacing] = useState(false);
  const [showNFTPanel, setShowNFTPanel] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  // 箱庭テーマ設定
  const hakoThemes = {
    shrine: {
      name: '神社の庭',
      background: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 50%, #A5D6A7 100%)',
      baseElements: ['⛩️', '🌸', '🍃', '🪨'],
      description: '静寂で神聖な神社の境内'
    },
    garden: {
      name: '日本庭園',
      background: 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 50%, #81D4FA 100%)',
      baseElements: ['🌊', '🎋', '🏮', '🌺'],
      description: '美しい池と石庭のある日本庭園'
    },
    city: {
      name: '都市風景',
      background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 50%, #FFCC80 100%)',
      baseElements: ['🏢', '🚗', '🌳', '💡'],
      description: 'モダンな都市の風景'
    },
    fantasy: {
      name: '幻想世界',
      background: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 50%, #CE93D8 100%)',
      baseElements: ['✨', '🦄', '🏰', '🌙'],
      description: '魔法に満ちた幻想的な世界'
    }
  };

  // NFTをビジュアル要素に変換
  const convertNFTToElement = (nft) => {
    // NFTタイプに基づいてビジュアル要素を決定
    const typeMapping = {
      omamori: {
        symbol: '🎗️',
        category: 'blessing',
        size: 'medium',
        effect: 'glow'
      },
      story: {
        symbol: '📜',
        category: 'memory',
        size: 'small',
        effect: 'float'
      },
      art: {
        symbol: '🎨',
        category: 'decoration',
        size: 'large',
        effect: 'sparkle'
      },
      memory: {
        symbol: '💭',
        category: 'spiritual',
        size: 'medium',
        effect: 'wave'
      }
    };

    // レアリティに基づいて外観を調整
    const rarityEffects = {
      common: { glow: '#95A5A6', scale: 1.0 },
      uncommon: { glow: '#2ECC71', scale: 1.1 },
      rare: { glow: '#3498DB', scale: 1.2 },
      epic: { glow: '#9B59B6', scale: 1.3 },
      legendary: { glow: '#F39C12', scale: 1.5 }
    };

    const baseElement = typeMapping[nft.type] || typeMapping.art;
    const rarityEffect = rarityEffects[nft.rarity] || rarityEffects.common;

    return {
      id: `nft_${nft.id}`,
      nftData: nft,
      symbol: baseElement.symbol,
      category: baseElement.category,
      size: baseElement.size,
      effect: baseElement.effect,
      glowColor: rarityEffect.glow,
      scale: rarityEffect.scale,
      title: nft.title,
      rarity: nft.rarity,
      canInteract: true
    };
  };

  // SBTをビジュアル要素に変換
  const convertSBTToElement = (sbt) => {
    const roleMapping = {
      kannushi: { symbol: '⛩️', category: 'authority', effect: 'divine' },
      participant: { symbol: '👤', category: 'community', effect: 'gentle' },
      contributor: { symbol: '🤝', category: 'social', effect: 'warm' },
      leader: { symbol: '👑', category: 'leadership', effect: 'royal' }
    };

    const levelColors = {
      beginner: '#95A5A6',
      intermediate: '#2ECC71',
      advanced: '#3498DB',
      expert: '#9B59B6',
      master: '#F39C12'
    };

    const baseElement = roleMapping[sbt.roleType] || roleMapping.participant;
    
    return {
      id: `sbt_${sbt.id}`,
      sbtData: sbt,
      symbol: baseElement.symbol,
      category: baseElement.category,
      effect: baseElement.effect,
      glowColor: levelColors[sbt.contributionLevel] || levelColors.beginner,
      scale: 1.2,
      title: `${sbt.roleType} (${sbt.contributionLevel})`,
      rarity: sbt.contributionLevel,
      canInteract: true
    };
  };

  // 利用可能なNFT/SBT要素を取得
  const getAvailableElements = () => {
    const nftElements = userNFTs.map(convertNFTToElement);
    const sbtElements = userSBTs.map(convertSBTToElement);
    return [...nftElements, ...sbtElements];
  };

  // 箱庭への配置処理
  const handleContainerClick = (e) => {
    if (!selectedNFT || !isPlacing) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 境界チェック
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

    const newItem = {
      id: `placed_${Date.now()}`,
      element: selectedNFT,
      position: { x, y },
      rotation: Math.random() * 20 - 10, // -10度から+10度のランダム回転
      placedAt: new Date().toISOString()
    };

    setPlacedItems(prev => [...prev, newItem]);
    setIsPlacing(false);
    setSelectedNFT(null);
  };

  // アイテム削除
  const removeItem = (itemId) => {
    setPlacedItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedItem(null);
  };

  // 箱庭クリア
  const clearHakoniwa = () => {
    setPlacedItems([]);
    setSelectedItem(null);
  };

  // 箱庭保存
  const saveHakoniwa = () => {
    const hakoniwaSaveData = {
      name: hakoName,
      theme: hakoType,
      items: placedItems,
      createdAt: new Date().toISOString(),
      userLevel,
      nftCount: userNFTs.length,
      sbtCount: userSBTs.length
    };

    if (onHakoniwaSave) {
      onHakoniwaSave(hakoniwaSaveData);
    }

    // LocalStorageに保存
    const savedHakoniwa = JSON.parse(localStorage.getItem('hakoniwaSaves') || '[]');
    savedHakoniwa.push(hakoniwaSaveData);
    localStorage.setItem('hakoniwaSaves', JSON.stringify(savedHakoniwa));

    alert('箱庭が保存されました！');
  };

  // エフェクトスタイル生成
  const getEffectStyle = (element, isSelected = false) => {
    const baseStyle = {
      fontSize: element.size === 'large' ? '32px' : element.size === 'medium' ? '24px' : '18px',
      transform: `scale(${element.scale}) ${element.rotation ? `rotate(${element.rotation}deg)` : ''}`,
      filter: `drop-shadow(0 0 ${isSelected ? '8px' : '4px'} ${element.glowColor})`,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      userSelect: 'none'
    };

    // エフェクト別のアニメーション
    const animations = {
      glow: 'nft-glow 2s ease-in-out infinite alternate',
      float: 'nft-float 3s ease-in-out infinite',
      sparkle: 'nft-sparkle 1.5s ease-in-out infinite',
      wave: 'nft-wave 2.5s ease-in-out infinite',
      divine: 'nft-divine 4s ease-in-out infinite',
      gentle: 'nft-gentle 3s ease-in-out infinite',
      warm: 'nft-warm 2s ease-in-out infinite',
      royal: 'nft-royal 3s ease-in-out infinite'
    };

    if (animations[element.effect]) {
      baseStyle.animation = animations[element.effect];
    }

    return baseStyle;
  };

  // ウィンドウリサイズ対応
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && showNFTPanel) {
        setShowNFTPanel(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showNFTPanel]);

  // CSS keyframes注入
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes nft-glow {
        0% { filter: drop-shadow(0 0 4px ${selectedItem?.element?.glowColor || '#95A5A6'}); }
        100% { filter: drop-shadow(0 0 12px ${selectedItem?.element?.glowColor || '#95A5A6'}); }
      }
      @keyframes nft-float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
      @keyframes nft-sparkle {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.1); }
      }
      @keyframes nft-wave {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(5deg); }
        75% { transform: rotate(-5deg); }
      }
      @keyframes nft-divine {
        0%, 100% { filter: hue-rotate(0deg) brightness(1); }
        50% { filter: hue-rotate(45deg) brightness(1.2); }
      }
      @keyframes nft-gentle {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes nft-warm {
        0%, 100% { filter: sepia(0%); }
        50% { filter: sepia(20%); }
      }
      @keyframes nft-royal {
        0%, 100% { transform: rotate(0deg) scale(1); }
        25% { transform: rotate(2deg) scale(1.05); }
        75% { transform: rotate(-2deg) scale(1.05); }
      }
    `;
    document.head.appendChild(style);
    
    return () => document.head.removeChild(style);
  }, [selectedItem]);

  return (
    <div style={{ 
      padding: '20px', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      {/* ヘッダー */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <input
            type="text"
            value={hakoName}
            onChange={(e) => setHakoName(e.target.value)}
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              padding: '8px 12px',
              maxWidth: '200px'
            }}
          />
          
          <select
            value={hakoType}
            onChange={(e) => setHakoType(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            {Object.entries(hakoThemes).map(([key, theme]) => (
              <option key={key} value={key}>{theme.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowNFTPanel(!showNFTPanel)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '20px',
              background: showNFTPanel ? '#3498db' : '#95a5a6',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            🎨 {showNFTPanel ? 'パネル非表示' : 'パネル表示'}
          </button>
          
          <button
            onClick={clearHakoniwa}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '20px',
              background: '#e67e22',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            🗑️ クリア
          </button>
          
          <button
            onClick={saveHakoniwa}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '20px',
              background: '#27ae60',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            💾 保存
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '15px' }}>
        {/* NFTパネル */}
        {showNFTPanel && (
          <div style={{
            background: '#f8f9fa',
            borderRadius: '15px',
            padding: '15px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '16px', margin: 0, color: '#2c3e50' }}>
                🎨 NFT/SBTコレクション
              </h3>
              <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                {hakoThemes[hakoType].description}
              </div>
            </div>

            {isPlacing && (
              <div style={{
                background: '#3498db20',
                borderRadius: '8px',
                padding: '8px 12px',
                marginBottom: '15px',
                fontSize: '12px',
                color: '#2c3e50',
                textAlign: 'center'
              }}>
                📍 箱庭内をクリックして {selectedNFT?.title} を配置
              </div>
            )}

            {/* 利用可能NFT/SBT - 横スクロール */}
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              overflowX: 'auto',
              paddingBottom: '10px'
            }}>
              {getAvailableElements().map((element) => (
                <button
                  key={element.id}
                  onClick={() => {
                    setSelectedNFT(element);
                    setIsPlacing(true);
                  }}
                  style={{
                    minWidth: '120px',
                    padding: '10px',
                    border: `2px solid ${selectedNFT?.id === element.id ? element.glowColor : '#e1e5e9'}`,
                    borderRadius: '10px',
                    background: selectedNFT?.id === element.id ? `${element.glowColor}20` : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{element.symbol}</span>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#2c3e50' }}>
                    {element.title.length > 10 ? element.title.substring(0, 10) + '...' : element.title}
                  </div>
                  <div style={{ fontSize: '10px', color: '#7f8c8d' }}>
                    {element.rarity}
                  </div>
                </button>
              ))}
            </div>

            {/* 統計情報 - 横並び */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              padding: '8px',
              background: 'white',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#2c3e50'
            }}>
              <div><strong>配置:</strong> {placedItems.length}</div>
              <div><strong>NFT:</strong> {userNFTs.length}</div>
              <div><strong>SBT:</strong> {userSBTs.length}</div>
              <div><strong>Lv:</strong> {userLevel}</div>
            </div>
          </div>
        )}

        {/* 箱庭エリア */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: showNFTPanel ? '500px' : '650px'
        }}>
          <div
            ref={containerRef}
            onClick={handleContainerClick}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '600px',
              background: hakoThemes[hakoType].background,
              borderRadius: '15px',
              border: '3px solid #34495e',
              position: 'relative',
              cursor: isPlacing ? 'crosshair' : 'default',
              overflow: 'hidden'
            }}
          >
            {/* 配置済みアイテム */}
            {placedItems.map((item) => (
              <div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(selectedItem?.id === item.id ? null : item);
                }}
                style={{
                  position: 'absolute',
                  left: item.position.x - 16,
                  top: item.position.y - 16,
                  ...getEffectStyle(item.element, selectedItem?.id === item.id),
                  transform: `${getEffectStyle(item.element).transform} rotate(${item.rotation}deg)`
                }}
              >
                {item.element.symbol}
                
                {/* 選択時の削除ボタン */}
                {selectedItem?.id === item.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: 'none',
                      background: '#e74c3c',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {/* テーマ装飾要素 */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              display: 'flex',
              gap: '10px',
              opacity: 0.6
            }}>
              {hakoThemes[hakoType].baseElements.map((element, index) => (
                <span key={index} style={{ fontSize: '24px' }}>{element}</span>
              ))}
            </div>
          </div>

          {/* 操作ガイド */}
          <div style={{
            marginTop: '10px',
            fontSize: '14px',
            color: '#7f8c8d',
            textAlign: 'center'
          }}>
            {isPlacing 
              ? `🎯 ${selectedNFT?.title}を配置中 - 箱庭内をクリック`
              : selectedItem
              ? `✨ ${selectedItem.element.title}を選択中 - 削除ボタンで除去`
              : '🎨 NFT/SBTを選択して箱庭をデザインしよう'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTHakoniwa;