
import React from 'react';

interface BookingPageGridProps {
  children: React.ReactNode;
}

export const BookingPageGrid: React.FC<BookingPageGridProps> = ({ children }) => {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 pt-24">
      <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-8 lg:items-start">
        {children}
      </div>
    </div>
  );
};
