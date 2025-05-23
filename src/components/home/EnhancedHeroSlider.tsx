
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import LazyImage from '@/components/shared/LazyImage';
import { LoadingState } from '@/components/ui/loading-state';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface Slide {
  id: string;
  image: string;
  lowResImage?: string;
  title: string;
  subtitle: string;
  cta?: {
    text: string;
    href: string;
  };
}

interface EnhancedHeroSliderProps {
  slides: Slide[];
  autoplayInterval?: number;
  className?: string;
}

export const EnhancedHeroSlider: React.FC<EnhancedHeroSliderProps> = ({
  slides,
  autoplayInterval = 5000,
  className
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const { handleError } = useErrorHandler();

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      try {
        const imagePromises = slides.map((slide, index) => {
          return new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              setLoadedImages(prev => new Set(prev).add(index));
              resolve();
            };
            img.onerror = reject;
            img.src = slide.image;
          });
        });

        await Promise.allSettled(imagePromises);
        setIsLoading(false);
      } catch (error) {
        handleError(error, { fallbackMessage: 'Failed to load hero images' });
        setIsLoading(false);
      }
    };

    if (slides.length > 0) {
      preloadImages();
    }
  }, [slides, handleError]);

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying || isLoading) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, autoplayInterval, slides.length, isLoading]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  if (isLoading) {
    return (
      <div className="relative h-screen bg-gradient-to-br from-haven-beige to-haven-green/20">
        <LoadingState 
          size="lg" 
          message="Loading hero content..." 
          className="h-full"
        />
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative h-screen bg-gradient-to-br from-haven-beige to-haven-green/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-haven-dark mb-4">
            Welcome to Haven
          </h1>
          <p className="text-xl text-haven-dark/80">
            Your sustainable escape awaits
          </p>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className={cn('relative h-screen overflow-hidden', className)}>
      {/* Main Image */}
      <div className="absolute inset-0">
        <LazyImage
          src={currentSlide.image}
          lowResSrc={currentSlide.lowResImage}
          alt={currentSlide.title}
          className="w-full h-full object-cover"
          priority={true}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            {currentSlide.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-delay">
            {currentSlide.subtitle}
          </p>
          {currentSlide.cta && (
            <Button
              asChild
              size="lg"
              className="bg-haven-green hover:bg-haven-green/90 text-white font-semibold px-8 py-3 text-lg animate-fade-in-delay-2"
            >
              <a href={currentSlide.cta.href}>
                {currentSlide.cta.text}
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          {/* Previous/Next Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-20"
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-20"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-300',
                  index === currentIndex 
                    ? 'bg-white scale-110' 
                    : 'bg-white/50 hover:bg-white/70'
                )}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Play/Pause Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-8 right-8 text-white hover:bg-white/20 z-20"
            onClick={togglePlayback}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
        </>
      )}
    </div>
  );
};
