
import { supabase } from '@/integrations/supabase/client';
import { UUID, ChannelType, BookingData } from '@/types/booking';
import { calculateBookingPrice, createBooking } from '@/services/bookingService';
import { fetchAndStoreAirbnbRates, generateAirbnbBookingUrl } from '@/services/airbnbIntegrationService';

/**
 * Enhanced channel service with pricing integration
 */

interface ChannelBookingOption {
  platform: string;
  price: number;
  savings?: number;
  bookingUrl?: string;
  available: boolean;
}

// In-memory cache for external rates
interface CachedRates {
  data: any[];
  timestamp: number;
}

const ratesCache = new Map<string, CachedRates>();
const CACHE_TTL_MS = 3600000; // 1 hour

/**
 * Gets external rates from cache or database
 */
const getCachedExternalRates = async (
  propertyId: UUID,
  platform: string,
  checkInDate: Date,
  checkOutDate: Date
): Promise<any[] | null> => {
  const cacheKey = `${propertyId}-${platform}-${checkInDate.toISOString()}-${checkOutDate.toISOString()}`;
  const cached = ratesCache.get(cacheKey);

  // Return cached data if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // Fetch from database
  const { data: rates, error } = await supabase
    .from('external_rates')
    .select('rate_per_night, is_available')
    .eq('property_id', propertyId)
    .eq('platform', platform)
    .gte('date', checkInDate.toISOString().split('T')[0])
    .lte('date', checkOutDate.toISOString().split('T')[0]);

  if (error) {
    console.error(`Error fetching ${platform} rates:`, error);
    return null;
  }

  // Cache the result
  if (rates) {
    ratesCache.set(cacheKey, { data: rates, timestamp: Date.now() });
  }

  return rates;
};

/**
 * Syncs availability data to an external channel
 */
export const syncAvailabilityToChannel = async (
  channel: ChannelType,
  propertyId: UUID
): Promise<boolean> => {
  try {
    // Get booked dates for the property
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('check_in_date, check_out_date')
      .eq('property_id', propertyId)
      .in('booking_status', ['Confirmed', 'Checked-In', 'Pending Payment']);

    if (error) {
      console.error('Error fetching booked dates:', error);
      throw new Error(`Failed to sync availability: ${error.message}`);
    }

    console.log(`[Channel: ${channel}] Would sync the following unavailable dates for property ${propertyId}:`, bookings);
    
    return true;
  } catch (error) {
    console.error('Error in syncAvailabilityToChannel:', error);
    throw error;
  }
};

/**
 * Gets booking options from multiple channels with pricing comparison
 */
export const getChannelBookingOptions = async (
  propertyId: UUID,
  checkInDate: Date,
  checkOutDate: Date,
  guests: number,
  directPrice: number
): Promise<ChannelBookingOption[]> => {
  try {
    const options: ChannelBookingOption[] = [];
    
    // Add direct booking option
    options.push({
      platform: 'direct',
      price: directPrice,
      available: true,
      bookingUrl: `/booking?propertyId=${propertyId}&checkin=${checkInDate.toISOString().split('T')[0]}&checkout=${checkOutDate.toISOString().split('T')[0]}&guests=${guests}`
    });
    
    // Fetch Airbnb rates (simulate for demo)
    try {
      await fetchAndStoreAirbnbRates(propertyId, 'demo-listing-123', checkInDate, checkOutDate);

      // Get average Airbnb rate with caching
      const airbnbRates = await getCachedExternalRates(propertyId, 'airbnb', checkInDate, checkOutDate);

      if (airbnbRates && airbnbRates.length > 0) {
        const availableRates = airbnbRates.filter(rate => rate.is_available);
        if (availableRates.length > 0) {
          const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
          const avgRate = availableRates.reduce((sum, rate) => sum + rate.rate_per_night, 0) / availableRates.length;
          const totalAirbnbPrice = avgRate * nights;

          options.push({
            platform: 'airbnb',
            price: totalAirbnbPrice,
            savings: totalAirbnbPrice > directPrice ? totalAirbnbPrice - directPrice : 0,
            available: true,
            bookingUrl: generateAirbnbBookingUrl('demo-listing-123', checkInDate, checkOutDate, guests)
          });
        }
      }
    } catch (airbnbError) {
      console.error('Error fetching Airbnb rates:', airbnbError);
    }
    
    return options;
  } catch (error) {
    console.error('Error in getChannelBookingOptions:', error);
    return [];
  }
};

/**
 * Imports a booking from an external channel
 */
export const importBookingFromChannel = async (
  channel: ChannelType,
  externalBookingData: any
): Promise<{ bookingId: UUID, bookingReference: string }> => {
  try {
    // In a full implementation, this would parse channel-specific booking data
    // into our standard format and create a booking
    
    // Example transformation (would be different for each channel)
    const bookingData: BookingData = {
      type: 'property',
      userId: externalBookingData.guestId,
      sourcePlatform: channel,
      sourceBookingId: externalBookingData.id,
      property: {
        propertyId: externalBookingData.listingId,
        checkInDate: new Date(externalBookingData.checkIn),
        checkOutDate: new Date(externalBookingData.checkOut),
        numberOfGuests: externalBookingData.guests.length,
        specialRequests: externalBookingData.specialRequests
      },
      guests: externalBookingData.guests.map((g: any) => ({
        name: g.name,
        age: g.age
      })),
      priceBreakdown: await calculateBookingPrice({
        type: 'property',
        propertyId: externalBookingData.listingId,
        checkInDate: new Date(externalBookingData.checkIn),
        checkOutDate: new Date(externalBookingData.checkOut)
      })
    };
    
    return await createBooking(bookingData);
  } catch (error) {
    console.error('Error in importBookingFromChannel:', error);
    throw error;
  }
};

/**
 * Gets bookings from an external channel
 */
export const getBookingsFromChannel = async (
  channel: ChannelType,
  propertyId: UUID,
  startDate: Date,
  endDate: Date
): Promise<any[]> => {
  try {
    console.log(`[Channel: ${channel}] Would fetch bookings for property ${propertyId} from ${startDate} to ${endDate}`);
    return [];
  } catch (error) {
    console.error('Error in getBookingsFromChannel:', error);
    throw error;
  }
};
