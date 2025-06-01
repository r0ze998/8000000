// Core Web Vitals最適化ユーティリティ

// Lazy loading用のIntersection Observer
export const createLazyObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };
  
  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// 画像の遅延読み込み
export const lazyLoadImage = (img) => {
  if (img.dataset.src) {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
    img.classList.add('loaded');
  }
};

// リソースのプリロード
export const preloadCriticalResources = () => {
  // フォントのプリロード
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = '/fonts/NotoSansJP-Regular.woff2';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);
  
  // 重要な画像のプリロード
  const shrineIcon = new Image();
  shrineIcon.src = '/icons/shrine-icon.svg';
  
  const fabIcon = new Image();
  fabIcon.src = '/icons/fab-icon.svg';
};

// CLS (Cumulative Layout Shift) 対策
export const reserveSpace = (element, width, height) => {
  element.style.minWidth = `${width}px`;
  element.style.minHeight = `${height}px`;
  element.style.aspectRatio = `${width} / ${height}`;
};

// FID (First Input Delay) 改善 - イベントハンドラーの最適化
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// バンドルサイズ最適化 - 動的インポート
export const loadComponentLazy = (componentPath) => {
  return import(componentPath).catch(error => {
    console.error(`Failed to load component: ${componentPath}`, error);
    return { default: () => null };
  });
};

// メモリリーク防止
export const cleanupResources = (resources) => {
  resources.forEach(resource => {
    if (resource && typeof resource.cleanup === 'function') {
      resource.cleanup();
    }
  });
};

// パフォーマンス監視
export const measurePerformance = (name, fn) => {
  if (!window.performance) return fn();
  
  const startTime = performance.now();
  const result = fn();
  const endTime = performance.now();
  
  console.log(`${name}: ${endTime - startTime}ms`);
  
  // Web Vitals API対応
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === name) {
            console.log(`Performance entry for ${name}:`, entry);
          }
        });
      });
      observer.observe({ entryTypes: ['measure'] });
      performance.mark(`${name}-start`);
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    } catch (e) {
      console.warn('PerformanceObserver not supported', e);
    }
  }
  
  return result;
};

// Service Worker登録
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Critical Path CSS検出
export const loadCriticalCSS = () => {
  const criticalCSS = `
    /* Critical path styles */
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background: #f5f5f5;
    }
    
    .loading-skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    .tab-navigation {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: white;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
};

// LCP (Largest Contentful Paint) 最適化
export const optimizeLCP = () => {
  // Hero画像の最適化
  const heroImages = document.querySelectorAll('[data-hero]');
  heroImages.forEach(img => {
    img.loading = 'eager';
    img.fetchPriority = 'high';
  });
  
  // フォントの最適化
  document.fonts.ready.then(() => {
    document.body.classList.add('fonts-loaded');
  });
};

// Web Vitals測定
export const measureWebVitals = () => {
  if (!window.PerformanceObserver) return;
  
  // LCP測定
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.startTime);
  }).observe({ entryTypes: ['largest-contentful-paint'] });
  
  // FID測定
  new PerformanceObserver((entryList) => {
    entryList.getEntries().forEach((entry) => {
      console.log('FID:', entry.processingStart - entry.startTime);
    });
  }).observe({ entryTypes: ['first-input'] });
  
  // CLS測定
  let clsValue = 0;
  new PerformanceObserver((entryList) => {
    entryList.getEntries().forEach((entry) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        console.log('CLS:', clsValue);
      }
    });
  }).observe({ entryTypes: ['layout-shift'] });
};