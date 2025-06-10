
import React, { useState, useEffect } from 'react';
import { UUID } from '@/types/booking';
import { checkPropertyAvailabilityDetailed, AvailabilityInfo, isDateRangeAvailable } from '@/services/availabilityService';
import { addDays, isBefore } from 'date-fns';
import { CalendarDatePicker } from './calendar/CalendarDatePicker';
import { GuestSelector } from './calendar/GuestSelector';
import { CalendarLegend } from './calendar/CalendarLegend';
import { DateSelectionStatus } from './calendar/DateSelectionStatus';

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
  const [isLoading, setIsLoading] = useState(true);
  const [tempCheckIn, setTempCheckIn] = useState<Date | undefined>(selectedCheckIn);

  useEffect(() => {
    // Set loading to false since CalendarDatePicker handles its own loading
    setIsLoading(false);
  }, [propertyId]);

  const clearSelection = () => {
    setTempCheckIn(undefined);
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
      <DateSelectionStatus
        tempCheckIn={tempCheckIn}
        selectedCheckIn={selectedCheckIn}
        selectedCheckOut={selectedCheckOut}
        selectingCheckOut={false}
        onClearSelection={clearSelection}
      />
      
      <CalendarDatePicker
        selectedCheckIn={selectedCheckIn}
        selectedCheckOut={selectedCheckOut}
        onDateRangeSelect={onDateRangeSelect}
        propertyId={propertyId}
      />
      
      <GuestSelector
        guestCount={guestCount}
        setGuestCount={setGuestCount}
        maxGuests={maxGuests}
      />
      
      <CalendarLegend />
    </div>
  );
};

export default AvailabilityCalendar;
