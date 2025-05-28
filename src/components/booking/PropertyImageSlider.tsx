import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
interface PropertyImageSliderProps {
  property: any;
}
export const PropertyImageSlider: React.FC<PropertyImageSliderProps> = ({
  property
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = property.image_urls || ['/placeholder.jpg'];
  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };
  const previousImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };
  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };
  return <div className="space-y-4">
      {/* Main Image - Reduced aspect ratio */}
      

      {/* Thumbnail Strip */}
      {images.length > 1}
    </div>;
};