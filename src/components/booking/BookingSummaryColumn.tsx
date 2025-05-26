
import React from 'react';

interface BookingSummaryColumnProps {
  children: React.ReactNode;
}

export const BookingSummaryColumn: React.FC<BookingSummaryColumnProps> = ({ children }) => {
  return (
    <div className="hidden lg:block lg:sticky lg:top-24 lg:h-fit">
      {children}
    </div>
  );
};
