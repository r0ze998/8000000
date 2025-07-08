

// =============================================================================
// Utility Functions Index
// =============================================================================

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// Time of day utilities
export const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

// Season utilities
export const getCurrentSeason = (): string => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
};

// Random utilities
export const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]!;
};

export const getRandomWeather = (): { type: string; description: string } => {
  const weathers = [
    { type: 'sunny', description: '晴れ' },
    { type: 'cloudy', description: '曇り' },
    { type: 'rainy', description: '雨' },
    { type: 'snowy', description: '雪' }
  ];
  return getRandomElement(weathers);
};

// Omikuji utilities
export const getRandomOmikujiResult = (): string => {
  const results = ['大吉', '中吉', '小吉', '末吉', '凶'] as const;
  return results[Math.floor(Math.random() * results.length)]!;
};

// Seasonal event utilities
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
export const calculateLevel = (experience: number): number => {
  return Math.floor(Math.sqrt(experience / 100)) + 1;
};

export const getNextLevelExperience = (currentLevel: number): number => {
  return Math.pow(currentLevel, 2) * 100;
};

// Prayer reward calculation
export const calculateBaseReward = (duration: number, prayerType?: string) => {
  const baseRate = 10; // Base cultural capital per minute
  const minutes = duration / 60000; // Convert milliseconds to minutes
  
  // Prayer type multipliers
  const typeMultipliers: Record<string, number> = {
    'gratitude': 1.2,
    'peace': 1.0,
    'prosperity': 1.1,
    'health': 1.0,
    'wisdom': 1.3,
    'protection': 0.9
  };
  
  const multiplier = prayerType ? (typeMultipliers[prayerType] || 1.0) : 1.0;
  const culturalCapital = Math.floor(baseRate * minutes * multiplier);
  const experience = Math.floor(culturalCapital * 0.5);

  return {
    culturalCapital,
    experience
  };
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

// Debug utility
export const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data);
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

// Format utilities (re-exported for convenience)
export * from './formatUtils';
export * from './nftUtils';
export * from './gameUtils';
