// Cultural Shrine Village - Sprite Game Engine
class SpriteEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sprites = new Map();
    this.animations = new Map();
    this.particles = [];
    this.camera = { x: 0, y: 0, zoom: 1 };
    this.lastTime = 0;
    this.deltaTime = 0;
    this.isRunning = false;
    
    // スプライトシート管理
    this.spriteSheets = new Map();
    this.loadedAssets = 0;
    this.totalAssets = 0;
    
    // 物理演算
    this.gravity = 0.5;
    this.friction = 0.95;
    
    // レイヤー管理
    this.layers = {
      background: [],
      buildings: [],
      characters: [],
      effects: [],
      ui: []
    };
    
    this.setupCanvas();
  }
  
  setupCanvas() {
    // Retina対応
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.ctx.scale(dpr, dpr);
    
    // アンチエイリアシング設定
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }
  
  // スプライトクラス
  createSprite(config) {
    const sprite = new Sprite({
      id: config.id || `sprite_${Date.now()}`,
      x: config.x || 0,
      y: config.y || 0,
      width: config.width || 32,
      height: config.height || 32,
      image: config.image,
      animations: config.animations || {},
      layer: config.layer || 'characters',
      ...config
    });
    
    this.sprites.set(sprite.id, sprite);
    this.layers[sprite.layer].push(sprite);
    
    return sprite;
  }
  
  // アニメーション管理
  createAnimation(name, frames, duration) {
    this.animations.set(name, {
      frames,
      duration,
      currentFrame: 0,
      elapsedTime: 0
    });
  }
  
  // パーティクルシステム
  createParticle(config) {
    const particle = {
      x: config.x,
      y: config.y,
      vx: config.vx || (Math.random() - 0.5) * 2,
      vy: config.vy || -Math.random() * 3,
      life: config.life || 60,
      maxLife: config.life || 60,
      size: config.size || 5,
      color: config.color || '#FFD700',
      type: config.type || 'circle',
      gravity: config.gravity !== undefined ? config.gravity : this.gravity,
      ...config
    };
    
    this.particles.push(particle);
    return particle;
  }
  
  // アセット読み込み
  async loadSpriteSheet(name, url, config) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.spriteSheets.set(name, {
          image: img,
          frameWidth: config.frameWidth,
          frameHeight: config.frameHeight,
          animations: config.animations
        });
        this.loadedAssets++;
        resolve(img);
      };
      img.onerror = reject;
      img.src = url;
      this.totalAssets++;
    });
  }
  
  // メインゲームループ
  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop();
  }
  
  gameLoop = (currentTime) => {
    if (!this.isRunning) return;
    
    this.deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    
    this.update(this.deltaTime);
    this.render();
    
    requestAnimationFrame(this.gameLoop);
  }
  
  update(dt) {
    // スプライト更新
    this.sprites.forEach(sprite => {
      sprite.update(dt);
    });
    
    // パーティクル更新
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += particle.gravity;
      particle.vx *= this.friction;
      particle.life--;
      
      return particle.life > 0;
    });
  }
  
  render() {
    // クリア
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // カメラ変換
    this.ctx.save();
    this.ctx.translate(-this.camera.x, -this.camera.y);
    this.ctx.scale(this.camera.zoom, this.camera.zoom);
    
    // レイヤー順にレンダリング
    Object.keys(this.layers).forEach(layerName => {
      this.layers[layerName].forEach(sprite => {
        sprite.render(this.ctx);
      });
    });
    
    // パーティクルレンダリング
    this.renderParticles();
    
    this.ctx.restore();
  }
  
  renderParticles() {
    this.particles.forEach(particle => {
      this.ctx.save();
      
      const alpha = particle.life / particle.maxLife;
      this.ctx.globalAlpha = alpha;
      
      if (particle.type === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
      } else if (particle.type === 'image' && particle.image) {
        this.ctx.drawImage(
          particle.image,
          particle.x - particle.size / 2,
          particle.y - particle.size / 2,
          particle.size,
          particle.size
        );
      }
      
      this.ctx.restore();
    });
  }
  
  // カメラ操作
  moveCamera(x, y) {
    this.camera.x += x;
    this.camera.y += y;
  }
  
  setZoom(zoom) {
    this.camera.zoom = Math.max(0.5, Math.min(2, zoom));
  }
  
  // 衝突判定
  checkCollision(sprite1, sprite2) {
    return sprite1.x < sprite2.x + sprite2.width &&
           sprite1.x + sprite1.width > sprite2.x &&
           sprite1.y < sprite2.y + sprite2.height &&
           sprite1.y + sprite1.height > sprite2.y;
  }
  
  stop() {
    this.isRunning = false;
  }
}

// スプライトクラス
class Sprite {
  constructor(config) {
    this.id = config.id;
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.vx = 0;
    this.vy = 0;
    this.rotation = 0;
    this.scale = 1;
    this.alpha = 1;
    
    // アニメーション
    this.animations = config.animations;
    this.currentAnimation = null;
    this.animationFrame = 0;
    this.animationTime = 0;
    
    // 物理属性
    this.mass = config.mass || 1;
    this.isStatic = config.isStatic || false;
    
    // レンダリング
    this.image = config.image;
    this.color = config.color || '#ffffff';
    this.layer = config.layer;
    
    // 状態管理
    this.states = new Map();
    this.currentState = 'idle';
    
    // イベントハンドラー
    this.onClick = config.onClick;
    this.onHover = config.onHover;
  }
  
  update(dt) {
    if (!this.isStatic) {
      this.x += this.vx * dt * 60;
      this.y += this.vy * dt * 60;
    }
    
    // アニメーション更新
    if (this.currentAnimation && this.animations[this.currentAnimation]) {
      const anim = this.animations[this.currentAnimation];
      this.animationTime += dt;
      
      if (this.animationTime >= anim.frameDuration) {
        this.animationFrame = (this.animationFrame + 1) % anim.frames.length;
        this.animationTime = 0;
      }
    }
  }
  
  render(ctx) {
    ctx.save();
    
    // 変換適用
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);
    ctx.globalAlpha = this.alpha;
    
    // スプライト描画
    if (this.image) {
      if (this.currentAnimation && this.animations[this.currentAnimation]) {
        // アニメーションフレーム描画
        const anim = this.animations[this.currentAnimation];
        const frame = anim.frames[this.animationFrame];
        
        ctx.drawImage(
          this.image,
          frame.x, frame.y, frame.width, frame.height,
          -this.width / 2, -this.height / 2, this.width, this.height
        );
      } else {
        // 静的画像描画
        ctx.drawImage(
          this.image,
          -this.width / 2, -this.height / 2,
          this.width, this.height
        );
      }
    } else {
      // 色で塗りつぶし
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }
    
    ctx.restore();
  }
  
  // アニメーション制御
  playAnimation(name, loop = true) {
    if (this.animations[name]) {
      this.currentAnimation = name;
      this.animationFrame = 0;
      this.animationTime = 0;
      this.animations[name].loop = loop;
    }
  }
  
  // 状態管理
  setState(state) {
    this.currentState = state;
    if (this.states.has(state)) {
      this.states.get(state).enter?.();
    }
  }
  
  // 移動
  moveTo(x, y, duration = 0) {
    if (duration > 0) {
      // スムーズ移動
      const startX = this.x;
      const startY = this.y;
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        
        // イージング関数（ease-in-out）
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        this.x = startX + (x - startX) * eased;
        this.y = startY + (y - startY) * eased;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      this.x = x;
      this.y = y;
    }
  }
  
  // エフェクト
  flash(color = '#ffffff', duration = 0.2) {
    const originalColor = this.color;
    this.color = color;
    setTimeout(() => {
      this.color = originalColor;
    }, duration * 1000);
  }
  
  shake(intensity = 5, duration = 0.5) {
    const originalX = this.x;
    const originalY = this.y;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = elapsed / (duration * 1000);
      
      if (progress < 1) {
        this.x = originalX + (Math.random() - 0.5) * intensity * (1 - progress);
        this.y = originalY + (Math.random() - 0.5) * intensity * (1 - progress);
        requestAnimationFrame(animate);
      } else {
        this.x = originalX;
        this.y = originalY;
      }
    };
    
    requestAnimationFrame(animate);
  }
}

export { SpriteEngine, Sprite };