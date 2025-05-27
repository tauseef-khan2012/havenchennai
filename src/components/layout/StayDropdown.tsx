
import React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Home, Bed, Image, MapPin } from 'lucide-react';

interface StayDropdownProps {
  isActive: (path: string) => boolean;
}

const StayDropdown = ({ isActive }: StayDropdownProps) => {
  const stayPages = [
    { 
      to: "/stay", 
      label: "Overview", 
      icon: Home,
      description: "General information about our container home"
    },
    { 
      to: "/stay/amenities", 
      label: "Amenities", 
      icon: Bed,
      description: "Luxury amenities and facilities"
    },
    { 
      to: "/stay/deck-views", 
      label: "Deck Views", 
      icon: Image,
      description: "Stunning deck views and outdoor spaces"
    },
    { 
      to: "/stay/location", 
      label: "Location", 
      icon: MapPin,
      description: "Property location and nearby attractions"
    }
  ];

  const isStayActive = stayPages.some(page => isActive(page.to));

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className={`${isStayActive ? 'text-haven-teal' : 'text-gray-700'} font-medium hover:text-haven-teal/70 transition-colors`}
          >
            The Stay
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {stayPages.map((page) => {
                const Icon = page.icon;
                return (
                  <NavigationMenuLink key={page.to} asChild>
                    <Link
                      to={page.to}
                      className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                        isActive(page.to) ? 'bg-accent text-accent-foreground' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium leading-none">
                        <Icon className="h-4 w-4" />
                        {page.label}
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {page.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                );
              })}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default StayDropdown;
