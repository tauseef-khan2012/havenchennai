
import React from 'react';

interface BookingPageGridProps {
  children: React.ReactNode;
}

export const BookingPageGrid: React.FC<BookingPageGridProps> = ({ children }) => {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 pt-24">
      <div className="space-y-8">
        {children}
      </div>
    </div>
  );
};
