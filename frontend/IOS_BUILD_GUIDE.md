# 🍎 iOS アプリビルドガイド

## 📱 新機能の概要

### 1. **ボトムナビゲーション**
- サイト下部にiOS風のタブバー配置
- 5つのタブ: 参拝、神社、おみくじ、コミュニティ、イベント
- スムーズなアニメーションとタップフィードバック

### 2. **おみくじシステム** 🎋
- 神社参拝時に自動的におみくじが引ける
- レア度システム:
  - 大吉 (1%) - 超レア ✨
  - 中吉 (10%) - レア
  - 小吉 (20%) - アンコモン
  - 吉 (30%) - コモン
  - 末吉 (20%) - コモン
  - 凶 (15%) - アンコモン
  - 大凶 (4%) - レア（逆の意味で）
- カテゴリー別おみくじ（学業運、恋愛運、金運、健康運、仕事運）
- 季節限定おみくじ（正月、桜、七夕など）
- おみくじコレクション機能
- NFTとして保存可能

### 3. **iOS最適化**
- Safe Area対応（ノッチ、ホームインジケーター）
- スムーズスクロール（-webkit-overflow-scrolling: touch）
- ステータスバースタイル調整
- スプラッシュスクリーン
- 画面回転制御（縦向き固定）

## 🛠️ ビルド手順

### 前提条件
- macOS
- Xcode 15以上
- Node.js 18以上
- iOS開発者アカウント（実機テスト用）

### 1. 依存関係のインストール
```bash
cd frontend
npm install
```

### 2. iOSプロジェクトの初期化
```bash
npx cap add ios
```

### 3. ビルドとiOSプロジェクト同期
```bash
npm run ios:build
```

### 4. Xcodeでプロジェクトを開く
```bash
npm run ios:open
```

### 5. Xcode設定
1. Signing & Capabilities で開発チームを設定
2. Bundle Identifierを設定（例: com.yourname.culturalshrinevillage）
3. Deployment Targetを15.0以上に設定

### 6. 実行
- シミュレーター: Xcodeで実行ボタンをクリック
- 実機: デバイスを接続してXcodeで実行

## 📲 PWAとしての利用

iOSでPWAとして使用する場合:

1. Safariでアプリを開く
2. 共有ボタンをタップ
3. 「ホーム画面に追加」を選択
4. 名前を設定して追加

## 🎮 新機能の使い方

### おみくじを引く
1. 「参拝」タブで神社を選択
2. 写真またはGPS認証で参拝を証明
3. 自動的におみくじが表示される
4. レア度に応じてボーナス経験値獲得
5. 「おみくじ」タブでコレクションを確認

### コレクション要素
- 全レア度のおみくじを集める
- 季節限定おみくじをコンプリート
- 100回以上引いて「おみくじマスター」称号獲得

## 🐛 トラブルシューティング

### ビルドエラーの場合
```bash
# クリーンビルド
rm -rf node_modules
rm -rf ios
npm install
npx cap add ios
npm run ios:build
```

### 画面がずれる場合
- capacitor.config.tsでiosの設定を確認
- index.htmlのviewportメタタグを確認

### スクロールが効かない場合
- CSSで-webkit-overflow-scrolling: touchが設定されているか確認

## 📝 今後の拡張予定

- ARでおみくじを現実世界に表示
- おみくじNFTのトレード機能
- 友達とおみくじを共有
- 月間・年間の運勢グラフ
- Apple Watchアプリ対応

## 🔗 関連リンク

- [Capacitor Documentation](https://capacitorjs.com)
- [React Native vs Capacitor](https://capacitorjs.com/docs/getting-started/with-ionic)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios)

---

質問や問題がある場合は、Issueを作成してください。