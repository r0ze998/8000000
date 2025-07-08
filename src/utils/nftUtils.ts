export interface NFTRarity {
  name: string;
  probability: number;
  color: string;
}

export const RARITY_TYPES: NFTRarity[] = [
  { name: 'common', probability: 0.6, color: '#9CA3AF' },
  { name: 'rare', probability: 0.25, color: '#3B82F6' },
  { name: 'epic', probability: 0.12, color: '#9F7AEA' },
  { name: 'legendary', probability: 0.03, color: '#FFD700' }
];

export const calculateRarity = (): string => {
  const random = Math.random();
  let cumulativeProbability = 0;

  for (const rarity of RARITY_TYPES) {
    cumulativeProbability += rarity.probability;
    if (random <= cumulativeProbability) {
      return rarity.name;
    }
  }

  return 'common';
};

export const getRarityColor = (rarity: string): string => {
  const colors = {
    common: '#9CA3AF',
    rare: '#3B82F6', 
    epic: '#9F7AEA',
    legendary: '#FFD700'
  };

  return colors[rarity as keyof typeof colors] || colors.common;
};

export const generateNFTMetadata = (shrineId: string, visitCount: number) => {
  const rarity = calculateRarity();
  const timestamp = Date.now();

  return {
    id: `${shrineId}_${timestamp}`,
    name: `Goshuin #${visitCount}`,
    description: `Sacred stamp from shrine visit #${visitCount}`,
    rarity,
    color: getRarityColor(rarity),
    attributes: {
      shrineId,
      visitCount,
      timestamp,
      rarity
    }
  };
};

// NFT types for omikuji drops
const NFT_TYPES = [
  { type: 'spirit', emoji: '👻', name: '精霊', power: 100 },
  { type: 'blessing', emoji: '🌟', name: '祝福', power: 150 },
  { type: 'protection', emoji: '🛡️', name: '守護', power: 200 },
  { type: 'wisdom', emoji: '📿', name: '知恵', power: 120 },
  { type: 'fortune', emoji: '🍀', name: '幸運', power: 180 }
];

export const dropNFTFromOmikuji = (omikujiResult: string) => {
  // Drop rate based on omikuji result
  const dropRates = {
    '大吉': 0.8,
    '中吉': 0.6,
    '吉': 0.4,
    '小吉': 0.3,
    '末吉': 0.2,
    '凶': 0.1
  };

  const dropRate = dropRates[omikujiResult as keyof typeof dropRates] || 0.1;
  
  if (Math.random() < dropRate) {
    const nftType = NFT_TYPES[Math.floor(Math.random() * NFT_TYPES.length)];
    const rarity = calculateRarity();
    const timestamp = Date.now();

    return {
      id: `omikuji_${timestamp}`,
      name: nftType!.name,
      type: nftType!.type,
      rarity,
      power: nftType!.power,
      color: getRarityColor(rarity),
      emoji: nftType!.emoji,
      description: `${omikujiResult}から授かった${nftType!.name}`,
      timestamp
    };
  }

  return null;
};

export const generateSVGBase64 = (nftData: any): string => {
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${nftData.color || '#000'}"/>
      <text x="100" y="100" text-anchor="middle" dominant-baseline="middle" 
            font-size="60" fill="white">${nftData.emoji || '🎁'}</text>
      <text x="100" y="150" text-anchor="middle" dominant-baseline="middle" 
            font-size="16" fill="white">${nftData.name || 'NFT'}</text>
    </svg>
  `;
  
  return btoa(svg);
};