
import { supabase } from '@/integrations/supabase/client';
import { UUID } from '@/types/booking';

export interface ExternalRate {
  platform: string;
  rate_per_night: number;
  is_available: boolean;
}

/**
 * Fetches external rates for a property on given dates
 */
export const getExternalRates = async (
  propertyId: UUID, 
  checkInDate: Date, 
  checkOutDate: Date
): Promise<ExternalRate[]> => {
  try {
    const startDate = checkInDate.toISOString().split('T')[0];
    const endDate = checkOutDate.toISOString().split('T')[0];

    const { data: rates, error } = await supabase
      .from('external_rates')
      .select('platform, rate_per_night, is_available')
      .eq('property_id', propertyId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      console.error('Error fetching external rates:', error);
      return [];
    }

    // Group by platform and calculate average rate
    const platformRates = rates?.reduce((acc: any, rate) => {
      if (!acc[rate.platform]) {
        acc[rate.platform] = { total: 0, count: 0, available: rate.is_available };
      }
      acc[rate.platform].total += rate.rate_per_night;
      acc[rate.platform].count += 1;
      return acc;
    }, {}) || {};

    return Object.entries(platformRates).map(([platform, data]: [string, any]) => ({
      platform,
      rate_per_night: data.total / data.count,
      is_available: data.available
    }));
  } catch (error) {
    console.error('Error in getExternalRates:', error);
    return [];
  }
};
