
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TrendingDown } from 'lucide-react';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { useCurrency } from '@/contexts/CurrencyContext';

export interface EnhancedPriceSummaryProps {
  priceBreakdown: EnhancedPriceBreakdown;
  nights?: number;
  showCompetitorComparison?: boolean;
  showPlatformComparison?: boolean;
}

export const EnhancedPriceSummary: React.FC<EnhancedPriceSummaryProps> = ({
  priceBreakdown,
  nights = 1,
  showCompetitorComparison = false,
  showPlatformComparison = false
}) => {
  const { formatPrice, currentCurrency } = useCurrency();

  const pricePerNight = nights > 0 ? priceBreakdown.basePrice / nights : priceBreakdown.basePrice;

  return (
    <div className="space-y-3">
      {/* Base pricing */}
      <div className="flex justify-between">
        <span>
          {formatPrice(pricePerNight, priceBreakdown.currency)} × {nights} {nights === 1 ? 'night' : 'nights'}
        </span>
        <span>{formatPrice(priceBreakdown.basePrice, priceBreakdown.currency)}</span>
      </div>

      {/* Discounts */}
      {priceBreakdown.discountAmount > 0 && (
        <>
          <div className="flex justify-between text-green-600">
            <span>Discounts</span>
            <span>-{formatPrice(priceBreakdown.discountAmount, priceBreakdown.currency)}</span>
          </div>
          {priceBreakdown.appliedDiscounts && priceBreakdown.appliedDiscounts.map((discount, index) => (
            <div key={index} className="flex justify-between text-sm text-green-600 ml-4">
              <span>• {discount.name}</span>
              <span>-{formatPrice(discount.amount, priceBreakdown.currency)}</span>
            </div>
          ))}
        </>
      )}

      {/* Cleaning fee */}
      {priceBreakdown.cleaningFee && priceBreakdown.cleaningFee > 0 && (
        <div className="flex justify-between">
          <span>Cleaning fee</span>
          <span>{formatPrice(priceBreakdown.cleaningFee, priceBreakdown.currency)}</span>
        </div>
      )}

      {/* Addon experiences */}
      {priceBreakdown.addonExperiencesTotal && priceBreakdown.addonExperiencesTotal > 0 && (
        <div className="flex justify-between">
          <span>Add-on experiences</span>
          <span>{formatPrice(priceBreakdown.addonExperiencesTotal, priceBreakdown.currency)}</span>
        </div>
      )}

      <Separator />

      {/* Subtotal */}
      <div className="flex justify-between font-medium">
        <span>Subtotal</span>
        <span>{formatPrice(priceBreakdown.subtotalAfterDiscount, priceBreakdown.currency)}</span>
      </div>

      {/* GST breakdown */}
      <div className="flex justify-between">
        <span>GST ({priceBreakdown.taxPercentage}%)</span>
        <span>{formatPrice(priceBreakdown.taxAmount, priceBreakdown.currency)}</span>
      </div>

      {priceBreakdown.gstBreakdown && (
        <div className="ml-4 space-y-1 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>• CGST (9%)</span>
            <span>{formatPrice(priceBreakdown.gstBreakdown.cgst, priceBreakdown.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>• SGST (9%)</span>
            <span>{formatPrice(priceBreakdown.gstBreakdown.sgst, priceBreakdown.currency)}</span>
          </div>
          {priceBreakdown.gstBreakdown.igst && (
            <div className="flex justify-between">
              <span>• IGST (18%)</span>
              <span>{formatPrice(priceBreakdown.gstBreakdown.igst, priceBreakdown.currency)}</span>
            </div>
          )}
        </div>
      )}

      <Separator />

      {/* Total */}
      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>{formatPrice(priceBreakdown.totalAmountDue, priceBreakdown.currency)}</span>
      </div>

      {/* Competitor comparison */}
      {(showCompetitorComparison || showPlatformComparison) && priceBreakdown.savingsFromCompetitors && priceBreakdown.savingsFromCompetitors > 0 && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm font-medium">
              You save {formatPrice(priceBreakdown.savingsFromCompetitors, priceBreakdown.currency)} vs other platforms!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
