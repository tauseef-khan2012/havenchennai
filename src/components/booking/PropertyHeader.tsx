
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Star } from 'lucide-react';

interface PropertyHeaderProps {
  property: any;
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({ property }) => {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-haven-beige">
            {property.name || 'Haven'}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-haven-beige/80">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Muttukadu Lake, Chennai</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">Up to 5 guests</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-haven-yellow fill-current" />
              <span className="text-sm font-medium">4.8 (24 reviews)</span>
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="bg-haven-yellow text-haven-navy whitespace-nowrap">
          Container Home
        </Badge>
      </div>

      <p className="text-haven-beige/90 text-lg leading-relaxed max-w-4xl">
        An intimate getaway thoughtfully built using two stacked container houses, aimed at bringing people closer together. 
        Nestled beside the serene Muttukadu Lake, it blends minimal living with expansive views, making it a perfect retreat to unwind, connect, and enjoy nature.
      </p>
    </div>
  );
};
