import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertyBookingStep1_DatesGuests from '@/components/booking/PropertyBookingStep1_DatesGuests';
import PropertyBookingStep2_Addons from '@/components/booking/PropertyBookingStep2_Addons';
import BookingStep_GuestInfo from '@/components/booking/BookingStep_GuestInfo';
import BookingStep_Payment from '@/components/booking/BookingStep_Payment';
import { UUID, PriceBreakdown, GuestInfo } from '@/types/booking';
import { calculateBookingPrice } from '@/services/bookingService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BookingData {
  propertyId: UUID;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  specialRequests?: string;
  customerNotes?: string;
  selectedAddons: { instanceId: UUID; attendees: number }[];
  guests: GuestInfo[];
}

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();

  const propertyId = searchParams.get('propertyId');
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({});
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const [property, setProperty] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!propertyId) {
        toast({
          title: "Error",
          description: "No property selected.",
          variant: "destructive"
        });
        navigate('/stay');
        return;
      }

      try {
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

    fetchPropertyDetails();
  }, [propertyId, navigate, toast]);

  const calculatePrice = async () => {
    if (!bookingData.propertyId || !bookingData.checkInDate || !bookingData.checkOutDate) {
      return null;
    }

    try {
      const breakdown = await calculateBookingPrice({
        type: 'property',
        propertyId: bookingData.propertyId,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        selectedAddonExperiences: bookingData.selectedAddons
      });

      setPriceBreakdown(breakdown);
      return breakdown;
    } catch (error) {
      console.error('Error calculating price:', error);
      toast({
        title: 'Error',
        description: 'Failed to calculate booking price.',
        variant: 'destructive'
      });
      return null;
    }
  };

  const handleStep1Completion = async (data: {
    checkInDate: Date;
    checkOutDate: Date;
    numberOfGuests: number;
    specialRequests?: string;
  }) => {
    setBookingData(prev => ({
      ...prev,
      propertyId: propertyId as UUID,
      ...data
    }));
    
    setStep(2);
  };

  const handleStep2Completion = (addons: { instanceId: UUID; attendees: number }[]) => {
    setBookingData(prev => ({
      ...prev,
      selectedAddons: addons
    }));
    
    setStep(3);
  };

  const handleStep3Completion = async (guests: GuestInfo[], customerNotes?: string) => {
    setBookingData(prev => ({
      ...prev,
      guests,
      customerNotes
    }));
    
    const pricing = await calculatePrice();
    if (pricing) {
      setStep(4);
    }
  };

  const handlePaymentSuccess = (bookingId: UUID, bookingReference: string) => {
    navigate(`/booking/confirmation?reference=${bookingReference}&status=success`);
  };

  const renderStep = () => {
    if (isLoading || !property) {
      return <div className="text-center py-12">Loading property details...</div>;
    }

    switch (step) {
      case 1:
        return (
          <PropertyBookingStep1_DatesGuests
            propertyId={propertyId as UUID}
            onNext={handleStep1Completion}
            maxGuests={property.max_guests}
            minNights={1}
          />
        );
      case 2:
        if (!bookingData.checkInDate || !bookingData.checkOutDate || !bookingData.numberOfGuests) {
          setStep(1);
          return null;
        }
        return (
          <PropertyBookingStep2_Addons
            checkInDate={bookingData.checkInDate}
            checkOutDate={bookingData.checkOutDate}
            numberOfGuests={bookingData.numberOfGuests}
            onNext={handleStep2Completion}
            onBack={() => setStep(1)}
          />
        );
      case 3:
        if (!bookingData.numberOfGuests) {
          setStep(1);
          return null;
        }
        return (
          <BookingStep_GuestInfo
            numberOfGuests={bookingData.numberOfGuests}
            onNext={handleStep3Completion}
            onBack={() => setStep(2)}
          />
        );
      case 4:
        if (!priceBreakdown || !bookingData.propertyId || !bookingData.checkInDate || 
            !bookingData.checkOutDate || !bookingData.numberOfGuests || !bookingData.guests) {
          setStep(1);
          return null;
        }
        return (
          <BookingStep_Payment
            bookingType="property"
            priceBreakdown={priceBreakdown}
            propertyDetails={{
              propertyId: bookingData.propertyId,
              checkInDate: bookingData.checkInDate,
              checkOutDate: bookingData.checkOutDate,
              numberOfGuests: bookingData.numberOfGuests,
              specialRequests: bookingData.specialRequests,
              customerNotes: bookingData.customerNotes
            }}
            guests={bookingData.guests}
            selectedAddonExperiences={bookingData.selectedAddons}
            onBack={() => setStep(3)}
            onSuccess={handlePaymentSuccess}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <main className="py-16 bg-gray-50">
        <div className="container-custom max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">Book Your Stay</h1>
            <p className="text-gray-600">
              {property?.name ? `${property.name} - ` : ''}
              Complete your booking in a few simple steps
            </p>
          </div>
          
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between">
              {['Dates & Guests', 'Experiences', 'Guest Info', 'Payment'].map((label, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col items-center w-1/4 ${index + 1 < step ? 'text-haven-green' : index + 1 === step ? 'text-haven-green font-medium' : 'text-gray-400'}`}
                >
                  <div className={`rounded-full h-8 w-8 flex items-center justify-center mb-2 ${index + 1 <= step ? 'bg-haven-green text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {index + 1}
                  </div>
                  <span className="text-sm text-center">{label}</span>
                </div>
              ))}
            </div>
            <div className="relative mt-2 h-1 bg-gray-200">
              <div 
                className="absolute top-0 left-0 h-1 bg-haven-green transition-all duration-300" 
                style={{ width: `${(step - 1) * 33.33}%` }}
              />
            </div>
          </div>
          
          {!user && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
              <p className="text-amber-800">
                <strong>Note:</strong> You need to be logged in to complete your booking. You'll be prompted to sign in before payment.
              </p>
            </div>
          )}
          
          {renderStep()}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BookingPage;
