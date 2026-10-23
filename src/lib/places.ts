import { SHRINES, SHRINE_BY_ID, type Shrine } from '../data/shrines';
import type { CustomPlace, Notebook } from '../state/model';
import { distanceM, type LatLng } from './geo';

export type Place =
  | { kind: 'shrine'; id: string; name: string; area: string; coords: LatLng; shrine: Shrine }
  | { kind: 'custom'; id: string; name: string; area: string; coords?: LatLng; custom: CustomPlace };

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
  area: '自分で加えた場所',
  coords: c.lat !== undefined && c.lng !== undefined ? { lat: c.lat, lng: c.lng } : undefined,
  custom: c,
});

export function allPlaces(nb: Notebook): Place[] {
  return [...SHRINES.map(shrinePlace), ...nb.customPlaces.map(customPlace)];
}

export function findPlace(nb: Notebook, id: string): Place | undefined {
  const s = SHRINE_BY_ID[id];
  if (s) return shrinePlace(s);
  const c = nb.customPlaces.find((p) => p.id === id);
  return c ? customPlace(c) : undefined;
}

export function sortByDistance(places: Place[], from: LatLng) {
  return places
    .map((p) => ({ place: p, d: p.coords ? distanceM(from, p.coords) : Number.POSITIVE_INFINITY }))
    .sort((a, b) => a.d - b.d);
}
