// WCAG 2.2準拠アクセシビリティユーティリティ

// フォーカス管理（WCAG 2.4.3）
export class FocusManager {
  constructor() {
    this.focusStack = [];
    this.trapRefs = new WeakMap();
  }
  
  // フォーカストラップの作成
  createFocusTrap(container) {
    const focusableElements = this.getFocusableElements(container);
    
    const trap = {
      container,
      firstFocusable: focusableElements[0],
      lastFocusable: focusableElements[focusableElements.length - 1],
      previousFocus: typeof document !== 'undefined' ? document.activeElement : null
    };
    
    this.trapRefs.set(container, trap);
    
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (typeof document !== 'undefined') {
          if (e.shiftKey) {
            if (document.activeElement === trap.firstFocusable) {
              e.preventDefault();
              trap.lastFocusable?.focus();
            }
          } else {
            if (document.activeElement === trap.lastFocusable) {
              e.preventDefault();
              trap.firstFocusable?.focus();
            }
          }
        }
      } else if (e.key === 'Escape') {
        this.releaseFocusTrap(container);
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    trap.cleanup = () => container.removeEventListener('keydown', handleKeyDown);
    
    // 初期フォーカス
    trap.firstFocusable?.focus();
    
    return trap;
  }
  
  // フォーカストラップの解除
  releaseFocusTrap(container) {
    const trap = this.trapRefs.get(container);
    if (trap) {
      trap.cleanup?.();
      trap.previousFocus?.focus();
      this.trapRefs.delete(container);
    }
  }
  
  // フォーカス可能要素の取得
  getFocusableElements(container) {
    const selector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(',');
    
    return Array.from(container.querySelectorAll(selector))
      .filter(el => this.isVisible(el));
  }
  
  // 要素の可視性チェック
  isVisible(element) {
    if (typeof window === 'undefined') return true;
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0';
  }
}

// 色彩コントラスト検証（WCAG 2.1.4）
export class ContrastChecker {
  // 相対輝度の計算
  static getRelativeLuminance(color) {
    const rgb = this.hexToRgb(color);
    const rsRGB = rgb.r / 255;
    const gsRGB = rgb.g / 255;
    const bsRGB = rgb.b / 255;
    
    const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  
  // コントラスト比の計算
  static getContrastRatio(color1, color2) {
    const l1 = this.getRelativeLuminance(color1);
    const l2 = this.getRelativeLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }
  
  // WCAG AA/AAA準拠チェック
  static checkCompliance(foreground, background, fontSize = 16, level = 'AA') {
    const ratio = this.getContrastRatio(foreground, background);
    const isLargeText = fontSize >= 18 || fontSize >= 14; // Bold text
    
    const requirements = {
      'AA': { normal: 4.5, large: 3 },
      'AAA': { normal: 7, large: 4.5 }
    };
    
    const required = requirements[level][isLargeText ? 'large' : 'normal'];
    
    return {
      ratio,
      required,
      passes: ratio >= required,
      level: level
    };
  }
  
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
}

// スクリーンリーダー対応（WCAG 4.1.2）
export class ScreenReaderAnnouncer {
  constructor() {
    this.liveRegion = typeof document !== 'undefined' ? this.createLiveRegion() : null;
  }
  
  createLiveRegion() {
    if (typeof document === 'undefined') return null;
    
    let region = document.getElementById('sr-live-region');
    if (!region) {
      region = document.createElement('div');
      region.id = 'sr-live-region';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      region.style.position = 'absolute';
      region.style.left = '-10000px';
      region.style.width = '1px';
      region.style.height = '1px';
      region.style.overflow = 'hidden';
      document.body.appendChild(region);
    }
    return region;
  }
  
  announce(message, priority = 'polite') {
    if (!this.liveRegion || typeof document === 'undefined') return;
    
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = '';
      }
    }, 1000);
  }
  
  announceNavigation(fromTab, toTab) {
    this.announce(`${fromTab}から${toTab}に移動しました`);
  }
  
  announceAction(action, result) {
    this.announce(`${action}が完了しました。${result}`);
  }
}

// キーボードナビゲーション（WCAG 2.1.1, 2.1.2）
export class KeyboardNavigationManager {
  constructor() {
    this.skipLinks = typeof document !== 'undefined' ? this.createSkipLinks() : null;
    this.navigationMap = new Map();
  }
  
  createSkipLinks() {
    if (typeof document === 'undefined') return null;
    
    const skipContainer = document.createElement('div');
    skipContainer.className = 'skip-links';
    
    const skipToMain = document.createElement('a');
    skipToMain.href = '#main';
    skipToMain.textContent = 'メインコンテンツにスキップ';
    skipToMain.className = 'skip-link';
    
    const skipToNav = document.createElement('a');
    skipToNav.href = '#navigation';
    skipToNav.textContent = 'ナビゲーションにスキップ';
    skipToNav.className = 'skip-link';
    
    skipContainer.appendChild(skipToMain);
    skipContainer.appendChild(skipToNav);
    
    document.body.insertBefore(skipContainer, document.body.firstChild);
    
    return { skipToMain, skipToNav };
  }
  
  // 方向キーナビゲーションの登録
  registerArrowNavigation(container, items, options = {}) {
    const {
      wrap = true,
      orientation = 'horizontal', // 'horizontal' | 'vertical' | 'grid'
      gridColumns = 1
    } = options;
    
    const handleKeyDown = (e) => {
      if (typeof document === 'undefined') return;
      
      const currentIndex = items.findIndex(item => item === document.activeElement);
      if (currentIndex === -1) return;
      
      let newIndex = currentIndex;
      
      switch (e.key) {
        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'grid') {
            newIndex = wrap ? (currentIndex + 1) % items.length : Math.min(currentIndex + 1, items.length - 1);
          }
          break;
        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'grid') {
            newIndex = wrap ? (currentIndex - 1 + items.length) % items.length : Math.max(currentIndex - 1, 0);
          }
          break;
        case 'ArrowDown':
          if (orientation === 'vertical') {
            newIndex = wrap ? (currentIndex + 1) % items.length : Math.min(currentIndex + 1, items.length - 1);
          } else if (orientation === 'grid') {
            newIndex = Math.min(currentIndex + gridColumns, items.length - 1);
          }
          break;
        case 'ArrowUp':
          if (orientation === 'vertical') {
            newIndex = wrap ? (currentIndex - 1 + items.length) % items.length : Math.max(currentIndex - 1, 0);
          } else if (orientation === 'grid') {
            newIndex = Math.max(currentIndex - gridColumns, 0);
          }
          break;
        case 'Home':
          newIndex = 0;
          break;
        case 'End':
          newIndex = items.length - 1;
          break;
        default:
          return;
      }
      
      if (newIndex !== currentIndex) {
        e.preventDefault();
        items[newIndex]?.focus();
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    this.navigationMap.set(container, handleKeyDown);
  }
  
  unregisterArrowNavigation(container) {
    const handler = this.navigationMap.get(container);
    if (handler) {
      container.removeEventListener('keydown', handler);
      this.navigationMap.delete(container);
    }
  }
}

// 動きの軽減（WCAG 2.3.3）
export class MotionManager {
  static respectsReducedMotion() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  static createSafeAnimation(element, keyframes, options = {}) {
    if (this.respectsReducedMotion()) {
      // 動きを軽減した代替アニメーション
      const reducedKeyframes = keyframes.map(frame => ({
        ...frame,
        transform: undefined, // 移動アニメーションを除去
        scale: frame.scale ? 1 : frame.scale // スケールも軽減
      }));
      
      return element.animate(reducedKeyframes, {
        ...options,
        duration: Math.min(options.duration || 300, 200)
      });
    }
    
    return element.animate(keyframes, options);
  }
}

// タッチターゲットサイズ（WCAG 2.5.5）
export class TouchTargetValidator {
  static MIN_SIZE = 44; // Apple HIG minimum
  
  static validateSize(element) {
    if (typeof document === 'undefined') return true;
    
    const rect = element.getBoundingClientRect();
    const isValid = rect.width >= this.MIN_SIZE && rect.height >= this.MIN_SIZE;
    
    if (!isValid) {
      console.warn(`Touch target too small: ${rect.width}x${rect.height}`, element);
    }
    
    return isValid;
  }
  
  static validateSpacing(elements) {
    if (typeof document === 'undefined') return [];
    
    const issues = [];
    
    for (let i = 0; i < elements.length - 1; i++) {
      const current = elements[i].getBoundingClientRect();
      const next = elements[i + 1].getBoundingClientRect();
      
      const distance = Math.sqrt(
        Math.pow(next.left - current.right, 2) + 
        Math.pow(next.top - current.bottom, 2)
      );
      
      if (distance < 8) { // 8px minimum spacing
        issues.push({
          elements: [elements[i], elements[i + 1]],
          distance
        });
      }
    }
    
    return issues;
  }
}

// Export instances
export const focusManager = new FocusManager();
export const screenReader = new ScreenReaderAnnouncer();
export const keyboardNav = new KeyboardNavigationManager();