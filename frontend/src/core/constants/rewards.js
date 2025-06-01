// 御朱印のレア度定義
export const GOSHUIN_RARITIES = {
  COMMON: {
    id: 'common',
    name: '通常',
    probability: 0.70,
    color: '#808080',
    points: 10,
    effects: []
  },
  UNCOMMON: {
    id: 'uncommon',
    name: '良',
    probability: 0.20,
    color: '#1E90FF',
    points: 25,
    effects: ['blessing_boost_10']
  },
  RARE: {
    id: 'rare',
    name: '稀',
    probability: 0.075,
    color: '#9370DB',
    points: 50,
    effects: ['blessing_boost_25', 'exp_boost_20']
  },
  EPIC: {
    id: 'epic',
    name: '極',
    probability: 0.020,
    color: '#FFD700',
    points: 100,
    effects: ['blessing_boost_50', 'exp_boost_40', 'special_title']
  },
  LEGENDARY: {
    id: 'legendary',
    name: '伝説',
    probability: 0.005,
    color: '#FF6347',
    points: 500,
    effects: ['blessing_boost_100', 'exp_boost_100', 'legendary_title', 'guardian_blessing']
  }
};

// 祈願札の種類
export const PRAYER_CARDS = {
  health: {
    id: 'health',
    name: '健康祈願',
    icon: '🏥',
    description: '無病息災を願う',
    weight: 30
  },
  business: {
    id: 'business',
    name: '商売繁盛',
    icon: '💰',
    description: '事業の成功を願う',
    weight: 25
  },
  study: {
    id: 'study',
    name: '学業成就',
    icon: '📚',
    description: '学問の向上を願う',
    weight: 20
  },
  love: {
    id: 'love',
    name: '縁結び',
    icon: '❤️',
    description: '良縁を願う',
    weight: 15
  },
  safety: {
    id: 'safety',
    name: '交通安全',
    icon: '🚗',
    description: '安全な移動を願う',
    weight: 10
  }
};

// 特別な祝福（レア報酬）
export const SPECIAL_BLESSINGS = {
  golden_week: {
    id: 'golden_week',
    name: '黄金週間の祝福',
    period: { month: 5, days: [1, 2, 3, 4, 5] },
    multiplier: 2.0,
    description: 'ゴールデンウィーク限定の特別な祝福'
  },
  full_moon: {
    id: 'full_moon',
    name: '満月の祝福',
    condition: 'full_moon',
    multiplier: 1.5,
    description: '満月の夜にのみ得られる神秘的な力'
  },
  early_morning: {
    id: 'early_morning',
    name: '朝詣での祝福',
    condition: { hour: { min: 5, max: 7 } },
    multiplier: 1.3,
    description: '早朝の清らかな時間の特別な恩恵'
  },
  hundred_visits: {
    id: 'hundred_visits',
    name: '百度参りの証',
    condition: { totalVisits: 100 },
    multiplier: 3.0,
    description: '100回参拝達成の偉業'
  }
};

// ストリークボーナス
export const STREAK_BONUSES = [
  { days: 7, multiplier: 1.2, badge: 'week_warrior' },
  { days: 30, multiplier: 1.5, badge: 'month_master' },
  { days: 100, multiplier: 2.0, badge: 'century_champion' },
  { days: 365, multiplier: 3.0, badge: 'year_legend' }
];

// 村ランキング報酬
export const VILLAGE_REWARDS = {
  weekly_top: {
    rank: 1,
    title: '週間守護村',
    culturalPoints: 1000,
    specialBadge: 'weekly_champion'
  },
  weekly_top3: {
    rank: 3,
    title: '優秀村',
    culturalPoints: 500,
    specialBadge: 'weekly_excellent'
  },
  weekly_top10: {
    rank: 10,
    title: '活躍村',
    culturalPoints: 200,
    specialBadge: 'weekly_active'
  }
};

// 報酬計算用の定数
export const REWARD_MULTIPLIERS = {
  basePoints: 10,
  shrineTypeBonus: {
    major: 2.0,
    temple: 1.5,
    local: 1.0
  },
  timeBonus: {
    early_morning: 1.3,
    morning: 1.1,
    afternoon: 1.0,
    evening: 1.1,
    night: 0.8
  },
  weatherBonus: {
    sunny: 1.0,
    cloudy: 0.9,
    rainy: 1.2, // 雨の日ボーナス
    snowy: 1.5  // 雪の日ボーナス
  }
};