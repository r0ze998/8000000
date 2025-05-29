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

// 茶室のSVGコンポーネント
export const TeaHouse = ({ level = 1, size = 100 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
      {/* 土台 */}
      <rect x="20" y="70" width="60" height="30" fill="#8B4513" />
      
      {/* 壁 */}
      <rect x="25" y="40" width="50" height="30" fill="#F5DEB3" />
      
      {/* 屋根 */}
      <polygon points="15,40 85,40 50,20" fill="#654321" />
      
      {/* 入口 */}
      <rect x="40" y="50" width="20" height="20" fill="#4B0000" />
      
      {/* 窓 */}
      {level >= 2 && (
        <>
          <rect x="30" y="50" width="8" height="8" fill="#FFF8DC" opacity="0.8" />
          <rect x="62" y="50" width="8" height="8" fill="#FFF8DC" opacity="0.8" />
        </>
      )}
      
      {level >= 3 && (
        <>
          {/* 庭園要素 */}
          <circle cx="85" cy="85" r="8" fill="#228B22" opacity="0.7" />
          <circle cx="15" cy="85" r="10" fill="#228B22" opacity="0.7" />
        </>
      )}
      
      {level >= 4 && (
        <>
          {/* 金の装飾 */}
          <rect x="48" y="35" width="4" height="5" fill="#FFD700" />
          <circle cx="50" cy="15" r="3" fill="#FFD700">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
};

// 庭園のSVGコンポーネント
export const Garden = ({ level = 1, size = 100 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* 池 */}
      <ellipse cx="50" cy="60" rx="35" ry="25" fill="#4682B4" opacity="0.7">
        <animate attributeName="ry" values="25;27;25" dur="4s" repeatCount="indefinite" />
      </ellipse>
      
      {/* 石 */}
      <circle cx="30" cy="55" r="8" fill="#696969" />
      <circle cx="70" cy="65" r="6" fill="#696969" />
      
      {/* 植物 */}
      <circle cx="20" cy="40" r="12" fill="#228B22" opacity="0.8" />
      <circle cx="80" cy="45" r="10" fill="#228B22" opacity="0.8" />
      
      {level >= 2 && (
        <>
          {/* 桜の木 */}
          <circle cx="25" cy="30" r="15" fill="#FFB6C1" opacity="0.8">
            <animate attributeName="r" values="15;17;15" dur="3s" repeatCount="indefinite" />
          </circle>
          <rect x="23" y="40" width="4" height="20" fill="#8B4513" />
        </>
      )}
      
      {level >= 3 && (
        <>
          {/* 橋 */}
          <rect x="40" y="50" width="20" height="4" fill="#D2691E" />
          <rect x="38" y="48" width="4" height="8" fill="#8B4513" />
          <rect x="58" y="48" width="4" height="8" fill="#8B4513" />
        </>
      )}
      
      {level >= 4 && (
        <>
          {/* 鯉 */}
          <ellipse cx="55" cy="60" rx="5" ry="2" fill="#FF6347">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 60"
              to="360 50 60"
              dur="10s"
              repeatCount="indefinite"
            />
          </ellipse>
        </>
      )}
    </svg>
  );
};

// 祭り櫓のSVGコンポーネント
export const Festival = ({ level = 1, size = 100 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* 櫓の土台 */}
      <rect x="30" y="60" width="40" height="40" fill="#8B4513" />
      
      {/* 櫓の柱 */}
      <rect x="32" y="40" width="5" height="60" fill="#654321" />
      <rect x="63" y="40" width="5" height="60" fill="#654321" />
      
      {/* 屋根 */}
      <polygon points="25,40 75,40 50,25" fill="#DC143C" />
      
      {/* 提灯 */}
      {level >= 1 && (
        <>
          <circle cx="40" cy="50" r="5" fill="#FF6347">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="50" r="5" fill="#FF6347">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" begin="1s" repeatCount="indefinite" />
          </circle>
        </>
      )}
      
      {level >= 2 && (
        <>
          {/* 旗 */}
          <rect x="48" y="15" width="4" height="20" fill="#8B4513" />
          <polygon points="52,15 70,20 52,25" fill="#FFD700">
            <animate attributeName="points" values="52,15 70,20 52,25;52,15 68,20 52,25;52,15 70,20 52,25" dur="3s" repeatCount="indefinite" />
          </polygon>
        </>
      )}
      
      {level >= 3 && (
        <>
          {/* 太鼓 */}
          <circle cx="50" cy="75" r="8" fill="#8B0000" />
          <circle cx="50" cy="75" r="6" fill="#DC143C" />
        </>
      )}
      
      {level >= 4 && (
        <>
          {/* 花火エフェクト */}
          <circle cx="25" cy="20" r="2" fill="#FFD700">
            <animate attributeName="r" values="2;8;2" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="75" cy="20" r="2" fill="#FF6347">
            <animate attributeName="r" values="2;8;2" dur="2s" begin="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0;1" dur="2s" begin="1s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
};

// 温泉のSVGコンポーネント
export const Onsen = ({ level = 1, size = 100 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* 建物 */}
      <rect x="20" y="50" width="60" height="40" fill="#8B4513" />
      <polygon points="15,50 85,50 50,30" fill="#654321" />
      
      {/* 温泉マーク */}
      <text x="50" y="45" fontSize="20" fill="#FFF" textAnchor="middle">♨</text>
      
      {/* 入口 */}
      <rect x="40" y="65" width="20" height="25" fill="#4B0000" />
      
      {/* 湯気 */}
      {[...Array(level)].map((_, i) => (
        <circle key={i} cx={30 + i * 15} cy="25" r="5" fill="#FFF" opacity="0.3">
          <animate 
            attributeName="cy" 
            values="25;15;25" 
            dur={`${3 + i}s`} 
            repeatCount="indefinite" 
          />
          <animate 
            attributeName="opacity" 
            values="0.3;0.1;0.3" 
            dur={`${3 + i}s`} 
            repeatCount="indefinite" 
          />
        </circle>
      ))}
    </svg>
  );
};

// 建物タイプと対応するコンポーネントのマッピング
export const BuildingComponents = {
  torii: Torii,
  pagoda: Pagoda,
  teahouse: TeaHouse,
  garden: Garden,
  yagura: Festival,
  bathhouse: Onsen
};