
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { calculateEnhancedPropertyBookingPrice, EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { DiscountApplication } from '@/services/discountService';
import { calculateNights } from '@/utils/bookingUtils';
import { UUID } from '@/types/booking';

export const useBookingPricing = () => {
  const { toast } = useToast();
  const [basePriceBreakdown, setBasePriceBreakdown] = useState<EnhancedPriceBreakdown | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountApplication | undefined>();
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [lastCalculationKey, setLastCalculationKey] = useState<string>('');

  // Calculate final price breakdown with discount applied
  const getFinalPriceBreakdown = (): EnhancedPriceBreakdown | null => {
    if (!basePriceBreakdown) return null;

    if (!appliedDiscount?.isValid || !appliedDiscount.discountAmount) {
      return basePriceBreakdown;
    }

    // Apply discount to subtotal
    const subtotalAfterDiscount = Math.max(0, basePriceBreakdown.subtotalAfterDiscount - appliedDiscount.discountAmount);
    
    // Recalculate GST on discounted amount
    const gstAmount = subtotalAfterDiscount * 0.18;
    const totalAmountDue = subtotalAfterDiscount + gstAmount;

    return {
      ...basePriceBreakdown,
      discountAmount: appliedDiscount.discountAmount,
      subtotalAfterDiscount,
      taxAmount: gstAmount,
      totalAmountDue,
      gstBreakdown: {
        cgst: gstAmount / 2,
        sgst: gstAmount / 2
      }
    };
  };

  const calculatePricing = useCallback(async (propertyId: UUID, checkIn: Date, checkOut: Date, guestCount: number = 2) => {
    // Create a unique key for this calculation to prevent duplicate requests
    const calculationKey = `${propertyId}-${checkIn.getTime()}-${checkOut.getTime()}-${guestCount}`;
    
    // Skip if this exact calculation is already in progress or completed
    if (calculationKey === lastCalculationKey && basePriceBreakdown) {
      console.log('useBookingPricing - Skipping duplicate calculation');
      return;
    }

    if (isCalculatingPrice) {
      console.log('useBookingPricing - Calculation already in progress, skipping');
      return;
    }

    setIsCalculatingPrice(true);
    setLastCalculationKey(calculationKey);
    
    try {
      console.log('useBookingPricing - Starting price calculation:', { propertyId, checkIn, checkOut, guestCount });
      
      const pricing = await calculateEnhancedPropertyBookingPrice(
        propertyId,
        checkIn,
        checkOut,
        guestCount
      );
      
      console.log('useBookingPricing - Price calculation completed:', pricing);
      setBasePriceBreakdown(pricing);
    } catch (error) {
      console.error('useBookingPricing - Error calculating pricing:', error);
      
      // Fallback pricing
      const nights = calculateNights(checkIn, checkOut);
      const basePrice = 4000 * nights;
      const additionalGuestCharges = Math.max(0, guestCount - 2) * 500;
      const subtotal = basePrice + additionalGuestCharges;
      const gstAmount = subtotal * 0.18;
      
      const fallbackPricing = {
        basePrice,
        discountAmount: 0,
        subtotalAfterDiscount: subtotal,
        taxPercentage: 18,
        taxAmount: gstAmount,
        totalAmountDue: subtotal + gstAmount,
        currency: 'INR',
        gstBreakdown: {
          cgst: gstAmount / 2,
          sgst: gstAmount / 2
        }
      };
      
      console.log('useBookingPricing - Using fallback pricing:', fallbackPricing);
      setBasePriceBreakdown(fallbackPricing);
      
      toast({
        title: "Pricing Notice",
        description: "Using standard rates. Final pricing will be confirmed.",
        variant: "default"
      });
    } finally {
      setIsCalculatingPrice(false);
    }
  }, [isCalculatingPrice, lastCalculationKey, basePriceBreakdown, toast]);

  const handleDiscountApplied = (discount: DiscountApplication) => {
    console.log('useBookingPricing - Discount applied:', discount);
    setAppliedDiscount(discount);
  };

  const removeDiscount = () => {
    setAppliedDiscount(undefined);
  };

  const resetPricing = () => {
    setBasePriceBreakdown(null);
    setAppliedDiscount(undefined);
    setLastCalculationKey('');
  };

  return {
    priceBreakdown: getFinalPriceBreakdown(),
    basePriceBreakdown,
    appliedDiscount,
    isCalculatingPrice,
    calculatePricing,
    handleDiscountApplied,
    removeDiscount,
    resetPricing,
    // Legacy compatibility for platform comparisons (empty for now)
    platformComparisons: [],
    fetchPlatformComparisons: async () => {}
  };
};
