
// ========================================
// Core Type Definitions
// ========================================

// User & Profile types
export interface UserStats {
  culturalCapital: number;
  totalNFTs: number;
  meditationStreak: number;
  totalWorshipSessions: number;
  level: number;
  experience?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  stats: UserStats;
  achievements: Achievement[];
  joinedAt: string;
}

// NFT & Shrine types
export interface NFT {
  id: string;
  name: string;
  type: 'torii' | 'roof' | 'pillar' | 'decoration' | 'ornament';
  emoji: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  color: string;
  power: number;
  description: string;
  timestamp: string;
  isOwned?: boolean;
  isStaked?: boolean;
}

export interface ShrinePixel {
  x: number;
  y: number;
  color: string;
  pixelData?: string;
  rarity?: string;
  nftId?: string;
}

export interface Shrine {
  id: string;
  name: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  position?: {
    lat: number;
    lng: number;
  };
  lat: number;
  lng: number;
  rarity: string;
  benefits: string[];
  distance?: number;
  visitCount?: number;
  isVisitedToday?: boolean;
}

// Session & Activity types
export interface WorshipSession {
  id: string;
  duration: number;
  sound: string;
  location?: { lat: number; lng: number };
  weather: string;
  timeOfDay: string;
  rewards: SessionRewards;
  completedAt: string;
}

export interface SessionRewards {
  culturalCapital: number;
  experience: number;
  bonus?: {
    seasonal: number;
    weather: number;
    timeOfDay: number;
  };
  nfts?: any[];
  achievements?: any[];
  omikujiResult?: string;
  droppedNFT?: NFT;
}

// Mission & Achievement types
export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number | string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  progress?: number;
  maxProgress?: number;
  total?: number;
  completed?: boolean;
  expiresAt?: string;
  icon?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

// NFTItem type for shrine building - 統一された型定義
export interface NFTItem {
  id: string;
  name: string;
  type: 'torii' | 'roof' | 'pillar' | 'decoration' | 'ornament' | 'nature' | 'guardian' | 'sacred' | 'structure' | 'terrain' | 'ritual' | 'boundary' | 'approach' | 'central' | 'landscape';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  power: number;
  emoji: string;
  pixelData?: string;
  color: string;
  description: string;
  isOwned?: boolean;
  animation?: 'glow' | 'pulse' | 'swing' | 'float' | 'spiral' | 'none';
  timestamp?: number;
}

export interface ShrineNFTItem extends NFTItem {}

// Game mechanics types
export interface SeasonalEvent {
  name: string;
  bonus: number;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface RankInfo {
  rank: string;
  requiredCapital: number;
  benefits: string[];
  color: string;
}

// App navigation types
export type TabType = 'worship' | 'explore' | 'myshrine' | 'profile';

export interface TabConfig {
  id: TabType;
  icon: string;
  label: string;
  component: React.ComponentType;
}

// Web3 & Blockchain types
export interface Web3Config {
  chainId: number;
  rpcUrl: string;
  contractAddress: string;
  explorerUrl: string;
}

export interface TransactionResult {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: number;
  timestamp: string;
}

// Map & Location types
export interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  type: 'shrine' | 'landmark' | 'user';
  info?: any;
}

// API & Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Event types
export interface CustomEvent<T = any> {
  type: string;
  detail: T;
  timestamp: string;
}

// Common utility types
export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;
export type EventHandler<T = Event> = (event: T) => void;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;
