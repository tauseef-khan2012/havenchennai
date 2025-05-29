
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Gift, Percent, UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DiscountApplication, applyDiscountCode } from '@/services/discountService';
import { UUID } from '@/types/booking';

interface EnhancedDiscountSectionProps {
  propertyId: UUID;
  checkInDate: Date;
  checkOutDate: Date;
  guestCount: number;
  subtotal: number;
  appliedDiscount?: DiscountApplication;
  onDiscountApplied: (discount: DiscountApplication) => void;
  onSignupDiscountClaimed?: () => void;
}

export const EnhancedDiscountSection: React.FC<EnhancedDiscountSectionProps> = ({
  propertyId,
  checkInDate,
  checkOutDate,
  guestCount,
  subtotal,
  appliedDiscount,
  onDiscountApplied,
  onSignupDiscountClaimed
}) => {
  const { user, signUp } = useAuth();
  const { toast } = useToast();
  const [discountCode, setDiscountCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast({
        title: "Enter discount code",
        description: "Please enter a discount code.",
        variant: "destructive"
      });
      return;
    }

    setIsApplying(true);
    try {
      const discount = await applyDiscountCode(
        discountCode,
        propertyId,
        checkInDate,
        checkOutDate,
        guestCount,
        subtotal
      );
      
      if (discount.isValid) {
        onDiscountApplied(discount);
        setDiscountCode('');
        
        toast({
          title: "Discount applied!",
          description: `You saved ₹${discount.discountAmount.toFixed(2)} with code ${discount.code}`,
        });
      } else {
        toast({
          title: "Invalid discount code",
          description: discount.reason || "Please check your code and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Invalid discount code",
        description: error instanceof Error ? error.message : "Please check your code and try again.",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleSignupForDiscount = async () => {
    if (!signupData.email || !signupData.password || !signupData.fullName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSigningUp(true);
    try {
      await signUp({
        email: signupData.email,
        password: signupData.password,
        fullName: signupData.fullName,
        acceptTerms: true
      });

      // Apply the signup discount
      const discount = await applyDiscountCode(
        'SIGNUP5',
        propertyId,
        checkInDate,
        checkOutDate,
        guestCount,
        subtotal
      );
      
      if (discount.isValid) {
        onDiscountApplied(discount);
        onSignupDiscountClaimed?.();
        setShowSignupForm(false);
        
        toast({
          title: "Welcome to Haven!",
          description: "Your account has been created and 5% discount applied!",
        });
      } else {
        toast({
          title: "Account created!",
          description: "Welcome to Haven! The discount could not be applied at this time.",
        });
      }
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-haven-teal" />
          Discounts & Offers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Signup Discount Offer */}
        {!user && !appliedDiscount && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="h-5 w-5 text-green-600" />
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    New Customer Special
                  </Badge>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Sign up now and receive 5% discount</h4>
                <p className="text-sm text-gray-600 mb-3">Join Haven today and save on your first booking!</p>
                
                {!showSignupForm ? (
                  <Button
                    onClick={() => setShowSignupForm(true)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Percent className="h-4 w-4 mr-1" />
                    Get 5% Off
                  </Button>
                ) : (
                  <div className="space-y-3 mt-3">
                    <div className="grid grid-cols-1 gap-3">
                      <Input
                        placeholder="Full Name"
                        value={signupData.fullName}
                        onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                      />
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={signupData.email}
                        onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                      />
                      <Input
                        type="password"
                        placeholder="Create Password"
                        value={signupData.password}
                        onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSignupForDiscount}
                        disabled={isSigningUp}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isSigningUp ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          'Create Account & Save 5%'
                        )}
                      </Button>
                      <Button
                        onClick={() => setShowSignupForm(false)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      By creating an account, you agree to our terms and conditions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Regular Discount Code Section */}
        <div className="space-y-3">
          <h4 className="font-medium">Have a discount code?</h4>
          
          {appliedDiscount && appliedDiscount.isValid ? (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-800">✓ {appliedDiscount.code} applied</p>
                  <p className="text-sm text-green-600">
                    You saved ₹{appliedDiscount.discountAmount.toFixed(2)}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {appliedDiscount.discountPercentage || appliedDiscount.discountValue}% off
                </Badge>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Enter discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscount()}
              />
              <Button
                onClick={handleApplyDiscount}
                disabled={isApplying || !discountCode.trim()}
                variant="outline"
              >
                {isApplying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Apply'
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Available Offers */}
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-2">Available offers:</p>
          <ul className="space-y-1">
            <li>• Early bird discounts for advance bookings</li>
            <li>• Extended stay discounts for 7+ nights</li>
            <li>• Seasonal promotional codes</li>
            {!user && <li>• SIGNUP5: 5% off for new customers</li>}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
