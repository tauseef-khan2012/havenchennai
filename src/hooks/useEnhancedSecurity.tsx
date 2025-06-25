
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DatabaseRateLimitService, 
  ENHANCED_RATE_LIMITS,
  DatabaseAuditService,
  EnhancedInputValidator,
  SecureBookingService
} from '@/services/security/enhancedSecurityIndex';
import type { SecurityEventType, ValidationResult, AmountValidationResult } from '@/services/security/enhancedSecurityIndex';
import { useToast } from '@/hooks/use-toast';
import { UUID } from '@/types/booking';

/**
 * Enhanced security hook with comprehensive security features
 */
export const useEnhancedSecurity = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  /**
   * Enhanced rate limit checking with better error handling
   */
  const checkRateLimit = useCallback(async (
    identifier: string,
    actionType: keyof typeof ENHANCED_RATE_LIMITS
  ): Promise<boolean> => {
    try {
      const result = await DatabaseRateLimitService.checkRateLimit(identifier, actionType);
      
      if (!result.allowed) {
        const resetTime = result.resetTime ? new Date(result.resetTime).toLocaleTimeString() : 'later';
        
        toast({
          title: 'Rate limit exceeded',
          description: `Too many attempts. Please try again at ${resetTime}.`,
          variant: 'destructive'
        });

        // Log rate limit violation with enhanced details
        await DatabaseAuditService.logRateLimitEvent(identifier, actionType, {
          remainingAttempts: result.remainingAttempts,
          resetTime: result.resetTime,
          userAgent: navigator.userAgent
        });
      }

      return result.allowed;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // Log the error but fail open for availability
      await DatabaseAuditService.logSecurityEvent({
        userId: user?.id,
        actionType: 'SUSPICIOUS_ACTIVITY',
        resourceType: 'rate_limit_error',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          actionType,
          identifier: identifier.substring(0, 10) + '***'
        },
        severity: 'warning'
      });
      return true;
    }
  }, [toast, user?.id]);

  /**
   * Enhanced security event logging
   */
  const logSecurityEvent = useCallback(async (
    eventType: SecurityEventType,
    details?: Record<string, any>
  ) => {
    await DatabaseAuditService.logSecurityEvent({
      userId: user?.id,
      actionType: eventType,
      details: {
        ...details,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    });
  }, [user?.id]);

  /**
   * Enhanced input validation with comprehensive checks
   */
  const validateInput = useCallback((
    type: 'email' | 'phone' | 'name' | 'amount' | 'guestCount' | 'bookingReference',
    value: any,
    fieldName?: string
  ): ValidationResult | AmountValidationResult => {
    switch (type) {
      case 'email':
        return EnhancedInputValidator.validateEmail(value);
      case 'phone':
        return EnhancedInputValidator.validatePhone(value);
      case 'name':
        return EnhancedInputValidator.validateName(value, fieldName);
      case 'amount':
        return EnhancedInputValidator.validateAmount(value);
      case 'guestCount':
        return EnhancedInputValidator.validateGuestCount(value);
      case 'bookingReference':
        return EnhancedInputValidator.validateBookingReference(value);
      default:
        return { isValid: false, error: 'Unknown validation type' };
    }
  }, []);

  /**
   * Enhanced text sanitization
   */
  const sanitizeText = useCallback((input: string, maxLength?: number) => {
    return EnhancedInputValidator.sanitizeText(input, maxLength);
  }, []);

  /**
   * Validate booking dates with business rules
   */
  const validateBookingDates = useCallback((checkIn: Date, checkOut: Date) => {
    return EnhancedInputValidator.validateBookingDates(checkIn, checkOut);
  }, []);

  /**
   * Secure booking access validation
   */
  const validateBookingAccess = useCallback(async (
    bookingId: UUID,
    bookingType: 'property' | 'experience',
    guestEmail?: string
  ): Promise<{
    isValid: boolean;
    error?: string;
    bookingData?: any;
  }> => {
    return await SecureBookingService.validateBookingOwnership(
      bookingId,
      bookingType,
      {
        userId: user?.id,
        guestEmail
      }
    );
  }, [user?.id]);

  /**
   * Enhanced guest access validation
   */
  const validateGuestAccess = useCallback(async (
    email: string,
    bookingId: UUID,
    bookingType: 'property' | 'experience' = 'property'
  ) => {
    return await SecureBookingService.validateGuestAccess(email, bookingId, bookingType);
  }, []);

  /**
   * Get rate limit status
   */
  const getRateLimitStatus = useCallback(async (
    identifier: string,
    actionType: keyof typeof ENHANCED_RATE_LIMITS
  ) => {
    return await DatabaseRateLimitService.getRateLimitStatus(identifier, actionType);
  }, []);

  /**
   * Reset rate limit (admin function)
   */
  const resetRateLimit = useCallback(async (
    identifier: string,
    actionType: keyof typeof ENHANCED_RATE_LIMITS
  ) => {
    return await DatabaseRateLimitService.resetRateLimit(identifier, actionType);
  }, []);

  return {
    // Core security functions
    checkRateLimit,
    logSecurityEvent,
    
    // Input validation
    validateInput,
    sanitizeText,
    validateBookingDates,
    
    // Booking security
    validateBookingAccess,
    validateGuestAccess,
    
    // Rate limiting utilities
    getRateLimitStatus,
    resetRateLimit
  };
};
