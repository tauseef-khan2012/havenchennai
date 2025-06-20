
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { addDays, isBefore, startOfDay, isAfter, isSameDay } from 'date-fns';
import { checkPropertyAvailabilityDetailed } from '@/services/availabilityService';
import { UUID } from '@/types/booking';
import { X } from 'lucide-react';

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
  const [tempCheckOut, setTempCheckOut] = useState<Date | undefined>(selectedCheckOut);
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
        console.error('CalendarDatePicker - Error loading availability:', error);
        setAvailabilityData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAvailability();
  }, [propertyId]);

  // Reset temp state when external dates change
  useEffect(() => {
    console.log('CalendarDatePicker - External dates changed:', { selectedCheckIn, selectedCheckOut });
    setTempCheckIn(selectedCheckIn);
    setTempCheckOut(selectedCheckOut);
    if (selectedCheckIn && !selectedCheckOut) {
      setIsSelectingCheckOut(true);
    } else {
      setIsSelectingCheckOut(false);
    }
  }, [selectedCheckIn, selectedCheckOut]);

  const isDateDisabled = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Disable past dates
    if (isBefore(date, startOfDay(new Date()))) {
      return true;
    }
    
    // If availability data is not available, don't disable dates
    if (!availabilityData || availabilityData.length === 0) {
      return false;
    }
    
    const availabilityInfo = availabilityData.find(info => info.date === dateStr);
    return availabilityInfo && !availabilityInfo.isAvailable;
  };

  // Check if date is in selected range
  const isDateInRange = (date: Date): boolean => {
    if (!tempCheckIn || !tempCheckOut) return false;
    return isAfter(date, tempCheckIn) && isBefore(date, tempCheckOut);
  };

  // Check if date is start or end of range
  const isRangeStart = (date: Date): boolean => {
    return tempCheckIn ? isSameDay(date, tempCheckIn) : false;
  };

  const isRangeEnd = (date: Date): boolean => {
    return tempCheckOut ? isSameDay(date, tempCheckOut) : false;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    console.log('CalendarDatePicker - Date selected:', date, { tempCheckIn, isSelectingCheckOut });

    if (!tempCheckIn || !isSelectingCheckOut) {
      // First selection - set as check-in
      console.log('CalendarDatePicker - Setting check-in date:', date);
      setTempCheckIn(date);
      setTempCheckOut(undefined);
      setIsSelectingCheckOut(true);
    } else {
      // Second selection - set as check-out
      if (date > tempCheckIn) {
        console.log('CalendarDatePicker - Valid date range selected:', { checkIn: tempCheckIn, checkOut: date });
        setTempCheckOut(date);
        setIsSelectingCheckOut(false);
        onDateRangeSelect(tempCheckIn, date);
      } else {
        // If selected date is before check-in, reset and set as new check-in
        console.log('CalendarDatePicker - Selected date before check-in, resetting:', date);
        setTempCheckIn(date);
        setTempCheckOut(undefined);
        setIsSelectingCheckOut(true);
      }
    }
  };

  const clearSelection = () => {
    console.log('CalendarDatePicker - Clearing selection');
    setTempCheckIn(undefined);
    setTempCheckOut(undefined);
    setIsSelectingCheckOut(false);
    
    // Create a temporary future date for clearing - this will trigger the parent to reset
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    // Call parent with temporary dates, then immediately clear them
    // This ensures the parent state gets reset properly
    setTimeout(() => {
      // Reset parent state by navigating without date params
      const url = new URL(window.location.href);
      url.searchParams.delete('checkIn');
      url.searchParams.delete('checkOut');
      window.history.replaceState({}, '', url.toString());
      
      // Force page reload to reset state
      window.location.reload();
    }, 100);
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
      <div className="flex items-center justify-between">
        <div className="text-sm text-haven-beige/80">
          {!tempCheckIn && "Select your check-in date"}
          {tempCheckIn && isSelectingCheckOut && "Now select your check-out date"}
          {tempCheckIn && tempCheckOut && `${tempCheckIn.toLocaleDateString()} - ${tempCheckOut.toLocaleDateString()}`}
        </div>
        
        {(tempCheckIn || tempCheckOut) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="text-haven-yellow hover:text-haven-yellow/80 p-1 h-auto"
          >
            <X className="h-4 w-4" />
            <span className="ml-1 text-xs">Clear</span>
          </Button>
        )}
      </div>
      
      {(tempCheckIn && isSelectingCheckOut) && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-haven-beige/60">Check-in: {tempCheckIn.toLocaleDateString()}</span>
        </div>
      )}
      
      <Calendar
        mode="single"
        selected={tempCheckOut || tempCheckIn}
        onSelect={handleDateSelect}
        disabled={isDateDisabled}
        className="rounded-xl border border-haven-yellow/20 bg-haven-navy-light/50 text-haven-beige pointer-events-auto"
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center text-haven-beige",
          caption_label: "text-sm font-medium text-haven-beige",
          nav: "space-x-1 flex items-center",
          nav_button: "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 text-haven-beige border border-haven-yellow/30 hover:bg-haven-yellow/20",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-haven-beige/70 rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
          day: "h-9 w-9 p-0 font-normal text-haven-beige hover:bg-haven-yellow/20 hover:text-haven-yellow rounded-md transition-colors",
          day_range_end: "bg-haven-yellow text-haven-navy-dark font-medium rounded-r-md",
          day_selected: "bg-haven-yellow text-haven-navy-dark hover:bg-haven-yellow hover:text-haven-navy-dark focus:bg-haven-yellow focus:text-haven-navy-dark font-medium",
          day_today: "bg-haven-yellow/30 text-haven-beige font-medium",
          day_outside: "text-haven-beige/30 opacity-50",
          day_disabled: "text-haven-beige/30 opacity-30 line-through",
          day_range_middle: "bg-haven-yellow/20 text-haven-beige rounded-none",
          day_hidden: "invisible",
        }}
        modifiers={{
          range_start: tempCheckIn ? [tempCheckIn] : [],
          range_end: tempCheckOut ? [tempCheckOut] : [],
          range_middle: tempCheckIn && tempCheckOut ? (date) => isDateInRange(date) : () => false,
        }}
        modifiersClassNames={{
          range_start: "bg-haven-yellow text-haven-navy-dark font-medium rounded-l-md",
          range_end: "bg-haven-yellow text-haven-navy-dark font-medium rounded-r-md",
          range_middle: "bg-haven-yellow/20 text-haven-beige rounded-none",
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
