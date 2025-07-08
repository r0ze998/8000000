import { NFTItem } from '../types';

// Rarity color mapping
const RARITY_COLORS = {
  common: '#68D391',
  uncommon: '#38A169', 
  rare: '#3182CE',
  epic: '#9F7AEA',
  legendary: '#FFD700'
} as const;

export const getRarityColor = (rarity: string): string => {
  const normalizedRarity = rarity.toLowerCase() as keyof typeof RARITY_COLORS;
  return RARITY_COLORS[normalizedRarity] || RARITY_COLORS.common;
};

export const getRarityWeight = (rarity: string): number => {
  const weights = {
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5
  };
  return weights[rarity.toLowerCase() as keyof typeof weights] || 1;
};

// NFT generation and utilities
export const generateSVGBase64 = (nft: NFTItem): string => {
  const svg = `
    <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="${nft.color || '#68D391'}" rx="8"/>
      <text x="32" y="40" font-size="24" text-anchor="middle" fill="white">
        ${nft.emoji || nft.pixelData || '🎁'}
      </text>
    </svg>
  `;
  return btoa(svg);
};

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

  if (Math.random() > chance) return null;

  // Generate a simple NFT
  const rarities = ['common', 'rare', 'epic', 'legendary'];
  const types = ['terrain', 'structure', 'nature', 'decoration'];
  const emojis = ['🌸', '⛩️', '🏮', '🌿', '🦊', '🗻'];

  const rarity = rarities[Math.floor(Math.random() * rarities.length)]!;
  const type = types[Math.floor(Math.random() * types.length)]!;
  const emoji = emojis[Math.floor(Math.random() * emojis.length)]!;

  return {
    id: `omikuji-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: `神社の${emoji}`,
    description: `${omikujiResult}で獲得した神聖なアイテム`,
    rarity: rarity as any,
    type,
    pixelData: emoji,
    emoji,
    color: getRarityColor(rarity),
    power: getRarityWeight(rarity) * 50,
    isOwned: true,
    animation: rarity === 'legendary' ? 'glow' : 'none',
    timestamp: Date.now()
  };
};