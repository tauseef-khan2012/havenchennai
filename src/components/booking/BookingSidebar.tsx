
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Users, Calendar } from 'lucide-react';
import { EnhancedPriceSummary } from './EnhancedPriceSummary';
import DiscountCodeInput from './DiscountCodeInput';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { DiscountApplication } from '@/services/discountService';
import { UUID } from '@/types/booking';

interface BookingSidebarProps {
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

export const BookingSidebar: React.FC<BookingSidebarProps> = ({
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
  return (
    <div className="space-y-6">
      {/* Guest Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Guests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={guestCount}
            onChange={(e) => setGuestCount(parseInt(e.target.value))}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            {Array.from({ length: property.max_guests }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Discount Code */}
      {selectedCheckIn && selectedCheckOut && priceBreakdown && (
        <DiscountCodeInput
          bookingType="property"
          itemId={propertyId}
          totalAmount={priceBreakdown.subtotalAfterDiscount}
          onDiscountApplied={onDiscountApplied}
          appliedDiscount={appliedDiscount}
        />
      )}

      {/* Price Summary */}
      {selectedCheckIn && selectedCheckOut && priceBreakdown && (
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Check-in</span>
                <span>{selectedCheckIn.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Check-out</span>
                <span>{selectedCheckOut.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Nights</span>
                <span>{nights}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Guests</span>
                <span>{guestCount}</span>
              </div>
              
              <Separator />
              
              <EnhancedPriceSummary 
                priceBreakdown={priceBreakdown} 
                nights={nights}
                showCompetitorComparison={false}
              />
              
              <Button 
                onClick={onProceedToPayment}
                className="w-full bg-haven-teal hover:bg-haven-teal/90"
                disabled={isCalculatingPrice}
              >
                {isCalculatingPrice ? 'Calculating...' : 'Proceed to Payment'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedCheckIn || !selectedCheckOut ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Select your dates to see pricing and book</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};
