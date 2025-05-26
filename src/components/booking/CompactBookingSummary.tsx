
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Wifi, Coffee, Car } from 'lucide-react';
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
      { icon: MapPin, text: 'Lakeside' },
      { icon: Wifi, text: 'WiFi' },
      { icon: Coffee, text: 'Kitchen' }
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

  // Calculate additional guest charges (₹500 per guest after 2nd)
  const additionalGuestCharges = Math.max(0, guestCount - 2) * 500;

  // Compact state when no dates selected
  if (!selectedCheckIn || !selectedCheckOut) {
    return (
      <div>
        <h2 className="text-2xl lg:text-3xl font-serif font-bold mb-6 text-gray-900">Reserve Haven</h2>
        <Card className="h-fit">
          <CardContent className="p-4 space-y-4">
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

            {/* Call to action */}
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm font-medium">
                Select dates to see pricing
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Expanded state with pricing
  return (
    <div>
      <h2 className="text-2xl lg:text-3xl font-serif font-bold mb-6 text-gray-900">Reserve Haven</h2>
      <Card className="h-fit">
        <CardContent className="p-4 space-y-5">
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

          {/* Price Summary */}
          {priceBreakdown && (
            <div className="space-y-4 bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>₹4,000 × {nights} nights</span>
                  <span>₹{formatPrice(4000 * nights, 'INR')}</span>
                </div>
                
                {additionalGuestCharges > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Additional guests ({guestCount - 2} × ₹500)</span>
                    <span>₹{formatPrice(additionalGuestCharges, 'INR')}</span>
                  </div>
                )}
                
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
                <span>₹{formatPrice(priceBreakdown.totalAmountDue + additionalGuestCharges, 'INR')}</span>
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
    </div>
  );
};
