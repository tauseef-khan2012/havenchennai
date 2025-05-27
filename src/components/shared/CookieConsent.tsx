
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookie-consent');
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              We use cookies to enhance your experience on our website. By continuing to browse, you agree to our use of cookies. 
              <Link to="/privacy-policy" className="text-haven-teal hover:underline ml-1">
                Learn more in our Privacy Policy
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDecline}
              className="text-sm"
            >
              Decline
            </Button>
            <Button 
              size="sm" 
              onClick={handleAccept}
              className="bg-haven-teal hover:bg-haven-teal/90 text-sm"
            >
              Accept
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDecline}
              className="p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
