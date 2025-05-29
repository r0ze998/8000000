# 文化神社村 iOS アプリセットアップガイド

## 📱 必要な環境

- macOS (最新版推奨)
- Xcode 14.0以上
- CocoaPods
- Apple Developer Program（App Store公開の場合）

## 🚀 セットアップ手順

### 1. Xcodeのインストール
```bash
# App StoreからXcodeをインストール
# または
xcode-select --install
```

### 2. CocoaPodsのインストール
```bash
sudo gem install cocoapods
```

### 3. iOSプロジェクトの追加
```bash
# frontendディレクトリで実行
npx cap add ios
npx cap sync ios
```

### 4. Xcodeでプロジェクトを開く
```bash
npx cap open ios
```

## 📝 Info.plist設定

以下の権限をInfo.plistに追加してください：

```xml
<key>NSCameraUsageDescription</key>
<string>神社・お寺の参拝写真を撮影するためにカメラを使用します</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>参拝写真を保存・選択するために写真ライブラリを使用します</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>神社・お寺への参拝を確認するために位置情報を使用します</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>神社・お寺への参拝を確認するために位置情報を使用します</string>
```

## 🎨 アプリアイコンとスプラッシュスクリーン

### アイコンサイズ
- 1024×1024px (App Store用)
- 180×180px (iPhone用)
- 167×167px (iPad Pro用)
- 152×152px (iPad用)
- 120×120px (iPhone用)

### スプラッシュスクリーン
- 2732×2732px (iPad Pro 12.9")
- 2048×2048px (iPad Pro 11")
- 1242×2688px (iPhone 12 Pro Max)
- 1125×2436px (iPhone X/XS/11 Pro)

## 🔧 ビルド設定

### Development Team
1. Xcodeでプロジェクトを開く
2. プロジェクト設定 > Signing & Capabilities
3. TeamをApple Developer Accountに設定

### Bundle Identifier
`com.culturalshrine.village`

### iOS Deployment Target
iOS 13.0以上

## 📱 テスト実行

### シミュレーターで実行
```bash
npx cap run ios
```

### 実機で実行
1. iPhoneをMacに接続
2. Xcodeで実機を選択
3. Runボタンをクリック

## 🚀 App Store提出準備

### 1. アーカイブの作成
1. Xcode > Product > Archive
2. Archivesウィンドウで「Distribute App」

### 2. App Store Connect設定
- アプリ名: 文化神社村
- カテゴリ: ライフスタイル
- 年齢制限: 4+

### 3. スクリーンショット
- 6.5インチ (iPhone 12 Pro Max)
- 5.5インチ (iPhone 8 Plus)
- 12.9インチ (iPad Pro)

## 🐛 トラブルシューティング

### CocoaPodsエラー
```bash
cd ios/App
pod install
pod update
```

### ビルドエラー
```bash
# クリーンビルド
cd ios/App
rm -rf Pods
rm Podfile.lock
pod install
```

### Capacitorの同期
```bash
npx cap sync ios
```

## 📚 参考リンク

- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)