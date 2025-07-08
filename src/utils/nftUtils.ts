
// =============================================================================
// NFT Generation and Utility Functions
// =============================================================================

import { NFTItem } from '../types';

// NFT Types
export const NFT_TYPES = {
  TERRAIN: 'terrain',
  STRUCTURE: 'structure',
  NATURE: 'nature',
  GUARDIAN: 'guardian',
  DECORATION: 'decoration',
  SACRED: 'sacred'
} as const;

// NFT Rarity definitions
export const NFT_RARITIES = {
  COMMON: 'common',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
} as const;

// Generate SVG for NFT visualization
export const generateSVGBase64 = (nft: NFTItem): string => {
  const svg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${nft.color || '#ccc'}" />
      <text x="50" y="50" font-family="Arial" font-size="40" text-anchor="middle" dominant-baseline="middle">
        ${nft.emoji || '🎎'}
      </text>
    </svg>
  `;
  return btoa(svg);
};

// Omikuji result to NFT drop mapping
export const dropNFTFromOmikuji = (omikujiResult: string): NFTItem | null => {
  const dropChances = {
    '大吉': 0.8,
    '中吉': 0.6,
    '吉': 0.4,
    '小吉': 0.3,
    '末吉': 0.2,
    '凶': 0.1
  };

  const chance = dropChances[omikujiResult as keyof typeof dropChances] || 0.1;

  if (Math.random() > chance) {
    return null;
  }

  const nftTemplates = [
    { type: 'sacred' as const, name: '神聖な石', emoji: '🪨', color: '#8B7355', rarity: 'common' as const },
    { type: 'nature' as const, name: '桜の木', emoji: '🌸', color: '#FFB6C1', rarity: 'rare' as const },
    { type: 'guardian' as const, name: '狛犬', emoji: '🦁', color: '#8B4513', rarity: 'epic' as const },
    { type: 'decoration' as const, name: '提灯', emoji: '🏮', color: '#FF6B6B', rarity: 'common' as const },
    { type: 'structure' as const, name: '鳥居', emoji: '⛩️', color: '#DC143C', rarity: 'legendary' as const }
  ];

  const template = nftTemplates[Math.floor(Math.random() * nftTemplates.length)];

  if (!template) {
    return null;
  }

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
    description: `${template.name} - ${omikujiResult}の結果で獲得`
  };
};

// Get rarity color for display
export const getRarityColor = (rarity: string): string => {
  const colors = {
    common: '#9CA3AF',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B'
  };
  return colors[rarity as keyof typeof colors] || colors.common;
};

// Calculate NFT value based on rarity and power
export const calculateNFTValue = (nft: NFTItem): number => {
  const rarityMultipliers = {
    common: 1,
    rare: 2,
    epic: 5,
    legendary: 10
  };

  const multiplier = rarityMultipliers[nft.rarity as keyof typeof rarityMultipliers] || 1;
  return (nft.power || 1) * multiplier;
};

// Get NFT display properties
export const getNFTDisplayProps = (nft: NFTItem) => {
  return {
    color: nft.color || '#ccc',
    emoji: nft.emoji || '🎎',
    rarityColor: getRarityColor(nft.rarity || 'common'),
    value: calculateNFTValue(nft)
  };
};
