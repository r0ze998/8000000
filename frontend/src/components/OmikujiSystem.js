import React, { useState, useEffect, useRef } from 'react';
import { 
  drawOmikuji, 
  OMIKUJI_ACHIEVEMENTS, 
  SPECIAL_OMIKUJI,
  generateOmikujiNFTMetadata,
  FORTUNE_CATEGORIES,
  getCurrentSeason
} from '../data/omikujiDatabase';
import './OmikujiSystem.css';

const OmikujiSystem = ({ 
  shrineData, 
  onOmikujiDrawn, 
  playerStats = {},
  onNFTMint,
  userCollection = {}
}) => {
  // State management
  const [currentOmikuji, setCurrentOmikuji] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isUnfolding, setIsUnfolding] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [collectionStats, setCollectionStats] = useState({
    total: 0,
    byFortune: {},
    achievements: [],
    specialOmikuji: []
  });
  const [showParticles, setShowParticles] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Refs for animations
  const omikujiBoxRef = useRef(null);
  const paperRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize collection stats
  useEffect(() => {
    updateCollectionStats();
  }, [userCollection]);

  // Update collection statistics
  const updateCollectionStats = () => {
    const stats = {
      total: userCollection.omikujiDrawn || 0,
      byFortune: userCollection.fortuneCount || {},
      achievements: checkAchievements(),
      specialOmikuji: userCollection.specialOmikuji || [],
      lastDrawn: userCollection.lastOmikujiDate || null
    };
    setCollectionStats(stats);
  };

  // Check achievements
  const checkAchievements = () => {
    const achievements = [];
    const total = userCollection.omikujiDrawn || 0;
    
    // Check count-based achievements
    Object.entries(OMIKUJI_ACHIEVEMENTS).forEach(([key, achievement]) => {
      if (typeof achievement.requirement === 'number' && total >= achievement.requirement) {
        achievements.push(achievement);
      }
    });
    
    // Check special achievements
    if (userCollection.fortuneCount?.['大吉'] > 0) {
      achievements.push(OMIKUJI_ACHIEVEMENTS.lucky);
    }
    
    if (userCollection.fortuneCount?.['大凶'] > 0) {
      achievements.push(OMIKUJI_ACHIEVEMENTS.resilient);
    }
    
    // Check if all fortunes collected
    const allFortunes = ['大吉', '中吉', '小吉', '吉', '末吉', '凶', '大凶'];
    const hasAllFortunes = allFortunes.every(fortune => 
      (userCollection.fortuneCount?.[fortune] || 0) > 0
    );
    if (hasAllFortunes) {
      achievements.push(OMIKUJI_ACHIEVEMENTS.complete);
    }
    
    return achievements;
  };

  // Draw omikuji animation sequence
  const handleDrawOmikuji = async () => {
    if (isDrawing) return;
    
    setIsDrawing(true);
    setCurrentOmikuji(null);
    setShowParticles(false);
    
    // Check if daily limit reached
    const today = new Date().toDateString();
    const lastDrawDate = userCollection.lastOmikujiDate ? 
      new Date(userCollection.lastOmikujiDate).toDateString() : null;
    
    if (lastDrawDate === today && (userCollection.dailyOmikujiCount || 0) >= 3) {
      alert('本日のおみくじは3回までです。明日またお越しください。');
      setIsDrawing(false);
      return;
    }
    
    // Start shake animation
    setIsShaking(true);
    playSound('shake');
    
    // Shake for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsShaking(false);
    
    // Draw the omikuji
    const shrineCategory = shrineData.benefits?.[0] ? 
      mapBenefitToCategory(shrineData.benefits[0]) : null;
    const drawnOmikuji = drawOmikuji(selectedCategory || shrineCategory);
    
    // Check for special omikuji
    const specialUnlocked = checkSpecialOmikuji(drawnOmikuji);
    if (specialUnlocked) {
      drawnOmikuji.special = specialUnlocked;
    }
    
    setCurrentOmikuji(drawnOmikuji);
    
    // Start unfold animation
    setIsUnfolding(true);
    playSound(drawnOmikuji.rarity.sound);
    
    // Show particles for rare fortunes
    if (['大吉', '中吉', '大凶'].includes(drawnOmikuji.fortune)) {
      setShowParticles(true);
    }
    
    // Update player stats
    const updatedCollection = updatePlayerCollection(drawnOmikuji);
    
    // Callback to parent
    if (onOmikujiDrawn) {
      onOmikujiDrawn(drawnOmikuji, updatedCollection);
    }
    
    // Auto-hide particles after 3 seconds
    setTimeout(() => {
      setShowParticles(false);
    }, 3000);
    
    setIsDrawing(false);
  };

  // Map shrine benefits to fortune categories
  const mapBenefitToCategory = (benefit) => {
    const mapping = {
      '学業成就': '学業運',
      '恋愛成就': '恋愛運',
      '商売繁盛': '金運',
      '健康長寿': '健康運',
      '仕事運': '仕事運'
    };
    return mapping[benefit] || null;
  };

  // Check for special omikuji unlock conditions
  const checkSpecialOmikuji = (omikuji) => {
    const season = getCurrentSeason();
    
    // Check moon phase for 月読みくじ
    if (isFullMoon() && !userCollection.specialOmikuji?.includes('tsukuyomi')) {
      return SPECIAL_OMIKUJI.月読;
    }
    
    // Check season for 桜吹雪みくじ
    if (season === '桜花' && !userCollection.specialOmikuji?.includes('sakurafubuki')) {
      return SPECIAL_OMIKUJI.桜吹雪;
    }
    
    // Check achievement for 神託みくじ
    if (collectionStats.total >= 99 && !userCollection.specialOmikuji?.includes('shintaku')) {
      return SPECIAL_OMIKUJI.神託;
    }
    
    return null;
  };

  // Check if it's a full moon
  const isFullMoon = () => {
    // Simplified moon phase calculation
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // This is a simplified calculation - in production, use a proper lunar calendar
    const moonPhase = ((year + month + day) % 30) / 30;
    return moonPhase > 0.45 && moonPhase < 0.55;
  };

  // Update player collection
  const updatePlayerCollection = (omikuji) => {
    const today = new Date().toDateString();
    const updatedCollection = {
      ...userCollection,
      omikujiDrawn: (userCollection.omikujiDrawn || 0) + 1,
      fortuneCount: {
        ...userCollection.fortuneCount,
        [omikuji.fortune]: (userCollection.fortuneCount?.[omikuji.fortune] || 0) + 1
      },
      lastOmikujiDate: new Date().toISOString(),
      dailyOmikujiCount: userCollection.lastOmikujiDate && 
        new Date(userCollection.lastOmikujiDate).toDateString() === today ?
        (userCollection.dailyOmikujiCount || 0) + 1 : 1
    };
    
    // Add special omikuji if unlocked
    if (omikuji.special) {
      updatedCollection.specialOmikuji = [
        ...(userCollection.specialOmikuji || []),
        omikuji.special.id
      ];
    }
    
    return updatedCollection;
  };

  // Play sound effects
  const playSound = (type) => {
    // Sound implementation would go here
    console.log(`Playing sound: ${type}`);
  };

  // Handle NFT minting
  const handleMintNFT = async () => {
    if (!currentOmikuji || !onNFTMint) return;
    
    const metadata = generateOmikujiNFTMetadata(currentOmikuji, shrineData);
    
    try {
      await onNFTMint(metadata);
      alert('おみくじNFTが正常にミントされました！');
    } catch (error) {
      console.error('NFT minting failed:', error);
      alert('NFTのミントに失敗しました。');
    }
  };

  // Toggle collection view
  const toggleCollection = () => {
    setShowCollection(!showCollection);
  };

  return (
    <div className="omikuji-system">
      {/* Main Omikuji Interface */}
      <div className="omikuji-main">
        <h2 className="omikuji-title">
          <span className="title-icon">🎋</span>
          おみくじ
          <span className="title-icon">🎋</span>
        </h2>

        {/* Category Selection */}
        <div className="category-selection">
          <h3>運勢を選ぶ（任意）</h3>
          <div className="category-buttons">
            {Object.entries(FORTUNE_CATEGORIES).map(([key, category]) => (
              <button
                key={key}
                className={`category-button ${selectedCategory === key ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(key)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Omikuji Box */}
        <div className="omikuji-container">
          <div 
            ref={omikujiBoxRef}
            className={`omikuji-box ${isShaking ? 'shaking' : ''}`}
          >
            <div className="box-top">
              <div className="box-hole"></div>
            </div>
            <div className="box-body">
              <div className="box-pattern"></div>
              <div className="box-text">おみくじ</div>
            </div>
            {!currentOmikuji && (
              <button
                className="draw-button"
                onClick={handleDrawOmikuji}
                disabled={isDrawing}
              >
                {isDrawing ? '引いています...' : 'おみくじを引く'}
              </button>
            )}
          </div>

          {/* Omikuji Paper */}
          {currentOmikuji && (
            <div 
              ref={paperRef}
              className={`omikuji-paper ${isUnfolding ? 'unfolding' : ''}`}
            >
              <div className="paper-content">
                <h3 className={`fortune-title fortune-${currentOmikuji.fortune}`}>
                  {currentOmikuji.fortune}
                </h3>
                
                {currentOmikuji.special && (
                  <div className="special-badge">
                    ✨ {currentOmikuji.special.name} ✨
                  </div>
                )}
                
                <div className="fortune-category">
                  {FORTUNE_CATEGORIES[currentOmikuji.category].icon} 
                  {FORTUNE_CATEGORIES[currentOmikuji.category].name}
                </div>
                
                <div className="fortune-message">
                  {currentOmikuji.seasonalMessage || currentOmikuji.message}
                </div>
                
                {currentOmikuji.poem && (
                  <div className="fortune-poem">
                    <div className="poem-text">{currentOmikuji.poem.text}</div>
                    <div className="poem-meaning">{currentOmikuji.poem.meaning}</div>
                  </div>
                )}
                
                <div className="paper-actions">
                  <button 
                    className="action-button"
                    onClick={handleDrawOmikuji}
                  >
                    もう一度引く
                  </button>
                  {onNFTMint && (
                    <button 
                      className="action-button mint-button"
                      onClick={handleMintNFT}
                    >
                      NFTとして保存
                    </button>
                  )}
                </div>
              </div>
              
              <div className="paper-fold"></div>
            </div>
          )}
        </div>

        {/* Particle Effects */}
        {showParticles && currentOmikuji && (
          <div className={`particle-container particle-${currentOmikuji.rarity.particles}`}>
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Collection Button */}
      <button 
        className="collection-toggle"
        onClick={toggleCollection}
      >
        📚 コレクション ({collectionStats.total})
      </button>

      {/* Collection View */}
      {showCollection && (
        <div className="omikuji-collection">
          <div className="collection-header">
            <h3>おみくじコレクション</h3>
            <button 
              className="close-button"
              onClick={toggleCollection}
            >
              ✕
            </button>
          </div>

          {/* Statistics */}
          <div className="collection-stats">
            <div className="stat-card">
              <h4>総引き数</h4>
              <div className="stat-value">{collectionStats.total}</div>
            </div>
            
            <div className="stat-card">
              <h4>運勢分布</h4>
              <div className="fortune-distribution">
                {['大吉', '中吉', '小吉', '吉', '末吉', '凶', '大凶'].map(fortune => (
                  <div key={fortune} className="fortune-stat">
                    <span className={`fortune-label fortune-${fortune}`}>
                      {fortune}
                    </span>
                    <span className="fortune-count">
                      {collectionStats.byFortune[fortune] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="achievements-section">
            <h4>実績</h4>
            <div className="achievements-grid">
              {collectionStats.achievements.map(achievement => (
                <div key={achievement.id} className="achievement-card unlocked">
                  <div className="achievement-icon">🏆</div>
                  <div className="achievement-name">{achievement.name}</div>
                  <div className="achievement-desc">{achievement.description}</div>
                  <div className="achievement-reward">{achievement.reward}</div>
                </div>
              ))}
              
              {/* Show locked achievements */}
              {Object.values(OMIKUJI_ACHIEVEMENTS)
                .filter(a => !collectionStats.achievements.find(ua => ua.id === a.id))
                .map(achievement => (
                  <div key={achievement.id} className="achievement-card locked">
                    <div className="achievement-icon">🔒</div>
                    <div className="achievement-name">???</div>
                    <div className="achievement-desc">{achievement.description}</div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Special Omikuji */}
          <div className="special-section">
            <h4>特殊おみくじ</h4>
            <div className="special-grid">
              {Object.values(SPECIAL_OMIKUJI).map(special => {
                const isUnlocked = collectionStats.specialOmikuji.includes(special.id);
                return (
                  <div 
                    key={special.id} 
                    className={`special-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                  >
                    <div className="special-icon">
                      {isUnlocked ? '⭐' : '❓'}
                    </div>
                    <div className="special-name">
                      {isUnlocked ? special.name : '???'}
                    </div>
                    <div className="special-condition">
                      {special.unlockCondition}
                    </div>
                    {isUnlocked && (
                      <div className="special-effect">{special.effect}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OmikujiSystem;