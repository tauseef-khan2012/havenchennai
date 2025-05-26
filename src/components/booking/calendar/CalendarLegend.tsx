
import React from 'react';

export const CalendarLegend: React.FC = () => {
  return (
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
  );
};
