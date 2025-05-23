
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { cn } from '@/lib/utils';
import LazyImage from './LazyImage';

interface ImageGalleryProps {
  images: string[];
  className?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto';
  priority?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className,
  aspectRatio = 'landscape',
  priority = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className={cn(
        'relative rounded-md bg-gray-100 flex items-center justify-center',
        getAspectRatioClass(aspectRatio),
        className
      )}>
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      <div className={cn(
        'relative rounded-md overflow-hidden group',
        getAspectRatioClass(aspectRatio),
        className
      )}>
        <LazyImage
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          aspectRatio={aspectRatio}
          priority={priority}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Navigation buttons */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={prevImage}
              className="bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <button 
              onClick={nextImage}
              className="bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {/* Fullscreen button */}
        <button 
          onClick={toggleFullscreen}
          className="absolute bottom-2 right-2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Toggle fullscreen"
        >
          <Expand className="h-4 w-4" />
        </button>
        
        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
      
      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={toggleFullscreen}>
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <LazyImage
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1} fullscreen`}
              className="max-w-full max-h-full object-contain"
              priority={true}
            />
            
            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 bg-white/20 p-3 rounded-full hover:bg-white/40 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 bg-white/20 p-3 rounded-full hover:bg-white/40 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-2 rounded-md">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Helper function to get the appropriate aspect ratio class
function getAspectRatioClass(aspectRatio: 'square' | 'portrait' | 'landscape' | 'auto') {
  switch (aspectRatio) {
    case 'square':
      return 'aspect-square';
    case 'portrait':
      return 'aspect-[3/4]';
    case 'landscape':
      return 'aspect-[16/9]';
    case 'auto':
    default:
      return '';
  }
}

export default ImageGallery;
