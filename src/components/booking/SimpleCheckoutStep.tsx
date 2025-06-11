
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Users, Calendar, MapPin, CreditCard } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SimplePriceSummary } from './SimplePriceSummary';
import { SimplePriceBreakdown } from '@/services/simplePricingService';
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

interface SimpleCheckoutStepProps {
  property: any;
  propertyId: UUID;
  selectedCheckIn: Date;
  selectedCheckOut: Date;
  guestCount: number;
  nights: number;
  priceBreakdown: SimplePriceBreakdown;
  onProceedToPayment: (contactInfo: ContactInfo, specialRequests: string, guestDetails: GuestInfo[]) => void;
  isProcessing: boolean;
}

export const SimpleCheckoutStep: React.FC<SimpleCheckoutStepProps> = ({
  property,
  propertyId,
  selectedCheckIn,
  selectedCheckOut,
  guestCount,
  nights,
  priceBreakdown,
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

  const handleContactInfoChange = (field: keyof ContactInfo, value: string) => {
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
          <span className="font-handwritten text-xl text-haven-yellow">Complete Booking</span>
          <div className="w-12 h-1 bg-yellow-gradient rounded-full"></div>
        </div>
        <h1 className="text-3xl font-serif text-haven-beige mb-2">Secure Your Haven Experience</h1>
        <p className="text-haven-beige/80">Just a few more details to confirm your lakeside retreat</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Forms */}
        <div className="space-y-6">
          {/* Booking Summary */}
          <Card className="glass-panel-navy border-haven-yellow/20 shadow-navy animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-haven-beige">
                <MapPin className="h-5 w-5 text-haven-yellow" />
                Your Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-gradient/10 p-4 rounded-2xl border border-haven-yellow/20">
                <h3 className="font-medium text-haven-beige mb-3">{property.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-haven-beige/80">
                  <div>
                    <span className="font-medium text-haven-beige">Check-in:</span>
                    <p>{formatDate(selectedCheckIn)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-haven-beige">Check-out:</span>
                    <p>{formatDate(selectedCheckOut)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-haven-beige">Guests:</span>
                    <p>{guestCount} {guestCount === 1 ? 'guest' : 'guests'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-haven-beige">Duration:</span>
                    <p>{nights} {nights === 1 ? 'night' : 'nights'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="glass-panel-navy border-haven-yellow/20 shadow-navy animate-fade-in-delay">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-haven-beige">
                <Users className="h-5 w-5 text-haven-yellow" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="text-haven-beige">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={contactInfo.fullName}
                    onChange={(e) => handleContactInfoChange('fullName', e.target.value)}
                    className="bg-haven-navy-light/50 border-haven-yellow/20 text-haven-beige"
                  />
                  {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <Label htmlFor="phone" className="text-haven-beige">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={contactInfo.phone}
                    onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                    className="bg-haven-navy-light/50 border-haven-yellow/20 text-haven-beige"
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-haven-beige">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => handleContactInfoChange('email', e.target.value)}
                  className="bg-haven-navy-light/50 border-haven-yellow/20 text-haven-beige"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Guest Details */}
          <Card className="glass-panel-navy border-haven-yellow/20 shadow-navy animate-fade-in-delay-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-haven-beige">
                <Users className="h-5 w-5 text-haven-yellow" />
                Guest Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {guestDetails.map((guest, index) => (
                <div key={index} className="bg-yellow-gradient/5 p-4 rounded-2xl border border-haven-yellow/10">
                  <h4 className="font-medium text-haven-beige mb-3">Guest {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`guest_${index}_name`} className="text-haven-beige">Name *</Label>
                      <Input
                        id={`guest_${index}_name`}
                        value={guest.name}
                        onChange={(e) => handleGuestDetailsChange(index, 'name', e.target.value)}
                        className="bg-haven-navy-light/50 border-haven-yellow/20 text-haven-beige"
                      />
                      {errors[`guest_${index}_name`] && <p className="text-red-400 text-sm mt-1">{errors[`guest_${index}_name`]}</p>}
                    </div>
                    <div>
                      <Label htmlFor={`guest_${index}_age`} className="text-haven-beige">Age (optional)</Label>
                      <Input
                        id={`guest_${index}_age`}
                        type="number"
                        value={guest.age || ''}
                        onChange={(e) => handleGuestDetailsChange(index, 'age', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="bg-haven-navy-light/50 border-haven-yellow/20 text-haven-beige"
                      />
                      {errors[`guest_${index}_age`] && <p className="text-red-400 text-sm mt-1">{errors[`guest_${index}_age`]}</p>}
                    </div>
                  </div>
                </div>
              ))}

              {guestCount > 2 && (
                <Alert className="bg-yellow-gradient/10 border-haven-yellow/30">
                  <AlertCircle className="h-4 w-4 text-haven-yellow" />
                  <AlertDescription className="text-haven-beige">
                    Additional charge of {formatPrice(500, 'INR')} per guest after the first 2 guests has been added to your total.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Special Requests */}
          <Card className="glass-panel-navy border-haven-yellow/20 shadow-navy animate-fade-in-delay">
            <CardHeader>
              <CardTitle className="text-haven-beige">Special Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="specialRequests" className="text-haven-beige">Additional Information (optional)</Label>
                <Textarea
                  id="specialRequests"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any special requests or additional information..."
                  rows={3}
                  className="bg-haven-navy-light/50 border-haven-yellow/20 text-haven-beige placeholder:text-haven-beige/50 focus:border-haven-yellow focus:ring-haven-yellow"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Pricing Summary */}
        <div className="space-y-6">
          {/* Price Summary */}
          <Card className="glass-panel-navy border-haven-yellow/20 shadow-navy animate-fade-in-delay">
            <CardHeader>
              <CardTitle className="text-haven-beige flex items-center gap-2">
                <Calendar className="h-5 w-5 text-haven-yellow" />
                Price Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimplePriceSummary priceBreakdown={priceBreakdown} />
            </CardContent>
          </Card>

          {/* Proceed Button */}
          <Button 
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full bg-yellow-gradient hover:shadow-yellow text-haven-navy py-3 text-lg font-medium transition-all duration-300 transform hover:scale-105 ripple-effect"
            size="lg"
          >
            {isProcessing ? 'Processing...' : 'Proceed to Payment'}
          </Button>

          <p className="text-xs text-haven-beige/60 text-center">
            By proceeding, you agree to our terms and conditions. No account required for guest bookings.
          </p>
        </div>
      </div>
    </div>
  );
};
