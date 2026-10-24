// 保存と復元。壊れたデータは消さずに退避し、旧バージョンのキーには触れない。

import { emptyGame, normalize, type ChainRecord, type Game } from './model';

export const STORAGE_KEY = '8000000.shrine.v1';
export const BACKUP_PREFIX = '8000000.shrine.corrupt.';
/** 旧アプリ（v2）が使っていたキー。読むだけで、書き換えも削除もしない */
export const LEGACY_SHRINE_NAME_KEY = 'shrineName';

export type LoadResult =
  | { status: 'fresh'; game: Game; importedName: boolean }
  | { status: 'restored'; game: Game }
  | { status: 'recovered'; game: Game; backupKey: string }
  | { status: 'unavailable'; game: Game };

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const CHAIN_STATUSES = ['local', 'sending', 'confirmed', 'failed', 'skipped'];

function parseChain(v: unknown): ChainRecord {
  if (!isObj(v) || !CHAIN_STATUSES.includes(v.status as string)) return { status: 'local' };
  // 送信中のまま閉じられた記録は、結果がわからないので「失敗（確認が必要）」に戻す
  if (v.status === 'sending') return { ...(v as unknown as ChainRecord), status: 'failed', reason: '送信中にアプリが閉じられました。記録の画面で確かめてください。' };
  return v as unknown as ChainRecord;
}

/** 形を確かめ、足りない項目は既定値で補う。直せないほど壊れていれば null */
export function parseGame(raw: unknown): Game | null {
  if (!isObj(raw) || raw.version !== 1 || !Array.isArray(raw.visits)) return null;
  const base = emptyGame();
  const visits = raw.visits
    .filter((v): v is Record<string, unknown> => isObj(v) && isStr(v.id) && isStr(v.placeId) && isStr(v.placeName) && isStr(v.at) && isNum(v.day))
    .map((v) => ({
      id: v.id as string,
      placeId: v.placeId as string,
      placeName: v.placeName as string,
      at: v.at as string,
      day: v.day as number,
      check: (['gps', 'self', 'demo'].includes(v.check as string) ? v.check : 'self') as Game['visits'][number]['check'],
      distanceM: isNum(v.distanceM) ? v.distanceM : undefined,
      demo: v.demo === true,
      rewards: Array.isArray(v.rewards) ? v.rewards.filter(isStr) : [],
      chain: parseChain(v.chain),
    }));
  const visitIds = new Set(visits.map((v) => v.id));
  const reports = (Array.isArray(raw.reports) ? raw.reports : [])
    .filter((r): r is Record<string, unknown> => isObj(r) && isStr(r.id) && isStr(r.visitId) && visitIds.has(r.visitId) && isStr(r.placeId) && isNum(r.status))
    .map((r) => ({
      id: r.id as string,
      visitId: r.visitId as string,
      placeId: r.placeId as string,
      status: r.status as number,
      note: isStr(r.note) ? r.note : '',
      at: isStr(r.at) ? r.at : base.createdAt,
      chain: parseChain(r.chain),
    }));
  const placements = (Array.isArray(raw.placements) ? raw.placements : []).filter(
    (p): p is Game['placements'][number] => isObj(p) && Number.isInteger(p.x) && Number.isInteger(p.y) && isStr(p.partId),
  );
  const customPlaces = (Array.isArray(raw.customPlaces) ? raw.customPlaces : [])
    .filter((p): p is Record<string, unknown> => isObj(p) && isStr(p.id) && isStr(p.name))
    .map((p) => ({
      id: p.id as string,
      name: p.name as string,
      lat: isNum(p.lat) ? p.lat : undefined,
      lng: isNum(p.lng) ? p.lng : undefined,
      createdAt: isStr(p.createdAt) ? p.createdAt : base.createdAt,
      chain: p.chain ? parseChain(p.chain) : undefined,
    }));
  const settings = isObj(raw.settings) ? raw.settings : {};
  return normalize({
    ...base,
    createdAt: isStr(raw.createdAt) ? raw.createdAt : base.createdAt,
    name: isStr(raw.name) && raw.name.trim() ? raw.name : base.name,
    onboarded: raw.onboarded === true,
    visits,
    reports,
    placements,
    honden: isStr(raw.honden) ? raw.honden : 'hokora',
    customPlaces,
    settings: {
      demo: settings.demo === true,
      demoPlaceId: isStr(settings.demoPlaceId) ? settings.demoPlaceId : base.settings.demoPlaceId,
      chainConsent: typeof settings.chainConsent === 'boolean' ? settings.chainConsent : null,
    },
  });
}

export function storageAvailable(storage: Storage | undefined = globalThis.localStorage): storage is Storage {
  try {
    if (!storage) return false;
    const probe = '__8000000_probe__';
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export function loadGame(storage: Storage | undefined = globalThis.localStorage, now = new Date()): LoadResult {
  if (!storageAvailable(storage)) return { status: 'unavailable', game: emptyGame(now) };
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) {
    const game = emptyGame(now);
    let importedName = false;
    try {
      const legacy = storage.getItem(LEGACY_SHRINE_NAME_KEY);
      const name = legacy ? JSON.parse(legacy) : null;
      if (isStr(name) && name.trim() && name !== 'マイ神社') {
        game.name = name.trim().slice(0, 30);
        importedName = true;
      }
    } catch {
      /* 旧データが読めなくても気にしない */
    }
    return { status: 'fresh', game, importedName };
  }
  try {
    const parsed = parseGame(JSON.parse(raw));
    if (parsed) return { status: 'restored', game: parsed };
  } catch {
    /* 下で退避する */
  }
  const backupKey = `${BACKUP_PREFIX}${now.getTime()}`;
  try {
    storage.setItem(backupKey, raw);
  } catch {
    /* 退避できなくても、元のキーは上書きするまで残っている */
  }
  return { status: 'recovered', game: emptyGame(now), backupKey };
}

export function saveGame(g: Game, storage: Storage | undefined = globalThis.localStorage): boolean {
  try {
    if (!storage) return false;
    storage.setItem(STORAGE_KEY, JSON.stringify(g));
    return true;
  } catch {
    return false;
  }
}
