
import { NFTRarity } from '../types';

// =============================================================================
// NFT Utilities
// =============================================================================

// Add missing NFTMetadata type
export interface NFTMetadata {
  id: string;
  name: string;
  type: string;
  rarity: NFTRarity;
  description: string;
  emoji: string;
  color: string;
  timestamp: number;
  shrineId: string;
  prayerType: string;
  attributes: Record<string, any>;
}

// Calculate NFT rarity based on various factors
export const calculateNFTRarity = (factors: {
  prayerType: string;
  timeOfDay: string;
  seasonalEvent?: string;
  streak?: number;
}): NFTRarity => {
  let score = 0;

  // Prayer type scoring
  const prayerScores: Record<string, number> = {
    'gratitude': 20,
    'peace': 15,
    'prosperity': 10,
    'health': 10,
    'wisdom': 25,
    'protection': 5
  };

  score += prayerScores[factors.prayerType] || 5;

  // Time of day bonus
  if (factors.timeOfDay === 'morning') score += 15;
  else if (factors.timeOfDay === 'evening') score += 10;

  // Seasonal event bonus
  if (factors.seasonalEvent) score += 20;

  // Streak bonus
  if (factors.streak && factors.streak > 7) score += 30;
  else if (factors.streak && factors.streak > 3) score += 15;

  // Determine rarity based on score
  if (score >= 80) return 'legendary';
  if (score >= 60) return 'epic';
  if (score >= 40) return 'rare';
  if (score >= 20) return 'uncommon';
  return 'common';
};

// Get color for rarity
export const getRarityColor = (rarity: string): string => {
  const colors = {
    common: '#94a3b8',
    uncommon: '#22d3ee',
    rare: '#a855f7',
    epic: '#f59e0b',
    legendary: '#ef4444'
  };
  return colors[rarity as keyof typeof colors] || colors.common;
};

// Generate NFT metadata
export const generateNFTMetadata = (data: {
  rarity: NFTRarity;
  shrineId: string;
  timestamp: number;
  prayerType: string;
}): NFTMetadata => {
  const id = `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // NFT templates based on prayer type
  const templates: Record<string, { name: string; emoji: string; description: string }> = {
    gratitude: {
      name: '感謝の御守り',
      emoji: '🙏',
      description: '心からの感謝が込められた特別な御守り'
    },
    peace: {
      name: '平安の護符',
      emoji: '☮️',
      description: '心の平安をもたらす神聖な護符'
    },
    prosperity: {
      name: '繁栄の絵馬',
      emoji: '🎭',
      description: '豊かな未来を願う美しい絵馬'
    },
    health: {
      name: '健康の守り',
      emoji: '🍃',
      description: '身体と心の健康を守る自然の力'
    },
    wisdom: {
      name: '知恵の巻物',
      emoji: '📜',
      description: '古の知恵が記された貴重な巻物'
    },
    protection: {
      name: '守護の鈴',
      emoji: '🔔',
      description: '邪気を払う神聖な鈴の音'
    }
  };

  const template = templates[data.prayerType] || templates.gratitude;
  const color = getRarityColor(data.rarity);

  return {
    id,
    name: template.name,
    type: data.prayerType,
    rarity: data.rarity,
    description: template.description,
    emoji: template.emoji,
    color,
    timestamp: data.timestamp,
    shrineId: data.shrineId,
    prayerType: data.prayerType,
    attributes: {
      createdAt: new Date(data.timestamp).toISOString(),
      shrine: data.shrineId,
      prayerType: data.prayerType
    }
  };
};

// Generate SVG for NFT
export const generateSVGBase64 = (nft: NFTMetadata): string => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:${nft.color};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${nft.color};stop-opacity:0.3" />
        </radialGradient>
      </defs>
      <rect width="300" height="300" fill="url(#bg)" />
      <circle cx="150" cy="150" r="80" fill="${nft.color}" opacity="0.6" />
      <text x="150" y="170" text-anchor="middle" font-size="60" fill="white">
        ${nft.emoji}
      </text>
    </svg>
  `;
  return btoa(svg);
};

// Drop NFT from Omikuji - updated function signature to match usage
export const dropNFTFromOmikuji = (omikujiData: { result: string; duration: number; prayerType: string }) => {
  const factors = {
    prayerType: omikujiData.prayerType,
    timeOfDay: 'morning' // Default value
  };

  const rarity = calculateNFTRarity(factors);
  return generateNFTMetadata({
    rarity,
    shrineId: 'virtual-shrine',
    timestamp: Date.now(),
    prayerType: omikujiData.prayerType
  });
};
