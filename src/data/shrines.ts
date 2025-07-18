
import { Shrine, Mission, NFTItem } from '../types';

export const shrines: Shrine[] = [
  {
    id: 'meiji_jingu',
    name: '明治神宮',
    location: { 
      lat: 35.6762, 
      lng: 139.6993, 
      address: '東京都渋谷区代々木神園町1-1',
      prefecture: '東京都'
    },
    rarity: 'legendary',
    description: '明治天皇と昭憲皇太后を祀る神社',
    benefits: ['恋愛成就', '家内安全', '厄除け'],
    distance: 0.3,
    isVisitedToday: false,
    visitCount: 0
  },
  {
    id: 'yasukuni_jinja',
    name: '靖国神社',
    location: { 
      lat: 35.6939, 
      lng: 139.7442, 
      address: '東京都千代田区九段北3-1-1',
      prefecture: '東京都'
    },
    rarity: 'epic',
    description: '戦没者を祀る神社',
    benefits: ['平和祈願', '国家安泰'],
    distance: 0.8,
    isVisitedToday: true,
    visitCount: 5
  },
  {
    id: 'hie_jinja',
    name: '日枝神社',
    location: { 
      lat: 35.6741, 
      lng: 139.7404, 
      address: '東京都千代田区永田町2-10-5',
      prefecture: '東京都'
    },
    rarity: 'rare',
    description: '江戸三大祭りの一つ、山王祭で有名',
    benefits: ['出世祈願', '縁結び'],
    distance: 1.2,
    isVisitedToday: false,
    visitCount: 2
  },
  {
    id: 'sensoji',
    name: '浅草寺',
    location: { 
      lat: 35.7148, 
      lng: 139.7967, 
      address: '東京都台東区浅草2-3-1',
      prefecture: '東京都'
    },
    rarity: 'epic',
    description: '東京最古の寺院',
    benefits: ['商売繁盛', '学業成就'],
    distance: 0.8,
    isVisitedToday: false,
    visitCount: 3
  }
];

export const sampleShrines = shrines;

export const dailyMissions: Mission[] = [
  {
    id: 'daily-visit',
    title: '朝の参拝',
    description: '午前中に神社を参拝する',
    type: 'daily',
    progress: 0,
    total: 1,
    reward: 50,
    icon: '🌅',
    completed: false,
    requirements: [
      {
        type: 'visit_shrine',
        target: 1,
        current: 0
      }
    ],
    rewards: [
      {
        type: 'cultural_capital',
        amount: 50
      },
      {
        type: 'experience',
        amount: 25
      }
    ],
    isCompleted: false,
    maxProgress: 1
  },
  {
    id: 'consecutive',
    title: '連続参拝',
    description: '7日連続で参拝を続ける',
    type: 'daily',
    progress: 7,
    total: 7,
    reward: 100,
    icon: '🔥',
    completed: true,
    requirements: [
      {
        type: 'consecutive_days',
        target: 7,
        current: 7
      }
    ],
    rewards: [
      {
        type: 'cultural_capital',
        amount: 100
      },
      {
        type: 'experience',
        amount: 50
      }
    ],
    isCompleted: true,
    maxProgress: 7
  },
  {
    id: 'explore',
    title: '新しい神社発見',
    description: '未訪問の神社を1つ発見する',
    type: 'daily',
    progress: 0,
    total: 1,
    reward: 100,
    icon: '🗺️',
    completed: false,
    requirements: [
      {
        type: 'visit_shrine',
        target: 1,
        current: 0
      }
    ],
    rewards: [
      {
        type: 'cultural_capital',
        amount: 100
      },
      {
        type: 'experience',
        amount: 50
      }
    ],
    isCompleted: false,
    maxProgress: 1
  }
];

export const sampleNFTs: NFTItem[] = [
  // 地形パーツ
  {
    id: 'grass-1',
    name: '草原',
    type: 'terrain',
    rarity: 'common',
    power: 20,
    pixelData: '🌱',
    color: '#90EE90',
    isOwned: true,
    animation: 'float',
    emoji: '🌱',
    description: '豊かな緑の草原',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'water-1',
    name: '水辺',
    type: 'terrain',
    rarity: 'common',
    power: 25,
    pixelData: '🌊',
    color: '#4682B4',
    isOwned: true,
    animation: 'pulse',
    emoji: '🌊',
    description: '澄んだ水の流れ',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'rock-1',
    name: '岩石',
    type: 'terrain',
    rarity: 'common',
    power: 15,
    pixelData: '🪨',
    color: '#8B7355',
    isOwned: true,
    animation: 'none',
    emoji: '🪨',
    description: '風化した岩石',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'sand-1',
    name: '砂浜',
    type: 'terrain',
    rarity: 'common',
    power: 18,
    pixelData: '🏖️',
    color: '#F4A460',
    isOwned: true,
    animation: 'none',
    emoji: '🏖️',
    description: '柔らかい砂の浜辺',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'snow-1',
    name: '雪原',
    type: 'terrain',
    rarity: 'rare',
    power: 60,
    pixelData: '❄️',
    color: '#F0F8FF',
    isOwned: true,
    animation: 'glow',
    emoji: '❄️',
    description: '雪に覆われた大地',
    timestamp: Date.now(),
    attributes: {}
  },

  // 建物・構造物
  {
    id: 'torii-1',
    name: '黄金の鳥居',
    type: 'structure',
    rarity: 'legendary',
    power: 500,
    pixelData: '⛩️',
    color: '#FFD700',
    isOwned: true,
    animation: 'glow',
    emoji: '⛩️',
    description: '神聖な黄金の鳥居',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'shrine-1',
    name: '本殿',
    type: 'structure',
    rarity: 'epic',
    power: 300,
    pixelData: '🏛️',
    color: '#CD853F',
    isOwned: true,
    animation: 'pulse',
    emoji: '🏛️',
    description: '神社の中心となる神聖な建物',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'pagoda-1',
    name: '五重塔',
    type: 'structure',
    rarity: 'legendary',
    power: 600,
    pixelData: '🗼',
    color: '#B8860B',
    isOwned: true,
    animation: 'glow',
    emoji: '🗼',
    description: '伝統的な五重の塔',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'house-1',
    name: '茅葺き屋根',
    type: 'structure',
    rarity: 'rare',
    power: 150,
    pixelData: '🏠',
    color: '#8B4513',
    isOwned: true,
    animation: 'none',
    emoji: '🏠',
    description: '昔ながらの茅葺き屋根の家',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'bridge-1',
    name: '太鼓橋',
    type: 'structure',
    rarity: 'epic',
    power: 250,
    pixelData: '🌉',
    color: '#D2691E',
    isOwned: true,
    animation: 'swing',
    emoji: '🌉',
    description: '美しいアーチを描く太鼓橋',
    timestamp: Date.now(),
    attributes: {}
  },

  // 自然要素
  {
    id: 'sakura-1',
    name: '桜の木',
    type: 'nature',
    rarity: 'epic',
    power: 120,
    pixelData: '🌸',
    color: '#FFB6C1',
    isOwned: true,
    animation: 'float',
    emoji: '🌸',
    description: '美しく咲く桜の木',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'pine-1',
    name: '松の木',
    type: 'nature',
    rarity: 'rare',
    power: 80,
    pixelData: '🌲',
    color: '#228B22',
    isOwned: true,
    animation: 'swing',
    emoji: '🌲',
    description: '常緑の美しい松の木',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'bamboo-1',
    name: '竹林',
    type: 'nature',
    rarity: 'rare',
    power: 75,
    pixelData: '🎋',
    color: '#9ACD32',
    isOwned: true,
    animation: 'swing',
    emoji: '🎋',
    description: '風に揺れる竹林',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'flower-1',
    name: '花畑',
    type: 'nature',
    rarity: 'common',
    power: 30,
    pixelData: '🌺',
    color: '#FF69B4',
    isOwned: true,
    animation: 'float',
    emoji: '🌺',
    description: '色とりどりの花畑',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'mountain-1',
    name: '霊峰',
    type: 'nature',
    rarity: 'legendary',
    power: 400,
    pixelData: '⛰️',
    color: '#696969',
    isOwned: true,
    animation: 'glow',
    emoji: '⛰️',
    description: '神聖な霊峰',
    timestamp: Date.now(),
    attributes: {}
  },

  // 装飾品
  {
    id: 'lantern-1',
    name: '提灯',
    type: 'decoration',
    rarity: 'common',
    power: 25,
    pixelData: '🏮',
    color: '#FF6B6B',
    isOwned: true,
    animation: 'swing',
    emoji: '🏮',
    description: '温かい光を放つ伝統的な提灯',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'lantern-stone',
    name: '石灯籠',
    type: 'decoration',
    rarity: 'rare',
    power: 60,
    pixelData: '🕯️',
    color: '#F5DEB3',
    isOwned: true,
    animation: 'glow',
    emoji: '🕯️',
    description: '神聖な石造りの灯籠',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'bell-1',
    name: '神社の鈴',
    type: 'decoration',
    rarity: 'epic',
    power: 50,
    pixelData: '🔔',
    color: '#FFD700',
    isOwned: true,
    animation: 'swing',
    emoji: '🔔',
    description: '清らかな音色を響かせる神聖な鈴',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'flag-1',
    name: '祈願旗',
    type: 'decoration',
    rarity: 'common',
    power: 20,
    pixelData: '🎌',
    color: '#FF4500',
    isOwned: true,
    animation: 'swing',
    emoji: '🎌',
    description: '風になびく縁起の良い旗',
    timestamp: Date.now(),
    attributes: {}
  },

  // 動物・守護者
  {
    id: 'fox-1',
    name: '稲荷狐',
    type: 'guardian',
    rarity: 'rare',
    power: 80,
    pixelData: '🦊',
    color: '#FF8C00',
    isOwned: true,
    animation: 'float',
    emoji: '🦊',
    description: '神の使いとされる賢い狐',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'dragon-1',
    name: '青龍',
    type: 'guardian',
    rarity: 'legendary',
    power: 200,
    pixelData: '🐉',
    color: '#4169E1',
    isOwned: true,
    animation: 'glow',
    emoji: '🐉',
    description: '東方を守護する神聖な龍',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'turtle-1',
    name: '玄武',
    type: 'guardian',
    rarity: 'epic',
    power: 150,
    pixelData: '🐢',
    color: '#2F4F4F',
    isOwned: true,
    animation: 'pulse',
    emoji: '🐢',
    description: '北方を守護する神聖な亀',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'bird-1',
    name: '朱雀',
    type: 'guardian',
    rarity: 'epic',
    power: 150,
    pixelData: '🦅',
    color: '#DC143C',
    isOwned: true,
    animation: 'float',
    emoji: '🦅',
    description: '南方を守護する神聖な鳥',
    timestamp: Date.now(),
    attributes: {}
  },

  // 特殊オブジェクト
  {
    id: 'stone-sacred',
    name: '御神体',
    type: 'sacred',
    rarity: 'legendary',
    power: 250,
    pixelData: '🗿',
    color: '#8B7355',
    isOwned: true,
    animation: 'glow',
    emoji: '🗿',
    description: '神が宿る神聖な石',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'crystal-1',
    name: '神秘の水晶',
    type: 'sacred',
    rarity: 'legendary',
    power: 300,
    pixelData: '💎',
    color: '#E6E6FA',
    isOwned: true,
    animation: 'glow',
    emoji: '💎',
    description: '神秘的な力を秘めた水晶',
    timestamp: Date.now(),
    attributes: {}
  },
  {
    id: 'portal-1',
    name: '異界の門',
    type: 'sacred',
    rarity: 'legendary',
    power: 350,
    pixelData: '🌀',
    color: '#9370DB',
    isOwned: true,
    animation: 'glow',
    emoji: '🌀',
    description: '異世界への扉を開く神秘の門',
    timestamp: Date.now(),
    attributes: {}
  }
];
