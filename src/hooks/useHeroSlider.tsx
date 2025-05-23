
import { useState, useEffect, useCallback } from 'react';
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

interface UseHeroSliderProps {
  slides: Slide[];
  autoplayInterval?: number;
}

export const useHeroSlider = ({
  slides,
  autoplayInterval = 5000
}: UseHeroSliderProps) => {
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
    } else {
      setIsLoading(false);
    }
  }, [slides, handleError]);

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying || isLoading || slides.length <= 1) return;

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

  return {
    currentIndex,
    currentSlide: slides[currentIndex],
    isLoading,
    isPlaying,
    loadedImages,
    goToSlide,
    goToPrevious,
    goToNext,
    togglePlayback
  };
};
