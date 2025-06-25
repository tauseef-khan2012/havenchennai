
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
  | 'UNAUTHORIZED_ACCESS_ATTEMPT';

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
 * Security audit logging service
 */
export class AuditService {
  /**
   * Log a security event for audit purposes
   */
  static async logSecurityEvent(event: SecurityEventDetails): Promise<void> {
    try {
      // Get client IP and user agent from browser if not provided
      const userAgent = event.userAgent || navigator.userAgent;
      
      // Call the database function to log the event
      const { error } = await supabase.rpc('log_security_event', {
        p_user_id: event.userId || null,
        p_action_type: event.actionType,
        p_resource_type: event.resourceType || null,
        p_resource_id: event.resourceId || null,
        p_ip_address: event.ipAddress || null,
        p_user_agent: userAgent,
        p_details: event.details ? JSON.stringify(event.details) : null,
        p_severity: event.severity || 'info'
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Security audit logging error:', error);
      // Don't throw - audit logging failures shouldn't break the app
    }
  }

  /**
   * Log authentication events
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
      details,
      severity: eventType === 'LOGIN_FAILURE' ? 'warning' : 'info'
    });
  }

  /**
   * Log booking-related security events
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
      details,
      severity: 'info'
    });
  }

  /**
   * Log payment-related security events
   */
  static async logPaymentEvent(
    eventType: 'PAYMENT_INITIATED' | 'PAYMENT_FAILED',
    bookingId: UUID,
    userId?: UUID,
    details?: Record<string, any>
  ): Promise<void> {
    await this.logSecurityEvent({
      userId,
      actionType: eventType,
      resourceType: 'payment',
      resourceId: bookingId,
      details,
      severity: eventType === 'PAYMENT_FAILED' ? 'warning' : 'info'
    });
  }

  /**
   * Log rate limiting events
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
        identifier,
        limitedAction: actionType,
        ...details
      },
      severity: 'warning'
    });
  }
}
