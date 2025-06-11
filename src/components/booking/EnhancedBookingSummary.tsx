
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, Users, CreditCard, Calculator } from 'lucide-react';
import { SimplePriceSummary } from './SimplePriceSummary';
import { SimplePriceBreakdown } from '@/services/simplePricingService';
import { useCurrency } from '@/contexts/CurrencyContext';
import { UUID } from '@/types/booking';

interface EnhancedBookingSummaryProps {
  property: any;
  propertyId: UUID;
  guestCount: number;
  selectedCheckIn?: Date;
  selectedCheckOut?: Date;
  priceBreakdown: SimplePriceBreakdown | null;
  nights: number;
  isCalculatingPrice: boolean;
  onProceedToPayment: () => void;
  showPropertyDetails?: boolean;
}

export const EnhancedBookingSummary: React.FC<EnhancedBookingSummaryProps> = ({
  property,
  propertyId,
  guestCount,
  selectedCheckIn,
  selectedCheckOut,
  priceBreakdown,
  nights,
  isCalculatingPrice,
  onProceedToPayment,
  showPropertyDetails = true
}) => {
  const { formatPrice } = useCurrency();

  const hasDatesSelected = selectedCheckIn && selectedCheckOut;
  const canProceed = hasDatesSelected && priceBreakdown && !isCalculatingPrice;

  console.log('EnhancedBookingSummary - State check:', {
    selectedCheckIn,
    selectedCheckOut,
    priceBreakdown: !!priceBreakdown,
    isCalculatingPrice,
    hasDatesSelected,
    canProceed
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {showPropertyDetails && (
        <div className="text-center">
          <h3 className="text-xl font-serif text-haven-beige mb-2">{property?.name}</h3>
          <p className="text-sm text-haven-beige/70">Padur, Chennai OMR</p>
        </div>
      )}

      {/* Date and Guest Selection Summary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-yellow-gradient/10 rounded-2xl border border-haven-yellow/20">
          <div className="flex items-center gap-2 text-haven-beige">
            <Calendar className="h-4 w-4 text-haven-yellow" />
            <span className="text-sm font-medium">Dates</span>
          </div>
          <div className="text-right">
            {hasDatesSelected ? (
              <div className="text-sm text-haven-beige">
                <div>{formatDate(selectedCheckIn!)}</div>
                <div className="text-haven-beige/60">to {formatDate(selectedCheckOut!)}</div>
                <div className="text-xs text-haven-yellow">{nights} {nights === 1 ? 'night' : 'nights'}</div>
              </div>
            ) : (
              <span className="text-sm text-haven-beige/60">Select dates</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-yellow-gradient/10 rounded-2xl border border-haven-yellow/20">
          <div className="flex items-center gap-2 text-haven-beige">
            <Users className="h-4 w-4 text-haven-yellow" />
            <span className="text-sm font-medium">Guests</span>
          </div>
          <div className="text-sm text-haven-beige">
            {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
          </div>
        </div>
      </div>

      <Separator className="bg-haven-yellow/20" />

      {/* Price Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-haven-beige">
          <Calculator className="h-4 w-4 text-haven-yellow" />
          <span className="text-sm font-medium">Price Breakdown</span>
        </div>

        {isCalculatingPrice ? (
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-haven-yellow"></div>
            <span className="ml-2 text-sm text-haven-beige/60">Calculating...</span>
          </div>
        ) : priceBreakdown ? (
          <SimplePriceSummary priceBreakdown={priceBreakdown} />
        ) : hasDatesSelected ? (
          <div className="text-center p-4 text-haven-beige/60">
            <span className="text-sm">Price calculation in progress...</span>
          </div>
        ) : (
          <div className="text-center p-4 text-haven-beige/60">
            <span className="text-sm">Select dates to see pricing</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <Button
        onClick={onProceedToPayment}
        disabled={!canProceed}
        className="w-full bg-yellow-gradient hover:shadow-yellow text-haven-navy font-semibold py-3 text-lg transition-all duration-300 transform hover:scale-105 ripple-effect disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        size="lg"
      >
        {!hasDatesSelected ? (
          'Select dates to continue'
        ) : isCalculatingPrice ? (
          'Calculating price...'
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Reserve Now {priceBreakdown ? `• ${formatPrice(priceBreakdown.totalAmount, priceBreakdown.currency)}` : ''}
          </>
        )}
      </Button>

      {canProceed && (
        <p className="text-xs text-haven-beige/60 text-center">
          No account required • Secure guest booking
        </p>
      )}
    </div>
  );
};
