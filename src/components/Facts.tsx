import type { Fact } from '../data/features';
import { getSource } from '../data/sources';

export function SourceLinks({ ids }: { ids: string[] }) {
  return (
    <span className="fact__sources">
      {ids.map((id) => {
        const s = getSource(id);
        if (!s) return null;
        return (
          <a key={id} href={s.url} target="_blank" rel="noopener noreferrer">
            出典：{s.publisher === 'Wikipedia' ? s.title : `${s.publisher}「${s.title}」`}
          </a>
        );
      })}
    </span>
  );
}

export function FactList({ facts }: { facts: Fact[] }) {
  return (
    <ul className="factlist">
      {facts.map((f) => (
        <li key={f.text} className={`fact${f.kind === 'folk' ? ' fact--folk' : ''}`}>
          <span>
            {f.kind === 'folk' ? <span className="chip chip--folk">俗説・諸説</span> : <span className="chip chip--fact">事実</span>}
          </span>
          <p>{f.text}</p>
          <SourceLinks ids={f.sources} />
        </li>
      ))}
    </ul>
  );
}

export function GuideBox({ items, title = '探し方（アプリの案内）' }: { items: string[]; title?: string }) {
  return (
    <div className="guidebox">
      <span>
        <span className="chip chip--guide">案内</span> <strong className="small">{title}</strong>
      </span>
      <ul>
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
