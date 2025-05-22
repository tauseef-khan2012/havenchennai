
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bed, Image, MapPin, Home } from 'lucide-react';

const StayNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="bg-white border-b sticky top-16 z-10">
      <div className="container-custom py-2">
        <Tabs defaultValue={currentPath} className="w-full">
          <TabsList className="w-full justify-start bg-transparent p-0 overflow-x-auto flex-nowrap">
            <TabsTrigger 
              value="/stay" 
              className={`flex items-center gap-2 rounded-none border-b-2 px-4 py-2 whitespace-nowrap ${
                currentPath === '/stay' ? 'border-haven-green text-haven-green' : 'border-transparent'
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
              className={`flex items-center gap-2 rounded-none border-b-2 px-4 py-2 whitespace-nowrap ${
                currentPath === '/stay/amenities' ? 'border-haven-green text-haven-green' : 'border-transparent'
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
              className={`flex items-center gap-2 rounded-none border-b-2 px-4 py-2 whitespace-nowrap ${
                currentPath === '/stay/deck-views' ? 'border-haven-green text-haven-green' : 'border-transparent'
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
              className={`flex items-center gap-2 rounded-none border-b-2 px-4 py-2 whitespace-nowrap ${
                currentPath === '/stay/location' ? 'border-haven-green text-haven-green' : 'border-transparent'
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
