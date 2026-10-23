import { Link, useNavigate, useParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { FactList, SourceLinks } from '../components/Facts';
import { Illustration } from '../components/Illustration';
import { Stamp } from '../components/Progress';
import { useNotebook } from '../state/NotebookContext';
import { activeVisit, featureStatus, placeVisits, sightingsOf } from '../state/model';
import { findPlace } from '../lib/places';
import { mapUrl } from '../lib/geo';
import { FEATURE_BY_ID } from '../data/features';
import { SHRINE_SOURCE } from '../data/shrines';
import { formatDate } from '../lib/time';
import { NotFound } from './NotFound';

export function PlaceDetail() {
  const { placeId = '' } = useParams();
  const { nb } = useNotebook();
  const navigate = useNavigate();
  const place = findPlace(nb, placeId);
  if (!place) return <NotFound what="神社" back="/places" />;

  const current = activeVisit(nb);
  const visits = placeVisits(nb, place.id);
  const shrine = place.kind === 'shrine' ? place.shrine : undefined;

  const dock = current ? (
    current.placeId === place.id ? (
      <Link to="/visit" className="btn btn--moss btn--block">
        この神社の記録を続ける
      </Link>
    ) : (
      <>
        <p className="small muted center">{current.placeName}の記録が途中です。綴じるか破棄してから始められます。</p>
        <Link to="/visit" className="btn btn--block">
          {current.placeName}の記録へ
        </Link>
      </>
    )
  ) : (
    <button type="button" className="btn btn--primary btn--block" onClick={() => navigate(`/arrive/${place.id}`)}>
      ここで記録を始める
    </button>
  );

  return (
    <Screen title={place.name} back="/places" dock={dock}>
      <div className="stack-l">
        <header className="stack-s">
          <span className="eyebrow">{place.area}</span>
          <h2 style={{ fontSize: '1.5rem' }}>{place.name}</h2>
          {shrine && <p className="muted small">{shrine.kana}</p>}
          <div className="row row--wrap">
            {place.coords && (
              <a className="btn btn--quiet" href={mapUrl(place.coords)} target="_blank" rel="noopener noreferrer">
                <Icon name="external" />
                地図で開く
              </a>
            )}
            {shrine?.official && (
              <a className="btn btn--quiet" href={shrine.official} target="_blank" rel="noopener noreferrer">
                <Icon name="external" />
                公式サイト
              </a>
            )}
          </div>
        </header>

        {shrine ? (
          <section className="stack" aria-labelledby="facts-title">
            <h3 id="facts-title">この神社について</h3>
            <div className="fact">
              <span>
                <span className="chip chip--fact">事実</span>
              </span>
              <p>
                <strong>主祭神</strong>　{shrine.deities}
              </p>
              <SourceLinks ids={[SHRINE_SOURCE[shrine.id] ?? '']} />
            </div>
            <FactList facts={shrine.facts} />
          </section>
        ) : (
          <section className="notice">
            <strong>あなたが加えた神社です</strong>
            <span>由緒や祭神は、境内の案内板や神社の公式な情報で確かめてください。このアプリには情報がありません。</span>
          </section>
        )}

        {shrine && shrine.known.length > 0 && (
          <section className="stack" aria-labelledby="known-title">
            <div className="stack-s">
              <h3 id="known-title">出典で確かめられる見どころ</h3>
              <p className="small muted">ほかの見どころも、どの神社にもあり得ます。図鑑全体から探してみましょう。</p>
            </div>
            <ul className="list">
              {shrine.known.map((k) => {
                const f = FEATURE_BY_ID[k.featureId];
                if (!f) return null;
                const st = featureStatus(nb, f.id);
                return (
                  <li key={k.featureId} className="card card--flat" style={{ padding: 12 }}>
                    <Link to={`/guide/${f.id}`} className="row" style={{ color: 'inherit', textDecoration: 'none', alignItems: 'flex-start' }}>
                      <span style={{ width: 64, flex: 'none' }}>
                        <Illustration id={f.id} />
                      </span>
                      <span className="stack-s" style={{ flex: 1, gap: 2 }}>
                        <strong className="row" style={{ gap: 8 }}>
                          {f.name}
                          {st === 'seen' && <span className="chip chip--seen">見た</span>}
                        </strong>
                        <span className="small">{k.note}</span>
                      </span>
                    </Link>
                    <div style={{ marginTop: 6 }}>
                      <SourceLinks ids={k.sources} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section className="stack-s" aria-labelledby="mine-title">
          <h3 id="mine-title">あなたの帳面</h3>
          {visits.length === 0 ? (
            <p className="muted small">まだこの神社の頁はありません。</p>
          ) : (
            <ul className="list">
              {visits.map((v) => (
                <li key={v.id}>
                  <Link to={`/notebook/${v.id}`} className="list-item">
                    <span className="list-item__main">
                      <span className="list-item__title">{formatDate(v.startedAt)}</span>
                      <span className="list-item__sub">
                        見つけたもの {sightingsOf(nb, v.id).length} 件{v.demo && ' ・ デモ'}
                      </span>
                    </span>
                    {sightingsOf(nb, v.id).length > 0 && <Stamp />}
                    <span className="chev">
                      <Icon name="chevron" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="tiny muted">
          {`このページは公開されている資料をもとにした非公式の紹介です。このアプリは${place.kind === 'shrine' ? 'この神社と' : '神社と'}提携・公認の関係にありません。参拝時間や行事は公式の情報で確かめてください。`}
        </p>
      </div>
    </Screen>
  );
}
