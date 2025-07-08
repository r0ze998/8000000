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
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
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