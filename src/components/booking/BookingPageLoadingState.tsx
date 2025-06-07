
import React from 'react';

export const BookingPageLoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-haven-teal mx-auto"></div>
        <h2 className="text-xl font-semibold text-gray-700">Loading booking details...</h2>
        <p className="text-gray-500">Please wait while we prepare your booking experience</p>
      </div>
    </div>
  );
};
