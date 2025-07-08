
// =============================================================================
// Main Utils Export File
// =============================================================================

// Re-export all utilities from their respective modules
export * from './formatUtils';
export * from './gameUtils';
export * from './nftUtils';

// =============================================================================
// Common Utility Functions
// =============================================================================

// Simple debug logging
export const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data || '');
  }
};

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Shuffle array using Fisher-Yates algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp!;
  }
  return shuffled;
};

// Clamp number between min and max
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// Random number between min and max (inclusive)
export const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Check if value is empty (null, undefined, empty string, empty array)
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// Delay execution
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// Calculate percentage
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// =============================================================================
// Prayer & Game Mechanics
// =============================================================================

// Calculate base reward for prayer
export const calculateBaseReward = (duration: number, prayerType?: string) => {
  const baseRate = 10; // Base cultural capital per minute
  const minutes = duration / 60;
  
  let multiplier = 1;
  switch (prayerType) {
    case 'health':
      multiplier = 1.2;
      break;
    case 'success':
      multiplier = 1.1;
      break;
    case 'love':
      multiplier = 1.15;
      break;
    case 'protection':
      multiplier = 1.25;
      break;
    case 'wisdom':
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

// Get seasonal events
export const getSeasonalEvents = () => {
  const now = new Date();
  const month = now.getMonth();
  const events = [];

  // Spring events (March-May)
  if (month >= 2 && month <= 4) {
    events.push({
      name: '桜祭り',
      bonus: 20,
      icon: '🌸',
      description: '桜の季節の特別ボーナス'
    });
  }
  
  // Summer events (June-August)
  if (month >= 5 && month <= 7) {
    events.push({
      name: '夏祭り',
      bonus: 15,
      icon: '🎆',
      description: '夏祭りの特別ボーナス'
    });
  }
  
  // Autumn events (September-November)
  if (month >= 8 && month <= 10) {
    events.push({
      name: '紅葉祭り',
      bonus: 18,
      icon: '🍁',
      description: '紅葉の季節の特別ボーナス'
    });
  }
  
  // Winter events (December-February)
  if (month >= 11 || month <= 1) {
    events.push({
      name: '初詣',
      bonus: 25,
      icon: '⛩️',
      description: '新年の特別ボーナス'
    });
  }

  return events;
};

// Get current seasonal event
export const getCurrentSeasonalEvent = () => {
  const events = getSeasonalEvents();
  return events.length > 0 ? events[0] : null;
};

// =============================================================================
// Cultural Capital & Level System
// =============================================================================

// Calculate level from cultural capital
export const calculateLevel = (culturalCapital: number): number => {
  return Math.floor(Math.sqrt(culturalCapital / 100)) + 1;
};

// Calculate cultural capital needed for next level
export const calculateNextLevelCapital = (currentLevel: number): number => {
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

// Get belt color for styling
export const getBeltColor = (belt: string): string => {
  const colors = {
    '金帯': '#FFD700',
    '赤帯': '#DC2626',
    '黒帯': '#1F2937',
    '茶帯': '#92400E',
    '紫帯': '#7C3AED',
    '青帯': '#2563EB',
    '緑帯': '#059669',
    '橙帯': '#EA580C',
    '黄帯': '#D97706',
    '白帯': '#6B7280'
  };
  
  return colors[belt as keyof typeof colors] || colors['白帯'];
};

// =============================================================================
// Local Storage Helpers
// =============================================================================

// Save data to localStorage with error handling
export const saveToLocalStorage = (key: string, data: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

// Load data from localStorage with error handling
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

// Remove item from localStorage
export const removeFromLocalStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
    return false;
  }
};
