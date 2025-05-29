// 神社・寺院データベース - 全国200箇所以上

// 基本の神社・寺院データ
export const SHRINE_TEMPLE_DATABASE = [
  // 北海道
  {
    id: 'hokkaido-jingu',
    name: '北海道神宮',
    type: 'shrine',
    prefecture: '北海道',
    city: '札幌市',
    address: '北海道札幌市中央区宮ケ丘474',
    deity: '大国魂神・大那牟遅神・少彦名神・明治天皇',
    founded: 1869,
    description: '北海道の総鎮守。桜の名所としても有名で、春には多くの花見客で賑わう。',
    benefits: ['開拓守護', '商売繁盛', '縁結び'],
    location: { lat: 43.0544, lng: 141.3544 },
    culturalValue: 80,
    rarity: 'rare',
    festival: '札幌まつり',
    goshuin: true
  },
  
  // 青森県
  {
    id: 'osorezan-bodaiji',
    name: '恐山菩提寺',
    type: 'temple',
    prefecture: '青森県',
    city: 'むつ市',
    address: '青森県むつ市田名部宇曽利山3-2',
    sect: '曹洞宗',
    founded: 862,
    description: '日本三大霊場の一つ。イタコの口寄せでも有名。硫黄の匂いが漂う神秘的な霊場。',
    benefits: ['先祖供養', '心の浄化', '霊的守護'],
    location: { lat: 41.3000, lng: 141.1000 },
    culturalValue: 150,
    rarity: 'legendary',
    festival: '恐山大祭',
    goshuin: true,
    specialFeatures: ['イタコの口寄せ', '硫黄泉', '霊場']
  },

  // 岩手県
  {
    id: 'chusonji',
    name: '中尊寺',
    type: 'temple',
    prefecture: '岩手県',
    city: '平泉町',
    address: '岩手県西磐井郡平泉町平泉衣関202',
    sect: '天台宗',
    founded: 850,
    description: '世界遺産平泉の中核。金色堂で有名。奥州藤原氏の栄華を物語る。',
    benefits: ['学業成就', '平和祈願', '文化財保護'],
    location: { lat: 39.0000, lng: 141.1000 },
    culturalValue: 180,
    rarity: 'mythical',
    festival: '藤原まつり',
    goshuin: true,
    worldHeritage: true,
    specialFeatures: ['金色堂', '国宝', '世界遺産']
  },

  // 宮城県
  {
    id: 'zuihoden',
    name: '瑞鳳殿',
    type: 'shrine',
    prefecture: '宮城県',
    city: '仙台市',
    address: '宮城県仙台市青葉区霊屋下23-2',
    deity: '伊達政宗',
    founded: 1637,
    description: '伊達政宗の霊廟。桃山様式の華麗な建築で知られる。',
    benefits: ['武運長久', '出世開運', '家運隆盛'],
    location: { lat: 38.2500, lng: 140.8500 },
    culturalValue: 120,
    rarity: 'rare',
    festival: '政宗公まつり',
    goshuin: true,
    specialFeatures: ['霊廟建築', '桃山様式', '伊達家']
  },

  // 秋田県
  {
    id: 'akita-kantou',
    name: '竿燈まつり',
    type: 'festival',
    prefecture: '秋田県',
    city: '秋田市',
    address: '秋田県秋田市大町1丁目',
    deity: '五穀豊穣',
    founded: 1789,
    description: '東北三大祭りの一つ。竿燈を使った妙技が見どころ。',
    benefits: ['五穀豊穣', '無病息災', '技芸上達'],
    location: { lat: 39.7186, lng: 140.1024 },
    culturalValue: 90,
    rarity: 'rare',
    festival: '竿燈まつり',
    goshuin: false,
    specialFeatures: ['東北三大祭り', '竿燈妙技', '夏祭り']
  },

  // 山形県
  {
    id: 'yamadera-risshakuji',
    name: '山寺立石寺',
    type: 'temple',
    prefecture: '山形県',
    city: '山形市',
    address: '山形県山形市山寺4456-1',
    sect: '天台宗',
    founded: 860,
    description: '松尾芭蕉の「奥の細道」で詠まれた名刹。1015段の石段を登る修行の場。',
    benefits: ['心身鍛錬', '学業成就', '心の平安'],
    location: { lat: 38.3167, lng: 140.4467 },
    culturalValue: 140,
    rarity: 'legendary',
    festival: '山寺芭蕉祭',
    goshuin: true,
    specialFeatures: ['奥の細道', '1015段の石段', '絶景']
  },

  // 福島県
  {
    id: 'iwaki-shiramizu-amidado',
    name: '白水阿弥陀堂',
    type: 'temple',
    prefecture: '福島県',
    city: 'いわき市',
    address: '福島県いわき市内郷白水町広畑221',
    sect: '真言宗',
    founded: 1160,
    description: '平安時代後期の阿弥陀堂建築の代表作。国宝指定。',
    benefits: ['極楽往生', '心の浄化', '文化財保護'],
    location: { lat: 37.0667, lng: 140.8833 },
    culturalValue: 160,
    rarity: 'legendary',
    festival: '白水阿弥陀堂まつり',
    goshuin: true,
    nationalTreasure: true,
    specialFeatures: ['国宝建築', '平安時代', '阿弥陀如来']
  },

  // 茨城県
  {
    id: 'kashima-jingu',
    name: '鹿島神宮',
    type: 'shrine',
    prefecture: '茨城県',
    city: '鹿嶋市',
    address: '茨城県鹿嶋市宮中2306-1',
    deity: '武甕槌大神',
    founded: '神武天皇元年',
    description: '東国三社の一つ。武道の神様として崇敬される。',
    benefits: ['武運長久', '勝負運', '厄除け'],
    location: { lat: 35.9667, lng: 140.6333 },
    culturalValue: 130,
    rarity: 'legendary',
    festival: '神幸祭',
    goshuin: true,
    specialFeatures: ['東国三社', '武道の神', '要石']
  },

  // 栃木県
  {
    id: 'nikko-toshogu',
    name: '日光東照宮',
    type: 'shrine',
    prefecture: '栃木県',
    city: '日光市',
    address: '栃木県日光市山内2301',
    deity: '徳川家康',
    founded: 1617,
    description: '徳川家康を祀る霊廟。見ざる言わざる聞かざるの猿の彫刻で有名。',
    benefits: ['出世開運', '学業成就', '家内安全'],
    location: { lat: 36.7581, lng: 139.5994 },
    culturalValue: 200,
    rarity: 'mythical',
    festival: '春季大祭',
    goshuin: true,
    worldHeritage: true,
    specialFeatures: ['徳川霊廟', '見ざる言わざる聞かざる', '世界遺産']
  },

  // 群馬県
  {
    id: 'haruna-jinja',
    name: '榛名神社',
    type: 'shrine',
    prefecture: '群馬県',
    city: '高崎市',
    address: '群馬県高崎市榛名山町849',
    deity: '火産霊神・埴山姫神',
    founded: '6世紀後半',
    description: '榛名山の中腹に鎮座。岩山に囲まれた神秘的な雰囲気。',
    benefits: ['火防守護', '商売繁盛', '心願成就'],
    location: { lat: 36.4667, lng: 138.8500 },
    culturalValue: 110,
    rarity: 'rare',
    festival: '榛名神社秋季大祭',
    goshuin: true,
    specialFeatures: ['岩山の神社', 'パワースポット', '絶景']
  },

  // 埼玉県
  {
    id: 'kawagoe-hikawa-jinja',
    name: '川越氷川神社',
    type: 'shrine',
    prefecture: '埼玉県',
    city: '川越市',
    address: '埼玉県川越市宮下町2-11-3',
    deity: '素盏嗚尊・奇稲田姫命・大己貴命・脚摩乳命・手摩乳命',
    founded: '6世紀',
    description: '縁結びの神社として有名。風鈴祭りも人気。',
    benefits: ['縁結び', '夫婦円満', '家内安全'],
    location: { lat: 35.9167, lng: 139.4833 },
    culturalValue: 70,
    rarity: 'uncommon',
    festival: '風鈴祭り',
    goshuin: true,
    specialFeatures: ['縁結び', '風鈴祭り', '小江戸川越']
  },

  // 千葉県
  {
    id: 'naritasan-shinshoji',
    name: '成田山新勝寺',
    type: 'temple',
    prefecture: '千葉県',
    city: '成田市',
    address: '千葉県成田市成田1番地',
    sect: '真言宗智山派',
    founded: 940,
    description: '不動明王で有名。初詣の参拝者数は全国屈指。',
    benefits: ['交通安全', '厄除け', '商売繁盛'],
    location: { lat: 35.7833, lng: 140.3167 },
    culturalValue: 120,
    rarity: 'rare',
    festival: '節分会',
    goshuin: true,
    specialFeatures: ['不動明王', '初詣人気', '護摩祈祷']
  },

  // さらに多くの神社・寺院データを追加...
  // （実際の実装では200箇所以上のデータを含める）
];

// 御朱印データベース
export const GOSHUIN_DATABASE = [
  {
    shrineId: 'ise-jingu',
    name: '伊勢神宮御朱印',
    price: 300,
    description: '日本の総氏神、天照大御神の御朱印',
    rarity: 'mythical',
    limitedTime: false,
    specialDesign: true
  },
  {
    shrineId: 'fushimi-inari',
    name: '伏見稲荷大社御朱印',
    price: 300,
    description: '千本鳥居で有名な稲荷大神の御朱印',
    rarity: 'legendary',
    limitedTime: false,
    specialDesign: false
  },
  {
    shrineId: 'sensoji',
    name: '浅草寺御朱印',
    price: 300,
    description: '東京最古の寺院、観音様の御朱印',
    rarity: 'legendary',
    limitedTime: false,
    specialDesign: false
  }
];

// 文化財データベース
export const CULTURAL_PROPERTY_DATABASE = [
  {
    shrineId: 'todai-ji',
    name: '東大寺金堂（大仏殿）',
    type: '国宝',
    category: '建造物',
    period: '江戸時代',
    description: '現存する世界最大級の木造建造物。大仏を安置する。',
    designatedYear: 1952
  },
  {
    shrineId: 'kinkaku-ji',
    name: '鹿苑寺金閣',
    type: '国宝',
    category: '建造物',
    period: '室町時代',
    description: '金箔で覆われた舎利殿。京都を代表する建築物。',
    designatedYear: 1950
  }
];

// 祭り・イベントデータベース
export const FESTIVAL_DATABASE = [
  {
    id: 'gion-matsuri',
    name: '祇園祭',
    shrineId: 'yasaka-jinja',
    location: '京都市',
    period: '7月1日〜31日',
    description: '日本三大祭りの一つ。山鉾巡行が有名。',
    rarity: 'mythical',
    specialNFT: true,
    culturalValue: 200
  },
  {
    id: 'awa-odori',
    name: '阿波踊り',
    shrineId: 'tokushima-various',
    location: '徳島市',
    period: '8月12日〜15日',
    description: '400年の歴史を持つ盆踊り。「踊る阿呆に見る阿呆」',
    rarity: 'legendary',
    specialNFT: true,
    culturalValue: 150
  }
];

// 都道府県別取得（拡張版）
export const getExpandedShrinesByPrefecture = (prefecture) => {
  return SHRINE_TEMPLE_DATABASE.filter(shrine => shrine.prefecture === prefecture);
};

// レア度別取得
export const getShrinesByRarity = (rarity) => {
  return SHRINE_TEMPLE_DATABASE.filter(shrine => shrine.rarity === rarity);
};

// 御朱印対応の神社・寺院取得
export const getGoshuinShrines = () => {
  return SHRINE_TEMPLE_DATABASE.filter(shrine => shrine.goshuin === true);
};

// 文化財指定の神社・寺院取得
export const getCulturalPropertyShrines = () => {
  return SHRINE_TEMPLE_DATABASE.filter(shrine => 
    shrine.nationalTreasure || shrine.worldHeritage
  );
};

// 祭り開催中の神社・寺院取得
export const getFestivalShrines = (currentMonth) => {
  // 現在の月に開催される祭りがある神社・寺院を返す
  return SHRINE_TEMPLE_DATABASE.filter(shrine => {
    // 簡略化した実装。実際はより詳細な日付チェックを行う
    return shrine.festival && Math.random() > 0.7; // デモ用
  });
};

// 特別NFT対象の祭り取得
export const getSpecialNFTFestivals = () => {
  return FESTIVAL_DATABASE.filter(festival => festival.specialNFT);
};

// レア度倍率
export const RARITY_MULTIPLIERS = {
  common: 1,
  uncommon: 1.5,
  rare: 2,
  epic: 3,
  legendary: 5
};

// 検索機能
export const searchShrines = (query) => {
  const lowerQuery = query.toLowerCase();
  return SHRINE_TEMPLE_DATABASE.filter(shrine => 
    shrine.name.toLowerCase().includes(lowerQuery) ||
    shrine.prefecture.includes(query) ||
    shrine.city.includes(query) ||
    (shrine.deity && shrine.deity.includes(query)) ||
    (shrine.sect && shrine.sect.includes(query))
  );
};

export default SHRINE_TEMPLE_DATABASE;