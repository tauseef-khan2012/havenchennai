
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Star, Calendar } from 'lucide-react';

interface PropertyCardProps {
  id: string;
  name: string;
  type: string;
  location: string;
  maxGuests: number;
  basePrice: number;
  currency: string;
  imageUrl: string;
  amenities?: string[];
  rating?: number;
  reviewCount?: number;
  isAvailable?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  name,
  type,
  location,
  maxGuests,
  basePrice,
  currency,
  imageUrl,
  amenities = [],
  rating = 4.8,
  reviewCount = 24,
  isAvailable = true
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <div className="aspect-video overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <Badge className="absolute top-3 left-3 bg-haven-teal text-white">
          {type}
        </Badge>
        {!isAvailable && (
          <Badge className="absolute top-3 right-3 bg-red-500 text-white">
            Unavailable
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-serif font-semibold text-lg group-hover:text-haven-teal transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Up to {maxGuests}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{rating}</span>
              <span className="text-sm text-gray-500">({reviewCount})</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-haven-teal">
                {formatCurrency(basePrice)}
              </div>
              <div className="text-xs text-gray-500">per night</div>
            </div>
          </div>

          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {amenities.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {amenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{amenities.length - 3} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Link to={`/stay/${id}`}>
                View Details
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="flex-1 bg-haven-teal hover:bg-haven-teal/90"
              disabled={!isAvailable}
            >
              <Link to={`/booking?propertyId=${id}`}>
                <Calendar className="h-4 w-4 mr-1" />
                Book Now
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
