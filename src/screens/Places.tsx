import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { Sheet } from '../components/Sheet';
import { useGame } from '../state/GameContext';
import { useCommunity } from '../chain/useCommunity';
import { useChainActions } from '../chain/useChainActions';
import { utf8Length } from '../chain/codec';
import { visitsAt } from '../state/model';
import { allPlaces, sortByDistance, type Place } from '../lib/places';
import { formatDistance, NEAR_RADIUS_M, POSITION_ERROR_TEXT, roundCoord } from '../lib/geo';
import { useLocate } from '../lib/useLocate';

const newPlaceId = () => `c-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function PlaceRow({ place, distance, visits }: { place: Place; distance?: number; visits?: number }) {
  const { game } = useGame();
  const mine = visitsAt(game, place.id).length;
  const near = distance !== undefined && distance <= NEAR_RADIUS_M;
  return (
    <li>
      <Link to={`/places/${place.id}`} className="list-item">
        <span className="list-item__main">
          <span className="list-item__title">{place.name}</span>
          <span className="list-item__sub">
            {place.area}
            {mine > 0 && ` ・ 参拝 ${mine} 回`}
            {visits !== undefined && visits > 0 && ` ・ みんなの参拝 ${visits}`}
          </span>
        </span>
        {distance !== undefined && Number.isFinite(distance) && (
          <span className="list-item__aside">{near ? <span className="chip chip--seen">境内付近</span> : formatDistance(distance)}</span>
        )}
        <span className="chev">
          <Icon name="chevron" />
        </span>
      </Link>
    </li>
  );
}

export function Places() {
  const { game, dispatch } = useGame();
  const community = useCommunity();
  const { block } = useChainActions();
  const navigate = useNavigate();
  const { state, locate } = useLocate();
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);

  const places = useMemo(() => allPlaces(game, community.shrines), [game, community.shrines]);
  const q = query.trim();
  const filtered = q ? places.filter((p) => `${p.name}${p.area}${p.kind === 'shrine' ? p.shrine.kana : ''}`.includes(q)) : places;
  const sorted = state.phase === 'ok' ? sortByDistance(filtered, state.coords) : filtered.map((place) => ({ place, d: undefined }));
  const nearest = state.phase === 'ok' ? sorted[0] : undefined;
  const realCoords = state.phase === 'ok' && !state.simulated ? state.coords : undefined;

  return (
    <Screen title="参拝">
      <div className="stack-l">
        <section className="stack">
          <div className="stack-s">
            <h2>参拝する神社をえらぶ</h2>
            <p className="muted small">神社に着いたら選んで参拝します。どの神社でも部品がもらえます。リストにない神社は加えられます。</p>
          </div>

          {state.phase === 'idle' && (
            <div className="card card--flat stack-s">
              <strong>近い順に並べますか？</strong>
              <p className="small muted">位置情報は並べ替えのためにこの場で一度だけ使い、保存も送信もしません。</p>
              <button type="button" className="btn btn--primary" onClick={locate}>
                <Icon name="locate" />
                位置情報で近い順にする
              </button>
            </div>
          )}
          {state.phase === 'locating' && (
            <div className="card card--flat row" role="status">
              <span className="spinner" aria-hidden />
              <span>現在地を確かめています…</span>
            </div>
          )}
          {state.phase === 'error' && (
            <div className="notice notice--warn" role="alert">
              <strong>{POSITION_ERROR_TEXT[state.reason].title}</strong>
              <span>{POSITION_ERROR_TEXT[state.reason].body}</span>
              <span>
                <button type="button" className="link" onClick={locate}>
                  もう一度試す
                </button>
              </span>
            </div>
          )}
          {state.phase === 'ok' && (
            <div className={`notice ${state.simulated ? 'notice--gold' : 'notice--ok'}`} role="status">
              <strong>{state.simulated ? '模擬位置（デモ）で並べています' : '現在地から近い順に並べています'}</strong>
              {nearest && nearest.d !== undefined && nearest.d > NEAR_RADIUS_M && (
                <span>近くに登録済みの神社はありません。いる神社を「神社を加える」から登録できます。</span>
              )}
            </div>
          )}

          <label className="field">
            <span className="visually-hidden">神社名・地名で絞り込む</span>
            <input type="search" placeholder="神社名・地名で絞り込む" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>

          {sorted.length === 0 ? (
            <div className="empty">
              <p>「{q}」に当てはまる神社はありません。</p>
              <button type="button" className="btn" onClick={() => setAdding(true)}>
                「{q}」を加える
              </button>
            </div>
          ) : (
            <ul className="list">
              {sorted.map(({ place, d }) => (
                <PlaceRow key={place.id} place={place} distance={d} visits={community.stats[place.id]?.visits} />
              ))}
            </ul>
          )}
        </section>

        <section className="card card--flat stack-s">
          <h3>リストにない神社を加える</h3>
          <p className="small muted">近所の神社も参拝できます。位置を確かめた神社は、チェーンに登録してみんなの地図に載せられます。</p>
          <button type="button" className="btn" onClick={() => setAdding(true)}>
            <Icon name="plus" />
            神社を加える
          </button>
        </section>
      </div>

      {adding && (
        <AddPlaceSheet
          initialName={q}
          coords={realCoords}
          canRegister={block(false).kind === 'ready'}
          onLocate={locate}
          onClose={() => setAdding(false)}
          onAdd={(name, keep, register) => {
            const id = newPlaceId();
            dispatch({
              type: 'addCustomPlace',
              place: {
                id,
                name,
                createdAt: new Date().toISOString(),
                ...(keep && realCoords ? { lat: roundCoord(realCoords.lat), lng: roundCoord(realCoords.lng) } : {}),
                chain: { status: 'local' },
              },
            });
            setAdding(false);
            navigate(`/places/${id}${register ? '?register=1' : ''}`);
          }}
        />
      )}
    </Screen>
  );
}

function AddPlaceSheet({
  initialName,
  coords,
  canRegister,
  onLocate,
  onClose,
  onAdd,
}: {
  initialName: string;
  coords?: { lat: number; lng: number };
  canRegister: boolean;
  onLocate: () => void;
  onClose: () => void;
  onAdd: (name: string, keepCoords: boolean, register: boolean) => void;
}) {
  const [name, setName] = useState(initialName);
  const [keep, setKeep] = useState(Boolean(coords));
  const trimmed = name.trim();
  const tooLong = utf8Length(trimmed) > 120;
  return (
    <Sheet title="神社を加える" onClose={onClose}>
      <form
        className="stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (trimmed && !tooLong) onAdd(trimmed, keep, keep && Boolean(coords) && canRegister);
        }}
      >
        <label className="field">
          神社の名前
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="例：○○八幡神社" required />
        </label>
        {tooLong && <p className="tiny error-text">名前が長すぎます（日本語で40文字まで）。</p>}
        {coords ? (
          <label className="row small" style={{ alignItems: 'flex-start' }}>
            <input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} style={{ width: 22, height: 22, marginTop: 2 }} />
            <span>
              いまいる場所を、この神社の位置にする（約100m単位）
              <br />
              <span className="muted">
                {canRegister
                  ? '神社の名前と位置をチェーンに登録し、みんなの地図に載せます（公開されます）。'
                  : '位置はこの端末に保存します。加えたあと、神社のページからチェーンに登録してみんなの地図に載せることもできます。'}
              </span>
            </span>
          </label>
        ) : (
          <div className="stack-s">
            <p className="small muted">位置を確かめていないので、神社の位置は保存しません（みんなの地図には載りません）。</p>
            <button type="button" className="btn btn--quiet" onClick={onLocate}>
              <Icon name="locate" />
              いまの位置を確かめる
            </button>
          </div>
        )}
        <div className="row">
          <button type="button" className="btn btn--quiet" onClick={onClose} style={{ flex: 1 }}>
            やめる
          </button>
          <button type="submit" className="btn btn--primary" disabled={!trimmed || tooLong} style={{ flex: 2 }}>
            加える
          </button>
        </div>
      </form>
    </Sheet>
  );
}
