
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
        selectingCheckOut={selectingCheckOut}
        onClearSelection={clearSelection}
      />
      
      <CalendarDatePicker
        availabilityData={availabilityData}
        tempCheckIn={tempCheckIn}
        selectedCheckIn={selectedCheckIn}
        selectedCheckOut={selectedCheckOut}
        selectingCheckOut={selectingCheckOut}
        onDateSelect={handleDateSelect}
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
