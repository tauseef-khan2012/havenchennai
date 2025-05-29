
import { supabase } from '@/integrations/supabase/client';
import { UUID } from '@/types/booking';

export interface AnalyticsEvent {
  sessionId?: string;
  bookingId?: UUID;
  experienceBookingId?: UUID;
  eventType: 'page_view' | 'date_select' | 'guest_select' | 'checkout_start' | 'payment_attempt' | 'booking_complete' | 'abandonment';
  eventData?: Record<string, any>;
  userId?: UUID;
  propertyId?: UUID;
  experienceId?: UUID;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
}

/**
 * Track booking-related analytics events
 */
export const trackBookingEvent = async (event: AnalyticsEvent): Promise<void> => {
  try {
    const { error } = await supabase
      .from('booking_analytics')
      .insert({
        session_id: event.sessionId,
        booking_id: event.bookingId,
        experience_booking_id: event.experienceBookingId,
        event_type: event.eventType,
        event_data: event.eventData,
        user_id: event.userId,
        property_id: event.propertyId,
        experience_id: event.experienceId,
        utm_source: event.utmSource,
        utm_medium: event.utmMedium,
        utm_campaign: event.utmCampaign,
        referrer: event.referrer,
        user_agent: navigator.userAgent,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error tracking analytics event:', error);
    }
  } catch (error) {
    console.error('Failed to track analytics event:', error);
  }
};

/**
 * Track checkout abandonment
 */
export const trackCheckoutAbandonment = async (
  bookingId: UUID,
  bookingType: 'property' | 'experience',
  reason: string,
  eventData?: Record<string, any>
): Promise<void> => {
  try {
    // Update booking table with abandonment info
    const table = bookingType === 'property' ? 'bookings' : 'experience_bookings';
    
    const { error: updateError } = await supabase
      .from(table)
      .update({
        abandonment_reason: reason
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error updating abandonment reason:', updateError);
    }

    // Track analytics event
    await trackBookingEvent({
      bookingId: bookingType === 'property' ? bookingId : undefined,
      experienceBookingId: bookingType === 'experience' ? bookingId : undefined,
      eventType: 'abandonment',
      eventData: {
        reason,
        ...eventData
      }
    });
  } catch (error) {
    console.error('Failed to track checkout abandonment:', error);
  }
};

/**
 * Generate session ID for tracking user journey
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get UTM parameters from URL
 */
export const getUtmParameters = (): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
} => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utmSource: urlParams.get('utm_source') || undefined,
    utmMedium: urlParams.get('utm_medium') || undefined,
    utmCampaign: urlParams.get('utm_campaign') || undefined
  };
};

/**
 * Track conversion funnel step
 */
export const trackConversionStep = async (
  step: 'page_view' | 'date_select' | 'guest_select' | 'checkout_start',
  propertyId?: UUID,
  experienceId?: UUID,
  eventData?: Record<string, any>
): Promise<void> => {
  const utmParams = getUtmParameters();
  
  await trackBookingEvent({
    sessionId: generateSessionId(),
    eventType: step,
    propertyId,
    experienceId,
    eventData,
    referrer: document.referrer,
    ...utmParams
  });
};
