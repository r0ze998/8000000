import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 85,
  placeholder = 'blur',
  className = '',
  sizes,
  fill = false,
  style = {},
  isLCP = false,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // LCP optimization: preload critical images
  useEffect(() => {
    if (isLCP && typeof window !== 'undefined') {
      // Create preload link for LCP image
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = src;
      if (sizes) {
        preloadLink.imageSizes = sizes;
      }
      document.head.appendChild(preloadLink);

      return () => {
        if (document.head.contains(preloadLink)) {
          document.head.removeChild(preloadLink);
        }
      };
    }
  }, [src, sizes, isLCP]);

  // Generate optimized sizes based on common breakpoints
  const getOptimizedSizes = (width, height) => {
    if (sizes) return sizes;
    
    // Default responsive sizes for mobile-first
    if (fill) {
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    }
    
    if (width && height) {
      const aspectRatio = width / height;
      return `(max-width: 640px) 100vw, (max-width: 1024px) ${Math.min(width, 768)}px, ${width}px`;
    }
    
    return '100vw';
  };

  // Generate blur placeholder
  const generateBlurDataURL = (width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width || 10;
    canvas.height = height || 10;
    const ctx = canvas.getContext('2d');
    
    // Create a subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f0f0f0');
    gradient.addColorStop(1, '#e0e0e0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL();
  };

  const handleLoad = (event) => {
    setIsLoading(false);
    setHasError(false);
    
    // LCP measurement
    if (isLCP && typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0];
      const loadTime = event.timeStamp - navigation.startTime;
      console.log(`LCP image loaded in ${loadTime}ms`);
    }
    
    onLoad?.(event);
  };

  const handleError = (event) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(event);
  };

  // Error fallback component
  if (hasError) {
    return (
      <div 
        className={`image-error ${className}`}
        style={{
          ...style,
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          background: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '14px',
          borderRadius: '8px'
        }}
        role="img"
        aria-label={alt}
      >
        <span>画像を読み込めませんでした</span>
      </div>
    );
  }

  const imageProps = {
    ref: imgRef,
    src,
    alt,
    quality,
    priority: priority || isLCP,
    placeholder,
    onLoad: handleLoad,
    onError: handleError,
    className: `${className} ${isLoading ? 'loading' : 'loaded'}`,
    style: {
      ...style,
      transition: isLoading ? 'none' : 'opacity 0.3s ease'
    },
    sizes: getOptimizedSizes(width, height),
    ...props
  };

  // Add blur placeholder for better UX
  if (placeholder === 'blur' && !imageProps.blurDataURL) {
    imageProps.blurDataURL = generateBlurDataURL(width, height);
  }

  if (fill) {
    return (
      <div 
        className={`image-container ${className}`}
        style={{ position: 'relative', ...style }}
      >
        <Image
          {...imageProps}
          fill
          style={{
            objectFit: 'cover',
            ...imageProps.style
          }}
        />
        {isLoading && (
          <div className="image-skeleton" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }} />
        )}
      </div>
    );
  }

  return (
    <div className={`image-wrapper ${className}`} style={{ position: 'relative' }}>
      <Image
        {...imageProps}
        width={width}
        height={height}
      />
      {isLoading && (
        <div 
          className="image-skeleton"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '8px'
          }}
        />
      )}
      
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        .image-wrapper {
          overflow: hidden;
        }
        
        .image-container {
          overflow: hidden;
        }
        
        :global(.loading) {
          opacity: 0;
        }
        
        :global(.loaded) {
          opacity: 1;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .image-skeleton {
            animation: none !important;
            background: #e0e0e0 !important;
          }
          
          :global(.loaded) {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

// Preset configurations for common use cases
export const HeroImage = ({ src, alt, ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={1200}
    height={675}
    priority
    isLCP
    quality={90}
    sizes="100vw"
    placeholder="blur"
    {...props}
  />
);

export const ShrineImage = ({ src, alt, ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={400}
    height={300}
    quality={85}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    placeholder="blur"
    {...props}
  />
);

export const GoshuinImage = ({ src, alt, ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={200}
    height={300}
    quality={90}
    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
    placeholder="blur"
    {...props}
  />
);

export const ProfileAvatar = ({ src, alt, size = 100, ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={size}
    height={size}
    quality={95}
    className="avatar"
    style={{ borderRadius: '50%', ...props.style }}
    {...props}
  />
);

export const IconImage = ({ src, alt, size = 24, ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={size}
    height={size}
    quality={95}
    placeholder="empty"
    {...props}
  />
);

export default OptimizedImage;