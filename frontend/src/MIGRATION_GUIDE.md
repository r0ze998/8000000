# リファクタリング移行ガイド

## 即座に適用できる変更

### 1. ShrineVillageApp.jsのクリーンアップ（低リスク）
```bash
# バックアップ作成
cp ShrineVillageApp.js ShrineVillageApp.original.js

# クリーン版に置き換え
cp ShrineVillageApp.clean.js ShrineVillageApp.js
```

### 2. 未使用ファイルの削除（低リスク）
```bash
# gameフォルダとその内容を削除
rm -rf game/

# その他の未使用ファイル
rm ShrineVillageApp.refactored.js
rm components/GameCanvas.js
rm components/VillageBuilder.js
rm components/BuildingPalette.js
rm components/ResourcePanel.js
```

### 3. 重複ディレクトリの統合（中リスク）
```bash
# 重複ディレクトリを削除
rm -rf components/tabs
rm -rf components/auth  
rm -rf components/shrine
rm -rf components/modals
rm -rf components/effects
rm -rf components/audio
```

## 段階的な移行（推奨）

### Phase 1: クリーンアップのみ（今すぐ実行可能）
1. ShrineVillageApp.clean.jsを使用
2. 未使用ファイルを削除
3. テストして動作確認

### Phase 2: Context API導入（1-2日）
1. contexts/フォルダのファイルを追加
2. 各コンポーネントを徐々にContext対応に変更
3. 状態管理を段階的に移行

### Phase 3: 完全なリファクタリング版への移行（3-5日）
1. App.refactored.jsをテスト環境で検証
2. 各コンポーネントの動作確認
3. 本番環境への適用

## コマンド一覧

```bash
# 即座に実行できるクリーンアップ
cd frontend/src

# 1. バックアップ作成
cp ShrineVillageApp.js ShrineVillageApp.backup.js

# 2. クリーン版を適用
cp ShrineVillageApp.clean.js ShrineVillageApp.js

# 3. 未使用ファイル削除
rm -rf game/
rm -rf components/tabs components/auth components/shrine
rm ShrineVillageApp.refactored.js

# 4. ビルドテスト
cd ../..
npm run build

# 5. 開発サーバーで確認
npm start
```

## 注意事項

- 必ずバックアップを作成してから実行
- 各ステップごとに動作確認
- Gitでコミットしながら進める
- 問題が発生したらバックアップから復元

## トラブルシューティング

### インポートエラーが発生した場合
```javascript
// 古い
import HomeTab from './components/tabs/HomeTab';
// 新しい
import HomeTab from './components/HomeTab';
```

### Context関連のエラー
```javascript
// Providerでラップされていることを確認
<AppProvider>
  <App />
</AppProvider>
```

### ビルドエラー
```bash
# キャッシュクリア
rm -rf node_modules
npm install
npm run build
```