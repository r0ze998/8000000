import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Illustration } from '../components/Illustration';
import { SourceLinks } from '../components/Facts';
import { ChainAction, ChainChip } from '../components/ChainPanel';
import { useGame } from '../state/GameContext';
import { useChainActions } from '../chain/useChainActions';
import { levelOf, newId, REPORT_STATUS, type Game } from '../state/model';
import { PART_BY_ID, signatureParts } from '../data/parts';
import { SHRINE_BY_ID } from '../data/shrines';
import { checkLabel } from '../lib/labels';
import { formatDate } from '../lib/time';
import { utf8Length } from '../chain/codec';
import { NotFound } from './NotFound';

const NOTE_MAX_BYTES = 280;

function ReportForm({ visitId, placeId, demo, unverified }: { visitId: string; placeId: string; demo: boolean; unverified: boolean }) {
  const { game, dispatch } = useGame();
  const { recordReport } = useChainActions();
  const visit = game.visits.find((v) => v.id === visitId)!;
  const existing = game.reports.find((r) => r.visitId === visitId);
  const [status, setStatus] = useState(0);
  const [note, setNote] = useState('');
  const bytes = utf8Length(note);

  if (existing) {
    return (
      <div className="stack-s">
        <p className="small">
          <strong>{REPORT_STATUS[existing.status]}</strong>
          {existing.note && `「${existing.note}」`}
        </p>
        <ChainChip rec={existing.chain} demo={demo} />
        <ChainAction
          rec={existing.chain}
          demo={demo}
          unverified={unverified}
          what="報告"
          onSend={() => void recordReport(existing)}
          disabledReason={visit.chain.status !== 'confirmed' ? '先に、この参拝をチェーンに記録してください（報告できるのは参拝した人だけです）。' : undefined}
        />
      </div>
    );
  }

  return (
    <form
      className="stack-s"
      onSubmit={(e) => {
        e.preventDefault();
        if (bytes > NOTE_MAX_BYTES) return;
        const report = {
          id: newId('report'),
          visitId,
          placeId,
          status,
          note: note.trim(),
          at: new Date().toISOString(),
          chain: { status: demo ? ('skipped' as const) : ('local' as const) },
        };
        dispatch({ type: 'addReport', report });
        if (!demo && !unverified && visit.chain.status === 'confirmed') void recordReport(report);
      }}
    >
      <fieldset className="stack-s" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="small" style={{ fontWeight: 700, marginBottom: 6 }}>
          今日の様子
        </legend>
        {REPORT_STATUS.map((label, i) => (
          <label key={label} className="radio-row">
            <input type="radio" name="status" checked={status === i} onChange={() => setStatus(i)} />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
      <label className="field">
        ひとこと（任意）
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="例：手水舎は使えた。本殿の屋根を修復中。"
          aria-describedby="note-help"
        />
      </label>
      <span id="note-help" className={`tiny ${bytes > NOTE_MAX_BYTES ? 'error-text' : 'muted'}`}>
        {bytes > NOTE_MAX_BYTES ? '長すぎます（日本語で約90文字まで）。' : `あと約${Math.floor((NOTE_MAX_BYTES - bytes) / 3)}文字。`}
        チェーンに記録すると公開されます。人の名前や、写っている人がわかる内容は書かないでください。
      </span>
      <button type="submit" className="btn" disabled={bytes > NOTE_MAX_BYTES}>
        様子を報告する
      </button>
    </form>
  );
}

function grewWith(game: Game, visitId: string) {
  const idx = game.visits.findIndex((v) => v.id === visitId);
  const before = levelOf({ ...game, visits: game.visits.slice(0, idx) });
  const after = levelOf({ ...game, visits: game.visits.slice(0, idx + 1) });
  return after.index > before.index ? after : null;
}

export function VisitResult() {
  const { visitId = '' } = useParams();
  const [params] = useSearchParams();
  const fresh = params.get('new') === '1';
  const { game } = useGame();
  const { block, recordVisit } = useChainActions();
  const navigate = useNavigate();
  const autoSent = useRef(false);
  const visit = game.visits.find((v) => v.id === visitId);

  // 参拝直後で、同意済み・接続済みなら自動でチェーンに送る
  const canAuto = Boolean(visit && fresh && visit.check !== 'self' && visit.chain.status === 'local' && block(visit.demo).kind === 'ready');
  useEffect(() => {
    if (canAuto && !autoSent.current) {
      autoSent.current = true;
      void recordVisit(visitId);
    }
  }, [canAuto, recordVisit, visitId]);

  if (!visit) return <NotFound what="参拝の記録" back="/visits" />;

  const shrine = SHRINE_BY_ID[visit.placeId];
  const sig = new Set(signatureParts(visit.placeId));
  const counts = visit.rewards.reduce<Record<string, number>>((m, p) => ({ ...m, [p]: (m[p] ?? 0) + 1 }), {});
  const grew = grewWith(game, visit.id);
  const unverified = visit.check === 'self';

  return (
    <Screen
      title="参拝の記録"
      back="/visits"
      tabs={!fresh}
      dock={
        fresh ? (
          <button type="button" className="btn btn--primary btn--block" onClick={() => navigate(`/?new=${Object.keys(counts).join(',')}`)}>
            自分の神社に置く
          </button>
        ) : undefined
      }
    >
      <div className="stack-l">
        <header className="card card--hero stack-s">
          <span className="eyebrow">{formatDate(visit.at)}</span>
          <h2 style={{ fontSize: '1.45rem' }}>{visit.placeName}</h2>
          <div className="row row--wrap" style={{ gap: 6 }}>
            <span className={`chip${visit.demo ? ' chip--demo' : ''}`}>{checkLabel(visit)}</span>
            <ChainChip rec={visit.chain} demo={visit.demo} />
          </div>
          {fresh && <p role="status">参拝おつかれさまでした。部品を {visit.rewards.length} つ受け取りました。</p>}
        </header>

        {grew && (
          <div className="notice notice--ok" role="status">
            <strong>
              境内が {grew.size}×{grew.size}（{grew.name}）に広がりました
            </strong>
            <span>行った神社が {grew.min} 社になりました。広がった土地に部品を置けます。</span>
          </div>
        )}

        <section className="stack-s" aria-labelledby="parts-title">
          <h3 id="parts-title">受け取った部品</h3>
          <ul className="reward-grid">
            {Object.entries(counts).map(([id, n], i) => {
              const p = PART_BY_ID[id];
              if (!p) return null;
              return (
                <li key={id} className={`reward${fresh ? ' reward--reveal' : ''}`} style={{ animationDelay: `${i * 120}ms` }}>
                  <Illustration id={p.art} label={p.name} />
                  <span className="reward__name">{p.name}</span>
                  <span className="tiny muted">×{n}</span>
                  {sig.has(id) && <span className="chip chip--fact">ゆかりの部品</span>}
                </li>
              );
            })}
          </ul>
          {shrine && visit.rewards.some((p) => sig.has(p)) && (
            <div className="stack-s">
              <p className="tiny muted">「ゆかりの部品」は、出典で確かめられる{shrine.name}の見どころにちなんでいます。部品はゲーム上のものです。</p>
              <ul className="factlist">
                {shrine.known.map((k) => (
                  <li key={k.featureId} className="fact">
                    <span className="small">{k.note}</span>
                    <SourceLinks ids={k.sources} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="card stack-s" aria-labelledby="chain-title">
          <h3 id="chain-title">チェーンへの記録</h3>
          <ChainAction rec={visit.chain} demo={visit.demo} unverified={unverified} onSend={() => void recordVisit(visit.id)} />
        </section>

        <section className="card stack-s" aria-labelledby="report-title">
          <h3 id="report-title">神社の様子を伝える（任意）</h3>
          <p className="small muted">工事中や閉門などの様子は、次に行く人の役に立ちます。報告は、チェーンに参拝を記録した人だけが公開できます。</p>
          <ReportForm visitId={visit.id} placeId={visit.placeId} demo={visit.demo} unverified={unverified} />
        </section>

        {!fresh && (
          <Link to={`/places/${visit.placeId}`} className="btn btn--block">
            {visit.placeName}のページ
          </Link>
        )}
      </div>
    </Screen>
  );
}
