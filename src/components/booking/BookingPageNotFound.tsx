
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

interface BookingPageNotFoundProps {
  error?: string;
  onRetry?: () => void;
}

export const BookingPageNotFound: React.FC<BookingPageNotFoundProps> = ({ 
  error = "Property not found or not available for booking.",
  onRetry 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Booking Unavailable</h1>
          <p className="text-gray-600">{error}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button 
              onClick={onRetry}
              variant="outline"
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          
          <Button 
            onClick={() => navigate('/stay')}
            className="bg-haven-teal text-white hover:bg-opacity-90"
          >
            <Home className="h-4 w-4 mr-2" />
            View Property Details
          </Button>
        </div>
        
        <p className="text-sm text-gray-500">
          If you continue to experience issues, please contact our support team.
        </p>
      </div>
    </div>
  );
};
