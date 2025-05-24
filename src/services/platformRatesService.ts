
import { supabase } from '@/integrations/supabase/client';
import { UUID } from '@/types/booking';

export interface PlatformRate {
  id: UUID;
  property_id?: UUID;
  experience_id?: UUID;
  platform: 'airbnb' | 'booking_com' | 'agoda';
  date: string;
  base_rate: number;
  platform_fee: number;
  commission_rate: number;
  total_guest_pays: number;
  is_available: boolean;
  external_listing_id?: string;
  booking_url?: string;
  fetched_at: string;
}

export interface PlatformComparison {
  platform: string;
  displayName: string;
  totalPrice: number;
  savings: number;
  isAvailable: boolean;
  bookingUrl?: string;
  fees: {
    baseRate: number;
    platformFee: number;
    commission: number;
  };
}

/**
 * Fetches platform rates for a property on given dates
 */
export const getPlatformRatesForProperty = async (
  propertyId: UUID,
  checkInDate: Date,
  checkOutDate: Date
): Promise<PlatformRate[]> => {
  try {
    const startDate = checkInDate.toISOString().split('T')[0];
    const endDate = checkOutDate.toISOString().split('T')[0];

    const { data: rates, error } = await supabase
      .from('platform_rates')
      .select('*')
      .eq('property_id', propertyId)
      .gte('date', startDate)
      .lte('date', endDate)
      .eq('is_available', true);

    if (error) {
      console.error('Error fetching platform rates:', error);
      return [];
    }

    return (rates || []).map(rate => ({
      ...rate,
      platform: rate.platform as 'airbnb' | 'booking_com' | 'agoda'
    })) as PlatformRate[];
  } catch (error) {
    console.error('Error in getPlatformRatesForProperty:', error);
    return [];
  }
};

/**
 * Fetches platform rates for an experience
 */
export const getPlatformRatesForExperience = async (
  experienceId: UUID,
  date: Date
): Promise<PlatformRate[]> => {
  try {
    const dateStr = date.toISOString().split('T')[0];

    const { data: rates, error } = await supabase
      .from('platform_rates')
      .select('*')
      .eq('experience_id', experienceId)
      .eq('date', dateStr)
      .eq('is_available', true);

    if (error) {
      console.error('Error fetching platform rates for experience:', error);
      return [];
    }

    return (rates || []).map(rate => ({
      ...rate,
      platform: rate.platform as 'airbnb' | 'booking_com' | 'agoda'
    })) as PlatformRate[];
  } catch (error) {
    console.error('Error in getPlatformRatesForExperience:', error);
    return [];
  }
};

/**
 * Compares platform pricing with direct booking
 */
export const comparePlatformPricing = (
  directPrice: number,
  platformRates: PlatformRate[],
  nights: number = 1
): PlatformComparison[] => {
  const comparisons: PlatformComparison[] = [];

  // Group rates by platform and calculate averages
  const platformGroups = platformRates.reduce((acc, rate) => {
    if (!acc[rate.platform]) {
      acc[rate.platform] = [];
    }
    acc[rate.platform].push(rate);
    return acc;
  }, {} as Record<string, PlatformRate[]>);

  Object.entries(platformGroups).forEach(([platform, rates]) => {
    const avgBaseRate = rates.reduce((sum, rate) => sum + rate.base_rate, 0) / rates.length;
    const avgPlatformFee = rates.reduce((sum, rate) => sum + rate.platform_fee, 0) / rates.length;
    const avgCommission = rates.reduce((sum, rate) => sum + rate.commission_rate, 0) / rates.length;
    const avgTotalPrice = rates.reduce((sum, rate) => sum + rate.total_guest_pays, 0) / rates.length;
    
    const totalPlatformPrice = avgTotalPrice * nights;
    const savings = totalPlatformPrice > directPrice ? totalPlatformPrice - directPrice : 0;
    const sampleRate = rates[0];

    const displayNames = {
      'airbnb': 'Airbnb',
      'booking_com': 'Booking.com',
      'agoda': 'Agoda'
    };

    comparisons.push({
      platform,
      displayName: displayNames[platform as keyof typeof displayNames] || platform,
      totalPrice: totalPlatformPrice,
      savings,
      isAvailable: rates.length > 0,
      bookingUrl: sampleRate.booking_url,
      fees: {
        baseRate: avgBaseRate * nights,
        platformFee: avgPlatformFee * nights,
        commission: avgCommission * nights
      }
    });
  });

  return comparisons.sort((a, b) => a.totalPrice - b.totalPrice);
};

/**
 * Generates booking URLs for platforms
 */
export const generatePlatformBookingUrl = (
  platform: 'airbnb' | 'booking_com' | 'agoda',
  listingId: string,
  checkIn: Date,
  checkOut: Date,
  guests: number
): string => {
  const checkInStr = checkIn.toISOString().split('T')[0];
  const checkOutStr = checkOut.toISOString().split('T')[0];

  switch (platform) {
    case 'airbnb':
      return `https://www.airbnb.com/rooms/${listingId}?check_in=${checkInStr}&check_out=${checkOutStr}&guests=${guests}`;
    case 'booking_com':
      return `https://www.booking.com/hotel/${listingId}.html?checkin=${checkInStr}&checkout=${checkOutStr}&group_adults=${guests}`;
    case 'agoda':
      return `https://www.agoda.com/hotel/${listingId}?checkIn=${checkInStr}&checkOut=${checkOutStr}&rooms=1&adults=${guests}`;
    default:
      return '#';
  }
};
