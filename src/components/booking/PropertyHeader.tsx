
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
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-gray-900">
            {property.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{property.location_details || 'Muttukadu Lake, Chennai'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">Up to {property.max_guests} guests</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">4.8 (24 reviews)</span>
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="bg-haven-teal text-white whitespace-nowrap">
          {property.type || 'Premium'}
        </Badge>
      </div>

      <p className="text-gray-600 text-lg leading-relaxed max-w-4xl">
        {property.short_description || 
         "Experience luxury lakeside living in our beautifully designed container home with breathtaking views of Muttukadu Lake."}
      </p>
    </div>
  );
};
