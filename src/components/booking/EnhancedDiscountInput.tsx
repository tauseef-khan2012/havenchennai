
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Tag, Mail, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateDiscountCode, DiscountApplication } from '@/services/discountService';
import { supabase } from '@/integrations/supabase/client';
import { UUID } from '@/types/booking';

interface EnhancedDiscountInputProps {
  bookingType: 'property' | 'experience';
  itemId: UUID;
  totalAmount: number;
  onDiscountApplied: (discount: DiscountApplication) => void;
  appliedDiscount?: DiscountApplication;
}

const EnhancedDiscountInput: React.FC<EnhancedDiscountInputProps> = ({
  bookingType,
  itemId,
  totalAmount,
  onDiscountApplied,
  appliedDiscount
}) => {
  const [selectedCode, setSelectedCode] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const { toast } = useToast();

  const availableCodes = [
    { value: 'FIRSTTIME250', label: 'First Time Booking - ₹250 off' },
    { value: 'custom', label: 'Enter custom code' }
  ];

  const handleEmailVerification = async () => {
    if (!userEmail.trim()) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address.',
        variant: 'destructive'
      });
      return;
    }

    setIsVerifying(true);
    try {
      // Check if user exists in profiles table
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', userEmail.toLowerCase().trim())
        .single();

      // Check if user has any previous bookings
      const { data: previousBookings } = await supabase
        .from('bookings')
        .select('id')
        .eq('user_id', existingUser?.id)
        .limit(1);

      if (existingUser && previousBookings && previousBookings.length > 0) {
        toast({
          title: 'Not eligible',
          description: 'This discount is only for first-time bookings. You already have previous bookings.',
          variant: 'destructive'
        });
        setIsVerifying(false);
        return;
      }

      setEmailVerified(true);
      setShowEmailDialog(false);
      toast({
        title: 'Email verified',
        description: 'You are eligible for the first-time booking discount!',
      });
    } catch (error) {
      console.error('Error verifying email:', error);
      toast({
        title: 'Verification failed',
        description: 'Unable to verify email. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleApplyDiscount = async () => {
    const codeToApply = selectedCode === 'custom' ? customCode : selectedCode;
    
    if (!codeToApply) {
      toast({
        title: 'No code selected',
        description: 'Please select or enter a discount code.',
        variant: 'destructive'
      });
      return;
    }

    // For first-time discount, require email verification
    if (codeToApply === 'FIRSTTIME250' && !emailVerified) {
      setShowEmailDialog(true);
      return;
    }

    setIsApplying(true);
    try {
      const result = await validateDiscountCode(
        codeToApply,
        bookingType,
        itemId,
        totalAmount
      );

      if (result.isValid) {
        onDiscountApplied(result);
        toast({
          title: 'Discount applied!',
          description: `₹${result.discountAmount} discount has been applied to your booking.`,
        });
      } else {
        toast({
          title: 'Invalid discount code',
          description: result.errorMessage || 'This discount code is not valid.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error applying discount:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply discount code. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveDiscount = () => {
    onDiscountApplied({
      isValid: false,
      discountAmount: 0
    });
    setSelectedCode('');
    setCustomCode('');
    setEmailVerified(false);
    setUserEmail('');
  };

  if (appliedDiscount?.isValid) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-5 w-5 text-green-600" />
            Discount Applied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {appliedDiscount.discountCode?.code}
              </Badge>
              <span className="text-sm text-gray-600">
                ₹{appliedDiscount.discountAmount} off
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRemoveDiscount}
            >
              Remove
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Discount Codes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Select a discount
            </label>
            <Select value={selectedCode} onValueChange={setSelectedCode}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a discount code" />
              </SelectTrigger>
              <SelectContent>
                {availableCodes.map((code) => (
                  <SelectItem key={code.value} value={code.value}>
                    {code.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCode === 'custom' && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Enter discount code
              </label>
              <Input
                placeholder="Enter your code"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
              />
            </div>
          )}

          {selectedCode === 'FIRSTTIME250' && emailVerified && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Email verified - eligible for first-time discount!
            </div>
          )}

          <Button 
            onClick={handleApplyDiscount}
            disabled={!selectedCode || isApplying}
            className="w-full"
          >
            {isApplying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying...
              </>
            ) : (
              'Apply Discount'
            )}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Verify Email for First-Time Discount
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              To apply the first-time booking discount, we need to verify that you haven't booked with us before.
              Please enter your email address.
            </p>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleEmailVerification}
                disabled={isVerifying || !userEmail.trim()}
                className="flex-1"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowEmailDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnhancedDiscountInput;
