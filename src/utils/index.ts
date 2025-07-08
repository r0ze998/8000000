// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Format currency values
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP').format(amount);
};

/**
 * Format time duration
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}秒`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return remainingSeconds > 0 
      ? `${minutes}分${remainingSeconds}秒`
      : `${minutes}分`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0
    ? `${hours}時間${remainingMinutes}分`
    : `${hours}時間`;
};

/**
 * Format date to Japanese format
 */
export const formatDate = (date: Date | number): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
};

/**
 * Calculate distance between two coordinates
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }

  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
};

/**
 * Calculate base reward for prayer sessions
 */
export const calculateBaseReward = (duration: number, prayerType?: string) => {
  const baseRate = 10; // Base cultural capital per minute
  const minutes = duration / 60;

  let multiplier = 1;
  switch (prayerType) {
    case 'meditation':
      multiplier = 1.2;
      break;
    case 'gratitude':
      multiplier = 1.1;
      break;
    case 'breathing':
      multiplier = 1.0;
      break;
    case 'reflection':
      multiplier = 1.3;
      break;
    default:
      multiplier = 1.0;
  }

  const culturalCapital = Math.floor(baseRate * minutes * multiplier);
  const experience = Math.floor(culturalCapital * 0.5);

  return {
    culturalCapital,
    experience
  };
};

/**
 * Debug logging utility
 */
export const debugLog = (message: string, data?: any): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Debug] ${message}`, data || '');
  }
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get random element from array
 */
export const getRandomElement = <T>(array: T[]): T => {
  if (array.length === 0) {
    throw new Error('Cannot get random element from empty array');
  }
  const element = array[Math.floor(Math.random() * array.length)];
  if (element === undefined) {
    throw new Error('Selected element is undefined');
  }
  return element;
};

/**
 * Clamp number between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// Re-export utilities
export * from './formatUtils';
export * from './nftUtils';
export * from './starknet';

// Streak calculation
export const calculateStreak = (lastVisit: Date | null, currentVisit: Date): number => {
  if (!lastVisit) return 1;

  const daysDiff = Math.floor((currentVisit.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 1) {
    return 1; // Continue streak
  } else if (daysDiff === 0) {
    return 0; // Same day, no streak change
  } else {
    return -1; // Streak broken
  }
};

// Level calculation
export const calculateLevel = (experience: number): number => {
  return Math.floor(Math.sqrt(experience / 100)) + 1;
};

// Cultural belt ranking
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

// =============================================================================
// Local Storage Utilities
// =============================================================================

export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error saving to localStorage with key "${key}":`, error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error loading from localStorage with key "${key}":`, error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage with key "${key}":`, error);
  }
};

// =============================================================================
// Date & Time Utilities
// =============================================================================

export const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// =============================================================================
// Math & Random Utilities
// =============================================================================

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    if (temp !== undefined && shuffled[j] !== undefined) {
      shuffled[i] = shuffled[j]!;
      shuffled[j] = temp;
    }
  }
  return shuffled;
};

export const randomChoice = <T>(array: T[]): T => {
  if (array.length === 0) {
    throw new Error('Cannot choose from empty array');
  }
  const index = randomInt(0, array.length - 1);
  const item = array[index];
  if (item === undefined) {
    throw new Error('Selected item is undefined');
  }
  return item;
};

export const randomId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// =============================================================================
// Game Mechanics
// =============================================================================

export const getCurrentSeasonalEvent = () => {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  // New Year period
  if ((month === 0 && day <= 3) || (month === 11 && day >= 29)) {
    return { name: '新年祭', bonus: 50 };
  }

  return null;
};

export const getRandomWeather = () => {
  const conditions = [
    { condition: 'sunny', bonus: 10, icon: '☀️' },
    { condition: 'cloudy', bonus: 5, icon: '☁️' },
    { condition: 'rainy', bonus: 15, icon: '🌧️' },
    { condition: 'snowy', bonus: 20, icon: '❄️' }
  ];

  return conditions[Math.floor(Math.random() * conditions.length)]!;
};

// =============================================================================
// Validation Utilities
// =============================================================================

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Starknet address format
 */
export const validateStarknetAddress = (address: string): boolean => {
  // StarkNet アドレスの基本的な検証
  return /^0x[0-9a-fA-F]{63,64}$/.test(address);
};

// =============================================================================
// Debug Utilities
// =============================================================================

export const debugWarn = (message: string, ...args: any[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[WARN] ${message}`, ...args);
  }
};

export const debugError = (message: string, error?: Error): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${message}`, error);
  }
};