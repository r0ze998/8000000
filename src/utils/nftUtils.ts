// =============================================================================
// NFT Utilities
// =============================================================================

import { NFTItem } from '../types';

export const NFT_RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const;
export type NFTRarity = typeof NFT_RARITIES[number];

// Constants for prayer calculations
export const PRAYER_MULTIPLIERS = {
  gratitude: 1.0,
  healing: 1.1,
  prosperity: 1.2,
  protection: 1.15,
  wisdom: 1.25
} as const;

export const PRAYER_TYPE_MULTIPLIERS = {
  morning: 1.2,
  afternoon: 1.0,
  evening: 1.1,
  night: 1.15
} as const;

// =============================================================================
// NFT Generation
// =============================================================================

export const generateNFTFromPrayer = (prayerData: {
  type: string;
  duration: number;
  weather?: string;
  timeOfDay?: string;
}) => {
  const rarity = determineRarity(prayerData.duration);
  const color = getRarityColor(rarity);
  const emoji = getPrayerEmoji(prayerData.type);

  return {
    id: Date.now().toString(),
    name: `${prayerData.type} Prayer NFT`,
    rarity,
    color,
    pixelData: emoji,
    type: prayerData.type,
    duration: prayerData.duration,
    weather: prayerData.weather || 'sunny',
    timeOfDay: prayerData.timeOfDay || 'day',
    createdAt: new Date().toISOString(),
    power: getRarityPower(rarity)
  };
};

// Determine rarity based on prayer duration and conditions
const determineRarity = (duration: number): NFTRarity => {
  const minutes = duration / 60;

  if (minutes >= 60) return 'legendary';
  if (minutes >= 30) return 'epic';
  if (minutes >= 15) return 'rare';
  if (minutes >= 5) return 'uncommon';
  return 'common';
};

// Get color for rarity
export const getRarityColor = (rarity: string): string => {
  const colors: Record<string, string> = {
    common: '#9CA3AF',
    uncommon: '#10B981',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B'
  };
  return colors[rarity] || colors.common;
};

// Get power level for rarity
export const getRarityPower = (rarity: string): number => {
  const powers: Record<string, number> = {
    common: 1,
    uncommon: 2,
    rare: 4,
    epic: 8,
    legendary: 16
  };
  return powers[rarity] || 1;
};

// =============================================================================
// Omikuji (Fortune) NFT Generation
// =============================================================================

export const dropNFTFromOmikuji = (omikujiData?: any): any => {
  const rarities: NFTRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  const weights = [50, 30, 15, 4, 1]; // Drop rates

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const random = Math.random() * totalWeight;

  let currentWeight = 0;
  for (let i = 0; i < rarities.length; i++) {
    const weight = weights[i];
    if (weight === undefined) continue;
    
    currentWeight += weight;
    if (random <= currentWeight) {
      const rarity = rarities[i];
      if (!rarity) continue;
      
      return {
        id: Date.now().toString(),
        name: `Fortune ${rarity.charAt(0).toUpperCase() + rarity.slice(1)}`,
        rarity,
        color: getRarityColor(rarity),
        pixelData: getFortuneEmoji(rarity),
        type: 'fortune',
        createdAt: new Date().toISOString(),
        power: getRarityPower(rarity)
      };
    }
  }

  // Fallback to common
  return {
    id: Date.now().toString(),
    name: 'Fortune Common',
    rarity: 'common' as NFTRarity,
    color: getRarityColor('common'),
    pixelData: '🍀',
    type: 'fortune',
    createdAt: new Date().toISOString(),
    power: 1
  };
};

const getFortuneEmoji = (rarity: string): string => {
  const emojis: Record<string, string> = {
    common: '🍀',
    uncommon: '🌸',
    rare: '💎',
    epic: '🌟',
    legendary: '👑'
  };
  return emojis[rarity] || '🍀';
};

// =============================================================================
// SVG Generation
// =============================================================================

export const generateSVGBase64 = (nftData: any): string => {
  const color = getRarityColor(nftData.rarity || 'common');
  const emoji = nftData.pixelData || getPrayerEmoji(nftData.type || 'gratitude');

  const svg = `
    <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.2" />
        </radialGradient>
      </defs>
      <rect width="300" height="300" fill="url(#bg)" />
      <text x="150" y="150" text-anchor="middle" font-size="60" fill="${color}">
        ${emoji}
      </text>
      <text x="150" y="250" text-anchor="middle" font-size="16" fill="white">
        ${(nftData.rarity || 'common').toUpperCase()}
      </text>
    </svg>
  `;
  return btoa(svg);
};

// Get prayer emoji
export const getPrayerEmoji = (prayerType: string): string => {
  const emojis: Record<string, string> = {
    gratitude: '🙏',
    healing: '💚',
    prosperity: '💰',
    protection: '🛡️',
    wisdom: '📿',
    peace: '☮️',
    love: '💖',
    strength: '💪'
  };
  return emojis[prayerType] || '🙏';
};

export const generateRandomNFT = (): NFTItem => {
  const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  const weights = [50, 25, 15, 8, 2]; // 確率の重み

  const random = Math.random() * 100;
  let currentWeight = 0;
  for (let i = 0; i < rarities.length; i++) {
    const weight = weights[i];
    if (weight === undefined) continue;

    currentWeight += weight;
    if (random <= currentWeight) {
      const rarity = rarities[i];
      if (!rarity) continue;

      return {
        id: Date.now().toString(),
        name: `Fortune ${rarity.charAt(0).toUpperCase() + rarity.slice(1)}`,
        rarity: rarity as NFTRarity,
        color: getRarityColor(rarity),
        pixelData: getFortuneEmoji(rarity),
        type: 'fortune' as any,
        createdAt: new Date().toISOString(),
        power: getRarityPower(rarity),
        isOwned: true,
        emoji: getFortuneEmoji(rarity),
        description: `Fortune ${rarity}`,
        timestamp: Date.now(),
        attributes: {}
      };
    }
  }

  // フォールバック（到達することは稀）
  return {
    id: Date.now().toString(),
    name: 'Fortune Common',
    rarity: 'common' as NFTRarity,
    color: getRarityColor('common'),
    pixelData: getFortuneEmoji('common'),
    type: 'fortune' as any,
    createdAt: new Date().toISOString(),
    power: getRarityPower('common'),
    isOwned: true,
    emoji: getFortuneEmoji('common'),
    description: 'Fortune common',
    timestamp: Date.now(),
    attributes: {}
  };
};