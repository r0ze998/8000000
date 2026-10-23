// 帳面の保存と復元。壊れたデータは消さずに退避し、旧バージョンのキーには触れない。

import { emptyNotebook, type Notebook } from './model';

export const STORAGE_KEY = 'yaoyorozu.notebook.v1';
export const BACKUP_PREFIX = 'yaoyorozu.notebook.corrupt.';
/** 旧アプリ（v2）が使っていたキー。読むだけで、書き換えも削除もしない */
export const LEGACY_SHRINE_NAME_KEY = 'shrineName';

export type LoadResult =
  | { status: 'fresh'; notebook: Notebook; importedTitle: boolean }
  | { status: 'restored'; notebook: Notebook }
  | { status: 'recovered'; notebook: Notebook; backupKey: string }
  | { status: 'unavailable'; notebook: Notebook };

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isArr = Array.isArray;

/** 形が正しいかを確かめ、足りない項目は既定値で補う。直せないほど壊れていれば null */
export function parseNotebook(raw: unknown): Notebook | null {
  if (!isObj(raw) || raw.version !== 1) return null;
  const base = emptyNotebook();
  if (!isArr(raw.visits) || !isArr(raw.sightings)) return null;

  const visits = raw.visits.filter(
    (v): v is Notebook['visits'][number] =>
      isObj(v) && isStr(v.id) && isStr(v.placeId) && isStr(v.placeName) && isStr(v.startedAt),
  ).map((v) => ({ ...v, memo: isStr(v.memo) ? v.memo : '', demo: v.demo === true, check: v.check ?? 'self' }));
  const visitIds = new Set(visits.map((v) => v.id));
  const sightings = raw.sightings.filter(
    (s): s is Notebook['sightings'][number] =>
      isObj(s) && isStr(s.id) && isStr(s.featureId) && isStr(s.visitId) && visitIds.has(s.visitId) && isStr(s.at),
  ).map((s) => ({ ...s, note: isStr(s.note) ? s.note : '' }));

  const settings = isObj(raw.settings) ? raw.settings : {};
  const drill = isObj(raw.drill) ? raw.drill : {};
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

  return {
    ...base,
    createdAt: isStr(raw.createdAt) ? raw.createdAt : base.createdAt,
    title: isStr(raw.title) && raw.title.trim() ? raw.title : base.title,
    onboarded: raw.onboarded === true,
    knowledge: isObj(raw.knowledge) ? (raw.knowledge as Notebook['knowledge']) : {},
    pinned: isArr(raw.pinned) ? raw.pinned.filter(isStr).slice(0, 3) : [],
    visits,
    sightings,
    customPlaces: isArr(raw.customPlaces)
      ? (raw.customPlaces.filter((p) => isObj(p) && isStr(p.id) && isStr(p.name)) as Notebook['customPlaces'])
      : [],
    drill: { rounds: num(drill.rounds), answered: num(drill.answered), correct: num(drill.correct) },
    settings: {
      demo: settings.demo === true,
      demoPlaceId: isStr(settings.demoPlaceId) ? settings.demoPlaceId : base.settings.demoPlaceId,
    },
  };
}

export function storageAvailable(storage: Storage | undefined = globalThis.localStorage): storage is Storage {
  try {
    if (!storage) return false;
    const probe = '__yaoyorozu_probe__';
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export function loadNotebook(storage: Storage | undefined = globalThis.localStorage, now = new Date()): LoadResult {
  if (!storageAvailable(storage)) return { status: 'unavailable', notebook: emptyNotebook(now) };

  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) {
    const nb = emptyNotebook(now);
    const legacy = storage.getItem(LEGACY_SHRINE_NAME_KEY);
    let importedTitle = false;
    if (legacy) {
      try {
        const name = JSON.parse(legacy);
        if (isStr(name) && name.trim() && name !== 'マイ神社') {
          nb.title = `${name.trim().slice(0, 24)}の帳面`;
          importedTitle = true;
        }
      } catch {
        /* 旧データが読めなくても気にしない */
      }
    }
    return { status: 'fresh', notebook: nb, importedTitle };
  }

  try {
    const parsed = parseNotebook(JSON.parse(raw));
    if (parsed) return { status: 'restored', notebook: parsed };
  } catch {
    /* 下で退避する */
  }
  const backupKey = `${BACKUP_PREFIX}${now.getTime()}`;
  try {
    storage.setItem(backupKey, raw);
  } catch {
    /* 退避できなくても、元のキーは上書きするまで残っている */
  }
  return { status: 'recovered', notebook: emptyNotebook(now), backupKey };
}

export function saveNotebook(nb: Notebook, storage: Storage | undefined = globalThis.localStorage): boolean {
  try {
    if (!storage) return false;
    storage.setItem(STORAGE_KEY, JSON.stringify(nb));
    return true;
  } catch {
    return false;
  }
}
