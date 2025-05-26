
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface DateSelectionStatusProps {
  tempCheckIn?: Date;
  selectedCheckIn?: Date;
  selectedCheckOut?: Date;
  selectingCheckOut: boolean;
  onClearSelection: () => void;
}

export const DateSelectionStatus: React.FC<DateSelectionStatusProps> = ({
  tempCheckIn,
  selectedCheckIn,
  selectedCheckOut,
  selectingCheckOut,
  onClearSelection
}) => {
  return (
    <>
      {selectingCheckOut && tempCheckIn && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          Check-in: {format(tempCheckIn, 'MMM dd')} - Now select check-out date
        </div>
      )}

      {(tempCheckIn || selectedCheckIn) && (
        <div className="flex gap-2">
          <Button onClick={onClearSelection} variant="outline" size="sm">
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
    </>
  );
};
