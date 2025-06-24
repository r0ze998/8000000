// Image optimization utilities for LCP and Core Web Vitals

// Generate responsive image sizes based on container and viewport
export const generateImageSizes = (breakpoints) => {
  const defaultBreakpoints = {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    large: 1200
  };
  
  const bp = { ...defaultBreakpoints, ...breakpoints };
  
  return {
    hero: `100vw`,
    card: `(max-width: ${bp.mobile}px) 100vw, (max-width: ${bp.tablet}px) 50vw, 33vw`,
    thumbnail: `(max-width: ${bp.mobile}px) 50vw, (max-width: ${bp.tablet}px) 33vw, 25vw`,
    avatar: `${bp.mobile / 8}px`,
    icon: `24px`
  };
};

// Preload critical images for LCP optimization
export const preloadCriticalImages = (images) => {
  if (typeof window === 'undefined') return;
  
  images.forEach(({ src, sizes, media }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    
    if (sizes) {
      link.imageSizes = sizes;
    }
    
    if (media) {
      link.media = media;
    }
    
    // Set fetchpriority for LCP images
    link.fetchPriority = 'high';
    
    document.head.appendChild(link);
  });
};

// Generate blur placeholder data URL
export const generateBlurDataURL = (width = 10, height = 10, color = '#f0f0f0') => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
};

// Generate more sophisticated blur placeholder
export const generateGradientBlur = (width = 10, height = 10, colors = ['#f0f0f0', '#e0e0e0']) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color);
  });
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
};

// Image format optimization
export const getOptimalFormat = (userAgent = '') => {
  // Check for AVIF support
  if (userAgent.includes('Chrome/') && parseInt(userAgent.match(/Chrome\/(\d+)/)?.[1] || '0') >= 85) {
    return 'avif';
  }
  
  // Check for WebP support
  if (userAgent.includes('Chrome/') || userAgent.includes('Firefox/') || userAgent.includes('Edge/')) {
    return 'webp';
  }
  
  return 'jpeg';
};

// Device pixel ratio optimization
export const getDevicePixelRatio = () => {
  if (typeof window === 'undefined') return 1;
  return window.devicePixelRatio || 1;
};

// Calculate optimal image dimensions based on container and DPR
export const calculateOptimalDimensions = (containerWidth, containerHeight, maxDPR = 2) => {
  const dpr = Math.min(getDevicePixelRatio(), maxDPR);
  
  return {
    width: Math.round(containerWidth * dpr),
    height: Math.round(containerHeight * dpr),
    dpr
  };
};

// Lazy loading with intersection observer
export const createImageLazyLoader = (options = {}) => {
  const defaultOptions = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  if (typeof window === 'undefined' || !window.IntersectionObserver) {
    return null;
  }
  
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }
        
        img.classList.add('loaded');
        img.classList.remove('loading');
        
        // Stop observing this image
        this.unobserve(img);
      }
    });
  }, defaultOptions);
};

// Performance monitoring for images
export const trackImagePerformance = (imageName, src) => {
  if (typeof window === 'undefined' || !window.performance) return;
  
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.name.includes(src)) {
        console.log(`Image ${imageName} metrics:`, {
          duration: entry.duration,
          size: entry.transferSize,
          startTime: entry.startTime
        });
        
        // Report to analytics
        if (window.gtag) {
          window.gtag('event', 'image_load', {
            event_category: 'Performance',
            event_label: imageName,
            value: Math.round(entry.duration)
          });
        }
      }
    });
  });
  
  observer.observe({ entryTypes: ['resource'] });
  
  // Cleanup after 30 seconds
  setTimeout(() => observer.disconnect(), 30000);
};

// Image error handling and fallbacks
export const createImageErrorHandler = (fallbackSrc, onError) => {
  return (event) => {
    const img = event.target;
    
    if (fallbackSrc && img.src !== fallbackSrc) {
      img.src = fallbackSrc;
      return;
    }
    
    // Create placeholder element
    const placeholder = document.createElement('div');
    placeholder.className = 'image-error-placeholder';
    placeholder.innerHTML = '🖼️';
    placeholder.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      color: #999;
      font-size: 24px;
      width: ${img.width || 100}px;
      height: ${img.height || 100}px;
      border-radius: 8px;
    `;
    
    img.parentNode?.replaceChild(placeholder, img);
    onError?.(event);
  };
};

// Responsive image URL generation
export const generateResponsiveUrls = (baseSrc, sizes) => {
  const urls = {};
  
  sizes.forEach(size => {
    urls[`${size}w`] = `${baseSrc}?w=${size}&q=85&fm=webp`;
  });
  
  return urls;
};

// Critical image detection
export const detectCriticalImages = () => {
  if (typeof window === 'undefined') return [];
  
  const criticalImages = [];
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  document.querySelectorAll('img').forEach((img) => {
    const rect = img.getBoundingClientRect();
    
    // Image is in viewport or close to it
    if (rect.top < viewport.height + 100 && rect.bottom > -100) {
      criticalImages.push({
        element: img,
        src: img.src,
        rect,
        isAboveFold: rect.top < viewport.height
      });
    }
  });
  
  return criticalImages;
};

// Auto-optimize images based on connection speed
export const getQualityByConnection = () => {
  if (typeof navigator === 'undefined' || !navigator.connection) {
    return 85; // Default quality
  }
  
  const connection = navigator.connection;
  
  // Slow connections get lower quality
  if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
    return 60;
  }
  
  if (connection.effectiveType === '3g') {
    return 75;
  }
  
  // Fast connections get higher quality
  return 90;
};

// Preload next page images based on navigation hints
export const preloadNextPageImages = (nextRoute) => {
  if (typeof window === 'undefined') return;
  
  // Route-specific image preloading
  const preloadMap = {
    '/visit': ['/images/shrine-placeholder.webp'],
    '/collection': ['/images/goshuin-placeholder.webp'],
    '/explore': ['/images/map-placeholder.webp'],
    '/profile': ['/images/avatar-placeholder.webp']
  };
  
  const imagesToPreload = preloadMap[nextRoute];
  
  if (imagesToPreload) {
    preloadCriticalImages(
      imagesToPreload.map(src => ({ src, sizes: '(max-width: 768px) 100vw, 50vw' }))
    );
  }
};

export default {
  generateImageSizes,
  preloadCriticalImages,
  generateBlurDataURL,
  generateGradientBlur,
  getOptimalFormat,
  calculateOptimalDimensions,
  createImageLazyLoader,
  trackImagePerformance,
  createImageErrorHandler,
  generateResponsiveUrls,
  detectCriticalImages,
  getQualityByConnection,
  preloadNextPageImages
};