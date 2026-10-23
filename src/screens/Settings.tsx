import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Sheet } from '../components/Sheet';
import { useNotebook } from '../state/NotebookContext';
import { emptyNotebook } from '../state/model';
import { parseNotebook } from '../state/storage';
import { SHRINES } from '../data/shrines';
import { SOURCES } from '../data/sources';
import { PRIVACY_POINTS } from '../data/etiquette';

export function Settings() {
  const { nb, dispatch } = useNotebook();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pendingImport, setPendingImport] = useState<ReturnType<typeof parseNotebook>>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const demoCount = nb.visits.filter((v) => v.demo).length;

  // #demo / #data などの見出しへ移動
  useEffect(() => {
    const id = hash.replace('#', '');
    if (id) document.getElementById(id)?.scrollIntoView();
  }, [hash]);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(nb, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yaoyorozu-notebook-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const onFile = async (file: File | undefined) => {
    setImportMsg(null);
    if (!file) return;
    try {
      if (file.size > 5_000_000) throw new Error('too big');
      const parsed = parseNotebook(JSON.parse(await file.text()));
      if (!parsed) throw new Error('shape');
      setPendingImport(parsed);
    } catch {
      setImportMsg({ ok: false, text: 'このファイルは帳面のデータとして読み込めませんでした。書き出した .json ファイルを選んでください。' });
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <Screen title="設定とデータ" back="/">
      <div className="stack-l">
        <section className="card stack" id="demo" aria-labelledby="demo-title">
          <h2 id="demo-title">デモモード</h2>
          <p className="small">
            {'神社に行かなくても、境内での記録の流れを試せます。位置は選んだ神社の近くにいる「模擬位置」になり、その間の記録には「デモ」と表示されます。実際に訪れた記録とは混ざりません。'}
          </p>
          <label className="row" style={{ minHeight: 48 }}>
            <input
              type="checkbox"
              checked={nb.settings.demo}
              onChange={(e) => dispatch({ type: 'setDemo', demo: e.target.checked })}
              style={{ width: 24, height: 24 }}
            />
            <strong>デモモードを使う</strong>
          </label>
          <label className="field">
            模擬位置にする神社
            <select
              value={nb.settings.demoPlaceId}
              onChange={(e) => dispatch({ type: 'setDemo', demo: nb.settings.demo, demoPlaceId: e.target.value })}
            >
              {SHRINES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}（{s.prefecture}）
                </option>
              ))}
            </select>
          </label>
          {nb.settings.demo && (
            <button type="button" className="btn btn--primary" onClick={() => navigate(`/arrive/${nb.settings.demoPlaceId}`)}>
              デモで記録を始める
            </button>
          )}
          <button
            type="button"
            className="btn btn--quiet btn--danger"
            disabled={demoCount === 0}
            onClick={() => dispatch({ type: 'clearDemoRecords' })}
          >
            デモの記録をすべて消す（{demoCount}件）
          </button>
        </section>

        <section className="card stack" id="data" aria-labelledby="data-title">
          <h2 id="data-title">帳面のデータ</h2>
          <p className="small">
            帳面はこの端末のブラウザにだけ保存されています。ブラウザのデータを消すと帳面も消えるので、ときどき書き出しておくと安心です。
          </p>
          <button type="button" className="btn" onClick={exportData}>
            帳面を書き出す（.json）
          </button>
          <label className="btn" style={{ position: 'relative' }}>
            書き出した帳面を読み込む
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="visually-hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </label>
          {importMsg && (
            <div className={`notice ${importMsg.ok ? 'notice--ok' : 'notice--warn'}`} role="status">
              {importMsg.text}
            </div>
          )}
          <button type="button" className="btn btn--quiet btn--danger" onClick={() => setConfirmReset(true)}>
            帳面をすべて消す
          </button>
        </section>

        <section className="stack-s" aria-labelledby="privacy-title">
          <h2 id="privacy-title">位置情報とプライバシー</h2>
          <ul className="small" style={{ margin: 0, paddingLeft: '1.2em', display: 'grid', gap: 6 }}>
            {PRIVACY_POINTS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>

        <section className="stack-s" aria-labelledby="about-title">
          <h2 id="about-title">このアプリについて</h2>
          <ul className="small" style={{ margin: 0, paddingLeft: '1.2em', display: 'grid', gap: 6 }}>
            <li>非公式の個人制作アプリです。掲載している神社を含め、いずれの神社・団体とも提携・公認の関係にありません。</li>
            <li>
              「事実」の印が付いた文は、下の出典を要約したものです。「案内」の印はこのアプリからの探し方の提案で、「俗説・諸説」は確かな根拠がないとされる説です。
            </li>
            <li>挿絵はこのアプリのために描いた模式図です。地図は外部の OpenStreetMap を開きます。</li>
            <li>
              いまのバージョンで使えないもの：帳面の同期・共有、地図の埋め込み表示、写真の保存。これらは表示もしていません。
            </li>
          </ul>
          <details className="disclosure">
            <summary>出典の一覧（{Object.keys(SOURCES).length}件）</summary>
            <ul className="small" style={{ paddingLeft: '1.2em', display: 'grid', gap: 4 }}>
              {Object.values(SOURCES).map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.publisher === 'Wikipedia' ? s.title : `${s.publisher}「${s.title}」`}
                  </a>
                </li>
              ))}
            </ul>
            <p className="tiny muted">Wikipedia の記事は CC BY-SA 4.0 で提供されています。本アプリの文章は要約・言い換えです。</p>
          </details>
          <Link to="/manners" className="small">
            参拝の作法と心得
          </Link>
          <p className="tiny muted">やおよろず帳 v3.0.0</p>
        </section>
      </div>

      {pendingImport && (
        <Sheet title="この帳面を読み込みますか？" onClose={() => setPendingImport(null)}>
          <p>
            「{pendingImport.title}」（頁 {pendingImport.visits.filter((v) => v.closedAt).length}）を読み込みます。
            いまの帳面は置き換わります。先にいまの帳面を書き出しておくと安全です。
          </p>
          <div className="row">
            <button type="button" className="btn btn--quiet" style={{ flex: 1 }} onClick={() => setPendingImport(null)}>
              やめる
            </button>
            <button
              type="button"
              className="btn btn--primary"
              style={{ flex: 2 }}
              onClick={() => {
                dispatch({ type: 'replace', notebook: pendingImport });
                setPendingImport(null);
                setImportMsg({ ok: true, text: '帳面を読み込みました。' });
              }}
            >
              読み込む
            </button>
          </div>
        </Sheet>
      )}
      {confirmReset && (
        <Sheet title="帳面をすべて消しますか？" onClose={() => setConfirmReset(false)}>
          <p>すべての頁、印、探し物、稽古の記録が消えます。元に戻せません。</p>
          <div className="row">
            <button type="button" className="btn btn--quiet" style={{ flex: 1 }} onClick={() => setConfirmReset(false)}>
              やめる
            </button>
            <button
              type="button"
              className="btn btn--danger"
              style={{ flex: 1 }}
              onClick={() => {
                dispatch({ type: 'replace', notebook: emptyNotebook() });
                setConfirmReset(false);
                navigate('/', { replace: true });
              }}
            >
              すべて消す
            </button>
          </div>
        </Sheet>
      )}
    </Screen>
  );
}
