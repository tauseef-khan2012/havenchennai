
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { addDays, isBefore, startOfDay } from 'date-fns';
import { checkPropertyAvailabilityDetailed } from '@/services/availabilityService';
import { UUID } from '@/types/booking';

interface CalendarDatePickerProps {
  selectedCheckIn?: Date;
  selectedCheckOut?: Date;
  onDateRangeSelect: (checkIn: Date, checkOut: Date) => void;
  propertyId: UUID;
}

export const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  selectedCheckIn,
  selectedCheckOut,
  onDateRangeSelect,
  propertyId
}) => {
  const [tempCheckIn, setTempCheckIn] = useState<Date | undefined>(selectedCheckIn);
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load availability data when component mounts
  useEffect(() => {
    const loadAvailability = async () => {
      if (!propertyId) return;
      
      setIsLoading(true);
      try {
        const startDate = new Date();
        const endDate = addDays(startDate, 90); // Load 3 months ahead
        const availability = await checkPropertyAvailabilityDetailed(propertyId, startDate, endDate);
        setAvailabilityData(availability || []);
      } catch (error) {
        console.error('Error loading availability:', error);
        setAvailabilityData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAvailability();
  }, [propertyId]);

  const isDateDisabled = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Disable past dates
    if (isBefore(date, startOfDay(new Date()))) {
      return true;
    }
    
    // If availability data is still loading or not available, don't disable dates
    if (!availabilityData || availabilityData.length === 0) {
      return false;
    }
    
    const availabilityInfo = availabilityData.find(info => info.date === dateStr);
    
    // Disable unavailable dates
    if (availabilityInfo && !availabilityInfo.isAvailable) {
      return true;
    }

    return false;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (!tempCheckIn || selectingCheckOut) {
      // Setting check-in date
      setTempCheckIn(date);
      setSelectingCheckOut(true);
    } else {
      // Setting check-out date
      if (date > tempCheckIn) {
        onDateRangeSelect(tempCheckIn, date);
        setSelectingCheckOut(false);
      } else {
        // If selected date is before check-in, reset and set as new check-in
        setTempCheckIn(date);
        setSelectingCheckOut(true);
      }
    }
  };

  const getDateModifiers = () => {
    const modifiers: any = {};
    
    // Unavailable dates
    modifiers.unavailable = (date: Date) => {
      if (!availabilityData || availabilityData.length === 0) return false;
      
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
      <div className="flex items-center justify-center p-8">
        <div className="text-haven-beige/60">Loading availability...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-haven-beige/80">
        {!tempCheckIn && "Select your check-in date"}
        {tempCheckIn && selectingCheckOut && "Now select your check-out date"}
        {selectedCheckIn && selectedCheckOut && "Dates selected successfully"}
      </div>
      
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
            backgroundColor: '#eab308', 
            color: '#1e293b' 
          }
        }}
        className="rounded-md border border-haven-yellow/20 bg-haven-navy-light/50 text-haven-beige [&_.rdp-head_cell]:text-haven-beige/70 [&_.rdp-button]:text-haven-beige hover:[&_.rdp-button:not([disabled])]:bg-haven-yellow/20"
      />
      
      {availabilityData.length === 0 && !isLoading && (
        <div className="text-xs text-haven-beige/60 text-center">
          Availability information is being loaded...
        </div>
      )}
    </div>
  );
};
