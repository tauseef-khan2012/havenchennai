
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Shield, 
  CreditCard,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { EnhancedPriceSummary } from './EnhancedPriceSummary';
import DiscountCodeInput from './DiscountCodeInput';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { DiscountApplication } from '@/services/discountService';
import { UUID } from '@/types/booking';

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
  onProceedToPayment: (contactInfo: ContactInfo, specialRequests: string) => void;
  isProcessing: boolean;
}

interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
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
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    fullName: '',
    email: '',
    phone: ''
  });
  const [specialRequests, setSpecialRequests] = useState('');
  const [errors, setErrors] = useState<Partial<ContactInfo>>({});

  const validateForm = () => {
    const newErrors: Partial<ContactInfo> = {};
    
    if (!contactInfo.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!contactInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(contactInfo.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!contactInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onProceedToPayment(contactInfo, specialRequests);
    }
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
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Checkout Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Booking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">{property.name}</h3>
                <p className="text-sm text-gray-600">{property.location_details}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Check-in:</span>
                  <span className="font-medium">{formatDate(selectedCheckIn)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out:</span>
                  <span className="font-medium">{formatDate(selectedCheckOut)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span className="font-medium">{guestCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-haven-teal" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={contactInfo.fullName}
                  onChange={(e) => setContactInfo(prev => ({...prev, fullName: e.target.value}))}
                  placeholder="Enter your full name"
                  className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.fullName}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo(prev => ({...prev, phone: e.target.value}))}
                  placeholder="+91 XXXXX XXXXX"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo(prev => ({...prev, email: e.target.value}))}
                placeholder="your.email@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Special Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-haven-teal" />
              Special Requests (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special requests or requirements for your stay..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Secure Booking</p>
                <p className="text-blue-800">
                  Your information is encrypted and secure. We use industry-standard security measures to protect your data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Pricing & Payment */}
      <div className="space-y-6">
        {/* Discount Code */}
        <DiscountCodeInput
          bookingType="property"
          itemId={propertyId}
          totalAmount={priceBreakdown.subtotalAfterDiscount}
          onDiscountApplied={onDiscountApplied}
          appliedDiscount={appliedDiscount}
        />

        {/* Price Summary */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Price Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedPriceSummary 
              priceBreakdown={priceBreakdown} 
              nights={nights}
              showCompetitorComparison={true}
            />
            
            <Separator className="my-4" />
            
            <Button 
              onClick={handleSubmit}
              className="w-full bg-haven-teal hover:bg-haven-teal/90 text-white py-3 text-lg font-medium"
              disabled={isProcessing}
              size="lg"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </Button>
            
            <p className="text-xs text-gray-500 text-center mt-2">
              You will be redirected to our secure payment gateway
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
