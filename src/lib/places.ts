import { SHRINES, SHRINE_BY_ID, type Shrine } from '../data/shrines';
import type { CustomPlace, Game } from '../state/model';
import type { RegisteredShrine } from '../chain/client';
import { distanceM, type LatLng } from './geo';

export type Place =
  | { kind: 'shrine'; id: string; name: string; area: string; coords: LatLng; shrine: Shrine }
  | { kind: 'custom'; id: string; name: string; area: string; coords?: LatLng; custom: CustomPlace }
  | { kind: 'community'; id: string; name: string; area: string; coords: LatLng; registered: RegisteredShrine };

export const shrinePlace = (s: Shrine): Place => ({
  kind: 'shrine',
  id: s.id,
  name: s.name,
  area: `${s.prefecture} ${s.city}`,
  coords: { lat: s.lat, lng: s.lng },
  shrine: s,
});

export const customPlace = (c: CustomPlace): Place => ({
  kind: 'custom',
  id: c.id,
  name: c.name,
  area: '自分で加えた神社',
  coords: c.lat !== undefined && c.lng !== undefined ? { lat: c.lat, lng: c.lng } : undefined,
  custom: c,
});

export const communityPlace = (r: RegisteredShrine): Place => ({
  kind: 'community',
  id: r.id,
  name: r.name,
  area: 'みんなが登録した神社',
  coords: { lat: r.lat, lng: r.lng },
  registered: r,
});

/** 収録の神社・自分で加えた神社・チェーンで誰かが登録した神社（重複は自分のものを優先） */
export function allPlaces(g: Game, community: RegisteredShrine[] = []): Place[] {
  const mine = new Set(g.customPlaces.map((c) => c.id));
  return [
    ...SHRINES.map(shrinePlace),
    ...g.customPlaces.map(customPlace),
    ...community.filter((r) => !mine.has(r.id) && !SHRINE_BY_ID[r.id]).map(communityPlace),
  ];
}

export function findPlace(g: Game, id: string, community: RegisteredShrine[] = []): Place | undefined {
  const s = SHRINE_BY_ID[id];
  if (s) return shrinePlace(s);
  const c = g.customPlaces.find((p) => p.id === id);
  if (c) return customPlace(c);
  const r = community.find((p) => p.id === id);
  if (r) return communityPlace(r);
  // 参拝の記録にだけ残っている神社（チェーンから読めないときなど）
  const v = g.visits.find((x) => x.placeId === id);
  return v ? { kind: 'custom', id, name: v.placeName, area: '記録にある神社', custom: { id, name: v.placeName, createdAt: v.at } } : undefined;
}

export function sortByDistance(places: Place[], from: LatLng) {
  return places
    .map((p) => ({ place: p, d: p.coords ? distanceM(from, p.coords) : Number.POSITIVE_INFINITY }))
    .sort((a, b) => a.d - b.d);
}
