
import { z } from 'zod';
import { contactValidationSchema } from '@/components/booking/validation/ContactValidation';
// Updated import path for GuestBookingData
import { GuestBookingData } from '@/services/booking/data/createGuestBooking'; 

/**
 * Enhanced validation for guest booking data with security checks
 */
export const validateGuestBookingData = (bookingData: GuestBookingData): void => {
  const errors: string[] = [];

  // Validate contact information using Zod schema
  try {
    // Extract contact fields for Zod validation
    const contactFields = {
      guestName: bookingData.guestName,
      guestEmail: bookingData.guestEmail,
      guestPhone: bookingData.guestPhone,
      specialRequests: bookingData.specialRequests || undefined, // Zod schema handles optional
    };
    contactValidationSchema.parse(contactFields);
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => errors.push(err.message));
    } else {
      errors.push('Contact information validation failed.');
    }
  }
  
  // Type-specific validation with enhanced security (remains largely the same)
  if (bookingData.type === 'property') {
    if (!bookingData.propertyId) {
      errors.push('Property ID is required for property bookings');
    }
    if (!bookingData.checkInDate) {
      errors.push('Check-in date is required for property bookings');
    }
    if (!bookingData.checkOutDate) {
      errors.push('Check-out date is required for property bookings');
    }
    if (bookingData.checkInDate && bookingData.checkOutDate) {
      if (bookingData.checkInDate >= bookingData.checkOutDate) {
        errors.push('Check-out date must be after check-in date');
      }
      const maxAdvanceDate = new Date();
      maxAdvanceDate.setFullYear(maxAdvanceDate.getFullYear() + 2);
      if (bookingData.checkInDate > maxAdvanceDate) {
        errors.push('Bookings cannot be made more than 2 years in advance');
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (bookingData.checkInDate < today) {
        errors.push('Cannot book dates in the past');
      }
    }
    if (!bookingData.numberOfGuests || bookingData.numberOfGuests < 1) {
      errors.push('Number of guests must be at least 1');
    } else if (bookingData.numberOfGuests > 20) {
      errors.push('Number of guests cannot exceed 20');
    }
  } else if (bookingData.type === 'experience') {
    if (!bookingData.instanceId) {
      errors.push('Experience instance ID is required for experience bookings');
    }
    if (!bookingData.numberOfAttendees || bookingData.numberOfAttendees < 1) {
      errors.push('Number of attendees must be at least 1');
    } else if (bookingData.numberOfAttendees > 50) {
      errors.push('Number of attendees cannot exceed 50');
    }
  }

  // Enhanced price validation (remains the same)
  if (!bookingData.priceBreakdown) {
    errors.push('Price breakdown is required');
  } else {
    if (bookingData.priceBreakdown.totalAmountDue <= 0) {
      errors.push('Total amount must be greater than 0');
    } else if (bookingData.priceBreakdown.totalAmountDue > 500000) {
      errors.push('Total amount cannot exceed ₹5,00,000');
    }
    if (!['INR', 'USD'].includes(bookingData.priceBreakdown.currency)) {
      errors.push('Invalid currency. Only INR and USD are supported.');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }
};

