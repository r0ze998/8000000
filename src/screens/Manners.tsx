import { Screen } from '../components/Screen';
import { FactList, GuideBox } from '../components/Facts';
import { ETIQUETTE_FACTS, PRIVACY_POINTS, VISIT_GUIDANCE } from '../data/etiquette';

export function Manners() {
  return (
    <Screen title="参拝の心得" back="/">
      <div className="stack-l">
        <section className="stack">
          <h2>参拝の作法</h2>
          <FactList facts={ETIQUETTE_FACTS} />
          <p className="small muted">神社ごとに作法や掲示が異なることがあります。境内の案内を優先してください。</p>
        </section>
        <GuideBox title="境内で記録するときのお願い" items={VISIT_GUIDANCE} />
        <section className="stack-s">
          <h2>このアプリが「しない」こと</h2>
          <ul className="small" style={{ margin: 0, paddingLeft: '1.2em', display: 'grid', gap: 6 }}>
            <li>ほかの人と数や速さを競う順位表、連続日数、毎日の通知はありません。</li>
            <li>特定の時間（早朝・夜間）に訪れると得をする仕組みはありません。</li>
            {PRIVACY_POINTS.slice(1, 3).map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      </div>
    </Screen>
  );
}
