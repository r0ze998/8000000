import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { useGame } from '../state/GameContext';
import { useChain } from '../chain/ChainContext';
import { useCommunity } from '../chain/useCommunity';
import { allPlaces, type Place } from '../lib/places';
import { REPORT_STATUS } from '../state/model';

const DAY_MS = 86400000;
const dayToDate = (day: number) => {
  const d = new Date(day * DAY_MS);
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
};

export function MapScreen() {
  const { game } = useGame();
  const { cfg } = useChain();
  const community = useCommunity();
  const [selected, setSelected] = useState<string | null>(null);
  const [mapError, setMapError] = useState(false);
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  const places = useMemo(() => allPlaces(game, community.shrines).filter((p) => p.coords), [game, community.shrines]);
  const mineVisited = useMemo(() => new Set(game.visits.map((v) => v.placeId)), [game.visits]);

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    try {
      const map = L.map(mapEl.current, { zoomControl: true, attributionControl: true }).setView([35.4, 136.2], 5);
      const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      let errors = 0;
      tiles.on('tileerror', () => {
        errors += 1;
        if (errors > 6) setMapError(true);
      });
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      // レイアウトが落ち着いてから大きさを測り直す（スマホで灰色の余白が出ないように）
      setTimeout(() => map.invalidateSize(), 50);
    } catch {
      setMapError(true);
    }
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    for (const p of places) {
      const visits = community.stats[p.id]?.visits ?? 0;
      const mine = mineVisited.has(p.id);
      const marker = L.circleMarker([p.coords!.lat, p.coords!.lng], {
        radius: 7 + Math.min(10, Math.sqrt(visits) * 2),
        color: mine ? '#4e6141' : '#2f3a56',
        weight: 2,
        fillColor: mine ? '#a9bf92' : p.kind === 'shrine' ? '#d8c79c' : '#dfe2ea',
        fillOpacity: 0.85,
      });
      marker.bindTooltip(p.name, { direction: 'top' });
      marker.on('click', () => setSelected(p.id));
      marker.addTo(layer);
    }
  }, [places, community.stats, mineVisited]);

  // 最初の一度だけ、すべての神社が入るように合わせる
  const fitted = useRef(false);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || fitted.current || places.length === 0) return;
    fitted.current = true;
    map.fitBounds(L.latLngBounds(places.map((p) => [p.coords!.lat, p.coords!.lng] as [number, number])), { padding: [24, 24], maxZoom: 13 });
  }, [places]);

  const sel: Place | undefined = places.find((p) => p.id === selected);
  const selStats = sel ? community.stats[sel.id] : undefined;
  const selReports = sel ? community.reports.filter((r) => r.shrineId === sel.id).slice(0, 3) : [];
  const recent = community.reports.slice(0, 5);
  const nameOf = (id: string) => places.find((p) => p.id === id)?.name ?? id;

  return (
    <Screen title="みんなの地図" wide>
      <div className="stack-l">
        <section className="stack-s">
          <h2>みんなの神社の地図</h2>
          <p className="small muted">
            参拝の記録と神社の様子の報告は、チェーンに集まって、だれでも見られる地図になります。円が大きいほど、たくさん参拝されている神社です。
          </p>
          <div className="legend">
            <span>
              <i style={{ background: '#a9bf92', border: '2px solid #4e6141' }} />
              自分が参拝した
            </span>
            <span>
              <i style={{ background: '#d8c79c', border: '2px solid #2f3a56' }} />
              収録の神社
            </span>
            <span>
              <i style={{ background: '#dfe2ea', border: '2px solid #2f3a56' }} />
              登録された神社
            </span>
          </div>
        </section>

        <div className="map-wrap">
          <div ref={mapEl} className="map" role="application" aria-label="神社の地図" />
          {mapError && (
            <div className="map-fallback" role="status">
              地図の画像を読み込めませんでした（通信状態を確かめてください）。神社の印と一覧は使えます。
            </div>
          )}
        </div>

        {cfg ? (
          community.status === 'loading' && !community.loadedAt ? (
            <div className="row" role="status">
              <span className="spinner" aria-hidden />
              <span className="small">チェーンからみんなの記録を読んでいます…</span>
            </div>
          ) : community.status === 'error' ? (
            <div className="notice notice--warn" role="alert">
              <strong>みんなの記録を読み込めませんでした</strong>
              <span>通信状態を確かめてください。</span>
              <span>
                <button type="button" className="link" onClick={() => void community.reload()}>
                  もう一度読む
                </button>
              </span>
            </div>
          ) : (
            <p className="tiny muted">
              {cfg.label} の記録を表示中。
              <button type="button" className="link" onClick={() => void community.reload()} style={{ marginLeft: 6 }}>
                更新
              </button>
            </p>
          )
        ) : (
          <div className="notice">
            <strong>チェーンに接続していません</strong>
            <span>このアプリはいまチェーンの設定がないため、みんなの記録は表示できません。収録の神社と、自分が加えた神社だけを表示しています。</span>
          </div>
        )}

        {sel && (
          <section className="card stack-s" aria-live="polite" aria-labelledby="sel-title">
            <div className="row row--between">
              <h3 id="sel-title">{sel.name}</h3>
              <button type="button" className="icon-btn" aria-label="閉じる" onClick={() => setSelected(null)}>
                <Icon name="close" />
              </button>
            </div>
            <span className="small muted">{sel.area}</span>
            {selStats && (
              <p className="small">
                みんなの参拝 {selStats.visits} 回（{selStats.visitors} 人）
                {selStats.reports > 0 && ` ・ 最新の様子：${REPORT_STATUS[selStats.lastStatus] ?? '—'}（${dayToDate(selStats.lastReportDay)}）`}
              </p>
            )}
            {selReports.map((r) => (
              <p key={r.txHash} className="small">
                {dayToDate(r.day)}　{REPORT_STATUS[r.status]}
                {r.note && `「${r.note}」`}
              </p>
            ))}
            <Link to={`/places/${sel.id}`} className="btn btn--primary">
              この神社のページ
            </Link>
          </section>
        )}

        {recent.length > 0 && (
          <section className="stack-s" aria-labelledby="recent-title">
            <h3 id="recent-title">最近の神社の様子</h3>
            <ul className="list">
              {recent.map((r) => (
                <li key={r.txHash}>
                  <Link to={`/places/${r.shrineId}`} className="list-item">
                    <span className="list-item__main">
                      <span className="list-item__title">{nameOf(r.shrineId)}</span>
                      <span className="list-item__sub">
                        {dayToDate(r.day)} ・ {REPORT_STATUS[r.status]}
                        {r.note && `「${r.note}」`}
                      </span>
                    </span>
                    <span className="chev">
                      <Icon name="chevron" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="tiny muted">報告は参拝した人が書いたもので、神社の公式な情報ではありません。</p>
          </section>
        )}
      </div>
    </Screen>
  );
}
