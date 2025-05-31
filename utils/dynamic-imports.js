// Dynamic imports for code splitting and bundle size optimization

import { lazy, Suspense } from 'react';
import LoadingSkeleton from '../components/LoadingSkeleton';

// Lazy load components with loading fallbacks
export const LazyHomeTab = lazy(() => 
  import('../components/SimpleHomeTab').then(module => ({
    default: module.default
  }))
);

export const LazyVisitTab = lazy(() => 
  import('../components/tabs/VisitTab').then(module => ({
    default: module.default
  }))
);

export const LazyCollectionTab = lazy(() => 
  import('../components/tabs/CollectionTab').then(module => ({
    default: module.default
  }))
);

export const LazyExploreTab = lazy(() => 
  import('../components/tabs/ExploreTab').then(module => ({
    default: module.default
  }))
);

export const LazyProfileTab = lazy(() => 
  import('../components/tabs/ProfileTab').then(module => ({
    default: module.default
  }))
);

// Heavy feature components
export const LazyQRScanner = lazy(() => 
  import('../components/QRScanner').then(module => ({
    default: module.default
  }))
);

export const LazyRewardModal = lazy(() => 
  import('../features/visit/RewardModal').then(module => ({
    default: module.default
  }))
);

export const LazyQuickVisitFlow = lazy(() => 
  import('../components/QuickVisitFlow').then(module => ({
    default: module.default
  }))
);

// Service classes - lazy loaded
export const lazyLoadVisitService = () => 
  import('../core/services/VisitService').then(module => module.default);

export const lazyLoadRewardService = () => 
  import('../core/services/RewardService').then(module => module.default);

export const lazyLoadNotificationService = () => 
  import('../core/services/NotificationService').then(module => module.default);

// Utility functions for async loading
export const loadComponentWithFallback = (Component, fallbackType = 'default') => {
  return function WrappedComponent(props) {
    return (
      <Suspense fallback={<LoadingSkeleton type={fallbackType} />}>
        <Component {...props} />
      </Suspense>
    );
  };
};

// Progressive enhancement for heavy features
export const loadFeatureOnDemand = async (featureName) => {
  try {
    switch (featureName) {
      case 'camera':
        return await import('../utils/camera-utils');
      case 'geolocation':
        return await import('../utils/geolocation-utils');
      case 'audio':
        return await import('../utils/bgmPlayer');
      case 'analytics':
        return await import('../utils/analytics');
      default:
        throw new Error(`Unknown feature: ${featureName}`);
    }
  } catch (error) {
    console.error(`Failed to load feature ${featureName}:`, error);
    return null;
  }
};

// Preload critical routes
export const preloadCriticalRoutes = () => {
  if (typeof window !== 'undefined') {
    // Preload the most likely next pages
    const preloadPromises = [
      import('../components/SimpleHomeTab'),
      import('../components/tabs/VisitTab'),
    ];
    
    // Don't await - fire and forget
    Promise.all(preloadPromises).catch(console.error);
  }
};

// Bundle splitting helpers
export const createAsyncComponent = (importFunc, fallbackType) => {
  const Component = lazy(importFunc);
  
  return function AsyncComponent(props) {
    return (
      <Suspense fallback={<LoadingSkeleton type={fallbackType} />}>
        <Component {...props} />
      </Suspense>
    );
  };
};

// Resource preloading based on user interaction
export const preloadOnHover = (importFunc) => {
  let preloadPromise;
  
  return {
    onMouseEnter: () => {
      if (!preloadPromise) {
        preloadPromise = importFunc();
      }
    },
    onTouchStart: () => {
      if (!preloadPromise) {
        preloadPromise = importFunc();
      }
    },
    onFocus: () => {
      if (!preloadPromise) {
        preloadPromise = importFunc();
      }
    }
  };
};

// Intersection Observer based preloading
export const createIntersectionPreloader = (importFunc, options = {}) => {
  const defaultOptions = {
    rootMargin: '100px',
    threshold: 0.1
  };
  
  return (element) => {
    if (!element || typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            importFunc();
            observer.unobserve(entry.target);
          }
        });
      },
      { ...defaultOptions, ...options }
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  };
};

// Bundle analysis helpers
export const getBundleSize = async (componentName) => {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    
    try {
      await loadFeatureOnDemand(componentName);
      const end = performance.now();
      console.log(`${componentName} loaded in ${end - start}ms`);
    } catch (error) {
      console.error(`Failed to measure ${componentName}:`, error);
    }
  }
};

// Critical vs non-critical resource loading
export const loadCriticalResources = async () => {
  // Load only what's needed for first paint
  const critical = await Promise.allSettled([
    import('../components/SimpleHomeTab'),
    import('../components/MobileTabNavigation'),
    import('../utils/accessibility'),
  ]);
  
  console.log('Critical resources loaded:', critical);
  return critical;
};

export const loadNonCriticalResources = async () => {
  // Load everything else after first paint
  const nonCritical = await Promise.allSettled([
    import('../components/tabs/VisitTab'),
    import('../components/tabs/CollectionTab'),
    import('../components/tabs/ExploreTab'),
    import('../components/tabs/ProfileTab'),
    import('../core/services/VisitService'),
    import('../core/services/RewardService'),
    import('../core/services/NotificationService'),
  ]);
  
  console.log('Non-critical resources loaded:', nonCritical);
  return nonCritical;
};