
import NavLink from "./NavLink";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import UserProfileDropdown from "./UserProfileDropdown";

interface MobileNavLinksProps {
  isOpen: boolean;
  isActive: (path: string) => boolean;
  user: any;
}

const MobileNavLinks = ({ isOpen, isActive, user }: MobileNavLinksProps) => {
  // Use consistent property ID for Haven
  const havenPropertyId = "550e8400-e29b-41d4-a716-446655440000";

  if (!isOpen) return null;
  
  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md py-4 px-4">
      <nav className="flex flex-col space-y-4">
        <NavLink
          to="/stay"
          isActive={isActive("/stay")}
          className="p-2"
        >
          The Stay
        </NavLink>
        <NavLink
          to="/experiences"
          isActive={isActive("/experiences")}
          className="p-2"
        >
          Experiences
        </NavLink>
        <NavLink
          to="/location"
          isActive={isActive("/location")}
          className="p-2"
        >
          Location
        </NavLink>
        <NavLink
          to="/gallery"
          isActive={isActive("/gallery")}
          className="p-2"
        >
          Gallery
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
