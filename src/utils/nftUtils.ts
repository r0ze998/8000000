// =============================================================================
// NFT Utilities
// =============================================================================

import { NFTRarity, NFTMetadata } from '../types';

// NFT Templates
export const NFT_TEMPLATES = {
  goshuin: { name: '御朱印', description: '神社の御朱印', emoji: '📜' },
  omikuji: { name: 'おみくじ', description: '運勢を占う', emoji: '🎋' },
  spirit: { name: '精霊', description: '神社の精霊', emoji: '✨' },
  blessing: { name: '祝福', description: '神の祝福', emoji: '🙏' },
  protection: { name: '守護', description: '厄除け', emoji: '🛡️' },
  wisdom: { name: '知恵', description: '学問の神', emoji: '📚' },
  fortune: { name: '幸運', description: '金運上昇', emoji: '💰' },
  terrain: { name: '地形', description: '神社の地形', emoji: '🗻' },
  structure: { name: '建造物', description: '神社の建物', emoji: '⛩️' },
  nature: { name: '自然', description: '自然の恵み', emoji: '🌸' },
  decoration: { name: '装飾', description: '美しい装飾', emoji: '🎨' },
  guardian: { name: '守護神', description: '守り神', emoji: '👹' },
  sacred: { name: '神聖', description: '神聖な力', emoji: '⚡' },
  omamori: { name: 'お守り', description: '護符', emoji: '🧿' },
  offering: { name: 'お供え', description: '神への供物', emoji: '🍊' },
  ema: { name: '絵馬', description: '願い事', emoji: '🏷️' },
  bell: { name: '鈴', description: '神社の鈴', emoji: '🔔' },
  special: { name: '特別', description: '特別なアイテム', emoji: '🌟' },
  statue: { name: '石像', description: '神社の石像', emoji: '🗿' }
};

// NFT Rarity calculation
export const calculateNFTRarity = (factors: any): NFTRarity => {
  let score = 0;

  if (factors.prayerType === 'wisdom') score += 30;
  if (factors.prayerType === 'gratitude') score += 20;
  if (factors.timeOfDay === 'morning') score += 15;
  if (factors.weather === 'sunny') score += 10;

  const random = Math.random() * 100;
  score += random;

  if (score >= 85) return 'legendary';
  if (score >= 70) return 'epic';
  if (score >= 50) return 'rare';
  if (score >= 30) return 'uncommon';
  return 'common';
};

// Get rarity color
export const getRarityColor = (rarity: string): string => {
  const colors = {
    legendary: '#FFD700',
    epic: '#9F7AEA',
    rare: '#3182CE',
    uncommon: '#38A169',
    common: '#718096'
  };
  return colors[rarity as keyof typeof colors] || colors.common;
};

// Generate SVG for NFT
export const generateSVGBase64 = (nft: any): string => {
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${nft.color};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${nft.color};stop-opacity:0.4" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#bg)" rx="20"/>
      <text x="100" y="100" text-anchor="middle" font-size="60" dy="0.3em">${nft.emoji}</text>
      <text x="100" y="160" text-anchor="middle" font-size="14" fill="white" font-weight="bold">${nft.name}</text>
    </svg>
  `;
  return btoa(svg);
};

// Generate NFT metadata
export const generateNFTMetadata = (data: {
  rarity: NFTRarity;
  shrineId: string;
  timestamp: number;
  prayerType: string;
}): NFTMetadata => {
  const id = `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const template = NFT_TEMPLATES[data.prayerType as keyof typeof NFT_TEMPLATES] || NFT_TEMPLATES.blessing;
  const color = getRarityColor(data.rarity);

  return {
    id,
    name: template.name,
    type: data.prayerType,
    rarity: data.rarity,
    description: template.description,
    emoji: template.emoji,
    color,
    timestamp: data.timestamp,
    shrineId: data.shrineId,
    prayerType: data.prayerType,
    attributes: {
      rarity: data.rarity,
      timestamp: data.timestamp,
      shrineId: data.shrineId
    }
  };
};

// Drop NFT from Omikuji
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