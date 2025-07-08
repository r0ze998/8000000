
// =============================================================================
// NFT Utilities
// =============================================================================

export type NFTRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  rarity: NFTRarity;
  power: number;
  shrine_id: string;
  timestamp: number;
}

// Calculate NFT rarity based on prayer factors
export const calculateNFTRarity = (factors: {
  prayerType: string;
  timeOfDay: string;
  season?: string;
  weather?: string;
}): NFTRarity => {
  let rarityScore = 0;
  
  // Prayer type scoring
  const prayerScores: Record<string, number> = {
    'gratitude': 1,
    'meditation': 2,
    'blessing': 3,
    'healing': 4,
    'protection': 5
  };
  
  rarityScore += prayerScores[factors.prayerType] || 1;
  
  // Time of day bonus
  if (factors.timeOfDay === 'dawn' || factors.timeOfDay === 'dusk') {
    rarityScore += 2;
  }
  
  // Season bonus
  if (factors.season === 'spring' || factors.season === 'autumn') {
    rarityScore += 1;
  }
  
  // Weather bonus
  if (factors.weather === 'clear' || factors.weather === 'storm') {
    rarityScore += 1;
  }
  
  // Determine rarity
  if (rarityScore >= 8) return 'legendary';
  if (rarityScore >= 6) return 'epic';
  if (rarityScore >= 4) return 'rare';
  return 'common';
};

// Generate NFT metadata
export const generateNFTMetadata = (params: {
  rarity: NFTRarity;
  shrineId: string;
  timestamp: number;
  prayerType: string;
}): NFTMetadata => {
  const { rarity, shrineId, timestamp, prayerType } = params;
  
  const rarityNames = {
    common: '一般',
    rare: '珍しい',
    epic: '稀有',
    legendary: '伝説'
  };
  
  const name = `${rarityNames[rarity]}祈りの証 #${timestamp.toString().slice(-6)}`;
  const description = `${prayerType}の祈りから生まれた神聖なNFT。神社ID: ${shrineId}`;
  
  return {
    name,
    description,
    image: generateNFTImage(rarity, prayerType),
    attributes: [
      { trait_type: 'Rarity', value: rarity },
      { trait_type: 'Prayer Type', value: prayerType },
      { trait_type: 'Shrine ID', value: shrineId },
      { trait_type: 'Timestamp', value: timestamp }
    ],
    rarity,
    power: getRarityPower(rarity),
    shrine_id: shrineId,
    timestamp
  };
};

// Get rarity power value
export const getRarityPower = (rarity: NFTRarity): number => {
  const powers = {
    common: 10,
    rare: 25,
    epic: 50,
    legendary: 100
  };
  return powers[rarity];
};

// Get rarity color
export const getRarityColor = (rarity: string): string => {
  const colors = {
    common: '#FFFFFF',
    rare: '#4FC3F7',
    epic: '#9C27B0',
    legendary: '#FFD700'
  };
  return colors[rarity as keyof typeof colors] || colors.common;
};

// Generate NFT image (SVG)
export const generateNFTImage = (rarity: NFTRarity, prayerType: string): string => {
  const color = getRarityColor(rarity);
  const emoji = getPrayerEmoji(prayerType);
  
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
        ${rarity.toUpperCase()}
      </text>
    </svg>
  `;
  return btoa(svg);
};

// Get prayer emoji
export const getPrayerEmoji = (prayerType: string): string => {
  const emojis: Record<string, string> = {
    gratitude: '🙏',
    meditation: '🧘',
    blessing: '✨',
    healing: '💚',
    protection: '🛡️'
  };
  return emojis[prayerType] || '🙏';
};

// Drop NFT from Omikuji
export const dropNFTFromOmikuji = (omikujiData: { result: string; duration: number; prayerType: string }) => {
  const factors = {
    prayerType: omikujiData.prayerType,
    timeOfDay: 'morning'
  };
  
  const rarity = calculateNFTRarity(factors);
  return generateNFTMetadata({
    rarity,
    shrineId: 'virtual-shrine',
    timestamp: Date.now(),
    prayerType: omikujiData.prayerType
  });
};
