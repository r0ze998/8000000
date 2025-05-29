import React from 'react';

// 神社参拝アイコン
export const ShrineIcon = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <defs>
      <linearGradient id="shrineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#FF6B6B', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#DC143C', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle cx="30" cy="30" r="28" fill="url(#shrineGrad)" opacity="0.2" />
    <path d="M10 25 L50 25 L45 20 L15 20 Z" fill="#DC143C" />
    <rect x="18" y="25" width="4" height="20" fill="#DC143C" />
    <rect x="38" y="25" width="4" height="20" fill="#DC143C" />
    <rect x="10" y="18" width="40" height="3" fill="#DC143C" />
  </svg>
);

// 寺院参拝アイコン
export const TempleIcon = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <defs>
      <linearGradient id="templeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#8B4513', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#654321', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle cx="30" cy="30" r="28" fill="url(#templeGrad)" opacity="0.2" />
    {[0, 1, 2].map(i => (
      <polygon 
        key={i}
        points={`20,${40-i*10} 40,${40-i*10} 38,${35-i*10} 22,${35-i*10}`}
        fill="#8B4513"
      />
    ))}
    <polygon points="30,10 28,15 32,15" fill="#FFD700" />
  </svg>
);

// 祭りアイコン
export const FestivalIcon = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <defs>
      <radialGradient id="festivalGrad">
        <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#FF6347', stopOpacity: 1 }} />
      </radialGradient>
    </defs>
    <circle cx="30" cy="30" r="28" fill="url(#festivalGrad)" opacity="0.3" />
    {/* 提灯 */}
    <ellipse cx="20" cy="25" rx="6" ry="10" fill="#FF6347" />
    <ellipse cx="40" cy="25" rx="6" ry="10" fill="#FFD700" />
    {/* 紐 */}
    <path d="M20 15 Q30 20 40 15" stroke="#8B4513" strokeWidth="2" fill="none" />
    {/* 飾り */}
    <circle cx="30" cy="40" r="5" fill="#DC143C" />
  </svg>
);

// 伝統工芸アイコン
export const CraftIcon = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <defs>
      <linearGradient id="craftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#D4A574', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#8B4513', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle cx="30" cy="30" r="28" fill="url(#craftGrad)" opacity="0.2" />
    {/* 筆 */}
    <rect x="25" y="15" width="4" height="25" fill="#8B4513" transform="rotate(-20 27 27)" />
    <polygon points="23,12 27,8 31,12" fill="#333" transform="rotate(-20 27 27)" />
    {/* 壺 */}
    <ellipse cx="35" cy="35" rx="8" ry="10" fill="#D4A574" />
    <ellipse cx="35" cy="30" rx="6" ry="3" fill="#8B4513" />
  </svg>
);

// 茶道アイコン
export const TeaIcon = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <defs>
      <radialGradient id="teaGrad">
        <stop offset="0%" style={{ stopColor: '#90EE90', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#228B22', stopOpacity: 1 }} />
      </radialGradient>
    </defs>
    <circle cx="30" cy="30" r="28" fill="url(#teaGrad)" opacity="0.2" />
    {/* 茶碗 */}
    <path d="M20 30 Q30 40 40 30 L38 35 Q30 42 22 35 Z" fill="#654321" />
    {/* 茶筅 */}
    <rect x="28" y="20" width="4" height="10" fill="#D2691E" />
    <rect x="26" y="18" width="8" height="3" fill="#8B4513" />
    {/* 湯気 */}
    <path d="M25 28 Q27 25 25 22" stroke="#90EE90" strokeWidth="2" fill="none" opacity="0.7" />
    <path d="M30 28 Q32 25 30 22" stroke="#90EE90" strokeWidth="2" fill="none" opacity="0.7" />
    <path d="M35 28 Q37 25 35 22" stroke="#90EE90" strokeWidth="2" fill="none" opacity="0.7" />
  </svg>
);

// 庭園アイコン
export const GardenIcon = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <defs>
      <radialGradient id="gardenGrad">
        <stop offset="0%" style={{ stopColor: '#98FB98', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#228B22', stopOpacity: 1 }} />
      </radialGradient>
    </defs>
    <circle cx="30" cy="30" r="28" fill="url(#gardenGrad)" opacity="0.3" />
    {/* 桜の花 */}
    <circle cx="25" cy="20" r="8" fill="#FFB6C1" />
    <circle cx="35" cy="25" r="6" fill="#FFC0CB" />
    {/* 池 */}
    <ellipse cx="30" cy="40" rx="15" ry="8" fill="#4682B4" opacity="0.7" />
    {/* 石 */}
    <circle cx="25" cy="38" r="3" fill="#696969" />
    <circle cx="35" cy="42" r="2" fill="#696969" />
  </svg>
);

// 歴史探訪アイコン
export const HistoryIcon = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <defs>
      <linearGradient id="historyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#DEB887', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#8B7355', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle cx="30" cy="30" r="28" fill="url(#historyGrad)" opacity="0.2" />
    {/* 巻物 */}
    <rect x="20" y="20" width="20" height="25" fill="#F5DEB3" />
    <rect x="18" y="18" width="24" height="4" fill="#8B4513" />
    <rect x="18" y="43" width="24" height="4" fill="#8B4513" />
    {/* 文字 */}
    <line x1="25" y1="26" x2="35" y2="26" stroke="#333" strokeWidth="1" />
    <line x1="25" y1="30" x2="35" y2="30" stroke="#333" strokeWidth="1" />
    <line x1="25" y1="34" x2="35" y2="34" stroke="#333" strokeWidth="1" />
  </svg>
);

// 温泉アイコン
export const OnsenIcon = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <defs>
      <radialGradient id="onsenGrad">
        <stop offset="0%" style={{ stopColor: '#87CEEB', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#4682B4', stopOpacity: 1 }} />
      </radialGradient>
    </defs>
    <circle cx="30" cy="30" r="28" fill="url(#onsenGrad)" opacity="0.3" />
    {/* 温泉 */}
    <ellipse cx="30" cy="35" rx="18" ry="10" fill="#4682B4" opacity="0.8" />
    {/* 湯気 */}
    {[0, 1, 2].map(i => (
      <circle key={i} cx={25 + i * 5} cy={25 - i * 2} r="4" fill="#FFF" opacity="0.5">
        <animate attributeName="cy" values={`${25 - i * 2};${20 - i * 2};${25 - i * 2}`} dur="3s" repeatCount="indefinite" />
      </circle>
    ))}
    {/* 石 */}
    <circle cx="22" cy="37" r="3" fill="#696969" />
    <circle cx="38" cy="36" r="2.5" fill="#696969" />
  </svg>
);

// アクティビティアイコンのマッピング
export const ActivityIconComponents = {
  shrine: ShrineIcon,
  temple: TempleIcon,
  festival: FestivalIcon,
  craft: CraftIcon,
  tea: TeaIcon,
  garden: GardenIcon,
  history: HistoryIcon,
  onsen: OnsenIcon
};