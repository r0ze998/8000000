// =============================================================================
// NFT Utility Functions
// =============================================================================

export interface NFTRarity {
  name: string;
  color: string;
  probability: number;
}

export const NFT_RARITIES: Record<string, NFTRarity> = {
  common: { name: '一般', color: '#9CA3AF', probability: 0.6 },
  uncommon: { name: '珍しい', color: '#22C55E', probability: 0.25 },
  rare: { name: 'レア', color: '#3B82F6', probability: 0.1 },
  epic: { name: 'エピック', color: '#9F7AEA', probability: 0.04 },
  legendary: { name: '伝説', color: '#FFD700', probability: 0.01 }
};

// Calculate NFT rarity based on cultural capital
export const calculateNFTRarity = (culturalCapital: number): string => {
  const random = Math.random();

  // Higher cultural capital increases chances of rare items
  const rarityBonus = Math.min(culturalCapital / 10000, 0.5);

  if (random < 0.01 + rarityBonus * 0.02) return 'legendary';
  if (random < 0.05 + rarityBonus * 0.05) return 'epic';
  if (random < 0.15 + rarityBonus * 0.1) return 'rare';
  if (random < 0.4 + rarityBonus * 0.2) return 'uncommon';
  return 'common';
};

// Generate NFT metadata
export const generateNFTMetadata = (
  type: string, 
  rarity: string, 
  shrineData?: any
) => {
  const timestamp = Date.now();
  const tokenId = `${type}_${rarity}_${timestamp}`;

  return {
    tokenId,
    name: `${NFT_RARITIES[rarity]?.name || '一般'} ${type}`,
    description: `文化体験で獲得した${type}`,
    image: `https://example.com/nft/${tokenId}.png`,
    attributes: [
      { trait_type: 'Type', value: type },
      { trait_type: 'Rarity', value: rarity },
      { trait_type: 'Timestamp', value: timestamp },
      ...(shrineData ? [{ trait_type: 'Shrine', value: shrineData.name }] : [])
    ],
    external_url: `https://example.com/nft/${tokenId}`,
    animation_url: null,
    background_color: getRarityColor(rarity).replace('#', '')
  };
};

// Get rarity display name
export const getRarityDisplayName = (rarity: string): string => {
  return NFT_RARITIES[rarity]?.name || '一般';
};

// Get rarity probability
export const getRarityProbability = (rarity: string): number => {
  return NFT_RARITIES[rarity]?.probability || 0;
};

// Calculate total NFT value
export const calculateNFTValue = (nfts: any[]): number => {
  return nfts.reduce((total, nft) => {
    const rarityMultiplier = {
      common: 1,
      uncommon: 2,
      rare: 5,
      epic: 10,
      legendary: 25
    }[nft.rarity] || 1;

    return total + (10 * rarityMultiplier);
  }, 0);
};

// Get rarity color for styling
export const getRarityColor = (rarity: string): string => {
  const colors = {
    legendary: '#FFD700',
    epic: '#9F7AEA',
    rare: '#3B82F6',
    uncommon: '#22C55E',
    common: '#9CA3AF'
  };

  return colors[rarity as keyof typeof colors] || colors.common;
};