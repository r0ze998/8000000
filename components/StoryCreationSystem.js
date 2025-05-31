import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Add spinner animation styles
const spinnerKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = spinnerKeyframes;
  document.head.appendChild(style);
}

const StoryCreationSystem = ({ visitData, onStoryComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [storyData, setStoryData] = useState({
    title: '',
    description: '',
    emotion: '',
    significance: '',
    wish: '',
    media: [],
    tags: [],
    culturalContext: '',
    personalReflection: ''
  });
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  const [generatedArt, setGeneratedArt] = useState(null);
  const [culturalScore, setCulturalScore] = useState(0);
  const canvasRef = useRef(null);

  // Calculate cultural significance score
  useEffect(() => {
    const score = calculateCulturalScore(storyData, visitData);
    setCulturalScore(score);
  }, [storyData, visitData]);

  const emotions = [
    { id: 'peaceful', label: '平安', icon: '🕊️', color: '#4A90E2' },
    { id: 'grateful', label: '感謝', icon: '🙏', color: '#7ED321' },
    { id: 'hopeful', label: '希望', icon: '🌅', color: '#F5A623' },
    { id: 'reflective', label: '内省', icon: '💭', color: '#9013FE' },
    { id: 'joyful', label: '喜び', icon: '😊', color: '#FF6B35' },
    { id: 'reverent', label: '敬虔', icon: '🤲', color: '#50E3C2' }
  ];

  const significanceOptions = [
    { id: 'personal_growth', label: '個人的成長', description: '自分自身の変化や気づき' },
    { id: 'family_bonds', label: '家族の絆', description: '家族との関係や想い' },
    { id: 'cultural_connection', label: '文化的繋がり', description: '日本文化への理解や愛着' },
    { id: 'spiritual_awakening', label: '精神的覚醒', description: 'スピリチュアルな体験や洞察' },
    { id: 'community_service', label: '社会貢献', description: 'コミュニティへの奉仕や貢献' },
    { id: 'milestone_achievement', label: '節目の達成', description: '人生の重要な節目や達成' }
  ];

  const culturalTags = [
    '季節の移ろい', '伝統的祭事', '精神的浄化', '家族の安全', '学業成就',
    '商売繁盛', '健康祈願', '恋愛成就', '旅行安全', '厄除け',
    '新年祈願', '感謝の心', '先祖供養', '地域貢献', '文化継承'
  ];

  function calculateCulturalScore(story, visit) {
    let score = 0;

    // Base story completeness
    if (story.title) score += 10;
    if (story.description && story.description.length > 50) score += 20;
    if (story.emotion) score += 10;
    if (story.significance) score += 15;
    if (story.wish) score += 10;
    if (story.culturalContext && story.culturalContext.length > 30) score += 20;
    if (story.personalReflection && story.personalReflection.length > 50) score += 25;

    // Tags bonus
    score += story.tags.length * 5;

    // Visit context bonus
    if (visit?.weather === 'rainy') score += 10;
    if (visit?.weather === 'snowy') score += 15;
    if (visit?.timeOfDay === 'dawn') score += 10;
    if (visit?.timeOfDay === 'dusk') score += 8;
    if (visit?.moonPhase === 'full') score += 12;
    if (visit?.streakCount > 30) score += 20;
    if (visit?.streakCount > 100) score += 40;

    // Media bonus
    score += story.media.length * 10;

    return Math.min(score, 200); // Cap at 200
  }

  const handleStoryUpdate = (field, value) => {
    setStoryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagToggle = (tag) => {
    setStoryData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const generateAIArt = async () => {
    setIsGeneratingArt(true);
    
    // Simulate AI art generation
    setTimeout(() => {
      const artData = createGenerativeArt(storyData, visitData);
      setGeneratedArt(artData);
      setIsGeneratingArt(false);
    }, 3000);
  };

  const createGenerativeArt = (story, visit) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = 512;
    const height = canvas.height = 512;

    // Clear canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    // Base color scheme based on emotion
    const emotionColors = {
      peaceful: ['#E3F2FD', '#BBDEFB', '#90CAF9'],
      grateful: ['#F1F8E9', '#DCEDC8', '#C5E1A5'],
      hopeful: ['#FFF3E0', '#FFE0B2', '#FFCC80'],
      reflective: ['#F3E5F5', '#E1BEE7', '#CE93D8'],
      joyful: ['#FFF8E1', '#FFECB3', '#FFE082'],
      reverent: ['#E0F2F1', '#B2DFDB', '#80CBC4']
    };

    const colors = emotionColors[story.emotion] || emotionColors.peaceful;

    // Background gradient
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add elements based on visit data
    if (visit?.season === 'spring') {
      drawSakura(ctx, width, height);
    } else if (visit?.season === 'autumn') {
      drawMapleLeaves(ctx, width, height);
    } else if (visit?.weather === 'snowy') {
      drawSnow(ctx, width, height);
    }

    // Add shrine silhouette
    drawShrineGate(ctx, width, height);

    // Add time-based elements
    if (visit?.timeOfDay === 'dawn') {
      drawSunrise(ctx, width, height);
    } else if (visit?.timeOfDay === 'dusk') {
      drawSunset(ctx, width, height);
    }

    // Add moon if nighttime
    if (visit?.moonPhase === 'full') {
      drawMoon(ctx, width, height);
    }

    // Add cultural symbols based on significance
    if (story.significance === 'spiritual_awakening') {
      drawSpiritualSymbols(ctx, width, height);
    }

    return canvas.toDataURL();
  };

  const drawSakura = (ctx, width, height) => {
    ctx.fillStyle = '#FFB7C5';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 8 + 4;
      
      for (let j = 0; j < 5; j++) {
        const angle = (j * Math.PI * 2) / 5;
        const petalX = x + Math.cos(angle) * size;
        const petalY = y + Math.sin(angle) * size;
        
        ctx.beginPath();
        ctx.arc(petalX, petalY, size/2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawMapleLeaves = (ctx, width, height) => {
    ctx.fillStyle = '#FF6B35';
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 12 + 8;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.random() * Math.PI * 2);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(-size/2, 0);
      ctx.lineTo(-size/4, size/2);
      ctx.lineTo(size/4, size/2);
      ctx.lineTo(size/2, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  };

  const drawSnow = (ctx, width, height) => {
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 4 + 2;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawShrineGate = (ctx, width, height) => {
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    
    const gateWidth = width * 0.6;
    const gateHeight = height * 0.4;
    const startX = (width - gateWidth) / 2;
    const startY = height * 0.7;
    
    // Vertical posts
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, startY - gateHeight);
    ctx.moveTo(startX + gateWidth, startY);
    ctx.lineTo(startX + gateWidth, startY - gateHeight);
    ctx.stroke();
    
    // Horizontal beams
    ctx.beginPath();
    ctx.moveTo(startX - 20, startY - gateHeight + 40);
    ctx.lineTo(startX + gateWidth + 20, startY - gateHeight + 40);
    ctx.moveTo(startX - 10, startY - gateHeight + 80);
    ctx.lineTo(startX + gateWidth + 10, startY - gateHeight + 80);
    ctx.stroke();
  };

  const drawSunrise = (ctx, width, height) => {
    const gradient = ctx.createRadialGradient(width/2, height, 0, width/2, height, width);
    gradient.addColorStop(0, 'rgba(255, 183, 77, 0.6)');
    gradient.addColorStop(0.3, 'rgba(255, 138, 101, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 183, 77, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  const drawSunset = (ctx, width, height) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(255, 138, 101, 0.4)');
    gradient.addColorStop(0.5, 'rgba(255, 183, 77, 0.6)');
    gradient.addColorStop(1, 'rgba(156, 39, 176, 0.3)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  const drawMoon = (ctx, width, height) => {
    ctx.fillStyle = '#F5F5DC';
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.2, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Moon glow
    ctx.fillStyle = 'rgba(245, 245, 220, 0.3)';
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.2, 50, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawSpiritualSymbols = (ctx, width, height) => {
    // Draw subtle spiritual symbols
    ctx.strokeStyle = 'rgba(123, 104, 238, 0.3)';
    ctx.lineWidth = 2;
    
    // Enso circle
    ctx.beginPath();
    ctx.arc(width * 0.2, height * 0.3, 25, 0, Math.PI * 1.8);
    ctx.stroke();
  };

  const renderStep1 = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px', color: '#2c3e50' }}>✨ 今日の体験を物語にしましょう</h2>
        <p style={{ fontSize: '16px', color: '#7f8c8d', margin: 0 }}>あなたの参拝体験を特別な思い出として記録します</p>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>タイトル</label>
        <input
          type="text"
          placeholder="例: 雨の日の静寂な参拝"
          value={storyData.title}
          onChange={(e) => handleStoryUpdate('title', e.target.value)}
          maxLength={50}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#95a5a6', marginTop: '5px' }}>{storyData.title.length}/50</div>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>体験の描写</label>
        <textarea
          placeholder="今日の参拝で感じたこと、見たもの、体験したことを詳しく描写してください..."
          value={storyData.description}
          onChange={(e) => handleStoryUpdate('description', e.target.value)}
          rows={4}
          maxLength={500}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '16px',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#95a5a6', marginTop: '5px' }}>{storyData.description.length}/500</div>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>感情を選択</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {emotions.map(emotion => (
            <button
              key={emotion.id}
              onClick={() => handleStoryUpdate('emotion', emotion.id)}
              style={{
                padding: '15px 10px',
                border: `2px solid ${storyData.emotion === emotion.id ? emotion.color : '#e1e5e9'}`,
                borderRadius: '10px',
                background: storyData.emotion === emotion.id ? `${emotion.color}20` : 'white',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#2c3e50'
              }}
            >
              <span style={{ fontSize: '20px' }}>{emotion.icon}</span>
              <span>{emotion.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px', color: '#2c3e50' }}>🎌 文化的意義と願い</h2>
        <p style={{ fontSize: '16px', color: '#7f8c8d', margin: 0 }}>この体験の深い意味と願いを記録します</p>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>この体験の意義</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {significanceOptions.map(option => (
            <div
              key={option.id}
              onClick={() => handleStoryUpdate('significance', option.id)}
              style={{
                padding: '15px',
                border: `2px solid ${storyData.significance === option.id ? '#3498db' : '#e1e5e9'}`,
                borderRadius: '10px',
                background: storyData.significance === option.id ? '#3498db20' : 'white',
                cursor: 'pointer'
              }}
            >
              <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#2c3e50' }}>{option.label}</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#7f8c8d' }}>{option.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>願い・祈り</label>
        <textarea
          placeholder="この参拝で何を願い、何を祈りましたか？"
          value={storyData.wish}
          onChange={(e) => handleStoryUpdate('wish', e.target.value)}
          rows={3}
          maxLength={300}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '16px',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#95a5a6', marginTop: '5px' }}>{storyData.wish.length}/300</div>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>文化的タグ</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {culturalTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              style={{
                padding: '8px 12px',
                border: `2px solid ${storyData.tags.includes(tag) ? '#e74c3c' : '#e1e5e9'}`,
                borderRadius: '20px',
                background: storyData.tags.includes(tag) ? '#e74c3c20' : 'white',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#2c3e50'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#7f8c8d' }}>
          選択済み: {storyData.tags.length}/5
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px', color: '#2c3e50' }}>🎨 アート生成と個人的省察</h2>
        <p style={{ fontSize: '16px', color: '#7f8c8d', margin: 0 }}>あなたの物語をビジュアルアートとして表現します</p>
      </div>

      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <button
          onClick={generateAIArt}
          disabled={isGeneratingArt}
          style={{
            padding: '15px 30px',
            border: 'none',
            borderRadius: '25px',
            background: isGeneratingArt ? '#95a5a6' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isGeneratingArt ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '0 auto'
          }}
        >
          {isGeneratingArt ? (
            <>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              アート生成中...
            </>
          ) : (
            <>
              🎨 オリジナルアートを生成
            </>
          )}
        </button>

        {generatedArt && (
          <div style={{ marginTop: '20px' }}>
            <img src={generatedArt} alt="Generated Story Art" style={{
              maxWidth: '300px',
              width: '100%',
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }} />
            <p style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '10px', margin: 0 }}>あなたの物語から生成されたオリジナルアート</p>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>文化的背景・文脈</label>
        <textarea
          placeholder="この体験を通じて感じた日本文化や神社文化との繋がりについて..."
          value={storyData.culturalContext}
          onChange={(e) => handleStoryUpdate('culturalContext', e.target.value)}
          rows={3}
          maxLength={400}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '16px',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#95a5a6', marginTop: '5px' }}>{storyData.culturalContext.length}/400</div>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>個人的な省察</label>
        <textarea
          placeholder="この体験があなた自身にとってどのような意味を持つか、どのような変化や気づきがあったかを記録してください..."
          value={storyData.personalReflection}
          onChange={(e) => handleStoryUpdate('personalReflection', e.target.value)}
          rows={4}
          maxLength={600}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '16px',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#95a5a6', marginTop: '5px' }}>{storyData.personalReflection.length}/600</div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px', color: '#2c3e50' }}>📊 文化的価値評価</h2>
        <p style={{ fontSize: '16px', color: '#7f8c8d', margin: 0 }}>あなたの物語の文化的価値が算出されました</p>
      </div>

      <div style={{ marginBottom: '30px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '30px',
          color: 'white',
          minWidth: '150px'
        }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', lineHeight: 1 }}>{culturalScore}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>文化的価値</div>
        </div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#2c3e50' }}>評価内訳</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ecf0f1' }}>
              <span style={{ color: '#2c3e50' }}>物語の完全性</span>
              <span style={{ fontWeight: 'bold', color: '#27ae60' }}>{Math.min(storyData.title ? 10 : 0 + (storyData.description.length > 50 ? 20 : 0), 30)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ecf0f1' }}>
              <span style={{ color: '#2c3e50' }}>感情・意義の表現</span>
              <span style={{ fontWeight: 'bold', color: '#27ae60' }}>{(storyData.emotion ? 10 : 0) + (storyData.significance ? 15 : 0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ecf0f1' }}>
              <span style={{ color: '#2c3e50' }}>文化的文脈</span>
              <span style={{ fontWeight: 'bold', color: '#27ae60' }}>{(storyData.culturalContext.length > 30 ? 20 : 0) + (storyData.tags.length * 5)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ecf0f1' }}>
              <span style={{ color: '#2c3e50' }}>個人的省察</span>
              <span style={{ fontWeight: 'bold', color: '#27ae60' }}>{storyData.personalReflection.length > 50 ? 25 : 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ color: '#2c3e50' }}>参拝条件ボーナス</span>
              <span style={{ fontWeight: 'bold', color: '#27ae60' }}>{culturalScore - (Math.min(storyData.title ? 10 : 0 + (storyData.description.length > 50 ? 20 : 0), 30) + (storyData.emotion ? 10 : 0) + (storyData.significance ? 15 : 0) + (storyData.culturalContext.length > 30 ? 20 : 0) + (storyData.tags.length * 5) + (storyData.personalReflection.length > 50 ? 25 : 0))}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#2c3e50' }}>NFT プレビュー</h3>
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '2px solid #ecf0f1'
        }}>
          {generatedArt ? (
            <img src={generatedArt} alt="NFT Preview" style={{
              width: '100%',
              maxWidth: '200px',
              borderRadius: '10px',
              marginBottom: '15px'
            }} />
          ) : (
            <div style={{
              width: '100%',
              maxWidth: '200px',
              height: '200px',
              background: '#f8f9fa',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#95a5a6',
              fontSize: '16px',
              marginBottom: '15px'
            }}>
              🎨 アートが生成されていません
            </div>
          )}
          <div>
            <h4 style={{ fontSize: '16px', margin: '0 0 5px 0', color: '#2c3e50' }}>{storyData.title || '無題の参拝記録'}</h4>
            <p style={{ fontSize: '14px', color: '#7f8c8d', margin: '0 0 10px 0' }}>{visitData?.shrineName || '神社'} - {new Date().toLocaleDateString()}</p>
            <div>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                background: culturalScore >= 150 ? '#f39c12' : 
                           culturalScore >= 120 ? '#9b59b6' : 
                           culturalScore >= 90 ? '#3498db' : 
                           culturalScore >= 60 ? '#2ecc71' : '#95a5a6',
                color: 'white'
              }}>
                {culturalScore >= 150 ? 'Legendary' : 
                 culturalScore >= 120 ? 'Epic' : 
                 culturalScore >= 90 ? 'Rare' : 
                 culturalScore >= 60 ? 'Uncommon' : 'Common'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const finalStoryData = {
      ...storyData,
      culturalScore,
      generatedArt,
      visitData,
      createdAt: new Date().toISOString()
    };
    onStoryComplete(finalStoryData);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return storyData.title && storyData.description.length > 20 && storyData.emotion;
      case 2:
        return storyData.significance && storyData.wish.length > 10;
      case 3:
        return storyData.culturalContext.length > 20 && storyData.personalReflection.length > 30;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <button 
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            color: '#95a5a6',
            cursor: 'pointer',
            zIndex: 1001,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >✕</button>
        
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{
            background: '#ecf0f1',
            borderRadius: '10px',
            height: '6px',
            marginBottom: '20px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              height: '100%',
              borderRadius: '10px',
              width: `${(currentStep / 4) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            {[1, 2, 3, 4].map(step => (
              <div 
                key={step}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: currentStep >= step ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#ecf0f1',
                  color: currentStep >= step ? 'white' : '#95a5a6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div style={{
          padding: '20px',
          borderTop: '1px solid #ecf0f1',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '15px'
        }}>
          {currentStep > 1 && (
            <button 
              onClick={handlePrevious}
              style={{
                padding: '12px 24px',
                border: '2px solid #95a5a6',
                borderRadius: '25px',
                background: 'white',
                color: '#95a5a6',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              前へ
            </button>
          )}
          
          {currentStep < 4 ? (
            <button 
              onClick={handleNext}
              disabled={!canProceed()}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '25px',
                background: canProceed() ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#95a5a6',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: canProceed() ? 'pointer' : 'not-allowed',
                marginLeft: 'auto'
              }}
            >
              次へ
            </button>
          ) : (
            <button 
              onClick={handleComplete}
              disabled={!generatedArt}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '25px',
                background: generatedArt ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' : '#95a5a6',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: generatedArt ? 'pointer' : 'not-allowed',
                marginLeft: 'auto'
              }}
            >
              NFTを作成
            </button>
          )}
        </div>
      </div>

      {/* Hidden canvas for art generation */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
        width={512}
        height={512}
      />
    </div>
  );
};

export default StoryCreationSystem;