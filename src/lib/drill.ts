// 見分け稽古の問題づくり。

import { FEATURES, type Feature } from '../data/features';

export interface DrillQuestion {
  id: string;
  kind: 'shape' | 'shinshi';
  /** 正解の見どころ */
  answer: Feature;
  prompt: string;
  options: Feature[];
}

export const DRILL_GROUPS: Record<string, { label: string; kind: DrillQuestion['kind'] }> = {
  torii: { label: '鳥居の形', kind: 'shape' },
  style: { label: '社殿のかたち', kind: 'shape' },
  shinshi: { label: '神使', kind: 'shinshi' },
};

export type Rng = () => number;

export function shuffle<T>(items: T[], rng: Rng = Math.random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j] as T, a[i] as T];
  }
  return a;
}

export const groupMembers = (group: string) => FEATURES.filter((f) => f.drillGroup === group);

function questionFor(answer: Feature, rng: Rng): DrillQuestion {
  const group = answer.drillGroup as string;
  const kind = DRILL_GROUPS[group]?.kind ?? 'shape';
  const options = shuffle(groupMembers(group), rng);
  const prompt =
    kind === 'shinshi'
      ? `${answer.drillCue}で、神の使いとして像などに表されることが多いのは？`
      : group === 'torii'
        ? 'この鳥居の形は？'
        : 'この社殿のかたちは？';
  return { id: `${answer.id}-${Math.floor(rng() * 1e9)}`, kind, answer, prompt, options };
}

/**
 * 1回分の問題を作る。
 * group を指定するとその組だけ（最初のチュートリアル用）。
 * 指定しなければ全組から、まだ知らないものを優先して選ぶ。
 */
export function buildRound(opts: { group?: string; size?: number; known?: Set<string>; rng?: Rng } = {}): DrillQuestion[] {
  const rng = opts.rng ?? Math.random;
  const pool = FEATURES.filter((f) => f.drillGroup && (!opts.group || f.drillGroup === opts.group));
  const size = Math.min(opts.size ?? (opts.group ? pool.length : 5), pool.length);
  const known = opts.known ?? new Set<string>();
  const unknownFirst = [...shuffle(pool.filter((f) => !known.has(f.id)), rng), ...shuffle(pool.filter((f) => known.has(f.id)), rng)];
  const picked = shuffle(unknownFirst.slice(0, size), rng);
  return picked.map((f) => questionFor(f, rng));
}
