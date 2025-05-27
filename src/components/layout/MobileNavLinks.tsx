
import NavLink from "./NavLink";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import UserProfileDropdown from "./UserProfileDropdown";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

interface MobileNavLinksProps {
  isOpen: boolean;
  isActive: (path: string) => boolean;
  user: any;
}

const MobileNavLinks = ({ isOpen, isActive, user }: MobileNavLinksProps) => {
  const [isStayMenuOpen, setIsStayMenuOpen] = useState(false);
  
  // Use consistent property ID for Haven
  const havenPropertyId = "550e8400-e29b-41d4-a716-446655440000";

  if (!isOpen) return null;

  const stayPages = [
    { to: "/stay", label: "Overview" },
    { to: "/stay/amenities", label: "Amenities" },
    { to: "/stay/deck-views", label: "Deck Views" },
    { to: "/stay/location", label: "Location" }
  ];
  
  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md py-4 px-4">
      <nav className="flex flex-col space-y-4">
        <div>
          <button
            onClick={() => setIsStayMenuOpen(!isStayMenuOpen)}
            className="flex items-center justify-between w-full p-2 text-left hover:text-haven-teal transition-colors"
          >
            <span>The Stay</span>
            <ChevronRight className={`h-4 w-4 transition-transform ${isStayMenuOpen ? 'rotate-90' : ''}`} />
          </button>
          {isStayMenuOpen && (
            <div className="ml-4 mt-2 space-y-2">
              {stayPages.map((page) => (
                <NavLink
                  key={page.to}
                  to={page.to}
                  isActive={isActive(page.to)}
                  className="block p-2 text-sm"
                >
                  {page.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
        
        <NavLink
          to="/experiences"
          isActive={isActive("/experiences")}
          className="p-2"
        >
          Experiences
        </NavLink>
        <NavLink
          to="/gallery"
          isActive={isActive("/gallery")}
          className="p-2"
        >
          Gallery
        </NavLink>
        <NavLink
          to="/blog"
          isActive={isActive("/blog")}
          className="p-2"
        >
          Journal
        </NavLink>
        <NavLink
          to="/about"
          isActive={isActive("/about")}
          className="p-2"
        >
          About Us
        </NavLink>
        
        <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
          {user ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Welcome back!</span>
              <UserProfileDropdown user={user} />
            </div>
          ) : (
            <Link to="/login" className="w-full">
              <Button variant="outline" className="w-full border-haven-teal text-haven-teal">
                Login
              </Button>
            </Link>
          )}
          
          <Link to={`/booking?propertyId=${havenPropertyId}`} className="w-full">
            <Button className="w-full bg-haven-teal hover:bg-haven-teal/90">
              Book Now
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default MobileNavLinks;
