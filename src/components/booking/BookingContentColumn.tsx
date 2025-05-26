
import React from 'react';

interface BookingContentColumnProps {
  children: React.ReactNode;
}

export const BookingContentColumn: React.FC<BookingContentColumnProps> = ({ children }) => {
  return (
    <div className="space-y-8 lg:pb-8">
      {children}
    </div>
  );
};
