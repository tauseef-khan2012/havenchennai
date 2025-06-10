
import React from 'react';
import { Users, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GuestSelectorProps {
  guestCount: number;
  setGuestCount: (count: number) => void;
  maxGuests: number;
}

export const GuestSelector: React.FC<GuestSelectorProps> = ({
  guestCount,
  setGuestCount,
  maxGuests
}) => {
  const handleIncrement = () => {
    if (guestCount < maxGuests) {
      console.log('GuestSelector - Incrementing guest count from', guestCount, 'to', guestCount + 1);
      setGuestCount(guestCount + 1);
    }
  };

  const handleDecrement = () => {
    if (guestCount > 1) {
      console.log('GuestSelector - Decrementing guest count from', guestCount, 'to', guestCount - 1);
      setGuestCount(guestCount - 1);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-haven-beige flex items-center gap-2">
        <Users className="h-4 w-4 text-haven-yellow" />
        Guests
      </label>
      
      <div className="flex items-center justify-between p-4 bg-haven-navy-light/30 rounded-xl border border-haven-yellow/10">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecrement}
            disabled={guestCount <= 1}
            className="h-8 w-8 p-0 rounded-full border-haven-yellow/30 bg-transparent text-haven-beige hover:bg-haven-yellow/20 hover:text-haven-yellow disabled:opacity-50"
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <div className="text-center min-w-[60px]">
            <div className="text-lg font-semibold text-haven-beige">{guestCount}</div>
            <div className="text-xs text-haven-beige/60">
              {guestCount === 1 ? 'Guest' : 'Guests'}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleIncrement}
            disabled={guestCount >= maxGuests}
            className="h-8 w-8 p-0 rounded-full border-haven-yellow/30 bg-transparent text-haven-beige hover:bg-haven-yellow/20 hover:text-haven-yellow disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-sm text-haven-beige/60">
          Max {maxGuests}
        </div>
      </div>
      
      {guestCount === maxGuests && (
        <div className="text-xs text-haven-yellow/80">
          Maximum guest capacity reached
        </div>
      )}
    </div>
  );
};
