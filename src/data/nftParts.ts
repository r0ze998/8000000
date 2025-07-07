
import { NFTItem } from '../types';

// NFTパーツのカテゴリ - 伽藍配置の思想に基づく
export const NFT_CATEGORIES = {
  BOUNDARY: {
    id: 'boundary',
    name: '結界パーツ',
    icon: '⛩️',
    description: '神域と俗世を分ける神聖な境界'
  },
  APPROACH: {
    id: 'approach',
    name: '参道パーツ',
    icon: '🛤️',
    description: '神域への清浄な道のり'
  },
  RITUAL: {
    id: 'ritual',
    name: '儀礼パーツ',
    icon: '🙏',
    description: '祈りと清めの儀式に使用'
  },
  CENTRAL: {
    id: 'central',
    name: '中心施設パーツ',
    icon: '🏛️',
    description: '神社の中核となる神聖な建物'
  },
  GUARDIAN: {
    id: 'guardian',
    name: '守護・装飾パーツ',
    icon: '🛡️',
    description: '神域を守護し美を添える存在'
  },
  LANDSCAPE: {
    id: 'landscape',
    name: '景観パーツ',
    icon: '🌿',
    description: '自然と調和する神域の風景'
  }
} as const;

// レアリティ定義
export const NFT_RARITIES = {
  COMMON: {
    id: 'common',
    name: 'コモン',
    color: '#94a3b8',
    borderColor: '#64748b',
    probability: 0.5,
    powerMultiplier: 1
  },
  UNCOMMON: {
    id: 'uncommon',
    name: 'アンコモン',
    color: '#22d3ee',
    borderColor: '#0891b2',
    probability: 0.3,
    powerMultiplier: 1.5
  },
  RARE: {
    id: 'rare',
    name: 'レア',
    color: '#a855f7',
    borderColor: '#7c3aed',
    probability: 0.15,
    powerMultiplier: 2
  },
  EPIC: {
    id: 'epic',
    name: 'エピック',
    color: '#f59e0b',
    borderColor: '#d97706',
    probability: 0.04,
    powerMultiplier: 3
  },
  LEGENDARY: {
    id: 'legendary',
    name: 'レジェンダリー',
    color: '#ef4444',
    borderColor: '#dc2626',
    probability: 0.01,
    powerMultiplier: 5
  }
} as const;

// アニメーション定義
export const NFT_ANIMATIONS = {
  NONE: { id: 'none', name: '静止', description: 'アニメーションなし' },
  FLOAT: { id: 'float', name: '浮遊', description: 'ふわふわと浮かぶ' },
  PULSE: { id: 'pulse', name: '鼓動', description: 'リズミカルに光る' },
  GLOW: { id: 'glow', name: '発光', description: '神秘的に光る' },
  SWING: { id: 'swing', name: '揺れ', description: 'ゆらゆらと揺れる' },
  SPIRAL: { id: 'spiral', name: '螺旋', description: '螺旋状に回転する' }
} as const;

// 伽藍配置に基づくNFTパーツコレクション
export const ENHANCED_NFT_PARTS: NFTItem[] = [
  // === 結界パーツ (Boundary Parts) ===
  // 鳥居
  {
    id: 'torii-wooden',
    name: '木製鳥居',
    type: 'boundary',
    rarity: 'common',
    power: 30,
    pixelData: '⛩️',
    color: '#8B4513',
    isOwned: true,
    animation: 'none',
    emoji: '⛩️',
    description: '伝統的な木製の鳥居。神域への入口を示す'
  },
  {
    id: 'torii-vermillion',
    name: '朱塗り鳥居',
    type: 'boundary',
    rarity: 'rare',
    power: 75,
    pixelData: '⛩️',
    color: '#DC143C',
    isOwned: false,
    animation: 'glow',
    emoji: '⛩️',
    description: '鮮やかな朱色に塗られた格式高い鳥居'
  },
  {
    id: 'torii-golden',
    name: '黄金の鳥居',
    type: 'boundary',
    rarity: 'legendary',
    power: 250,
    pixelData: '⛩️',
    color: '#FFD700',
    isOwned: false,
    animation: 'spiral',
    emoji: '⛩️',
    description: '神々しく輝く黄金の鳥居。最高位の神域'
  },

  // 玉垣・瑞垣
  {
    id: 'tamagaki-basic',
    name: '玉垣',
    type: 'boundary',
    rarity: 'common',
    power: 25,
    pixelData: '🚧',
    color: '#F5DEB3',
    isOwned: true,
    animation: 'none',
    emoji: '🚧',
    description: '神域を囲む最内側の神聖な垣根'
  },
  {
    id: 'mizugaki-decorated',
    name: '装飾瑞垣',
    type: 'boundary',
    rarity: 'uncommon',
    power: 40,
    pixelData: '🚧',
    color: '#CD853F',
    isOwned: false,
    animation: 'pulse',
    emoji: '🚧',
    description: '美しい装飾が施された第二の垣根'
  },

  // === 参道パーツ (Approach Parts) ===
  // 参道・敷石
  {
    id: 'sandou-gravel',
    name: '玉砂利参道',
    type: 'approach',
    rarity: 'common',
    power: 20,
    pixelData: '⬜',
    color: '#E5E5E5',
    isOwned: true,
    animation: 'none',
    emoji: '⬜',
    description: '清浄な玉砂利が敷かれた参道'
  },
  {
    id: 'sandou-stone',
    name: '石畳参道',
    type: 'approach',
    rarity: 'rare',
    power: 60,
    pixelData: '⬛',
    color: '#696969',
    isOwned: false,
    animation: 'none',
    emoji: '⬛',
    description: '重厚な石畳で作られた格式ある参道'
  },

  // 石灯籠
  {
    id: 'ishidoro-basic',
    name: '石灯籠',
    type: 'approach',
    rarity: 'uncommon',
    power: 35,
    pixelData: '🕯️',
    color: '#F5DEB3',
    isOwned: true,
    animation: 'pulse',
    emoji: '🕯️',
    description: '参道を照らす伝統的な石造りの灯籠'
  },
  {
    id: 'ishidoro-ornate',
    name: '装飾石灯籠',
    type: 'approach',
    rarity: 'epic',
    power: 120,
    pixelData: '🕯️',
    color: '#DEB887',
    isOwned: false,
    animation: 'glow',
    emoji: '🕯️',
    description: '精緻な彫刻が施された美しい石灯籠'
  },

  // 太鼓橋
  {
    id: 'taikobashi-wooden',
    name: '木製太鼓橋',
    type: 'approach',
    rarity: 'rare',
    power: 70,
    pixelData: '🌉',
    color: '#8B4513',
    isOwned: false,
    animation: 'swing',
    emoji: '🌉',
    description: '優美な弧を描く伝統的な太鼓橋'
  },
  {
    id: 'taikobashi-vermillion',
    name: '朱塗り太鼓橋',
    type: 'approach',
    rarity: 'epic',
    power: 130,
    pixelData: '🌉',
    color: '#DC143C',
    isOwned: false,
    animation: 'glow',
    emoji: '🌉',
    description: '鮮やかな朱色に塗られた格式高い太鼓橋'
  },

  // === 儀礼パーツ (Ritual Parts) ===
  // 手水舎
  {
    id: 'chozuya-basic',
    name: '手水舎',
    type: 'ritual',
    rarity: 'common',
    power: 30,
    pixelData: '⛲',
    color: '#4682B4',
    isOwned: true,
    animation: 'pulse',
    emoji: '⛲',
    description: '身と心を清める神聖な手水舎'
  },
  {
    id: 'chozuya-dragon',
    name: '龍口手水舎',
    type: 'ritual',
    rarity: 'epic',
    power: 140,
    pixelData: '⛲',
    color: '#4169E1',
    isOwned: false,
    animation: 'spiral',
    emoji: '⛲',
    description: '龍の口から清水が流れる荘厳な手水舎'
  },

  // 賽銭箱
  {
    id: 'saisen-wooden',
    name: '木製賽銭箱',
    type: 'ritual',
    rarity: 'common',
    power: 25,
    pixelData: '📦',
    color: '#8B4513',
    isOwned: true,
    animation: 'none',
    emoji: '📦',
    description: '参拝者の真心を受ける木製の賽銭箱'
  },
  {
    id: 'saisen-ornate',
    name: '装飾賽銭箱',
    type: 'ritual',
    rarity: 'rare',
    power: 65,
    pixelData: '📦',
    color: '#DAA520',
    isOwned: false,
    animation: 'glow',
    emoji: '📦',
    description: '美しい装飾が施された格式ある賽銭箱'
  },

  // 絵馬掛・おみくじ結び所
  {
    id: 'emakake-basic',
    name: '絵馬掛',
    type: 'ritual',
    rarity: 'uncommon',
    power: 40,
    pixelData: '🎨',
    color: '#8B4513',
    isOwned: true,
    animation: 'swing',
    emoji: '🎨',
    description: '願いを込めた絵馬を掛ける場所'
  },
  {
    id: 'omikuji-rack',
    name: 'おみくじ結び所',
    type: 'ritual',
    rarity: 'uncommon',
    power: 35,
    pixelData: '🎋',
    color: '#9ACD32',
    isOwned: false,
    animation: 'swing',
    emoji: '🎋',
    description: 'おみくじを結んで願いを託す神聖な場所'
  },

  // === 中心施設パーツ (Central Facility Parts) ===
  // 拝殿
  {
    id: 'haiden-basic',
    name: '拝殿',
    type: 'central',
    rarity: 'uncommon',
    power: 50,
    pixelData: '🏛️',
    color: '#CD853F',
    isOwned: true,
    animation: 'none',
    emoji: '🏛️',
    description: '参拝者が祈りを捧げる神聖な拝殿'
  },
  {
    id: 'haiden-grand',
    name: '大拝殿',
    type: 'central',
    rarity: 'epic',
    power: 150,
    pixelData: '🏛️',
    color: '#B8860B',
    isOwned: false,
    animation: 'glow',
    emoji: '🏛️',
    description: '荘厳で威厳ある大きな拝殿'
  },

  // 本殿・本宮
  {
    id: 'honden-basic',
    name: '本殿',
    type: 'central',
    rarity: 'rare',
    power: 80,
    pixelData: '⛩️',
    color: '#8B4513',
    isOwned: false,
    animation: 'pulse',
    emoji: '⛩️',
    description: '神が鎮座する最も神聖な本殿'
  },
  {
    id: 'hongu-legendary',
    name: '本宮',
    type: 'central',
    rarity: 'legendary',
    power: 300,
    pixelData: '⛩️',
    color: '#FFD700',
    isOwned: false,
    animation: 'spiral',
    emoji: '⛩️',
    description: '最高位の神が宿る至高の本宮'
  },

  // 神楽殿
  {
    id: 'kaguraden-basic',
    name: '神楽殿',
    type: 'central',
    rarity: 'rare',
    power: 85,
    pixelData: '🎭',
    color: '#CD853F',
    isOwned: false,
    animation: 'swing',
    emoji: '🎭',
    description: '神楽舞を奉納する神聖な舞台'
  },

  // 社務所
  {
    id: 'shamusho-basic',
    name: '社務所',
    type: 'central',
    rarity: 'common',
    power: 20,
    pixelData: '🏢',
    color: '#8B4513',
    isOwned: true,
    animation: 'none',
    emoji: '🏢',
    description: '神社の運営を支える事務施設'
  },

  // === 守護・装飾パーツ (Guardian & Decorative Parts) ===
  // 狛犬
  {
    id: 'komainu-pair',
    name: '狛犬',
    type: 'guardian',
    rarity: 'uncommon',
    power: 45,
    pixelData: '🦁',
    color: '#F5DEB3',
    isOwned: true,
    animation: 'pulse',
    emoji: '🦁',
    description: '神域を守護する阿吽の狛犬'
  },
  {
    id: 'komainu-golden',
    name: '黄金狛犬',
    type: 'guardian',
    rarity: 'legendary',
    power: 280,
    pixelData: '🦁',
    color: '#FFD700',
    isOwned: false,
    animation: 'glow',
    emoji: '🦁',
    description: '黄金に輝く神威あふれる狛犬'
  },

  // 神使の像
  {
    id: 'kitsune-messenger',
    name: '神使狐',
    type: 'guardian',
    rarity: 'rare',
    power: 70,
    pixelData: '🦊',
    color: '#FF8C00',
    isOwned: false,
    animation: 'float',
    emoji: '🦊',
    description: '稲荷神の使いとされる賢い狐'
  },
  {
    id: 'deer-messenger',
    name: '神使鹿',
    type: 'guardian',
    rarity: 'rare',
    power: 65,
    pixelData: '🦌',
    color: '#DEB887',
    isOwned: false,
    animation: 'swing',
    emoji: '🦌',
    description: '春日大社の神使として崇められる鹿'
  },
  {
    id: 'ox-messenger',
    name: '神使牛',
    type: 'guardian',
    rarity: 'epic',
    power: 110,
    pixelData: '🐂',
    color: '#8B4513',
    isOwned: false,
    animation: 'pulse',
    emoji: '🐂',
    description: '天神様の神使として知られる牛'
  },
  {
    id: 'dove-messenger',
    name: '神使鳩',
    type: 'guardian',
    rarity: 'uncommon',
    power: 35,
    pixelData: '🕊️',
    color: '#F5F5F5',
    isOwned: false,
    animation: 'float',
    emoji: '🕊️',
    description: '八幡神の神使として愛される鳩'
  },

  // 屋根飾り
  {
    id: 'chigi-katsuogi',
    name: '千木・鰹木',
    type: 'guardian',
    rarity: 'rare',
    power: 75,
    pixelData: '🔺',
    color: '#8B4513',
    isOwned: false,
    animation: 'none',
    emoji: '🔺',
    description: '神社建築の特徴的な屋根飾り'
  },
  {
    id: 'onigawara',
    name: '鬼瓦',
    type: 'guardian',
    rarity: 'epic',
    power: 120,
    pixelData: '👹',
    color: '#696969',
    isOwned: false,
    animation: 'glow',
    emoji: '👹',
    description: '魔除けの力を持つ威厳ある鬼瓦'
  },

  // のぼり旗
  {
    id: 'nobori-white',
    name: '白のぼり',
    type: 'guardian',
    rarity: 'common',
    power: 15,
    pixelData: '🏳️',
    color: '#F5F5F5',
    isOwned: true,
    animation: 'swing',
    emoji: '🏳️',
    description: '清浄を表す白いのぼり旗'
  },
  {
    id: 'nobori-vermillion',
    name: '朱のぼり',
    type: 'guardian',
    rarity: 'rare',
    power: 55,
    pixelData: '🚩',
    color: '#DC143C',
    isOwned: false,
    animation: 'swing',
    emoji: '🚩',
    description: '神威を示す鮮やかな朱のぼり'
  },

  // === 景観パーツ (Landscape Parts) ===
  // 神木
  {
    id: 'shinboku-basic',
    name: '神木',
    type: 'landscape',
    rarity: 'rare',
    power: 90,
    pixelData: '🌳',
    color: '#228B22',
    isOwned: false,
    animation: 'swing',
    emoji: '🌳',
    description: '神が宿るとされる神聖な大木'
  },
  {
    id: 'shinboku-ancient',
    name: '古神木',
    type: 'landscape',
    rarity: 'legendary',
    power: 320,
    pixelData: '🌳',
    color: '#006400',
    isOwned: false,
    animation: 'glow',
    emoji: '🌳',
    description: '千年の時を経た神威あふれる神木'
  },

  // 鎮守の森
  {
    id: 'chinju-forest',
    name: '鎮守の森',
    type: 'landscape',
    rarity: 'epic',
    power: 160,
    pixelData: '🌲',
    color: '#228B22',
    isOwned: false,
    animation: 'swing',
    emoji: '🌲',
    description: '神社を守護する神聖な森'
  },

  // 桜
  {
    id: 'sakura-young',
    name: '若桜',
    type: 'landscape',
    rarity: 'common',
    power: 25,
    pixelData: '🌸',
    color: '#FFB6C1',
    isOwned: true,
    animation: 'float',
    emoji: '🌸',
    description: '春の訪れを告げる美しい桜'
  },
  {
    id: 'sakura-ancient',
    name: '千年桜',
    type: 'landscape',
    rarity: 'legendary',
    power: 300,
    pixelData: '🌸',
    color: '#FF69B4',
    isOwned: false,
    animation: 'spiral',
    emoji: '🌸',
    description: '千年の時を経た神聖な桜'
  },

  // 紅葉
  {
    id: 'momiji-autumn',
    name: '紅葉',
    type: 'landscape',
    rarity: 'uncommon',
    power: 35,
    pixelData: '🍁',
    color: '#FF4500',
    isOwned: false,
    animation: 'float',
    emoji: '🍁',
    description: '秋を彩る美しい紅葉'
  },
  {
    id: 'momiji-golden',
    name: '黄金紅葉',
    type: 'landscape',
    rarity: 'epic',
    power: 140,
    pixelData: '🍁',
    color: '#FFD700',
    isOwned: false,
    animation: 'spiral',
    emoji: '🍁',
    description: '黄金に輝く神秘的な紅葉'
  },

  // 池・小川
  {
    id: 'pond-clear',
    name: '清池',
    type: 'landscape',
    rarity: 'common',
    power: 20,
    pixelData: '💧',
    color: '#4682B4',
    isOwned: true,
    animation: 'pulse',
    emoji: '💧',
    description: '透明度の高い清らかな池'
  },
  {
    id: 'stream-sacred',
    name: '神泉',
    type: 'landscape',
    rarity: 'epic',
    power: 130,
    pixelData: '🌊',
    color: '#00CED1',
    isOwned: false,
    animation: 'spiral',
    emoji: '🌊',
    description: '神々の力が宿る神聖な泉'
  },

  // 岩座
  {
    id: 'iwakura-basic',
    name: '岩座',
    type: 'landscape',
    rarity: 'rare',
    power: 80,
    pixelData: '🗿',
    color: '#8B7355',
    isOwned: false,
    animation: 'pulse',
    emoji: '🗿',
    description: '神が降臨する神聖な岩座'
  },
  {
    id: 'iwakura-ancient',
    name: '古代岩座',
    type: 'landscape',
    rarity: 'legendary',
    power: 290,
    pixelData: '🗿',
    color: '#696969',
    isOwned: false,
    animation: 'glow',
    emoji: '🗿',
    description: '古代から崇められる神秘の岩座'
  },

  // === ポケモン風ドット絵パーツ ===
  // 神使ポケモン風
  {
    id: 'spirit-pikachu',
    name: '電気神使',
    type: 'guardian',
    rarity: 'epic',
    power: 125,
    pixelData: '⚡',
    color: '#FFD700',
    isOwned: false,
    animation: 'pulse',
    emoji: '⚡',
    description: 'ポケモン風の電気を操る神使'
  },
  {
    id: 'spirit-eevee',
    name: '進化神使',
    type: 'guardian',
    rarity: 'rare',
    power: 70,
    pixelData: '🌟',
    color: '#D2B48C',
    isOwned: false,
    animation: 'spiral',
    emoji: '🌟',
    description: '多様な可能性を秘めた神使'
  },
  {
    id: 'spirit-mew',
    name: '幻想神使',
    type: 'guardian',
    rarity: 'legendary',
    power: 350,
    pixelData: '💫',
    color: '#FFB6C1',
    isOwned: false,
    animation: 'float',
    emoji: '💫',
    description: '全ての神社パーツの原型とされる幻の神使'
  },

  // ポケモン風建物
  {
    id: 'pokecenter-shrine',
    name: 'ポケ神社',
    type: 'central',
    rarity: 'epic',
    power: 180,
    pixelData: '🏥',
    color: '#FF6B9D',
    isOwned: false,
    animation: 'pulse',
    emoji: '🏥',
    description: 'ポケモンセンター風の癒しの神社'
  },
  {
    id: 'gym-shrine',
    name: 'ジム神社',
    type: 'central',
    rarity: 'rare',
    power: 95,
    pixelData: '🏟️',
    color: '#4CAF50',
    isOwned: false,
    animation: 'glow',
    emoji: '🏟️',
    description: 'ポケモンジム風の試練の神社'
  },

  // ポケモン風自然要素
  {
    id: 'viridian-forest',
    name: 'トキワの森',
    type: 'landscape',
    rarity: 'rare',
    power: 85,
    pixelData: '🌲',
    color: '#2E7D32',
    isOwned: false,
    animation: 'swing',
    emoji: '🌲',
    description: 'ポケモンが住む神秘的な森'
  },
  {
    id: 'cerulean-cave',
    name: 'ハナダの洞窟',
    type: 'landscape',
    rarity: 'legendary',
    power: 310,
    pixelData: '🕳️',
    color: '#1976D2',
    isOwned: false,
    animation: 'glow',
    emoji: '🕳️',
    description: '伝説のポケモンが眠る神聖な洞窟'
  },

  // ポケモン風アイテム
  {
    id: 'pokeball-lantern',
    name: 'モンスターボール灯籠',
    type: 'approach',
    rarity: 'uncommon',
    power: 40,
    pixelData: '🔴',
    color: '#FF0000',
    isOwned: false,
    animation: 'pulse',
    emoji: '🔴',
    description: 'モンスターボール型の神聖な灯籠'
  },
  {
    id: 'masterball-shrine',
    name: 'マスターボール神殿',
    type: 'central',
    rarity: 'legendary',
    power: 400,
    pixelData: '🟣',
    color: '#8E24AA',
    isOwned: false,
    animation: 'spiral',
    emoji: '🟣',
    description: '最高位のマスターボール型神殿'
  },

  // ポケモン風エレメント
  {
    id: 'fire-stone-altar',
    name: '炎の石祭壇',
    type: 'ritual',
    rarity: 'rare',
    power: 75,
    pixelData: '🔥',
    color: '#FF5722',
    isOwned: false,
    animation: 'pulse',
    emoji: '🔥',
    description: '炎タイプのエネルギーが宿る祭壇'
  },
  {
    id: 'water-stone-fountain',
    name: '水の石泉',
    type: 'ritual',
    rarity: 'rare',
    power: 70,
    pixelData: '💧',
    color: '#2196F3',
    isOwned: false,
    animation: 'spiral',
    emoji: '💧',
    description: '水タイプのエネルギーが湧く泉'
  },
  {
    id: 'thunder-stone-tower',
    name: '雷の石塔',
    type: 'structure',
    rarity: 'epic',
    power: 140,
    pixelData: '⚡',
    color: '#FFC107',
    isOwned: false,
    animation: 'glow',
    emoji: '⚡',
    description: '電気タイプのエネルギーを集める塔'
  },

  // ドット絵風装飾
  {
    id: 'pixel-cherry-blossom',
    name: 'ドット桜',
    type: 'landscape',
    rarity: 'uncommon',
    power: 35,
    pixelData: '🌸',
    color: '#FFB3BA',
    isOwned: false,
    animation: 'float',
    emoji: '🌸',
    description: '8ビット風に描かれた美しい桜'
  },
  {
    id: 'pixel-shrine-bell',
    name: 'ドット鈴',
    type: 'ritual',
    rarity: 'common',
    power: 20,
    pixelData: '🔔',
    color: '#FFD700',
    isOwned: true,
    animation: 'swing',
    emoji: '🔔',
    description: 'レトロゲーム風の神聖な鈴'
  },
  {
    id: 'retro-torii',
    name: 'レトロ鳥居',
    type: 'boundary',
    rarity: 'rare',
    power: 75,
    pixelData: '⛩️',
    color: '#E53935',
    isOwned: false,
    animation: 'glow',
    emoji: '⛩️',
    description: '8ビットゲーム風にデザインされた鳥居'
  },

  // 装飾品
  {
    id: 'lantern-1',
    name: '提灯',
    type: 'decoration',
    rarity: 'common',
    power: 15,
    pixelData: '🏮',
    color: '#FF6B6B',
    isOwned: true,
    animation: 'swing',
    emoji: '🏮',
    description: '温かい光を放つ伝統的な提灯',
    timestamp: Date.now()
  },
  {
    id: 'lantern-stone',
    name: '石灯籠',
    type: 'decoration',
    rarity: 'rare',
    power: 25,
    pixelData: '🕯️',
    color: '#F5DEB3',
    isOwned: true,
    animation: 'glow',
    emoji: '🕯️',
    description: '神聖な石造りの灯籠',
    timestamp: Date.now()
  },
  {
    id: 'bell-1',
    name: '神社の鈴',
    type: 'decoration',
    rarity: 'epic',
    power: 40,
    pixelData: '🔔',
    color: '#FFD700',
    isOwned: true,
    animation: 'swing',
    emoji: '🔔',
    description: '清らかな音色を響かせる神聖な鈴',
    timestamp: Date.now()
  },
  {
    id: 'flag-1',
    name: '祈願旗',
    type: 'decoration',
    rarity: 'common',
    power: 12,
    pixelData: '🎌',
    color: '#FF4500',
    isOwned: true,
    animation: 'swing',
    emoji: '🎌',
    description: '風になびく縁起の良い旗',
    timestamp: Date.now()
  },
];

// セット効果（伽藍配置完成ボーナス）
export const NFT_SET_BONUSES = {
  PERFECT_GARAN: {
    id: 'perfect_garan',
    name: '完全伽藍配置',
    description: '全カテゴリの要素が揃うと神社が完成形となる',
    requiredCategories: ['boundary', 'approach', 'ritual', 'central', 'guardian', 'landscape'],
    bonus: {
      culturalCapitalMultiplier: 3.0,
      specialEffect: 'divine_perfection'
    }
  },
  SACRED_BOUNDARY: {
    id: 'sacred_boundary',
    name: '神聖結界',
    description: '結界パーツが揃うと強力な守護効果',
    requiredNFTs: ['torii-golden', 'tamagaki-basic', 'mizugaki-decorated'],
    bonus: {
      culturalCapitalMultiplier: 1.8,
      specialEffect: 'boundary_protection'
    }
  },
  DIVINE_CENTER: {
    id: 'divine_center',
    name: '神域中枢',
    description: '中心施設が完備されると神威が増大',
    requiredNFTs: ['honden-basic', 'haiden-grand', 'kaguraden-basic'],
    bonus: {
      culturalCapitalMultiplier: 2.2,
      specialEffect: 'divine_authority'
    }
  },
  NATURE_HARMONY: {
    id: 'nature_harmony',
    name: '自然調和',
    description: '景観要素が調和すると自然の恵みが増す',
    requiredNFTs: ['shinboku-ancient', 'sakura-ancient', 'stream-sacred'],
    bonus: {
      culturalCapitalMultiplier: 1.9,
      specialEffect: 'nature_blessing'
    }
  },
  POKEMON_MASTER: {
    id: 'pokemon_master',
    name: 'ポケモンマスター',
    description: 'ポケモン風神使が揃うとマスターの力を得る',
    requiredNFTs: ['spirit-pikachu', 'spirit-eevee', 'spirit-mew'],
    bonus: {
      culturalCapitalMultiplier: 2.5,
      specialEffect: 'pokemon_mastery'
    }
  },
  ELEMENTAL_HARMONY: {
    id: 'elemental_harmony',
    name: '属性調和',
    description: '炎・水・電気の石が揃うと属性の力が調和する',
    requiredNFTs: ['fire-stone-altar', 'water-stone-fountain', 'thunder-stone-tower'],
    bonus: {
      culturalCapitalMultiplier: 2.1,
      specialEffect: 'elemental_balance'
    }
  },
  RETRO_GAMING: {
    id: 'retro_gaming',
    name: 'レトロゲーミング',
    description: 'ドット絵パーツが揃うとノスタルジックな力を発揮',
    requiredNFTs: ['pixel-cherry-blossom', 'pixel-shrine-bell', 'retro-torii'],
    bonus: {
      culturalCapitalMultiplier: 1.8,
      specialEffect: 'nostalgic_power'
    }
  }
};

// NFT生成確率テーブル
export const NFT_DROP_TABLE = {
  COMMON_DROPS: ENHANCED_NFT_PARTS.filter(nft => nft.rarity === 'common'),
  UNCOMMON_DROPS: ENHANCED_NFT_PARTS.filter(nft => nft.rarity === 'uncommon'),
  RARE_DROPS: ENHANCED_NFT_PARTS.filter(nft => nft.rarity === 'rare'),
  EPIC_DROPS: ENHANCED_NFT_PARTS.filter(nft => nft.rarity === 'epic'),
  LEGENDARY_DROPS: ENHANCED_NFT_PARTS.filter(nft => nft.rarity === 'legendary')
};

// NFT生成関数
export const generateRandomNFT = (): NFTItem => {
  const rand = Math.random();

  const getRandomFromDrops = (drops: NFTItem[]): NFTItem => {
    if (drops.length === 0) {
      // フォールバック: コモンドロップから取得
      const fallback = NFT_DROP_TABLE.COMMON_DROPS[0];
      if (!fallback) {
        throw new Error('No NFT drops available');
      }
      return fallback;
    }
    return drops[Math.floor(Math.random() * drops.length)]!;
  };

  if (rand < NFT_RARITIES.LEGENDARY.probability) {
    return getRandomFromDrops(NFT_DROP_TABLE.LEGENDARY_DROPS);
  } else if (rand < NFT_RARITIES.LEGENDARY.probability + NFT_RARITIES.EPIC.probability) {
    return getRandomFromDrops(NFT_DROP_TABLE.EPIC_DROPS);
  } else if (rand < NFT_RARITIES.LEGENDARY.probability + NFT_RARITIES.EPIC.probability + NFT_RARITIES.RARE.probability) {
    return getRandomFromDrops(NFT_DROP_TABLE.RARE_DROPS);
  } else if (rand < 0.2) {
    return getRandomFromDrops(NFT_DROP_TABLE.UNCOMMON_DROPS);
  } else {
    return getRandomFromDrops(NFT_DROP_TABLE.COMMON_DROPS);
  }
};
