import React from 'react';

// 参拝帯のランクシステム（空手の帯システムをオマージュ）
const BELT_RANKS = [
  { 
    level: 0, 
    name: '白帯', 
    color: '#FFFFFF', 
    gradient: 'linear-gradient(45deg, #FFFFFF 0%, #F0F0F0 100%)',
    description: '初心者 - 参拝の道への第一歩',
    minCapital: 0,
    borderColor: '#CCCCCC'
  },
  { 
    level: 1, 
    name: '黄帯', 
    color: '#FFD700', 
    gradient: 'linear-gradient(45deg, #FFD700 0%, #FFA500 100%)',
    description: '初級者 - 神社寺院の基礎を学ぶ',
    minCapital: 100,
    borderColor: '#FFA500'
  },
  { 
    level: 2, 
    name: '橙帯', 
    color: '#FF8C00', 
    gradient: 'linear-gradient(45deg, #FF8C00 0%, #FF6347 100%)',
    description: '初級者 - 参拝への理解が深まる',
    minCapital: 300,
    borderColor: '#FF6347'
  },
  { 
    level: 3, 
    name: '緑帯', 
    color: '#228B22', 
    gradient: 'linear-gradient(45deg, #228B22 0%, #32CD32 100%)',
    description: '中級者 - 文化の実践者',
    minCapital: 600,
    borderColor: '#32CD32'
  },
  { 
    level: 4, 
    name: '青帯', 
    color: '#4169E1', 
    gradient: 'linear-gradient(45deg, #4169E1 0%, #1E90FF 100%)',
    description: '中級者 - 文化の担い手',
    minCapital: 1000,
    borderColor: '#1E90FF'
  },
  { 
    level: 5, 
    name: '紫帯', 
    color: '#8B008B', 
    gradient: 'linear-gradient(45deg, #8B008B 0%, #9370DB 100%)',
    description: '上級者 - 文化の継承者',
    minCapital: 1500,
    borderColor: '#9370DB'
  },
  { 
    level: 6, 
    name: '茶帯', 
    color: '#8B4513', 
    gradient: 'linear-gradient(45deg, #8B4513 0%, #A0522D 100%)',
    description: '上級者 - 文化の守護者',
    minCapital: 2500,
    borderColor: '#A0522D'
  },
  { 
    level: 7, 
    name: '紅帯', 
    color: '#DC143C', 
    gradient: 'linear-gradient(45deg, #DC143C 0%, #FF1493 100%)',
    description: '達人 - 文化の導師',
    minCapital: 4000,
    borderColor: '#FF1493'
  },
  { 
    level: 8, 
    name: '黒帯', 
    color: '#000000', 
    gradient: 'linear-gradient(45deg, #000000 0%, #333333 100%)',
    description: '師範 - 文化の大家',
    minCapital: 6000,
    borderColor: '#333',
    special: true
  },
  { 
    level: 9, 
    name: '金帯', 
    color: '#FFD700', 
    gradient: 'linear-gradient(45deg, #FFD700 0%, #FFF8DC 50%, #FFD700 100%)',
    description: '宗師 - 文化の最高位',
    minCapital: 10000,
    borderColor: '#FFF',
    special: true,
    glow: true
  }
];

const CulturalBelt = ({ culturalCapital, level, userName }) => {
  // 文化資本に基づいて帯のランクを決定
  const getCurrentBelt = () => {
    for (let i = BELT_RANKS.length - 1; i >= 0; i--) {
      if (culturalCapital >= BELT_RANKS[i].minCapital) {
        return BELT_RANKS[i];
      }
    }
    return BELT_RANKS[0];
  };

  const currentBelt = getCurrentBelt();
  const nextBelt = BELT_RANKS[currentBelt.level + 1];
  const progress = nextBelt 
    ? ((culturalCapital - currentBelt.minCapital) / (nextBelt.minCapital - currentBelt.minCapital)) * 100
    : 100;

  return (
    <div className="cultural-belt-container">
      <div className="belt-header">
        <h2 className="belt-title">文化帯ランク</h2>
      </div>
      
      <div className="current-rank">
        <div className={`belt-display ${currentBelt.special ? 'special' : ''} ${currentBelt.glow ? 'glow' : ''}`}>
          <div 
            className="belt-gradient"
            style={{ 
              background: currentBelt.gradient,
              border: `2px solid ${currentBelt.borderColor}`
            }}
          >
            {/* 帯の縞模様 */}
            <div className="belt-stripes">
              {currentBelt.level > 0 && [...Array(Math.min(currentBelt.level, 3))].map((_, i) => (
                <div key={i} className="stripe"></div>
              ))}
            </div>
            
            {/* 帯の結び目 */}
            <div className="belt-knot"></div>
          </div>
        </div>
        
        <div className="rank-info">
          <h3 className="rank-name">{currentBelt.name}</h3>
          <p className="cultural-capital">
            文化資本: <span className="capital-value">{culturalCapital.toLocaleString()}</span>
          </p>
        </div>
      </div>
      
      {/* 次の帯への進捗 */}
      {nextBelt && (
        <div className="belt-progress">
          <div className="progress-header">
            <span>現在: {currentBelt.name}</span>
            <span>次の段位: {nextBelt.name}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="progress-info">
            あと <strong>{(nextBelt.minCapital - culturalCapital).toLocaleString()}</strong> 文化資本で昇段
          </p>
        </div>
      )}
      
      {/* 帯の履歴 */}
      <div className="belt-history">
        <h3 className="history-title">段位の道のり</h3>
        <div className="belt-timeline">
          <div className="timeline-line"></div>
          {BELT_RANKS.map((belt) => {
            const isAchieved = culturalCapital >= belt.minCapital;
            const isCurrent = belt.level === currentBelt.level;
            
            return (
              <div key={belt.level} className="belt-node">
                <div 
                  className={`belt-circle ${isAchieved ? 'achieved' : ''} ${isCurrent ? 'current' : ''}`}
                  style={{ 
                    background: isAchieved ? belt.gradient : '#ddd',
                    border: `2px solid ${isAchieved ? belt.borderColor : '#ccc'}`
                  }}
                />
                <span className={`belt-label ${isAchieved ? 'achieved' : ''} ${isCurrent ? 'current' : ''}`}>
                  {belt.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* 特別な演出 */}
      {currentBelt.special && (
        <div className="special-effects">
          <p className="special-message">
            {currentBelt.level === 8 ? '黒帯到達！文化の師範として認められました。' : ''}
            {currentBelt.level === 9 ? '金帯到達！文化の最高位に到達しました！' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

// Helper function to get belt info from cultural capital
export const getBeltRank = (culturalCapital) => {
  for (let i = BELT_RANKS.length - 1; i >= 0; i--) {
    if (culturalCapital >= BELT_RANKS[i].minCapital) {
      return BELT_RANKS[i];
    }
  }
  return BELT_RANKS[0];
};

export default CulturalBelt;