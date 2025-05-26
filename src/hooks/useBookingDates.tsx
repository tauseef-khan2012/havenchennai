
import { useState } from 'react';

export const useBookingDates = () => {
  const [selectedCheckIn, setSelectedCheckIn] = useState<Date | undefined>();
  const [selectedCheckOut, setSelectedCheckOut] = useState<Date | undefined>();

  const handleDateRangeSelect = (checkIn: Date, checkOut: Date) => {
    setSelectedCheckIn(checkIn);
    setSelectedCheckOut(checkOut);
  };

  return {
    selectedCheckIn,
    selectedCheckOut,
    handleDateRangeSelect
  };
};
