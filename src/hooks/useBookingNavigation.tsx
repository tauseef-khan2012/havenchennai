
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { DiscountApplication } from '@/services/discountService';
import { UUID } from '@/types/booking';

export const useBookingNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProceedToPayment = (
    user: any,
    propertyId: UUID,
    selectedCheckIn: Date | undefined,
    selectedCheckOut: Date | undefined,
    guestCount: number,
    priceBreakdown: EnhancedPriceBreakdown | null,
    appliedDiscount: DiscountApplication | undefined
  ) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your booking.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!selectedCheckIn || !selectedCheckOut || !priceBreakdown) {
      toast({
        title: "Missing information",
        description: "Please select dates and ensure pricing is calculated.",
        variant: "destructive"
      });
      return;
    }

    // Navigate to payment with booking details
    const bookingParams = new URLSearchParams({
      propertyId,
      checkIn: selectedCheckIn.toISOString(),
      checkOut: selectedCheckOut.toISOString(),
      guests: guestCount.toString(),
      ...(appliedDiscount?.isValid && appliedDiscount.discountCode && { 
        discountCode: appliedDiscount.discountCode 
      })
    });

    navigate(`/booking/payment?${bookingParams.toString()}`);
  };

  const handlePlatformBooking = (platform: string, url?: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast({
        title: "Not available",
        description: `Booking via ${platform} is not available for these dates.`,
        variant: "destructive"
      });
    }
  };

  return {
    handleProceedToPayment,
    handlePlatformBooking
  };
};
