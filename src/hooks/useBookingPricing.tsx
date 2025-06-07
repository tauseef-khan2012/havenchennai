
import { useState } from 'react';
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

  const calculatePricing = async (propertyId: UUID, checkIn: Date, checkOut: Date, guestCount: number = 2) => {
    setIsCalculatingPrice(true);
    try {
      console.log('Calculating pricing for:', { propertyId, checkIn, checkOut, guestCount });
      
      const pricing = await calculateEnhancedPropertyBookingPrice(
        propertyId,
        checkIn,
        checkOut,
        guestCount
      );
      
      console.log('Base pricing calculated:', pricing);
      setBasePriceBreakdown(pricing);
    } catch (error) {
      console.error('Error calculating pricing:', error);
      toast({
        title: "Error",
        description: "Failed to calculate pricing. Using default rates.",
        variant: "destructive"
      });
      
      // Fallback pricing
      const nights = calculateNights(checkIn, checkOut);
      const basePrice = 4000 * nights;
      const additionalGuestCharges = Math.max(0, guestCount - 2) * 500;
      const subtotal = basePrice + additionalGuestCharges;
      const gstAmount = subtotal * 0.18;
      
      setBasePriceBreakdown({
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
      });
    } finally {
      setIsCalculatingPrice(false);
    }
  };

  const handleDiscountApplied = (discount: DiscountApplication) => {
    console.log('Discount applied:', discount);
    setAppliedDiscount(discount);
  };

  const removeDiscount = () => {
    setAppliedDiscount(undefined);
  };

  return {
    priceBreakdown: getFinalPriceBreakdown(),
    basePriceBreakdown,
    appliedDiscount,
    isCalculatingPrice,
    calculatePricing,
    handleDiscountApplied,
    removeDiscount,
    // Legacy compatibility for platform comparisons (empty for now)
    platformComparisons: [],
    fetchPlatformComparisons: async () => {}
  };
};
