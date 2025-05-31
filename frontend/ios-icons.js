const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// iOS App Icon生成スクリプト
// 基本画像から全てのサイズのアイコンを自動生成

const iconSizes = [
  { size: 1024, name: 'icon-1024.png', purpose: 'App Store' },
  { size: 180, name: 'icon-180.png', purpose: 'iPhone App (60pt @3x)' },
  { size: 167, name: 'icon-167.png', purpose: 'iPad Pro App (83.5pt @2x)' },
  { size: 152, name: 'icon-152.png', purpose: 'iPad App (76pt @2x)' },
  { size: 120, name: 'icon-120.png', purpose: 'iPhone App (60pt @2x)' },
  { size: 87, name: 'icon-87.png', purpose: 'iPhone Settings (29pt @3x)' },
  { size: 80, name: 'icon-80.png', purpose: 'iPhone Spotlight (40pt @2x)' },
  { size: 76, name: 'icon-76.png', purpose: 'iPad App (76pt @1x)' },
  { size: 58, name: 'icon-58.png', purpose: 'iPhone Settings (29pt @2x)' },
  { size: 40, name: 'icon-40.png', purpose: 'iPhone Spotlight (40pt @1x)' },
  { size: 29, name: 'icon-29.png', purpose: 'iPhone Settings (29pt @1x)' },
  { size: 20, name: 'icon-20.png', purpose: 'iPhone Notification (20pt @1x)' }
];

const splashSizes = [
  { width: 1290, height: 2796, name: 'splash-1290x2796.png', device: 'iPhone 14 Pro Max' },
  { width: 1179, height: 2556, name: 'splash-1179x2556.png', device: 'iPhone 14 Pro' },
  { width: 1284, height: 2778, name: 'splash-1284x2778.png', device: 'iPhone 13 Pro Max' },
  { width: 1170, height: 2532, name: 'splash-1170x2532.png', device: 'iPhone 13 Pro' },
  { width: 1125, height: 2436, name: 'splash-1125x2436.png', device: 'iPhone 13 mini' },
  { width: 828, height: 1792, name: 'splash-828x1792.png', device: 'iPhone 11' },
  { width: 1242, height: 2688, name: 'splash-1242x2688.png', device: 'iPhone 8 Plus' },
  { width: 750, height: 1334, name: 'splash-750x1334.png', device: 'iPhone 8' }
];

async function generateIcons() {
  console.log('🎨 iOSアプリアイコンを生成中...');
  
  const inputPath = path.join(__dirname, 'src/icon-base.png');
  const outputDir = path.join(__dirname, 'ios/App/App/Assets.xcassets/AppIcon.appiconset');
  
  // 出力ディレクトリを作成
  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (error) {
    console.error('ディレクトリ作成エラー:', error);
  }
  
  // ベースアイコンが存在するかチェック
  try {
    await fs.access(inputPath);
  } catch (error) {
    console.log('⚠️  ベースアイコン (src/icon-base.png) が見つかりません。');
    console.log('代わりにデフォルトの神社アイコンを生成します...');
    await generateDefaultIcon(inputPath);
  }
  
  // 各サイズのアイコンを生成
  for (const icon of iconSizes) {
    try {
      const outputPath = path.join(outputDir, icon.name);
      await sharp(inputPath)
        .resize(icon.size, icon.size, {
          kernel: sharp.kernel.lanczos3,
          fit: 'cover',
          position: 'center'
        })
        .png({ quality: 100 })
        .toFile(outputPath);
      
      console.log(`✅ ${icon.name} (${icon.size}x${icon.size}) - ${icon.purpose}`);
    } catch (error) {
      console.error(`❌ ${icon.name} の生成に失敗:`, error);
    }
  }
  
  // Contents.jsonを生成
  await generateContentsJson(outputDir);
  
  console.log('🎉 アプリアイコンの生成が完了しました！');
}

async function generateSplashScreens() {
  console.log('🌅 スプラッシュスクリーンを生成中...');
  
  const outputDir = path.join(__dirname, 'ios/App/App/Assets.xcassets/Splash.imageset');
  
  // 出力ディレクトリを作成
  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (error) {
    console.error('ディレクトリ作成エラー:', error);
  }
  
  // 各サイズのスプラッシュスクリーンを生成
  for (const splash of splashSizes) {
    try {
      const outputPath = path.join(outputDir, splash.name);
      
      // グラデーション背景のスプラッシュスクリーン生成
      await sharp({
        create: {
          width: splash.width,
          height: splash.height,
          channels: 4,
          background: { r: 26, g: 26, b: 46, alpha: 1 }
        }
      })
      .composite([
        {
          input: Buffer.from(`
            <svg width="${splash.width}" height="${splash.height}" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grad)"/>
              <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${splash.width * 0.08}" 
                    fill="#FFD700" text-anchor="middle" dy="0.3em">⛩️</text>
              <text x="50%" y="${splash.height * 0.6}" font-family="Arial, sans-serif" font-size="${splash.width * 0.04}" 
                    fill="#FFFFFF" text-anchor="middle" dy="0.3em">文化神社村</text>
            </svg>
          `),
          top: 0,
          left: 0
        }
      ])
      .png()
      .toFile(outputPath);
      
      console.log(`✅ ${splash.name} (${splash.width}x${splash.height}) - ${splash.device}`);
    } catch (error) {
      console.error(`❌ ${splash.name} の生成に失敗:`, error);
    }
  }
  
  // スプラッシュスクリーン用のContents.jsonを生成
  await generateSplashContentsJson(outputDir);
  
  console.log('🎉 スプラッシュスクリーンの生成が完了しました！');
}

async function generateDefaultIcon(outputPath) {
  // デフォルトの神社アイコンを生成
  const svgIcon = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#bg)" rx="180"/>
      <text x="512" y="620" font-family="Arial, sans-serif" font-size="400" 
            fill="#FFD700" text-anchor="middle">⛩️</text>
      <text x="512" y="800" font-family="Arial, sans-serif" font-size="80" 
            fill="#FFFFFF" text-anchor="middle">文化神社村</text>
    </svg>
  `;
  
  await sharp(Buffer.from(svgIcon))
    .png()
    .toFile(outputPath);
}

async function generateContentsJson(outputDir) {
  const contents = {
    "images": [
      {
        "idiom": "iphone",
        "scale": "2x",
        "size": "20x20",
        "filename": "icon-40.png"
      },
      {
        "idiom": "iphone",
        "scale": "3x",
        "size": "20x20",
        "filename": "icon-60.png"
      },
      {
        "idiom": "iphone",
        "scale": "2x",
        "size": "29x29",
        "filename": "icon-58.png"
      },
      {
        "idiom": "iphone",
        "scale": "3x",
        "size": "29x29",
        "filename": "icon-87.png"
      },
      {
        "idiom": "iphone",
        "scale": "2x",
        "size": "40x40",
        "filename": "icon-80.png"
      },
      {
        "idiom": "iphone",
        "scale": "3x",
        "size": "40x40",
        "filename": "icon-120.png"
      },
      {
        "idiom": "iphone",
        "scale": "2x",
        "size": "60x60",
        "filename": "icon-120.png"
      },
      {
        "idiom": "iphone",
        "scale": "3x",
        "size": "60x60",
        "filename": "icon-180.png"
      },
      {
        "idiom": "ios-marketing",
        "scale": "1x",
        "size": "1024x1024",
        "filename": "icon-1024.png"
      }
    ],
    "info": {
      "author": "xcode",
      "version": 1
    }
  };
  
  await fs.writeFile(
    path.join(outputDir, 'Contents.json'),
    JSON.stringify(contents, null, 2)
  );
}

async function generateSplashContentsJson(outputDir) {
  const contents = {
    "images": [
      {
        "idiom": "universal",
        "filename": "splash-1290x2796.png",
        "scale": "1x"
      }
    ],
    "info": {
      "author": "xcode",
      "version": 1
    }
  };
  
  await fs.writeFile(
    path.join(outputDir, 'Contents.json'),
    JSON.stringify(contents, null, 2)
  );
}

// スクリプト実行
async function main() {
  try {
    await generateIcons();
    await generateSplashScreens();
    console.log('\n🎊 すべてのアセット生成が完了しました！');
    console.log('Xcodeでプロジェクトを開いてアイコンを確認してください。');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateIcons, generateSplashScreens };