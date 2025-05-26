
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, AlertCircle, Users } from 'lucide-react';
import { UUID } from '@/types/booking';
import { checkPropertyAvailabilityDetailed, AvailabilityInfo, isDateRangeAvailable } from '@/services/availabilityService';
import { addDays, format, isBefore, isAfter } from 'date-fns';

interface AvailabilityCalendarProps {
  propertyId: UUID;
  onDateRangeSelect: (checkIn: Date, checkOut: Date) => void;
  selectedCheckIn?: Date;
  selectedCheckOut?: Date;
  guestCount: number;
  setGuestCount: (count: number) => void;
  maxGuests: number;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  propertyId,
  onDateRangeSelect,
  selectedCheckIn,
  selectedCheckOut,
  guestCount,
  setGuestCount,
  maxGuests
}) => {
  const [availabilityData, setAvailabilityData] = useState<AvailabilityInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);
  const [tempCheckIn, setTempCheckIn] = useState<Date | undefined>(selectedCheckIn);

  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true);
      try {
        const startDate = new Date();
        const endDate = addDays(new Date(), 365); // Load next year
        
        const availability = await checkPropertyAvailabilityDetailed(
          propertyId,
          startDate,
          endDate
        );
        
        setAvailabilityData(availability);
      } catch (error) {
        console.error('Error fetching availability:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyId) {
      fetchAvailability();
    }
  }, [propertyId]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (!selectingCheckOut && !tempCheckIn) {
      // Selecting check-in date
      setTempCheckIn(date);
      setSelectingCheckOut(true);
    } else if (selectingCheckOut && tempCheckIn) {
      // Selecting check-out date
      if (isBefore(date, tempCheckIn)) {
        // If selected date is before check-in, restart selection
        setTempCheckIn(date);
        setSelectingCheckOut(true);
      } else {
        // Valid check-out selection
        const { isAvailable } = isDateRangeAvailable(availabilityData, tempCheckIn, date);
        
        if (isAvailable) {
          onDateRangeSelect(tempCheckIn, date);
          setSelectingCheckOut(false);
        } else {
          // Show error or restart selection
          setTempCheckIn(date);
          setSelectingCheckOut(true);
        }
      }
    } else {
      // Reset and start new selection
      setTempCheckIn(date);
      setSelectingCheckOut(true);
    }
  };

  const clearSelection = () => {
    setTempCheckIn(undefined);
    setSelectingCheckOut(false);
  };

  const isDateDisabled = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    const availabilityInfo = availabilityData.find(info => info.date === dateStr);
    
    // Disable past dates
    if (isBefore(date, new Date())) {
      return true;
    }
    
    // Disable unavailable dates
    if (availabilityInfo && !availabilityInfo.isAvailable) {
      return true;
    }

    return false;
  };

  const getDateModifiers = () => {
    const modifiers: any = {};
    
    // Unavailable dates
    modifiers.unavailable = (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      const availabilityInfo = availabilityData.find(info => info.date === dateStr);
      return availabilityInfo && !availabilityInfo.isAvailable;
    };

    // Selected range
    if (selectedCheckIn && selectedCheckOut) {
      modifiers.selected = (date: Date) => {
        return date >= selectedCheckIn && date <= selectedCheckOut;
      };
    } else if (tempCheckIn && selectingCheckOut) {
      modifiers.selected = tempCheckIn;
    }

    return modifiers;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-haven-teal"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectingCheckOut && tempCheckIn && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          Check-in: {format(tempCheckIn, 'MMM dd')} - Now select check-out date
        </div>
      )}
      
      <Calendar
        mode="single"
        selected={tempCheckIn}
        onSelect={handleDateSelect}
        disabled={isDateDisabled}
        modifiers={getDateModifiers()}
        modifiersStyles={{
          unavailable: { 
            backgroundColor: '#fee2e2', 
            color: '#dc2626',
            textDecoration: 'line-through'
          },
          selected: { 
            backgroundColor: '#0891b2', 
            color: 'white' 
          }
        }}
        className="rounded-md border"
      />
      
      {/* Guest Selection */}
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
      
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-200 border border-green-400 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-200 border border-red-400 rounded"></div>
          <span>Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-haven-teal rounded"></div>
          <span>Selected</span>
        </div>
      </div>

      {(tempCheckIn || selectedCheckIn) && (
        <div className="flex gap-2">
          <Button onClick={clearSelection} variant="outline" size="sm">
            Clear Selection
          </Button>
        </div>
      )}

      {selectedCheckIn && selectedCheckOut && (
        <div className="p-3 bg-haven-teal/10 rounded-lg">
          <div className="text-sm font-medium text-haven-teal">
            Selected Dates
          </div>
          <div className="text-sm text-gray-600">
            {format(selectedCheckIn, 'MMM dd, yyyy')} - {format(selectedCheckOut, 'MMM dd, yyyy')}
          </div>
          <div className="text-sm text-gray-500">
            {Math.ceil((selectedCheckOut.getTime() - selectedCheckIn.getTime()) / (1000 * 60 * 60 * 24))} nights
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
