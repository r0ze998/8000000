import React from 'react';

// 鳥居のSVGコンポーネント
export const Torii = ({ level = 1, size = 100 }) => {
  const colors = {
    1: '#CD5C5C', // 基本の赤
    2: '#DC143C', // より鮮やかな赤
    3: '#FF6347', // 朱色
    4: '#FFD700'  // 金色
  };
  
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
      {/* 基礎 */}
      <rect x="20" y="85" width="15" height="15" fill="#8B4513" />
      <rect x="65" y="85" width="15" height="15" fill="#8B4513" />
      
      {/* 柱 */}
      <rect x="25" y="30" width="8" height="55" fill={colors[level]} />
      <rect x="67" y="30" width="8" height="55" fill={colors[level]} />
      
      {/* 上部の横木 */}
      <rect x="15" y="20" width="70" height="8" fill={colors[level]} />
      <rect x="10" y="15" width="80" height="5" fill={colors[level]} />
      
      {/* 装飾 */}
      {level >= 2 && (
        <>
          <circle cx="50" cy="25" r="3" fill="#FFD700" />
          <rect x="45" y="35" width="10" height="15" fill={colors[level]} opacity="0.8" />
        </>
      )}
      
      {level >= 3 && (
        <>
          <polygon points="50,10 45,15 55,15" fill="#FFD700" />
          {/* 提灯 */}
          <ellipse cx="30" cy="50" rx="5" ry="8" fill="#FF6347" opacity="0.8" />
          <ellipse cx="70" cy="50" rx="5" ry="8" fill="#FF6347" opacity="0.8" />
        </>
      )}
      
      {level >= 4 && (
        <>
          {/* 光のエフェクト */}
          <circle cx="50" cy="25" r="15" fill="#FFD700" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
};

// 五重塔のSVGコンポーネント
export const Pagoda = ({ level = 1, size = 100 }) => {
  const floors = Math.min(level + 2, 5);
  
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
      {/* 基礎 */}
      <rect x="35" y="85" width="30" height="15" fill="#8B4513" />
      
      {/* 各階層 */}
      {[...Array(floors)].map((_, i) => {
        const y = 80 - (i * 15);
        const width = 50 - (i * 5);
        const x = 50 - (width / 2);
        
        return (
          <g key={i}>
            {/* 屋根 */}
            <polygon 
              points={`${x-5},${y} ${x+width+5},${y} ${x+width},${y-5} ${x},${y-5}`}
              fill="#8B0000"
            />
            {/* 階層 */}
            <rect x={x} y={y-5} width={width} height={10} fill="#D2691E" />
          </g>
        );
      })}
      
      {/* 頂上の飾り */}
      <polygon points="50,15 48,20 52,20" fill="#FFD700" />
      
      {level >= 3 && (
        <circle cx="50" cy="12" r="3" fill="#FFD700">
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
};

// 建物タイプと対応するコンポーネントのマッピング
export const BuildingComponents = {
  torii: Torii,
  pagoda: Pagoda
};