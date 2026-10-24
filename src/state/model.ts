// プレイヤーのデータと、それを変える純粋な関数。端末内（localStorage）に保存する。
// チェーンへの記録は「控え」として状態（未送信・送信中・記録済み・失敗）だけを持つ。

import { jstDay } from '../chain/codec';
import { COMMON_PARTS, signatureParts } from '../data/parts';

export type LocationCheck = 'gps' | 'self' | 'demo';
export type ChainStatus = 'local' | 'sending' | 'confirmed' | 'failed' | 'skipped';

export interface ChainRecord {
  status: ChainStatus;
  txHash?: string;
  reason?: string;
  address?: string;
}

export interface Visit {
  id: string;
  placeId: string;
  placeName: string;
  at: string;
  /** 日本時間の日付（1970-01-01 からの日数）。同じ神社は1日1回 */
  day: number;
  check: LocationCheck;
  distanceM?: number;
  demo: boolean;
  /** この参拝で手に入った部品 */
  rewards: string[];
  chain: ChainRecord;
}

export interface Report {
  id: string;
  visitId: string;
  placeId: string;
  status: number;
  note: string;
  at: string;
  chain: ChainRecord;
}

export interface Placement {
  x: number;
  y: number;
  partId: string;
}

export interface CustomPlace {
  id: string;
  name: string;
  /** 小数第3位（約100m）に丸めた神社の座標。任意 */
  lat?: number;
  lng?: number;
  createdAt: string;
  chain?: ChainRecord;
}

export interface Game {
  version: 1;
  createdAt: string;
  name: string;
  onboarded: boolean;
  visits: Visit[];
  reports: Report[];
  placements: Placement[];
  honden: string;
  customPlaces: CustomPlace[];
  settings: {
    demo: boolean;
    demoPlaceId: string;
    /** 参拝をチェーンに記録してよいか（null はまだ聞いていない） */
    chainConsent: boolean | null;
  };
}

export const DEFAULT_NAME = 'わたしの神社';
export const DEFAULT_DEMO_PLACE = 'kasuga-taisha';
export const REPORT_STATUS = ['ふだんどおり参拝できる', '工事・修復中', '立ち入れない場所がある', '閉鎖・参拝できない'] as const;

export const emptyGame = (now = new Date()): Game => ({
  version: 1,
  createdAt: now.toISOString(),
  name: DEFAULT_NAME,
  onboarded: false,
  visits: [],
  reports: [],
  placements: [],
  honden: 'hokora',
  customPlaces: [],
  settings: { demo: false, demoPlaceId: DEFAULT_DEMO_PLACE, chainConsent: null },
});

export const newId = (prefix: string) => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

// ── 育ち方（Focus Tree のように、通うほど広がる） ──

export const LEVELS = [
  { min: 0, size: 5, name: '祠の境内' },
  { min: 2, size: 7, name: '村の社' },
  { min: 4, size: 9, name: '里の社' },
  { min: 7, size: 11, name: '郷の社' },
  { min: 10, size: 13, name: '国の社' },
  { min: 14, size: 15, name: '八百万の杜' },
] as const;

export const distinctShrines = (g: Game) => new Set(g.visits.map((v) => v.placeId)).size;

export function levelOf(g: Game) {
  const n = distinctShrines(g);
  let i = 0;
  LEVELS.forEach((l, idx) => {
    if (n >= l.min) i = idx;
  });
  const cur = LEVELS[i]!;
  const next = LEVELS[i + 1];
  return { index: i, ...cur, radius: (cur.size - 1) / 2, shrines: n, next, toNext: next ? next.min - n : 0 };
}

// ── 報酬（決まった規則で計算するので、チェーンの参拝記録から誰でも再計算できる） ──

const hashStr = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

export function rewardsFor(placeId: string, firstTimeHere: boolean, day: number): string[] {
  const common = COMMON_PARTS[hashStr(`${placeId}:${day}`) % COMMON_PARTS.length]!;
  const out = ['path', 'path', common];
  if (firstTimeHere) {
    const sig = signatureParts(placeId);
    if (sig.length) out.push(...sig);
    else out.push(COMMON_PARTS[hashStr(`${placeId}:first`) % COMMON_PARTS.length]!);
  }
  return out;
}

// ── 持ち物と配置 ──

export function inventory(g: Game): Record<string, number> {
  const inv: Record<string, number> = {};
  for (const v of g.visits) for (const p of v.rewards) inv[p] = (inv[p] ?? 0) + 1;
  for (const p of g.placements) inv[p.partId] = (inv[p.partId] ?? 0) - 1;
  if (g.honden !== 'hokora') inv[g.honden] = (inv[g.honden] ?? 0) - 1;
  return inv;
}

export const cellKey = (x: number, y: number) => `${x},${y}`;
const NEIGHBORS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

/** 中央の本殿から、隣り合う部品をたどって届くか */
function connected(placements: Placement[]): boolean {
  const occupied = new Set(placements.map((p) => cellKey(p.x, p.y)));
  occupied.add(cellKey(0, 0));
  const seen = new Set([cellKey(0, 0)]);
  const queue: [number, number][] = [[0, 0]];
  while (queue.length) {
    const [x, y] = queue.shift()!;
    for (const [dx, dy] of NEIGHBORS) {
      const k = cellKey(x + dx, y + dy);
      if (occupied.has(k) && !seen.has(k)) {
        seen.add(k);
        queue.push([x + dx, y + dy]);
      }
    }
  }
  return seen.size === occupied.size;
}

export type PlaceCheck = { ok: true } | { ok: false; reason: string };

export function canPlace(g: Game, x: number, y: number, partId: string): PlaceCheck {
  const { radius } = levelOf(g);
  if (Math.abs(x) > radius || Math.abs(y) > radius) return { ok: false, reason: 'まだ境内の外です。神社に通うと広がります。' };
  if (x === 0 && y === 0) return { ok: false, reason: '中央は本殿の場所です。' };
  if (g.placements.some((p) => p.x === x && p.y === y)) return { ok: false, reason: 'もう部品が置いてあります。' };
  if ((inventory(g)[partId] ?? 0) <= 0) return { ok: false, reason: 'この部品は手元にありません。' };
  const touching = NEIGHBORS.some(([dx, dy]) => (x + dx === 0 && y + dy === 0) || g.placements.some((p) => p.x === x + dx && p.y === y + dy));
  if (!touching) return { ok: false, reason: '本殿か、置いた部品の隣にしか置けません。' };
  return { ok: true };
}

export function canRemove(g: Game, x: number, y: number): PlaceCheck {
  const rest = g.placements.filter((p) => !(p.x === x && p.y === y));
  if (rest.length === g.placements.length) return { ok: false, reason: 'ここには何も置いていません。' };
  if (!connected(rest)) return { ok: false, reason: 'これを外すと、本殿とつながらない部品が出てしまいます。端から外してください。' };
  return { ok: true };
}

/** 参拝の取り消しなどで持ち物が足りなくなったとき、配置を辻褄の合う形に戻す */
export function normalize(g: Game): Game {
  let placements = [...g.placements];
  let honden = g.honden;
  const radius = levelOf(g).radius;
  placements = placements.filter((p) => Math.abs(p.x) <= radius && Math.abs(p.y) <= radius);
  const owned: Record<string, number> = {};
  for (const v of g.visits) for (const p of v.rewards) owned[p] = (owned[p] ?? 0) + 1;
  if (honden !== 'hokora' && (owned[honden] ?? 0) <= 0) honden = 'hokora';
  if (honden !== 'hokora') owned[honden] = (owned[honden] ?? 0) - 1;
  const kept: Placement[] = [];
  for (const p of placements) {
    if ((owned[p.partId] ?? 0) > 0) {
      owned[p.partId] = (owned[p.partId] ?? 0) - 1;
      kept.push(p);
    }
  }
  // 本殿から切り離された部品は外す（後から置いたものから）
  while (kept.length && !connected(kept)) kept.pop();
  return { ...g, placements: kept, honden };
}

// ── 読み取り ──

export const visitedToday = (g: Game, placeId: string, now = Date.now()) =>
  g.visits.some((v) => v.placeId === placeId && v.day === jstDay(now));

export const visitsAt = (g: Game, placeId: string) =>
  g.visits.filter((v) => v.placeId === placeId).sort((a, b) => b.at.localeCompare(a.at));

// ── 変更 ──

export type Action =
  | { type: 'setName'; name: string }
  | { type: 'completeOnboarding' }
  | { type: 'addVisit'; visit: Omit<Visit, 'rewards' | 'day'> }
  | { type: 'setVisitChain'; visitId: string; chain: ChainRecord }
  | { type: 'addReport'; report: Report }
  | { type: 'setReportChain'; reportId: string; chain: ChainRecord }
  | { type: 'place'; x: number; y: number; partId: string }
  | { type: 'remove'; x: number; y: number }
  | { type: 'setHonden'; partId: string }
  | { type: 'addCustomPlace'; place: CustomPlace }
  | { type: 'setPlaceChain'; placeId: string; chain: ChainRecord }
  | { type: 'setDemo'; demo: boolean; demoPlaceId?: string }
  | { type: 'setChainConsent'; consent: boolean }
  | { type: 'clearDemo' }
  | { type: 'replace'; game: Game };

export function reduce(g: Game, a: Action): Game {
  switch (a.type) {
    case 'setName': {
      const name = a.name.trim().slice(0, 30);
      return name ? { ...g, name } : g;
    }
    case 'completeOnboarding':
      return { ...g, onboarded: true };
    case 'addVisit': {
      const day = jstDay(new Date(a.visit.at).getTime());
      if (g.visits.some((v) => v.placeId === a.visit.placeId && v.day === day)) return g;
      const first = !g.visits.some((v) => v.placeId === a.visit.placeId);
      const visit: Visit = { ...a.visit, day, rewards: rewardsFor(a.visit.placeId, first, day) };
      return { ...g, onboarded: true, visits: [...g.visits, visit] };
    }
    case 'setVisitChain':
      return { ...g, visits: g.visits.map((v) => (v.id === a.visitId ? { ...v, chain: a.chain } : v)) };
    case 'addReport':
      return { ...g, reports: [...g.reports, a.report] };
    case 'setReportChain':
      return { ...g, reports: g.reports.map((r) => (r.id === a.reportId ? { ...r, chain: a.chain } : r)) };
    case 'place':
      return canPlace(g, a.x, a.y, a.partId).ok ? { ...g, placements: [...g.placements, { x: a.x, y: a.y, partId: a.partId }] } : g;
    case 'remove':
      return canRemove(g, a.x, a.y).ok ? { ...g, placements: g.placements.filter((p) => !(p.x === a.x && p.y === a.y)) } : g;
    case 'setHonden': {
      if (a.partId === g.honden) return g;
      if (a.partId !== 'hokora' && (inventory(g)[a.partId] ?? 0) <= 0) return g;
      return { ...g, honden: a.partId };
    }
    case 'addCustomPlace':
      return { ...g, customPlaces: [...g.customPlaces, a.place] };
    case 'setPlaceChain':
      return { ...g, customPlaces: g.customPlaces.map((p) => (p.id === a.placeId ? { ...p, chain: a.chain } : p)) };
    case 'setDemo':
      return { ...g, settings: { ...g.settings, demo: a.demo, demoPlaceId: a.demoPlaceId ?? g.settings.demoPlaceId } };
    case 'setChainConsent':
      return { ...g, settings: { ...g.settings, chainConsent: a.consent } };
    case 'clearDemo': {
      const demoIds = new Set(g.visits.filter((v) => v.demo).map((v) => v.id));
      return normalize({
        ...g,
        visits: g.visits.filter((v) => !v.demo),
        reports: g.reports.filter((r) => !demoIds.has(r.visitId)),
      });
    }
    case 'replace':
      return a.game;
  }
}
