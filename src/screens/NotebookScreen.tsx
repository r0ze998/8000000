import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { Sheet } from '../components/Sheet';
import { Stamp, countStatus } from '../components/Progress';
import { useNotebook } from '../state/NotebookContext';
import { activeVisit, firstsInVisit, sightingsOf } from '../state/model';
import { formatDate } from '../lib/time';

export function NotebookScreen() {
  const { nb, dispatch } = useNotebook();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(nb.title);
  const closed = nb.visits.filter((v) => v.closedAt).sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  const current = activeVisit(nb);
  const places = new Set(closed.map((v) => v.placeId)).size;
  const { seen } = countStatus(nb);

  const settings = (
    <Link to="/settings" className="icon-btn" aria-label="設定とデータ">
      <Icon name="settings" />
    </Link>
  );

  return (
    <Screen title="帳面" actions={settings}>
      <div className="stack-l">
        <header className="card card--hero stack-s">
          <span className="eyebrow">帳面</span>
          <div className="row row--between">
            <h2 style={{ fontSize: '1.4rem', wordBreak: 'break-word' }}>{nb.title}</h2>
            <button
              type="button"
              className="btn btn--quiet"
              onClick={() => {
                setTitle(nb.title);
                setEditing(true);
              }}
            >
              名前を変える
            </button>
          </div>
          <dl className="row row--wrap" style={{ margin: 0, gap: 18 }}>
            {[
              ['頁', closed.length],
              ['神社', places],
              ['見た見どころ', seen],
            ].map(([k, v]) => (
              <div key={k as string}>
                <dt className="tiny muted">{k}</dt>
                <dd style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700 }}>{v}</dd>
              </div>
            ))}
          </dl>
        </header>

        {current && (
          <Link to="/visit" className="list-item" style={{ borderColor: 'var(--moss)' }}>
            <span className="list-item__main">
              <span className="list-item__title">記録中：{current.placeName}</span>
              <span className="list-item__sub">綴じると、この帳面に頁が増えます。</span>
            </span>
            <span className="chev">
              <Icon name="chevron" />
            </span>
          </Link>
        )}

        <section className="stack-s" aria-labelledby="pages-title">
          <h2 id="pages-title">頁</h2>
          {closed.length === 0 ? (
            <div className="empty">
              <p>まだ頁はありません。神社に着いたら記録を始めて、帳面に綴じましょう。</p>
              <Link to="/places" className="btn btn--primary">
                神社をさがす
              </Link>
            </div>
          ) : (
            <ul className="list">
              {closed.map((v) => {
                const n = sightingsOf(nb, v.id).length;
                const firsts = firstsInVisit(nb, v.id).length;
                return (
                  <li key={v.id}>
                    <Link to={`/notebook/${v.id}`} className="list-item">
                      <span className="list-item__main">
                        <span className="list-item__title">{v.placeName}</span>
                        <span className="list-item__sub">
                          {formatDate(v.startedAt)} ・ 見つけたもの {n} 件{firsts > 0 && `（うち初 ${firsts}）`}
                        </span>
                      </span>
                      {v.demo && <span className="chip chip--demo">デモ</span>}
                      {firsts > 0 && <Stamp label="初" />}
                      <span className="chev">
                        <Icon name="chevron" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <p className="tiny muted">帳面はこの端末のブラウザにだけ保存されています。機種変更の前には「設定とデータ」から書き出してください。</p>
      </div>

      {editing && (
        <Sheet title="帳面の名前" onClose={() => setEditing(false)}>
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              dispatch({ type: 'setTitle', title });
              setEditing(false);
            }}
          >
            <label className="field">
              名前（30文字まで）
              <input type="text" value={title} maxLength={30} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <div className="row">
              <button type="button" className="btn btn--quiet" style={{ flex: 1 }} onClick={() => setEditing(false)}>
                やめる
              </button>
              <button type="submit" className="btn btn--primary" style={{ flex: 2 }} disabled={!title.trim()}>
                保存
              </button>
            </div>
          </form>
        </Sheet>
      )}
    </Screen>
  );
}
