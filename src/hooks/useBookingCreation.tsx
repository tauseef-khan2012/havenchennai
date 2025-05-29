
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UUID, 
  BookingType,
  GuestInfo
} from '@/types/booking';
import { createBooking, createGuestBooking } from '@/services/bookingService';
import { checkPropertyAvailability } from '@/services/availabilityService';
import { calculateEnhancedPropertyBookingPrice } from '@/services/enhancedPriceService';

/**
 * Enhanced hook for creating bookings with comprehensive validation
 * Now supports both authenticated users and guest bookings
 */
export const useBookingCreation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  /**
   * Create a booking with comprehensive validation and error handling
   * Works for both authenticated users and guests
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
      // Guest information (required when user is not authenticated)
      guestName?: string;
      guestEmail?: string;
      guestPhone?: string;
    }
  ): Promise<{ bookingId: UUID, bookingReference: string } | null> => {
    setIsLoading(true);
    
    try {
      // Validate input parameters based on booking type
      if (type === 'property' && (!details.propertyId || !details.checkInDate || !details.checkOutDate)) {
        throw new Error('Missing required property booking details');
      } else if (type === 'experience' && (!details.instanceId || !details.numberOfAttendees)) {
        throw new Error('Missing required experience booking details');
      }

      // For guest bookings, validate contact information
      if (!user && (!details.guestName || !details.guestEmail || !details.guestPhone)) {
        throw new Error('Contact information is required for guest bookings');
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
      
      let bookingResult;
      
      if (user) {
        // User is authenticated - create regular booking
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
        
        bookingResult = await createBooking(bookingData);
      } else {
        // Guest booking - no authentication required
        const guestBookingData = {
          type,
          guestName: details.guestName!,
          guestEmail: details.guestEmail!,
          guestPhone: details.guestPhone!,
          priceBreakdown,
          propertyId: details.propertyId,
          checkInDate: details.checkInDate,
          checkOutDate: details.checkOutDate,
          numberOfGuests: details.numberOfGuests,
          specialRequests: details.specialRequests,
          instanceId: details.instanceId,
          numberOfAttendees: details.numberOfAttendees
        };
        
        bookingResult = await createGuestBooking(guestBookingData);
      }
      
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
