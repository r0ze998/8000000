/**
 * BGM Configuration
 * 瞑想・リラクゼーション用の音楽トラック設定
 */

export const bgmTracks = {
  forest: { 
    name: '森の音', 
    emoji: '🌲', 
    description: '自然の音で心を落ち着かせる',
    file: '/audio/forest.mp3'
  },
  temple: { 
    name: '寺院の鐘', 
    emoji: '🔔', 
    description: '厳かな鐘の音',
    file: '/audio/temple.mp3'
  },
  rain: { 
    name: '雨の音', 
    emoji: '🌧️', 
    description: '静寂な雨音',
    file: '/audio/rain.mp3'
  },
  wind: { 
    name: '風の音', 
    emoji: '🍃', 
    description: '清々しい風の音',
    file: '/audio/wind.mp3'
  },
  meditation: { 
    name: '瞑想音楽', 
    emoji: '🧘', 
    description: '深い瞑想のための音楽',
    file: '/audio/meditation.mp3'
  }
};

export const defaultBGMSettings = {
  currentTrack: 'forest',
  isPlaying: false,
  volume: 0.3
};