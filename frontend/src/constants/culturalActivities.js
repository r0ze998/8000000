// 文化活動の定数
export const CULTURAL_ACTIVITIES = {
  shrine: { emoji: '⛩️', name: '神社参拝', exp: 50, building: 'torii' },
  temple: { emoji: '🏛️', name: '寺院参拝', exp: 50, building: 'pagoda' },
  festival: { emoji: '🎋', name: '祭り・伝統行事', exp: 70, building: 'yagura' },
  craft: { emoji: '🎨', name: '伝統工芸体験', exp: 60, building: 'workshop' },
  tea: { emoji: '🍵', name: '茶道・華道', exp: 40, building: 'teahouse' },
  garden: { emoji: '🌸', name: '庭園散策', exp: 30, building: 'garden' },
  history: { emoji: '📜', name: '歴史探訪', exp: 45, building: 'museum' },
  onsen: { emoji: '♨️', name: '温泉文化', exp: 35, building: 'bathhouse' }
};

// 建物のレベルと外観
export const BUILDING_LEVELS = {
  torii: ['⛩️', '🏮⛩️', '🏮⛩️🏮', '✨⛩️✨'],
  pagoda: ['🏛️', '🏯', '🏯🌸', '🏯🌸✨'],
  yagura: ['🎪', '🎊🎪', '🎊🎪🎊', '🎆🎪🎆'],
  workshop: ['🏚️', '🏠', '🏡', '🏘️'],
  teahouse: ['🍵', '🏠🍵', '🏡🍵', '🏯🍵'],
  garden: ['🌱', '🌿', '🌸🌿', '🌸🌺🌿'],
  museum: ['📜', '🏛️📜', '🏛️📜🖼️', '🏛️✨📜✨'],
  bathhouse: ['♨️', '🏠♨️', '🏯♨️', '🏯♨️✨']
};

// 建物タイプ
export const BUILDING_TYPES = {
  SHRINE: {
    id: 'shrine',
    name: '大神社',
    cost: 1000,
    benefits: { blessingsPerHour: 5, culturalBonus: 1.5 },
    description: '村の中心となる大きな神社'
  },
  TEMPLE: {
    id: 'temple', 
    name: '仏閣',
    cost: 1200,
    benefits: { wisdomPerHour: 3, experienceBonus: 1.3 },
    description: '静寂と学びの場'
  },
  TEAHOUSE: {
    id: 'teahouse',
    name: '茶室',
    cost: 800,
    benefits: { harmonyPerHour: 4, socialBonus: 1.2 },
    description: '文化交流の場'
  },
  GARDEN: {
    id: 'garden',
    name: '庭園',
    cost: 600,
    benefits: { beautyPerHour: 2, visitorBonus: 1.1 },
    description: '四季の美しさを楽しむ'
  },
  WORKSHOP: {
    id: 'workshop',
    name: '工房',
    cost: 900,
    benefits: { craftPerHour: 3, itemQuality: 1.4 },
    description: '伝統工芸の継承'
  },
  MARKET: {
    id: 'market',
    name: '市場',
    cost: 700,
    benefits: { goldPerHour: 10, tradeBonus: 1.3 },
    description: '地域の特産品を販売'
  }
};

// 検証設定
export const VERIFICATION_CONFIG = {
  GPS_RADIUS_METERS: 500,
  PHOTO_MAX_SIZE_MB: 10,
  VERIFICATION_METHODS: {
    PHOTO: 'photo',
    GPS: 'gps'
  }
};