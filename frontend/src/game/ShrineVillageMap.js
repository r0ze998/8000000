import { SpriteEngine } from './SpriteEngine';
import { CharacterSprite } from './CharacterSprites';

export class ShrineVillageMap {
  constructor(canvas, gameData) {
    this.canvas = canvas;
    this.gameData = gameData;
    this.engine = new SpriteEngine(canvas);
    
    // マップ設定
    this.mapWidth = 1600;
    this.mapHeight = 1200;
    this.tileSize = 32;
    
    // ゲーム状態
    this.player = null;
    this.buildings = new Map();
    this.npcs = [];
    this.interactables = [];
    
    // UI状態
    this.selectedBuilding = null;
    this.showBuildMenu = false;
    this.showInfoPanel = false;
    
    // マップレイヤー
    this.terrainLayer = [];
    this.decorationLayer = [];
    
    this.init();
  }
  
  async init() {
    // アセット読み込み
    await this.loadAssets();
    
    // マップ生成
    this.generateTerrain();
    this.createPlayer();
    this.createInitialBuildings();
    this.createNPCs();
    
    // イベントリスナー
    this.setupEventListeners();
    
    // ゲーム開始
    this.engine.start();
    this.gameLoop();
  }
  
  async loadAssets() {
    // タイルセット読み込み
    const tilesetConfig = {
      frameWidth: 32,
      frameHeight: 32,
      animations: {}
    };
    
    // 仮想的なアセット読み込み（実際のゲームでは画像ファイルを使用）
    console.log('Loading game assets...');
  }
  
  generateTerrain() {
    // 地形生成
    for (let y = 0; y < this.mapHeight / this.tileSize; y++) {
      for (let x = 0; x < this.mapWidth / this.tileSize; x++) {
        const tileType = this.getTerrainType(x, y);
        
        const tile = this.engine.createSprite({
          id: `tile_${x}_${y}`,
          x: x * this.tileSize,
          y: y * this.tileSize,
          width: this.tileSize,
          height: this.tileSize,
          color: tileType.color,
          layer: 'background',
          isStatic: true
        });
        
        this.terrainLayer.push(tile);
      }
    }
    
    // 装飾の追加
    this.addDecorations();
  }
  
  getTerrainType(x, y) {
    // 簡単な地形生成ロジック
    const centerX = this.mapWidth / this.tileSize / 2;
    const centerY = this.mapHeight / this.tileSize / 2;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    
    if (distance < 10) {
      return { type: 'plaza', color: '#d4a574' }; // 広場
    } else if (distance < 20) {
      return { type: 'path', color: '#c19a6b' }; // 道
    } else if (Math.random() < 0.1) {
      return { type: 'forest', color: '#228b22' }; // 森
    } else {
      return { type: 'grass', color: '#7cfc00' }; // 草地
    }
  }
  
  addDecorations() {
    // 桜の木を配置
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * this.mapWidth;
      const y = Math.random() * this.mapHeight;
      
      this.createSakuraTree(x, y);
    }
    
    // 石灯籠を配置
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * this.mapWidth;
      const y = Math.random() * this.mapHeight;
      
      this.createLantern(x, y);
    }
  }
  
  createSakuraTree(x, y) {
    const tree = this.engine.createSprite({
      id: `sakura_${Date.now()}`,
      x: x,
      y: y,
      width: 64,
      height: 80,
      layer: 'buildings',
      isStatic: true,
      onClick: () => {
        this.showSakuraEffect(x + 32, y + 40);
      }
    });
    
    // 木の描画（Canvas APIを使用）
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    
    // 幹
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(28, 40, 8, 40);
    
    // 桜の花
    ctx.fillStyle = '#FFB6C1';
    for (let i = 0; i < 50; i++) {
      const px = Math.random() * 64;
      const py = Math.random() * 50;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    tree.image = canvas;
    this.decorationLayer.push(tree);
  }
  
  createLantern(x, y) {
    const lantern = this.engine.createSprite({
      id: `lantern_${Date.now()}`,
      x: x,
      y: y,
      width: 32,
      height: 48,
      layer: 'buildings',
      isStatic: true
    });
    
    // 灯籠の描画
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 48;
    const ctx = canvas.getContext('2d');
    
    // 基礎
    ctx.fillStyle = '#808080';
    ctx.fillRect(8, 36, 16, 12);
    
    // 柱
    ctx.fillRect(14, 12, 4, 24);
    
    // 屋根
    ctx.fillStyle = '#4B4B4B';
    ctx.beginPath();
    ctx.moveTo(4, 12);
    ctx.lineTo(16, 0);
    ctx.lineTo(28, 12);
    ctx.fill();
    
    // 光
    ctx.fillStyle = '#FFD700';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(12, 16, 8, 8);
    
    lantern.image = canvas;
    this.decorationLayer.push(lantern);
    
    // 夜間の光エフェクト
    this.createLightEffect(x + 16, y + 20);
  }
  
  createLightEffect(x, y) {
    setInterval(() => {
      if (Math.random() < 0.3) {
        this.engine.createParticle({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -Math.random() * 0.5,
          color: '#FFD700',
          size: 2,
          life: 60,
          gravity: 0,
          type: 'circle'
        });
      }
    }, 1000);
  }
  
  createPlayer() {
    this.player = new CharacterSprite(this.engine, {
      name: this.gameData.playerName || 'プレイヤー',
      x: this.mapWidth / 2,
      y: this.mapHeight / 2,
      level: this.gameData.level || 1,
      culturalCapital: this.gameData.culturalCapital || 0,
      beltRank: this.gameData.beltRank || '白帯'
    });
    
    // カメラをプレイヤーに追従
    this.engine.camera.x = this.player.sprite.x - this.canvas.width / 2;
    this.engine.camera.y = this.player.sprite.y - this.canvas.height / 2;
  }
  
  createInitialBuildings() {
    // 初期建物の配置
    const buildings = [
      {
        type: 'shrine',
        name: '中央神社',
        x: this.mapWidth / 2 - 64,
        y: this.mapHeight / 2 - 100,
        level: 1
      },
      {
        type: 'temple',
        name: '文化寺',
        x: this.mapWidth / 2 + 100,
        y: this.mapHeight / 2,
        level: 1
      }
    ];
    
    buildings.forEach(buildingData => {
      this.createBuilding(buildingData);
    });
  }
  
  createBuilding(data) {
    const building = this.engine.createSprite({
      id: `building_${data.type}_${Date.now()}`,
      x: data.x,
      y: data.y,
      width: 128,
      height: 128,
      layer: 'buildings',
      isStatic: true,
      onClick: () => this.onBuildingClick(building, data)
    });
    
    // 建物の描画
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    if (data.type === 'shrine') {
      this.drawShrine(ctx, data.level);
    } else if (data.type === 'temple') {
      this.drawTemple(ctx, data.level);
    }
    
    building.image = canvas;
    building.data = data;
    this.buildings.set(building.id, building);
    
    // 建物エフェクト
    this.createBuildingAura(building);
  }
  
  drawShrine(ctx, level) {
    // 鳥居を描画
    const colors = ['#CD5C5C', '#DC143C', '#FF6347', '#FFD700'];
    const color = colors[Math.min(level - 1, colors.length - 1)];
    
    // 柱
    ctx.fillStyle = color;
    ctx.fillRect(20, 40, 12, 80);
    ctx.fillRect(96, 40, 12, 80);
    
    // 横木
    ctx.fillRect(10, 30, 108, 16);
    ctx.fillRect(5, 20, 118, 12);
    
    // 屋根
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.quadraticCurveTo(64, 5, 128, 20);
    ctx.stroke();
    
    // レベル表示
    if (level > 1) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`Lv${level}`, 54, 100);
    }
  }
  
  drawTemple(ctx, level) {
    // 寺院を描画
    const baseColor = level > 2 ? '#8B4513' : '#A0522D';
    
    // 基礎
    ctx.fillStyle = '#808080';
    ctx.fillRect(24, 96, 80, 32);
    
    // 本堂
    ctx.fillStyle = baseColor;
    ctx.fillRect(32, 48, 64, 48);
    
    // 屋根（層数はレベルに応じて）
    for (let i = 0; i < Math.min(level, 3); i++) {
      ctx.fillStyle = '#4B4B4B';
      const y = 48 - i * 16;
      const width = 96 - i * 8;
      const x = 64 - width / 2;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(64, y - 16);
      ctx.lineTo(x + width, y);
      ctx.fill();
    }
  }
  
  createBuildingAura(building) {
    // 建物のオーラエフェクト
    setInterval(() => {
      if (building.data.level > 2) {
        this.engine.createParticle({
          x: building.x + building.width / 2 + (Math.random() - 0.5) * building.width,
          y: building.y + building.height,
          vx: 0,
          vy: -0.3,
          color: '#FFD700',
          size: 3,
          life: 120,
          gravity: 0,
          type: 'circle'
        });
      }
    }, 500);
  }
  
  createNPCs() {
    // NPC配置
    const npcTypes = [
      { name: '神主', type: 'priest', x: 750, y: 500 },
      { name: '巫女', type: 'miko', x: 850, y: 600 },
      { name: '参拝者', type: 'visitor', x: 700, y: 700 }
    ];
    
    npcTypes.forEach(npcData => {
      const npc = new CharacterSprite(this.engine, {
        name: npcData.name,
        x: npcData.x,
        y: npcData.y,
        level: Math.floor(Math.random() * 5) + 1,
        culturalCapital: Math.floor(Math.random() * 1000),
        beltRank: this.getRandomBelt()
      });
      
      npc.data = npcData;
      this.npcs.push(npc);
      
      // NPCの自動移動
      this.startNPCBehavior(npc);
    });
  }
  
  getRandomBelt() {
    const belts = ['白帯', '黄帯', '橙帯', '緑帯', '青帯', '紫帯', '茶帯', '紅帯', '黒帯'];
    return belts[Math.floor(Math.random() * belts.length)];
  }
  
  startNPCBehavior(npc) {
    setInterval(() => {
      if (Math.random() < 0.3) {
        const targetX = npc.sprite.x + (Math.random() - 0.5) * 200;
        const targetY = npc.sprite.y + (Math.random() - 0.5) * 200;
        
        // マップ範囲内に制限
        const clampedX = Math.max(0, Math.min(this.mapWidth - 64, targetX));
        const clampedY = Math.max(0, Math.min(this.mapHeight - 64, targetY));
        
        npc.moveTo(clampedX, clampedY);
      }
      
      // ランダムアクション
      if (Math.random() < 0.1) {
        const actions = ['pray', 'meditate'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        npc[action]();
      }
    }, 3000);
  }
  
  setupEventListeners() {
    // クリックイベント
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left + this.engine.camera.x;
      const y = e.clientY - rect.top + this.engine.camera.y;
      
      // プレイヤー移動
      this.player.moveTo(x - 32, y - 32);
      
      // 建物との相互作用チェック
      this.checkBuildingInteraction(x, y);
    });
    
    // キーボードイベント
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'b':
          this.toggleBuildMenu();
          break;
        case 'p':
          this.player.pray();
          break;
        case 'c':
          this.player.celebrate();
          break;
        case 'm':
          this.player.meditate();
          break;
        case '+':
          this.engine.setZoom(this.engine.camera.zoom + 0.1);
          break;
        case '-':
          this.engine.setZoom(this.engine.camera.zoom - 0.1);
          break;
      }
    });
    
    // マウスホイール（ズーム）
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
      this.engine.setZoom(this.engine.camera.zoom + zoomDelta);
    });
  }
  
  checkBuildingInteraction(x, y) {
    this.buildings.forEach(building => {
      if (x >= building.x && x <= building.x + building.width &&
          y >= building.y && y <= building.y + building.height) {
        if (building.onClick) {
          building.onClick();
        }
      }
    });
  }
  
  onBuildingClick(building, data) {
    this.selectedBuilding = building;
    this.showBuildingInfo(data);
    
    // アップグレード可能かチェック
    const upgradeCost = data.level * 100;
    if (this.gameData.culturalCapital >= upgradeCost) {
      this.showUpgradeOption(building, data, upgradeCost);
    }
  }
  
  showBuildingInfo(data) {
    console.log(`${data.name} - レベル${data.level}`);
    // 実際のゲームではUIパネルを表示
  }
  
  showUpgradeOption(building, data, cost) {
    if (confirm(`${data.name}をレベル${data.level + 1}にアップグレードしますか？（${cost}文化資本）`)) {
      this.upgradeBuilding(building, data);
    }
  }
  
  upgradeBuilding(building, data) {
    data.level++;
    this.gameData.culturalCapital -= data.level * 100;
    
    // 建物を再描画
    const ctx = building.image.getContext('2d');
    ctx.clearRect(0, 0, 128, 128);
    
    if (data.type === 'shrine') {
      this.drawShrine(ctx, data.level);
    } else if (data.type === 'temple') {
      this.drawTemple(ctx, data.level);
    }
    
    // レベルアップエフェクト
    for (let i = 0; i < 50; i++) {
      const angle = (Math.PI * 2 * i) / 50;
      this.engine.createParticle({
        x: building.x + building.width / 2,
        y: building.y + building.height / 2,
        vx: Math.cos(angle) * 5,
        vy: Math.sin(angle) * 5,
        color: '#FFD700',
        size: 8,
        life: 80,
        gravity: 0
      });
    }
    
    this.player.celebrate();
  }
  
  showSakuraEffect(x, y) {
    // 桜の花びらエフェクト
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        this.engine.createParticle({
          x: x + (Math.random() - 0.5) * 50,
          y: y,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 2,
          color: '#FFB6C1',
          size: 6,
          life: 120,
          gravity: 0.1,
          type: 'circle'
        });
      }, i * 100);
    }
  }
  
  toggleBuildMenu() {
    this.showBuildMenu = !this.showBuildMenu;
    // 実際のゲームでは建設メニューUIを表示
    if (this.showBuildMenu) {
      console.log('建設メニューを開く');
    }
  }
  
  gameLoop() {
    // ゲームロジック更新
    this.updateGame();
    
    // カメラ追従
    this.updateCamera();
    
    // NPC更新
    this.npcs.forEach(npc => npc.update(this.engine.deltaTime));
    
    // プレイヤー更新
    this.player.update(this.engine.deltaTime);
    
    requestAnimationFrame(() => this.gameLoop());
  }
  
  updateGame() {
    // ゲーム状態の更新
    // 文化資本の自動増加など
    if (this.buildings.size > 0 && Math.random() < 0.01) {
      this.gameData.culturalCapital += this.buildings.size;
    }
  }
  
  updateCamera() {
    // スムーズなカメラ追従
    const targetX = this.player.sprite.x - this.canvas.width / 2;
    const targetY = this.player.sprite.y - this.canvas.height / 2;
    
    this.engine.camera.x += (targetX - this.engine.camera.x) * 0.1;
    this.engine.camera.y += (targetY - this.engine.camera.y) * 0.1;
    
    // カメラ範囲制限
    this.engine.camera.x = Math.max(0, Math.min(this.mapWidth - this.canvas.width, this.engine.camera.x));
    this.engine.camera.y = Math.max(0, Math.min(this.mapHeight - this.canvas.height, this.engine.camera.y));
  }
  
  // セーブ・ロード機能
  saveGame() {
    const saveData = {
      player: {
        x: this.player.sprite.x,
        y: this.player.sprite.y,
        level: this.player.level,
        culturalCapital: this.gameData.culturalCapital,
        beltRank: this.player.beltRank
      },
      buildings: Array.from(this.buildings.values()).map(b => b.data),
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('shrineVillageGame', JSON.stringify(saveData));
    console.log('ゲームを保存しました');
  }
  
  loadGame() {
    const saveData = localStorage.getItem('shrineVillageGame');
    if (saveData) {
      const data = JSON.parse(saveData);
      console.log('セーブデータを読み込みました', data);
      // 実際のゲームではデータを復元
    }
  }
}