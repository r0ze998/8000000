import React, { useEffect, useRef, useState } from 'react';
import './SeasonalEffects.css';

// 季節の判定
const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
};

// 桜の花びらパーティクル
class SakuraPetal {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = -20;
    this.size = Math.random() * 15 + 10;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 + 1;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 4 - 2;
    this.opacity = Math.random() * 0.5 + 0.5;
    this.swayAmount = Math.random() * 30 + 20;
    this.swaySpeed = Math.random() * 0.02 + 0.01;
    this.time = 0;
  }

  update() {
    this.time += this.swaySpeed;
    this.x += this.speedX + Math.sin(this.time) * this.swayAmount * 0.01;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;

    if (this.y > this.canvas.height + 20) {
      this.reset();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;

    // 花びらの形を描画
    ctx.beginPath();
    ctx.moveTo(0, -this.size / 2);
    ctx.bezierCurveTo(
      -this.size / 3, -this.size / 3,
      -this.size / 3, this.size / 3,
      0, this.size / 2
    );
    ctx.bezierCurveTo(
      this.size / 3, this.size / 3,
      this.size / 3, -this.size / 3,
      0, -this.size / 2
    );
    ctx.fillStyle = '#fcc9e9';
    ctx.fill();
    ctx.strokeStyle = '#ffb7c5';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.restore();
  }
}

// 紅葉パーティクル
class MomijiLeaf {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = -20;
    this.size = Math.random() * 20 + 15;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 1.5 + 0.5;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 3 - 1.5;
    this.color = this.getRandomAutumnColor();
    this.opacity = Math.random() * 0.5 + 0.5;
    this.swayAmount = Math.random() * 40 + 20;
    this.time = 0;
  }

  getRandomAutumnColor() {
    const colors = ['#ff6b35', '#ff8c42', '#c53d43', '#8b4513', '#d2691e'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.time += 0.02;
    this.x += this.speedX + Math.sin(this.time) * this.swayAmount * 0.01;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;

    if (this.y > this.canvas.height + 20) {
      this.reset();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;

    // もみじの葉を描画
    ctx.fillStyle = this.color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72 * Math.PI) / 180;
      const x = Math.cos(angle) * this.size;
      const y = Math.sin(angle) * this.size;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const cx = Math.cos(angle - 36 * Math.PI / 180) * this.size * 0.5;
        const cy = Math.sin(angle - 36 * Math.PI / 180) * this.size * 0.5;
        ctx.quadraticCurveTo(cx, cy, x, y);
      }
    }
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

// 雪のパーティクル
class SnowFlake {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = -20;
    this.size = Math.random() * 4 + 2;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.5;
    this.time = Math.random() * 100;
  }

  update() {
    this.time += 0.01;
    this.x += this.speedX + Math.sin(this.time) * 0.5;
    this.y += this.speedY;
    this.opacity = Math.sin(this.time * 2) * 0.2 + 0.8;

    if (this.y > this.canvas.height + 20) {
      this.reset();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    
    // 雪の結晶を描画
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.translate(this.x, this.y);
    
    for (let i = 0; i < 6; i++) {
      ctx.rotate(Math.PI / 3);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -this.size);
      ctx.stroke();
      
      // 枝を追加
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.6);
      ctx.lineTo(-this.size * 0.3, -this.size * 0.8);
      ctx.moveTo(0, -this.size * 0.6);
      ctx.lineTo(this.size * 0.3, -this.size * 0.8);
      ctx.stroke();
    }
    
    ctx.restore();
  }
}

// 蛍のパーティクル（夏）
class Firefly {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 3 + 2;
    this.glowSize = this.size * 4;
    this.brightness = 0;
    this.brightnessTarget = Math.random();
    this.time = Math.random() * 100;
  }

  update() {
    this.time += 0.02;
    
    // ランダムな動き
    this.speedX += (Math.random() - 0.5) * 0.02;
    this.speedY += (Math.random() - 0.5) * 0.02;
    
    // 速度制限
    this.speedX = Math.max(-0.5, Math.min(0.5, this.speedX));
    this.speedY = Math.max(-0.5, Math.min(0.5, this.speedY));
    
    this.x += this.speedX;
    this.y += this.speedY;
    
    // 画面端での反射
    if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
    
    // 明滅
    if (Math.random() < 0.01) {
      this.brightnessTarget = Math.random();
    }
    this.brightness += (this.brightnessTarget - this.brightness) * 0.1;
  }

  draw(ctx) {
    ctx.save();
    
    // 光のぼかし効果
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.glowSize
    );
    gradient.addColorStop(0, `rgba(154, 205, 50, ${this.brightness})`);
    gradient.addColorStop(0.5, `rgba(154, 205, 50, ${this.brightness * 0.3})`);
    gradient.addColorStop(1, 'rgba(154, 205, 50, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(
      this.x - this.glowSize, 
      this.y - this.glowSize, 
      this.glowSize * 2, 
      this.glowSize * 2
    );
    
    // 中心の明るい点
    ctx.fillStyle = `rgba(255, 255, 200, ${this.brightness})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

const SeasonalEffects = ({ particleCount = 30 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const [season, setSeason] = useState(getCurrentSeason());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 季節に応じたパーティクルを生成
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      switch (season) {
        case 'spring':
          particlesRef.current.push(new SakuraPetal(canvas));
          break;
        case 'summer':
          particlesRef.current.push(new Firefly(canvas));
          break;
        case 'autumn':
          particlesRef.current.push(new MomijiLeaf(canvas));
          break;
        case 'winter':
          particlesRef.current.push(new SnowFlake(canvas));
          break;
        default:
          particlesRef.current.push(new SakuraPetal(canvas));
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [season, particleCount]);

  // 季節の変更を監視
  useEffect(() => {
    const checkSeason = () => {
      const newSeason = getCurrentSeason();
      if (newSeason !== season) {
        setSeason(newSeason);
      }
    };

    // 1時間ごとにチェック
    const interval = setInterval(checkSeason, 3600000);
    return () => clearInterval(interval);
  }, [season]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`seasonal-effects-canvas ${season}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
};

export default SeasonalEffects;