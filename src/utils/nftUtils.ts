import { NFTItem, NFTRarity } from '../types';

// NFT生成ユーティリティ関数
export const dropNFTFromOmikuji = (omikujiResult: string) => {
  // おみくじ結果に基づいてNFTドロップ判定
  const dropChance = {
    '大吉': 0.3,
    '中吉': 0.2,
    '小吉': 0.15,
    '吉': 0.1,
    '半吉': 0.08,
    '末吉': 0.05,
    '末小吉': 0.03,
    '凶': 0.02,
    '小凶': 0.01,
    '半凶': 0.005,
    '末凶': 0.001,
    '大凶': 0.0005
  };

  return Math.random() < (dropChance[omikujiResult as keyof typeof dropChance] || 0.05);
};

// SVGデータをBase64エンコード
export const generateSVGBase64 = (svgString: string): string => {
  return `data:image/svg+xml;base64,${btoa(svgString)}`;
};

// NFTの希少度に基づく色を取得
export const getRarityColor = (rarity: string): string => {
  switch (rarity.toLowerCase()) {
    case 'legendary':
      return '#FFD700';
    case 'epic':
      return '#9F7AEA';
    case 'rare':
      return '#3B82F6';
    case 'common':
    default:
      return '#9CA3AF';
  }
};

// NFTのSVG生成
export const generateNFTSVG = (parts: any[], background: string = '#f0f9ff'): string => {
  const svgParts = parts.map(part => part.svgPath).join('\n');

  return `
    <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" fill="${background}"/>
      ${svgParts}
    </svg>
  `;
};

// ランダムNFTパーツ選択
export const selectRandomParts = (parts: any[], count: number = 3): any[] => {
  const selectedParts: any[] = [];
  const categories = [...new Set(parts.map(part => part.category))];

  categories.slice(0, count).forEach(category => {
    const categoryParts = parts.filter(part => part.category === category);
    if (categoryParts.length > 0) {
      const randomPart = categoryParts[Math.floor(Math.random() * categoryParts.length)];
      selectedParts.push(randomPart);
    }
  });

  return selectedParts;
};

// NFTメタデータ生成
export const generateNFTMetadata = (name: string, description: string, traits: any[], svgData: string) => {
  return {
    name,
    description,
    image: generateSVGBase64(svgData),
    attributes: traits.map(trait => ({
      trait_type: trait.category,
      value: trait.name,
      rarity: trait.rarity
    }))
  };
};

// 希少度計算
export const calculateOverallRarity = (parts: any[]): NFTRarity => {
  const rarityScores = {
    common: 1,
    rare: 2,
    epic: 4,
    legendary: 8
  };

  const totalScore = parts.reduce((sum, part) => 
    sum + (rarityScores[part.rarity as keyof typeof rarityScores] || 1), 0
  );

  const avgScore = totalScore / parts.length;

  if (avgScore >= 6) return 'legendary';
  if (avgScore >= 3) return 'epic';
  if (avgScore >= 1.5) return 'rare';
  return 'common';
};