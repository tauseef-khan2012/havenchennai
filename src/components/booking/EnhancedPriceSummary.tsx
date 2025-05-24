
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { useCurrency } from '@/contexts/CurrencyContext';

interface EnhancedPriceSummaryProps {
  priceBreakdown: EnhancedPriceBreakdown;
  nights?: number;
  showCompetitorComparison?: boolean;
}

export const EnhancedPriceSummary: React.FC<EnhancedPriceSummaryProps> = ({
  priceBreakdown,
  nights,
  showCompetitorComparison = true
}) => {
  const { formatPrice } = useCurrency();

  const baseNightlyRate = nights ? priceBreakdown.basePrice / nights : priceBreakdown.basePrice;

  return (
    <div className="space-y-4">
      {/* Base pricing */}
      <div className="space-y-3">
        {nights && (
          <div className="flex justify-between items-center">
            <span>₹{formatPrice(baseNightlyRate, priceBreakdown.currency)} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
            <span>₹{formatPrice(priceBreakdown.basePrice, priceBreakdown.currency)}</span>
          </div>
        )}
        
        {/* Applied discounts */}
        {priceBreakdown.appliedDiscounts && priceBreakdown.appliedDiscounts.length > 0 && (
          <div className="space-y-2">
            {priceBreakdown.appliedDiscounts.map((discount, index) => (
              <div key={index} className="flex justify-between items-center text-green-600">
                <div className="flex items-center gap-2">
                  <span>{discount.name}</span>
                  <Badge variant="outline" className="text-xs border-green-300 text-green-600">
                    {discount.percentage}% off
                  </Badge>
                </div>
                <span>-₹{formatPrice(discount.amount, priceBreakdown.currency)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Add-on experiences */}
        {priceBreakdown.addonExperiencesTotal && priceBreakdown.addonExperiencesTotal > 0 && (
          <div className="flex justify-between items-center">
            <span>Experience add-ons</span>
            <span>₹{formatPrice(priceBreakdown.addonExperiencesTotal, priceBreakdown.currency)}</span>
          </div>
        )}
      </div>

      <Separator />

      {/* Subtotal */}
      <div className="flex justify-between items-center">
        <span>Subtotal</span>
        <span>₹{formatPrice(priceBreakdown.subtotalAfterDiscount, priceBreakdown.currency)}</span>
      </div>

      {/* Tax breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span>GST ({priceBreakdown.taxPercentage}%)</span>
          <span>₹{formatPrice(priceBreakdown.taxAmount, priceBreakdown.currency)}</span>
        </div>
        
        {priceBreakdown.gstBreakdown && (
          <div className="ml-4 space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>CGST (9%)</span>
              <span>₹{formatPrice(priceBreakdown.gstBreakdown.cgst, priceBreakdown.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST (9%)</span>
              <span>₹{formatPrice(priceBreakdown.gstBreakdown.sgst, priceBreakdown.currency)}</span>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Total */}
      <div className="flex justify-between items-center text-lg font-bold">
        <span>Total</span>
        <span>₹{formatPrice(priceBreakdown.totalAmountDue, priceBreakdown.currency)}</span>
      </div>

      {/* Competitor comparison */}
      {showCompetitorComparison && priceBreakdown.savingsFromCompetitors && priceBreakdown.savingsFromCompetitors > 0 && (
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="text-sm text-green-800">
            <span className="font-medium">You save ₹{formatPrice(priceBreakdown.savingsFromCompetitors, priceBreakdown.currency)}</span> compared to other platforms!
          </div>
        </div>
      )}
    </div>
  );
};
