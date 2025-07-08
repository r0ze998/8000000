import { NFT_RARITIES } from './index';

// =============================================================================
// NFT Utility Functions
// =============================================================================

// Get prayer emoji based on type
export const getPrayerEmoji = (type: string): string => {
  const emojis = {
    gratitude: '🙏',
    peace: '☮️',
    healing: '💚',
    prosperity: '💰',
    wisdom: '🧠',
    love: '❤️',
    protection: '🛡️'
  } as const;

  return emojis[type as keyof typeof emojis] || '🙏';
};

// Get rarity power based on rarity level
export const getRarityPower = (rarity: string): number => {
  const powers = {
    common: 1,
    rare: 2,
    epic: 3,
    legendary: 5
  } as const;

  return powers[rarity as keyof typeof powers] || 1;
};

// Get rarity color - single declaration only
export const getRarityColor = (rarity: string): string => {
  const colors = {
    common: '#FFFFFF',
    rare: '#4ECDC4',
    epic: '#9F7AEA',
    legendary: '#FFD700'
  } as const;

  return colors[rarity as keyof typeof colors] || colors.common;
};

// Generate NFT from prayer session
export const generateNFTFromPrayer = (
  prayerType: string,
  duration: number,
  bonuses: any = {}
): any => {
  const rarity = determineRarity(duration, bonuses);
  const emoji = getPrayerEmoji(prayerType);
  const color = getRarityColor(rarity);
  const power = getRarityPower(rarity);

  return {
    id: `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: `${prayerType.charAt(0).toUpperCase() + prayerType.slice(1)} Prayer`,
    description: `A sacred NFT earned through ${duration} seconds of ${prayerType} prayer`,
    type: prayerType,
    rarity,
    power,
    color,
    emoji,
    pixelData: emoji,
    timestamp: Date.now(),
    metadata: {
      duration,
      bonuses,
      prayerSession: true
    }
  };
};

// Determine rarity based on various factors
const determineRarity = (duration: number, bonuses: any): string => {
  let rarityScore = 0;

  // Base rarity from duration
  if (duration >= 600) rarityScore += 3; // 10+ minutes
  else if (duration >= 300) rarityScore += 2; // 5+ minutes
  else if (duration >= 180) rarityScore += 1; // 3+ minutes

  // Bonus points
  if (bonuses.seasonal) rarityScore += 1;
  if (bonuses.weather) rarityScore += 1;
  if (bonuses.timeOfDay) rarityScore += 1;

  // Random factor
  const randomBonus = Math.random() < 0.1 ? 2 : 0;
  rarityScore += randomBonus;

  if (rarityScore >= 6) return 'legendary';
  if (rarityScore >= 4) return 'epic';
  if (rarityScore >= 2) return 'rare';
  return 'common';
};

// Drop NFT from omikuji (fortune slip)
export const dropNFTFromOmikuji = (omikujiData: any): any | null => {
  const { result, duration, prayerType } = omikujiData;

  // Drop rate based on omikuji result
  const dropRates = {
    '大吉': 0.8,
    '中吉': 0.6,
    '吉': 0.4,
    '小吉': 0.3,
    '末吉': 0.2,
    '凶': 0.1
  };

  const dropRate = dropRates[result as keyof typeof dropRates] || 0.3;

  if (Math.random() < dropRate) {
    return generateNFTFromPrayer(prayerType, duration, { omikuji: result });
  }

  return null;
};

// Generate SVG image data
export const generateSVGBase64 = (nftData: any): string => {
  const color = getRarityColor(nftData.rarity || 'common');
  const emoji = getPrayerEmoji(nftData.type || 'gratitude');

  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.1" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#bg)" rx="20"/>
      <circle cx="100" cy="100" r="60" fill="${color}" opacity="0.2"/>
      <text x="100" y="120" font-size="48" text-anchor="middle" fill="${color}">${emoji}</text>
      <text x="100" y="160" font-size="12" text-anchor="middle" fill="${color}">${nftData.name}</text>
    </svg>
  `;

  return btoa(svg);
};