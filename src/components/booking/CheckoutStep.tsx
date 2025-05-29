
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EnhancedPriceSummary } from './EnhancedPriceSummary';
import { EnhancedDiscountSection } from './EnhancedDiscountSection';
import { EnhancedContactSection } from './EnhancedContactSection';
import { GuestDetailsForm } from './GuestDetailsForm';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { DiscountApplication } from '@/services/discountService';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useToast } from '@/hooks/use-toast';
import { UUID } from '@/types/booking';

interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
}

interface GuestInfo {
  name: string;
  age?: number;
}

interface CheckoutStepProps {
  property: any;
  propertyId: UUID;
  selectedCheckIn: Date;
  selectedCheckOut: Date;
  guestCount: number;
  nights: number;
  priceBreakdown: EnhancedPriceBreakdown;
  appliedDiscount?: DiscountApplication;
  onDiscountApplied: (discount: DiscountApplication) => void;
  onProceedToPayment: (contactInfo: ContactInfo, specialRequests: string, guestDetails: GuestInfo[]) => void;
  isProcessing: boolean;
}

export const CheckoutStep: React.FC<CheckoutStepProps> = ({
  property,
  propertyId,
  selectedCheckIn,
  selectedCheckOut,
  guestCount,
  nights,
  priceBreakdown,
  appliedDiscount,
  onDiscountApplied,
  onProceedToPayment,
  isProcessing
}) => {
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  
  // Contact information state
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    fullName: '',
    email: '',
    phone: ''
  });
  
  // Guest details state
  const [guestDetails, setGuestDetails] = useState<GuestInfo[]>(() => 
    Array.from({ length: guestCount }, () => ({ name: '', age: undefined }))
  );
  
  const [specialRequests, setSpecialRequests] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate contact information
    if (!contactInfo.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!contactInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!contactInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\+\-\(\)]+$/.test(contactInfo.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Validate guest details
    guestDetails.forEach((guest, index) => {
      if (!guest.name.trim()) {
        newErrors[`guest_${index}_name`] = `Guest ${index + 1} name is required`;
      }
      if (guest.age !== undefined && (guest.age < 0 || guest.age > 120)) {
        newErrors[`guest_${index}_age`] = `Please enter a valid age for guest ${index + 1}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContactInfoChange = (info: ContactInfo) => {
    setContactInfo(info);
    // Clear relevant errors
    setErrors(prev => {
      const updated = { ...prev };
      delete updated.fullName;
      delete updated.email;
      delete updated.phone;
      return updated;
    });
  };

  const handleFieldChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGuestDetailsChange = (index: number, field: keyof GuestInfo, value: string | number) => {
    setGuestDetails(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    
    // Clear error when user starts typing
    const errorKey = `guest_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Some required fields are missing or invalid.",
        variant: "destructive"
      });
      return;
    }

    onProceedToPayment(contactInfo, specialRequests, guestDetails);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate additional guest charges
  const additionalGuestCharges = Math.max(0, guestCount - 2) * 500;
  const totalWithGuestCharges = priceBreakdown.totalAmountDue + additionalGuestCharges;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">Complete Your Booking</h1>
        <p className="text-gray-600">Just a few more details to secure your stay</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Forms */}
        <div className="space-y-6">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-haven-teal" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h3 className="font-medium text-gray-900">{property.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Check-in:</span>
                    <p>{formatDate(selectedCheckIn)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Check-out:</span>
                    <p>{formatDate(selectedCheckOut)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Guests:</span>
                    <p>{guestCount} {guestCount === 1 ? 'guest' : 'guests'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>
                    <p>{nights} {nights === 1 ? 'night' : 'nights'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Contact Information */}
          <EnhancedContactSection
            contactInfo={contactInfo}
            onContactInfoChange={handleContactInfoChange}
            errors={errors}
            onFieldChange={handleFieldChange}
          />

          {/* Guest Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-haven-teal" />
                Guest Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <GuestDetailsForm
                guestDetails={guestDetails}
                onGuestDetailsChange={handleGuestDetailsChange}
                errors={errors}
              />

              {guestCount > 2 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Additional charge of {formatPrice(500, 'INR')} per guest after the first 2 guests has been added to your total.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Special Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Special Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="specialRequests">Additional Information (optional)</Label>
                <Textarea
                  id="specialRequests"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any special requests or additional information..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Pricing Summary */}
        <div className="space-y-6">
          {/* Enhanced Discount Code */}
          <EnhancedDiscountSection
            propertyId={propertyId}
            checkInDate={selectedCheckIn}
            checkOutDate={selectedCheckOut}
            guestCount={guestCount}
            subtotal={priceBreakdown.subtotalAfterDiscount}
            appliedDiscount={appliedDiscount}
            onDiscountApplied={onDiscountApplied}
          />

          {/* Price Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Price Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedPriceSummary 
                priceBreakdown={priceBreakdown} 
                nights={nights}
                showCompetitorComparison={false}
              />
              
              {additionalGuestCharges > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <span>Additional guests ({guestCount - 2} × {formatPrice(500, 'INR')})</span>
                    <span>{formatPrice(additionalGuestCharges, 'INR')}</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Final Total</span>
                    <span>{formatPrice(totalWithGuestCharges, priceBreakdown.currency)}</span>
                  </div>
                </>
              )}
              
              {priceBreakdown.savingsFromCompetitors && priceBreakdown.savingsFromCompetitors > 0 && (
                <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="text-sm text-green-800">
                    <span className="font-medium">You save {formatPrice(priceBreakdown.savingsFromCompetitors, priceBreakdown.currency)}</span> by booking direct!
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Proceed Button */}
          <Button 
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full bg-haven-teal hover:bg-haven-teal/90 text-white py-3 text-lg font-medium"
            size="lg"
          >
            {isProcessing ? 'Processing...' : 'Proceed to Payment'}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By proceeding, you agree to our terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
};
