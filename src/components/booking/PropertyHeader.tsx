
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
            {property.name || 'Haven Chennai - Container Home Accommodation'}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-haven-beige/80">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Padur, Muttukadu Lake, Chennai ECR</span>
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
          Eco-Friendly Container Home
        </Badge>
      </div>

      <p className="text-haven-beige/90 text-lg leading-relaxed max-w-4xl">
        Haven is an intimate getaway thoughtfully built using sustainable container architecture, designed to bring people closer together and promote nature immersion. 
        Located in Padur beside the serene Muttukadu Lake on Chennai's ECR, this unique accommodation blends minimal living with expansive lakeside views, making it a perfect eco-friendly retreat to unwind, connect with nature, and enjoy sustainable luxury.
      </p>
    </div>
  );
};
