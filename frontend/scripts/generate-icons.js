const fs = require('fs');
const path = require('path');

// SVGアイコンのテンプレート（神社の鳥居をモチーフ）
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e94560;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#673ab7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f3460;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="2" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.3)"/>
    </filter>
  </defs>
  
  <!-- 背景円 -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" fill="url(#grad1)" filter="url(#shadow)"/>
  
  <!-- 鳥居のシルエット -->
  <g transform="translate(${size*0.15},${size*0.2})" fill="white">
    <!-- 上の横木 -->
    <rect x="0" y="${size*0.1}" width="${size*0.7}" height="${size*0.06}" rx="${size*0.02}"/>
    <!-- 下の横木 -->
    <rect x="${size*0.05}" y="${size*0.25}" width="${size*0.6}" height="${size*0.04}" rx="${size*0.015}"/>
    <!-- 左の柱 -->
    <rect x="${size*0.08}" y="${size*0.05}" width="${size*0.06}" height="${size*0.45}" rx="${size*0.015}"/>
    <!-- 右の柱 -->
    <rect x="${size*0.56}" y="${size*0.05}" width="${size*0.06}" height="${size*0.45}" rx="${size*0.015}"/>
    <!-- 装飾 -->
    <circle cx="${size*0.35}" cy="${size*0.55}" r="${size*0.03}" fill="rgba(255,255,255,0.8)"/>
  </g>
</svg>
`;

// 必要なアイコンサイズ
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// publicディレクトリのパス
const publicDir = path.join(__dirname, '..', 'public');

// アイコンを生成
iconSizes.forEach(size => {
  const svg = createIconSVG(size);
  const filename = `icon-${size}.svg`;
  const filepath = path.join(publicDir, filename);
  
  fs.writeFileSync(filepath, svg);
  console.log(`Generated ${filename}`);
});

// Apple Touch Icon用の特別なアイコン
const appleIconSVG = createIconSVG(180);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.svg'), appleIconSVG);
console.log('Generated apple-touch-icon.svg');

// Favicon用
const faviconSVG = createIconSVG(32);
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSVG);
console.log('Generated favicon.svg');

console.log('\n✅ All icon files generated successfully!');
console.log('📝 Note: For production, consider converting SVG to PNG using a tool like sharp or ImageMagick');
console.log('💡 Command example: sharp -i icon-192.svg -o icon-192.png');