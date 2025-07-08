
// =============================================================================
// Core Utility Functions
// =============================================================================

import { TimeOfDay, Weather, SeasonalEvent } from '../types';

// Base reward calculation
export const calculateBaseReward = (duration: number, prayerType?: string) => {
  const baseRate = 10; // Base cultural capital per minute
  const minutes = duration / 60; // Convert seconds to minutes
  
  const typeMultipliers: Record<string, number> = {
    'gratitude': 1.2,
    'peace': 1.0,
    'prosperity': 1.1,
    'health': 1.15,
    'love': 1.1,
    'wisdom': 1.25,
    'protection': 1.05
  };
  
  const multiplier = typeMultipliers[prayerType || 'gratitude'] || 1.0;
  const culturalCapital = Math.floor(baseRate * minutes * multiplier);
  const experience = Math.floor(culturalCapital * 0.5);

  return {
    culturalCapital,
    experience
  };
};

// Calculate level from experience
export const calculateLevel = (experience: number): number => {
  return Math.floor(Math.sqrt(experience / 100)) + 1;
};

// Calculate experience needed for next level
export const getExperienceForNextLevel = (currentLevel: number): number => {
  return Math.pow(currentLevel, 2) * 100;
};

// Get cultural belt based on cultural capital
export const getCulturalBelt = (culturalCapital: number): string => {
  if (culturalCapital >= 10000) return '金帯';
  if (culturalCapital >= 8000) return '赤帯';
  if (culturalCapital >= 6000) return '黒帯';
  if (culturalCapital >= 4000) return '茶帯';
  if (culturalCapital >= 2000) return '紫帯';
  if (culturalCapital >= 1000) return '青帯';
  if (culturalCapital >= 500) return '緑帯';
  if (culturalCapital >= 300) return '橙帯';
  if (culturalCapital >= 100) return '黄帯';
  return '白帯';
};

// Rarity calculation
export const calculateRarity = (baseChance: number, bonuses: any): string => {
  const totalChance = baseChance + (bonuses?.total || 0);
  const random = Math.random() * 100;
  
  if (random < 1 + totalChance * 0.1) return 'legendary';
  if (random < 5 + totalChance * 0.2) return 'epic';
  if (random < 20 + totalChance * 0.3) return 'rare';
  return 'common';
};

// Prayer type multipliers
export const PRAYER_TYPE_MULTIPLIERS = {
  'gratitude': 1.2,
  'peace': 1.0,
  'prosperity': 1.1,
  'health': 1.15,
  'love': 1.1,
  'wisdom': 1.25,
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
  const totalBonus = (bonuses?.time || 0) + (bonuses?.weather || 0) + (bonuses?.seasonal || 0);
  
  return {
    culturalCapital: Math.floor(baseReward.culturalCapital * (1 + totalBonus / 100)),
    experience: Math.floor(baseReward.experience * (1 + totalBonus / 100)),
    bonuses: totalBonus
  };
};

// Weather bonuses
export const getWeatherBonuses = (weather: Weather): number => {
  const bonuses: Record<Weather, number> = {
    'sunny': 10,
    'cloudy': 5,
    'rainy': 20,
    'snowy': 15
  };
  return bonuses[weather] || 0;
};

// Seasonal events
export const getSeasonalEvent = (): SeasonalEvent | null => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  // Cherry blossom season (March 20 - May 5)
  if ((month === 3 && day >= 20) || month === 4 || (month === 5 && day <= 5)) {
    return {
      name: '桜祭り',
      bonus: 25,
      description: '桜の季節の特別な加護'
    };
  }
  
  // Autumn leaves (October 15 - December 5)
  if ((month === 10 && day >= 15) || month === 11 || (month === 12 && day <= 5)) {
    return {
      name: '紅葉祭り',
      bonus: 20,
      description: '紅葉の季節の特別な加護'
    };
  }
  
  return null;
};

// Streak calculation
export const calculateStreakBonus = (streakDays: number): number => {
  if (streakDays >= 30) return 50;
  if (streakDays >= 14) return 30;
  if (streakDays >= 7) return 20;
  if (streakDays >= 3) return 10;
  return 0;
};

// Time of day detection
export const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
};

// Generate unique visit ID
export const generateVisitId = (): string => {
  return `visit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Validate location data
export const validateLocation = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};
