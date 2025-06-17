
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentReceipt } from '@/components/payment/PaymentReceipt';
import { PriceSummary } from '@/components/booking/PriceSummary';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  UUID, 
  BookingType, 
  PriceBreakdown, 
  PropertyBookingDetails,
  ExperienceBookingDetails,
  GuestInfo,
  Currency
} from '@/types/booking';
import { createBooking } from '@/services/bookingService';
import { createGuestBooking } from '@/services/booking/data/createGuestBooking';
import { CreditCard, AlertCircle, CheckCircle, Shield, Users, Calendar } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export interface PaymentStepProps {
  bookingType: BookingType;
  priceBreakdown: PriceBreakdown;
  propertyDetails?: PropertyBookingDetails;
  experienceDetails?: ExperienceBookingDetails;
  guests?: GuestInfo[];
  selectedAddonExperiences?: {instanceId: UUID, attendees: number}[];
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  onBack: () => void;
  onSuccess: (bookingId: UUID, bookingReference: string) => void;
  isLoading?: boolean;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  bookingType,
  priceBreakdown,
  propertyDetails,
  experienceDetails,
  guests = [],
  selectedAddonExperiences = [],
  contactInfo,
  onBack,
  onSuccess,
  isLoading = false
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [bookingCreated, setBookingCreated] = useState(false);
  const [bookingId, setBookingId] = useState<UUID | null>(null);
  const [bookingReference, setBookingReference] = useState<string | null>(null);

  // Validate contact information before proceeding
  const validateContactInfo = () => {
    if (!contactInfo.fullName.trim()) {
      return { isValid: false, message: 'Full name is required' };
    }
    if (!contactInfo.email.trim()) {
      return { isValid: false, message: 'Email address is required' };
    }
    if (!contactInfo.phone.trim()) {
      return { isValid: false, message: 'Phone number is required' };
    }
    return { isValid: true, message: '' };
  };

  const handlePayment = async () => {
    console.log('Payment initiated with contact info:', contactInfo);
    console.log('User status:', user ? 'Logged in' : 'Guest');
    
    // Validate contact information
    const validation = validateContactInfo();
    if (!validation.isValid) {
      toast({
        title: 'Missing contact information',
        description: validation.message,
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    setPaymentError(null);
    
    try {
      let result;
      
      if (user) {
        // User is logged in - create regular booking
        console.log('Creating authenticated user booking');
        const bookingData = {
          type: bookingType,
          userId: user.id,
          priceBreakdown: priceBreakdown,
          guests: guests,
          selectedAddonExperiences: selectedAddonExperiences,
          property: propertyDetails,
          experience: experienceDetails
        };
        
        result = await createBooking(bookingData);
      } else {
        // Guest booking - no authentication required
        console.log('Creating guest booking');
        const guestBookingData = {
          type: bookingType,
          guestName: contactInfo.fullName,
          guestEmail: contactInfo.email,
          guestPhone: contactInfo.phone,
          priceBreakdown: {
            ...priceBreakdown,
            currency: 'INR' as Currency
          },
          propertyId: propertyDetails?.propertyId,
          checkInDate: propertyDetails?.checkInDate,
          checkOutDate: propertyDetails?.checkOutDate,
          numberOfGuests: propertyDetails?.numberOfGuests,
          specialRequests: propertyDetails?.specialRequests,
          instanceId: experienceDetails?.instanceId,
          numberOfAttendees: experienceDetails?.numberOfAttendees
        };
        
        result = await createGuestBooking(guestBookingData);
      }
      
      setBookingCreated(true);
      setBookingId(result.bookingId);
      setBookingReference(result.bookingReference);
      
      toast({
        title: 'Booking created!',
        description: user 
          ? 'Redirecting to payment...' 
          : 'Your booking has been created. Proceeding to payment...',
      });

      onSuccess(result.bookingId, result.bookingReference);
    } catch (error: any) {
      console.error('Error creating booking:', error);
      setPaymentError(error.message || 'Failed to create booking. Please try again.');
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to create booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-gradient py-8">
      <div className="absolute inset-0 bg-organic-texture opacity-20"></div>
      <div className="absolute inset-0 leaf-pattern opacity-15"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-16 left-8 w-20 h-20 rounded-organic bg-haven-yellow/10 animate-float-gentle"></div>
      <div className="absolute bottom-20 right-12 w-16 h-16 rounded-organic-2 bg-haven-navy-light/20 animate-float-gentle" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <Card className="w-full max-w-4xl mx-auto glass-panel-navy border-haven-yellow/20 shadow-navy animate-fade-in">
          <CardHeader className="text-center">
            <div className="inline-flex items-center gap-3 mb-4 justify-center">
              <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
              <span className="font-handwritten text-2xl text-haven-yellow">Secure Payment</span>
              <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
            </div>
            <CardTitle className="text-3xl font-serif text-haven-beige">Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="glass-panel rounded-3xl p-6 border-l-4 border-haven-yellow">
                  <h3 className="text-lg font-medium mb-3 text-haven-beige flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-haven-yellow" />
                    Booking Summary
                  </h3>
                  <PriceSummary priceBreakdown={priceBreakdown} />
                </div>
                
                {/* Contact Information Summary */}
                <div className="glass-panel rounded-3xl p-6 border-l-4 border-haven-yellow">
                  <h4 className="font-medium mb-3 text-haven-beige flex items-center gap-2">
                    <Users className="h-5 w-5 text-haven-yellow" />
                    Contact Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-haven-beige/80"><span className="font-medium text-haven-beige">Name:</span> {contactInfo.fullName}</p>
                    <p className="text-haven-beige/80"><span className="font-medium text-haven-beige">Email:</span> {contactInfo.email}</p>
                    <p className="text-haven-beige/80"><span className="font-medium text-haven-beige">Phone:</span> {contactInfo.phone}</p>
                  </div>
                  {!user && (
                    <p className="text-xs text-haven-beige/60 mt-3 italic">
                      Booking as guest • You can create an account later to manage your bookings
                    </p>
                  )}
                </div>
                
                {/* Booking Status */}
                <div className="glass-panel rounded-2xl p-4">
                  {user ? (
                    <div className="flex items-center gap-2 text-sm text-haven-yellow">
                      <CheckCircle className="h-4 w-4" />
                      <span>Signed in • Faster checkout</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-haven-yellow">
                      <CheckCircle className="h-4 w-4" />
                      <span>Guest booking • No account required</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="glass-panel rounded-3xl p-6 border-l-4 border-haven-yellow">
                  <h3 className="text-lg font-medium mb-3 text-haven-beige flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-haven-yellow" />
                    Payment Method
                  </h3>
                  <div className="bg-yellow-gradient/10 p-4 rounded-2xl border border-haven-yellow/30 flex items-center">
                    <Shield className="h-5 w-5 mr-3 text-haven-yellow" />
                    <div>
                      <p className="font-medium text-haven-beige">Razorpay</p>
                      <p className="text-sm text-haven-beige/80">Secure payment gateway</p>
                    </div>
                  </div>
                </div>
                
                {bookingCreated && bookingId && (
                  <div className="glass-panel rounded-3xl p-6 border-l-4 border-haven-yellow animate-scale-up">
                    <PaymentReceipt 
                      status="Unpaid"
                      amount={priceBreakdown.totalAmountDue}
                      currency={priceBreakdown.currency}
                      bookingReference={bookingReference || undefined}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {paymentError && (
              <Alert variant="destructive" className="glass-panel border-red-500/50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Error</AlertTitle>
                <AlertDescription>{paymentError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between bg-haven-navy-dark/20 rounded-b-lg p-6">
            <Button 
              variant="outline" 
              onClick={onBack} 
              disabled={isLoading || isSubmitting}
              className="glass-panel border-haven-yellow/30 text-haven-beige hover:bg-haven-navy-light/50"
            >
              Back
            </Button>
            <Button 
              onClick={handlePayment} 
              disabled={isLoading || isSubmitting || bookingCreated}
              className="bg-yellow-gradient hover:shadow-yellow text-haven-navy font-semibold px-8 py-3 text-lg transition-all duration-300 transform hover:scale-105 ripple-effect"
            >
              {isLoading || isSubmitting ? 'Processing...' : 'Proceed to Payment'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PaymentStep;
