// =============================================================================
// Utility Functions Index
// =============================================================================

// Debug utility
export const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data);
  }
};

// Random element picker
export const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]!;
};

// Omikuji result generator
export const getRandomOmikujiResult = (): string => {
  const results = ['大吉', '中吉', '小吉', '末吉', '凶'] as const;
  return results[Math.floor(Math.random() * results.length)]!;
};

// Weather system
export const getRandomWeather = (): { type: string; description: string } => {
  const weathers = [
    { type: 'sunny', description: '晴れ' },
    { type: 'cloudy', description: '曇り' },
    { type: 'rainy', description: '雨' },
    { type: 'snowy', description: '雪' }
  ];
  return getRandomElement(weathers);
};

// Time of day detection
export const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

// Seasonal event detection
export const getCurrentSeasonalEvent = (): string | null => {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  // New Year (Dec 28 - Jan 7)
  if ((month === 11 && day >= 28) || (month === 0 && day <= 7)) {
    return '新年祭';
  }

  // Cherry blossom season (March - April)
  if (month === 2 || month === 3) {
    return '桜祭り';
  }

  // Summer festival (July - August)
  if (month === 6 || month === 7) {
    return '夏祭り';
  }

  // Autumn leaves (October - November)
  if (month === 9 || month === 10) {
    return '紅葉祭';
  }

  return null;
};

// Calculate base reward
export const calculateBaseReward = (duration: number, prayerType?: string) => {
  const baseRate = 10; // Base cultural capital per minute
  const minutes = duration / 60;

  // Prayer type multiplier
  let multiplier = 1;
  switch (prayerType) {
    case 'gratitude':
      multiplier = 1.3;
      break;
    case 'peace':
      multiplier = 1.2;
      break;
    case 'prosperity':
      multiplier = 1.25;
      break;
    case 'health':
      multiplier = 1.15;
      break;
    case 'wisdom':
      multiplier = 1.35;
      break;
    case 'protection':
      multiplier = 1.1;
      break;
    default:
      multiplier = 1;
  }

  const culturalCapital = Math.floor(baseRate * minutes * multiplier);
  const experience = Math.floor(culturalCapital * 0.5);

  return {
    culturalCapital,
    experience
  };
};

// Format utils re-export
export { formatTime, formatCurrency, formatDate } from './formatUtils';

// NFT utils re-export
export { 
  calculateNFTRarity, 
  generateNFTMetadata, 
  getRarityColor,
  generateSVGBase64,
  dropNFTFromOmikuji
} from './nftUtils';

// Game utils re-export
export {
  calculateLevelProgress,
  getWeatherBonus,
  getTimeBonuses,
  calculateStreakBonus,
  getSeasonalEvents
} from './gameUtils';