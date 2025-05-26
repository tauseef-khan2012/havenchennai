
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Users, Calendar, MapPin, Wifi, Coffee, Car } from 'lucide-react';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { UUID } from '@/types/booking';
import { useCurrency } from '@/contexts/CurrencyContext';

interface CompactBookingSummaryProps {
  property: any;
  propertyId: UUID;
  guestCount: number;
  setGuestCount: (count: number) => void;
  selectedCheckIn?: Date;
  selectedCheckOut?: Date;
  priceBreakdown: EnhancedPriceBreakdown | null;
  nights: number;
  isCalculatingPrice: boolean;
  onProceedToPayment: () => void;
}

// Utility function to get key highlights
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
      { icon: MapPin, text: 'Scenic' },
      { icon: Wifi, text: 'Modern' },
      { icon: Coffee, text: 'Comfort' }
    );
  }
  
  return highlights.slice(0, 3); // Limit to 3 highlights
};

export const CompactBookingSummary: React.FC<CompactBookingSummaryProps> = ({
  property,
  propertyId,
  guestCount,
  setGuestCount,
  selectedCheckIn,
  selectedCheckOut,
  priceBreakdown,
  nights,
  isCalculatingPrice,
  onProceedToPayment
}) => {
  const { formatPrice } = useCurrency();
  const highlights = getPropertyHighlights(property);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Compact state when no dates selected
  if (!selectedCheckIn || !selectedCheckOut) {
    return (
      <Card className="h-fit">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-serif text-gray-900">
            Reserve Haven
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Property Highlights */}
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

          {/* Guest Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
              <Users className="h-4 w-4" />
              Guests
            </label>
            <select
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value))}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-haven-teal focus:ring-2 focus:ring-haven-teal focus:ring-opacity-20 transition-all"
            >
              {Array.from({ length: property.max_guests }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          {/* Call to action */}
          <div className="text-center py-4">
            <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium">
              Select dates to see pricing
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Expanded state with pricing
  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-serif text-gray-900">
          Booking Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Property Highlights */}
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

        {/* Date Selection Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 uppercase font-medium">Check-in</div>
            <div className="font-semibold text-gray-900">
              {formatDate(selectedCheckIn)}
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 uppercase font-medium">Check-out</div>
            <div className="font-semibold text-gray-900">
              {formatDate(selectedCheckOut)}
            </div>
          </div>
        </div>

        {nights > 0 && (
          <div className="text-center text-sm text-gray-600 font-medium bg-haven-teal/10 py-2 rounded-lg">
            {nights} {nights === 1 ? 'night' : 'nights'}
          </div>
        )}

        {/* Guest Selection */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
            <Users className="h-4 w-4" />
            Guests
          </label>
          <select
            value={guestCount}
            onChange={(e) => setGuestCount(parseInt(e.target.value))}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-haven-teal focus:ring-2 focus:ring-haven-teal focus:ring-opacity-20 transition-all"
          >
            {Array.from({ length: property.max_guests }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>

        {/* Price Summary */}
        {priceBreakdown && (
          <div className="space-y-4 bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>₹4,000 × {nights} nights</span>
                <span>₹{formatPrice(priceBreakdown.basePrice, 'INR')}</span>
              </div>
              
              {priceBreakdown.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{formatPrice(priceBreakdown.discountAmount, 'INR')}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span>GST (18%)</span>
                <span>₹{formatPrice(priceBreakdown.taxAmount, 'INR')}</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{formatPrice(priceBreakdown.totalAmountDue, 'INR')}</span>
            </div>
          </div>
        )}

        <Button 
          onClick={onProceedToPayment}
          className="w-full bg-haven-teal hover:bg-haven-teal/90 text-white font-semibold py-3 text-base rounded-lg transition-all"
          disabled={isCalculatingPrice}
          size="lg"
        >
          {isCalculatingPrice ? 'Calculating...' : 'Continue to Checkout'}
        </Button>
      </CardContent>
    </Card>
  );
};
