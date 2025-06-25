
import { supabase } from '@/integrations/supabase/client';
import { RateLimitService } from '@/services/security/rateLimitService';
import { AuditService } from '@/services/security/auditService';
import { InputValidator } from '@/services/security/inputValidation';
import { GuestBookingData } from '@/services/booking/data/createGuestBooking';

/**
 * Enhanced guest booking service with comprehensive security
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

      // Check rate limiting
      const rateLimitCheck = await RateLimitService.checkRateLimit(
        emailValidation.sanitized,
        'GUEST_BOOKING'
      );

      if (!rateLimitCheck.allowed) {
        await AuditService.logRateLimitEvent(emailValidation.sanitized, 'GUEST_BOOKING', {
          attemptedBookingType: bookingData.type,
          remainingAttempts: rateLimitCheck.remainingAttempts
        });
        
        throw new Error('Rate limit exceeded. Please try again later.');
      }

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
      await AuditService.logBookingEvent('BOOKING_CREATED', result.bookingId, undefined, {
        bookingType: sanitizedData.type,
        guestEmail: sanitizedData.guestEmail,
        securityEnhanced: true
      });

      return {
        success: true,
        bookingId: result.bookingId,
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

      // Use the database function for secure validation
      const { data, error } = await supabase.rpc('validate_guest_booking_access', {
        guest_email: emailValidation.sanitized,
        booking_id: bookingId
      });

      if (error) {
        console.error('Guest access validation error:', error);
        return false;
      }

      // Log access attempt
      await AuditService.logSecurityEvent({
        actionType: 'DATA_ACCESS',
        resourceType: 'guest_booking',
        resourceId: bookingId,
        details: {
          accessEmail: emailValidation.sanitized,
          accessGranted: data
        },
        severity: data ? 'info' : 'warning'
      });

      return data;
    } catch (error) {
      console.error('Guest access validation failed:', error);
      return false;
    }
  }
}
