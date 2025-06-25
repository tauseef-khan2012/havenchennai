
import { supabase } from '@/integrations/supabase/client';
import { DatabaseAuditService } from './databaseAuditService';
import { DatabaseRateLimitService } from './databaseRateLimitService';
import { EnhancedInputValidator } from './enhancedInputValidation';
import { UUID } from '@/types/booking';

/**
 * Enhanced secure booking service with comprehensive validation and security
 */
export class SecureBookingService {
  /**
   * Validate booking ownership with comprehensive security checks
   */
  static async validateBookingOwnership(
    bookingId: UUID,
    bookingType: 'property' | 'experience',
    userContext: {
      userId?: UUID;
      guestEmail?: string;
    }
  ): Promise<{
    isValid: boolean;
    error?: string;
    bookingData?: any;
  }> {
    try {
      // Rate limit booking access attempts
      const identifier = userContext.userId || userContext.guestEmail || 'anonymous';
      const rateLimitCheck = await DatabaseRateLimitService.checkRateLimit(
        identifier,
        'BOOKING_ACCESS'
      );

      if (!rateLimitCheck.allowed) {
        await DatabaseAuditService.logBookingAccessEvent(
          bookingId,
          false,
          userContext.userId,
          userContext.guestEmail,
          { reason: 'rate_limit_exceeded', remainingAttempts: rateLimitCheck.remainingAttempts }
        );
        
        return {
          isValid: false,
          error: 'Too many booking access attempts. Please try again later.'
        };
      }

      // Validate booking ID format
      const bookingIdValidation = EnhancedInputValidator.validateBookingReference(bookingId);
      if (!bookingIdValidation.isValid) {
        await DatabaseAuditService.logBookingAccessEvent(
          bookingId,
          false,
          userContext.userId,
          userContext.guestEmail,
          { reason: 'invalid_booking_id' }
        );
        
        return {
          isValid: false,
          error: 'Invalid booking ID format'
        };
      }

      // Use database function for secure validation
      const { data: ownershipValid, error: functionError } = await supabase
        .rpc('validate_booking_ownership', {
          booking_id_param: bookingId,
          booking_type_param: bookingType,
          user_id_param: userContext.userId,
          guest_email_param: userContext.guestEmail
        });

      if (functionError) {
        console.error('Booking ownership validation error:', functionError);
        await DatabaseAuditService.logBookingAccessEvent(
          bookingId,
          false,
          userContext.userId,
          userContext.guestEmail,
          { reason: 'validation_error', error: functionError.message }
        );
        
        return {
          isValid: false,
          error: 'Unable to validate booking access'
        };
      }

      if (!ownershipValid) {
        await DatabaseAuditService.logBookingAccessEvent(
          bookingId,
          false,
          userContext.userId,
          userContext.guestEmail,
          { reason: 'ownership_denied' }
        );
        
        return {
          isValid: false,
          error: 'Access denied. This booking does not belong to you.'
        };
      }

      // Fetch booking data if validation passes
      let bookingData;
      if (bookingType === 'property') {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', bookingId)
          .single();

        if (error || !data) {
          await DatabaseAuditService.logBookingAccessEvent(
            bookingId,
            false,
            userContext.userId,
            userContext.guestEmail,
            { reason: 'booking_not_found' }
          );
          
          return {
            isValid: false,
            error: 'Booking not found'
          };
        }

        bookingData = data;
      } else {
        const { data, error } = await supabase
          .from('experience_bookings')
          .select('*')
          .eq('id', bookingId)
          .single();

        if (error || !data) {
          await DatabaseAuditService.logBookingAccessEvent(
            bookingId,
            false,
            userContext.userId,
            userContext.guestEmail,
            { reason: 'booking_not_found' }
          );
          
          return {
            isValid: false,
            error: 'Booking not found'
          };
        }

        bookingData = data;
      }

      // Log successful access
      await DatabaseAuditService.logBookingAccessEvent(
        bookingId,
        true,
        userContext.userId,
        userContext.guestEmail,
        { bookingType, accessMethod: userContext.userId ? 'authenticated' : 'guest' }
      );

      return {
        isValid: true,
        bookingData
      };
    } catch (error) {
      console.error('Secure booking validation error:', error);
      
      await DatabaseAuditService.logBookingAccessEvent(
        bookingId,
        false,
        userContext.userId,
        userContext.guestEmail,
        { reason: 'system_error', error: error instanceof Error ? error.message : 'Unknown error' }
      );

      return {
        isValid: false,
        error: 'System error during booking validation'
      };
    }
  }

  /**
   * Validate guest booking access with enhanced security
   */
  static async validateGuestAccess(
    email: string,
    bookingId: UUID,
    bookingType: 'property' | 'experience' = 'property'
  ): Promise<{
    isValid: boolean;
    error?: string;
    bookingData?: any;
  }> {
    try {
      // Validate email format
      const emailValidation = EnhancedInputValidator.validateEmail(email);
      if (!emailValidation.isValid) {
        return {
          isValid: false,
          error: emailValidation.error
        };
      }

      // Use the comprehensive validation method
      return await this.validateBookingOwnership(
        bookingId,
        bookingType,
        { guestEmail: emailValidation.sanitized }
      );
    } catch (error) {
      console.error('Guest access validation error:', error);
      return {
        isValid: false,
        error: 'Unable to validate guest access'
      };
    }
  }

  /**
   * Secure booking data retrieval with access control
   */
  static async getSecureBookingData(
    bookingId: UUID,
    bookingType: 'property' | 'experience',
    userContext: {
      userId?: UUID;
      guestEmail?: string;
    }
  ): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    const validation = await this.validateBookingOwnership(
      bookingId,
      bookingType,
      userContext
    );

    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      };
    }

    return {
      success: true,
      data: validation.bookingData
    };
  }
}
