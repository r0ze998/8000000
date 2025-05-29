# Cultural Shrine Village - デプロイメント手順

## 🚀 ライブデモサイト作成手順

### Method 1: Vercel での直接デプロイ

1. **Vercel CLI インストール**
```bash
npm i -g vercel
```

2. **ログイン**
```bash
vercel login
```

3. **プロジェクトルートからデプロイ**
```bash
vercel --prod
```

### Method 2: Netlify での直接デプロイ

1. **Netlify サイトにアクセス**
   - https://app.netlify.com/drop

2. **フォルダをドラッグ&ドロップ**
   - `frontend/build` フォルダ（ビルド後）
   - または `frontend` フォルダ全体

3. **自動デプロイ設定**
   - GitHubリポジトリを接続
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/build`

### Method 3: GitHub Pages での公開

1. **静的ファイル生成**
```bash
cd frontend
npm run build
```

2. **GitHub Pages設定**
   - Repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / docs

## 🔧 必要な環境変数

```env
# 本番環境用
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
REACT_APP_STARKNET_NETWORK=mainnet

# 開発環境用
REACT_APP_ENVIRONMENT=development
REACT_APP_STARKNET_NETWORK=sepolia
```

## 📱 PWA 機能確認事項

デプロイ後、以下を確認：

1. **Service Worker 登録**
   - DevTools → Application → Service Workers

2. **マニフェスト**
   - DevTools → Application → Manifest

3. **オフライン機能**
   - ネットワークを無効にして動作確認

4. **アプリ追加**
   - モバイルで「ホーム画面に追加」表示

## 🎯 デモ用初期データ

以下のデータがプリセットされています：

- **ユーザープロフィール**: デモユーザー（文化資本450、レベル5）
- **神社・寺院データ**: 全国200箇所以上
- **コミュニティ投稿**: 3件のサンプル投稿
- **特別イベント**: 季節イベント4種類
- **特別NFT**: 4種類の達成条件付きNFT

## 🔍 トラブルシューティング

### ビルドエラー対応
```bash
# 依存関係の再インストール
cd frontend
rm -rf node_modules package-lock.json
npm install

# キャッシュクリア
npm start -- --reset-cache
```

### デプロイエラー対応
```bash
# 本番用ビルド確認
npm run build
npx serve -s build
```

## 🌐 期待される公開URL

- **Vercel**: `https://cultural-shrine-village-starknet.vercel.app`
- **Netlify**: `https://cultural-shrine-village-starknet.netlify.app`

## 📊 パフォーマンス最適化

1. **画像最適化**: SVGベースのため軽量
2. **コード分割**: React.lazy を使用可能
3. **キャッシュ戦略**: Service Worker による適切なキャッシュ
4. **圧縮**: gzip/brotli 圧縮対応

## 🎉 完成機能一覧

- ✅ Starknet スマートコントラクト
- ✅ React PWA フロントエンド
- ✅ 全国神社・寺院データベース（200箇所+）
- ✅ 文化帯ランクシステム（10段階）
- ✅ コミュニティ共有プラットフォーム
- ✅ 季節限定NFTイベント
- ✅ オフライン対応
- ✅ プッシュ通知
- ✅ モバイルアプリ化

---

**🤖 Built with Claude Code**  
日本の文化をブロックチェーンで永続保存するプラットフォーム