// =============================================================================
// Utility Functions Index
// =============================================================================

// Re-export from other utility modules
export * from './formatUtils';
export * from './nftUtils';

// =============================================================================
// Core Utility Functions
// =============================================================================

// Type definitions
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// Generic array utility
export const getRandomElement = <T>(array: T[]): T => {
  if (array.length === 0) {
    throw new Error('Array is empty');
  }
  return array[Math.floor(Math.random() * array.length)];
};

// Time of day detector
export const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

// Weather utilities
export const getRandomWeather = () => {
  const weatherTypes = ['sunny', 'cloudy', 'rainy', 'snowy'];
  const type = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  return { type: type!, emoji: getWeatherEmoji(type!) };
};

const getWeatherEmoji = (weather: string): string => {
  const emojis: Record<string, string> = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '❄️'
  };
  return emojis[weather] || '☀️';
};

// Seasonal events
export const getSeasonalEvent = (): string | null => {
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();

  // New Year
  if (month === 1 && day <= 7) return '新年';
  // Spring Festival
  if (month === 3 && day >= 20) return '春分の日';
  // Autumn Festival
  if (month === 9 && day >= 22) return '秋分の日';

  return null;
};

// Add alias for compatibility
export const getCurrentSeasonalEvent = getSeasonalEvent;

// Weather bonus utilities
export const getWeatherBonus = (weather: string): number => {
  const bonuses: Record<string, number> = {
    sunny: 1.2,
    rainy: 1.1,
    cloudy: 1.0,
    snowy: 1.15
  };
  return bonuses[weather] || 1.0;
};

export const getWeatherBonuses = () => {
  return [
    { weather: 'sunny', bonus: 1.2, description: '晴天ボーナス' },
    { weather: 'rainy', bonus: 1.1, description: '雨天の静寂' },
    { weather: 'snowy', bonus: 1.15, description: '雪景色の美' }
  ];
};

// Time-based bonuses
export const getTimeBonuses = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 8) {
    return { multiplier: 1.3, description: '早朝の清浄な空気' };
  }
  if (hour >= 18 && hour < 21) {
    return { multiplier: 1.2, description: '夕暮れの神秘' };
  }
  if (hour >= 22 || hour < 5) {
    return { multiplier: 1.25, description: '深夜の静寂' };
  }

  return { multiplier: 1.0, description: '' };
};

// Cultural capital calculator
export const calculateCulturalCapital = (
  baseDuration: number,
  prayerType: string = 'gratitude',
  weather: string = 'sunny'
): { culturalCapital: number; experience: number } => {
  const baseRate = 10; // Base cultural capital per minute
  const minutes = baseDuration / 60000; // Convert to minutes

  let multiplier = 1.0;

  // Prayer type multiplier
  const prayerMultipliers: Record<string, number> = {
    gratitude: 1.0,
    healing: 1.1,
    prosperity: 1.2,
    protection: 1.15,
    wisdom: 1.25
  };

  multiplier *= prayerMultipliers[prayerType] || 1.0;
  multiplier *= getWeatherBonus(weather);
  multiplier *= getTimeBonuses().multiplier;

  const culturalCapital = Math.floor(baseRate * minutes * multiplier);
  const experience = Math.floor(culturalCapital * 0.5);

  return {
    culturalCapital,
    experience
  };
};

// Level calculation utilities
export const calculateLevel = (experience: number): number => {
  return Math.floor(Math.sqrt(experience / 100)) + 1;
};

export const getExperienceForNextLevel = (currentLevel: number): number => {
  return Math.pow(currentLevel, 2) * 100;
};

export const calculateLevelProgress = (experience: number): number => {
  const currentLevel = calculateLevel(experience);
  const currentLevelExp = getExperienceForNextLevel(currentLevel - 1);
  const nextLevelExp = getExperienceForNextLevel(currentLevel);

  return ((experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
};

// Achievement system
export const checkAchievements = (userStats: any) => {
  const achievements = [];

  if (userStats.totalPrayers >= 10) {
    achievements.push('devotee');
  }
  if (userStats.culturalCapital >= 1000) {
    achievements.push('cultured');
  }
  if (userStats.streak >= 7) {
    achievements.push('consistent');
  }

  return achievements;
};

// Streak bonus calculator
export const calculateStreakBonus = (streak: number): number => {
  if (streak >= 30) return 2.0;
  if (streak >= 14) return 1.5;
  if (streak >= 7) return 1.3;
  if (streak >= 3) return 1.1;
  return 1.0;
};

// Debug utility
export const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data || '');
  }
};

// Distance utilities
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Enhanced reward calculation
export const calculateEnhancedReward = (
  baseDuration: number,
  streak: number,
  weather: string,
  timeOfDay: string
): number => {
  const base = calculateCulturalCapital(baseDuration).culturalCapital;
  const streakBonus = calculateStreakBonus(streak);
  const weatherMultiplier = getWeatherBonus(weather);
  const timeMultiplier = getTimeBonuses().multiplier;

  return Math.floor(base * streakBonus * weatherMultiplier * timeMultiplier);
};

// Get seasonal events
export const getSeasonalEvents = () => {
  return [
    {
      name: '新年',
      startDate: '01-01',
      endDate: '01-07',
      bonus: 1.5,
      description: '新年の祈りは特別な力を持つ'
    },
    {
      name: '春分の日',
      startDate: '03-20',
      endDate: '03-22',
      bonus: 1.3,
      description: '昼と夜の均衡の時'
    }
  ];
};

// Base reward calculation - returns object for compatibility
export const calculateBaseReward = (duration: number, prayerType?: string) => {
  const baseRate = 10; // Base cultural capital per minute
  const minutes = duration / 60; // Convert seconds to minutes

  let multiplier = 1.0;
  if (prayerType) {
    const prayerMultipliers: Record<string, number> = {
      gratitude: 1.0,
      healing: 1.1,
      prosperity: 1.2,
      protection: 1.15,
      wisdom: 1.25
    };
    multiplier = prayerMultipliers[prayerType] || 1.0;
  }

  const culturalCapital = Math.floor(baseRate * minutes * multiplier);
  const experience = Math.floor(culturalCapital * 0.5);

  return {
    culturalCapital,
    experience
  };
};

// =============================================================================
// Local Storage Utilities
// =============================================================================

export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};
export const getRandomItem = <T>(array: T[]): T => {
  if (array.length === 0) {
    throw new Error('Array is empty');
  }
  return array[Math.floor(Math.random() * array.length)] as T;
};