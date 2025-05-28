
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tag, Check, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateDiscountCode, DiscountApplication } from '@/services/discountService';
import { useCurrency } from '@/contexts/CurrencyContext';
import { UUID } from '@/types/booking';

interface DiscountCodeInputProps {
  propertyId: UUID;
  checkInDate: Date;
  checkOutDate: Date;
  guestCount: number;
  subtotal: number;
  appliedDiscount?: DiscountApplication;
  onDiscountApplied: (discount: DiscountApplication) => void;
}

export const DiscountCodeInput: React.FC<DiscountCodeInputProps> = ({
  propertyId,
  checkInDate,
  checkOutDate,
  guestCount,
  subtotal,
  appliedDiscount,
  onDiscountApplied
}) => {
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const [discountCode, setDiscountCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast({
        title: "Please enter a discount code",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);

    try {
      const validation = await validateDiscountCode(
        discountCode.trim().toUpperCase(),
        {
          propertyId,
          checkInDate,
          checkOutDate,
          numberOfGuests: guestCount,
          subtotal
        }
      );

      if (validation.isValid && validation.discountAmount > 0) {
        onDiscountApplied(validation);
        setDiscountCode('');
        toast({
          title: "Discount applied!",
          description: `You saved ${formatPrice(validation.discountAmount, 'INR')}`,
        });
      } else {
        toast({
          title: "Invalid discount code",
          description: validation.reason || "This discount code is not valid for your booking.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error validating discount code:', error);
      toast({
        title: "Error",
        description: "Failed to validate discount code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveDiscount = () => {
    onDiscountApplied({
      isValid: false,
      discountAmount: 0,
      reason: 'Discount removed'
    });
    
    toast({
      title: "Discount removed",
      description: "The discount has been removed from your booking."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-haven-teal" />
          Discount Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {appliedDiscount?.isValid ? (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">Discount Applied</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveDiscount}
                className="text-gray-500 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Save {formatPrice(appliedDiscount.discountAmount, 'INR')}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                placeholder="Enter discount code"
                className="flex-1"
                disabled={isValidating}
              />
              <Button
                onClick={handleApplyDiscount}
                disabled={isValidating || !discountCode.trim()}
                className="bg-haven-teal hover:bg-haven-teal/90"
              >
                {isValidating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Apply'
                )}
              </Button>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Have a promo code? Enter it above to get a discount on your booking.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
