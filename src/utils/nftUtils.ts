
// =============================================================================
// NFT Utilities
// =============================================================================

import { NFTItem } from '../types';

// NFT rarity types
export const NFT_RARITIES = {
  common: 'common',
  rare: 'rare',
  epic: 'epic',
  legendary: 'legendary'
} as const;

// NFT types
export const NFT_TYPES = {
  structure: 'structure',
  nature: 'nature',
  guardian: 'guardian',
  decoration: 'decoration',
  sacred: 'sacred'
} as const;

// NFT templates for drops
const NFT_TEMPLATES = [
  // Structure NFTs
  { name: '鳥居', type: 'structure', emoji: '⛩️', color: '#FF6B6B', rarity: 'common' },
  { name: '本殿', type: 'structure', emoji: '🏛️', color: '#4ECDC4', rarity: 'rare' },
  { name: '五重塔', type: 'structure', emoji: '🏯', color: '#45B7D1', rarity: 'epic' },
  { name: '金閣', type: 'structure', emoji: '🏰', color: '#FFD700', rarity: 'legendary' },
  
  // Nature NFTs
  { name: '桜', type: 'nature', emoji: '🌸', color: '#FFB6C1', rarity: 'common' },
  { name: '松', type: 'nature', emoji: '🌲', color: '#228B22', rarity: 'rare' },
  { name: '紅葉', type: 'nature', emoji: '🍁', color: '#FF6347', rarity: 'epic' },
  { name: '神木', type: 'nature', emoji: '🌳', color: '#32CD32', rarity: 'legendary' },
  
  // Guardian NFTs
  { name: '狛犬', type: 'guardian', emoji: '🐕', color: '#8B4513', rarity: 'rare' },
  { name: '龍', type: 'guardian', emoji: '🐉', color: '#FF4500', rarity: 'epic' },
  { name: '鳳凰', type: 'guardian', emoji: '🦅', color: '#FF1493', rarity: 'legendary' },
  
  // Decoration NFTs
  { name: '提灯', type: 'decoration', emoji: '🏮', color: '#FF69B4', rarity: 'common' },
  { name: '風鈴', type: 'decoration', emoji: '🎐', color: '#87CEEB', rarity: 'rare' },
  { name: '御神輿', type: 'decoration', emoji: '🎊', color: '#FFD700', rarity: 'epic' },
  
  // Sacred NFTs
  { name: '御守り', type: 'sacred', emoji: '🛡️', color: '#9370DB', rarity: 'rare' },
  { name: '神鏡', type: 'sacred', emoji: '🪞', color: '#C0C0C0', rarity: 'epic' },
  { name: '神剣', type: 'sacred', emoji: '⚔️', color: '#FFD700', rarity: 'legendary' }
];

// Drop rates for omikuji results
const OMIKUJI_DROP_RATES = {
  '大吉': 0.8,
  '中吉': 0.6,
  '吉': 0.4,
  '小吉': 0.3,
  '末吉': 0.2,
  '凶': 0.1
};

// Rarity drop rates
const RARITY_WEIGHTS = {
  common: 50,
  rare: 30,
  epic: 15,
  legendary: 5
};

// Drop NFT from omikuji result
export const dropNFTFromOmikuji = (omikujiResult: string): NFTItem | null => {
  const dropRate = OMIKUJI_DROP_RATES[omikujiResult as keyof typeof OMIKUJI_DROP_RATES] || 0.1;
  
  if (Math.random() > dropRate) {
    return null; // No drop
  }

  // Determine rarity based on weights
  const totalWeight = Object.values(RARITY_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  const randomValue = Math.random() * totalWeight;
  
  let cumulativeWeight = 0;
  let selectedRarity = 'common';
  
  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    cumulativeWeight += weight;
    if (randomValue <= cumulativeWeight) {
      selectedRarity = rarity;
      break;
    }
  }

  // Filter templates by rarity
  const availableTemplates = NFT_TEMPLATES.filter(template => template.rarity === selectedRarity);
  if (availableTemplates.length === 0) {
    return null;
  }

  const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];

  return {
    id: `nft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: template.name,
    type: template.type,
    emoji: template.emoji,
    color: template.color,
    rarity: template.rarity,
    power: Math.floor(Math.random() * 100) + 1,
    pixelData: template.emoji,
    animation: 'none',
    isOwned: true,
    description: `${template.name} - ${omikujiResult}の結果で獲得`,
    timestamp: Date.now(),
    attributes: {}
  } as NFTItem;
};

// Get rarity color for display
export const getRarityColor = (rarity: string): string => {
  const colors = {
    common: '#6B7280',
    rare: '#3B82F6',
    epic: '#9333EA',
    legendary: '#F59E0B'
  };
  return colors[rarity as keyof typeof colors] || colors.common;
};

// Calculate NFT value based on rarity and power
export const calculateNFTValue = (rarity: string, power: number): number => {
  const rarityMultipliers = {
    common: 1,
    rare: 2,
    epic: 5,
    legendary: 10
  };
  
  const multiplier = rarityMultipliers[rarity as keyof typeof rarityMultipliers] || 1;
  return Math.floor(power * multiplier * 10);
};

// Generate SVG for NFT
export const generateSVGBase64 = (nft: NFTItem): string => {
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${nft.color}" opacity="0.2"/>
      <text x="100" y="100" text-anchor="middle" font-size="60" fill="${nft.color}">
        ${nft.emoji}
      </text>
      <text x="100" y="140" text-anchor="middle" font-size="16" fill="${nft.color}" font-weight="bold">
        ${nft.name}
      </text>
      <text x="100" y="160" text-anchor="middle" font-size="12" fill="${nft.color}">
        ${nft.rarity.toUpperCase()}
      </text>
      <text x="100" y="180" text-anchor="middle" font-size="12" fill="${nft.color}">
        Power: ${nft.power}
      </text>
    </svg>
  `;
  
  return btoa(svg);
};

// Get NFT display properties
export const getNFTDisplayProps = (nft: NFTItem) => {
  return {
    borderColor: getRarityColor(nft.rarity),
    backgroundColor: `${nft.color}20`,
    textColor: nft.color,
    rarityBadge: nft.rarity.toUpperCase(),
    value: calculateNFTValue(nft.rarity, nft.power)
  };
};

// Get belt requirements for NFT collection
export const getBeltRequirements = () => {
  return {
    white: { nfts: 0, culturalCapital: 0 },
    yellow: { nfts: 5, culturalCapital: 100 },
    orange: { nfts: 10, culturalCapital: 300 },
    green: { nfts: 20, culturalCapital: 600 },
    blue: { nfts: 35, culturalCapital: 1000 },
    brown: { nfts: 50, culturalCapital: 1500 },
    black: { nfts: 75, culturalCapital: 2500 }
  };
};
