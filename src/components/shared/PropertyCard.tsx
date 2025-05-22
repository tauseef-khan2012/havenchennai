
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ImageGallery from './ImageGallery';
import { formatCurrency } from '@/utils/formatters';

interface PropertyCardProps {
  id: string;
  name: string;
  shortDescription?: string;
  basePrice: number;
  currency: string;
  imageUrls: string[];
  maxGuests: number;
  type?: string;
  amenities?: string[];
  className?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  name,
  shortDescription,
  basePrice,
  currency,
  imageUrls,
  maxGuests,
  type,
  amenities = [],
  className
}) => {
  return (
    <Card className={`h-full overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <div className="relative">
        <ImageGallery 
          images={imageUrls.length > 0 ? imageUrls : ['/placeholder.svg']}
          aspectRatio="landscape"
        />
        
        {type && (
          <Badge className="absolute top-2 left-2 bg-white/80 text-black hover:bg-white/90">
            {type}
          </Badge>
        )}
      </div>
      
      <CardContent className="pt-4">
        <h3 className="text-xl font-serif font-semibold mb-1 line-clamp-1">{name}</h3>
        
        {shortDescription && (
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{shortDescription}</p>
        )}
        
        <div className="flex flex-wrap gap-1 mb-2">
          <Badge variant="outline" className="text-xs">
            Up to {maxGuests} guests
          </Badge>
          
          {amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
          
          {amenities.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{amenities.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-0">
        <div>
          <span className="font-semibold">{formatCurrency(basePrice, currency)}</span>
          <span className="text-gray-500 text-sm"> / night</span>
        </div>
        
        <Link 
          to={`/booking?propertyId=${id}`}
          className="bg-haven-green hover:bg-haven-green/90 text-white px-4 py-2 rounded-md text-sm transition-colors"
        >
          Book Now
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
