
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { SimplePriceBreakdown } from '@/services/simplePricingService';
import { UUID } from '@/types/booking';

export const useBookingNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProceedToPayment = async (
    user: any,
    propertyId: UUID,
    selectedCheckIn: Date | undefined,
    selectedCheckOut: Date | undefined,
    guestCount: number,
    priceBreakdown: SimplePriceBreakdown | null,
    appliedDiscount: any | undefined,
    contactInfo?: { fullName: string; email: string; phone: string },
    specialRequests?: string,
    guestDetails?: { name: string; age?: number }[]
  ) => {
    console.log('handleProceedToPayment called with:', {
      user: user?.id,
      propertyId,
      selectedCheckIn,
      selectedCheckOut,
      guestCount,
      priceBreakdown: !!priceBreakdown,
      contactInfo
    });

    if (!selectedCheckIn || !selectedCheckOut || !priceBreakdown) {
      toast({
        title: "Missing information",
        description: "Please select dates and ensure pricing is calculated.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Navigate to booking checkout page with booking details
      const checkoutParams = new URLSearchParams({
        propertyId,
        checkIn: selectedCheckIn.toISOString(),
        checkOut: selectedCheckOut.toISOString(),
        guests: guestCount.toString(),
        total: priceBreakdown.totalAmount.toString(),
        currency: priceBreakdown.currency
      });

      console.log('Navigating to booking checkout with params:', checkoutParams.toString());
      navigate(`/booking/checkout?${checkoutParams.toString()}`);
      
    } catch (error: any) {
      console.error('Error navigating to checkout:', error);
      toast({
        title: "Navigation error",
        description: error.message || "Failed to proceed to checkout. Please try again.",
        variant: "destructive"
      });
    }
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
