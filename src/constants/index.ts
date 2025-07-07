
// ========================================
// Application Constants
// ========================================

// Game configuration
export const GAME_CONFIG = {
  MAX_SHRINE_LEVEL: 10,
  BASE_CULTURAL_CAPITAL_RATE: 10,
  CANVAS_SIZE: 12,
  MAX_MEDITATION_DURATION: 3600, // 1 hour
  MIN_MEDITATION_DURATION: 60,   // 1 minute
} as const;

// Rarity configuration
export const RARITY_CONFIG = {
  COMMON: { multiplier: 1, color: '#94a3b8', dropRate: 0.6 },
  UNCOMMON: { multiplier: 1.5, color: '#22d3ee', dropRate: 0.25 },
  RARE: { multiplier: 2, color: '#a855f7', dropRate: 0.1 },
  EPIC: { multiplier: 3, color: '#f59e0b', dropRate: 0.04 },
  LEGENDARY: { multiplier: 5, color: '#ef4444', dropRate: 0.01 },
} as const;

// NFT types
export const NFT_TYPES = {
  TORII: { emoji: '⛩️', name: '鳥居', colors: ['#FFD700', '#DC2626', '#8B4513'] },
  ROOF: { emoji: '🏯', name: '屋根', colors: ['#DC2626', '#8B4513', '#059669'] },
  PILLAR: { emoji: '🪵', name: '柱', colors: ['#8B4513', '#92400E', '#451A03'] },
  DECORATION: { emoji: '🌸', name: '桜装飾', colors: ['#FFB7C5', '#F472B6', '#EC4899'] },
  ORNAMENT: { emoji: '🎋', name: '装飾品', colors: ['#10B981', '#059669', '#047857'] },
} as const;

// Cultural ranks
export const CULTURAL_RANKS = [
  { rank: '初心者', min: 0, max: 49, color: '#9CA3AF' },
  { rank: '参拝者', min: 50, max: 199, color: '#60A5FA' },
  { rank: '修行者', min: 200, max: 499, color: '#A78BFA' },
  { rank: '賢者', min: 500, max: 999, color: '#FBBF24' },
  { rank: '聖者', min: 1000, max: Infinity, color: '#F87171' },
] as const;

// Seasonal events
export const SEASONAL_EVENTS = {
  SPRING: { name: '春祭り', bonus: 1.2, months: [3, 4, 5] },
  SUMMER: { name: '夏祭り', bonus: 1.3, months: [6, 7, 8] },
  AUTUMN: { name: '秋祭り', bonus: 1.1, months: [9, 10, 11] },
  WINTER: { name: '冬祭り', bonus: 1.4, months: [12, 1, 2] },
} as const;

// Sound options
export const SOUND_OPTIONS = [
  { key: 'bell', label: '🔔 鈴', name: '鈴の音' },
  { key: 'nature', label: '🌿 自然音', name: '森の音' },
  { key: 'water', label: '💧 水音', name: '川のせせらぎ' },
  { key: 'silence', label: '🤫 無音', name: '静寂' },
] as const;

// Duration options (in seconds)
export const DURATION_OPTIONS = [60, 180, 300, 600, 900] as const;

// Local storage keys
export const STORAGE_KEYS = {
  SHRINE_CANVAS: 'shrineCanvas',
  SHRINE_NFTS: 'shrineNFTs',
  STAKED_NFTS: 'stakedNFTs',
  USER_STATS: 'userStats',
  USER_PROFILE: 'userProfile',
  COMPLETED_MISSIONS: 'completedMissions',
  ACHIEVEMENTS: 'achievements',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  MINT_NFT: '/nft/mint',
  GET_PROFILE: '/user/profile',
  UPDATE_STATS: '/user/stats',
  GET_SHRINES: '/shrines',
} as const;

// Map configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 35.6762, lng: 139.6503 }, // Tokyo
  DEFAULT_ZOOM: 12,
  MARKER_COLORS: {
    shrine: '#FF6B6B',
    user: '#4ECDC4',
    landmark: '#45B7D1',
  },
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000,
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
} as const;
