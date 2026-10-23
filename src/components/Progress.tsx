import { FEATURES } from '../data/features';
import { featureStatus, type Notebook } from '../state/model';

export function countStatus(nb: Notebook) {
  let seen = 0;
  let learned = 0;
  for (const f of FEATURES) {
    const s = featureStatus(nb, f.id);
    if (s === 'seen') seen++;
    else if (s === 'learned') learned++;
  }
  return { seen, learned, total: FEATURES.length };
}

export function GuideMeter({ nb }: { nb: Notebook }) {
  const { seen, learned, total } = countStatus(nb);
  return (
    <div className="meter">
      <div
        className="meter__bar"
        role="img"
        aria-label={`図鑑 ${total} 項目のうち、現地で見た ${seen}、知っている ${learned}`}
      >
        <span className="meter__seen" style={{ width: `${(seen / total) * 100}%` }} />
        <span className="meter__learned" style={{ width: `${(learned / total) * 100}%` }} />
      </div>
      <div className="legend">
        <span>
          <i style={{ background: 'var(--moss)' }} />
          現地で見た {seen}
        </span>
        <span>
          <i style={{ background: 'color-mix(in srgb, var(--moss) 35%, var(--surface-2))' }} />
          知っている {learned}
        </span>
        <span>全 {total} 項目</span>
      </div>
    </div>
  );
}

export function Stamp({ label = '見た', large, animate }: { label?: string; large?: boolean; animate?: boolean }) {
  return (
    <span className={`stamp${large ? ' stamp--l' : ''}${animate ? ' stamp--animate' : ''}`} aria-label={label}>
      {label}
    </span>
  );
}
