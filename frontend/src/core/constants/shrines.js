export const SHRINES = [
  {
    id: 'meiji_jingu',
    name: '明治神宮',
    location: { lat: 35.6764, lng: 139.6993 },
    type: 'major',
    deity: '明治天皇・昭憲皇太后',
    blessings: ['家内安全', '商売繁盛', '厄除け'],
    qrCode: 'MEIJI_JINGU_001',
    story: '明治天皇と昭憲皇太后をお祀りする、東京を代表する神社。都心にありながら豊かな森に囲まれた神聖な空間。',
    guardianPower: '都市の繁栄と自然の調和'
  },
  {
    id: 'senso_ji',
    name: '浅草寺',
    location: { lat: 35.7148, lng: 139.7967 },
    type: 'temple',
    deity: '聖観世音菩薩',
    blessings: ['商売繁盛', '家内安全', '学業成就'],
    qrCode: 'SENSOJI_001',
    story: '東京最古の寺院。雷門から続く仲見世通りは、江戸時代から続く賑わいを今に伝える。',
    guardianPower: '商売繁盛と観光の守護'
  },
  {
    id: 'yasukuni',
    name: '靖国神社',
    location: { lat: 35.6938, lng: 139.7426 },
    type: 'major',
    deity: '戦没者の英霊',
    blessings: ['国家安泰', '平和祈願'],
    qrCode: 'YASUKUNI_001',
    story: '国のために尊い命を捧げられた方々の御霊をお祀りする神社。',
    guardianPower: '平和と追悼の精神'
  },
  {
    id: 'hie_jinja',
    name: '日枝神社',
    location: { lat: 35.6743, lng: 139.7396 },
    type: 'local',
    deity: '大山咋神',
    blessings: ['厄除け', '安産', '縁結び'],
    qrCode: 'HIE_001',
    story: '江戸城の裏鬼門を守る神社として、徳川家の崇敬を受けた。',
    guardianPower: '都市の守護と厄除け'
  },
  {
    id: 'kanda_myojin',
    name: '神田明神',
    location: { lat: 35.7019, lng: 139.7678 },
    type: 'major',
    deity: '大己貴命・少彦名命・平将門命',
    blessings: ['商売繁盛', 'IT関連成就', '勝負運'],
    qrCode: 'KANDA_001',
    story: '江戸総鎮守として江戸時代から信仰を集める。現代ではIT関連の祈願でも有名。',
    guardianPower: '商売とテクノロジーの融合'
  }
];

// 神社タイプ別の特性
export const SHRINE_TYPES = {
  major: {
    name: '大社',
    visitPoints: 100,
    rareGoshuinChance: 0.15
  },
  temple: {
    name: '寺院',
    visitPoints: 80,
    rareGoshuinChance: 0.10
  },
  local: {
    name: '地域神社',
    visitPoints: 50,
    rareGoshuinChance: 0.05
  }
};

// 季節別イベント
export const SEASONAL_EVENTS = {
  spring: {
    name: '桜の季節',
    period: { start: 3, end: 4 },
    bonusMultiplier: 1.5,
    specialGoshuin: 'sakura_limited'
  },
  summer: {
    name: '夏祭り',
    period: { start: 7, end: 8 },
    bonusMultiplier: 2.0,
    specialGoshuin: 'matsuri_limited'
  },
  autumn: {
    name: '紅葉狩り',
    period: { start: 10, end: 11 },
    bonusMultiplier: 1.5,
    specialGoshuin: 'momiji_limited'
  },
  winter: {
    name: '初詣',
    period: { start: 12, end: 1 },
    bonusMultiplier: 3.0,
    specialGoshuin: 'hatsumode_limited'
  }
};