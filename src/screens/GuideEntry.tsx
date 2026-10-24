// 部品のもとになった実際の見どころの解説（事実は出典つき、探し方はアプリの案内）。

import { Link, useParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Illustration } from '../components/Illustration';
import { FactList, GuideBox } from '../components/Facts';
import { Icon } from '../components/Icon';
import { useGame } from '../state/GameContext';
import { inventory } from '../state/model';
import { CATEGORY_LABEL, FEATURE_BY_ID } from '../data/features';
import { PARTS } from '../data/parts';
import { SHRINES } from '../data/shrines';
import { NotFound } from './NotFound';

export function GuideEntry() {
  const { featureId = '' } = useParams();
  const { game } = useGame();
  const f = FEATURE_BY_ID[featureId];
  if (!f) return <NotFound what="解説" back="/" />;

  const part = PARTS.find((p) => p.featureId === f.id);
  const owned = part ? (inventory(game)[part.id] ?? 0) + game.placements.filter((p) => p.partId === part.id).length + (game.honden === part.id ? 1 : 0) : 0;
  const examples = SHRINES.filter((s) => s.known.some((k) => k.featureId === f.id));

  return (
    <Screen title={f.name} back="/">
      <div className="stack-l">
        <header className="stack">
          <div className="ill-frame">
            <Illustration id={f.id} label={`${f.name}の模式図`} />
          </div>
          <div className="stack-s">
            <span className="eyebrow">{CATEGORY_LABEL[f.category]}</span>
            <h2 style={{ fontSize: '1.55rem' }}>{f.name}</h2>
            <p className="muted small">{f.kana}</p>
            <p>{f.gist}</p>
            {part && (
              <p className="small muted">
                ゲームの部品「{part.name}」のもとになった、実際の境内の見どころです。{owned > 0 ? `いま ${owned} つ持っています。` : ''}
              </p>
            )}
          </div>
        </header>

        <section className="stack" aria-labelledby="facts-title">
          <h3 id="facts-title">どんなもの？</h3>
          <FactList facts={f.facts} />
        </section>

        <GuideBox title="参拝のときに見てみる（アプリの案内）" items={f.look} />

        {examples.length > 0 && (
          <section className="stack-s" aria-labelledby="ex-title">
            <h3 id="ex-title">この部品がゆかりの部品になる神社</h3>
            <ul className="list">
              {examples.map((s) => (
                <li key={s.id}>
                  <Link to={`/places/${s.id}`} className="list-item">
                    <span className="list-item__main">
                      <span className="list-item__title">{s.name}</span>
                      <span className="list-item__sub">{s.known.find((k) => k.featureId === f.id)?.note}</span>
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

        <p className="tiny muted">挿絵はこのアプリのために描いた模式図で、実在の特定の建物を写したものではありません。</p>
      </div>
    </Screen>
  );
}
