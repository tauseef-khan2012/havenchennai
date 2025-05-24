
import { supabase } from '@/integrations/supabase/client';
import { UUID } from '@/types/booking';

export interface AvailabilityInfo {
  date: string;
  isAvailable: boolean;
  minimumStay: number;
  rateOverride?: number;
  notes?: string;
}

/**
 * Checks availability for a property on given dates
 */
export const checkPropertyAvailabilityDetailed = async (
  propertyId: UUID,
  startDate: Date,
  endDate: Date
): Promise<AvailabilityInfo[]> => {
  try {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    // Check availability calendar
    const { data: availabilityData, error: availabilityError } = await supabase
      .from('availability_calendar')
      .select('*')
      .eq('property_id', propertyId)
      .gte('date', start)
      .lte('date', end);

    if (availabilityError) {
      console.error('Error checking availability:', availabilityError);
    }

    // Check existing bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('check_in_date, check_out_date')
      .eq('property_id', propertyId)
      .in('booking_status', ['Confirmed', 'Checked-In', 'Pending Payment'])
      .or(`check_in_date.lte.${end},check_out_date.gte.${start}`);

    if (bookingsError) {
      console.error('Error checking bookings:', bookingsError);
    }

    // Generate date range
    const dates: AvailabilityInfo[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Check if date is blocked by existing booking
      const isBlocked = bookings?.some(booking => {
        const checkIn = new Date(booking.check_in_date);
        const checkOut = new Date(booking.check_out_date);
        return currentDate >= checkIn && currentDate < checkOut;
      }) || false;

      // Check availability calendar override
      const calendarEntry = availabilityData?.find(entry => entry.date === dateStr);
      
      dates.push({
        date: dateStr,
        isAvailable: calendarEntry ? calendarEntry.is_available && !isBlocked : !isBlocked,
        minimumStay: calendarEntry?.minimum_stay || 1,
        rateOverride: calendarEntry?.rate_override || undefined,
        notes: calendarEntry?.notes || undefined
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  } catch (error) {
    console.error('Error in checkPropertyAvailabilityDetailed:', error);
    return [];
  }
};

/**
 * Checks if a date range is available for booking
 */
export const isDateRangeAvailable = (
  availabilityInfo: AvailabilityInfo[],
  checkIn: Date,
  checkOut: Date
): { isAvailable: boolean; blockedDates: string[] } => {
  const checkInStr = checkIn.toISOString().split('T')[0];
  const checkOutStr = checkOut.toISOString().split('T')[0];
  
  // For property bookings, we need to check all nights except checkout day
  const relevantDates = availabilityInfo.filter(info => {
    return info.date >= checkInStr && info.date < checkOutStr;
  });

  const blockedDates = relevantDates
    .filter(info => !info.isAvailable)
    .map(info => info.date);

  return {
    isAvailable: blockedDates.length === 0,
    blockedDates
  };
};

/**
 * Gets minimum stay requirement for a date range
 */
export const getMinimumStayRequirement = (
  availabilityInfo: AvailabilityInfo[],
  checkIn: Date
): number => {
  const checkInStr = checkIn.toISOString().split('T')[0];
  const checkInInfo = availabilityInfo.find(info => info.date === checkInStr);
  return checkInInfo?.minimumStay || 1;
};
