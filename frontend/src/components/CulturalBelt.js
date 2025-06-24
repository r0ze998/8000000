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

      <style jsx>{`
        .cultural-belt-container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin: 20px auto;
          position: relative;
          overflow: hidden;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .cultural-belt-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
          animation: shimmer 15s linear infinite;
        }

        @keyframes shimmer {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .belt-header {
          text-align: center;
          margin-bottom: 30px;
          position: relative;
          z-index: 1;
        }

        .belt-title {
          font-size: 24px;
          font-weight: bold;
          color: white;
          margin-bottom: 10px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .current-rank {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 30px;
          position: relative;
          z-index: 1;
        }

        .belt-display {
          width: 200px;
          height: 40px;
          border-radius: 5px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .belt-display:hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 20px rgba(0, 0, 0, 0.4);
        }

        .belt-gradient {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, var(--belt-color) 0%, var(--belt-color-light) 50%, var(--belt-color) 100%);
          position: relative;
        }

        .belt-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
          animation: belt-shine 3s ease-in-out infinite;
        }

        @keyframes belt-shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .belt-stripes {
          position: absolute;
          top: 50%;
          left: 10px;
          transform: translateY(-50%);
          display: flex;
          gap: 3px;
        }

        .stripe {
          width: 3px;
          height: 20px;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 1px;
        }

        .belt-knot {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          width: 25px;
          height: 25px;
          background: radial-gradient(circle, rgba(0, 0, 0, 0.4) 0%, transparent 70%);
          border-radius: 50%;
        }

        .rank-info {
          text-align: center;
        }

        .rank-name {
          font-size: 28px;
          font-weight: bold;
          color: white;
          margin-bottom: 5px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .cultural-capital {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.8);
        }

        .capital-value {
          font-weight: bold;
          color: #4CAF50;
          font-size: 18px;
        }

        .belt-progress {
          margin: 30px 0;
          position: relative;
          z-index: 1;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .progress-bar {
          width: 100%;
          height: 20px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          overflow: hidden;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%);
          transition: width 0.5s ease;
          position: relative;
          overflow: hidden;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
          animation: progress-shine 2s linear infinite;
        }

        @keyframes progress-shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .belt-history {
          margin-top: 30px;
          position: relative;
          z-index: 1;
        }

        .history-title {
          font-size: 18px;
          font-weight: bold;
          color: white;
          margin-bottom: 20px;
          text-align: center;
        }

        .belt-timeline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          padding: 20px 0;
        }

        .timeline-line {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #ddd 0%, #bbb 100%);
          z-index: 0;
        }

        .belt-node {
          position: relative;
          z-index: 1;
          text-align: center;
          transition: all 0.3s ease;
        }

        .belt-node:hover {
          transform: scale(1.1);
        }

        .belt-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin: 0 auto 5px;
          position: relative;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .belt-circle.achieved {
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
        }

        .belt-circle.current {
          width: 40px;
          height: 40px;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .belt-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          white-space: nowrap;
        }

        .belt-label.achieved {
          font-weight: bold;
          color: rgba(255, 255, 255, 0.9);
        }

        .belt-label.current {
          color: #4CAF50;
          font-weight: bold;
        }

        /* Special effects for master belts */
        .belt-display.special {
          animation: special-glow 3s ease-in-out infinite;
        }

        @keyframes special-glow {
          0%, 100% { box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); }
          50% { box-shadow: 0 5px 30px rgba(255, 215, 0, 0.6); }
        }

        .belt-display.glow::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
          animation: glow-rotate 5s linear infinite;
        }

        @keyframes glow-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Progress info styling */
        .progress-info {
          text-align: center;
          margin-top: 10px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .progress-info strong {
          color: #4CAF50;
          font-weight: 700;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .cultural-belt-container {
            padding: 20px 15px;
            margin: 20px 0;
            width: 100%;
          }

          .belt-display {
            width: 150px;
            height: 30px;
          }

          .rank-name {
            font-size: 24px;
          }

          .belt-timeline {
            overflow-x: auto;
            padding-bottom: 10px;
            -webkit-overflow-scrolling: touch;
          }

          .belt-node {
            margin: 0 10px;
          }
          
          .current-rank {
            flex-direction: column;
            gap: 15px;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .cultural-belt-container {
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
          }

          .belt-title,
          .rank-name,
          .history-title {
            color: #f0f0f0;
          }

          .cultural-capital,
          .progress-header,
          .belt-label {
            color: #ccc;
          }

          .progress-bar {
            background: rgba(255, 255, 255, 0.1);
          }

          .timeline-line {
            background: linear-gradient(90deg, #444 0%, #666 100%);
          }
        }
      `}</style>
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