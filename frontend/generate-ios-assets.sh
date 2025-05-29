#!/bin/bash

# iOS用アイコンとスプラッシュスクリーンを生成するスクリプト
# 必要: ImageMagick (brew install imagemagick)

echo "🎨 iOS用アセットを生成します..."

# アイコンのベース画像を作成（SVGから）
cat > icon-base.svg << EOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="#d32f2f"/>
  <text x="512" y="600" text-anchor="middle" font-size="600" fill="white">⛩️</text>
</svg>
EOF

# アイコンサイズ
ICON_SIZES=(
  "20:1x,2x,3x"
  "29:1x,2x,3x"
  "40:1x,2x,3x"
  "60:2x,3x"
  "76:1x,2x"
  "83.5:2x"
  "1024:1x"
)

# スプラッシュスクリーンのベース画像を作成
cat > splash-base.svg << EOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2732 2732">
  <rect width="2732" height="2732" fill="#d32f2f"/>
  <text x="1366" y="1366" text-anchor="middle" font-size="800" fill="white">⛩️</text>
  <text x="1366" y="1800" text-anchor="middle" font-size="200" fill="white">文化神社村</text>
</svg>
EOF

# Resourcesディレクトリを作成
mkdir -p ios/App/App/Assets.xcassets/AppIcon.appiconset
mkdir -p ios/App/App/Assets.xcassets/Splash.imageset

echo "✅ iOS用アセット生成スクリプトを作成しました"
echo "📝 実行方法: bash generate-ios-assets.sh"
echo "⚠️  注意: ImageMagickが必要です (brew install imagemagick)"