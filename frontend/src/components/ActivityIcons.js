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

// アクティビティアイコンのマッピング
export const ActivityIconComponents = {
  shrine: ShrineIcon,
  temple: TempleIcon
};