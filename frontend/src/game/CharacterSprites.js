// キャラクタースプライトシステム
export class CharacterSprite {
  constructor(spriteEngine, config) {
    this.engine = spriteEngine;
    this.config = config;
    
    // キャラクター基本設定
    this.name = config.name || 'プレイヤー';
    this.level = config.level || 1;
    this.culturalCapital = config.culturalCapital || 0;
    this.beltRank = config.beltRank || '白帯';
    
    // スプライト設定
    this.sprite = null;
    this.width = 64;
    this.height = 64;
    
    // アニメーション状態
    this.animations = {
      idle: { frames: [], frameDuration: 0.2 },
      walk: { frames: [], frameDuration: 0.1 },
      pray: { frames: [], frameDuration: 0.3 },
      celebrate: { frames: [], frameDuration: 0.15 },
      meditate: { frames: [], frameDuration: 0.5 }
    };
    
    // 移動設定
    this.moveSpeed = 2;
    this.targetX = null;
    this.targetY = null;
    
    this.createCharacter();
  }
  
  createCharacter() {
    // SVGベースのキャラクター生成
    const canvas = document.createElement('canvas');
    canvas.width = this.width * 8; // 8フレーム分
    canvas.height = this.height * 5; // 5アニメーション分
    const ctx = canvas.getContext('2d');
    
    // アニメーションフレーム生成
    this.generateAnimationFrames(ctx);
    
    // スプライト作成
    this.sprite = this.engine.createSprite({
      id: `character_${this.name}`,
      x: this.config.x || 400,
      y: this.config.y || 300,
      width: this.width,
      height: this.height,
      image: canvas,
      animations: this.animations,
      layer: 'characters'
    });
    
    // 初期アニメーション
    this.sprite.playAnimation('idle');
  }
  
  generateAnimationFrames(ctx) {
    // 文化帯の色を取得
    const beltColors = {
      '白帯': '#FFFFFF',
      '黄帯': '#FFD700',
      '橙帯': '#FF8C00',
      '緑帯': '#228B22',
      '青帯': '#4169E1',
      '紫帯': '#8B008B',
      '茶帯': '#8B4513',
      '紅帯': '#DC143C',
      '黒帯': '#000000',
      '金帯': '#FFD700'
    };
    
    const beltColor = beltColors[this.beltRank] || '#FFFFFF';
    
    // 各アニメーションフレームを描画
    Object.keys(this.animations).forEach((animName, animIndex) => {
      const y = animIndex * this.height;
      
      for (let frame = 0; frame < 8; frame++) {
        const x = frame * this.width;
        
        // キャラクター描画
        this.drawCharacterFrame(ctx, x, y, animName, frame, beltColor);
        
        // アニメーションフレーム情報を追加
        this.animations[animName].frames.push({
          x: x,
          y: y,
          width: this.width,
          height: this.height
        });
      }
    });
  }
  
  drawCharacterFrame(ctx, x, y, animation, frame, beltColor) {
    ctx.save();
    ctx.translate(x + this.width / 2, y + this.height / 2);
    
    // アニメーションに応じた変形
    let scaleX = 1;
    let scaleY = 1;
    let rotation = 0;
    
    if (animation === 'walk') {
      // 歩行アニメーション
      scaleY = 1 + Math.sin(frame * Math.PI / 4) * 0.05;
      rotation = Math.sin(frame * Math.PI / 4) * 0.1;
    } else if (animation === 'pray') {
      // お祈りアニメーション
      rotation = Math.sin(frame * Math.PI / 8) * 0.05;
    } else if (animation === 'celebrate') {
      // 祝いアニメーション
      scaleX = 1 + Math.sin(frame * Math.PI / 2) * 0.1;
      scaleY = 1 + Math.cos(frame * Math.PI / 2) * 0.1;
    }
    
    ctx.scale(scaleX, scaleY);
    ctx.rotate(rotation);
    
    // 体
    ctx.fillStyle = '#f4e4c1';
    ctx.fillRect(-15, -20, 30, 35);
    
    // 着物
    const gradient = ctx.createLinearGradient(-20, -15, 20, 25);
    gradient.addColorStop(0, '#e74c3c');
    gradient.addColorStop(1, '#c0392b');
    ctx.fillStyle = gradient;
    ctx.fillRect(-20, -15, 40, 30);
    
    // 帯
    ctx.fillStyle = beltColor;
    ctx.fillRect(-20, 0, 40, 8);
    
    if (this.beltRank === '金帯') {
      // 金帯の特殊効果
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 10;
      ctx.fillRect(-20, 0, 40, 8);
      ctx.shadowBlur = 0;
    }
    
    // 頭
    ctx.fillStyle = '#f4e4c1';
    ctx.beginPath();
    ctx.arc(0, -25, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // 髪
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.arc(0, -28, 10, Math.PI, 0);
    ctx.fill();
    
    // 顔
    ctx.fillStyle = '#000';
    ctx.fillRect(-3, -25, 2, 2); // 左目
    ctx.fillRect(1, -25, 2, 2);  // 右目
    
    if (animation === 'celebrate') {
      // 笑顔
      ctx.beginPath();
      ctx.arc(0, -20, 4, 0, Math.PI);
      ctx.stroke();
    }
    
    // 腕（アニメーションに応じて動かす）
    ctx.strokeStyle = '#f4e4c1';
    ctx.lineWidth = 4;
    
    if (animation === 'walk') {
      // 歩行時の腕の振り
      const armSwing = Math.sin(frame * Math.PI / 4) * 0.5;
      ctx.beginPath();
      ctx.moveTo(-15, -10);
      ctx.lineTo(-20 - armSwing * 5, 5);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(15, -10);
      ctx.lineTo(20 + armSwing * 5, 5);
      ctx.stroke();
    } else if (animation === 'pray') {
      // お祈りの手
      ctx.beginPath();
      ctx.moveTo(-10, -10);
      ctx.lineTo(0, -5);
      ctx.lineTo(10, -10);
      ctx.stroke();
    } else {
      // 通常の腕
      ctx.beginPath();
      ctx.moveTo(-15, -10);
      ctx.lineTo(-20, 5);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(15, -10);
      ctx.lineTo(20, 5);
      ctx.stroke();
    }
    
    // 足
    ctx.beginPath();
    ctx.moveTo(-8, 15);
    ctx.lineTo(-8, 25);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(8, 15);
    ctx.lineTo(8, 25);
    ctx.stroke();
    
    // レベル表示
    if (this.level > 1) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 10px Arial';
      ctx.fillText(`Lv${this.level}`, -15, -40);
    }
    
    ctx.restore();
  }
  
  // 移動制御
  moveTo(x, y) {
    this.targetX = x;
    this.targetY = y;
    this.sprite.playAnimation('walk');
  }
  
  update(dt) {
    if (this.targetX !== null && this.targetY !== null) {
      const dx = this.targetX - this.sprite.x;
      const dy = this.targetY - this.sprite.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 5) {
        const moveX = (dx / distance) * this.moveSpeed;
        const moveY = (dy / distance) * this.moveSpeed;
        
        this.sprite.x += moveX;
        this.sprite.y += moveY;
        
        // 向きの変更
        if (moveX < 0) {
          this.sprite.scale = -1;
        } else {
          this.sprite.scale = 1;
        }
      } else {
        this.targetX = null;
        this.targetY = null;
        this.sprite.playAnimation('idle');
      }
    }
  }
  
  // アクション
  pray() {
    this.sprite.playAnimation('pray');
    
    // お祈りエフェクト
    for (let i = 0; i < 10; i++) {
      this.engine.createParticle({
        x: this.sprite.x + this.width / 2,
        y: this.sprite.y,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 2,
        color: '#FFD700',
        size: 3,
        life: 60,
        gravity: -0.1
      });
    }
    
    setTimeout(() => {
      this.sprite.playAnimation('idle');
    }, 2000);
  }
  
  celebrate() {
    this.sprite.playAnimation('celebrate');
    
    // 祝いエフェクト
    const colors = ['#ff6b6b', '#FFD700', '#4CAF50', '#2196F3'];
    for (let i = 0; i < 20; i++) {
      this.engine.createParticle({
        x: this.sprite.x + this.width / 2,
        y: this.sprite.y + this.height / 2,
        vx: (Math.random() - 0.5) * 5,
        vy: -Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 5,
        life: 80
      });
    }
    
    setTimeout(() => {
      this.sprite.playAnimation('idle');
    }, 3000);
  }
  
  meditate() {
    this.sprite.playAnimation('meditate');
    
    // 瞑想エフェクト（オーラ）
    const createAura = () => {
      if (this.sprite.currentAnimation === 'meditate') {
        this.engine.createParticle({
          x: this.sprite.x + this.width / 2 + (Math.random() - 0.5) * 40,
          y: this.sprite.y + this.height,
          vx: 0,
          vy: -0.5,
          color: '#9370DB',
          size: 8,
          life: 120,
          gravity: 0,
          type: 'circle'
        });
        
        setTimeout(createAura, 200);
      }
    };
    
    createAura();
  }
  
  // レベルアップ
  levelUp() {
    this.level++;
    this.celebrate();
    
    // レベルアップエフェクト
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30;
      this.engine.createParticle({
        x: this.sprite.x + this.width / 2,
        y: this.sprite.y + this.height / 2,
        vx: Math.cos(angle) * 3,
        vy: Math.sin(angle) * 3,
        color: '#FFD700',
        size: 6,
        life: 60,
        gravity: 0
      });
    }
  }
  
  // 文化帯の更新
  updateBelt(newBelt) {
    this.beltRank = newBelt;
    this.generateAnimationFrames(this.sprite.image.getContext('2d'));
    this.sprite.flash('#FFD700', 0.5);
  }
}