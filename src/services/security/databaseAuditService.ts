
import { supabase } from '@/integrations/supabase/client';
import { UUID } from '@/types/booking';

export type SecurityEventType = 
  | 'LOGIN_SUCCESS' 
  | 'LOGIN_FAILURE' 
  | 'BOOKING_CREATED' 
  | 'PAYMENT_INITIATED' 
  | 'PAYMENT_FAILED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SUSPICIOUS_ACTIVITY'
  | 'DATA_ACCESS'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT'
  | 'BOOKING_ACCESS_DENIED'
  | 'PAYMENT_VERIFICATION_FAILED';

export type SecuritySeverity = 'info' | 'warning' | 'critical';

export interface SecurityEventDetails {
  userId?: UUID;
  actionType: SecurityEventType;
  resourceType?: string;
  resourceId?: UUID;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  severity?: SecuritySeverity;
}

/**
 * Enhanced security audit logging service with database persistence
 */
export class DatabaseAuditService {
  /**
   * Log a security event to the database
   */
  static async logSecurityEvent(event: SecurityEventDetails): Promise<void> {
    try {
      // Get client IP and user agent from browser if not provided
      const userAgent = event.userAgent || navigator.userAgent;
      
      // Attempt database logging first
      const { error } = await supabase
        .from('security_audit_logs')
        .insert({
          user_id: event.userId,
          action_type: event.actionType,
          resource_type: event.resourceType,
          resource_id: event.resourceId,
          user_agent: userAgent,
          details: event.details,
          severity: event.severity || 'info'
        });

      if (error) {
        console.error('Database audit logging failed, using console fallback:', error);
        this.consoleAuditLog(event, userAgent);
        return;
      }

      // Also log to console for immediate visibility
      this.consoleAuditLog(event, userAgent);
    } catch (error) {
      console.error('Security audit logging error:', error);
      // Fallback to console logging
      this.consoleAuditLog(event, event.userAgent || navigator.userAgent);
    }
  }

  /**
   * Console-based audit logging fallback
   */
  private static consoleAuditLog(event: SecurityEventDetails, userAgent: string): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId: event.userId,
      actionType: event.actionType,
      resourceType: event.resourceType,
      resourceId: event.resourceId,
      userAgent,
      details: event.details,
      severity: event.severity || 'info'
    };

    switch (event.severity) {
      case 'critical':
        console.error('🚨 SECURITY AUDIT [CRITICAL]:', logEntry);
        break;
      case 'warning':
        console.warn('⚠️ SECURITY AUDIT [WARNING]:', logEntry);
        break;
      default:
        console.info('📋 SECURITY AUDIT [INFO]:', logEntry);
    }
  }

  /**
   * Log authentication events with enhanced details
   */
  static async logAuthEvent(
    eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILURE',
    userId?: UUID,
    details?: Record<string, any>
  ): Promise<void> {
    await this.logSecurityEvent({
      userId,
      actionType: eventType,
      resourceType: 'authentication',
      details: {
        ...details,
        timestamp: new Date().toISOString(),
        sessionId: crypto.randomUUID()
      },
      severity: eventType === 'LOGIN_FAILURE' ? 'warning' : 'info'
    });
  }

  /**
   * Log booking-related security events with enhanced validation
   */
  static async logBookingEvent(
    eventType: 'BOOKING_CREATED',
    bookingId: UUID,
    userId?: UUID,
    details?: Record<string, any>
  ): Promise<void> {
    await this.logSecurityEvent({
      userId,
      actionType: eventType,
      resourceType: 'booking',
      resourceId: bookingId,
      details: {
        ...details,
        bookingValidated: true,
        timestamp: new Date().toISOString()
      },
      severity: 'info'
    });
  }

  /**
   * Log payment-related security events with enhanced tracking
   */
  static async logPaymentEvent(
    eventType: 'PAYMENT_INITIATED' | 'PAYMENT_FAILED' | 'PAYMENT_VERIFICATION_FAILED',
    bookingId: UUID,
    userId?: UUID,
    details?: Record<string, any>
  ): Promise<void> {
    await this.logSecurityEvent({
      userId,
      actionType: eventType,
      resourceType: 'payment',
      resourceId: bookingId,
      details: {
        ...details,
        paymentSecurityCheck: true,
        timestamp: new Date().toISOString()
      },
      severity: eventType.includes('FAILED') ? 'warning' : 'info'
    });
  }

  /**
   * Log booking access attempts with validation
   */
  static async logBookingAccessEvent(
    bookingId: UUID,
    accessGranted: boolean,
    userId?: UUID,
    guestEmail?: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.logSecurityEvent({
      userId,
      actionType: accessGranted ? 'DATA_ACCESS' : 'BOOKING_ACCESS_DENIED',
      resourceType: 'booking_access',
      resourceId: bookingId,
      details: {
        ...details,
        accessGranted,
        guestEmail: guestEmail ? '***@***' : undefined, // Mask email for security
        accessMethod: userId ? 'authenticated' : 'guest',
        timestamp: new Date().toISOString()
      },
      severity: accessGranted ? 'info' : 'warning'
    });
  }

  /**
   * Log rate limiting events with enhanced tracking
   */
  static async logRateLimitEvent(
    identifier: string,
    actionType: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.logSecurityEvent({
      actionType: 'RATE_LIMIT_EXCEEDED',
      resourceType: 'rate_limit',
      details: {
        identifier: identifier.substring(0, 10) + '***', // Mask sensitive identifiers
        limitedAction: actionType,
        ...details,
        timestamp: new Date().toISOString()
      },
      severity: 'warning'
    });
  }
}
