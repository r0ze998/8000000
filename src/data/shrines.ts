// 収録している神社。ここに書くのは出典付きの事実だけ。
// 座標は地図アプリで開くための概略値で、境内の正確な位置ではない。
// このアプリはいずれの神社とも提携・公認の関係にない。

import type { Fact } from './features';

export interface KnownFeature {
  featureId: string;
  note: string;
  sources: string[];
}

export interface Shrine {
  id: string;
  name: string;
  kana: string;
  prefecture: string;
  city: string;
  lat: number;
  lng: number;
  /** 主祭神（出典の表記を簡略化したもの） */
  deities: string;
  facts: Fact[];
  /** 出典で確認できる、この神社の見どころ */
  known: KnownFeature[];
  official?: string;
}

export const SHRINES: Shrine[] = [
  {
    id: 'meiji-jingu',
    name: '明治神宮',
    kana: 'めいじじんぐう',
    prefecture: '東京都',
    city: '渋谷区',
    lat: 35.6764,
    lng: 139.6993,
    deities: '明治天皇・昭憲皇太后',
    facts: [{ text: '1920年（大正9年）に創建された。', sources: ['wp-meiji'] }],
    known: [
      { featureId: 'torii-myojin', note: '第二鳥居（大鳥居）は木造の明神鳥居。', sources: ['meiji-faq'] },
    ],
    official: 'https://www.meijijingu.or.jp/',
  },
  {
    id: 'hie-jinja',
    name: '日枝神社',
    kana: 'ひえじんじゃ',
    prefecture: '東京都',
    city: '千代田区',
    lat: 35.6745,
    lng: 139.7397,
    deities: '大山咋神',
    facts: [{ text: '例祭の山王祭は江戸三大祭の一つに数えられる。', sources: ['wp-hie', 'wp-edo3'] }],
    known: [{ featureId: 'shinshi-saru', note: '猿の像（猿神像）がある。', sources: ['wp-shinshi'] }],
    official: 'https://www.hiejinja.net/',
  },
  {
    id: 'kanda-myojin',
    name: '神田明神（神田神社）',
    kana: 'かんだみょうじん',
    prefecture: '東京都',
    city: '千代田区',
    lat: 35.702,
    lng: 139.7679,
    deities: '大己貴命・少彦名命・平将門命',
    facts: [{ text: '神田祭は江戸三大祭の一つに数えられる。', sources: ['wp-kanda', 'wp-edo3'] }],
    known: [],
    official: 'https://www.kandamyoujin.or.jp/',
  },
  {
    id: 'fushimi-inari',
    name: '伏見稲荷大社',
    kana: 'ふしみいなりたいしゃ',
    prefecture: '京都府',
    city: '京都市伏見区',
    lat: 34.9671,
    lng: 135.7727,
    deities: '稲荷大神（宇迦之御魂大神ほか）',
    facts: [
      { text: '全国の稲荷神社の総本宮とされる。', sources: ['wp-fushimi'] },
      { text: '奉納された鳥居が連なる「千本鳥居」で知られる。', sources: ['wp-fushimi'] },
    ],
    known: [
      { featureId: 'shinshi-kitsune', note: '狐は稲荷大神の眷属とされ、眷属を祀る白狐社がある。', sources: ['wp-fushimi'] },
    ],
    official: 'https://inari.jp/',
  },
  {
    id: 'yasaka-jinja',
    name: '八坂神社',
    kana: 'やさかじんじゃ',
    prefecture: '京都府',
    city: '京都市東山区',
    lat: 35.0037,
    lng: 135.7785,
    deities: '素戔嗚尊・櫛稲田姫命・八柱御子神',
    facts: [
      { text: '祇園祭は八坂神社の祭礼。', sources: ['wp-yasaka'] },
      { text: '本殿は「祇園造」と呼ばれる独自の様式。', sources: ['wp-yasaka'] },
    ],
    known: [],
    official: 'https://www.yasaka-jinja.or.jp/',
  },
  {
    id: 'kitano-tenmangu',
    name: '北野天満宮',
    kana: 'きたのてんまんぐう',
    prefecture: '京都府',
    city: '京都市上京区',
    lat: 35.0313,
    lng: 135.7351,
    deities: '菅原道真',
    facts: [{ text: '太宰府天満宮とともに、全国の天満宮の総本社とされる。', sources: ['wp-dazaifu'] }],
    known: [
      { featureId: 'style-gongen', note: '権現造の代表例の一つに挙げられる。', sources: ['wp-gongen'] },
      { featureId: 'shinshi-ushi', note: '臥牛像が多く奉納され、道真と牛にまつわる言い伝えが多く伝わる。', sources: ['wp-kitano'] },
    ],
    official: 'https://kitanotenmangu.or.jp/',
  },
  {
    id: 'kasuga-taisha',
    name: '春日大社',
    kana: 'かすがたいしゃ',
    prefecture: '奈良県',
    city: '奈良市',
    lat: 34.6812,
    lng: 135.8484,
    deities: '武甕槌命・経津主命・天児屋根命・比売神',
    facts: [{ text: '奈良時代の768年に創建されたと伝わる。', sources: ['wp-kasugataisha'] }],
    known: [
      { featureId: 'style-kasuga', note: '本殿は春日造の代表例。', sources: ['wp-kasuga', 'wp-kasugataisha'] },
      { featureId: 'shinshi-shika', note: '鹿は春日大社の神使とされる。', sources: ['wp-kasugataisha'] },
      { featureId: 'toro', note: '奉納された多数の石灯籠・釣灯籠で知られる。', sources: ['wp-kasugataisha'] },
    ],
    official: 'https://www.kasugataisha.or.jp/',
  },
  {
    id: 'izumo-taisha',
    name: '出雲大社',
    kana: 'いずもおおやしろ',
    prefecture: '島根県',
    city: '出雲市',
    lat: 35.402,
    lng: 132.6855,
    deities: '大国主大神',
    facts: [
      {
        text: '拝礼は一般的な「二拝二拍手一拝」ではなく「二拝四拍手一拝」とされる。',
        sources: ['izumo-official'],
      },
    ],
    known: [
      { featureId: 'style-taisha', note: '本殿は大社造の代表例。', sources: ['wp-taisha', 'wp-izumo'] },
      { featureId: 'shimenawa', note: '神楽殿の大注連縄が知られる。', sources: ['wp-izumo'] },
    ],
    official: 'https://izumooyashiro.or.jp/',
  },
  {
    id: 'ise-naiku',
    name: '伊勢神宮 内宮（皇大神宮）',
    kana: 'いせじんぐう ないくう',
    prefecture: '三重県',
    city: '伊勢市',
    lat: 34.4551,
    lng: 136.7258,
    deities: '天照大御神',
    facts: [{ text: '20年ごとに社殿を建て替える式年遷宮が行われる。', sources: ['wp-sengu'] }],
    known: [
      { featureId: 'style-shinmei', note: '正殿は唯一神明造。', sources: ['wp-shinmei', 'wp-naiku'] },
      { featureId: 'torii-shinmei', note: '鳥居は神明鳥居の形式（伊勢鳥居）。', sources: ['wp-torii'] },
    ],
    official: 'https://www.isejingu.or.jp/',
  },
  {
    id: 'tsurugaoka-hachimangu',
    name: '鶴岡八幡宮',
    kana: 'つるがおかはちまんぐう',
    prefecture: '神奈川県',
    city: '鎌倉市',
    lat: 35.3259,
    lng: 139.5565,
    deities: '応神天皇・比売神・神功皇后',
    facts: [{ text: '源頼朝が現在地に遷し、鎌倉の町づくりの中心とした。', sources: ['wp-tsurugaoka'] }],
    known: [],
    official: 'https://www.hachimangu.or.jp/',
  },
  {
    id: 'dazaifu-tenmangu',
    name: '太宰府天満宮',
    kana: 'だざいふてんまんぐう',
    prefecture: '福岡県',
    city: '太宰府市',
    lat: 33.5215,
    lng: 130.5349,
    deities: '菅原道真',
    facts: [
      {
        text: '道真の亡骸を運ぶ牛車が止まった安楽寺の境内に、905年に廟が建てられたのが起源とされる。',
        sources: ['wp-dazaifu'],
      },
    ],
    known: [{ featureId: 'shinshi-ushi', note: '境内に牛の像（御神牛）がある。', sources: ['wp-dazaifu'] }],
    official: 'https://www.dazaifutenmangu.or.jp/',
  },
  {
    id: 'sumiyoshi-taisha',
    name: '住吉大社',
    kana: 'すみよしたいしゃ',
    prefecture: '大阪府',
    city: '大阪市住吉区',
    lat: 34.6126,
    lng: 135.4934,
    deities: '底筒男命・中筒男命・表筒男命・息長足姫命',
    facts: [{ text: '本殿は「住吉造」と呼ばれる妻入の様式で、国宝に指定されている。', sources: ['wp-sumiyoshi'] }],
    known: [],
    official: 'https://www.sumiyoshitaisha.net/',
  },
  {
    id: 'itsukushima-jinja',
    name: '嚴島神社',
    kana: 'いつくしまじんじゃ',
    prefecture: '広島県',
    city: '廿日市市',
    lat: 34.2959,
    lng: 132.3199,
    deities: '市杵島姫命・田心姫命・湍津姫命',
    facts: [{ text: '「厳島神社」の名で世界遺産に登録されている。', sources: ['wp-itsukushima'] }],
    known: [{ featureId: 'torii-ryobu', note: '海上の大鳥居は両部鳥居。', sources: ['wp-torii', 'wp-itsukushima'] }],
    official: 'https://www.itsukushimajinja.jp/',
  },
  {
    id: 'nikko-toshogu',
    name: '日光東照宮',
    kana: 'にっこうとうしょうぐう',
    prefecture: '栃木県',
    city: '日光市',
    lat: 36.7581,
    lng: 139.5988,
    deities: '徳川家康（東照大権現）',
    facts: [{ text: '「日光の社寺」として世界遺産に登録されている。', sources: ['wp-toshogu'] }],
    known: [{ featureId: 'style-gongen', note: '社殿は権現造の代表例。', sources: ['wp-gongen', 'wp-toshogu'] }],
    official: 'https://www.toshogu.jp/',
  },
];

export const SHRINE_BY_ID: Record<string, Shrine> = Object.fromEntries(SHRINES.map((s) => [s.id, s]));

/** 主祭神・所在地の出典（各神社の Wikipedia 記事） */
export const SHRINE_SOURCE: Record<string, string> = {
  'meiji-jingu': 'wp-meiji',
  'hie-jinja': 'wp-hie',
  'kanda-myojin': 'wp-kanda',
  'fushimi-inari': 'wp-fushimi',
  'yasaka-jinja': 'wp-yasaka',
  'kitano-tenmangu': 'wp-kitano',
  'kasuga-taisha': 'wp-kasugataisha',
  'izumo-taisha': 'wp-izumo',
  'ise-naiku': 'wp-naiku',
  'tsurugaoka-hachimangu': 'wp-tsurugaoka',
  'dazaifu-tenmangu': 'wp-dazaifu',
  'sumiyoshi-taisha': 'wp-sumiyoshi',
  'itsukushima-jinja': 'wp-itsukushima',
  'nikko-toshogu': 'wp-toshogu',
};
