
// Core type definitions

// NFT related types
export interface NFTTemplate {
  id: string;
  name: string;
  type: string;
  emoji: string;
  rarity: NFTRarity;
}

export type NFTRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// NFT type alias for backwards compatibility
export type NFT = NFTItem;

export interface Shrine {
  id: string;
  name: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    prefecture: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  visitCount: number;
  lastVisit?: Date;
  image?: string;
  history?: string;
  deity?: string;
  festivals?: string[];
  benefits?: string[];
  distance?: number;
  isVisitedToday?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  level: number;
  experience: number;
  culturalCapital: number;
  streak: number;
  lastVisit?: Date;
  belt: string;
  achievements: Achievement[];
  nftCollection: NFTItem[];
  preferences: UserPreferences;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  profile: UserProfile;
}

export interface UserStats {
  level: number;
  experience: number;
  culturalCapital: number;
  streak: number;
  totalVisits: number;
  nftCount: number;
  totalNFTs: number;
  meditationStreak: number;
  totalWorshipSessions: number;
}

export interface UserPreferences {
  notifications: boolean;
  soundEnabled: boolean;
  preferredPrayerDuration: number;
  favoriteDeities: string[];
  theme: 'light' | 'dark' | 'auto';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface NFTItem {
  id: string;
  name: string;
  type: 'goshuin' | 'omikuji' | 'spirit' | 'blessing' | 'protection' | 'wisdom' | 'fortune' | 'terrain' | 'structure' | 'nature' | 'decoration' | 'guardian' | 'sacred';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  power?: number;
  description: string;
  emoji: string;
  color: string;
  timestamp: number;
  shrineId?: string;
  attributes: Record<string, any>;
  // 神社建設用の追加プロパティ
  pixelData?: string;
  animation?: 'none' | 'pulse' | 'glow' | 'float' | 'swing' | 'sparkle';
  isOwned?: boolean;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  progress: number;
  total: number;
  reward: number;
  icon: string;
  completed: boolean;
  requirements: Array<{
    type: string;
    target: number;
    current: number;
  }>;
  rewards: Array<{
    type: string;
    amount: number;
  }>;
  isCompleted: boolean;
  maxProgress: number;
}

export interface PrayerSession {
  id: string;
  type: string;
  duration: number;
  startTime: number;
  endTime: number;
  shrineId: string;
  rewards: {
    culturalCapital: number;
    experience: number;
    specialBonus?: {
      type: string;
      value: number;
      description: string;
    };
  };
  nftDrops?: NFTItem[];
}

export interface OmikujiResult {
  id: string;
  result: '大吉' | '中吉' | '吉' | '小吉' | '末吉' | '凶';
  message: string;
  advice: string;
  timestamp: number;
  shrineId: string;
  nftDrop?: NFTItem;
}

export interface VisitRecord {
  id: string;
  shrineId: string;
  timestamp: number;
  duration?: number;
  prayerType?: string;
  rewards: {
    culturalCapital: number;
    experience: number;
  };
  weather?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface GameState {
  userProfile: UserProfile;
  visitHistory: VisitRecord[];
  omikujiHistory: OmikujiResult[];
  currentStreak: number;
  seasonalEvents: Array<{
    name: string;
    bonus: number;
    icon?: string;
    description?: string;
  }>;
}

// StarkNet related types
export interface StarkNetConfig {
  rpcUrl: string;
  chainId: string;
  contractAddress?: string;
}

export interface ContractInteraction {
  functionName: string;
  parameters: any[];
  gasLimit?: number;
}

// Component prop types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  timestamp: number;
}
