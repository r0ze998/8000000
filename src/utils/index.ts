// =============================================================================
// Main Utility Functions
// =============================================================================

// Debug logging utility
export const debugLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEBUG]', ...args);
  }
};

// NFT rarities configuration
export const NFT_RARITIES = {
  common: { color: '#FFFFFF', weight: 70 },
  rare: { color: '#4ECDC4', weight: 20 },
  epic: { color: '#9F7AEA', weight: 8 },
  legendary: { color: '#FFD700', weight: 2 }
} as const;

// Time of day types
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// Get current time of day
export const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

// Weather types and utilities
export const getRandomWeather = () => {
  const weatherTypes = ['sunny', 'cloudy', 'rainy', 'snowy'];
  const type = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  return { type, emoji: getWeatherEmoji(type) };
};

const getWeatherEmoji = (weather: string): string => {
  const emojis = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '❄️'
  };
  return emojis[weather as keyof typeof emojis] || '☀️';
};

// Seasonal events
export const getCurrentSeasonalEvent = () => {
  const month = new Date().getMonth() + 1;

  if (month === 1) return { name: '新年祭', bonus: 50 };
  if (month === 3 || month === 4) return { name: '桜祭り', bonus: 30 };
  if (month === 7) return { name: '七夕祭り', bonus: 25 };
  if (month === 12) return { name: '除夜の鐘', bonus: 40 };

  return null;
};

// Prayer type multipliers
export const PRAYER_TYPE_MULTIPLIERS = {
  'gratitude': 1.0,
  'peace': 1.1,
  'healing': 1.2,
  'prosperity': 1.3,
  'wisdom': 1.4,
  'love': 1.2,
  'protection': 0.9
} as const;

// Base reward calculation
export const calculateBaseReward = (duration: number, prayerType?: string) => {
  const baseRate = 10; // Base cultural capital per minute
  const minutes = duration / 60;

  // Apply prayer type multiplier
  const multiplier = prayerType ? 
    PRAYER_TYPE_MULTIPLIERS[prayerType as keyof typeof PRAYER_TYPE_MULTIPLIERS] || 1.0 : 1.0;

  const culturalCapital = Math.floor(baseRate * minutes * multiplier);
  const experience = Math.floor(culturalCapital * 0.5);

  return {
    culturalCapital,
    experience
  };
};

// Time bonuses
export const getTimeBonuses = (timeOfDay: TimeOfDay): number => {
  const bonuses: Record<TimeOfDay, number> = {
    'morning': 15,
    'afternoon': 5,
    'evening': 10,
    'night': 0
  };
  return bonuses[timeOfDay];
};

// Enhanced reward calculation
export const calculateEnhancedReward = (duration: number, prayerType: string, bonuses: any) => {
  const baseReward = calculateBaseReward(duration, prayerType);
  const timeBonus = getTimeBonuses(getTimeOfDay());
  const weatherBonus = getWeatherBonuses(bonuses.weather || 'sunny');
  const seasonalBonus = bonuses.seasonal ? 20 : 0;

  return {
    ...baseReward,
    bonuses: {
      time: timeBonus,
      weather: weatherBonus,
      seasonal: seasonalBonus,
      total: timeBonus + weatherBonus + seasonalBonus
    }
  };
};

// Weather bonuses
export const getWeatherBonuses = (weather: string): number => {
  const bonuses = {
    'sunny': 10,
    'cloudy': 5,
    'rainy': 20,
    'snowy': 15
  };
  return bonuses[weather as keyof typeof bonuses] || 0;
};

// Level calculation
export const calculateLevel = (experience: number): number => {
  return Math.floor(experience / 100) + 1;
};

// Experience needed for next level
export const getExperienceForNextLevel = (currentLevel: number): number => {
  return currentLevel * 100;
};

// Format utilities export
export * from './formatUtils';
export * from './nftUtils';
export * from './gameUtils';