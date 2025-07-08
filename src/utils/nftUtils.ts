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
  const colors = {
    common: '#9CA3AF',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B'
  };
  return colors[rarity as keyof typeof colors] || colors.common;
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

// ランダムなNFTパーツを選択
export const selectRandomParts = (categories: any, rarity: NFTRarity) => {
  const rarityWeights = {
    common: { common: 0.7, rare: 0.25, epic: 0.04, legendary: 0.01 },
    rare: { common: 0.5, rare: 0.35, epic: 0.13, legendary: 0.02 },
    epic: { common: 0.3, rare: 0.4, epic: 0.25, legendary: 0.05 },
    legendary: { common: 0.1, rare: 0.3, epic: 0.4, legendary: 0.2 }
  };

  const weights = rarityWeights[rarity];
  const selectedParts: any[] = [];

  Object.entries(categories).forEach(([categoryName, parts]) => {
    if (Array.isArray(parts) && parts.length > 0) {
      // 重み付きランダム選択
      const random = Math.random();
      let cumulativeWeight = 0;
      let selectedRarity: NFTRarity = 'common';

      for (const [rarityKey, weight] of Object.entries(weights)) {
        cumulativeWeight += weight;
        if (random <= cumulativeWeight) {
          selectedRarity = rarityKey as NFTRarity;
          break;
        }
      }

      // 指定された希少度のパーツをフィルタリング
      const filteredParts = parts.filter(part => part.rarity === selectedRarity);
      if (filteredParts.length > 0) {
        const randomPart = filteredParts[Math.floor(Math.random() * filteredParts.length)];
        selectedParts.push(randomPart);
      } else {
        // フォールバック: 利用可能な任意のパーツ
        const randomPart = parts[Math.floor(Math.random() * parts.length)];
        selectedParts.push(randomPart);
      }
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

  const totalScore = parts.reduce((sum, part) => {
    return sum + (rarityScores[part.rarity as keyof typeof rarityScores] || 1);
  }, 0);

  const averageScore = totalScore / parts.length;

  if (averageScore >= 6) return 'legendary';
  if (averageScore >= 4) return 'epic';
  if (averageScore >= 2.5) return 'rare';
  return 'common';
};