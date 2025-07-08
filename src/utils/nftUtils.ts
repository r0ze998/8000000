export interface NFTRarity {
  name: string;
  probability: number;
  color: string;
}

export const RARITY_TYPES: NFTRarity[] = [
  { name: 'common', probability: 0.6, color: '#9CA3AF' },
  { name: 'rare', probability: 0.25, color: '#3B82F6' },
  { name: 'epic', probability: 0.12, color: '#9F7AEA' },
  { name: 'legendary', probability: 0.03, color: '#FFD700' }
];

export const calculateRarity = (): string => {
  const random = Math.random();
  let cumulativeProbability = 0;

  for (const rarity of RARITY_TYPES) {
    cumulativeProbability += rarity.probability;
    if (random <= cumulativeProbability) {
      return rarity.name;
    }
  }

  return 'common';
};

export const getRarityColor = (rarity: string): string => {
  const colors = {
    common: '#9CA3AF',
    rare: '#3B82F6', 
    epic: '#9F7AEA',
    legendary: '#FFD700'
  };

  return colors[rarity as keyof typeof colors] || colors.common;
};

export const generateNFTMetadata = (shrineId: string, visitCount: number) => {
  const rarity = calculateRarity();
  const timestamp = Date.now();

  return {
    id: `${shrineId}_${timestamp}`,
    name: `Goshuin #${visitCount}`,
    description: `Sacred stamp from shrine visit #${visitCount}`,
    rarity,
    color: getRarityColor(rarity),
    attributes: {
      shrineId,
      visitCount,
      timestamp,
      rarity
    }
  };
};