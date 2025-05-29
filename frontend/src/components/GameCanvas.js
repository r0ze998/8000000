import React, { useEffect, useRef, useState } from 'react';
import { ShrineVillageMap } from '../game/ShrineVillageMap';
import './GameCanvas.css';

const GameCanvas = ({ userProfile, onCulturalCapitalUpdate }) => {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const [gameState, setGameState] = useState({
    isLoading: true,
    showControls: false,
    showStats: true
  });
  
  const [playerStats, setPlayerStats] = useState({
    culturalCapital: userProfile?.culturalCapital || 0,
    level: userProfile?.level || 1,
    beltRank: userProfile?.beltRank || '白帯',
    buildingCount: 0
  });
  
  useEffect(() => {
    if (canvasRef.current && !gameRef.current) {
      initGame();
    }
    
    return () => {
      if (gameRef.current) {
        gameRef.current.engine.stop();
      }
    };
  }, []);
  
  const initGame = async () => {
    const canvas = canvasRef.current;
    
    // キャンバスサイズ設定
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // ゲームデータ
    const gameData = {
      playerName: userProfile?.name || 'プレイヤー',
      level: userProfile?.level || 1,
      culturalCapital: userProfile?.culturalCapital || 0,
      beltRank: getBeltFromCapital(userProfile?.culturalCapital || 0)
    };
    
    // ゲーム初期化
    gameRef.current = new ShrineVillageMap(canvas, gameData);
    
    // ゲーム状態の監視
    const updateInterval = setInterval(() => {
      if (gameRef.current) {
        setPlayerStats({
          culturalCapital: gameRef.current.gameData.culturalCapital,
          level: gameRef.current.player.level,
          beltRank: gameRef.current.player.beltRank,
          buildingCount: gameRef.current.buildings.size
        });
      }
    }, 1000);
    
    setGameState(prev => ({ ...prev, isLoading: false }));
    
    return () => clearInterval(updateInterval);
  };
  
  const getBeltFromCapital = (capital) => {
    if (capital >= 10000) return '金帯';
    if (capital >= 6000) return '黒帯';
    if (capital >= 4000) return '紅帯';
    if (capital >= 2500) return '茶帯';
    if (capital >= 1500) return '紫帯';
    if (capital >= 1000) return '青帯';
    if (capital >= 600) return '緑帯';
    if (capital >= 300) return '橙帯';
    if (capital >= 100) return '黄帯';
    return '白帯';
  };
  
  const handleControlsToggle = () => {
    setGameState(prev => ({ ...prev, showControls: !prev.showControls }));
  };
  
  const handleStatsToggle = () => {
    setGameState(prev => ({ ...prev, showStats: !prev.showStats }));
  };
  
  const handleSaveGame = () => {
    if (gameRef.current) {
      gameRef.current.saveGame();
      alert('ゲームを保存しました！');
    }
  };
  
  const handleLoadGame = () => {
    if (gameRef.current) {
      gameRef.current.loadGame();
      alert('ゲームを読み込みました！');
    }
  };
  
  const handleScreenshot = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `shrine-village-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };
  
  return (
    <div className="game-container">
      {gameState.isLoading && (
        <div className="loading-screen">
          <div className="loading-spinner">⛩️</div>
          <p>神社村を読み込み中...</p>
        </div>
      )}
      
      <canvas 
        ref={canvasRef}
        className="game-canvas"
        width={1280}
        height={720}
      />
      
      {/* ゲームUI */}
      {!gameState.isLoading && (
        <>
          {/* ステータスパネル */}
          {gameState.showStats && (
            <div className="stats-panel">
              <div className="stat-item">
                <span className="stat-label">文化資本</span>
                <span className="stat-value">{playerStats.culturalCapital.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">レベル</span>
                <span className="stat-value">{playerStats.level}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">文化帯</span>
                <span className={`stat-value belt-${playerStats.beltRank}`}>
                  {playerStats.beltRank}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">建物</span>
                <span className="stat-value">{playerStats.buildingCount}</span>
              </div>
            </div>
          )}
          
          {/* コントロールパネル */}
          {gameState.showControls && (
            <div className="controls-panel">
              <h3>操作方法</h3>
              <div className="control-list">
                <div className="control-item">
                  <kbd>クリック</kbd> 移動
                </div>
                <div className="control-item">
                  <kbd>B</kbd> 建設メニュー
                </div>
                <div className="control-item">
                  <kbd>P</kbd> お祈り
                </div>
                <div className="control-item">
                  <kbd>C</kbd> お祝い
                </div>
                <div className="control-item">
                  <kbd>M</kbd> 瞑想
                </div>
                <div className="control-item">
                  <kbd>+/-</kbd> ズーム
                </div>
                <div className="control-item">
                  <kbd>マウスホイール</kbd> ズーム
                </div>
              </div>
            </div>
          )}
          
          {/* ツールバー */}
          <div className="game-toolbar">
            <button 
              className="toolbar-btn"
              onClick={handleControlsToggle}
              title="操作方法"
            >
              🎮
            </button>
            <button 
              className="toolbar-btn"
              onClick={handleStatsToggle}
              title="ステータス表示"
            >
              📊
            </button>
            <button 
              className="toolbar-btn"
              onClick={handleSaveGame}
              title="セーブ"
            >
              💾
            </button>
            <button 
              className="toolbar-btn"
              onClick={handleLoadGame}
              title="ロード"
            >
              📂
            </button>
            <button 
              className="toolbar-btn"
              onClick={handleScreenshot}
              title="スクリーンショット"
            >
              📸
            </button>
          </div>
          
          {/* ミニマップ（将来実装） */}
          <div className="minimap">
            <canvas width={200} height={150} />
          </div>
          
          {/* クエストログ */}
          <div className="quest-log">
            <h3>🎯 クエスト</h3>
            <div className="quest-item active">
              <span className="quest-title">初めての参拝</span>
              <span className="quest-progress">0/1</span>
            </div>
            <div className="quest-item">
              <span className="quest-title">建物を3つ建設</span>
              <span className="quest-progress">{playerStats.buildingCount}/3</span>
            </div>
            <div className="quest-item">
              <span className="quest-title">黄帯を獲得</span>
              <span className="quest-progress">
                {playerStats.culturalCapital >= 100 ? '✅' : '❌'}
              </span>
            </div>
          </div>
          
          {/* アチーブメント通知 */}
          <div className="achievement-notifications">
            {/* 動的に表示される実績通知 */}
          </div>
        </>
      )}
    </div>
  );
};

export default GameCanvas;