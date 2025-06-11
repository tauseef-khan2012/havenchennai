
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { SimplePriceBreakdown } from '@/services/simplePricingService';
import { useCurrency } from '@/contexts/CurrencyContext';

interface SimplePriceSummaryProps {
  priceBreakdown: SimplePriceBreakdown;
}

export const SimplePriceSummary: React.FC<SimplePriceSummaryProps> = ({
  priceBreakdown
}) => {
  const { formatPrice } = useCurrency();

  const baseNightlyRate = priceBreakdown.basePrice / priceBreakdown.nights;

  return (
    <div className="space-y-4">
      {/* Base pricing */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-haven-beige">
          <span>{formatPrice(baseNightlyRate, priceBreakdown.currency)} × {priceBreakdown.nights} {priceBreakdown.nights === 1 ? 'night' : 'nights'}</span>
          <span>{formatPrice(priceBreakdown.basePrice, priceBreakdown.currency)}</span>
        </div>
        
        {/* Additional guest charges */}
        {priceBreakdown.additionalGuestCharges > 0 && (
          <div className="flex justify-between items-center text-haven-beige">
            <span>Additional guests ({priceBreakdown.guestCount - 2} guests)</span>
            <span>{formatPrice(priceBreakdown.additionalGuestCharges, priceBreakdown.currency)}</span>
          </div>
        )}
      </div>

      <Separator className="bg-haven-yellow/20" />

      {/* Subtotal */}
      <div className="flex justify-between items-center text-haven-beige">
        <span>Subtotal</span>
        <span>{formatPrice(priceBreakdown.subtotal, priceBreakdown.currency)}</span>
      </div>

      {/* GST */}
      <div className="flex justify-between items-center text-haven-beige">
        <span>GST (18%)</span>
        <span>{formatPrice(priceBreakdown.gstAmount, priceBreakdown.currency)}</span>
      </div>

      <Separator className="bg-haven-yellow/20" />

      {/* Total */}
      <div className="flex justify-between items-center text-lg font-bold text-haven-beige">
        <span>Total</span>
        <span>{formatPrice(priceBreakdown.totalAmount, priceBreakdown.currency)}</span>
      </div>
    </div>
  );
};
