
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TrendingDown } from 'lucide-react';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';

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
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: priceBreakdown.currency || 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const pricePerNight = nights > 0 ? priceBreakdown.basePrice / nights : priceBreakdown.basePrice;

  return (
    <div className="space-y-3">
      {/* Base pricing */}
      <div className="flex justify-between">
        <span>
          {formatCurrency(pricePerNight)} × {nights} {nights === 1 ? 'night' : 'nights'}
        </span>
        <span>{formatCurrency(priceBreakdown.basePrice)}</span>
      </div>

      {/* Discounts */}
      {priceBreakdown.discountAmount > 0 && (
        <>
          <div className="flex justify-between text-green-600">
            <span>Discounts</span>
            <span>-{formatCurrency(priceBreakdown.discountAmount)}</span>
          </div>
          {priceBreakdown.appliedDiscounts && priceBreakdown.appliedDiscounts.map((discount, index) => (
            <div key={index} className="flex justify-between text-sm text-green-600 ml-4">
              <span>• {discount.name}</span>
              <span>-{formatCurrency(discount.amount)}</span>
            </div>
          ))}
        </>
      )}

      {/* Cleaning fee */}
      {priceBreakdown.cleaningFee && priceBreakdown.cleaningFee > 0 && (
        <div className="flex justify-between">
          <span>Cleaning fee</span>
          <span>{formatCurrency(priceBreakdown.cleaningFee)}</span>
        </div>
      )}

      {/* Addon experiences */}
      {priceBreakdown.addonExperiencesTotal && priceBreakdown.addonExperiencesTotal > 0 && (
        <div className="flex justify-between">
          <span>Add-on experiences</span>
          <span>{formatCurrency(priceBreakdown.addonExperiencesTotal)}</span>
        </div>
      )}

      <Separator />

      {/* Subtotal */}
      <div className="flex justify-between font-medium">
        <span>Subtotal</span>
        <span>{formatCurrency(priceBreakdown.subtotalAfterDiscount)}</span>
      </div>

      {/* GST breakdown */}
      <div className="flex justify-between">
        <span>GST ({priceBreakdown.taxPercentage}%)</span>
        <span>{formatCurrency(priceBreakdown.taxAmount)}</span>
      </div>

      {priceBreakdown.gstBreakdown && (
        <div className="ml-4 space-y-1 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>• CGST (9%)</span>
            <span>{formatCurrency(priceBreakdown.gstBreakdown.cgst)}</span>
          </div>
          <div className="flex justify-between">
            <span>• SGST (9%)</span>
            <span>{formatCurrency(priceBreakdown.gstBreakdown.sgst)}</span>
          </div>
          {priceBreakdown.gstBreakdown.igst && (
            <div className="flex justify-between">
              <span>• IGST (18%)</span>
              <span>{formatCurrency(priceBreakdown.gstBreakdown.igst)}</span>
            </div>
          )}
        </div>
      )}

      <Separator />

      {/* Total */}
      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>{formatCurrency(priceBreakdown.totalAmountDue)}</span>
      </div>

      {/* Competitor comparison */}
      {(showCompetitorComparison || showPlatformComparison) && priceBreakdown.savingsFromCompetitors && priceBreakdown.savingsFromCompetitors > 0 && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm font-medium">
              You save {formatCurrency(priceBreakdown.savingsFromCompetitors)} vs other platforms!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
