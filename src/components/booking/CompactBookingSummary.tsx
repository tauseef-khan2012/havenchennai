
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { UUID } from '@/types/booking';
import { PropertyHighlights } from './summary/PropertyHighlights';
import { PriceBreakdown } from './summary/PriceBreakdown';

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

export const CompactBookingSummary: React.FC<CompactBookingSummaryProps> = ({
  property,
  selectedCheckIn,
  selectedCheckOut,
  priceBreakdown,
  nights,
  guestCount,
  isCalculatingPrice,
  onProceedToPayment
}) => {
  // Compact state when no dates selected
  if (!selectedCheckIn || !selectedCheckOut) {
    return (
      <div>
        <h2 className="text-2xl lg:text-3xl font-serif font-bold mb-6 text-gray-900">Reserve Haven</h2>
        <Card className="h-fit">
          <CardContent className="p-4 space-y-4">
            <PropertyHighlights property={property} />
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
          <PropertyHighlights property={property} />

          {priceBreakdown && (
            <PriceBreakdown 
              priceBreakdown={priceBreakdown}
              nights={nights}
              guestCount={guestCount}
            />
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
