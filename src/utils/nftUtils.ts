
// =============================================================================
// NFT Utilities
// =============================================================================

export const NFT_RARITIES = [
  'common', 'uncommon', 'rare', 'epic', 'legendary'
] as const;

export type NFTRarity = typeof NFT_RARITIES[number];

// NFT rarity probability weights
const RARITY_WEIGHTS = {
  common: 50,
  uncommon: 30,
  rare: 15,
  epic: 4,
  legendary: 1
};

// Calculate NFT rarity based on various factors
export const calculateNFTRarity = (factors: {
  streak?: number;
  timeOfDay?: string;
  weather?: string;
  prayerType?: string;
}): NFTRarity => {
  let baseWeight = 0;

  // Streak bonus
  if (factors.streak && factors.streak >= 7) baseWeight += 10;
  if (factors.streak && factors.streak >= 30) baseWeight += 20;

  // Time bonus (early morning prayers)
  if (factors.timeOfDay === 'dawn') baseWeight += 15;

  // Weather bonus
  if (factors.weather === 'rain') baseWeight += 10;
  if (factors.weather === 'snow') baseWeight += 15;

  // Prayer type bonus
  if (factors.prayerType === 'gratitude') baseWeight += 5;

  const random = Math.random() * 100;
  const adjustedRandom = Math.max(0, random - baseWeight);

  if (adjustedRandom < 1) return 'legendary';
  if (adjustedRandom < 5) return 'epic';
  if (adjustedRandom < 20) return 'rare';
  if (adjustedRandom < 50) return 'uncommon';
  return 'common';
};

// Get rarity probability
export const getRarityProbability = (rarity: NFTRarity): number => {
  const total = Object.values(RARITY_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  return RARITY_WEIGHTS[rarity] / total;
};

// Get rarity display name
export const getRarityDisplayName = (rarity: NFTRarity): string => {
  const names = {
    common: '普通',
    uncommon: '珍しい',
    rare: 'レア',
    epic: 'エピック',
    legendary: '伝説'
  };
  return names[rarity];
};

// Calculate NFT collection value
export const calculateNFTValue = (nfts: any[]): number => {
  return nfts.reduce((total, nft) => {
    const rarityMultiplier = {
      common: 1,
      uncommon: 2,
      rare: 5,
      epic: 10,
      legendary: 25
    }[nft.rarity as NFTRarity] || 1;

    return total + (10 * rarityMultiplier);
  }, 0);
};

// Get rarity color
export const getRarityColor = (rarity: string): string => {
  const colors = {
    common: '#9CA3AF',
    uncommon: '#10B981',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B'
  };
  return colors[rarity as keyof typeof colors] || colors.common;
};

// Generate NFT metadata
export const generateNFTMetadata = (params: {
  rarity: NFTRarity;
  shrineId: string;
  timestamp: number;
  prayerType?: string;
}) => {
  return {
    name: `御朱印 #${Date.now()}`,
    description: `${params.shrineId}での参拝記録`,
    rarity: params.rarity,
    shrine: params.shrineId,
    timestamp: params.timestamp,
    prayerType: params.prayerType || 'standard',
    attributes: [
      { trait_type: 'Rarity', value: getRarityDisplayName(params.rarity) },
      { trait_type: 'Shrine', value: params.shrineId },
      { trait_type: 'Prayer Type', value: params.prayerType || 'standard' }
    ]
  };
};

// Generate SVG Base64 (simplified implementation)
export const generateSVGBase64 = (metadata: any): string => {
  const svg = `
    <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${getRarityColor(metadata.rarity)}"/>
      <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="20">
        ${metadata.name}
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
