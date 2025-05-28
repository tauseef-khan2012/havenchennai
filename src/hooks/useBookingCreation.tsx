
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UUID, 
  BookingType,
  GuestInfo
} from '@/types/booking';
import { createBooking } from '@/services/bookingService';
import { checkPropertyAvailability } from '@/services/availabilityService';
import { calculateEnhancedPropertyBookingPrice } from '@/services/enhancedPriceService';

/**
 * Enhanced hook for creating bookings with comprehensive validation
 */
export const useBookingCreation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  /**
   * Create a booking with comprehensive validation and error handling
   */
  const makeBooking = useCallback(async (
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
      selectedAddonExperiences?: {instanceId: UUID, attendees: number}[];
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
      // Validate input parameters based on booking type
      if (type === 'property' && (!details.propertyId || !details.checkInDate || !details.checkOutDate)) {
        throw new Error('Missing required property booking details');
      } else if (type === 'experience' && (!details.instanceId || !details.numberOfAttendees)) {
        throw new Error('Missing required experience booking details');
      }

      // Check availability for property bookings
      if (type === 'property' && details.propertyId && details.checkInDate && details.checkOutDate) {
        const isAvailable = await checkPropertyAvailability(
          details.propertyId,
          details.checkInDate,
          details.checkOutDate
        );
        
        if (!isAvailable) {
          toast({
            title: 'Property Unavailable',
            description: 'The property is not available for the selected dates.',
            variant: 'destructive'
          });
          return null;
        }
      }
      
      // Calculate pricing for property bookings
      let priceBreakdown;
      if (type === 'property' && details.propertyId && details.checkInDate && details.checkOutDate) {
        priceBreakdown = await calculateEnhancedPropertyBookingPrice(
          details.propertyId,
          details.checkInDate,
          details.checkOutDate,
          details.selectedAddonExperiences
        );
      } else {
        // For now, use a simplified price structure for experiences
        priceBreakdown = {
          basePrice: 1000,
          discountAmount: 0,
          subtotalAfterDiscount: 1000,
          taxPercentage: 18,
          taxAmount: 180,
          totalAmountDue: 1180,
          currency: 'INR'
        };
      }
      
      if (!priceBreakdown) {
        throw new Error('Failed to calculate price');
      }
      
      // Prepare booking data
      const bookingData: Parameters<typeof createBooking>[0] = {
        type,
        userId: user.id,
        priceBreakdown,
        guests: details.guests,
        selectedAddonExperiences: details.selectedAddonExperiences
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
        title: 'Booking created successfully',
        description: `Your booking reference is ${bookingResult.bookingReference}.`,
      });
      
      return bookingResult;
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: 'Booking creation failed',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  return {
    isLoading,
    makeBooking
  };
};
