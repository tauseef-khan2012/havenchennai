
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useBookingActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const cancelStayBooking = async (bookingId: string, reason?: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          booking_status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          internal_notes: reason ? `Cancellation reason: ${reason}` : undefined
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Booking Cancelled",
        description: "Your stay booking has been successfully cancelled.",
      });

      return { success: true };
    } catch (error) {
      console.error('Error cancelling stay booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const cancelExperienceBooking = async (bookingId: string, reason?: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('experience_bookings')
        .update({
          booking_status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          special_requests: reason ? `Cancellation reason: ${reason}` : undefined
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Booking Cancelled",
        description: "Your experience booking has been successfully cancelled.",
      });

      return { success: true };
    } catch (error) {
      console.error('Error cancelling experience booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const modifyBooking = async (bookingId: string, type: 'stay' | 'experience') => {
    // Placeholder for modify functionality
    toast({
      title: "Modify Booking",
      description: "Booking modification feature coming soon. Please contact support for changes.",
    });
  };

  return {
    cancelStayBooking,
    cancelExperienceBooking,
    modifyBooking,
    isLoading
  };
};
