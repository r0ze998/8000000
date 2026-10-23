import { useEffect, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { useNotebook } from '../state/NotebookContext';
import { activeVisit } from '../state/model';
import { SHRINE_BY_ID } from '../data/shrines';

const TABS = [
  { to: '/', label: 'きょう', icon: 'today', end: true },
  { to: '/places', label: 'さがす', icon: 'places', end: false },
  { to: '/guide', label: '図鑑', icon: 'guide', end: false },
  { to: '/notebook', label: '帳面', icon: 'notebook', end: false },
];

function TabBar() {
  const { nb } = useNotebook();
  const recording = Boolean(activeVisit(nb));
  return (
    <nav className="tabbar" aria-label="メインメニュー">
      <ul className="tabbar__list">
        {TABS.map((t) => (
          <li key={t.to}>
            <NavLink to={t.to} end={t.end} className={({ isActive }) => `tabbar__link${isActive ? ' active' : ''}`}>
              <Icon name={t.icon} />
              <span>{t.label}</span>
              {t.to === '/' && recording && <span className="tabbar__badge" aria-label="記録中" />}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** 履歴があれば戻る。直接開かれたページなら fallback へ */
export function useBack(fallback: string) {
  const navigate = useNavigate();
  return () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate(fallback, { replace: true });
  };
}

function Banners() {
  const { nb, health, loadStatus, backupKey, dismissLoadNotice } = useNotebook();
  const demoShrine = SHRINE_BY_ID[nb.settings.demoPlaceId];
  return (
    <div className="banner-stack" aria-live="polite">
      {nb.settings.demo && (
        <div className="banner banner--demo" role="status">
          <div className="banner__body">
            <span className="banner__title">デモモード</span>
            {`：模擬位置（${demoShrine?.name ?? '—'}）で動いています。記録には「デモ」と付きます。`}{' '}
            <Link to="/settings#demo">切り替え</Link>
          </div>
        </div>
      )}
      {health === 'unavailable' && (
        <div className="banner banner--warn" role="alert">
          <div className="banner__body">
            <span className="banner__title">この端末に保存できません</span>
            <br />
            プライベートブラウズ等で保存が制限されています。閉じると記録は消えます。
          </div>
        </div>
      )}
      {health === 'save-failed' && (
        <div className="banner banner--warn" role="alert">
          <div className="banner__body">
            <span className="banner__title">保存に失敗しました</span>
            <br />
            端末の空き容量が足りない可能性があります。<Link to="/settings#data">帳面を書き出す</Link>と安全です。
          </div>
        </div>
      )}
      {loadStatus === 'recovered' && (
        <div className="banner banner--warn" role="alert">
          <div className="banner__body">
            <span className="banner__title">保存データを読み込めませんでした</span>
            <br />
            元のデータは消さずに退避しました（{backupKey}）。新しい帳面で始めています。
            <br />
            <button type="button" className="link" onClick={dismissLoadNotice}>
              わかった
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface ScreenProps {
  title: string;
  /** 戻るボタンを出す場合の、履歴がないときの戻り先 */
  back?: string;
  tabs?: boolean;
  /** 画面下に固定する主操作 */
  dock?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  brand?: boolean;
}

export function Screen({ title, back, tabs = true, dock, actions, children, brand }: ScreenProps) {
  const goBack = useBack(back ?? '/');
  useEffect(() => {
    document.title = `${title} | やおよろず帳`;
  }, [title]);
  return (
    <div className={`shell${tabs ? ' shell--tabs' : ''}`}>
      <header className="topbar">
        <div className="topbar__inner">
          {back !== undefined && (
            <button type="button" className="icon-btn" onClick={goBack} aria-label="戻る">
              <Icon name="back" />
            </button>
          )}
          {brand ? (
            <Link to="/" className="topbar__brand topbar__title">
              <img src="./icon.svg" alt="" />
              <span>やおよろず帳</span>
            </Link>
          ) : (
            <h1 className="topbar__title">{title}</h1>
          )}
          {actions}
        </div>
      </header>
      <Banners />
      <main className={`main${dock ? ' main--flow' : ''}`} id="main">
        {brand && <h1 className="visually-hidden">{title}</h1>}
        {children}
      </main>
      {dock && (
        <div className="dock">
          <div className="dock__inner">{dock}</div>
        </div>
      )}
      {tabs && !dock && <TabBar />}
    </div>
  );
}
