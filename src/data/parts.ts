// 自分の神社に置く「部品」。部品そのものはゲーム上の創作。
// 神社ごとの「ゆかりの部品」は、出典で確かめられる見どころ（shrines.ts の known）にだけ結び付ける。

import { SHRINE_BY_ID } from './shrines';

export type PartKind = 'building' | 'gate' | 'guardian' | 'light' | 'nature' | 'small' | 'path';

export interface Part {
  id: string;
  name: string;
  kind: PartKind;
  /** Illustration の id */
  art: string;
  /** 図鑑（事実と出典）の項目 */
  featureId?: string;
  /** 本殿にできる社殿 */
  canBeHonden?: boolean;
}

export const PARTS: Part[] = [
  { id: 'hokora', name: '小さな祠', kind: 'building', art: 'sessha', canBeHonden: true },
  { id: 'path', name: '玉砂利の参道', kind: 'path', art: 'path' },
  { id: 'torii-myojin', name: '明神鳥居', kind: 'gate', art: 'torii-myojin', featureId: 'torii-myojin' },
  { id: 'torii-shinmei', name: '神明鳥居', kind: 'gate', art: 'torii-shinmei', featureId: 'torii-shinmei' },
  { id: 'torii-ryobu', name: '両部鳥居', kind: 'gate', art: 'torii-ryobu', featureId: 'torii-ryobu' },
  { id: 'komainu', name: '狛犬（阿吽）', kind: 'guardian', art: 'komainu-aun', featureId: 'komainu-aun' },
  { id: 'kitsune', name: '狐の像', kind: 'guardian', art: 'shinshi-kitsune', featureId: 'shinshi-kitsune' },
  { id: 'shika', name: '鹿', kind: 'guardian', art: 'shinshi-shika', featureId: 'shinshi-shika' },
  { id: 'ushi', name: '牛の像', kind: 'guardian', art: 'shinshi-ushi', featureId: 'shinshi-ushi' },
  { id: 'saru', name: '猿の像', kind: 'guardian', art: 'shinshi-saru', featureId: 'shinshi-saru' },
  { id: 'toro', name: '石灯籠', kind: 'light', art: 'toro', featureId: 'toro' },
  { id: 'temizuya', name: '手水舎', kind: 'small', art: 'temizuya', featureId: 'temizuya' },
  { id: 'ema', name: '絵馬掛け', kind: 'small', art: 'ema', featureId: 'ema' },
  { id: 'shimenawa', name: '注連縄', kind: 'small', art: 'shimenawa', featureId: 'shimenawa' },
  { id: 'shinboku', name: '御神木', kind: 'nature', art: 'shinboku', featureId: 'shinboku' },
  { id: 'sessha', name: '摂社・末社', kind: 'building', art: 'sessha', featureId: 'sessha' },
  { id: 'style-nagare', name: '流造の社殿', kind: 'building', art: 'style-nagare', featureId: 'style-nagare', canBeHonden: true },
  { id: 'style-shinmei', name: '神明造の社殿', kind: 'building', art: 'style-shinmei', featureId: 'style-shinmei', canBeHonden: true },
  { id: 'style-taisha', name: '大社造の社殿', kind: 'building', art: 'style-taisha', featureId: 'style-taisha', canBeHonden: true },
  { id: 'style-kasuga', name: '春日造の社殿', kind: 'building', art: 'style-kasuga', featureId: 'style-kasuga', canBeHonden: true },
  { id: 'style-gongen', name: '権現造の社殿', kind: 'building', art: 'style-gongen', featureId: 'style-gongen', canBeHonden: true },
];

export const PART_BY_ID: Record<string, Part> = Object.fromEntries(PARTS.map((p) => [p.id, p]));

/** 図鑑の見どころ → 部品 */
const PART_BY_FEATURE: Record<string, string> = Object.fromEntries(
  PARTS.filter((p) => p.featureId).map((p) => [p.featureId as string, p.id]),
);

/** どの神社でも手に入る部品（日付と神社で決まった順に巡る） */
export const COMMON_PARTS = ['toro', 'temizuya', 'shinboku', 'komainu', 'ema', 'shimenawa', 'sessha', 'torii-myojin', 'style-nagare'];

/** その神社にゆかりのある部品（出典で確かめられる見どころから） */
export function signatureParts(placeId: string): string[] {
  const s = SHRINE_BY_ID[placeId];
  if (!s) return [];
  return [...new Set(s.known.map((k) => PART_BY_FEATURE[k.featureId]).filter((x): x is string => Boolean(x)))];
}
