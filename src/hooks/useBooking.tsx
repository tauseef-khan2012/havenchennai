
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  checkPropertyAvailability,
  checkExperienceInstanceAvailability,
  calculateBookingPrice,
  createBooking
} from '@/services/bookingService';
import { initiatePayment, verifyPayment, handlePaymentFailure } from '@/services/paymentService';
import { 
  UUID, 
  BookingType, 
  PriceBreakdown, 
  PropertyBookingDetails,
  ExperienceBookingDetails,
  BookingData,
  GuestInfo
} from '@/types/booking';

export const useBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check availability for a property
  const checkAvailability = async (
    type: BookingType,
    details: {
      propertyId?: UUID;
      checkInDate?: Date;
      checkOutDate?: Date;
      instanceId?: UUID;
      numberOfAttendees?: number;
    }
  ): Promise<boolean> => {
    setIsLoading(true);
    setIsAvailable(null);
    
    try {
      let available = false;
      
      if (type === 'property' && details.propertyId && details.checkInDate && details.checkOutDate) {
        available = await checkPropertyAvailability(
          details.propertyId,
          details.checkInDate,
          details.checkOutDate
        );
      } else if (type === 'experience' && details.instanceId && details.numberOfAttendees) {
        available = await checkExperienceInstanceAvailability(
          details.instanceId,
          details.numberOfAttendees
        );
      } else {
        throw new Error('Invalid booking details');
      }
      
      setIsAvailable(available);
      
      if (!available) {
        toast({
          title: type === 'property' ? 'Property not available' : 'Experience not available',
          description: type === 'property' 
            ? 'The property is not available for the selected dates.' 
            : 'Not enough capacity for the selected experience.',
          variant: 'destructive'
        });
      }
      
      return available;
    } catch (error) {
      console.error('Error checking availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to check availability. Please try again.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate price for a booking
  const calculatePrice = async (
    type: BookingType,
    details: {
      propertyId?: UUID;
      checkInDate?: Date;
      checkOutDate?: Date;
      instanceId?: UUID;
      numberOfAttendees?: number;
    }
  ): Promise<PriceBreakdown | null> => {
    setIsLoading(true);
    
    try {
      const breakdown = await calculateBookingPrice({
        type,
        propertyId: details.propertyId,
        instanceId: details.instanceId,
        checkInDate: details.checkInDate,
        checkOutDate: details.checkOutDate,
        numberOfAttendees: details.numberOfAttendees
      });
      
      setPriceBreakdown(breakdown);
      return breakdown;
    } catch (error) {
      console.error('Error calculating price:', error);
      toast({
        title: 'Error',
        description: 'Failed to calculate price. Please try again.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a booking
  const makeBooking = async (
    type: BookingType,
    details: {
      propertyId?: UUID;
      checkInDate?: Date;
      checkOutDate?: Date;
      numberOfGuests?: number;
      specialRequests?: string;
      customerNotes?: string;
      instanceId?: UUID;
      numberOfAttendees?: number;
      guests?: GuestInfo[];
    }
  ): Promise<{ bookingId: UUID, bookingReference: string } | null> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to make a booking.',
        variant: 'destructive'
      });
      return null;
    }
    
    setIsLoading(true);
    
    try {
      // Check availability first
      let isAvailable = false;
      
      if (type === 'property' && details.propertyId && details.checkInDate && details.checkOutDate) {
        isAvailable = await checkPropertyAvailability(
          details.propertyId,
          details.checkInDate,
          details.checkOutDate
        );
      } else if (type === 'experience' && details.instanceId && details.numberOfAttendees) {
        isAvailable = await checkExperienceInstanceAvailability(
          details.instanceId,
          details.numberOfAttendees
        );
      } else {
        throw new Error('Invalid booking details');
      }
      
      if (!isAvailable) {
        toast({
          title: type === 'property' ? 'Property not available' : 'Experience not available',
          description: type === 'property' 
            ? 'The property is not available for the selected dates.' 
            : 'Not enough capacity for the selected experience.',
          variant: 'destructive'
        });
        return null;
      }
      
      // Calculate price
      const breakdown = await calculateBookingPrice({
        type,
        propertyId: details.propertyId,
        instanceId: details.instanceId,
        checkInDate: details.checkInDate,
        checkOutDate: details.checkOutDate,
        numberOfAttendees: details.numberOfAttendees
      });
      
      // Prepare booking data
      const bookingData: BookingData = {
        type,
        userId: user.id,
        priceBreakdown: breakdown,
        guests: details.guests
      };
      
      if (type === 'property' && details.propertyId && details.checkInDate && details.checkOutDate && details.numberOfGuests) {
        bookingData.property = {
          propertyId: details.propertyId,
          checkInDate: details.checkInDate,
          checkOutDate: details.checkOutDate,
          numberOfGuests: details.numberOfGuests,
          specialRequests: details.specialRequests,
          customerNotes: details.customerNotes
        };
      } else if (type === 'experience' && details.instanceId && details.numberOfAttendees) {
        bookingData.experience = {
          instanceId: details.instanceId,
          numberOfAttendees: details.numberOfAttendees,
          specialRequests: details.specialRequests
        };
      }
      
      // Create booking
      const bookingResult = await createBooking(bookingData);
      
      toast({
        title: 'Booking created',
        description: `Your booking reference is ${bookingResult.bookingReference}.`,
      });
      
      return bookingResult;
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to create booking. Please try again.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Process payment for a booking
  const processPayment = async (
    bookingId: UUID,
    bookingType: BookingType,
    amount: number,
    currency: string,
    bookingReference: string
  ): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to process payment.',
        variant: 'destructive'
      });
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Initiate payment with Razorpay
      const { orderId, razorpayKey } = await initiatePayment({
        bookingId,
        bookingType,
        amount,
        currency,
        userEmail: user.email || '',
        userName: user.user_metadata?.full_name || 'Guest',
        bookingReference
      });
      
      // Open Razorpay payment UI
      const options = {
        key: razorpayKey,
        amount: amount * 100, // In paise
        currency,
        name: 'Haven',
        description: `Booking ${bookingReference}`,
        order_id: orderId,
        prefill: {
          name: user.user_metadata?.full_name || 'Guest',
          email: user.email || '',
          contact: user.user_metadata?.phone_number || ''
        },
        notes: {
          bookingId,
          bookingType,
          bookingReference
        },
        theme: {
          color: '#2D4F3C' // Haven green
        }
      };
      
      // This part would use the Razorpay JS SDK
      // For now, we'll mock a successful payment
      const paymentSuccess = true;
      
      if (paymentSuccess) {
        // Verify and record payment (in real implementation, this would come from Razorpay callback)
        await verifyPayment({
          razorpayPaymentId: 'pay_' + Math.random().toString(36).substring(7),
          razorpayOrderId: orderId,
          razorpaySignature: 'sig_' + Math.random().toString(36).substring(7),
          bookingId,
          bookingType
        });
        
        toast({
          title: 'Payment successful',
          description: 'Your booking has been confirmed.',
        });
        
        return true;
      } else {
        // Handle payment failure
        await handlePaymentFailure({
          razorpayOrderId: orderId,
          errorCode: 'PAYMENT_FAILED',
          errorDescription: 'Payment was not completed',
          bookingId,
          bookingType
        });
        
        toast({
          title: 'Payment failed',
          description: 'Your payment could not be processed. Please try again.',
          variant: 'destructive'
        });
        
        return false;
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    priceBreakdown,
    isAvailable,
    checkAvailability,
    calculatePrice,
    makeBooking,
    processPayment
  };
};
