
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, MapPin, Wifi, Car, Coffee, Star } from 'lucide-react';
import EnhancedDiscountInput from './EnhancedDiscountInput';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { DiscountApplication } from '@/services/discountService';
import { UUID } from '@/types/booking';
import { useCurrency } from '@/contexts/CurrencyContext';

interface EnhancedBookingSidebarProps {
  property: any;
  propertyId: UUID;
  guestCount: number;
  setGuestCount: (count: number) => void;
  selectedCheckIn?: Date;
  selectedCheckOut?: Date;
  priceBreakdown: EnhancedPriceBreakdown | null;
  appliedDiscount?: DiscountApplication;
  nights: number;
  isCalculatingPrice: boolean;
  onDiscountApplied: (discount: DiscountApplication) => void;
  onProceedToPayment: () => void;
}

export const EnhancedBookingSidebar: React.FC<EnhancedBookingSidebarProps> = ({
  property,
  propertyId,
  guestCount,
  setGuestCount,
  selectedCheckIn,
  selectedCheckOut,
  priceBreakdown,
  appliedDiscount,
  nights,
  isCalculatingPrice,
  onDiscountApplied,
  onProceedToPayment
}) => {
  const { formatPrice } = useCurrency();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const amenityIcons = {
    'WiFi': Wifi,
    'Parking': Car,
    'Coffee': Coffee
  };

  return (
    <div className="space-y-6">
      {/* Property Summary Card */}
      <Card className="overflow-hidden shadow-lg">
        <div className="aspect-video overflow-hidden">
          <img
            src={property.image_urls?.[0] || '/placeholder.jpg'}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-gray-900">
                  {property.name}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{property.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">4.9</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{property.type}</Badge>
              <span className="text-sm text-gray-600">
                Up to {property.max_guests} guests
              </span>
            </div>

            {property.amenities && (
              <div className="flex flex-wrap gap-2">
                {property.amenities.slice(0, 3).map((amenity: string, index: number) => {
                  const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons];
                  return (
                    <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                      {IconComponent && <IconComponent className="h-3 w-3" />}
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-haven-teal" />
            Your Booking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dates Selection */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Check-in</div>
                <div className="font-medium">
                  {selectedCheckIn ? formatDate(selectedCheckIn) : 'Select date'}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Check-out</div>
                <div className="font-medium">
                  {selectedCheckOut ? formatDate(selectedCheckOut) : 'Select date'}
                </div>
              </div>
            </div>
            
            {nights > 0 && (
              <div className="text-center text-sm text-gray-600">
                {nights} {nights === 1 ? 'night' : 'nights'}
              </div>
            )}
          </div>

          {/* Guest Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
              <Users className="h-4 w-4" />
              Guests
            </label>
            <select
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value))}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-haven-teal focus:ring-haven-teal"
            >
              {Array.from({ length: property.max_guests }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Discount Code */}
      {selectedCheckIn && selectedCheckOut && priceBreakdown && (
        <EnhancedDiscountInput
          bookingType="property"
          itemId={propertyId}
          totalAmount={priceBreakdown.subtotalAfterDiscount}
          onDiscountApplied={onDiscountApplied}
          appliedDiscount={appliedDiscount}
        />
      )}

      {/* Price Breakdown */}
      {selectedCheckIn && selectedCheckOut && priceBreakdown && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Price Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>₹{formatPrice(4000, 'INR')} × {nights} nights</span>
                <span>₹{formatPrice(priceBreakdown.basePrice, 'INR')}</span>
              </div>
              
              {priceBreakdown.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{formatPrice(priceBreakdown.discountAmount, 'INR')}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{formatPrice(priceBreakdown.taxAmount, 'INR')}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{formatPrice(priceBreakdown.totalAmountDue, 'INR')}</span>
              </div>
            </div>
            
            <Button 
              onClick={onProceedToPayment}
              className="w-full mt-6 bg-haven-teal hover:bg-haven-teal/90 text-white py-3 text-lg font-medium"
              disabled={isCalculatingPrice}
              size="lg"
            >
              {isCalculatingPrice ? 'Calculating...' : 'Reserve Haven'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Initial State */}
      {(!selectedCheckIn || !selectedCheckOut) && (
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">Select your dates</h3>
            <p className="text-gray-500 text-sm">
              Choose your check-in and check-out dates to see pricing and availability
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
