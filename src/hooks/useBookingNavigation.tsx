
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { SimplePriceBreakdown } from '@/services/simplePricingService';
import { UUID } from '@/types/booking';
import { createGuestBooking } from '@/services/guestBookingService';

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
    if (!selectedCheckIn || !selectedCheckOut || !priceBreakdown) {
      toast({
        title: "Missing information",
        description: "Please select dates and ensure pricing is calculated.",
        variant: "destructive"
      });
      return;
    }

    // If contact info is provided, create the booking directly
    if (contactInfo) {
      try {
        const guestBookingData = {
          type: 'property' as const,
          guestName: contactInfo.fullName,
          guestEmail: contactInfo.email,
          guestPhone: contactInfo.phone,
          priceBreakdown: {
            totalAmountDue: priceBreakdown.totalAmount,
            currency: priceBreakdown.currency,
            basePrice: priceBreakdown.basePrice,
            taxAmount: priceBreakdown.gstAmount,
            subtotal: priceBreakdown.subtotal
          },
          propertyId,
          checkInDate: selectedCheckIn,
          checkOutDate: selectedCheckOut,
          numberOfGuests: guestCount,
          specialRequests: specialRequests || ''
        };
        
        const result = await createGuestBooking(guestBookingData);
        
        toast({
          title: 'Booking created!',
          description: 'Redirecting to payment...',
        });

        // Navigate to payment with booking details
        const bookingParams = new URLSearchParams({
          bookingId: result.bookingId,
          bookingReference: result.bookingReference,
          propertyId,
          checkIn: selectedCheckIn.toISOString(),
          checkOut: selectedCheckOut.toISOString(),
          guests: guestCount.toString(),
          amount: priceBreakdown.totalAmount.toString(),
          currency: priceBreakdown.currency
        });

        navigate(`/booking/payment?${bookingParams.toString()}`);
      } catch (error: any) {
        console.error('Error creating guest booking:', error);
        toast({
          title: "Booking error",
          description: error.message || "Failed to create booking. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      // Navigate to checkout first to collect contact info
      const bookingParams = new URLSearchParams({
        propertyId,
        checkIn: selectedCheckIn.toISOString(),
        checkOut: selectedCheckOut.toISOString(),
        guests: guestCount.toString(),
        ...(appliedDiscount && { 
          discountCode: appliedDiscount.discountCode 
        })
      });

      navigate(`/booking/checkout?${bookingParams.toString()}`);
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
