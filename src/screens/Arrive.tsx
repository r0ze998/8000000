import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { FactList } from '../components/Facts';
import { useGame } from '../state/GameContext';
import { useCommunity } from '../chain/useCommunity';
import { newId, visitedToday, visitsAt, type LocationCheck } from '../state/model';
import { findPlace } from '../lib/places';
import { distanceM, formatDistance, NEAR_RADIUS_M, POSITION_ERROR_TEXT } from '../lib/geo';
import { useLocate } from '../lib/useLocate';
import { isDarkHours } from '../lib/time';
import { ETIQUETTE_FACTS, VISIT_GUIDANCE } from '../data/etiquette';
import { NotFound } from './NotFound';

export function Arrive() {
  const { placeId = '' } = useParams();
  const { game, dispatch } = useGame();
  const navigate = useNavigate();
  const { state, locate } = useLocate();
  const [check, setCheck] = useState<LocationCheck | null>(null);
  const community = useCommunity();
  const place = findPlace(game, placeId, community.shrines);
  if (!place) return <NotFound what="神社" back="/places" />;

  const demo = game.settings.demo;
  const distance = state.phase === 'ok' && place.coords ? distanceM(state.coords, place.coords) : undefined;
  const near = distance !== undefined && distance <= NEAR_RADIUS_M;
  const today = visitedToday(game, place.id);

  const worship = () => {
    if (!check) return;
    const id = newId('visit');
    dispatch({
      type: 'addVisit',
      visit: {
        id,
        placeId: place.id,
        placeName: place.name,
        at: new Date().toISOString(),
        check,
        distanceM: check === 'self' || distance === undefined ? undefined : Math.round(distance),
        demo,
        chain: { status: demo ? 'skipped' : 'local' },
      },
    });
    navigate(`/visits/${id}?new=1`, { replace: true });
  };

  if (today) {
    const last = visitsAt(game, place.id)[0];
    return (
      <Screen title="参拝" back={`/places/${place.id}`} tabs={false}>
        <div className="empty" style={{ marginTop: 16 }}>
          <p>{place.name}には、今日もう参拝を記録しました。同じ神社は1日1回までです。</p>
          {last && (
            <Link to={`/visits/${last.id}`} className="btn btn--primary">
              今日の記録を見る
            </Link>
          )}
          <Link to="/places" className="btn btn--quiet">
            ほかの神社をさがす
          </Link>
        </div>
      </Screen>
    );
  }

  // 位置の確認が済んだら、参拝の一手間
  if (check) {
    return (
      <Screen
        title="参拝"
        back={`/places/${place.id}`}
        tabs={false}
        dock={
          <button type="button" className="btn btn--primary btn--block" onClick={worship}>
            参拝した
          </button>
        }
      >
        <div className="stack-l">
          <header className="stack-s">
            <span className="eyebrow">{place.area}</span>
            <h2 style={{ fontSize: '1.45rem' }}>{place.name}</h2>
            <p className="small muted">画面を閉じて、ゆっくり参拝してください。終わったら「参拝した」を押します。</p>
          </header>
          <section className="stack-s" aria-labelledby="etq">
            <h3 id="etq">参拝の作法</h3>
            <FactList facts={ETIQUETTE_FACTS.slice(0, 2)} />
            {place.kind === 'shrine' && place.shrine.id === 'izumo-taisha' && <FactList facts={place.shrine.facts} />}
          </section>
        </div>
      </Screen>
    );
  }

  return (
    <Screen title="参拝" back={`/places/${place.id}`} tabs={false}>
      <div className="stack-l">
        <header className="stack-s">
          <span className="eyebrow">{place.area}</span>
          <h2 style={{ fontSize: '1.45rem' }}>{place.name}</h2>
        </header>

        {isDarkHours() && (
          <div className="notice notice--gold" role="note">
            <strong>暗い時間です</strong>
            <span>境内は足元が見えにくく、閉門している神社もあります。無理をせず、明るい時間にあらためても大丈夫です。夜に参拝しても、もらえる部品は同じです。</span>
          </div>
        )}

        {place.coords ? (
          <section className="card stack" aria-labelledby="loc-title">
            <h3 id="loc-title">境内にいますか？</h3>
            {state.phase === 'idle' && (
              <>
                <p className="small">
                  位置情報で一度だけ確かめます。座標は保存も送信もしません。チェーンに記録するのは「どの神社に、いつ（日付）」だけです。
                </p>
                <button type="button" className="btn btn--primary btn--block" onClick={locate}>
                  <Icon name="locate" />
                  {demo ? '模擬位置（デモ）で確かめる' : '位置を確かめる'}
                </button>
              </>
            )}
            {state.phase === 'locating' && (
              <div className="row" role="status">
                <span className="spinner" aria-hidden />
                <span>確かめています…</span>
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
            {state.phase === 'ok' &&
              distance !== undefined &&
              (near ? (
                <>
                  <div className={`notice ${state.simulated ? 'notice--gold' : 'notice--ok'}`} role="status">
                    <strong>
                      境内付近です（{formatDistance(distance)}）{state.simulated && '・模擬位置'}
                    </strong>
                  </div>
                  <button type="button" className="btn btn--primary btn--block" onClick={() => setCheck(state.simulated ? 'demo' : 'gps')}>
                    参拝する
                  </button>
                </>
              ) : (
                <div className="notice notice--warn" role="status">
                  <strong>
                    {place.name}から{formatDistance(distance)}離れているようです{state.simulated && '（模擬位置）'}
                  </strong>
                  <span>
                    {demo
                      ? 'デモの模擬位置は別の神社に設定されています。設定から変えられます。'
                      : '着いてからもう一度確かめてください。参拝の記録は、神社にいるときだけです。'}
                  </span>
                  <span>
                    <button type="button" className="link" onClick={locate}>
                      もう一度確かめる
                    </button>
                  </span>
                </div>
              ))}
            {state.phase === 'error' && (
              <div className="stack-s">
                <button type="button" className="btn btn--block" onClick={() => setCheck(demo ? 'demo' : 'self')}>
                  位置を使わずに参拝する
                </button>
                <p className="tiny muted">
                  位置を確かめていない参拝には「位置未確認」と付きます。チェーンに記録するときも、記録の画面に同じ印が出ます。
                </p>
              </div>
            )}
          </section>
        ) : (
          <section className="stack-s">
            <div className="notice">
              <strong>位置を保存していない神社です</strong>
              <span>位置の確認はせずに参拝を記録します（「位置未確認」と付きます）。</span>
            </div>
            <button type="button" className="btn btn--primary btn--block" onClick={() => setCheck(demo ? 'demo' : 'self')}>
              参拝する
            </button>
          </section>
        )}

        <section className="stack-s" aria-labelledby="guide-title">
          <h3 id="guide-title">境内でのお願い</h3>
          <ul className="small" style={{ margin: 0, paddingLeft: '1.2em', display: 'grid', gap: 6 }}>
            {VISIT_GUIDANCE.slice(0, 3).map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
          <Link to="/manners" className="small">
            参拝の作法と心得をすべて見る
          </Link>
        </section>
      </div>
    </Screen>
  );
}
