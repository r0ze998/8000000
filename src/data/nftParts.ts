import { NFTItem } from '../types';

// NFTパーツのカテゴリ - 伽藍配置の思想に基づく
export const NFT_CATEGORIES = {
  BOUNDARY: {
    id: 'boundary',
    name: '結界パーツ',
    icon: '⛩️',
    description: '神域と俗世を分ける神聖な境界'
  },
  APPROACH: {
    id: 'approach',
    name: '参道パーツ',
    icon: '🛤️',
    description: '神域への清浄な道のり'
  },
  RITUAL: {
    id: 'ritual',
    name: '儀礼パーツ',
    icon: '🙏',
    description: '祈りと清めの儀式に使用'
  },
  CENTRAL: {
    id: 'central',
    name: '中心施設パーツ',
    icon: '🏛️',
    description: '神社の中核となる神聖な建物'
  },
  GUARDIAN: {
    id: 'guardian',
    name: '守護・装飾パーツ',
    icon: '🛡️',
    description: '神域を守護し美を添える存在'
  },
  LANDSCAPE: {
    id: 'landscape',
    name: '景観パーツ',
    icon: '🌿',
    description: '自然と調和する神域の風景'
  }
} as const;

// 簡略化したNFTパーツリスト
export const ENHANCED_NFT_PARTS: NFTItem[] = [
  // 地形パーツ
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
    description: '豊かな緑の草原'
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
    description: '澄んだ水の流れ'
  },
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
    timestamp: Date.now()
  }
];

// NFT生成確率テーブル
export const NFT_DROP_TABLE = {
  COMMON_DROPS: ENHANCED_NFT_PARTS.filter(nft => nft.rarity === 'common'),
  UNCOMMON_DROPS: ENHANCED_NFT_PARTS.filter(nft => nft.rarity === 'uncommon'),
  RARE_DROPS: ENHANCED_NFT_PARTS.filter(nft => nft.rarity === 'rare'),
  EPIC_DROPS: ENHANCED_NFT_PARTS.filter(nft => nft.rarity === 'epic'),
  LEGENDARY_DROPS: ENHANCED_NFT_PARTS.filter(nft => nft.rarity === 'legendary')
};

// NFT生成関数
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
  } else if (rand < 0.5) {
    return getRandomFromDrops(NFT_DROP_TABLE.UNCOMMON_DROPS);
  } else {
    return getRandomFromDrops(NFT_DROP_TABLE.COMMON_DROPS);
  }
};