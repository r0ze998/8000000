#!/bin/bash

echo "🚀 TestFlight用ビルドを開始します..."
echo "========================================"

# エラーハンドリング
set -e

# 現在のディレクトリを確認
if [ ! -f "package.json" ]; then
    echo "❌ package.jsonが見つかりません。frontendディレクトリで実行してください。"
    exit 1
fi

echo "📦 1. 依存関係を確認・更新中..."
npm install

echo "🔧 2. プロダクション用ビルドを実行中..."
export GENERATE_SOURCEMAP=false
npm run build

if [ ! -d "build" ]; then
    echo "❌ ビルドが失敗しました。"
    exit 1
fi

echo "📱 3. iOSプロジェクトと同期中..."
npx cap sync ios

echo "🔍 4. iOS設定ファイルを確認中..."
if [ ! -f "ios/App/App.xcworkspace/contents.xcworkspacedata" ]; then
    echo "⚠️  iOS プロジェクトが見つかりません。初期化します..."
    npx cap add ios
    npx cap sync ios
fi

echo "📋 5. Info.plistに権限設定を追加中..."
INFO_PLIST="ios/App/App/Info.plist"

# カメラ権限の説明を追加
if ! grep -q "NSCameraUsageDescription" "$INFO_PLIST"; then
    echo "   - カメラ権限を追加"
    /usr/libexec/PlistBuddy -c "Add :NSCameraUsageDescription string '神社参拝の写真認証のために使用します'" "$INFO_PLIST" 2>/dev/null || true
fi

# 位置情報権限の説明を追加
if ! grep -q "NSLocationWhenInUseUsageDescription" "$INFO_PLIST"; then
    echo "   - 位置情報権限を追加"
    /usr/libexec/PlistBuddy -c "Add :NSLocationWhenInUseUsageDescription string '神社への参拝をGPSで認証するために使用します'" "$INFO_PLIST" 2>/dev/null || true
fi

# バックグラウンド実行の設定
if ! grep -q "UIBackgroundModes" "$INFO_PLIST"; then
    echo "   - バックグラウンドモードを追加"
    /usr/libexec/PlistBuddy -c "Add :UIBackgroundModes array" "$INFO_PLIST" 2>/dev/null || true
    /usr/libexec/PlistBuddy -c "Add :UIBackgroundModes:0 string 'background-processing'" "$INFO_PLIST" 2>/dev/null || true
fi

echo "🎨 6. アプリアイコンとスプラッシュスクリーンを確認中..."
ASSETS_DIR="ios/App/App/Assets.xcassets"

if [ ! -f "$ASSETS_DIR/AppIcon.appiconset/Contents.json" ]; then
    echo "   ⚠️  アプリアイコンが設定されていません。後でXcodeで設定してください。"
fi

echo "✅ TestFlight用の準備が完了しました！"
echo ""
echo "📱 次のステップ:"
echo "1. Xcodeを開きます..."
npx cap open ios
echo ""
echo "2. Xcodeで以下を確認してください:"
echo "   • General → Bundle Identifier: com.culturalshrine.village"
echo "   • General → Version: 1.0.0"
echo "   • General → Build: 1"
echo "   • Signing & Capabilities → Team: あなたのApple Developer Team"
echo "   • Signing & Capabilities → Provisioning Profile: App Store用"
echo ""
echo "3. Product → Archive でアーカイブを作成"
echo "4. Organizer → Distribute App → App Store Connect → Upload"
echo ""
echo "🎯 App Store Connectでアプリ情報を設定後、TestFlightでベータテスト開始！"
echo ""
echo "📚 詳細な手順は TESTFLIGHT_GUIDE.md を参照してください。"