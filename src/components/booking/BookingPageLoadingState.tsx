
import React from 'react';
import { BookingPageLayout } from './BookingPageLayout';

export const BookingPageLoadingState: React.FC = () => {
  return (
    <BookingPageLayout>
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="aspect-[16/10] bg-gray-200 rounded-xl"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </BookingPageLayout>
  );
};
