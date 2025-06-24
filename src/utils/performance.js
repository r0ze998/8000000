// Performance monitoring and optimization utilities

// Web Vitals measurement
export function measureWebVitals() {
  if (typeof window === 'undefined') return;

  // Dynamically import web-vitals to reduce initial bundle size
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    const sendToAnalytics = (metric) => {
      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Web Vital:', metric);
      }

      // Send to analytics service
      if (window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        });
      }

      // Custom performance monitoring
      if (window.performance && window.performance.mark) {
        window.performance.mark(`${metric.name}-${metric.value}`);
      }
    };

    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  }).catch(err => {
    console.error('Failed to load web-vitals:', err);
  });
}

// Service Worker registration
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available
                console.log('New content available, refresh to update');
                
                // Optionally show update notification
                if (window.showUpdateNotification) {
                  window.showUpdateNotification();
                }
              }
            });
          });
        })
        .catch(error => {
          console.error('SW registration failed:', error);
        });
    });
  }
}

// Performance Observer for monitoring
export function observePerformance() {
  if (!window.PerformanceObserver) return;

  // Long Task Observer
  try {
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Log tasks that block the main thread for > 50ms
        console.warn('Long Task detected:', {
          duration: entry.duration,
          startTime: entry.startTime,
          attribution: entry.attribution
        });

        // Send to analytics
        if (window.gtag) {
          window.gtag('event', 'long_task', {
            event_category: 'Performance',
            value: Math.round(entry.duration),
            event_label: entry.name
          });
        }
      }
    });

    longTaskObserver.observe({ entryTypes: ['longtask'] });
  } catch (e) {
    console.log('Long Task Observer not supported');
  }

  // Layout Shift Observer
  try {
    const layoutShiftObserver = new PerformanceObserver((list) => {
      let totalShift = 0;
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          totalShift += entry.value;
        }
      }

      if (totalShift > 0.1) {
        console.warn('Significant layout shift detected:', totalShift);
      }
    });

    layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    console.log('Layout Shift Observer not supported');
  }
}

// Resource hint management
export function addResourceHints() {
  const head = document.head;

  // Preconnect to external domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://shrine-images.vercel.app',
    'https://api.openweathermap.org'
  ];

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    if (domain.includes('fonts.gstatic.com')) {
      link.crossOrigin = 'anonymous';
    }
    head.appendChild(link);
  });

  // DNS prefetch for additional domains
  const dnsPrefetchDomains = [
    '//www.google-analytics.com',
    '//www.googletagmanager.com'
  ];

  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    head.appendChild(link);
  });
}

// Lazy loading for images
export function setupLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    document.querySelectorAll('img.lazy').forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without Intersection Observer
    document.querySelectorAll('img.lazy').forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
    });
  }
}

// Memory leak prevention
export function cleanupMemory() {
  // Clear unused image references
  if (window.imageCache) {
    window.imageCache.clear();
  }

  // Clear old performance entries
  if (window.performance && window.performance.clearMeasures) {
    window.performance.clearMeasures();
    window.performance.clearMarks();
  }

  // Trigger garbage collection in development
  if (process.env.NODE_ENV === 'development' && window.gc) {
    window.gc();
  }
}

// Request Idle Callback wrapper
export function whenIdle(callback) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout: 2000 });
  } else {
    // Fallback
    setTimeout(callback, 1);
  }
}

// Debounce function for performance
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for performance
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Network Information API
export function getNetworkSpeed() {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }
  return null;
}

// Adaptive loading based on network
export function shouldReduceData() {
  const network = getNetworkSpeed();
  if (!network) return false;
  
  return network.saveData || 
         network.effectiveType === 'slow-2g' || 
         network.effectiveType === '2g';
}

// Export all utilities
export default {
  measureWebVitals,
  registerServiceWorker,
  observePerformance,
  addResourceHints,
  setupLazyLoading,
  cleanupMemory,
  whenIdle,
  debounce,
  throttle,
  getNetworkSpeed,
  shouldReduceData
};