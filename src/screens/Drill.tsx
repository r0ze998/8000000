import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Illustration } from '../components/Illustration';
import { Icon } from '../components/Icon';
import { useNotebook } from '../state/NotebookContext';
import { MAX_PINNED } from '../state/model';
import { buildRound, DRILL_GROUPS, type DrillQuestion } from '../lib/drill';

export function Drill() {
  const [params] = useSearchParams();
  const group = params.get('group') ?? undefined;
  const intro = params.get('intro') === '1';
  const { nb, dispatch } = useNotebook();
  const navigate = useNavigate();

  const [round, setRound] = useState<DrillQuestion[]>(() =>
    buildRound({ group: group && DRILL_GROUPS[group] ? group : undefined, known: new Set(Object.keys(nb.knowledge)) }),
  );
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const recorded = useRef(false);

  const finished = index >= round.length;
  const q = round[index];

  useEffect(() => {
    if (!finished || recorded.current) return;
    recorded.current = true;
    const correctIds = round.filter((_, i) => results[i]).map((r) => r.answer.id);
    const at = new Date().toISOString();
    dispatch({ type: 'learn', featureIds: correctIds, via: 'drill', at });
    dispatch({ type: 'drillRound', answered: round.length, correct: correctIds.length });
    if (intro) dispatch({ type: 'completeOnboarding' });
  }, [finished, round, results, intro, dispatch]);

  const restart = () => {
    recorded.current = false;
    setRound(buildRound({ known: new Set(Object.keys(nb.knowledge)) }));
    setIndex(0);
    setPicked(null);
    setResults([]);
    navigate('/drill', { replace: true });
  };

  if (finished) {
    const correctCount = results.filter(Boolean).length;
    const learnedHere = round.filter((_, i) => results[i]).map((r) => r.answer);
    const missed = round.filter((_, i) => !results[i]).map((r) => r.answer);
    return (
      <Screen title="見分け稽古" back="/guide" tabs={false}>
        <div className="stack-l">
          <header className="stack-s center">
            <span className="eyebrow">稽古おわり</span>
            <h2 style={{ fontSize: '1.5rem' }}>
              {round.length}問中 {correctCount}問
            </h2>
            <p className="muted">
              {correctCount === round.length
                ? 'すべて見分けられました。あとは境内で本物を探すだけです。'
                : '間違えたものは、図鑑で見分けどころを見直せます。'}
            </p>
          </header>

          {learnedHere.length > 0 && (
            <section className="stack-s">
              <h3>次に探すものに選ぶ</h3>
              <p className="small muted">選んだものは、境内の記録で先頭に並びます（{MAX_PINNED}つまで）。</p>
              <ul className="list">
                {learnedHere.map((f) => {
                  const pinned = nb.pinned.includes(f.id);
                  const full = !pinned && nb.pinned.length >= MAX_PINNED;
                  return (
                    <li key={f.id} className="list-item">
                      <span style={{ width: 56, flex: 'none' }}>
                        <Illustration id={f.id} />
                      </span>
                      <span className="list-item__main">
                        <span className="list-item__title">{f.name}</span>
                        <span className="list-item__sub">{f.gist}</span>
                      </span>
                      <button
                        type="button"
                        className={`btn ${pinned ? 'btn--moss' : ''}`}
                        aria-pressed={pinned}
                        disabled={full}
                        onClick={() => dispatch({ type: 'togglePin', featureId: f.id })}
                        style={{ minWidth: 88 }}
                      >
                        {pinned ? '✓ 選んだ' : '選ぶ'}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {missed.length > 0 && (
            <section className="stack-s">
              <h3>見直す</h3>
              <ul className="list">
                {missed.map((f) => (
                  <li key={f.id}>
                    <Link to={`/guide/${f.id}`} className="list-item">
                      <span className="list-item__main">
                        <span className="list-item__title">{f.name}</span>
                        <span className="list-item__sub">{f.drillCue}</span>
                      </span>
                      <span className="chev">
                        <Icon name="chevron" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {intro && (
            <div className="notice notice--gold">
              <strong>これで準備は十分です</strong>
              <span>近くの神社の鳥居が、どちらの形か見てみてください。どんな神社でも、図鑑の見どころは探せます。</span>
            </div>
          )}

          <div className="stack-s">
            <Link to="/" className="btn btn--primary btn--block">
              {intro ? 'はじめる' : 'きょうへ戻る'}
            </Link>
            <button type="button" className="btn btn--block" onClick={restart}>
              {intro ? 'ほかの見分けも稽古する（5問）' : 'もう一度（5問）'}
            </button>
          </div>
        </div>
      </Screen>
    );
  }

  if (!q) return null;
  const answered = picked !== null;
  const correct = picked === q.answer.id;

  const choose = (id: string) => {
    if (answered) return;
    setPicked(id);
    setResults((r) => [...r, id === q.answer.id]);
  };
  const next = () => {
    setPicked(null);
    setIndex((i) => i + 1);
  };

  return (
    <Screen
      title="見分け稽古"
      back="/guide"
      tabs={false}
      dock={
        answered ? (
          <button type="button" className="btn btn--primary btn--block" onClick={next} autoFocus>
            {index + 1 < round.length ? '次へ' : '結果を見る'}
          </button>
        ) : undefined
      }
    >
      <div className="stack">
        <div className="progress-dots" aria-label={`${round.length}問中 ${index + 1}問目`}>
          {round.map((r, i) => (
            <span key={r.id} className={i < index || (i === index && answered) ? 'done' : ''} />
          ))}
        </div>
        {intro && index === 0 && (
          <p className="small muted">
            鳥居は、いちばん上の横木と、2本目の横木の端を見ると見分けられます。直感で選んでみましょう。
          </p>
        )}
        <span className="eyebrow">{DRILL_GROUPS[q.answer.drillGroup ?? '']?.label}</span>
        <h2>{q.prompt}</h2>
        {q.kind === 'shape' && (
          <div className="ill-frame">
            <Illustration id={q.answer.id} label="問題の線画" />
          </div>
        )}
        <div className="quiz-options" role="group" aria-label="選択肢">
          {q.options.map((o) => {
            const state = !answered ? undefined : o.id === q.answer.id ? 'right' : o.id === picked ? 'wrong' : undefined;
            return (
              <button key={o.id} type="button" className="quiz-option" data-state={state} disabled={answered} onClick={() => choose(o.id)}>
                <span>{o.name}</span>
                {state === 'right' && <small>正解</small>}
                {state === 'wrong' && <small>ちがう</small>}
              </button>
            );
          })}
        </div>
        {answered && (
          <div className={`notice ${correct ? 'notice--ok' : 'notice--warn'}`} role="status" aria-live="polite">
            <strong>{correct ? `正解：${q.answer.name}` : `正解は「${q.answer.name}」`}</strong>
            <span>
              {q.kind === 'shinshi'
                ? q.answer.facts[0]?.text
                : `見分けどころ：${q.answer.drillCue}。`}
            </span>
          </div>
        )}
      </div>
    </Screen>
  );
}
