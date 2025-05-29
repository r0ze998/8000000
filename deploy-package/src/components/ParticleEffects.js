import React, { useEffect, useRef } from 'react';

// 桜の花びらエフェクト
export const SakuraParticles = ({ count = 20 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    // パーティクルクラス
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 15 + 5;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 2 - 1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.spin;

        if (this.y > canvas.height) {
          this.y = -20;
          this.x = Math.random() * canvas.width;
        }

        if (this.x > canvas.width) {
          this.x = 0;
        } else if (this.x < 0) {
          this.x = canvas.width;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.globalAlpha = this.opacity;
        
        // 桜の花びらを描画
        ctx.beginPath();
        ctx.fillStyle = '#FFB6C1';
        for (let i = 0; i < 5; i++) {
          const angle = (i * 72) * Math.PI / 180;
          const x = Math.cos(angle) * this.size;
          const y = Math.sin(angle) * this.size;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.quadraticCurveTo(0, 0, x, y);
          }
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
      }
    }

    // パーティクルを生成
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    // アニメーションループ
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
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
export const LightParticles = ({ color = '#FFD700' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class LightParticle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = 0;
        this.targetOpacity = Math.random() * 0.8;
        this.pulse = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // フェードイン・アウト
        if (this.opacity < this.targetOpacity) {
          this.opacity += this.pulse;
        } else {
          this.opacity -= this.pulse;
          if (this.opacity <= 0) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.targetOpacity = Math.random() * 0.8;
          }
        }

        // 画面端での反射
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // グロー効果
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 10);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 10, 0, Math.PI * 2);
        ctx.fill();
        
        // 中心の光
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }

    // パーティクルを生成
    for (let i = 0; i < particleCount; i++) {
      particles.push(new LightParticle());
    }

    // アニメーションループ
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
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
    };
  }, [color]);

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
        opacity: 0.6
      }}
    />
  );
};