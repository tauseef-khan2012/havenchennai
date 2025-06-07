
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

  // Default Haven property ID as fallback
  const havenPropertyId = "550e8400-e29b-41d4-a716-446655440000";
  
  // Get propertyId from URL params or use default
  const urlPropertyId = searchParams.get('propertyId');
  const propertyId = urlPropertyId || havenPropertyId;
  
  const [property, setProperty] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('usePropertyBooking - URL propertyId:', urlPropertyId);
  console.log('usePropertyBooking - Using propertyId:', propertyId);

  // Validate UUID format
  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  useEffect(() => {
    const fetchProperty = async () => {
      console.log('Fetching property with ID:', propertyId);
      
      if (!propertyId) {
        console.error('No property ID provided');
        setError('No property selected for booking.');
        setIsLoading(false);
        return;
      }

      if (!isValidUUID(propertyId)) {
        console.error('Invalid property ID format:', propertyId);
        setError('Invalid property ID format.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Querying Supabase for property:', propertyId);
        
        const { data, error: supabaseError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .eq('is_published', true)
          .maybeSingle();

        console.log('Supabase query result:', { data, error: supabaseError });

        if (supabaseError) {
          console.error('Supabase error:', supabaseError);
          throw new Error(`Database error: ${supabaseError.message}`);
        }

        if (!data) {
          console.warn('Property not found or not published:', propertyId);
          
          // If we're using the default property ID and it's not found, show a more helpful error
          if (propertyId === havenPropertyId) {
            throw new Error('The Haven property is not available at the moment. Please try again later.');
          } else {
            throw new Error('Property not found or not available for booking.');
          }
        }

        console.log('Property loaded successfully:', data);
        setProperty(data);
      } catch (error: any) {
        console.error('Error fetching property:', error);
        const errorMessage = error?.message || 'Failed to load property details.';
        setError(errorMessage);
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        
        // Only navigate away if this was a URL-specified property that failed
        if (urlPropertyId && urlPropertyId !== havenPropertyId) {
          setTimeout(() => navigate('/stay'), 2000);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, navigate, toast, urlPropertyId, havenPropertyId]);

  // Retry function for manual retry attempts
  const retryFetch = () => {
    setError(null);
    window.location.reload();
  };

  return {
    property,
    propertyId: propertyId as UUID,
    isLoading,
    error,
    user,
    retryFetch
  };
};
