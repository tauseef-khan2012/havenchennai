
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PropertyImageSliderProps {
  property: any;
}

export const PropertyImageSlider: React.FC<PropertyImageSliderProps> = ({ property }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sample images for bedroom, bathroom, and deck
  const propertyImages = [
    {
      url: property.image_urls?.[0] || '/lovable-uploads/d1148760-0de0-44d6-ae11-98a16c4b61fc.png',
      label: 'Main View',
      category: 'exterior'
    },
    {
      url: '/lovable-uploads/3d09a878-2b77-4c76-b9dc-916c5572305e.png',
      label: 'Bedroom',
      category: 'bedroom'
    },
    {
      url: '/lovable-uploads/a768b355-2a53-4898-91c5-3372bc1fe662.png',
      label: 'Bathroom',
      category: 'bathroom'
    },
    {
      url: '/lovable-uploads/8446db9f-ec1d-4876-adb8-84f568a58892.png',
      label: 'Deck View',
      category: 'deck'
    },
    {
      url: '/lovable-uploads/92fdb568-68f2-4ac8-9908-e0db6e29b56d.png',
      label: 'Living Area',
      category: 'living'
    }
  ];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <>
      <div className="relative">
        {/* Main Image Display - Smaller aspect ratio for better layout */}
        <div className="relative aspect-[4/3] lg:aspect-[3/2] rounded-xl overflow-hidden group">
          <img
            src={propertyImages[currentIndex].url}
            alt={propertyImages[currentIndex].label}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Image Label */}
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-black/60 text-white">
              {propertyImages[currentIndex].label}
            </Badge>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Fullscreen Button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setIsFullscreen(true)}
          >
            <Expand className="h-4 w-4" />
          </Button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {propertyImages.length}
          </div>
        </div>

        {/* Thumbnail Navigation - More compact */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {propertyImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-12 lg:w-18 lg:h-14 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === index 
                  ? 'border-haven-teal shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image.url}
                alt={image.label}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative max-w-6xl max-h-full">
            <img
              src={propertyImages[currentIndex].url}
              alt={propertyImages[currentIndex].label}
              className="max-w-full max-h-full object-contain"
            />
            
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white border-white/20"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white border-white/20"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full">
              {propertyImages[currentIndex].label} - {currentIndex + 1} / {propertyImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
