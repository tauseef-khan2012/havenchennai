
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RateLimitService, DEFAULT_RATE_LIMITS } from '@/services/security/rateLimitService';
import { AuditService, SecurityEventType } from '@/services/security/auditService';
import { InputValidator } from '@/services/security/inputValidation';
import { useToast } from '@/hooks/use-toast';

/**
 * Security hook for rate limiting, audit logging, and input validation
 */
export const useSecurity = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  /**
   * Check rate limit before performing an action
   */
  const checkRateLimit = useCallback(async (
    identifier: string,
    actionType: keyof typeof DEFAULT_RATE_LIMITS
  ): Promise<boolean> => {
    try {
      const result = await RateLimitService.checkRateLimit(identifier, actionType);
      
      if (!result.allowed) {
        const resetTime = result.resetTime ? new Date(result.resetTime).toLocaleTimeString() : 'later';
        
        toast({
          title: 'Rate limit exceeded',
          description: `Too many attempts. Please try again at ${resetTime}.`,
          variant: 'destructive'
        });

        // Log rate limit violation
        await AuditService.logRateLimitEvent(identifier, actionType, {
          remainingAttempts: result.remainingAttempts,
          resetTime: result.resetTime
        });
      }

      return result.allowed;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // Fail open - allow action if rate limit check fails
      return true;
    }
  }, [toast]);

  /**
   * Log security events
   */
  const logSecurityEvent = useCallback(async (
    eventType: SecurityEventType,
    details?: Record<string, any>
  ) => {
    await AuditService.logSecurityEvent({
      userId: user?.id,
      actionType: eventType,
      details
    });
  }, [user?.id]);

  /**
   * Validate input data
   */
  const validateInput = useCallback((
    type: 'email' | 'phone' | 'name' | 'amount' | 'guestCount',
    value: any,
    fieldName?: string
  ) => {
    switch (type) {
      case 'email':
        return InputValidator.validateEmail(value);
      case 'phone':
        return InputValidator.validatePhone(value);
      case 'name':
        return InputValidator.validateName(value, fieldName);
      case 'amount':
        return InputValidator.validateAmount(value);
      case 'guestCount':
        return InputValidator.validateGuestCount(value);
      default:
        return { isValid: false, error: 'Unknown validation type' };
    }
  }, []);

  /**
   * Sanitize text input
   */
  const sanitizeText = useCallback((input: string, maxLength?: number) => {
    return InputValidator.sanitizeText(input, maxLength);
  }, []);

  return {
    checkRateLimit,
    logSecurityEvent,
    validateInput,
    sanitizeText
  };
};
