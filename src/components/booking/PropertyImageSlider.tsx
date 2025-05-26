
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PropertyImageSliderProps {
  property: any;
}

export const PropertyImageSlider: React.FC<PropertyImageSliderProps> = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = property.image_urls || ['/placeholder.jpg'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image - Reduced aspect ratio */}
      <div className="relative aspect-[4/3] lg:aspect-[3/2] rounded-2xl overflow-hidden bg-gray-100">
        <img
          src={images[currentImageIndex]}
          alt={`${property.name} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.jpg';
          }}
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
              onClick={previousImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Expand Button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4 bg-white/90 hover:bg-white shadow-lg gap-2"
        >
          <Expand className="h-4 w-4" />
          View Gallery
        </Button>

        {/* Image Counter */}
        <Badge 
          variant="secondary" 
          className="absolute top-4 right-4 bg-black/50 text-white border-0"
        >
          {currentImageIndex + 1} / {images.length}
        </Badge>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex 
                  ? 'border-haven-teal ring-2 ring-haven-teal ring-opacity-20' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${property.name} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.jpg';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
