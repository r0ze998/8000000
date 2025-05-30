import React, { useEffect, useRef } from 'react';

// 桜の花びらエフェクト
export const SakuraParticles = ({ count = 30, intensity = 'medium' }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    // パーティクルクラス
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 20 + 8;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 2 + 1;
        this.opacity = 0;
        this.targetOpacity = Math.random() * 0.7 + 0.3;
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 2 - 1;
        this.fadeSpeed = 0.02;
        this.swayAmplitude = Math.random() * 50 + 30;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        this.time = Math.random() * Math.PI * 2;
      }

      update() {
        // フェードイン
        if (this.opacity < this.targetOpacity) {
          this.opacity += this.fadeSpeed;
        }

        // 揺らぎながら落下
        this.time += this.swaySpeed;
        this.x += this.speedX + Math.sin(this.time) * this.swayAmplitude * 0.01;
        this.y += this.speedY;
        this.angle += this.spin;

        // 画面下部でフェードアウト
        if (this.y > canvas.height - 100) {
          this.opacity -= this.fadeSpeed * 2;
        }

        // リセット
        if (this.y > canvas.height || this.opacity <= 0) {
          this.reset();
        }

        // 画面端での折り返し
        if (this.x > canvas.width + 50) {
          this.x = -50;
        } else if (this.x < -50) {
          this.x = canvas.width + 50;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.globalAlpha = this.opacity;
        
        // グラデーションで桜の花びら
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, '#FFE0EC');
        gradient.addColorStop(0.5, '#FFB6C1');
        gradient.addColorStop(1, '#FF69B4');
        
        ctx.fillStyle = gradient;
        
        // 花びらの形状
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 72 - 90) * Math.PI / 180;
          const x = Math.cos(angle) * this.size;
          const y = Math.sin(angle) * this.size;
          const cx = Math.cos(angle) * this.size * 0.5;
          const cy = Math.sin(angle) * this.size * 0.5;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            const prevAngle = ((i - 1) * 72 - 90) * Math.PI / 180;
            const px = Math.cos(prevAngle) * this.size;
            const py = Math.sin(prevAngle) * this.size;
            ctx.quadraticCurveTo((px + x) / 2 + cx * 0.5, (py + y) / 2 + cy * 0.5, x, y);
          }
        }
        ctx.closePath();
        ctx.fill();
        
        // 影を追加
        ctx.globalAlpha = this.opacity * 0.3;
        ctx.fillStyle = 'rgba(255, 105, 180, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }

    // パーティクルを生成
    for (let i = 0; i < count; i++) {
      const particle = new Particle();
      particle.y = Math.random() * canvas.height;
      particles.push(particle);
    }

    // アニメーションループ
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // リサイズ対応
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
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

// 光のパーティクルエフェクト
export const LightParticles = ({ color = '#FFD700', count = 60 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    class LightParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = 0;
        this.targetOpacity = Math.random() * 0.8 + 0.2;
        this.pulse = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.glowSize = Math.random() * 20 + 10;
        this.hue = Math.random() * 30 - 15; // 色相の変化
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // パルスアニメーション
        this.pulsePhase += 0.05;
        const pulseFactor = 1 + Math.sin(this.pulsePhase) * 0.3;
        
        // フェードイン・アウト
        if (this.opacity < this.targetOpacity) {
          this.opacity += this.pulse;
        } else {
          this.opacity -= this.pulse * 0.5;
          if (this.opacity <= 0) {
            this.reset();
          }
        }

        // 画面端での反射
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX *= -1;
          this.x = Math.max(0, Math.min(canvas.width, this.x));
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.speedY *= -1;
          this.y = Math.max(0, Math.min(canvas.height, this.y));
        }
        
        // ランダムな動き
        this.speedX += (Math.random() - 0.5) * 0.01;
        this.speedY += (Math.random() - 0.5) * 0.01;
        
        // 速度制限
        this.speedX = Math.max(-0.5, Math.min(0.5, this.speedX));
        this.speedY = Math.max(-0.5, Math.min(0.5, this.speedY));
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // パルスアニメーション
        const pulseFactor = 1 + Math.sin(this.pulsePhase) * 0.3;
        
        // グロー効果（外側）
        const outerGlow = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.glowSize * pulseFactor
        );
        outerGlow.addColorStop(0, color);
        outerGlow.addColorStop(0.4, `${color}88`);
        outerGlow.addColorStop(1, 'transparent');
        
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.glowSize * pulseFactor, 0, Math.PI * 2);
        ctx.fill();
        
        // 内側の明るい光
        const innerGlow = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 3
        );
        innerGlow.addColorStop(0, '#FFFFFF');
        innerGlow.addColorStop(0.5, color);
        innerGlow.addColorStop(1, 'transparent');
        
        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 中心の光点
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }

    // パーティクルを生成
    for (let i = 0; i < count; i++) {
      particles.push(new LightParticle());
    }

    // アニメーションループ
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 背景に微妙なグラデーション
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      bgGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.02)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // リサイズ対応
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [color, count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.7
      }}
    />
  );
};

// 神社・寺院用の特殊エフェクト
export const ShrineTempleEffects = ({ type = 'shrine' }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const symbols = type === 'shrine' 
      ? ['⛩️', '🌸', '✨', '🍃', '🎋']
      : ['🏛️', '🍂', '✨', '🔔', '🕉️'];

    class SymbolParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50;
        this.size = Math.random() * 30 + 15;
        this.speed = Math.random() * 1 + 0.5;
        this.opacity = 0;
        this.targetOpacity = Math.random() * 0.6 + 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
        this.fadeSpeed = 0.01;
        this.swayX = 0;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        this.swayAmplitude = Math.random() * 100 + 50;
      }

      update() {
        // フェードイン
        if (this.opacity < this.targetOpacity && this.y > canvas.height * 0.8) {
          this.opacity += this.fadeSpeed;
        }
        
        // 上昇
        this.y -= this.speed;
        
        // 横揺れ
        this.swayX += this.swaySpeed;
        this.x += Math.sin(this.swayX) * this.swayAmplitude * 0.01;
        
        // 回転
        this.rotation += this.rotationSpeed;
        
        // 上部でフェードアウト
        if (this.y < canvas.height * 0.2) {
          this.opacity -= this.fadeSpeed * 2;
        }
        
        // リセット
        if (this.y < -50 || this.opacity <= 0) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        
        // グロー効果
        if (this.symbol === '✨') {
          ctx.shadowColor = '#FFD700';
          ctx.shadowBlur = 20;
        }
        
        // シンボル描画
        ctx.font = `${this.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.symbol, 0, 0);
        
        ctx.restore();
      }
    }

    // パーティクルを生成
    for (let i = 0; i < 15; i++) {
      const particle = new SymbolParticle();
      particle.y = Math.random() * canvas.height;
      particles.push(particle);
    }

    // アニメーションループ
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // リサイズ対応
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [type]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2
      }}
    />
  );
};