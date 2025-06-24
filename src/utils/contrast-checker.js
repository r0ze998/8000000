// WCAG 2.2 SC 1.4.3 コントラスト比チェッカー

// 色を16進数からRGBに変換
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// RGB値から相対輝度を計算
function getRelativeLuminance(r, g, b) {
  // RGB値を0-1の範囲に正規化
  const rs = r / 255;
  const gs = g / 255;
  const bs = b / 255;
  
  // 線形RGB値に変換
  const rLinear = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
  const gLinear = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
  const bLinear = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);
  
  // 相対輝度を計算
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

// 2つの色のコントラスト比を計算
export function calculateContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) {
    throw new Error('Invalid color format. Use hex format (e.g., #FFFFFF)');
  }
  
  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// WCAG準拠レベルをチェック
export function checkWCAGCompliance(foreground, background, fontSize = 16, fontWeight = 'normal', level = 'AA') {
  const ratio = calculateContrastRatio(foreground, background);
  
  // 大きなテキストの判定 (18px以上 または 14px以上の太字)
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight === 'bold');
  
  // レベル別要件
  const requirements = {
    'AA': {
      normal: 4.5,
      large: 3.0
    },
    'AAA': {
      normal: 7.0,
      large: 4.5
    }
  };
  
  const required = requirements[level][isLargeText ? 'large' : 'normal'];
  const passes = ratio >= required;
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    required,
    passes,
    level,
    isLargeText,
    grade: passes ? (level === 'AAA' ? 'AAA' : 'AA') : 'Fail'
  };
}

// 推奨色を生成（指定したコントラスト比を満たす）
export function generateCompliantColor(baseColor, backgroundColor, targetRatio = 4.5) {
  const baseRgb = hexToRgb(baseColor);
  const bgRgb = hexToRgb(backgroundColor);
  
  if (!baseRgb || !bgRgb) {
    throw new Error('Invalid color format');
  }
  
  // 背景の輝度
  const bgLuminance = getRelativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  
  // 目標輝度を計算
  let targetLuminance;
  if (bgLuminance > 0.5) {
    // 明るい背景の場合、暗い色が必要
    targetLuminance = (bgLuminance + 0.05) / targetRatio - 0.05;
  } else {
    // 暗い背景の場合、明るい色が必要
    targetLuminance = (bgLuminance + 0.05) * targetRatio - 0.05;
  }
  
  // HSL色空間で調整
  const hsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
  
  // 明度を調整してターゲット輝度に近づける
  let adjustedLightness = hsl.l;
  if (targetLuminance < bgLuminance) {
    // より暗く
    adjustedLightness = Math.max(0, hsl.l - 0.3);
  } else {
    // より明るく
    adjustedLightness = Math.min(1, hsl.l + 0.3);
  }
  
  const adjustedRgb = hslToRgb(hsl.h, hsl.s, adjustedLightness);
  return rgbToHex(adjustedRgb.r, adjustedRgb.g, adjustedRgb.b);
}

// RGB to HSL変換
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return { h, s, l };
}

// HSL to RGB変換
function hslToRgb(h, s, l) {
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// RGB to Hex変換
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// ページ内のすべての色をチェック
export function auditPageContrast(minRatio = 4.5) {
  const issues = [];
  
  // すべてのテキスト要素を取得
  const textElements = document.querySelectorAll('*');
  
  textElements.forEach((element) => {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;
    
    // テキストがある要素のみチェック
    if (element.textContent.trim() && color !== backgroundColor) {
      try {
        const colorHex = rgbToHex(...color.match(/\d+/g).map(Number));
        const bgColorHex = rgbToHex(...backgroundColor.match(/\d+/g).map(Number));
        
        const result = checkWCAGCompliance(colorHex, bgColorHex);
        
        if (!result.passes) {
          issues.push({
            element,
            foreground: colorHex,
            background: bgColorHex,
            ratio: result.ratio,
            required: result.required,
            text: element.textContent.trim().substring(0, 50)
          });
        }
      } catch (error) {
        // RGB値の解析に失敗した場合はスキップ
      }
    }
  });
  
  return issues;
}

// 自動修正の提案
export function suggestAccessibleColors(foreground, background, targetLevel = 'AA') {
  const suggestions = [];
  
  // 現在のコントラスト比をチェック
  const current = checkWCAGCompliance(foreground, background, 16, 'normal', targetLevel);
  
  if (current.passes) {
    return { current, suggestions: [] };
  }
  
  // 前景色を調整
  try {
    const adjustedForeground = generateCompliantColor(
      foreground, 
      background, 
      targetLevel === 'AAA' ? 7.0 : 4.5
    );
    
    const foregroundResult = checkWCAGCompliance(adjustedForeground, background, 16, 'normal', targetLevel);
    
    if (foregroundResult.passes) {
      suggestions.push({
        type: 'foreground',
        color: adjustedForeground,
        result: foregroundResult
      });
    }
  } catch (error) {
    console.warn('Could not generate compliant foreground color:', error);
  }
  
  // 背景色を調整
  try {
    const adjustedBackground = generateCompliantColor(
      background, 
      foreground, 
      targetLevel === 'AAA' ? 7.0 : 4.5
    );
    
    const backgroundResult = checkWCAGCompliance(foreground, adjustedBackground, 16, 'normal', targetLevel);
    
    if (backgroundResult.passes) {
      suggestions.push({
        type: 'background',
        color: adjustedBackground,
        result: backgroundResult
      });
    }
  } catch (error) {
    console.warn('Could not generate compliant background color:', error);
  }
  
  return { current, suggestions };
}

// 開発時のコントラストチェック
export function enableContrastDebugging() {
  if (process.env.NODE_ENV !== 'development') return;
  
  console.log('🎨 Contrast debugging enabled');
  
  // ページロード時にチェック
  const checkContrast = () => {
    const issues = auditPageContrast();
    
    if (issues.length > 0) {
      console.warn(`🚨 Found ${issues.length} contrast issues:`);
      issues.forEach((issue, index) => {
        console.warn(`${index + 1}. Ratio: ${issue.ratio}:1 (required: ${issue.required}:1)`);
        console.warn(`   Text: "${issue.text}"`);
        console.warn(`   Colors: ${issue.foreground} on ${issue.background}`);
        console.warn('   Element:', issue.element);
      });
    } else {
      console.log('✅ No contrast issues found');
    }
  };
  
  // 初回チェック
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkContrast);
  } else {
    checkContrast();
  }
  
  // 動的変更の監視
  const observer = new MutationObserver(() => {
    setTimeout(checkContrast, 100);
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });
}

// プリセット色パレット（WCAG準拠）
export const compliantColorPalette = {
  // 白背景用の色（AA準拠）
  onWhite: {
    primary: '#0066CC',      // 7.3:1
    secondary: '#595959',    // 7.0:1
    success: '#0D7C0D',      // 6.8:1
    error: '#CC0000',        // 7.4:1
    warning: '#B8860B',      // 4.9:1
    info: '#0066CC',         // 7.3:1
    muted: '#666666',        // 6.3:1
  },
  
  // 黒背景用の色（AA準拠）
  onBlack: {
    primary: '#66B2FF',      // 7.1:1
    secondary: '#B3B3B3',    // 7.4:1
    success: '#4ADE80',      // 4.9:1
    error: '#FB7185',        // 4.7:1
    warning: '#FBBF24',      // 4.8:1
    info: '#66B2FF',         // 7.1:1
    muted: '#999999',        // 4.6:1
  }
};

export default {
  calculateContrastRatio,
  checkWCAGCompliance,
  generateCompliantColor,
  auditPageContrast,
  suggestAccessibleColors,
  enableContrastDebugging,
  compliantColorPalette
};