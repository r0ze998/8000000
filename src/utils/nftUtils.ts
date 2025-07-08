import type { NFTItem, NFTTemplate, NFTRarity } from '../types';

// Define NFT type alias for backwards compatibility
export type NFT = NFTItem;

// NFT templates for different shrine types
export const NFT_TEMPLATES: NFTTemplate[] = [
  // Common NFTs
  { id: 'common-1', name: '木札お守り', type: 'omamori', emoji: '🪵', rarity: 'common' },
  { id: 'common-2', name: '紙札お守り', type: 'omamori', emoji: '📜', rarity: 'common' },
  { id: 'common-3', name: '小銭', type: 'offering', emoji: '🪙', rarity: 'common' },

  // Uncommon NFTs
  { id: 'uncommon-1', name: '絵馬', type: 'ema', emoji: '🎨', rarity: 'uncommon' },
  { id: 'uncommon-2', name: '御朱印', type: 'goshuin', emoji: '🖋️', rarity: 'uncommon' },
  { id: 'uncommon-3', name: '鈴', type: 'bell', emoji: '🔔', rarity: 'uncommon' },

  // Rare NFTs
  { id: 'rare-1', name: '金のお守り', type: 'omamori', emoji: '🏆', rarity: 'rare' },
  { id: 'rare-2', name: '特別絵馬', type: 'ema', emoji: '🎭', rarity: 'rare' },
  { id: 'rare-3', name: '御神酒', type: 'offering', emoji: '🍶', rarity: 'rare' },

  // Epic NFTs
  { id: 'epic-1', name: '神社の鍵', type: 'special', emoji: '🗝️', rarity: 'epic' },
  { id: 'epic-2', name: '龍の置物', type: 'statue', emoji: '🐉', rarity: 'epic' },

  // Legendary NFTs
  { id: 'legendary-1', name: '神の加護', type: 'blessing', emoji: '✨', rarity: 'legendary' },
];

// Calculate NFT drop rate based on prayer duration and type
export const calculateNFTDropRate = (duration: number, prayerType?: string): number => {
  const baseDuration = 30; // 30 seconds minimum
  const maxDuration = 300; // 5 minutes maximum

  const normalizedDuration = Math.min(Math.max(duration, baseDuration), maxDuration);
  const durationBonus = (normalizedDuration - baseDuration) / (maxDuration - baseDuration);

  // Base drop rate: 10%
  let dropRate = 0.1 + (durationBonus * 0.4); // Up to 50% for max duration

  // Prayer type bonuses
  const prayerBonus = {
    'health': 1.2,
    'success': 1.1,
    'love': 1.15,
    'protection': 1.25,
    'wisdom': 1.1
  };

  if (prayerType && prayerBonus[prayerType as keyof typeof prayerBonus]) {
    dropRate *= prayerBonus[prayerType as keyof typeof prayerBonus];
  }

  return Math.min(dropRate, 0.8); // Cap at 80%
};

// Get rarity probability based on overall drop rate
export const getRarityProbability = (dropRate: number) => {
  const baseRarities = {
    common: 0.5,
    uncommon: 0.3,
    rare: 0.15,
    epic: 0.04,
    legendary: 0.01
  };

  // Higher drop rates slightly increase rare item chances
  const rareBonus = Math.min(dropRate * 0.5, 0.2);

  return {
    common: baseRarities.common - rareBonus * 0.5,
    uncommon: baseRarities.uncommon - rareBonus * 0.3,
    rare: baseRarities.rare + rareBonus * 0.4,
    epic: baseRarities.epic + rareBonus * 0.3,
    legendary: baseRarities.legendary + rareBonus * 0.1
  };
};

// Get color for rarity
export const getRarityColor = (rarity: NFTRarity): string => {
  const colors = {
    common: '#9CA3AF',
    uncommon: '#10B981',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B'
  };

  return colors[rarity as keyof typeof colors] || colors.common;
};

// Calculate NFT value based on rarity and power
export const calculateNFTValue = (rarity: NFTRarity, power: number): number => {
  const baseValues = {
    common: 100,
    uncommon: 250,
    rare: 500,
    epic: 1000,
    legendary: 2500
  };

  const baseValue = baseValues[rarity] || baseValues.common;
  return Math.floor(baseValue * (1 + power * 0.1));
};

// Drop NFT from omikuji (random fortune)
export const dropNFTFromOmikuji = (result: string | { result: string; duration: number; prayerType: string }): NFT | null => {
  let duration: number;
  let prayerType: string | undefined;

  if (typeof result === 'string') {
    duration = 300; // Default duration
    prayerType = undefined;
  } else {
    duration = result.duration;
    prayerType = result.prayerType;
  }

  const dropRate = calculateNFTDropRate(duration, prayerType);

  if (Math.random() > dropRate) {
    return null; // No drop
  }

  const rarityProbs = getRarityProbability(dropRate);
  const rand = Math.random();

  let rarity: NFTRarity = 'common';
  let cumulative = 0;

  for (const [rarityKey, prob] of Object.entries(rarityProbs)) {
    cumulative += prob;
    if (rand <= cumulative) {
      rarity = rarityKey as NFTRarity;
      break;
    }
  }

  // Get available templates for this rarity
  const availableTemplates = NFT_TEMPLATES.filter(template => template.rarity === rarity);

  if (availableTemplates.length === 0) {
    return null;
  }

  const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];

  if (!template) {
    return null;
  }

  return {
    id: `nft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: template.name,
    type: template.type,
    emoji: template.emoji,
    rarity: template.rarity,
    power: Math.floor(Math.random() * 10) + 1,
    color: getRarityColor(template.rarity),
    obtainedAt: new Date().toISOString(),
    shrineId: `shrine-${Math.random().toString(36).substr(2, 9)}`,
    description: `${template.name} NFT`,
    timestamp: Date.now(),
    attributes: {
      power: Math.floor(Math.random() * 10) + 1,
      rarity: template.rarity,
      type: template.type
    }
  };
};

// Get NFT display properties
export const getNFTDisplayProps = (nft: NFT) => {
  return {
    backgroundColor: `${nft.color}20`,
    textColor: nft.color,
    rarityBadge: nft.rarity.toUpperCase(),
    value: calculateNFTValue(nft.rarity, nft.power || 1)
  };
};

// Generate SVG as base64 string for NFT
export const generateSVGBase64 = (nft: NFT): string => {
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${nft.color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${nft.color}88;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#gradient)" rx="20"/>
      <text x="100" y="100" font-family="Arial, sans-serif" font-size="60" text-anchor="middle" dy=".3em">
        ${nft.emoji}
      </text>
      <text x="100" y="150" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="white">
        ${nft.name}
      </text>
      <text x="100" y="170" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="white" opacity="0.8">
        ${nft.rarity.toUpperCase()}
      </text>
    </svg>
  `;

  return btoa(unescape(encodeURIComponent(svg)));
};