import { Component, useEffect, type ReactNode } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { NotebookProvider } from './state/NotebookContext';
import { Today } from './screens/Today';
import { Places } from './screens/Places';
import { PlaceDetail } from './screens/PlaceDetail';
import { Arrive } from './screens/Arrive';
import { Visit } from './screens/Visit';
import { Guide } from './screens/Guide';
import { GuideEntry } from './screens/GuideEntry';
import { Drill } from './screens/Drill';
import { NotebookScreen } from './screens/NotebookScreen';
import { VisitRecord } from './screens/VisitRecord';
import { Settings } from './screens/Settings';
import { Manners } from './screens/Manners';
import { NotFound } from './screens/NotFound';
import type { LoadResult } from './state/storage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="main" role="alert">
        <div className="card stack" style={{ marginTop: 40 }}>
          <h1>画面を表示できませんでした</h1>
          <p className="muted">
            思わぬ不具合が起きました。帳面のデータは端末に残っています。ホームに戻るか、ページを読み込み直してください。
          </p>
          <p className="tiny muted">{this.state.error.message}</p>
          <div className="row row--wrap">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                window.location.hash = '#/';
                this.setState({ error: null });
              }}
            >
              ホームに戻る
            </button>
            <button type="button" className="btn" onClick={() => window.location.reload()}>
              読み込み直す
            </button>
          </div>
        </div>
      </main>
    );
  }
}

export function App({ initial }: { initial?: LoadResult }) {
  return (
    <ErrorBoundary>
      <NotebookProvider initial={initial}>
        <HashRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/places" element={<Places />} />
            <Route path="/places/:placeId" element={<PlaceDetail />} />
            <Route path="/arrive/:placeId" element={<Arrive />} />
            <Route path="/visit" element={<Visit />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/guide/:featureId" element={<GuideEntry />} />
            <Route path="/drill" element={<Drill />} />
            <Route path="/notebook" element={<NotebookScreen />} />
            <Route path="/notebook/:visitId" element={<VisitRecord />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/manners" element={<Manners />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </NotebookProvider>
    </ErrorBoundary>
  );
}
