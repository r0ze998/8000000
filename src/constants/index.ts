// =============================================================================
// Application Constants
// =============================================================================

export const APP_NAME = '神社参拝';
export const APP_VERSION = '1.0.0';

// Session configuration
export const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Prayer durations (in seconds)
export const PRAYER_DURATIONS = [
  { label: '1分', value: 60 },
  { label: '3分', value: 180 },
  { label: '5分', value: 300 },
  { label: '10分', value: 600 },
  { label: '15分', value: 900 },
  { label: '30分', value: 1800 }
];

// NFT rarity levels
export const NFT_RARITIES = {
  COMMON: 'common',
  RARE: 'rare', 
  EPIC: 'epic',
  LEGENDARY: 'legendary'
} as const;

// Prayer types
export const PRAYER_TYPES = {
  MEDITATION: 'meditation',
  GRATITUDE: 'gratitude',
  BREATHING: 'breathing',
  REFLECTION: 'reflection'
} as const;

// Canvas dimensions
export const CANVAS_SIZE = {
  WIDTH: 16,
  HEIGHT: 16,
  PIXEL_SIZE: 20
} as const;

// Animation types
export const ANIMATIONS = {
  NONE: 'none',
  PULSE: 'pulse',
  GLOW: 'glow',
  SPARKLE: 'sparkle'
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'shrine_user_profile',
  PRAYER_HISTORY: 'shrine_prayer_history',
  NFT_COLLECTION: 'shrine_nft_collection',
  SHRINE_CANVAS: 'shrine_canvas',
  SESSION: 'shrine_session',
  SESSION_TIME: 'shrine_session_time',
  ONBOARDING_COMPLETED: 'shrine_onboarding_completed'
} as const;