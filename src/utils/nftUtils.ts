
import { NFTItem } from '../types';

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

export const RARITY_COLORS = {
  common: '#9CA3AF',
  rare: '#3B82F6', 
  epic: '#9F7AEA',
  legendary: '#FFD700'
} as const;

export const calculateNFTRarity = (): string => {
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
  const normalizedRarity = rarity.toLowerCase() as keyof typeof RARITY_COLORS;
  return RARITY_COLORS[normalizedRarity] || RARITY_COLORS.common;
};

export const getRarityWeight = (rarity: string): number => {
  const weights = {
    common: 1,
    rare: 2,
    epic: 4,
    legendary: 8
  };
  return weights[rarity.toLowerCase() as keyof typeof weights] || 1;
};

export const generateNFTMetadata = (shrineId: string, visitCount: number) => {
  const rarity = calculateNFTRarity();
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
const OMIKUJI_NFT_TYPES = [
  { type: 'blessing', emoji: '🙏', name: '祝福' },
  { type: 'protection', emoji: '🛡️', name: '守護' },
  { type: 'wisdom', emoji: '📿', name: '智慧' },
  { type: 'fortune', emoji: '🍀', name: '幸運' }
];

export const selectRandomParts = () => {
  const terrainParts = ['🌱', '🌊', '🏔️', '🌸'];
  const structureParts = ['⛩️', '🏛️', '🗼', '🏠'];
  
  return {
    terrain: terrainParts[Math.floor(Math.random() * terrainParts.length)],
    structure: structureParts[Math.floor(Math.random() * structureParts.length)]
  };
};

export const generateSVGBase64 = (parts: any): string => {
  const svg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#e6f3ff"/>
      <text x="25" y="40" font-size="20">${parts.terrain}</text>
      <text x="50" y="70" font-size="20">${parts.structure}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const dropNFTFromOmikuji = (omikujiResult: string): NFTItem | null => {
  const dropChance = omikujiResult === '大吉' ? 0.8 : 
                   omikujiResult === '中吉' ? 0.6 :
                   omikujiResult === '吉' ? 0.4 : 0.2;
  
  if (Math.random() > dropChance) {
    return null;
  }
  
  const randomType = OMIKUJI_NFT_TYPES[Math.floor(Math.random() * OMIKUJI_NFT_TYPES.length)];
  const rarity = calculateNFTRarity();
  
  return {
    id: `omikuji_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: randomType.name,
    type: randomType.type as any,
    rarity: rarity as any,
    description: `おみくじから授かった${randomType.name}`,
    emoji: randomType.emoji,
    color: getRarityColor(rarity),
    timestamp: Date.now(),
    attributes: {
      source: 'omikuji',
      result: omikujiResult,
      blessed: true
    }
  };
};
