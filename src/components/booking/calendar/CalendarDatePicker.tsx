
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
  const [pendingCheckIn, setPendingCheckIn] = useState<Date | undefined>(selectedCheckIn);
  const [isSelectingCheckOut, setIsSelectingCheckOut] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load availability data when component mounts
  useEffect(() => {
    const loadAvailability = async () => {
      if (!propertyId) return;
      
      setIsLoading(true);
      try {
        const startDate = new Date();
        const endDate = addDays(startDate, 90);
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

    console.log('Calendar - Date selected:', date, { pendingCheckIn, isSelectingCheckOut });

    if (!pendingCheckIn || !isSelectingCheckOut) {
      // First selection - set as check-in
      console.log('Calendar - Setting check-in date:', date);
      setPendingCheckIn(date);
      setIsSelectingCheckOut(true);
    } else {
      // Second selection - set as check-out
      if (date > pendingCheckIn) {
        console.log('Calendar - Setting check-out date and calling onDateRangeSelect:', { checkIn: pendingCheckIn, checkOut: date });
        onDateRangeSelect(pendingCheckIn, date);
        setIsSelectingCheckOut(false);
      } else {
        // If selected date is before check-in, reset and set as new check-in
        console.log('Calendar - Selected date before check-in, resetting:', date);
        setPendingCheckIn(date);
        setIsSelectingCheckOut(true);
      }
    }
  };

  const clearSelection = () => {
    setPendingCheckIn(undefined);
    setIsSelectingCheckOut(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-haven-yellow"></div>
        <span className="ml-2 text-haven-beige/60">Loading availability...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-haven-beige/80">
        {!pendingCheckIn && "Select your check-in date"}
        {pendingCheckIn && isSelectingCheckOut && "Now select your check-out date"}
        {selectedCheckIn && selectedCheckOut && `${selectedCheckIn.toLocaleDateString()} - ${selectedCheckOut.toLocaleDateString()}`}
      </div>
      
      {(pendingCheckIn && isSelectingCheckOut) && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-haven-beige/60">Check-in: {pendingCheckIn.toLocaleDateString()}</span>
          <button 
            onClick={clearSelection}
            className="text-xs text-haven-yellow hover:underline"
          >
            Clear
          </button>
        </div>
      )}
      
      <Calendar
        mode="single"
        selected={pendingCheckIn}
        onSelect={handleDateSelect}
        disabled={isDateDisabled}
        className="rounded-xl border border-haven-yellow/20 bg-haven-navy-light/50 text-haven-beige [&_.rdp-head_cell]:text-haven-beige/70 [&_.rdp-button]:text-haven-beige hover:[&_.rdp-button:not([disabled])]:bg-haven-yellow/20 [&_.rdp-day_selected]:bg-haven-yellow [&_.rdp-day_selected]:text-haven-navy-dark pointer-events-auto"
        modifiersStyles={{
          disabled: { 
            backgroundColor: '#fee2e2', 
            color: '#dc2626',
            textDecoration: 'line-through'
          },
          selected: { 
            backgroundColor: '#eab308', 
            color: '#1e293b' 
          }
        }}
      />
      
      {availabilityData.length === 0 && !isLoading && (
        <div className="text-xs text-haven-beige/60 text-center">
          Availability information is being loaded...
        </div>
      )}
    </div>
  );
};
