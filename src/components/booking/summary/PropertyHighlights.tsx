
import React from 'react';
import { MapPin, Wifi, Coffee, Car } from 'lucide-react';

interface PropertyHighlightsProps {
  property: any;
}

const getPropertyHighlights = (property: any) => {
  const highlights = [];
  
  // Add location-based highlights
  if (property.name?.toLowerCase().includes('lakeside') || property.short_description?.toLowerCase().includes('lake')) {
    highlights.push({ icon: MapPin, text: 'Lakeside' });
  }
  
  // Add amenity-based highlights
  if (property.amenities?.some((a: string) => a.toLowerCase().includes('wifi') || a.toLowerCase().includes('internet'))) {
    highlights.push({ icon: Wifi, text: 'WiFi' });
  }
  
  if (property.amenities?.some((a: string) => a.toLowerCase().includes('kitchen') || a.toLowerCase().includes('coffee'))) {
    highlights.push({ icon: Coffee, text: 'Kitchen' });
  }
  
  if (property.amenities?.some((a: string) => a.toLowerCase().includes('parking') || a.toLowerCase().includes('car'))) {
    highlights.push({ icon: Car, text: 'Parking' });
  }
  
  // Default highlights if no specific amenities found
  if (highlights.length === 0) {
    highlights.push(
      { icon: MapPin, text: 'Lakeside' },
      { icon: Wifi, text: 'WiFi' },
      { icon: Coffee, text: 'Kitchen' }
    );
  }
  
  return highlights.slice(0, 3); // Limit to 3 highlights
};

export const PropertyHighlights: React.FC<PropertyHighlightsProps> = ({ property }) => {
  const highlights = getPropertyHighlights(property);

  return (
    <div className="flex flex-wrap gap-2">
      {highlights.map((highlight, index) => {
        const Icon = highlight.icon;
        return (
          <div key={index} className="flex items-center gap-1 bg-haven-teal/10 text-haven-teal px-3 py-1 rounded-full text-sm font-medium">
            <Icon className="h-3 w-3" />
            <span>{highlight.text}</span>
          </div>
        );
      })}
    </div>
  );
};
