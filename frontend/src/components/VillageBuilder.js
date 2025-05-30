import React, { useState, useEffect, useRef } from 'react';
import { BUILDING_TYPES, VILLAGE_GRID, RESOURCES, BUILDING_TEMPLATES } from '../constants/villageBuilding';
import BuildingPalette from './BuildingPalette';
import ResourcePanel from './ResourcePanel';
import './VillageBuilder.css';

const VillageBuilder = ({ playerResources, onResourceUpdate, onSaveVillage }) => {
  const canvasRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [villageGrid, setVillageGrid] = useState(
    Array(VILLAGE_GRID.height).fill().map(() => Array(VILLAGE_GRID.width).fill(null))
  );
  const [hoveredCell, setHoveredCell] = useState({ x: -1, y: -1 });
  const [buildingMode, setBuildingMode] = useState('build'); // 'build', 'delete', 'move'
  const [showTemplates, setShowTemplates] = useState(false);
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // キャンバスの初期化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // 高DPI対応
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    drawVillage(ctx);
  }, [villageGrid, hoveredCell, zoom, cameraOffset]);

  // 村の描画
  const drawVillage = (ctx) => {
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // グリッドの描画
    drawGrid(ctx);
    
    // 建物の描画
    drawBuildings(ctx);
    
    // ホバー効果の描画
    drawHoverEffect(ctx);
  };

  // グリッドの描画
  const drawGrid = (ctx) => {
    const cellSize = VILLAGE_GRID.cellSize * zoom;
    
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // 垂直線
    for (let x = 0; x <= VILLAGE_GRID.width; x++) {
      const screenX = x * cellSize + cameraOffset.x;
      ctx.beginPath();
      ctx.moveTo(screenX, cameraOffset.y);
      ctx.lineTo(screenX, VILLAGE_GRID.height * cellSize + cameraOffset.y);
      ctx.stroke();
    }
    
    // 水平線
    for (let y = 0; y <= VILLAGE_GRID.height; y++) {
      const screenY = y * cellSize + cameraOffset.y;
      ctx.beginPath();
      ctx.moveTo(cameraOffset.x, screenY);
      ctx.lineTo(VILLAGE_GRID.width * cellSize + cameraOffset.x, screenY);
      ctx.stroke();
    }
    
    // ゾーンの色分け（オプション）
    drawZones(ctx);
  };

  // ゾーンの描画
  const drawZones = (ctx) => {
    // 後で実装: 特別なゾーンのハイライト表示
  };

  // 建物の描画
  const drawBuildings = (ctx) => {
    const cellSize = VILLAGE_GRID.cellSize * zoom;
    
    villageGrid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          drawBuilding(ctx, cell, x, y, cellSize);
        }
      });
    });
  };

  // 個別の建物描画
  const drawBuilding = (ctx, building, gridX, gridY, cellSize) => {
    const screenX = gridX * cellSize + cameraOffset.x;
    const screenY = gridY * cellSize + cameraOffset.y;
    
    // 建物のタイプに応じた描画
    const buildingInfo = BUILDING_TYPES[building.category]?.[building.type];
    if (!buildingInfo) return;
    
    // 基本的な矩形描画（後でスプライトに置き換え）
    ctx.fillStyle = getBuildingColor(building.category);
    ctx.fillRect(screenX + 2, screenY + 2, cellSize - 4, cellSize - 4);
    
    // 建物名の表示
    ctx.fillStyle = '#333';
    ctx.font = `${Math.max(8, 10 * zoom)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(
      buildingInfo.name,
      screenX + cellSize / 2,
      screenY + cellSize / 2 + 4
    );
  };

  // 建物カテゴリの色取得
  const getBuildingColor = (category) => {
    const colors = {
      shrine: '#ff6b6b',
      temple: '#8b4513',
      decoration: '#4ecdc4',
      infrastructure: '#95a5a6'
    };
    return colors[category] || '#bdc3c7';
  };

  // ホバー効果の描画
  const drawHoverEffect = (ctx) => {
    if (hoveredCell.x >= 0 && hoveredCell.y >= 0 && selectedBuilding) {
      const cellSize = VILLAGE_GRID.cellSize * zoom;
      const screenX = hoveredCell.x * cellSize + cameraOffset.x;
      const screenY = hoveredCell.y * cellSize + cameraOffset.y;
      
      // 建設可能かチェック
      const canBuild = canPlaceBuilding(hoveredCell.x, hoveredCell.y, selectedBuilding);
      
      ctx.fillStyle = canBuild ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)';
      ctx.fillRect(screenX, screenY, cellSize, cellSize);
      
      ctx.strokeStyle = canBuild ? '#4CAF50' : '#F44336';
      ctx.lineWidth = 2;
      ctx.strokeRect(screenX, screenY, cellSize, cellSize);
    }
  };

  // マウスイベントハンドラ
  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - cameraOffset.x;
    const y = e.clientY - rect.top - cameraOffset.y;
    
    const gridX = Math.floor(x / (VILLAGE_GRID.cellSize * zoom));
    const gridY = Math.floor(y / (VILLAGE_GRID.cellSize * zoom));
    
    setHoveredCell({ x: gridX, y: gridY });
  };

  const handleMouseClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - cameraOffset.x;
    const y = e.clientY - rect.top - cameraOffset.y;
    
    const gridX = Math.floor(x / (VILLAGE_GRID.cellSize * zoom));
    const gridY = Math.floor(y / (VILLAGE_GRID.cellSize * zoom));
    
    if (buildingMode === 'build' && selectedBuilding) {
      placeBuilding(gridX, gridY, selectedBuilding);
    } else if (buildingMode === 'delete') {
      removeBuilding(gridX, gridY);
    }
  };

  // 建物の配置
  const placeBuilding = (x, y, buildingType) => {
    if (!canPlaceBuilding(x, y, buildingType)) return;
    
    const buildingInfo = BUILDING_TYPES[buildingType.category]?.[buildingType.type];
    if (!buildingInfo) return;
    
    // リソースチェック
    if (!hasEnoughResources(buildingInfo.cost)) {
      alert('リソースが不足しています！');
      return;
    }
    
    // リソース消費
    const newResources = { ...playerResources };
    Object.entries(buildingInfo.cost).forEach(([resource, amount]) => {
      newResources[resource] = (newResources[resource] || 0) - amount;
    });
    
    // 建物配置
    const newGrid = [...villageGrid];
    newGrid[y][x] = {
      ...buildingType,
      id: Date.now() + Math.random(),
      placedAt: new Date()
    };
    
    setVillageGrid(newGrid);
    onResourceUpdate(newResources);
  };

  // 建物配置可能性チェック
  const canPlaceBuilding = (x, y, buildingType) => {
    if (x < 0 || x >= VILLAGE_GRID.width || y < 0 || y >= VILLAGE_GRID.height) {
      return false;
    }
    
    // 既に建物がある場合
    if (villageGrid[y][x]) {
      return false;
    }
    
    const buildingInfo = BUILDING_TYPES[buildingType.category]?.[buildingType.type];
    if (!buildingInfo) return false;
    
    // サイズチェック（将来的に複数セル建物用）
    const { width, height } = buildingInfo.size;
    for (let dy = 0; dy < height; dy++) {
      for (let dx = 0; dx < width; dx++) {
        if (x + dx >= VILLAGE_GRID.width || y + dy >= VILLAGE_GRID.height) {
          return false;
        }
        if (villageGrid[y + dy] && villageGrid[y + dy][x + dx]) {
          return false;
        }
      }
    }
    
    return true;
  };

  // 建物の削除
  const removeBuilding = (x, y) => {
    if (x < 0 || x >= VILLAGE_GRID.width || y < 0 || y >= VILLAGE_GRID.height) return;
    
    const newGrid = [...villageGrid];
    newGrid[y][x] = null;
    setVillageGrid(newGrid);
  };

  // リソース所持チェック
  const hasEnoughResources = (cost) => {
    return Object.entries(cost).every(([resource, amount]) => {
      return (playerResources[resource] || 0) >= amount;
    });
  };

  // テンプレート適用
  const applyTemplate = (template) => {
    const templateData = BUILDING_TEMPLATES[template];
    if (!templateData) return;
    
    // リソースチェック
    if (!hasEnoughResources(templateData.cost)) {
      alert('テンプレート建設にはリソースが不足しています！');
      return;
    }
    
    // グリッドクリア
    const newGrid = Array(VILLAGE_GRID.height).fill().map(() => Array(VILLAGE_GRID.width).fill(null));
    
    // 建物配置
    templateData.buildings.forEach(building => {
      const { type, variant, position } = building;
      const category = Object.keys(BUILDING_TYPES).find(cat => 
        BUILDING_TYPES[cat][type]
      );
      
      if (category && position.x < VILLAGE_GRID.width && position.y < VILLAGE_GRID.height) {
        newGrid[position.y][position.x] = {
          type,
          category,
          variant,
          id: Date.now() + Math.random()
        };
      }
    });
    
    // リソース消費
    const newResources = { ...playerResources };
    Object.entries(templateData.cost).forEach(([resource, amount]) => {
      newResources[resource] = (newResources[resource] || 0) - amount;
    });
    
    setVillageGrid(newGrid);
    onResourceUpdate(newResources);
    setShowTemplates(false);
  };

  return (
    <div className="village-builder">
      {/* ツールバー */}
      <div className="toolbar">
        <div className="mode-selector">
          <button 
            className={buildingMode === 'build' ? 'active' : ''}
            onClick={() => setBuildingMode('build')}
          >
            🏗️ 建設
          </button>
          <button 
            className={buildingMode === 'delete' ? 'active' : ''}
            onClick={() => setBuildingMode('delete')}
          >
            🗑️ 削除
          </button>
          <button 
            className={buildingMode === 'move' ? 'active' : ''}
            onClick={() => setBuildingMode('move')}
          >
            ↔️ 移動
          </button>
        </div>
        
        <div className="template-controls">
          <button onClick={() => setShowTemplates(!showTemplates)}>
            📋 テンプレート
          </button>
          <button onClick={() => onSaveVillage(villageGrid)}>
            💾 保存
          </button>
        </div>
        
        <div className="view-controls">
          <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
            🔍-
          </button>
          <span>{(zoom * 100).toFixed(0)}%</span>
          <button onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
            🔍+
          </button>
        </div>
      </div>

      {/* メインエリア */}
      <div className="main-area">
        {/* 建物パレット */}
        <BuildingPalette
          onSelectBuilding={setSelectedBuilding}
          selectedBuilding={selectedBuilding}
          playerResources={playerResources}
        />
        
        {/* キャンバス */}
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            className="village-canvas"
            onMouseMove={handleMouseMove}
            onClick={handleMouseClick}
            width={800}
            height={600}
          />
        </div>
        
        {/* リソースパネル */}
        <ResourcePanel resources={playerResources} />
      </div>

      {/* テンプレート選択モーダル */}
      {showTemplates && (
        <div className="template-modal">
          <div className="modal-content">
            <h3>神社村テンプレート</h3>
            <div className="template-grid">
              {Object.entries(BUILDING_TEMPLATES).map(([key, template]) => (
                <div key={key} className="template-card">
                  <h4>{template.name}</h4>
                  <p>{template.description}</p>
                  <div className="template-cost">
                    {Object.entries(template.cost).map(([resource, amount]) => (
                      <span key={resource} className="cost-item">
                        {RESOURCES[resource]?.icon} {amount}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => applyTemplate(key)}
                    disabled={!hasEnoughResources(template.cost)}
                  >
                    適用
                  </button>
                </div>
              ))}
            </div>
            <button 
              className="close-button"
              onClick={() => setShowTemplates(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VillageBuilder;