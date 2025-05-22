
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingProgressBar from '@/components/booking/BookingProgressBar';
import AuthenticationNotice from '@/components/booking/AuthenticationNotice';
import BookingForm from '@/components/booking/BookingForm';
import { UUID } from '@/types/booking';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();

  const propertyId = searchParams.get('propertyId');
  const experienceId = searchParams.get('experienceId');
  const [property, setProperty] = useState<any | null>(null);
  const [experience, setExperience] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setIsLoading(true);
      
      try {
        if (propertyId) {
          const { data, error } = await supabase
            .from('properties')
            .select('*')
            .eq('id', propertyId)
            .single();

          if (error) {
            throw error;
          }

          if (!data) {
            throw new Error('Property not found');
          }

          setProperty(data);
        } else if (experienceId) {
          const { data, error } = await supabase
            .from('experiences')
            .select('*')
            .eq('id', experienceId)
            .single();

          if (error) {
            throw error;
          }

          if (!data) {
            throw new Error('Experience not found');
          }

          setExperience(data);
        } else {
          throw new Error('No booking item selected');
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        toast({
          title: "Error",
          description: "Failed to load booking details.",
          variant: "destructive"
        });
        navigate(propertyId ? '/stay' : '/experiences');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [propertyId, experienceId, navigate, toast]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="py-16 bg-gray-50">
          <div className="container-custom max-w-3xl">
            <div className="mb-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-64 bg-gray-100 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="py-16 bg-gray-50">
        <div className="container-custom max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">
              {propertyId ? 'Book Your Stay' : 'Book Your Experience'}
            </h1>
            <p className="text-gray-600">
              {property?.name || experience?.name ? 
                `${property?.name || experience?.name} - ` : ''}
              Complete your booking in a few simple steps
            </p>
          </div>
          
          <AuthenticationNotice user={user} />
          
          <BookingForm 
            type={propertyId ? 'property' : 'experience'}
            propertyId={propertyId as UUID}
            instanceId={experienceId as UUID}
            maxGuests={property?.max_guests || 4}
            availableCapacity={experience?.max_capacity_per_instance || 10}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BookingPage;
