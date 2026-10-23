import { Link, useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { Illustration } from '../components/Illustration';
import { GuideMeter, Stamp } from '../components/Progress';
import { useNotebook } from '../state/NotebookContext';
import { activeVisit, featureStatus, firstsInVisit, sightingsOf } from '../state/model';
import { FEATURE_BY_ID } from '../data/features';
import { formatDate } from '../lib/time';

export function Today() {
  const { nb, dispatch, importedTitle } = useNotebook();
  const navigate = useNavigate();
  const visit = activeVisit(nb);
  const lastVisit = [...nb.visits].filter((v) => v.closedAt).sort((a, b) => (b.closedAt ?? '').localeCompare(a.closedAt ?? ''))[0];

  const tryDemo = () => {
    dispatch({ type: 'setDemo', demo: true });
    navigate(`/arrive/${nb.settings.demoPlaceId}`);
  };

  const settings = (
    <Link to="/settings" className="icon-btn" aria-label="設定とデータ">
      <Icon name="settings" />
    </Link>
  );

  return (
    <Screen title="きょう" brand actions={settings}>
      <div className="stack-l">
        {visit && (
          <Link to="/visit" className="card card--link stack-s" style={{ borderColor: 'var(--moss)' }}>
            <span className="eyebrow">記録中</span>
            <h2>{visit.placeName}</h2>
            <p className="muted small">
              見つけたもの {sightingsOf(nb, visit.id).length} 件 ・ 帳面に綴じるまで、途中で閉じても残ります。
            </p>
            <span className="btn btn--moss btn--block">続きを書く</span>
          </Link>
        )}

        {!nb.onboarded ? (
          <section className="card card--hero stack" aria-labelledby="hero-title">
            <span className="eyebrow">八百万の見どころを、帳面に</span>
            <h2 id="hero-title" style={{ fontSize: '1.45rem' }}>
              境内は、見分けられると
              <br />
              面白くなる。
            </h2>
            <div className="row" style={{ gap: 4 }}>
              <div style={{ flex: 1 }}>
                <Illustration id="torii-shinmei" label="神明鳥居の線画" />
              </div>
              <div style={{ flex: 1 }}>
                <Illustration id="torii-myojin" label="明神鳥居の線画" />
              </div>
            </div>
            <p>
              {'鳥居の形、狛犬の口元、屋根の上の木。違いを知っていると、近所の神社でも「あ、これだ」と気づけます。まずは家で、ひとつ見分けを覚えてみましょう。'}
            </p>
            {importedTitle && <p className="small muted">以前のアプリで付けた名前を、帳面の名前として引き継ぎました（{nb.title}）。</p>}
            <Link to="/drill?group=torii&intro=1" className="btn btn--primary btn--block">
              鳥居を見分けてみる（3問・1分）
            </Link>
            <div className="row row--wrap" style={{ justifyContent: 'center', gap: 4 }}>
              <Link to="/places" className="btn btn--quiet">
                もう神社にいる
              </Link>
              <button type="button" className="btn btn--quiet" onClick={tryDemo}>
                デモで境内の記録を試す
              </button>
            </div>
          </section>
        ) : (
          <>
            <section className="stack" aria-labelledby="pinned-title">
              <div className="section-head">
                <h2 id="pinned-title">次に探すもの</h2>
                <Link to="/guide">図鑑から選ぶ</Link>
              </div>
              {nb.pinned.length === 0 ? (
                <div className="empty">
                  <p>{'まだ選んでいません。図鑑で「探し物に加える」を押すと、境内で真っ先に探すリストになります（3つまで）。'}</p>
                  <Link to="/guide" className="btn">
                    図鑑を開く
                  </Link>
                </div>
              ) : (
                <ul className="grid-tiles" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {nb.pinned.map((id) => {
                    const f = FEATURE_BY_ID[id];
                    if (!f) return null;
                    return (
                      <li key={id}>
                        <Link to={`/guide/${id}`} className="tile">
                          <Illustration id={id} />
                          <span className="tile__name">{f.name}</span>
                          <span className="tile__status">
                            {featureStatus(nb, id) === 'seen' ? '見た' : '境内で探す'}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="row row--wrap">
                <Link to="/places" className="btn btn--primary" style={{ flex: '1 1 180px' }}>
                  <Icon name="places" />
                  神社で記録する
                </Link>
                <Link to="/drill" className="btn" style={{ flex: '1 1 140px' }}>
                  見分け稽古
                </Link>
              </div>
            </section>

            <section className="card stack-s" aria-label="図鑑の進み具合">
              <div className="section-head">
                <h3>図鑑</h3>
                <Link to="/guide">すべて見る</Link>
              </div>
              <GuideMeter nb={nb} />
            </section>

            {lastVisit ? (
              <section className="stack-s" aria-labelledby="last-title">
                <h2 id="last-title">最近の頁</h2>
                <Link to={`/notebook/${lastVisit.id}`} className="list-item">
                  <span className="list-item__main">
                    <span className="list-item__title">{lastVisit.placeName}</span>
                    <span className="list-item__sub">
                      {formatDate(lastVisit.startedAt)} ・ 見つけたもの {sightingsOf(nb, lastVisit.id).length} 件
                      {lastVisit.demo && ' ・ デモ'}
                    </span>
                  </span>
                  {firstsInVisit(nb, lastVisit.id).length > 0 && <Stamp label="初" />}
                  <span className="chev">
                    <Icon name="chevron" />
                  </span>
                </Link>
              </section>
            ) : (
              <section className="notice">
                <strong>帳面はまだ白紙です</strong>
                <span>神社に着いたら「神社で記録する」から始めます。行く予定がなければ、デモで流れを試せます。</span>
                <span>
                  <button type="button" className="link" onClick={tryDemo}>
                    デモで境内の記録を試す
                  </button>
                </span>
              </section>
            )}
          </>
        )}

        <section className="stack-s">
          <h2 className="small eyebrow">このアプリの遊び方</h2>
          <ol className="list" style={{ counterReset: 'step' }}>
            {[
              ['おうちで', '図鑑と見分け稽古で、違いの見どころを覚える。探したいものを3つまで選ぶ。'],
              ['境内で', '着いたら記録を始め、見つけたものに印を付ける。気づいたことを一言。'],
              ['帳面に綴じる', '初めて見たものに印が押され、図鑑が埋まっていく。次に探すものが見えてくる。'],
            ].map(([t, d], i) => (
              <li key={t} className="list-item" style={{ alignItems: 'flex-start' }}>
                <span className="stamp" style={{ transform: 'none', flex: 'none' }} aria-hidden>
                  {i + 1}
                </span>
                <span className="list-item__main">
                  <span className="list-item__title">{t}</span>
                  <span className="list-item__sub">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="small muted">
            順位や連続日数はありません。好きなときに、好きな神社で。<Link to="/manners">参拝の心得と安全</Link>
          </p>
        </section>
      </div>
    </Screen>
  );
}
