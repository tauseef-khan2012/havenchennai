
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookingPageLayout } from './BookingPageLayout';

export const BookingPageNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <BookingPageLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-8">The property you're looking for could not be found.</p>
          <Button onClick={() => navigate('/stay')}>
            Browse Properties
          </Button>
        </div>
      </div>
    </BookingPageLayout>
  );
};
