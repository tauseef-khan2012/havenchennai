
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  lowResSrc?: string;
  fallbackSrc?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto';
  showSkeleton?: boolean;
  priority?: boolean;
  sizes?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  lowResSrc,
  fallbackSrc = '/placeholder.svg',
  aspectRatio = 'auto',
  showSkeleton = true,
  priority = false,
  sizes,
  className,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(lowResSrc || src);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  // Network-aware image quality selection
  const getOptimalImageSrc = () => {
    const connection = (navigator as any).connection;
    if (connection) {
      // Use low-res version for slow connections
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        return lowResSrc || src;
      }
      // Use high-res for fast connections
      if (connection.effectiveType === '4g') {
        return src;
      }
    }
    return src;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    observerRef.current = observer;

    return () => observer.disconnect();
  }, [priority]);

  // Progressive image loading
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    const optimalSrc = getOptimalImageSrc();
    
    img.onload = () => {
      setCurrentSrc(optimalSrc);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
      setIsLoading(false);
    };

    // Load high-res after low-res if we started with low-res
    if (lowResSrc && currentSrc === lowResSrc && optimalSrc !== lowResSrc) {
      img.src = optimalSrc;
    } else if (currentSrc !== optimalSrc) {
      img.src = optimalSrc;
    } else {
      setIsLoading(false);
    }
  }, [isInView, src, lowResSrc, fallbackSrc]);

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'portrait':
        return 'aspect-[3/4]';
      case 'landscape':
        return 'aspect-[16/9]';
      default:
        return '';
    }
  };

  if (!isInView && showSkeleton) {
    return (
      <div ref={imgRef} className={cn(getAspectRatioClass(), className)}>
        <Skeleton className="w-full h-full rounded-md" />
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', getAspectRatioClass(), className)}>
      {isLoading && showSkeleton && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
      )}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          hasError && 'opacity-50'
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setCurrentSrc(fallbackSrc);
          setIsLoading(false);
        }}
        {...props}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          Image unavailable
        </div>
      )}
    </div>
  );
};

export default LazyImage;
