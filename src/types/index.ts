// =============================================================================
// Core Types
// =============================================================================

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  level: number;
  experience: number;
  culturalCapital: number;
  visitCount: number;
  streakDays: number;
  totalPrayerTime: number;
  joinedAt: Date;
}

export interface UserStats {
  culturalCapital: number;
  totalNFTs: number;
  visitCount: number;
  streakDays: number;
  totalPrayerTime: number;
  level: number;
}

export interface NFTItem {
  id: string;
  name: string;
  rarity: string;
  imageUrl: string;
  description: string;
  attributes: Record<string, any>;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
}

export interface Shrine {
  id: string;
  name: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  deity: string;
  category: string;
  established?: Date;
  imageUrl?: string;
  visitCount: number;
  blessing: string[];
}

// =============================================================================
// NFT & Collectibles
// =============================================================================

export interface NFTMetadata {
  id: string;
  name: string;
  description: string;
  type: 'terrain' | 'structure' | 'decoration' | 'effect';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  power: number;
  pixelData: string;
  color: string;
  emoji: string;
  animation?: 'none' | 'pulse' | 'glow' | 'sparkle';
  isOwned: boolean;
  timestamp?: number;
}

export interface CanvasPixel {
  x: number;
  y: number;
  nftId: string;
  placedAt: Date;
}

// =============================================================================
// Prayer & Worship
// =============================================================================

export interface PrayerSession {
  id: string;
  type: 'meditation' | 'gratitude' | 'breathing' | 'reflection';
  duration: number; // seconds
  startTime: Date;
  endTime?: Date;
  quality: number; // 1-10
  notes?: string;
  shrineId?: string;
}

export interface PrayerType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  defaultDuration: number;
  benefits: string[];
}

export interface BreathingPattern {
  inhale: number;
  hold: number;
  exhale: number;
  rest: number;
}

// =============================================================================
// Account Abstraction & Blockchain
// =============================================================================

export interface AccountAbstractionState {
  account: any;
  isReady: boolean;
  address: string | null;
  provider: any;
  sessionId: string | null;
}

// =============================================================================
// UI & Component Props
// =============================================================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface StatBubbleProps {
  icon: string;
  value: number | string;
  label: string;
  variant?: 'default' | 'focus' | 'streak' | 'level';
}

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

// =============================================================================
// Application State
// =============================================================================

export interface AppState {
  user: User | null;
  currentShrine: Shrine | null;
  activePrayerSession: PrayerSession | null;
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}