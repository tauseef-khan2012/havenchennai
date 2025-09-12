import React from 'react';
import { DatePicker } from '@/components/ui/date-picker';
import { calculateNights } from '@/utils/bookingUtils';
import { UUID } from '@/types/booking';
import { addDays, isBefore, isToday } from 'date-fns';

interface DualDatePickerProps {
  selectedCheckIn?: Date;
  selectedCheckOut?: Date;
  onDateRangeSelect: (checkIn: Date, checkOut: Date) => void;
  propertyId: UUID;
}

export const DualDatePicker: React.FC<DualDatePickerProps> = ({
  selectedCheckIn,
  selectedCheckOut,
  onDateRangeSelect,
  propertyId
}) => {
  const handleCheckInChange = (date: Date | undefined) => {
    if (date) {
      // If checkout is before or same as new checkin, clear it
      if (selectedCheckOut && (isBefore(selectedCheckOut, date) || selectedCheckOut.getTime() === date.getTime())) {
        // Auto-set checkout to next day
        const nextDay = addDays(date, 1);
        onDateRangeSelect(date, nextDay);
      } else if (selectedCheckOut) {
        onDateRangeSelect(date, selectedCheckOut);
      }
    }
  };

  const handleCheckOutChange = (date: Date | undefined) => {
    if (date && selectedCheckIn) {
      onDateRangeSelect(selectedCheckIn, date);
    }
  };

  const disablePastDates = (date: Date) => {
    return isBefore(date, new Date()) && !isToday(date);
  };

  const disableCheckoutDates = (date: Date) => {
    if (!selectedCheckIn) return true;
    return isBefore(date, selectedCheckIn) || date.getTime() === selectedCheckIn.getTime();
  };

  const nights = selectedCheckIn && selectedCheckOut ? 
    calculateNights(selectedCheckIn, selectedCheckOut) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Check-in Date Picker */}
        <div>
          <label className="block text-sm font-medium text-haven-beige mb-2">
            Check-in
          </label>
          <DatePicker
            date={selectedCheckIn}
            onDateChange={handleCheckInChange}
            disabled={disablePastDates}
            id="checkin-date"
            className="w-full"
          />
        </div>

        {/* Check-out Date Picker */}
        <div>
          <label className="block text-sm font-medium text-haven-beige mb-2">
            Check-out
          </label>
          <DatePicker
            date={selectedCheckOut}
            onDateChange={handleCheckOutChange}
            disabled={disableCheckoutDates}
            id="checkout-date"
            className="w-full"
          />
        </div>
      </div>

      {/* Night Count Display */}
      {nights > 0 && (
        <div className="text-center py-3 px-4 bg-haven-yellow/10 rounded-lg border border-haven-yellow/20">
          <span className="text-haven-beige">
            {nights} {nights === 1 ? 'night' : 'nights'}
          </span>
        </div>
      )}
    </div>
  );
};