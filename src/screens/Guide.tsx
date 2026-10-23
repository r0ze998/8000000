import { Link } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { Illustration } from '../components/Illustration';
import { GuideMeter, Stamp } from '../components/Progress';
import { useNotebook } from '../state/NotebookContext';
import { featureStatus } from '../state/model';
import { CATEGORY_LABEL, CATEGORY_ORDER, featuresIn } from '../data/features';

const STATUS_TEXT = { unknown: 'まだ知らない', learned: '知っている・未見', seen: '見た' } as const;

export function Guide() {
  const { nb } = useNotebook();
  return (
    <Screen title="図鑑">
      <div className="stack-l">
        <section className="stack">
          <div className="stack-s">
            <h2>境内図鑑</h2>
            <p className="small muted">知ったものは線画に、現地で見たものには印が押されます。</p>
          </div>
          <GuideMeter nb={nb} />
          <Link to="/drill" className="card card--link row" style={{ gap: 14 }}>
            <span style={{ width: 72, flex: 'none' }}>
              <Illustration id="style-taisha" />
            </span>
            <span className="stack-s" style={{ flex: 1, gap: 2 }}>
              <strong>見分け稽古</strong>
              <span className="small muted">5問で、鳥居・社殿・神使の見分けを覚える。</span>
            </span>
            <span className="chev">
              <Icon name="chevron" />
            </span>
          </Link>
        </section>

        {CATEGORY_ORDER.map((cat) => (
          <section key={cat} className="stack-s" aria-labelledby={`cat-${cat}`}>
            <h3 id={`cat-${cat}`}>{CATEGORY_LABEL[cat]}</h3>
            <ul className="grid-tiles" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {featuresIn(cat).map((f) => {
                const st = featureStatus(nb, f.id);
                const pinned = nb.pinned.includes(f.id);
                return (
                  <li key={f.id}>
                    <Link
                      to={`/guide/${f.id}`}
                      className={`tile tile--${st}`}
                      aria-label={`${f.name}（${STATUS_TEXT[st]}${pinned ? '・探し物' : ''}）`}
                    >
                      {pinned && (
                        <span className="tile__pin">
                          <Icon name="pin" />
                        </span>
                      )}
                      {st === 'seen' && <Stamp />}
                      <Illustration id={f.id} />
                      <span className="tile__name">{f.name}</span>
                      <span className="tile__status">{STATUS_TEXT[st]}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <p className="tiny muted">
          挿絵はこのアプリのために描いた模式図で、実在の特定の建物を写したものではありません。
        </p>
      </div>
    </Screen>
  );
}
