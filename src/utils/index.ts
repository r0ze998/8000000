
// =============================================================================
// Utility Functions Index
// =============================================================================

// Re-export all utilities
export * from './formatUtils';
export * from './nftUtils';
export * from './gameUtils';
export * from './starknet';

// =============================================================================
// Common Utility Functions
// =============================================================================

// Debug logging function
export const debugLog = (message: string, ...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, ...args);
  }
};

// Check if string is empty or only whitespace
export const isEmpty = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0;
};

// Clamp a number between min and max values
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// Generate random number between min and max (inclusive)
export const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

// Debounce function
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

// Deep clone object
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    Object.keys(obj).forEach(key => {
      (clonedObj as any)[key] = deepClone((obj as any)[key]);
    });
    return clonedObj;
  }
  return obj;
};

// =============================================================================
// LocalStorage Utilities
// =============================================================================

// Save data to localStorage
export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Load data from localStorage
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

// =============================================================================
// Prayer and Game Mechanics
// =============================================================================

// Calculate base reward for worship
export const calculateBaseReward = (duration: number, prayerType?: string) => {
  const baseRate = 10; // Base cultural capital per minute
  const minutes = duration / 60;

  let multiplier = 1;
  if (prayerType === 'deep') multiplier = 1.5;
  else if (prayerType === 'gratitude') multiplier = 1.2;
  else if (prayerType === 'healing') multiplier = 1.3;

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

// Get time of day
export const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

// Get random weather
export const getRandomWeather = () => {
  const conditions = [
    { condition: 'sunny', bonus: 10, icon: '☀️' },
    { condition: 'cloudy', bonus: 5, icon: '☁️' },
    { condition: 'rainy', bonus: 15, icon: '🌧️' },
    { condition: 'snowy', bonus: 20, icon: '❄️' }
  ];
  return conditions[Math.floor(Math.random() * conditions.length)];
};

// Get time-based bonus
export const getTimeBonus = (): number => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour <= 9) return 1.2; // Morning bonus
  if (hour >= 17 && hour <= 19) return 1.1; // Evening bonus
  return 1;
};

// Check if location is near shrine
export const isNearShrine = (userLocation: { lat: number; lng: number }, shrineLocation: { lat: number; lng: number }): boolean => {
  const distance = getDistance(userLocation, shrineLocation);
  return distance <= 100; // Within 100 meters
};

// Calculate distance between two coordinates
export const getDistance = (pos1: { lat: number; lng: number }, pos2: { lat: number; lng: number }): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = pos1.lat * Math.PI / 180;
  const φ2 = pos2.lat * Math.PI / 180;
  const Δφ = (pos2.lat - pos1.lat) * Math.PI / 180;
  const Δλ = (pos2.lng - pos1.lng) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

// =============================================================================
// Data Validation
// =============================================================================

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate Japanese phone number
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+81|0)\d{1,4}-?\d{1,4}-?\d{4}$/;
  return phoneRegex.test(phone);
};

// Sanitize HTML string
export const sanitizeHTML = (str: string): string => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};
