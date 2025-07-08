

// =============================================================================
// Utility Functions Index
// =============================================================================

export * from './formatUtils';
export * from './nftUtils';
export * from './gameUtils';
export * from './starknet';

// =============================================================================
// Core Utility Functions
// =============================================================================

// Type definitions
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// Generic array utility
export const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]!;
};

// Omikuji result generator
export const getRandomOmikujiResult = (): string => {
  const results = ['大吉', '中吉', '小吉', '末吉', '凶'] as const;
  return results[Math.floor(Math.random() * results.length)]!;
};

// Weather generator
export const getRandomWeather = (): { type: string; description: string } => {
  const weathers = [
    { type: 'sunny', description: '晴れ' },
    { type: 'cloudy', description: '曇り' },
    { type: 'rainy', description: '雨' },
    { type: 'snowy', description: '雪' }
  ];
  return getRandomElement(weathers);
};

// Season detector
export const getCurrentSeason = (): string => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
};

// Time of day detector
export const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
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

// Cultural capital calculator
export const calculateCulturalCapital = (
  baseDuration: number,
  multiplier: number = 1,
  bonuses: { weather?: number; season?: number; timeOfDay?: number } = {}
): number => {
  const baseRate = 10; // Base points per minute
  const minutes = baseDuration / 60000; // Convert ms to minutes

  let total = baseRate * minutes * multiplier;

  // Apply bonuses
  if (bonuses.weather) total += bonuses.weather;
  if (bonuses.season) total += bonuses.season;
  if (bonuses.timeOfDay) total += bonuses.timeOfDay;

  return Math.floor(total);
};

// Experience calculator
export const calculateExperience = (culturalCapital: number): number => {
  return Math.floor(culturalCapital * 0.5);
};

// Base reward calculator
export const calculateBaseReward = (duration: number, prayerType?: string) => {
  const baseRate = 10; // Base cultural capital per minute
  const minutes = duration / 60000; // Convert ms to minutes

  let multiplier = 1;
  if (prayerType === 'meditation') multiplier = 1.2;
  if (prayerType === 'blessing') multiplier = 1.5;
  if (prayerType === 'healing') multiplier = 1.3;

  const culturalCapital = Math.floor(baseRate * minutes * multiplier);
  const experience = Math.floor(culturalCapital * 0.5);

  return {
    culturalCapital,
    experience
  };
};

// Level calculator
export const calculateLevel = (experience: number): number => {
  return Math.floor(experience / 100) + 1;
};

// Progress calculator
export const calculateProgress = (experience: number): number => {
  return experience % 100;
};

// Streak calculator
export const calculateStreak = (lastVisit: Date | null): number => {
  if (!lastVisit) return 0;

  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  if (lastVisit.toDateString() === yesterday.toDateString()) {
    return 1; // Continue streak
  }

  return 0; // Reset streak
};

// NFT drop chance calculator
export const calculateNFTDropChance = (
  prayerType: string,
  duration: number,
  bonuses: { weather?: boolean; season?: boolean; timeOfDay?: boolean } = {}
): number => {
  let baseChance = 0.1; // 10% base chance

  // Prayer type bonus
  if (prayerType === 'blessing') baseChance += 0.05;
  if (prayerType === 'healing') baseChance += 0.03;

  // Duration bonus
  if (duration > 300000) baseChance += 0.02; // 5+ minutes
  if (duration > 600000) baseChance += 0.03; // 10+ minutes

  // Environmental bonuses
  if (bonuses.weather) baseChance += 0.02;
  if (bonuses.season) baseChance += 0.01;
  if (bonuses.timeOfDay) baseChance += 0.02;

  return Math.min(baseChance, 0.5); // Cap at 50%
};

// Debug logging
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
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Level and experience utilities
export const getNextLevelExperience = (currentLevel: number): number => {
  return Math.pow(currentLevel, 2) * 100;
};

// LocalStorage utilities
export const saveToLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage:`, error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading from localStorage:`, error);
    return defaultValue;
  }
};

// Prayer duration utilities
export const getDefaultPrayerDuration = (type: string): number => {
  const durations: Record<string, number> = {
    'gratitude': 120000, // 2 minutes
    'peace': 180000,     // 3 minutes
    'prosperity': 150000, // 2.5 minutes
    'health': 120000,    // 2 minutes
    'wisdom': 240000,    // 4 minutes
    'protection': 180000  // 3 minutes
  };
  return durations[type] || 120000;
};

// Achievement utilities
export const checkAchievements = (userStats: any): string[] => {
  const newAchievements: string[] = [];
  
  // First prayer achievement
  if (userStats.totalWorshipSessions === 1) {
    newAchievements.push('first_prayer');
  }
  
  // Weekly streak achievement
  if (userStats.streak === 7) {
    newAchievements.push('weekly_streak');
  }
  
  // Level milestones
  if ([5, 10, 25, 50].includes(userStats.level)) {
    newAchievements.push(`level_${userStats.level}`);
  }
  
  return newAchievements;
};

// NFT rarity constants
export const NFT_RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const;
export type NFTRarity = typeof NFT_RARITIES[number];

// Game utility constants
export const PRAYER_MULTIPLIERS = {
  'gratitude': 1.2,
  'peace': 1.0,
  'prosperity': 1.1,
  'health': 1.0,
  'wisdom': 1.3,
  'protection': 0.9
} as const;

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
  const totalBonus = Object.values(bonuses).reduce((sum: number, bonus: any) => sum + bonus, 0);
  
  return {
    ...baseReward,
    totalCulturalCapital: baseReward.culturalCapital + totalBonus,
    bonuses
  };
};

// Level progress calculation
export const calculateLevelProgress = (experience: number): { level: number; progress: number; nextLevelExp: number } => {
  const level = calculateLevel(experience);
  const currentLevelExp = Math.pow(level - 1, 2) * 100;
  const nextLevelExp = Math.pow(level, 2) * 100;
  const progress = ((experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
  
  return {
    level,
    progress: Math.min(progress, 100),
    nextLevelExp
  };
};

// Streak bonus calculation
export const calculateStreakBonus = (streak: number): number => {
  if (streak >= 30) return 50;
  if (streak >= 14) return 30;
  if (streak >= 7) return 20;
  if (streak >= 3) return 10;
  return 0;
};

// Weather bonus calculation
export const getWeatherBonus = (weather: string): number => {
  const bonuses: Record<string, number> = {
    'sunny': 10,
    'cloudy': 5,
    'rainy': 0,
    'snowy': 15
  };
  return bonuses[weather] || 0;
};

// Seasonal events
export const getSeasonalEvents = (): Array<{ name: string; bonus: number; active: boolean }> => {
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  
  return [
    {
      name: '新年',
      bonus: 50,
      active: month === 1 && day <= 7
    },
    {
      name: '春分の日',
      bonus: 30,
      active: month === 3 && day >= 20 && day <= 22
    },
    {
      name: '秋分の日',
      bonus: 30,
      active: month === 9 && day >= 22 && day <= 24
    }
  ];
};
