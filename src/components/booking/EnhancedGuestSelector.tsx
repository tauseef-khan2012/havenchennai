
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, Minus } from 'lucide-react';

interface EnhancedGuestSelectorProps {
  guestCount: number;
  maxGuests: number;
  onGuestCountChange: (count: number) => void;
  disabled?: boolean;
}

export const EnhancedGuestSelector: React.FC<EnhancedGuestSelectorProps> = ({
  guestCount,
  maxGuests,
  onGuestCountChange,
  disabled = false
}) => {
  const handleIncrement = () => {
    if (guestCount < maxGuests) {
      onGuestCountChange(guestCount + 1);
    }
  };

  const handleDecrement = () => {
    if (guestCount > 1) {
      onGuestCountChange(guestCount - 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users className="h-5 w-5 text-haven-teal" />
          Guests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecrement}
              disabled={disabled || guestCount <= 1}
              className="h-8 w-8 p-0 rounded-full"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <div className="text-center min-w-[60px]">
              <div className="text-lg font-semibold">{guestCount}</div>
              <div className="text-xs text-gray-500">
                {guestCount === 1 ? 'Guest' : 'Guests'}
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleIncrement}
              disabled={disabled || guestCount >= maxGuests}
              className="h-8 w-8 p-0 rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            Max {maxGuests}
          </div>
        </div>
        
        {guestCount === maxGuests && (
          <div className="mt-2 text-xs text-amber-600">
            Maximum guest capacity reached
          </div>
        )}
      </CardContent>
    </Card>
  );
};
