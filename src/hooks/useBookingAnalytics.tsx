
import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  trackBookingEvent, 
  trackCheckoutAbandonment, 
  trackConversionStep,
  generateSessionId,
  getUtmParameters 
} from '@/services/analytics/bookingAnalyticsService';
import { UUID } from '@/types/booking';

export const useBookingAnalytics = () => {
  const { user } = useAuth();
  const sessionIdRef = useRef<string>();

  // Initialize session ID
  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = generateSessionId();
    }
  }, []);

  const trackPageView = useCallback(async (
    propertyId?: UUID,
    experienceId?: UUID
  ) => {
    await trackConversionStep('page_view', propertyId, experienceId, {
      path: window.location.pathname,
      timestamp: new Date().toISOString()
    });
  }, []);

  const trackDateSelection = useCallback(async (
    propertyId: UUID,
    checkIn: Date,
    checkOut: Date,
    nights: number
  ) => {
    await trackConversionStep('date_select', propertyId, undefined, {
      check_in: checkIn.toISOString(),
      check_out: checkOut.toISOString(),
      nights,
      timestamp: new Date().toISOString()
    });
  }, []);

  const trackGuestSelection = useCallback(async (
    propertyId: UUID,
    guestCount: number
  ) => {
    await trackConversionStep('guest_select', propertyId, undefined, {
      guest_count: guestCount,
      timestamp: new Date().toISOString()
    });
  }, []);

  const trackCheckoutStart = useCallback(async (
    bookingId: UUID,
    bookingType: 'property' | 'experience',
    propertyId?: UUID,
    experienceId?: UUID,
    totalAmount?: number
  ) => {
    const utmParams = getUtmParameters();
    
    await trackBookingEvent({
      sessionId: sessionIdRef.current,
      bookingId: bookingType === 'property' ? bookingId : undefined,
      experienceBookingId: bookingType === 'experience' ? bookingId : undefined,
      eventType: 'checkout_start',
      eventData: {
        total_amount: totalAmount,
        timestamp: new Date().toISOString()
      },
      userId: user?.id,
      propertyId,
      experienceId,
      referrer: document.referrer,
      ...utmParams
    });
  }, [user]);

  const trackPaymentAttempt = useCallback(async (
    bookingId: UUID,
    bookingType: 'property' | 'experience',
    amount: number,
    paymentMethod?: string,
    razorpayOrderId?: string
  ) => {
    await trackBookingEvent({
      sessionId: sessionIdRef.current,
      bookingId: bookingType === 'property' ? bookingId : undefined,
      experienceBookingId: bookingType === 'experience' ? bookingId : undefined,
      eventType: 'payment_attempt',
      eventData: {
        amount,
        payment_method: paymentMethod,
        razorpay_order_id: razorpayOrderId,
        timestamp: new Date().toISOString()
      },
      userId: user?.id
    });
  }, [user]);

  const trackBookingComplete = useCallback(async (
    bookingId: UUID,
    bookingType: 'property' | 'experience',
    amount: number,
    paymentId: string,
    bookingReference: string
  ) => {
    await trackBookingEvent({
      sessionId: sessionIdRef.current,
      bookingId: bookingType === 'property' ? bookingId : undefined,
      experienceBookingId: bookingType === 'experience' ? bookingId : undefined,
      eventType: 'booking_complete',
      eventData: {
        amount,
        payment_id: paymentId,
        booking_reference: bookingReference,
        timestamp: new Date().toISOString()
      },
      userId: user?.id
    });
  }, [user]);

  const trackAbandonment = useCallback(async (
    bookingId: UUID,
    bookingType: 'property' | 'experience',
    reason: string,
    stage: string,
    eventData?: Record<string, any>
  ) => {
    await trackCheckoutAbandonment(bookingId, bookingType, reason, {
      stage,
      session_id: sessionIdRef.current,
      ...eventData
    });
  }, []);

  return {
    trackPageView,
    trackDateSelection,
    trackGuestSelection,
    trackCheckoutStart,
    trackPaymentAttempt,
    trackBookingComplete,
    trackAbandonment,
    sessionId: sessionIdRef.current
  };
};
