
import { supabase } from '@/integrations/supabase/client';
import { UUID } from '@/types/booking';

/**
 * Addon experiences price calculation
 */
export const calculateAddonExperiencesTotal = async (
  selectedAddonExperiences?: {instanceId: UUID, attendees: number}[]
): Promise<number> => {
  if (!selectedAddonExperiences || selectedAddonExperiences.length === 0) {
    return 0;
  }

  const instanceIds = selectedAddonExperiences.map(addon => addon.instanceId);
  
  const { data: experienceInstances, error } = await supabase
    .from('experience_instances')
    .select(`
      id,
      price_per_person_override,
      flat_fee_price_override,
      experience:experience_id (
        price_per_person,
        flat_fee_price
      )
    `)
    .in('id', instanceIds);
  
  if (error) {
    console.error('Error fetching addon experiences:', error);
    throw new Error('Error calculating price: Could not fetch addon experiences');
  }
  
  let total = 0;
  
  if (experienceInstances) {
    for (const instance of experienceInstances) {
      const addon = selectedAddonExperiences.find(a => a.instanceId === instance.id);
      
      if (addon) {
        if (instance.flat_fee_price_override !== null) {
          total += instance.flat_fee_price_override;
        } else if (instance.experience?.flat_fee_price !== null) {
          total += instance.experience.flat_fee_price;
        } else {
          const pricePerPerson = instance.price_per_person_override ?? instance.experience?.price_per_person ?? 0;
          total += pricePerPerson * addon.attendees;
        }
      }
    }
  }
  
  return total;
};
