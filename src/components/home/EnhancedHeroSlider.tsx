
import React from 'react';
import { cn } from '@/lib/utils';
import LazyImage from '@/components/shared/LazyImage';
import { LoadingState } from '@/components/ui/loading-state';
import { useHeroSlider } from '@/hooks/useHeroSlider';
import { HeroSlideContent } from './hero/HeroSlideContent';
import { HeroControls } from './hero/HeroControls';

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
  const {
    currentIndex,
    currentSlide,
    isLoading,
    isPlaying,
    goToSlide,
    goToPrevious,
    goToNext,
    togglePlayback
  } = useHeroSlider({
    slides,
    autoplayInterval
  });

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
      <HeroSlideContent 
        title={currentSlide.title}
        subtitle={currentSlide.subtitle}
        cta={currentSlide.cta}
      />

      {/* Navigation Controls */}
      <HeroControls 
        slides={slides}
        currentIndex={currentIndex}
        isPlaying={isPlaying}
        goToPrevious={goToPrevious}
        goToNext={goToNext}
        goToSlide={goToSlide}
        togglePlayback={togglePlayback}
      />
    </div>
  );
};
