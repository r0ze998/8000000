import { Link } from 'react-router-dom';
import { Screen } from '../components/Screen';

export function NotFound({ what = 'ページ', back = '/' }: { what?: string; back?: string }) {
  return (
    <Screen title="見つかりません" back={back}>
      <div className="empty" style={{ marginTop: 24 }}>
        <p>
          この{what}は見つかりませんでした。
          <br />
          消されたか、リンクが古い可能性があります。
        </p>
        <Link to={back} className="btn btn--primary">
          {back === '/' ? 'きょうへ戻る' : '一覧へ戻る'}
        </Link>
      </div>
    </Screen>
  );
}
