// NFT生成ユーティリティ関数

export const dropNFTFromOmikuji = (omikujiResult: string) => {
  const dropRates = {
    '大吉': 0.8,
    '中吉': 0.6,
    '吉': 0.4,
    '小吉': 0.3,
    '末吉': 0.2,
    '凶': 0.1
  };

  const dropChance = dropRates[omikujiResult as keyof typeof dropRates] || 0.1;
  const shouldDrop = Math.random() < dropChance;

  if (shouldDrop) {
    const droppedNFT = generateRandomNFT(omikujiResult);
    return droppedNFT;
  }
  return null;
};

export const generateRandomNFT = (omikujiResult: string) => {
  const nftTypes = [
    { 
      type: 'torii', 
      emoji: '⛩️', 
      name: '鳥居', 
      colors: ['#FFD700', '#DC2626', '#8B4513'],
      description: '神社の入り口を飾る神聖な門'
    },
    { 
      type: 'roof', 
      emoji: '🏯', 
      name: '屋根', 
      colors: ['#DC2626', '#8B4513', '#059669'],
      description: '伝統的な日本建築の美しい屋根'
    },
    { 
      type: 'pillar', 
      emoji: '🪵', 
      name: '柱', 
      colors: ['#8B4513', '#92400E', '#451A03'],
      description: '神社を支える重要な構造物'
    },
    { 
      type: 'decoration', 
      emoji: '🌸', 
      name: '桜装飾', 
      colors: ['#FFB7C5', '#F472B6', '#EC4899'],
      description: '季節を彩る美しい装飾'
    }
  ];

  const rarityMap = {
    '大吉': 'legendary',
    '中吉': 'epic', 
    '吉': 'rare',
    '小吉': 'uncommon',
    '末吉': 'common',
    '凶': 'common'
  };

  const selectedType = nftTypes[Math.floor(Math.random() * nftTypes.length)];
  const rarity = rarityMap[omikujiResult as keyof typeof rarityMap] || 'common';
  const color = selectedType?.colors[Math.floor(Math.random() * selectedType.colors.length)] || '#FFD700';

  return {
    id: Date.now(),
    name: selectedType?.name || 'NFT',
    type: selectedType?.type || 'decoration',
    emoji: selectedType?.emoji || '🌸',
    rarity: rarity,
    color: color,
    power: Math.floor(Math.random() * 50) + 10,
    description: selectedType?.description || '美しいNFT',
    timestamp: new Date().toISOString()
  };
};

export const generateSVGBase64 = (nftData: any): string => {
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${nftData.color}"/>
      <text x="100" y="120" text-anchor="middle" font-size="60" fill="white">
        ${nftData.emoji}
      </text>
      <text x="100" y="180" text-anchor="middle" font-size="16" fill="white" font-family="Arial">
        ${nftData.name}
      </text>
    </svg>
  `;
  return btoa(svg);
};

export const getRarityColor = (rarity: string) => {
  const colors = {
    common: '#94a3b8',
    uncommon: '#22d3ee', 
    rare: '#a855f7',
    epic: '#f59e0b',
    legendary: '#ef4444'
  };
  return colors[rarity as keyof typeof colors] || colors.common;
};