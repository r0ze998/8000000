// 帳面（ユーザーデータ）のかたちと、それを変える純粋な関数。
// すべて端末内（localStorage）に保存し、外部には送らない。

export type LocationCheck = 'gps' | 'self' | 'demo';

export interface Visit {
  id: string;
  placeId: string;
  placeName: string;
  startedAt: string;
  closedAt?: string;
  /** 現地にいることをどう確かめたか */
  check: LocationCheck;
  /** gps のとき、神社の登録座標からの概略距離（m） */
  distanceM?: number;
  memo: string;
  demo: boolean;
}

export interface Sighting {
  id: string;
  featureId: string;
  visitId: string;
  at: string;
  note: string;
}

export interface Knowledge {
  learnedAt: string;
  via: 'read' | 'drill' | 'visit';
}

export interface CustomPlace {
  id: string;
  name: string;
  /** 小数第3位（約100m）に丸めた座標。保存しない選択もできる */
  lat?: number;
  lng?: number;
  createdAt: string;
}

export interface Notebook {
  version: 1;
  createdAt: string;
  title: string;
  onboarded: boolean;
  knowledge: Record<string, Knowledge>;
  pinned: string[];
  visits: Visit[];
  sightings: Sighting[];
  customPlaces: CustomPlace[];
  drill: { rounds: number; answered: number; correct: number };
  settings: { demo: boolean; demoPlaceId: string };
}

export const MAX_PINNED = 3;
export const DEFAULT_TITLE = 'わたしの帳面';
export const DEFAULT_DEMO_PLACE = 'kasuga-taisha';

export const emptyNotebook = (now = new Date()): Notebook => ({
  version: 1,
  createdAt: now.toISOString(),
  title: DEFAULT_TITLE,
  onboarded: false,
  knowledge: {},
  pinned: [],
  visits: [],
  sightings: [],
  customPlaces: [],
  drill: { rounds: 0, answered: 0, correct: 0 },
  settings: { demo: false, demoPlaceId: DEFAULT_DEMO_PLACE },
});

export const newId = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

// ── 読み取り ────────────────────────────────

export const activeVisit = (nb: Notebook) => nb.visits.find((v) => !v.closedAt);

export const sightingsOf = (nb: Notebook, visitId: string) => nb.sightings.filter((s) => s.visitId === visitId);

/** その見どころを、閉じた（綴じた）記録の中で最初に見た記録 */
export const firstSighting = (nb: Notebook, featureId: string) => {
  const closed = new Set(nb.visits.filter((v) => v.closedAt).map((v) => v.id));
  return nb.sightings
    .filter((s) => s.featureId === featureId && closed.has(s.visitId))
    .sort((a, b) => a.at.localeCompare(b.at))[0];
};

export type FeatureStatus = 'unknown' | 'learned' | 'seen';

export const featureStatus = (nb: Notebook, featureId: string): FeatureStatus => {
  if (firstSighting(nb, featureId)) return 'seen';
  if (nb.knowledge[featureId]) return 'learned';
  return 'unknown';
};

/** この記録で「初めて見た」ことになった見どころ */
export const firstsInVisit = (nb: Notebook, visitId: string) => {
  return sightingsOf(nb, visitId).filter((s) => firstSighting(nb, s.featureId)?.id === s.id);
};

export const placeVisits = (nb: Notebook, placeId: string) =>
  nb.visits.filter((v) => v.placeId === placeId && v.closedAt).sort((a, b) => b.startedAt.localeCompare(a.startedAt));

// ── 変更 ─────────────────────────────────

export type Action =
  | { type: 'setTitle'; title: string }
  | { type: 'completeOnboarding' }
  | { type: 'learn'; featureIds: string[]; via: Knowledge['via']; at: string }
  | { type: 'togglePin'; featureId: string }
  | { type: 'startVisit'; visit: Visit }
  | { type: 'toggleSighting'; visitId: string; featureId: string; id: string; at: string }
  | { type: 'setSightingNote'; sightingId: string; note: string }
  | { type: 'setVisitMemo'; visitId: string; memo: string }
  | { type: 'closeVisit'; visitId: string; at: string }
  | { type: 'discardVisit'; visitId: string }
  | { type: 'deleteVisit'; visitId: string }
  | { type: 'addCustomPlace'; place: CustomPlace }
  | { type: 'drillRound'; answered: number; correct: number }
  | { type: 'setDemo'; demo: boolean; demoPlaceId?: string }
  | { type: 'clearDemoRecords' }
  | { type: 'replace'; notebook: Notebook };

export function reduce(nb: Notebook, action: Action): Notebook {
  switch (action.type) {
    case 'setTitle': {
      const title = action.title.trim().slice(0, 30);
      return title ? { ...nb, title } : nb;
    }
    case 'completeOnboarding':
      return { ...nb, onboarded: true };
    case 'learn': {
      const knowledge = { ...nb.knowledge };
      for (const id of action.featureIds) {
        if (!knowledge[id]) knowledge[id] = { learnedAt: action.at, via: action.via };
      }
      return { ...nb, knowledge };
    }
    case 'togglePin': {
      if (nb.pinned.includes(action.featureId)) {
        return { ...nb, pinned: nb.pinned.filter((id) => id !== action.featureId) };
      }
      if (nb.pinned.length >= MAX_PINNED) return nb;
      return { ...nb, pinned: [...nb.pinned, action.featureId] };
    }
    case 'startVisit': {
      if (activeVisit(nb)) return nb;
      return { ...nb, visits: [...nb.visits, action.visit] };
    }
    case 'toggleSighting': {
      const existing = nb.sightings.find((s) => s.visitId === action.visitId && s.featureId === action.featureId);
      if (existing) return { ...nb, sightings: nb.sightings.filter((s) => s !== existing) };
      const sighting: Sighting = { id: action.id, featureId: action.featureId, visitId: action.visitId, at: action.at, note: '' };
      return { ...nb, sightings: [...nb.sightings, sighting] };
    }
    case 'setSightingNote':
      return {
        ...nb,
        sightings: nb.sightings.map((s) => (s.id === action.sightingId ? { ...s, note: action.note.slice(0, 200) } : s)),
      };
    case 'setVisitMemo':
      return {
        ...nb,
        visits: nb.visits.map((v) => (v.id === action.visitId ? { ...v, memo: action.memo.slice(0, 1000) } : v)),
      };
    case 'closeVisit': {
      const visit = nb.visits.find((v) => v.id === action.visitId);
      if (!visit || visit.closedAt) return nb;
      // 見たものは「知った」ことにもなる。見つけた探し物はピンから外す
      const seenIds = sightingsOf(nb, visit.id).map((s) => s.featureId);
      const learned = reduce(nb, { type: 'learn', featureIds: seenIds, via: 'visit', at: action.at });
      return {
        ...learned,
        pinned: learned.pinned.filter((id) => !seenIds.includes(id)),
        visits: learned.visits.map((v) => (v.id === visit.id ? { ...v, closedAt: action.at } : v)),
      };
    }
    case 'discardVisit':
    case 'deleteVisit':
      return {
        ...nb,
        visits: nb.visits.filter((v) => v.id !== action.visitId),
        sightings: nb.sightings.filter((s) => s.visitId !== action.visitId),
      };
    case 'addCustomPlace':
      return { ...nb, customPlaces: [...nb.customPlaces, action.place] };
    case 'drillRound':
      return {
        ...nb,
        drill: {
          rounds: nb.drill.rounds + 1,
          answered: nb.drill.answered + action.answered,
          correct: nb.drill.correct + action.correct,
        },
      };
    case 'setDemo':
      return {
        ...nb,
        settings: { demo: action.demo, demoPlaceId: action.demoPlaceId ?? nb.settings.demoPlaceId },
      };
    case 'clearDemoRecords': {
      const demoIds = new Set(nb.visits.filter((v) => v.demo).map((v) => v.id));
      return {
        ...nb,
        visits: nb.visits.filter((v) => !demoIds.has(v.id)),
        sightings: nb.sightings.filter((s) => !demoIds.has(s.visitId)),
      };
    }
    case 'replace':
      return action.notebook;
  }
}
