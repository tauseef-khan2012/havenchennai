
import React from 'react';
import { Users } from 'lucide-react';

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
  return (
    <div className="mt-4">
      <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
        <Users className="h-4 w-4" />
        Guests
      </label>
      <select
        value={guestCount}
        onChange={(e) => setGuestCount(parseInt(e.target.value))}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-haven-teal focus:ring-2 focus:ring-haven-teal focus:ring-opacity-20 transition-all"
      >
        {Array.from({ length: maxGuests }, (_, i) => i + 1).map(num => (
          <option key={num} value={num}>
            {num} {num === 1 ? 'Guest' : 'Guests'}
          </option>
        ))}
      </select>
    </div>
  );
};
