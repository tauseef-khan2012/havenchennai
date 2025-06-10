
import React from 'react';
import { MapPin, Wifi, Coffee, Car, Monitor, Volume2, Bed } from 'lucide-react';

interface PropertyHighlightsProps {
  property: any;
}

const getPropertyHighlights = (property: any) => {
  // Return actual Haven amenities based on the property description
  const highlights = [
    { icon: MapPin, text: 'Lakeside Location' },
    { icon: Wifi, text: 'Wi-Fi (100 Mbps)' },
    { icon: Coffee, text: 'Full Kitchen' },
    { icon: Car, text: 'Parking for 2 Cars' },
    { icon: Monitor, text: '32" Monitor/TV' },
    { icon: Volume2, text: 'JBL Speaker' },
    { icon: Bed, text: 'Wakefit Mattresses' }
  ];
  
  return highlights.slice(0, 4); // Show top 4 highlights
};

export const PropertyHighlights: React.FC<PropertyHighlightsProps> = ({ property }) => {
  const highlights = getPropertyHighlights(property);

  return (
    <div className="flex flex-wrap gap-2">
      {highlights.map((highlight, index) => {
        const Icon = highlight.icon;
        return (
          <div key={index} className="flex items-center gap-1 bg-haven-yellow/10 text-haven-navy px-3 py-1 rounded-full text-sm font-medium">
            <Icon className="h-3 w-3" />
            <span>{highlight.text}</span>
          </div>
        );
      })}
    </div>
  );
};
