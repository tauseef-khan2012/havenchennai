
import React from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroControlsProps {
  slides: any[];
  currentIndex: number;
  isPlaying: boolean;
  goToPrevious: () => void;
  goToNext: () => void;
  goToSlide: (index: number) => void;
  togglePlayback: () => void;
}

export const HeroControls: React.FC<HeroControlsProps> = ({
  slides,
  currentIndex,
  isPlaying,
  goToPrevious,
  goToNext,
  goToSlide,
  togglePlayback
}) => {
  if (slides.length <= 1) return null;
  
  return (
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
  );
};
