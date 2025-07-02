// Core Types
export interface Shrine {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  tier: 'mythical' | 'legendary' | 'historic' | 'rare' | 'common';
  prefecture: string;
  description?: string;
}

export interface Visit {
  id: string;
  shrineId: string;
  timestamp: Date;
  method: 'gps' | 'qr' | 'manual';
  rewards: Reward[];
}

export interface Reward {
  id: string;
  type: 'goshuin' | 'blessing' | 'points';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  metadata: Record<string, any>;
}

export interface UserProfile {
  id: string;
  walletAddress?: string;
  culturalRank: CulturalRank;
  totalVisits: number;
  streak: number;
  achievements: Achievement[];
}

export interface CulturalRank {
  belt: 'white' | 'yellow' | 'orange' | 'green' | 'blue' | 'purple' | 'brown' | 'black' | 'red' | 'gold';
  points: number;
  level: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: Date;
  icon: string;
}