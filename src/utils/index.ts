

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

// Format utilities (re-exported for convenience)
export * from './formatUtils';
export * from './nftUtils';
export * from './gameUtils';
