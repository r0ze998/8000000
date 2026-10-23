// 位置情報まわり。位置は「いま神社の近くにいるか」を確かめるためだけに一度だけ取得し、
// 座標そのものは保存しない（距離の概数だけを記録に残す）。

export interface LatLng {
  lat: number;
  lng: number;
}

export type PositionResult =
  | { ok: true; coords: LatLng; accuracyM: number }
  | { ok: false; reason: 'denied' | 'unavailable' | 'timeout' | 'unsupported' | 'insecure' };

/** 登録座標からこの距離以内なら「境内付近」とみなす。大きな神社の座標は概略値なので広めにとる */
export const NEAR_RADIUS_M = 700;

export function distanceM(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function formatDistance(m: number): string {
  if (m < 1000) return `約${Math.max(10, Math.round(m / 10) * 10)}m`;
  if (m < 100000) return `約${(m / 1000).toFixed(1)}km`;
  return `約${Math.round(m / 1000)}km`;
}

export function getPosition(timeoutMs = 12000): Promise<PositionResult> {
  if (typeof window !== 'undefined' && window.isSecureContext === false) {
    return Promise.resolve({ ok: false, reason: 'insecure' });
  }
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return Promise.resolve({ ok: false, reason: 'unsupported' });
  }
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          ok: true,
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          accuracyM: pos.coords.accuracy,
        }),
      (err) => {
        const reason = err.code === 1 ? 'denied' : err.code === 3 ? 'timeout' : 'unavailable';
        resolve({ ok: false, reason });
      },
      // 着いたかどうかを確かめるので、古い位置（キャッシュ）は使わない
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 0 },
    );
  });
}

export const POSITION_ERROR_TEXT: Record<Exclude<PositionResult, { ok: true }>['reason'], { title: string; body: string }> = {
  denied: {
    title: '位置情報の利用が許可されませんでした',
    body: '位置を使わずに記録することもできます。あとで使いたくなったら、ブラウザのサイト設定から位置情報を許可してください。',
  },
  unavailable: {
    title: 'いまの位置がわかりませんでした',
    body: '屋内や木の多い場所では取得しにくいことがあります。もう一度試すか、位置を使わずに記録できます。',
  },
  timeout: {
    title: '位置の取得に時間がかかっています',
    body: '電波の状態によって時間がかかることがあります。もう一度試すか、位置を使わずに記録できます。',
  },
  unsupported: {
    title: 'この端末では位置情報を使えません',
    body: '位置を使わずに記録できます。',
  },
  insecure: {
    title: 'この接続では位置情報を使えません',
    body: '位置情報は https または localhost で開いたときだけ使えます。位置を使わずに記録できます。',
  },
};

export const mapUrl = (p: LatLng) =>
  `https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lng}#map=16/${p.lat}/${p.lng}`;

export const roundCoord = (n: number) => Math.round(n * 1000) / 1000;
