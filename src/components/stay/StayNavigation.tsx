
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bed, Image, MapPin, Home } from 'lucide-react';

const StayNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [scrolled, setScrolled] = useState(false);
  
  // Add scroll listener to change navigation appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`sticky top-0 z-10 bg-white border-b transition-all duration-300 ${
      scrolled ? 'bg-opacity-95 backdrop-blur-sm shadow-sm' : 'bg-opacity-100'
    }`}>
      <div className="container-custom py-2">
        <Tabs defaultValue={currentPath} className="w-full">
          <TabsList className="w-full justify-start bg-transparent p-0 overflow-x-auto flex-nowrap">
            <TabsTrigger 
              value="/stay" 
              className={`flex items-center gap-2 rounded-none border-b-2 px-4 py-2 whitespace-nowrap transition-colors ${
                currentPath === '/stay' ? 'border-haven-green text-haven-green' : 'border-transparent hover:text-haven-green/70'
              }`}
              asChild
            >
              <Link to="/stay">
                <Home className="h-4 w-4" />
                <span>Overview</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger 
              value="/stay/amenities" 
              className={`flex items-center gap-2 rounded-none border-b-2 px-4 py-2 whitespace-nowrap transition-colors ${
                currentPath === '/stay/amenities' ? 'border-haven-green text-haven-green' : 'border-transparent hover:text-haven-green/70'
              }`}
              asChild
            >
              <Link to="/stay/amenities">
                <Bed className="h-4 w-4" />
                <span>Amenities</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger 
              value="/stay/deck-views" 
              className={`flex items-center gap-2 rounded-none border-b-2 px-4 py-2 whitespace-nowrap transition-colors ${
                currentPath === '/stay/deck-views' ? 'border-haven-green text-haven-green' : 'border-transparent hover:text-haven-green/70'
              }`}
              asChild
            >
              <Link to="/stay/deck-views">
                <Image className="h-4 w-4" />
                <span>Deck Views</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger 
              value="/stay/location" 
              className={`flex items-center gap-2 rounded-none border-b-2 px-4 py-2 whitespace-nowrap transition-colors ${
                currentPath === '/stay/location' ? 'border-haven-green text-haven-green' : 'border-transparent hover:text-haven-green/70'
              }`}
              asChild
            >
              <Link to="/stay/location">
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default StayNavigation;
