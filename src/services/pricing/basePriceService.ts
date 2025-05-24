
import { supabase } from '@/integrations/supabase/client';
import { UUID } from '@/types/booking';

/**
 * Base price calculation utilities
 */

/**
 * Calculates the number of nights between two dates
 */
export const calculateNights = (checkInDate: Date, checkOutDate: Date): number => {
  const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
  return Math.ceil(differenceInTime / (1000 * 3600 * 24));
};

/**
 * Fetches property base pricing details
 */
export const getPropertyBasePricing = async (propertyId: UUID) => {
  const { data: property, error } = await supabase
    .from('properties')
    .select('base_price_per_night, cleaning_fee, currency')
    .eq('id', propertyId)
    .single();

  if (error || !property) {
    throw new Error('Error calculating price: Property not found');
  }

  return property;
};

/**
 * Fetches experience instance pricing details
 */
export const getExperienceInstancePricing = async (instanceId: UUID) => {
  const { data: instance, error } = await supabase
    .from('experience_instances')
    .select(`
      id,
      price_per_person_override, 
      flat_fee_price_override,
      experience:experience_id (
        id,
        price_per_person,
        flat_fee_price,
        currency
      )
    `)
    .eq('id', instanceId)
    .single();

  if (error || !instance) {
    throw new Error('Error calculating price: Experience instance not found');
  }

  return instance;
};
