
import NavLink from "./NavLink";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import UserProfileDropdown from "./UserProfileDropdown";

interface DesktopNavLinksProps {
  isActive: (path: string) => boolean;
  user: any;
}

const DesktopNavLinks = ({ isActive, user }: DesktopNavLinksProps) => {
  // Use consistent property ID for Haven
  const havenPropertyId = "550e8400-e29b-41d4-a716-446655440000";

  return (
    <nav className="flex items-center gap-8">
      <div className="flex items-center gap-8">
        <NavLink to="/stay" isActive={isActive("/stay")}>
          The Stay
        </NavLink>
        <NavLink to="/experiences" isActive={isActive("/experiences")}>
          Experiences
        </NavLink>
        <NavLink to="/location" isActive={isActive("/location")}>
          Location
        </NavLink>
        <NavLink to="/gallery" isActive={isActive("/gallery")}>
          Gallery
        </NavLink>
        <NavLink to="/about" isActive={isActive("/about")}>
          About Us
        </NavLink>
        <NavLink to="/contact" isActive={isActive("/contact")}>
          Contact
        </NavLink>
      </div>
      
      <div className="flex items-center gap-4 ml-4">
        {user ? (
          <UserProfileDropdown user={user} />
        ) : (
          <Link to="/login">
            <Button variant="outline" className="border-haven-teal text-haven-teal font-medium min-h-[44px] px-5">
              Login
            </Button>
          </Link>
        )}
        
        <Link to={`/booking?propertyId=${havenPropertyId}`}>
          <Button className="bg-haven-teal hover:bg-haven-teal/90 font-medium min-h-[44px] px-5">
            Book Now
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default DesktopNavLinks;
