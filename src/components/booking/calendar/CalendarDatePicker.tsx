
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { addDays, format, isBefore } from 'date-fns';
import { AvailabilityInfo } from '@/services/availabilityService';

interface CalendarDatePickerProps {
  availabilityData: AvailabilityInfo[];
  tempCheckIn?: Date;
  selectedCheckIn?: Date;
  selectedCheckOut?: Date;
  selectingCheckOut: boolean;
  onDateSelect: (date: Date | undefined) => void;
}

export const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  availabilityData,
  tempCheckIn,
  selectedCheckIn,
  selectedCheckOut,
  selectingCheckOut,
  onDateSelect
}) => {
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

  return (
    <Calendar
      mode="single"
      selected={tempCheckIn}
      onSelect={onDateSelect}
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
  );
};
