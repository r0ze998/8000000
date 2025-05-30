// 神社村建設システム - 箱庭的な国造り要素

// 建設可能な建物タイプ
export const BUILDING_TYPES = {
  // 神社建築
  shrine: {
    torii: {
      name: '鳥居',
      category: 'shrine',
      cost: { wood: 10, stone: 5, faith: 20 },
      size: { width: 2, height: 1 },
      unlockLevel: 0,
      description: '神域への入り口となる神聖な門',
      variants: ['classic', 'vermillion', 'golden', 'ancient']
    },
    mainHall: {
      name: '本殿',
      category: 'shrine',
      cost: { wood: 30, stone: 20, gold: 10, faith: 100 },
      size: { width: 3, height: 3 },
      unlockLevel: 2,
      description: '御神体を祀る神社の中心建築',
      variants: ['traditional', 'imperial', 'mountain', 'sea']
    },
    worship: {
      name: '拝殿',
      category: 'shrine',
      cost: { wood: 20, stone: 10, faith: 50 },
      size: { width: 2, height: 2 },
      unlockLevel: 1,
      description: '参拝者が祈りを捧げる場所',
      variants: ['simple', 'decorated', 'modern']
    },
    kagura: {
      name: '神楽殿',
      category: 'shrine',
      cost: { wood: 25, bamboo: 15, cloth: 10, faith: 75 },
      size: { width: 2, height: 2 },
      unlockLevel: 3,
      description: '神楽や祭りを行う舞台',
      variants: ['open', 'covered', 'festival']
    }
  },

  // 寺院建築
  temple: {
    gate: {
      name: '山門',
      category: 'temple',
      cost: { wood: 15, stone: 10, faith: 30 },
      size: { width: 2, height: 1 },
      unlockLevel: 0,
      description: '寺院への入り口となる門',
      variants: ['nio', 'simple', 'decorated']
    },
    mainHall: {
      name: '本堂',
      category: 'temple',
      cost: { wood: 35, stone: 25, gold: 15, faith: 120 },
      size: { width: 4, height: 3 },
      unlockLevel: 2,
      description: '本尊を安置する寺院の中心',
      variants: ['zen', 'pure_land', 'nichiren']
    },
    pagoda: {
      name: '五重塔',
      category: 'temple',
      cost: { wood: 50, stone: 30, gold: 20, faith: 200 },
      size: { width: 2, height: 2 },
      unlockLevel: 4,
      description: '仏舎利を納める象徴的な塔',
      variants: ['three_story', 'five_story', 'ancient']
    },
    bell: {
      name: '鐘楼',
      category: 'temple',
      cost: { wood: 20, bronze: 15, faith: 60 },
      size: { width: 1, height: 1 },
      unlockLevel: 2,
      description: '時を告げる梵鐘を収める建物',
      variants: ['traditional', 'modern', 'artistic']
    }
  },

  // 装飾・環境
  decoration: {
    lantern: {
      name: '灯籠',
      category: 'decoration',
      cost: { stone: 5, oil: 2 },
      size: { width: 1, height: 1 },
      unlockLevel: 0,
      description: '神域を照らす石灯籠',
      variants: ['stone', 'bronze', 'paper', 'electric']
    },
    garden: {
      name: '庭園',
      category: 'decoration',
      cost: { stone: 10, plants: 15, water: 5 },
      size: { width: 2, height: 2 },
      unlockLevel: 1,
      description: '心を癒す日本庭園',
      variants: ['rock', 'pond', 'zen', 'tea']
    },
    bridge: {
      name: '太鼓橋',
      category: 'decoration',
      cost: { wood: 15, stone: 5 },
      size: { width: 3, height: 1 },
      unlockLevel: 2,
      description: '池や川を渡る美しい橋',
      variants: ['wooden', 'stone', 'vermillion']
    },
    statue: {
      name: '狛犬',
      category: 'decoration',
      cost: { stone: 20, faith: 40 },
      size: { width: 1, height: 1 },
      unlockLevel: 1,
      description: '神域を守護する霊獣の像',
      variants: ['classic', 'fierce', 'cute', 'golden']
    }
  },

  // インフラ・生活
  infrastructure: {
    path: {
      name: '参道',
      category: 'infrastructure',
      cost: { stone: 3, gravel: 2 },
      size: { width: 1, height: 1 },
      unlockLevel: 0,
      description: '参拝者が歩く道',
      variants: ['gravel', 'stone', 'wooden', 'modern']
    },
    water: {
      name: '手水舎',
      category: 'infrastructure',
      cost: { wood: 10, stone: 8, water: 5 },
      size: { width: 1, height: 1 },
      unlockLevel: 1,
      description: '身を清める水場',
      variants: ['traditional', 'modern', 'artistic']
    },
    office: {
      name: '社務所',
      category: 'infrastructure',
      cost: { wood: 25, paper: 10, gold: 5 },
      size: { width: 2, height: 1 },
      unlockLevel: 2,
      description: '御朱印や御守りを授与する場所',
      variants: ['traditional', 'modern']
    },
    parking: {
      name: '駐車場',
      category: 'infrastructure',
      cost: { stone: 15, asphalt: 10 },
      size: { width: 3, height: 2 },
      unlockLevel: 3,
      description: '現代の参拝者のための駐車場',
      variants: ['gravel', 'paved', 'covered']
    }
  }
};

// 建設リソース
export const RESOURCES = {
  // 基本素材
  wood: { name: '木材', icon: '🪵', description: '建築の基本素材' },
  stone: { name: '石材', icon: '🪨', description: '堅固な建築に必要' },
  bamboo: { name: '竹', icon: '🎋', description: '和風建築に使用' },
  
  // 金属・貴重品
  bronze: { name: '青銅', icon: '🥉', description: '鐘や装飾に使用' },
  gold: { name: '金', icon: '🥇', description: '豪華な装飾に必要' },
  
  // 自然素材
  water: { name: '清水', icon: '💧', description: '庭園や手水舎に必要' },
  plants: { name: '植物', icon: '🌿', description: '庭園の緑化に使用' },
  
  // 工芸品
  cloth: { name: '布地', icon: '🧵', description: '幕や装飾に使用' },
  paper: { name: '和紙', icon: '📜', description: '御朱印や装飾に使用' },
  oil: { name: '灯油', icon: '🕯️', description: '灯籠の燃料' },
  
  // 現代素材
  asphalt: { name: 'アスファルト', icon: '⬛', description: '現代建築に使用' },
  gravel: { name: '砂利', icon: '🪨', description: '道や駐車場に使用' },
  
  // 精神的リソース
  faith: { name: '信仰心', icon: '🙏', description: '神聖な建築に必要な心の力' }
};

// 神社村のレイアウトグリッド
export const VILLAGE_GRID = {
  width: 20,
  height: 15,
  cellSize: 40, // ピクセル
  
  // 特別なゾーン
  zones: {
    sacred: { name: '神域', color: '#FFE4E1', restriction: ['shrine', 'temple'] },
    living: { name: '生活区域', color: '#E6F3FF', restriction: ['infrastructure'] },
    nature: { name: '自然区域', color: '#E8F5E8', restriction: ['decoration'] },
    entrance: { name: '入口区域', color: '#FFF8DC', restriction: ['infrastructure', 'decoration'] }
  }
};

// 建築アンロック条件
export const UNLOCK_CONDITIONS = {
  level: {
    0: ['torii', 'lantern', 'path'],
    1: ['worship', 'gate', 'garden', 'statue', 'water'],
    2: ['mainHall', 'bell', 'bridge', 'office'],
    3: ['kagura', 'parking'],
    4: ['pagoda'],
    5: ['special_events']
  },
  
  collections: {
    'shrine_master': ['golden_torii', 'imperial_hall'],
    'temple_devotee': ['ancient_pagoda', 'zen_garden'],
    'decorator': ['artistic_lanterns', 'festival_decorations'],
    'architect': ['custom_layouts', 'mega_structures']
  },
  
  achievements: {
    'first_shrine': ['basic_decorations'],
    'pilgrimage_complete': ['sacred_artifacts'],
    'master_builder': ['legendary_structures']
  }
};

// 建築テンプレート（プリセット）
export const BUILDING_TEMPLATES = {
  starter: {
    name: '初心者神社',
    description: '基本的な神社レイアウト',
    cost: { wood: 50, stone: 30, faith: 100 },
    buildings: [
      { type: 'torii', variant: 'classic', position: { x: 5, y: 12 } },
      { type: 'path', variant: 'gravel', position: { x: 5, y: 11 } },
      { type: 'path', variant: 'gravel', position: { x: 5, y: 10 } },
      { type: 'worship', variant: 'simple', position: { x: 4, y: 8 } },
      { type: 'lantern', variant: 'stone', position: { x: 3, y: 9 } },
      { type: 'lantern', variant: 'stone', position: { x: 7, y: 9 } }
    ]
  },
  
  traditional: {
    name: '伝統的神社',
    description: '格式高い伝統的レイアウト',
    cost: { wood: 100, stone: 80, gold: 20, faith: 300 },
    buildings: [
      { type: 'torii', variant: 'vermillion', position: { x: 6, y: 13 } },
      { type: 'path', variant: 'stone', positions: [
        { x: 6, y: 12 }, { x: 6, y: 11 }, { x: 6, y: 10 }
      ]},
      { type: 'mainHall', variant: 'traditional', position: { x: 5, y: 6 } },
      { type: 'worship', variant: 'decorated', position: { x: 5, y: 9 } },
      { type: 'water', variant: 'traditional', position: { x: 3, y: 11 } },
      { type: 'office', variant: 'traditional', position: { x: 9, y: 8 } }
    ]
  },
  
  zen_temple: {
    name: '禅寺',
    description: '静寂な禅の世界',
    cost: { wood: 120, stone: 100, bamboo: 50, faith: 400 },
    buildings: [
      { type: 'gate', variant: 'simple', position: { x: 6, y: 13 } },
      { type: 'mainHall', variant: 'zen', position: { x: 5, y: 7 } },
      { type: 'garden', variant: 'zen', position: { x: 2, y: 8 } },
      { type: 'garden', variant: 'zen', position: { x: 9, y: 8 } },
      { type: 'bell', variant: 'traditional', position: { x: 2, y: 5 } }
    ]
  }
};

// 収集要素のアイテム
export const COLLECTIBLE_ITEMS = {
  // 建築パーツ
  architectural: {
    'golden_torii': {
      name: '黄金の鳥居',
      rarity: 'legendary',
      description: '特別な参拝で獲得できる黄金の鳥居',
      unlockCondition: '100回連続参拝'
    },
    'crystal_lantern': {
      name: '水晶灯籠',
      rarity: 'epic',
      description: '満月の夜の参拝で獲得',
      unlockCondition: '満月参拝10回'
    }
  },
  
  // 装飾アイテム
  decorative: {
    'sakura_petals': {
      name: '桜の花びら',
      rarity: 'common',
      description: '春の参拝で収集',
      effect: '桜エフェクト追加'
    },
    'autumn_leaves': {
      name: '紅葉',
      rarity: 'common',
      description: '秋の参拝で収集',
      effect: '紅葉エフェクト追加'
    }
  },
  
  // 特殊アイテム
  special: {
    'dragon_guardian': {
      name: '龍神の加護',
      rarity: 'mythical',
      description: '伝説の神社での特別な体験',
      effect: '全建物に龍のオーラ効果'
    }
  }
};