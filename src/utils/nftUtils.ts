import { NFT_RARITIES } from './index';

// =============================================================================
// NFT Utility Functions
// =============================================================================

// Get prayer emoji based on type
export const getPrayerEmoji = (type: string): string => {
  const emojis: Record<string, string> = {
    'gratitude': '🙏',
    'peace': '☮️', 
    'prosperity': '💰',
    'health': '🌿',
    'love': '💕',
    'wisdom': '📿',
    'protection': '🛡️'
  };
  return emojis[type] || '🙏';
};

// Get rarity-based power multiplier
export const getRarityPower = (rarity: string): number => {
  const powers: Record<string, number> = {
    'common': 1.0,
    'rare': 1.5,
    'epic': 2.0,
    'legendary': 3.0
  };
  return powers[rarity] || 1.0;
};

// Get rarity color
export const getRarityColor = (rarity: string): string => {
  const colors = {
    'common': '#FFFFFF',
    'rare': '#4FC3F7',
    'epic': '#9C27B0',
    'legendary': '#FFD700'
  };
  return colors[rarity as keyof typeof colors] || colors.common;
};

// Generate SVG for NFT
export const generateNFTSVG = (nftData: any): string => {
  const color = getRarityColor(nftData.rarity || 'common');
  const emoji = getPrayerEmoji(nftData.type || 'gratitude');

  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.8"/>
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.3"/>
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#bg)" rx="20"/>
      <text x="100" y="80" text-anchor="middle" font-size="60">${emoji}</text>
      <text x="100" y="130" text-anchor="middle" font-size="14" fill="white">${nftData.shrine || '神社'}</text>
      <text x="100" y="150" text-anchor="middle" font-size="12" fill="white">${nftData.date || new Date().toLocaleDateString()}</text>
      <text x="100" y="170" text-anchor="middle" font-size="10" fill="white">${nftData.rarity || 'common'}</text>
    </svg>
  `;

  return btoa(svg);
};

// Generate SVG Base64 - compatibility function
export const generateSVGBase64 = (nftData: any): string => {
  const color = getRarityColor(nftData.rarity || 'common');
  const emoji = getPrayerEmoji(nftData.type || 'gratitude');

  const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="${color}" rx="10"/>
    <text x="100" y="120" text-anchor="middle" font-size="48">${emoji}</text>
  </svg>`;

  return btoa(svg);
};

// Create NFT metadata
export const createNFTMetadata = (visitData: any) => {
  return {
    name: `御朱印 - ${visitData.shrine}`,
    description: `${visitData.date}の参拝記録`,
    image: `data:image/svg+xml;base64,${generateNFTSVG(visitData)}`,
    attributes: [
      { trait_type: "神社", value: visitData.shrine },
      { trait_type: "日付", value: visitData.date },
      { trait_type: "レアリティ", value: visitData.rarity },
      { trait_type: "祈願", value: visitData.type }
    ]
  };
};