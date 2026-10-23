// =============================================================================
// Application Entry Point Exports
// =============================================================================

// Debug utilities
export const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[神社アプリ] ${message}`, data || '');
  }
};

// Format utilities
export * from './formatUtils';

// Game utilities
export * from './gameUtils';

// NFT utilities (excluding conflicting exports)
export { 
  dropNFTFromOmikuji, 
  generateSVGBase64, 
  generateNFTFromPrayer, 
  generateRandomNFT, 
  getRarityColor, 
  getRarityPower, 
  getPrayerEmoji,
  NFT_RARITIES 
} from './nftUtils';

// StarkNet utilities
export * from './starknet';

// Additional utility functions
export const calculateBaseReward = (duration: number) => {
  const baseReward = Math.floor(duration / 30); // 30秒ごとに1ポイント
  return {
    culturalCapital: baseReward,
    experience: baseReward * 2
  };
};

export const getCurrentSeasonalEvent = () => {
  const now = new Date();
  const month = now.getMonth() + 1;

  if (month === 1) return { name: '正月', bonus: 2.0 };
  if (month === 3 || month === 4) return { name: '桜', bonus: 1.5 };
  if (month === 7 || month === 8) return { name: '夏祭り', bonus: 1.3 };
  if (month === 11) return { name: '紅葉', bonus: 1.4 };
  if (month === 12) return { name: '年末', bonus: 1.2 };

  return null;
};

export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

export const getRandomWeather = () => {
  const weathers = [
    { type: 'sunny', bonus: 1.2 },
    { type: 'cloudy', bonus: 1.0 },
    { type: 'rainy', bonus: 0.8 },
    { type: 'snowy', bonus: 1.1 }
  ];
  return weathers[Math.floor(Math.random() * weathers.length)];
};

// Local storage utilities
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};