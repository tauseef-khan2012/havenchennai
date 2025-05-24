
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tag, Check, X, Loader2 } from 'lucide-react';
import { validateDiscountCode, DiscountApplication } from '@/services/discountService';
import { UUID } from '@/types/booking';

interface DiscountCodeInputProps {
  bookingType: 'property' | 'experience';
  itemId: UUID;
  totalAmount: number;
  onDiscountApplied: (discount: DiscountApplication) => void;
  appliedDiscount?: DiscountApplication;
}

const DiscountCodeInput: React.FC<DiscountCodeInputProps> = ({
  bookingType,
  itemId,
  totalAmount,
  onDiscountApplied,
  appliedDiscount
}) => {
  const [discountCode, setDiscountCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setIsValidating(true);
    try {
      const result = await validateDiscountCode(
        discountCode.trim(),
        bookingType,
        itemId,
        totalAmount
      );
      
      onDiscountApplied(result);
      
      if (result.isValid) {
        setDiscountCode('');
      }
    } catch (error) {
      console.error('Error applying discount:', error);
      onDiscountApplied({
        isValid: false,
        discountAmount: 0,
        errorMessage: 'Error applying discount code'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveDiscount = () => {
    onDiscountApplied({
      isValid: false,
      discountAmount: 0
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Discount Code</span>
          </div>

          {appliedDiscount?.isValid ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {appliedDiscount.discountCode?.code}
                  </span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    -{formatCurrency(appliedDiscount.discountAmount)}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveDiscount}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {appliedDiscount.discountCode?.description && (
                <p className="text-xs text-green-600 mt-1">
                  {appliedDiscount.discountCode.description}
                </p>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Enter discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscount()}
                className="flex-1"
              />
              <Button
                onClick={handleApplyDiscount}
                disabled={!discountCode.trim() || isValidating}
                size="sm"
              >
                {isValidating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Apply'
                )}
              </Button>
            </div>
          )}

          {appliedDiscount && !appliedDiscount.isValid && appliedDiscount.errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-800">
                  {appliedDiscount.errorMessage}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscountCodeInput;
