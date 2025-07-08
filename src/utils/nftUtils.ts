import { NFTMetadata, NFTRarity } from '../types';

// =============================================================================
// NFT Utilities
// =============================================================================

// NFT rarity calculation
export const calculateNFTRarity = (factors: {
  prayerType: string;
  timeOfDay?: string;
  weather?: string;
  seasonalEvent?: boolean;
}): NFTRarity => {
  let score = 0;

  // Prayer type bonus
  if (factors.prayerType === 'gratitude') score += 30;
  else if (factors.prayerType === 'peace') score += 20;
  else if (factors.prayerType === 'prosperity') score += 25;
  else score += 10;

  // Time bonus
  if (factors.timeOfDay === 'dawn' || factors.timeOfDay === 'dusk') score += 20;

  // Weather bonus
  if (factors.weather === 'clear') score += 15;

  // Seasonal event bonus
  if (factors.seasonalEvent) score += 25;

  if (score >= 80) return 'legendary';
  if (score >= 60) return 'epic';
  if (score >= 40) return 'rare';
  if (score >= 20) return 'uncommon';
  return 'common';
};

// Get rarity color
export const getRarityColor = (rarity: string): string => {
  const colors = {
    legendary: '#FFD700',
    epic: '#9F7AEA', 
    rare: '#4299E1',
    uncommon: '#48BB78',
    common: '#9CA3AF'
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
  const rarityEmojis = {
    legendary: '✨',
    epic: '🌟',
    rare: '⭐',
    uncommon: '💫',
    common: '🌸'
  };

  const prayerEmojis = {
    gratitude: '🙏',
    peace: '☮️',
    prosperity: '💰',
    health: '🌿',
    wisdom: '📿',
    protection: '🛡️'
  };

  const emoji = rarityEmojis[data.rarity];
  const prayerEmoji = prayerEmojis[data.prayerType as keyof typeof prayerEmojis] || '🙏';

  return {
    id: `nft_${data.timestamp}_${Math.random().toString(36).substr(2, 9)}`,
    name: `${prayerEmoji} ${data.rarity.toUpperCase()} 祈願NFT`,
    description: `${data.shrineId}での${data.prayerType}の祈りから生まれた神聖なNFT`,
    rarity: data.rarity,
    type: 'prayer',
    power: Math.floor(Math.random() * 100) + 1,
    color: getRarityColor(data.rarity),
    emoji: emoji,
    timestamp: data.timestamp,
    shrineId: data.shrineId,
    prayerType: data.prayerType
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