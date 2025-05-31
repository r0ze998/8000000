# 🛫 TestFlight配信ガイド

## 📋 事前準備チェックリスト

### 1. **Apple Developer Account**
- [ ] Apple Developer Program登録済み（年額$99）
- [ ] App Store Connect アクセス権限確認
- [ ] 開発者証明書とプロビジョニングプロファイル作成済み

### 2. **アプリ設定**
- [ ] Bundle ID設定: `com.culturalshrine.village`
- [ ] アプリ名: `文化神社村 - Cultural Shrine Village`
- [ ] バージョン: `1.0.0`
- [ ] ビルド番号: `1`

## 🛠️ TestFlight用ビルド手順

### Step 1: 依存関係の最終確認
```bash
cd frontend
npm install
npm audit fix
```

### Step 2: プロダクションビルド
```bash
npm run build:production
```

### Step 3: iOSプロジェクト同期
```bash
npx cap sync ios
```

### Step 4: Xcodeでプロジェクトを開く
```bash
npx cap open ios
```

### Step 5: Xcode設定（重要）

#### A. General設定
1. **Bundle Identifier**: `com.culturalshrine.village`
2. **Version**: `1.0.0`
3. **Build**: `1`
4. **Deployment Target**: `15.0`
5. **Device Orientation**: Portrait のみ選択

#### B. Signing & Capabilities
1. **Team**: 自分のApple Developer Team選択
2. **Signing Certificate**: Distribution証明書選択
3. **Provisioning Profile**: App Store用プロファイル選択
4. **Capabilities追加**:
   - Camera (写真認証用)
   - Location Services (GPS認証用)
   - Push Notifications (将来の機能拡張用)

#### C. Info.plist設定
以下の権限説明を追加:
- `NSCameraUsageDescription`: "神社参拝の写真認証のために使用します"
- `NSLocationWhenInUseUsageDescription`: "神社への参拝をGPSで認証するために使用します"

### Step 6: Archive作成
1. Xcodeで Product → Archive
2. Archiveが完了するまで待機
3. Organizer ウィンドウで Archive確認

### Step 7: App Store Connect にアップロード
1. Organizer で "Distribute App" をクリック
2. "App Store Connect" を選択
3. "Upload" を選択
4. 証明書とプロビジョニングプロファイルを確認
5. "Upload" 実行

## 📱 App Store Connect 設定

### 1. **アプリ情報**
```
アプリ名: 文化神社村
副題: 神社参拝でNFTを集めよう
カテゴリ: ライフスタイル
年齢制限: 4+
```

### 2. **アプリ説明文**
```
🛩️ 日本の伝統文化を体験する革新的なアプリ

⛩️ 主な機能
• 全国の神社・寺院をGPSや写真で認証
• 参拝記録をNFTとして永続保存
• おみくじシステムでレアアイテム収集
• 自分だけの神社村を建設・育成
• ブロックチェーン（Starknet）で所有権保証

🎋 特別な体験
• 伝統的なおみくじを現代風にアレンジ
• 季節に応じた特別イベント
• 和風ゲーミフィケーションでモチベーション向上
• 雅楽BGMで本格的な神社体験

📱 対応機能
• iPhone X以降のフルスクリーン対応
• ダークモード対応
• オフライン対応（一部機能）
• カメラ・GPS・プッシュ通知

🌸 日本の美しい文化を次世代に継承する、
新しい形の文化体験アプリです。
```

### 3. **キーワード設定**
```
神社,寺院,参拝,NFT,ブロックチェーン,文化,伝統,おみくじ,御朱印,日本,和風,ゲーム
```

### 4. **スクリーンショット準備**
以下のサイズで各画面のスクリーンショットが必要:
- iPhone 6.7" (iPhone 14 Pro Max): 1290 x 2796 px
- iPhone 6.5" (iPhone 14 Plus): 1242 x 2688 px  
- iPhone 5.5" (iPhone 8 Plus): 1242 x 2208 px

必要な画面:
1. メイン画面（神社村ビュー）
2. 参拝画面（カメラ認証）
3. おみくじ画面（アニメーション中）
4. コレクション画面（NFT一覧）
5. プレイヤーステータス画面

### 5. **プライバシー設定**
- カメラ使用: 写真認証機能
- 位置情報使用: GPS認証機能
- データ収集: なし（ローカル保存のみ）

## 🧪 TestFlight配信設定

### 1. **内部テスター追加**
- 開発チームメンバーを追加
- 最大25名まで登録可能

### 2. **外部テスター追加**
- 一般ユーザー向けテスト
- 最大10,000名まで登録可能
- Appleの審査が必要（通常1-3日）

### 3. **テスト情報設定**
```
テスト情報:
この版では以下の新機能をテストしてください：
• 神社参拝のカメラ・GPS認証
• おみくじシステムの動作
• NFT生成とコレクション機能
• 神社村建設システム
• サウンドエフェクトの動作

既知の問題:
• 初回起動時に権限許可が必要です
• インターネット接続が必要です

フィードバック募集中:
• 操作性の改善点
• デザインの意見
• 新機能のアイデア
```

## 🚀 リリース自動化

### package.json への追加スクリプト
```json
{
  "scripts": {
    "build:production": "GENERATE_SOURCEMAP=false npm run build",
    "testflight:build": "npm run build:production && npx cap sync ios",
    "testflight:open": "npx cap open ios"
  }
}
```

### 自動ビルドスクリプト作成
```bash
#!/bin/bash
# testflight-deploy.sh

echo "🚀 TestFlight用ビルドを開始..."

# 1. 依存関係更新
npm install

# 2. プロダクションビルド
npm run build:production

# 3. iOS同期
npx cap sync ios

# 4. Xcodeを開く
npx cap open ios

echo "✅ Xcodeが開きました。Archive を実行してください。"
```

## 📊 分析・監視設定

### 1. **App Store Connect Analytics**
- ダウンロード数追跡
- クラッシュレポート監視
- ユーザー評価追跡

### 2. **TestFlight Feedback**
- ベータテスター からのフィードバック収集
- クラッシュログの自動収集
- 使用状況分析

## ⚠️ 注意事項

### 1. **審査準備**
- App Review Guidelinesの遵守確認
- メタデータとスクリーンショットの一致確認
- 年齢制限の適切な設定

### 2. **プライバシー**
- カメラ・位置情報の用途明記
- データ収集方針の明確化
- GDPR対応（EU向け）

### 3. **技術要件**
- iOS 15.0以降対応
- IPv6ネットワーク対応
- 64bit必須

## 📞 サポート情報

### 何か問題が発生した場合:
1. まず [Capacitor公式ドキュメント](https://capacitorjs.com/docs/ios) を確認
2. [Apple Developer Forums](https://developer.apple.com/forums/) で検索
3. プロジェクトのIssueで質問

---

このガイドに従って、TestFlightでのベータテスト配信を開始しましょう！🎌