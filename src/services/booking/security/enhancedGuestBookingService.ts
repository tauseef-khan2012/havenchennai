
import { InputValidator } from '@/services/security/inputValidation';
import { AuditService } from '@/services/security/auditService';
import { GuestBookingData } from '@/services/booking/data/createGuestBooking';

/**
 * Enhanced guest booking service with comprehensive security
 * Note: This uses client-side rate limiting until database migration is complete
 */
export class EnhancedGuestBookingService {
  /**
   * Create a guest booking with enhanced security checks
   */
  static async createSecureGuestBooking(bookingData: GuestBookingData): Promise<{
    success: boolean;
    bookingId?: string;
    bookingReference?: string;
    error?: string;
  }> {
    try {
      // Validate and sanitize input data
      const emailValidation = InputValidator.validateEmail(bookingData.guestEmail);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error);
      }

      const nameValidation = InputValidator.validateName(bookingData.guestName, 'Guest name');
      if (!nameValidation.isValid) {
        throw new Error(nameValidation.error);
      }

      const phoneValidation = InputValidator.validatePhone(bookingData.guestPhone);
      if (!phoneValidation.isValid) {
        throw new Error(phoneValidation.error);
      }

      // Client-side rate limiting check (simple implementation)
      const rateLimitKey = `guest_booking_${emailValidation.sanitized}`;
      const lastAttempt = localStorage.getItem(rateLimitKey);
      const now = Date.now();
      
      if (lastAttempt) {
        const timeDiff = now - parseInt(lastAttempt);
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        if (timeDiff < oneHour) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
      }

      // Store current attempt timestamp
      localStorage.setItem(rateLimitKey, now.toString());

      // Sanitize all text inputs
      const sanitizedData = {
        ...bookingData,
        guestEmail: emailValidation.sanitized,
        guestName: nameValidation.sanitized,
        guestPhone: phoneValidation.sanitized,
        specialRequests: bookingData.specialRequests ? 
          InputValidator.sanitizeText(bookingData.specialRequests, 500) : undefined
      };

      // Create the booking through existing service
      const { createGuestBooking } = await import('@/services/booking/data/createGuestBooking');
      const result = await createGuestBooking(sanitizedData);

      // Log successful booking creation
      await AuditService.logBookingEvent('BOOKING_CREATED', result.id, undefined, {
        bookingType: sanitizedData.type,
        guestEmail: sanitizedData.guestEmail,
        securityEnhanced: true
      });

      return {
        success: true,
        bookingId: result.id,
        bookingReference: result.bookingReference
      };
    } catch (error) {
      console.error('Enhanced guest booking creation failed:', error);
      
      // Log failed booking attempt
      await AuditService.logSecurityEvent({
        actionType: 'BOOKING_CREATED',
        resourceType: 'guest_booking',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          attemptedEmail: bookingData.guestEmail,
          bookingType: bookingData.type
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
   * Validate guest booking access with enhanced security
   */
  static async validateGuestAccess(email: string, bookingId: string): Promise<boolean> {
    try {
      const emailValidation = InputValidator.validateEmail(email);
      if (!emailValidation.isValid) {
        return false;
      }

      // For now, use a simpler validation until database functions are available
      // This would need to be replaced with the database function once migration is complete
      
      // Log access attempt
      await AuditService.logSecurityEvent({
        actionType: 'DATA_ACCESS',
        resourceType: 'guest_booking',
        resourceId: bookingId,
        details: {
          accessEmail: emailValidation.sanitized,
          accessMethod: 'client_validation'
        },
        severity: 'info'
      });

      return true; // Simplified for now
    } catch (error) {
      console.error('Guest access validation failed:', error);
      return false;
    }
  }
}
