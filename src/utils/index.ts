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

// Debug logging utility
export const debugLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEBUG]', ...args);
  }
};

// Local storage utilities
export const getStoredData = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStoredData = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to store data:', error);
  }
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Random utilities
export const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const getRandomWeather = (): string => {
  const weathers = ['sunny', 'cloudy', 'rainy', 'snowy'];
  return getRandomElement(weathers);
};

export const getRandomTimeOfDay = (): string => {
  const times = ['dawn', 'morning', 'afternoon', 'evening', 'night'];
  return getRandomElement(times);
};

// Calculate distance between two points (Haversine formula)
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

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidCoordinate = (lat: number, lon: number): boolean => {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};

// Date utilities
export const getJapaneseDate = (date: Date = new Date()): string => {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Omikuji utilities
export const getRandomOmikujiResult = (): string => {
  const results = ['大吉', '中吉', '小吉', '末吉', '凶'] as const;
  return results[Math.floor(Math.random() * results.length)]!;
};

// Game mechanics utilities
export const calculateStreakBonus = (streak: number): number => {
  if (streak >= 100) return 5.0;
  if (streak >= 50) return 3.0;
  if (streak >= 30) return 2.0;
  if (streak >= 7) return 1.5;
  return 1.0;
};

export const calculateBaseReward = (duration: number, prayerType?: string) => {
  const baseRate = 10; // Base cultural capital per minute
  const minutes = duration / 60000; // Convert ms to minutes

  let multiplier = 1;
  if (prayerType === 'gratitude') multiplier = 1.2;
  if (prayerType === 'health') multiplier = 1.1;

  const culturalCapital = Math.floor(baseRate * minutes * multiplier);
  const experience = Math.floor(culturalCapital * 0.5);

  return {
    culturalCapital,
    experience
  };
};