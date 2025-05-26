
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UUID } from '@/types/booking';

export const usePropertyBooking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();

  const propertyId = searchParams.get('propertyId') as UUID;
  const [property, setProperty] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        toast({
          title: "Error",
          description: "No property selected for booking.",
          variant: "destructive"
        });
        navigate('/stay');
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .eq('is_published', true)
          .single();

        if (error || !data) {
          throw new Error('Property not found');
        }

        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
        toast({
          title: "Error",
          description: "Failed to load property details.",
          variant: "destructive"
        });
        navigate('/stay');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, navigate, toast]);

  return {
    property,
    propertyId,
    isLoading,
    user
  };
};
