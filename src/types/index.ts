
// =============================================================================
// Core Types
// =============================================================================

export interface User {
  id: string;
  name: string;
  level: number;
  experience: number;
  culturalCapital: number;
  visitCount: number;
  streakDays: number;
  totalPrayerTime: number;
  joinedAt: Date;
}

export interface UserStats {
  level: number;
  experience: number;
  culturalCapital: number;
  visitCount: number;
  streakDays: number;
  totalPrayerTime: number;
  consecutiveDays: number;
  currentStreak: number;
  longestStreak: number;
  totalNFTs: number;
  meditationStreak: number;
  totalWorshipSessions: number;
  achievements: Achievement[];
  lastVisitDate: Date | null;
}

// =============================================================================
// Location & Geography
// =============================================================================

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Position {
  lat: number;
  lng: number;
}

// =============================================================================
// Shrine Types
// =============================================================================

export type ShrineRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Shrine {
  id: string;
  name: string;
  location: Location;
  rarity: ShrineRarity;
  description: string;
  benefits: string[];
  distance: number;
  isVisitedToday: boolean;
  position?: Position;
}

// =============================================================================
// NFT Types
// =============================================================================

export type NFTRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface NFTItem {
  id: string;
  name: string;
  description: string;
  rarity: NFTRarity;
  category?: string;
  type?: string;
  svgData?: string;
  pixelData?: string;
  color: string;
  power?: number;
  isOwned?: boolean;
  animation?: string;
  emoji?: string;
  timestamp?: number;
  obtainedAt?: Date;
  shrineId?: string;
  traits?: NFTTrait[];
}

export interface NFTTrait {
  trait_type: string;
  value: string;
  rarity?: NFTRarity;
}

export interface NFTPart {
  id: string;
  name: string;
  category: string;
  rarity: NFTRarity;
  svgPath: string;
  color?: string;
}

// =============================================================================
// Mission & Reward Types
// =============================================================================

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  requirements: MissionRequirement[];
  rewards: Reward[];
  isCompleted: boolean;
  progress: number;
  maxProgress: number;
  total: number;
  reward: number;
  icon: string;
  completed: boolean;
  expiresAt?: Date;
}

export interface MissionRequirement {
  type: 'visit_shrine' | 'pray_duration' | 'consecutive_days' | 'collect_nft';
  target: number;
  current: number;
}

export interface Reward {
  type: 'experience' | 'cultural_capital' | 'nft' | 'item';
  amount?: number;
  itemId?: string;
}

// =============================================================================
// Prayer & Worship Types
// =============================================================================

export interface PrayerSession {
  id: string;
  shrineId: string;
  duration: number;
  type: string;
  startTime: Date;
  endTime: Date;
  rewards: Reward[];
}

export interface WorshipSession {
  id: string;
  userId: string;
  shrineId: string;
  duration: number;
  prayerType: string;
  startedAt: Date;
  completedAt?: Date;
  rewards?: Reward[];
  experience: number;
  culturalCapital: number;
}

// =============================================================================
// Event & Season Types
// =============================================================================

export interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  bonusMultiplier: number;
  specialRewards: Reward[];
  isActive: boolean;
}

export interface Weather {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  temperature: number;
  bonus: number;
}

// =============================================================================
// Game Mechanics Types
// =============================================================================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface CulturalBelt {
  name: string;
  minCapital: number;
  maxCapital: number;
  color: string;
  benefits: string[];
}

// =============================================================================
// UI & Component Types
// =============================================================================

export interface TabConfig {
  id: string;
  icon: string;
  label: string;
  component: React.ComponentType;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// =============================================================================
// API & Service Types
// =============================================================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ShrineAPIData {
  shrines: Shrine[];
  userLocation: Position;
  lastUpdated: Date;
}
