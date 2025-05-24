
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, Info } from 'lucide-react';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/services/currencyService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface EnhancedPriceSummaryProps {
  priceBreakdown: EnhancedPriceBreakdown;
  nights?: number;
  showCompetitorComparison?: boolean;
}

export const EnhancedPriceSummary: React.FC<EnhancedPriceSummaryProps> = ({
  priceBreakdown,
  nights = 1,
  showCompetitorComparison = false
}) => {
  const { currentCurrency } = useCurrency();

  const formatPrice = (amount: number) => {
    return formatCurrency(amount, currentCurrency);
  };

  const pricePerNight = nights > 0 ? priceBreakdown.basePrice / nights : priceBreakdown.basePrice;

  return (
    <div className="space-y-3">
      {/* Currency conversion notice */}
      {priceBreakdown.displayCurrency !== priceBreakdown.originalCurrency && (
        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
          <Info className="h-4 w-4" />
          <span>
            Prices displayed in {priceBreakdown.displayCurrency}. 
            Payment will be processed in {priceBreakdown.originalCurrency}.
          </span>
        </div>
      )}

      {/* Base pricing */}
      <div className="flex justify-between">
        <span>
          {formatPrice(pricePerNight)} × {nights} {nights === 1 ? 'night' : 'nights'}
        </span>
        <span>{formatPrice(priceBreakdown.basePrice)}</span>
      </div>

      {/* Discounts */}
      {priceBreakdown.discountAmount > 0 && (
        <>
          <div className="flex justify-between text-green-600">
            <span>Discounts</span>
            <span>-{formatPrice(priceBreakdown.discountAmount)}</span>
          </div>
          {priceBreakdown.appliedDiscounts && priceBreakdown.appliedDiscounts.map((discount, index) => (
            <div key={index} className="flex justify-between text-sm text-green-600 ml-4">
              <span>• {discount.name}</span>
              <span>-{formatPrice(discount.amount)}</span>
            </div>
          ))}
        </>
      )}

      {/* Cleaning fee */}
      {priceBreakdown.cleaningFee && priceBreakdown.cleaningFee > 0 && (
        <div className="flex justify-between">
          <span>Cleaning fee</span>
          <span>{formatPrice(priceBreakdown.cleaningFee)}</span>
        </div>
      )}

      {/* Addon experiences */}
      {priceBreakdown.addonExperiencesTotal && priceBreakdown.addonExperiencesTotal > 0 && (
        <div className="flex justify-between">
          <span>Add-on experiences</span>
          <span>{formatPrice(priceBreakdown.addonExperiencesTotal)}</span>
        </div>
      )}

      <Separator />

      {/* Subtotal */}
      <div className="flex justify-between font-medium">
        <span>Subtotal</span>
        <span>{formatPrice(priceBreakdown.subtotalAfterDiscount)}</span>
      </div>

      {/* GST breakdown with tooltip */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex justify-between cursor-help">
              <span className="flex items-center gap-1">
                GST ({priceBreakdown.taxPercentage}%)
                <Info className="h-3 w-3 text-gray-400" />
              </span>
              <span>{formatPrice(priceBreakdown.taxAmount)}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <p>Goods and Services Tax as per Indian regulations</p>
              {priceBreakdown.displayCurrency !== 'INR' && (
                <p className="text-xs text-gray-500 mt-1">
                  Original GST: ₹{priceBreakdown.taxAmount / priceBreakdown.exchangeRate}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {priceBreakdown.gstBreakdown && (
        <div className="ml-4 space-y-1 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>• CGST (9%)</span>
            <span>{formatPrice(priceBreakdown.gstBreakdown.cgst)}</span>
          </div>
          <div className="flex justify-between">
            <span>• SGST (9%)</span>
            <span>{formatPrice(priceBreakdown.gstBreakdown.sgst)}</span>
          </div>
          {priceBreakdown.gstBreakdown.igst && (
            <div className="flex justify-between">
              <span>• IGST (18%)</span>
              <span>{formatPrice(priceBreakdown.gstBreakdown.igst)}</span>
            </div>
          )}
        </div>
      )}

      <Separator />

      {/* Total */}
      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>{formatPrice(priceBreakdown.totalAmountDue)}</span>
      </div>

      {/* Exchange rate info */}
      {priceBreakdown.displayCurrency !== priceBreakdown.originalCurrency && (
        <div className="text-xs text-gray-500 text-center">
          Exchange rate: 1 {priceBreakdown.originalCurrency} = {priceBreakdown.exchangeRate.toFixed(4)} {priceBreakdown.displayCurrency}
        </div>
      )}

      {/* Competitor comparison */}
      {showCompetitorComparison && priceBreakdown.savingsFromCompetitors && priceBreakdown.savingsFromCompetitors > 0 && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm font-medium">
              You save {formatPrice(priceBreakdown.savingsFromCompetitors)} vs other platforms!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
