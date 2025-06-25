
import { EnhancedInputValidator } from '@/services/security/enhancedInputValidation';
import { DatabaseAuditService } from '@/services/security/databaseAuditService';
import { DatabaseRateLimitService } from '@/services/security/databaseRateLimitService';
import { GuestBookingData } from '@/services/booking/data/createGuestBooking';

/**
 * Enhanced guest booking service with comprehensive security and database-backed validation
 */
export class EnhancedGuestBookingService {
  /**
   * Create a guest booking with enhanced security checks and database-backed rate limiting
   */
  static async createSecureGuestBooking(bookingData: GuestBookingData): Promise<{
    success: boolean;
    bookingId?: string;
    bookingReference?: string;
    error?: string;
  }> {
    try {
      // Enhanced input validation
      const emailValidation = EnhancedInputValidator.validateEmail(bookingData.guestEmail);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error);
      }

      const nameValidation = EnhancedInputValidator.validateName(bookingData.guestName, 'Guest name');
      if (!nameValidation.isValid) {
        throw new Error(nameValidation.error);
      }

      const phoneValidation = EnhancedInputValidator.validatePhone(bookingData.guestPhone);
      if (!phoneValidation.isValid) {
        throw new Error(phoneValidation.error);
      }

      // Enhanced rate limiting with database backing
      const rateLimitCheck = await DatabaseRateLimitService.checkRateLimit(
        emailValidation.sanitized, 
        'GUEST_BOOKING'
      );
      
      if (!rateLimitCheck.allowed) {
        const resetTime = rateLimitCheck.resetTime ? 
          ` Try again after ${rateLimitCheck.resetTime.toLocaleTimeString()}.` : 
          ' Please try again later.';
          
        throw new Error(`Rate limit exceeded. Maximum 3 bookings per hour per email address.${resetTime}`);
      }

      // Validate booking dates if provided
      if (bookingData.checkInDate && bookingData.checkOutDate) {
        const dateValidation = EnhancedInputValidator.validateBookingDates(
          bookingData.checkInDate, 
          bookingData.checkOutDate
        );
        if (!dateValidation.isValid) {
          throw new Error(dateValidation.error);
        }
      }

      // Validate guest count if provided
      if (bookingData.numberOfGuests) {
        const guestValidation = EnhancedInputValidator.validateGuestCount(bookingData.numberOfGuests);
        if (!guestValidation.isValid) {
          throw new Error(guestValidation.error);
        }
      }

      // Validate attendee count for experiences
      if (bookingData.numberOfAttendees) {
        const attendeeValidation = EnhancedInputValidator.validateGuestCount(bookingData.numberOfAttendees);
        if (!attendeeValidation.isValid) {
          throw new Error(attendeeValidation.error);
        }
      }

      // Validate price breakdown
      if (bookingData.priceBreakdown) {
        const amountValidation = EnhancedInputValidator.validateAmount(bookingData.priceBreakdown.totalAmountDue);
        if (!amountValidation.isValid) {
          throw new Error(amountValidation.error);
        }
      }

      // Sanitize all text inputs with enhanced security
      const sanitizedData = {
        ...bookingData,
        guestEmail: emailValidation.sanitized,
        guestName: nameValidation.sanitized,
        guestPhone: phoneValidation.sanitized,
        specialRequests: bookingData.specialRequests ? 
          EnhancedInputValidator.sanitizeText(bookingData.specialRequests, 500) : undefined
      };

      // Create the booking through existing service
      const { createGuestBooking } = await import('@/services/booking/data/createGuestBooking');
      const result = await createGuestBooking(sanitizedData);

      // Enhanced audit logging
      await DatabaseAuditService.logBookingEvent('BOOKING_CREATED', result.id, undefined, {
        bookingType: sanitizedData.type,
        guestEmail: sanitizedData.guestEmail,
        securityEnhanced: true,
        rateLimitCheck: true,
        inputValidation: true,
        priceValidation: bookingData.priceBreakdown ? true : false,
        userAgent: navigator.userAgent
      });

      return {
        success: true,
        bookingId: result.id,
        bookingReference: result.bookingReference
      };
    } catch (error) {
      console.error('Enhanced guest booking creation failed:', error);
      
      // Enhanced error logging
      await DatabaseAuditService.logSecurityEvent({
        actionType: 'BOOKING_CREATED',
        resourceType: 'guest_booking_failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          attemptedEmail: bookingData.guestEmail ? bookingData.guestEmail.substring(0, 3) + '***' : 'unknown',
          bookingType: bookingData.type,
          securityEnhanced: true,
          userAgent: navigator.userAgent
        },
        severity: 'warning'
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Booking creation failed'
      };
    }
  }

  /**
   * Validate guest booking access with enhanced security and database validation
   */
  static async validateGuestAccess(email: string, bookingId: string): Promise<boolean> {
    try {
      const emailValidation = EnhancedInputValidator.validateEmail(email);
      if (!emailValidation.isValid) {
        await DatabaseAuditService.logSecurityEvent({
          actionType: 'UNAUTHORIZED_ACCESS_ATTEMPT',
          resourceType: 'guest_booking_access',
          resourceId: bookingId,
          details: {
            reason: 'invalid_email_format',
            attemptedEmail: email.substring(0, 3) + '***',
            userAgent: navigator.userAgent
          },
          severity: 'warning'
        });
        return false;
      }

      // Rate limit access attempts
      const rateLimitCheck = await DatabaseRateLimitService.checkRateLimit(
        emailValidation.sanitized,
        'BOOKING_ACCESS'
      );

      if (!rateLimitCheck.allowed) {
        await DatabaseAuditService.logRateLimitEvent(
          emailValidation.sanitized,
          'BOOKING_ACCESS',
          {
            bookingId,
            remainingAttempts: rateLimitCheck.remainingAttempts,
            resetTime: rateLimitCheck.resetTime
          }
        );
        return false;
      }

      // Use the secure booking service for validation
      const { SecureBookingService } = await import('@/services/security/secureBookingService');
      const validationResult = await SecureBookingService.validateGuestAccess(
        emailValidation.sanitized,
        bookingId as any, // Type assertion for UUID
        'property' // Default to property, could be enhanced to detect type
      );

      return validationResult.isValid;
    } catch (error) {
      console.error('Guest access validation failed:', error);
      
      await DatabaseAuditService.logSecurityEvent({
        actionType: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        resourceType: 'guest_booking_access',
        resourceId: bookingId,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          attemptedEmail: email.substring(0, 3) + '***',
          userAgent: navigator.userAgent
        },
        severity: 'critical'
      });
      
      return false;
    }
  }
}
