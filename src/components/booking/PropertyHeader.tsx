
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
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">{property.name}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{property.location_details || 'Haven Resort'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">Up to {property.max_guests} guests</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">4.8 (24 reviews)</span>
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="bg-haven-teal text-white">
          {property.type || 'Premium'}
        </Badge>
      </div>

      {property.image_urls && property.image_urls.length > 0 && (
        <div className="aspect-video rounded-lg overflow-hidden mb-6">
          <img
            src={property.image_urls[0]}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <p className="text-gray-600 mb-6">
        {property.short_description || property.long_description}
      </p>

      {/* Amenities */}
      {property.amenities && property.amenities.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {property.amenities.map((amenity: string, index: number) => (
              <Badge key={index} variant="outline">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
