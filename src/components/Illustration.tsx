// 図鑑の挿絵。すべてこのリポジトリ内で描いた線画（外部素材なし）。
// 色は currentColor と CSS 変数で決まるので、ライト／ダークどちらでも使える。

import type { ReactNode } from 'react';

const ground = <path d="M6 92H114" className="ill-ground" />;

const seal = (chars: string[]) => (
  <g>
    {chars.map((c, i) => {
      const cx = chars.length === 1 ? 60 : 36 + i * 48;
      return (
        <g key={c}>
          <circle cx={cx} cy={50} r={chars.length === 1 ? 32 : 22} className="ill-seal" />
          <text x={cx} y={50} className="ill-seal-text" fontSize={chars.length === 1 ? 30 : c.length > 1 ? 14 : 22}>
            {c}
          </text>
        </g>
      );
    })}
  </g>
);

const DRAWINGS: Record<string, ReactNode> = {
  path: (
    <g className="ill-thin">
      {[
        [22, 22], [46, 18], [74, 24], [98, 20], [30, 44], [58, 40], [86, 46], [16, 66], [44, 62], [70, 68], [100, 64], [28, 86], [56, 84], [84, 88],
      ].map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="7" ry="4.5" />
      ))}
    </g>
  ),
  'torii-shinmei': (
    <g>
      {ground}
      <rect x="18" y="18" width="84" height="6" className="ill-fill" />
      <rect x="32" y="24" width="6" height="68" />
      <rect x="82" y="24" width="6" height="68" />
      <rect x="38" y="38" width="44" height="5" className="ill-fill" />
    </g>
  ),
  'torii-myojin': (
    <g>
      {ground}
      <path d="M10 12 Q60 24 110 12 L108 19 Q60 31 12 19 Z" className="ill-fill" />
      <path d="M20 23 Q60 32 100 23 L100 28 Q60 37 20 28 Z" />
      <path d="M33 30 L30 92 H37 L39 30 Z" />
      <path d="M87 30 L90 92 H83 L81 30 Z" />
      <rect x="22" y="44" width="76" height="5" className="ill-fill" />
      <rect x="55" y="33" width="10" height="11" />
    </g>
  ),
  'torii-ryobu': (
    <g>
      {ground}
      <path d="M10 12 Q60 24 110 12 L108 19 Q60 31 12 19 Z" className="ill-fill" />
      <path d="M20 23 Q60 32 100 23 L100 28 Q60 37 20 28 Z" />
      <path d="M33 30 L31 92 H38 L39 30 Z" />
      <path d="M87 30 L89 92 H82 L81 30 Z" />
      <rect x="22" y="44" width="76" height="5" className="ill-fill" />
      <rect x="55" y="33" width="10" height="11" />
      <rect x="20" y="66" width="5" height="26" />
      <rect x="44" y="66" width="5" height="26" />
      <rect x="71" y="66" width="5" height="26" />
      <rect x="95" y="66" width="5" height="26" />
      <path d="M18 70 H51 M69 70 H102" />
    </g>
  ),
  'style-shinmei': (
    <g>
      {ground}
      <path d="M14 46 H106 L98 30 H22 Z" className="ill-fill" />
      <path d="M20 36 L30 14 M28 36 L18 14 M92 36 L102 14 M100 36 L90 14" />
      <rect x="38" y="25" width="8" height="5" rx="2" />
      <rect x="56" y="25" width="8" height="5" rx="2" />
      <rect x="74" y="25" width="8" height="5" rx="2" />
      <rect x="26" y="46" width="68" height="24" />
      <rect x="54" y="52" width="12" height="18" />
      <path d="M18 74 H102 M30 74 V92 M90 74 V92 M60 74 V92" />
      <path d="M52 70 L48 92 M68 70 L72 92" />
    </g>
  ),
  'style-taisha': (
    <g>
      {ground}
      <path d="M18 52 L60 16 L102 52 Z" className="ill-fill" />
      <path d="M55 20 L66 4 M65 20 L54 4" />
      <rect x="28" y="52" width="64" height="24" />
      <rect x="66" y="58" width="12" height="18" />
      <path d="M24 78 H96 M32 78 V92 M88 78 V92" />
      <path d="M66 78 L80 92 M78 78 L92 92 M64 64 Q72 58 82 64" />
    </g>
  ),
  'style-nagare': (
    <g>
      {ground}
      <path d="M18 46 L46 16 Q70 36 112 54" className="ill-fill-line" />
      <path d="M46 16 V12" />
      <rect x="26" y="46" width="44" height="28" />
      <rect x="40" y="54" width="14" height="20" />
      <path d="M98 50 V88 M80 42 V88" />
      <path d="M70 74 L96 88 M22 78 H76 M28 78 V92 M66 78 V92" />
    </g>
  ),
  'style-kasuga': (
    <g>
      {ground}
      <path d="M34 42 L60 18 L86 42 Z" className="ill-fill" />
      <path d="M55 22 L65 8 M65 22 L55 8" />
      <path d="M26 56 Q60 44 94 56" className="ill-fill-line" />
      <rect x="42" y="42" width="36" height="32" />
      <rect x="52" y="54" width="16" height="20" />
      <path d="M32 54 V86 M88 54 V86 M36 78 H84 M42 78 V92 M78 78 V92" />
    </g>
  ),
  'style-gongen': (
    <g>
      {ground}
      <path d="M8 50 L30 26 L52 50 Z" className="ill-fill" />
      <rect x="14" y="50" width="32" height="26" />
      <path d="M46 56 H74 L70 48 H50 Z" />
      <rect x="50" y="56" width="20" height="20" />
      <path d="M68 52 L92 30 L116 52 Z" className="ill-fill" />
      <rect x="74" y="52" width="36" height="24" />
      <rect x="86" y="60" width="12" height="16" />
      <path d="M10 80 H114" />
    </g>
  ),
  'chigi-katsuogi': (
    <g>
      <path d="M8 74 H112 L100 46 H20 Z" className="ill-fill" />
      <path d="M14 60 L34 14 M34 60 L14 14 M86 60 L106 14 M106 60 L86 14" />
      <path d="M31 14 H37 M100 18 H110" />
      <rect x="38" y="36" width="10" height="9" rx="4" />
      <rect x="55" y="36" width="10" height="9" rx="4" />
      <rect x="72" y="36" width="10" height="9" rx="4" />
      <path d="M20 82 H100" className="ill-ground" />
    </g>
  ),
  'komainu-aun': seal(['阿', '吽']),
  'komainu-horn': seal(['獅子', '狛犬']),
  'shinshi-kitsune': seal(['狐']),
  'shinshi-shika': seal(['鹿']),
  'shinshi-ushi': seal(['牛']),
  'shinshi-saru': seal(['猿']),
  temizuya: (
    <g>
      {ground}
      <path d="M12 34 H108 L96 18 H24 Z" className="ill-fill" />
      <path d="M24 34 V92 M96 34 V92" />
      <rect x="34" y="62" width="52" height="18" className="ill-fill" />
      <path d="M38 80 V92 M82 80 V92" />
      <path d="M46 58 L60 50 M60 50 a3 3 0 1 0 0.1 0 M66 58 L80 50 M80 50 a3 3 0 1 0 0.1 0" />
    </g>
  ),
  shimenawa: (
    <g>
      <path d="M8 24 Q60 44 112 24" />
      <path d="M8 34 Q60 56 112 34" />
      <path d="M8 29 Q60 50 112 29" className="ill-thin" />
      <path d="M30 40 l6 8 h-6 l6 8 h-6 l6 8" />
      <path d="M52 46 l6 8 h-6 l6 8 h-6 l6 8" />
      <path d="M74 46 l6 8 h-6 l6 8 h-6 l6 8" />
      <path d="M94 40 l6 8 h-6 l6 8 h-6 l6 8" />
    </g>
  ),
  shinboku: (
    <g>
      {ground}
      <path d="M48 92 Q52 70 50 46 H70 Q68 70 72 92" className="ill-fill" />
      <path d="M60 46 C20 50 14 18 42 14 C50 2 76 2 82 14 C108 16 104 50 60 46" />
      <path d="M48 66 Q60 72 72 66" />
      <path d="M54 69 l3 5 h-3 l3 5 M64 69 l3 5 h-3 l3 5" />
    </g>
  ),
  sessha: (
    <g>
      {ground}
      <path d="M34 48 L54 28 Q70 42 94 52" className="ill-fill-line" />
      <rect x="40" y="48" width="30" height="22" />
      <rect x="49" y="54" width="12" height="16" />
      <path d="M86 50 V80 M36 74 H80 M40 74 V92 M76 74 V92" />
    </g>
  ),
  ema: (
    <g>
      <path d="M60 8 L40 34 M60 8 L80 34" className="ill-thin" />
      <path d="M26 34 L60 24 L94 34 V82 H26 Z" className="ill-fill" />
      <path d="M38 50 H82 M38 60 H74 M38 70 H66" className="ill-thin" />
      <circle cx="60" cy="31" r="2.5" />
    </g>
  ),
  toro: (
    <g>
      {ground}
      <path d="M58 6 a4 4 0 1 0 4 0" />
      <path d="M30 26 Q60 14 90 26 L84 30 H36 Z" className="ill-fill" />
      <rect x="42" y="30" width="36" height="20" />
      <rect x="54" y="34" width="12" height="12" className="ill-fill" />
      <path d="M38 50 H82 L78 56 H42 Z" />
      <rect x="54" y="56" width="12" height="24" />
      <path d="M40 80 H80 L84 92 H36 Z" />
    </g>
  ),
};

export function Illustration({ id, label, className = '' }: { id: string; label?: string; className?: string }) {
  const art = DRAWINGS[id];
  if (!art) return null;
  return (
    <svg
      viewBox="0 0 120 100"
      className={`illustration ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {art}
    </svg>
  );
}
