// 神社・寺院の参拝活動
export const CULTURAL_ACTIVITIES = {
  shrine: { emoji: '⛩️', name: '神社参拝', exp: 50, building: 'torii' },
  temple: { emoji: '🏛️', name: '寺院参拝', exp: 50, building: 'pagoda' }
};

// 建物のレベルと外観（神社・寺院のみ）
export const BUILDING_LEVELS = {
  torii: ['⛩️', '🏮⛩️', '🏮⛩️🏮', '✨⛩️✨'],
  pagoda: ['🏛️', '🏯', '🏯🌸', '🏯🌸✨']
};

// 建物タイプ（神社・寺院のみ）
export const BUILDING_TYPES = {
  SHRINE: {
    id: 'shrine',
    name: '神社',
    cost: 1000,
    benefits: { blessingsPerHour: 5, culturalBonus: 1.5 },
    description: '神道の聖地。神々への祈りを捧げる場所'
  },
  TEMPLE: {
    id: 'temple', 
    name: '寺院',
    cost: 1200,
    benefits: { wisdomPerHour: 3, experienceBonus: 1.3 },
    description: '仏教の修行の場。心の平安と学びを得る場所'
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