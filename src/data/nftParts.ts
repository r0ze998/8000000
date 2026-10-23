import { NFTItem } from '../types';

export const ENHANCED_NFT_PARTS: NFTItem[] = [
  // Terrain elements
  {
    id: 'grass-1',
    name: '草原',
    type: 'terrain',
    rarity: 'common',
    power: 20,
    pixelData: '🌱',
    color: '#90EE90',
    isOwned: true,
    animation: 'float',
    emoji: '🌱',
    description: '豊かな緑の草原',
    timestamp: Date.now(),
    attributes: { terrain: true }
  },
  {
    id: 'water-1',
    name: '水辺',
    type: 'terrain',
    rarity: 'common',
    power: 25,
    pixelData: '🌊',
    color: '#4682B4',
    isOwned: true,
    animation: 'pulse',
    emoji: '🌊',
    description: '澄んだ水の流れ',
    timestamp: Date.now(),
    attributes: { terrain: true }
  },

  // Structure elements
  {
    id: 'torii-1',
    name: '黄金の鳥居',
    type: 'structure',
    rarity: 'legendary',
    power: 500,
    pixelData: '⛩️',
    color: '#FFD700',
    isOwned: true,
    animation: 'glow',
    emoji: '⛩️',
    description: '神聖な黄金の鳥居',
    timestamp: Date.now(),
    attributes: { sacred: true }
  }
];

export const NFT_DROP_TABLE = {
  COMMON_DROPS: ENHANCED_NFT_PARTS.filter(nft => nft.rarity === 'common'),
  RARE_DROPS: ENHANCED_NFT_PARTS.filter(nft => nft.rarity === 'rare'),
  EPIC_DROPS: ENHANCED_NFT_PARTS.filter(nft => nft.rarity === 'epic'),
  LEGENDARY_DROPS: ENHANCED_NFT_PARTS.filter(nft => nft.rarity === 'legendary')
};

export const generateRandomNFT = (): NFTItem => {
  const rand = Math.random();

  const getRandomFromDrops = (drops: NFTItem[]): NFTItem => {
    if (drops.length === 0) {
      return ENHANCED_NFT_PARTS[0]!;
    }
    return drops[Math.floor(Math.random() * drops.length)]!;
  };

  if (rand < 0.01) {
    return getRandomFromDrops(NFT_DROP_TABLE.LEGENDARY_DROPS);
  } else if (rand < 0.05) {
    return getRandomFromDrops(NFT_DROP_TABLE.EPIC_DROPS);
  } else if (rand < 0.2) {
    return getRandomFromDrops(NFT_DROP_TABLE.RARE_DROPS);
  } else {
    return getRandomFromDrops(NFT_DROP_TABLE.COMMON_DROPS);
  }
};